const { ClientSecretCredential } = require("@azure/identity");
const nodeFetch = require("node-fetch");

const defaultCourses = require("./defaultCourses");

const sharePointRootFolder = process.env.SHAREPOINT_ROOT_FOLDER || "learninghub";
const sharePointLibraryName = process.env.SP_LIBRARY_NAME || "Documents";
const catalogBlobName = `${sharePointRootFolder}/catalog/courses.json`;

let cachedToken;
let cachedTokenExpiresOn;
let cachedSiteId;
let cachedDriveId;

function getSiteUrl() {
  const siteUrl = process.env.SP_SITE_URL;
  if (!siteUrl) {
    throw new Error("SP_SITE_URL setting is missing.");
  }
  return siteUrl.replace(/\/$/, "");
}

function getTokenCredential() {
  const tenantId = process.env.STORAGE_TENANT_ID;
  const clientId = process.env.STORAGE_CLIENT_ID;
  const clientSecret = process.env.STORAGE_CLIENT_SECRET;

  if (tenantId && clientId && clientSecret) {
    return new ClientSecretCredential(tenantId, clientId, clientSecret);
  }

  throw new Error("Set STORAGE_TENANT_ID, STORAGE_CLIENT_ID, and STORAGE_CLIENT_SECRET for SharePoint Graph access.");
}

async function getGraphAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedTokenExpiresOn && cachedTokenExpiresOn - now > 60 * 1000) {
    return cachedToken;
  }

  const credential = getTokenCredential();
  const tokenResponse = await credential.getToken("https://graph.microsoft.com/.default");
  if (!tokenResponse || !tokenResponse.token) {
    throw new Error("Unable to acquire Microsoft Graph access token.");
  }

  cachedToken = tokenResponse.token;
  cachedTokenExpiresOn = tokenResponse.expiresOnTimestamp || now + 5 * 60 * 1000;
  return cachedToken;
}

async function graphRequest(path, options = {}) {
  const request = typeof fetch === "function" ? fetch : nodeFetch;
  const token = await getGraphAccessToken();
  const response = await request(`https://graph.microsoft.com/v1.0${path}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    },
    body: options.body
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(body || response.statusText);
    error.statusCode = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function parseSiteUrl() {
  const url = new URL(getSiteUrl());
  return {
    hostname: url.hostname,
    path: url.pathname
  };
}

async function getSiteId() {
  if (cachedSiteId) {
    return cachedSiteId;
  }

  if (process.env.SP_SITE_ID) {
    cachedSiteId = process.env.SP_SITE_ID;
    return cachedSiteId;
  }

  const { hostname, path } = parseSiteUrl();
  const site = await graphRequest(`/sites/${hostname}:${path}`);
  cachedSiteId = site.id;
  return cachedSiteId;
}

async function getDriveId() {
  if (cachedDriveId) {
    return cachedDriveId;
  }

  if (process.env.SP_DRIVE_ID) {
    cachedDriveId = process.env.SP_DRIVE_ID;
    return cachedDriveId;
  }

  const siteId = await getSiteId();
  const drives = await graphRequest(`/sites/${siteId}/drives`);
  const matchingDrive = (drives.value || []).find(drive => drive.name === sharePointLibraryName);
  if (!matchingDrive) {
    throw new Error(`SharePoint library '${sharePointLibraryName}' not found. Set SP_DRIVE_ID or SP_LIBRARY_NAME.`);
  }

  cachedDriveId = matchingDrive.id;
  return cachedDriveId;
}

async function ensureFolder(folderPath) {
  const cleanPath = (folderPath || "").replace(/^\/+|\/+$/g, "");
  if (!cleanPath) {
    return;
  }

  const siteId = await getSiteId();
  const driveId = await getDriveId();
  const segments = cleanPath.split("/").filter(Boolean);
  let currentPath = "";

  for (const segment of segments) {
    currentPath = currentPath ? `${currentPath}/${segment}` : segment;
    try {
      await graphRequest(`/sites/${siteId}/drives/${driveId}/root:/${encodeURIComponent(currentPath).replace(/%2F/g, "/")}`);
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error;
      }
      const parentPath = currentPath.includes("/") ? currentPath.slice(0, currentPath.lastIndexOf("/")) : "";
      const childrenEndpoint = parentPath
        ? `/sites/${siteId}/drives/${driveId}/root:/${encodeURIComponent(parentPath).replace(/%2F/g, "/")}:/children`
        : `/sites/${siteId}/drives/${driveId}/root/children`;
      await graphRequest(childrenEndpoint, {
        method: "POST",
        body: JSON.stringify({
          name: segment,
          folder: {},
          "@microsoft.graph.conflictBehavior": "replace"
        })
      });
    }
  }
}

function toDrivePath(pathValue) {
  return encodeURIComponent(pathValue).replace(/%2F/g, "/");
}

async function readJson(blobName, fallbackValue) {
  const siteId = await getSiteId();
  const driveId = await getDriveId();

  try {
    const content = await graphRequest(`/sites/${siteId}/drives/${driveId}/root:/${toDrivePath(blobName)}:/content`);
    return JSON.parse(content);
  } catch (error) {
    if (error.statusCode === 404) {
      return fallbackValue;
    }
    throw error;
  }
}

async function writeJson(blobName, payload) {
  const siteId = await getSiteId();
  const driveId = await getDriveId();
  const folderPath = blobName.includes("/") ? blobName.slice(0, blobName.lastIndexOf("/")) : "";
  await ensureFolder(folderPath);

  const body = JSON.stringify(payload, null, 2);
  await graphRequest(`/sites/${siteId}/drives/${driveId}/root:/${toDrivePath(blobName)}:/content`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body
  });
}

async function getCourses() {
  const courses = await readJson(catalogBlobName, defaultCourses);
  return Array.isArray(courses) ? courses : defaultCourses;
}

async function saveCourses(courses) {
  await writeJson(catalogBlobName, courses);
  return courses;
}

async function getEnrollments(userKey) {
  const blobName = `${sharePointRootFolder}/enrollments/${userKey}.json`;
  const payload = await readJson(blobName, { courseIds: [] });
  return Array.isArray(payload.courseIds) ? payload.courseIds : [];
}

async function saveEnrollments(userKey, courseIds) {
  const blobName = `${sharePointRootFolder}/enrollments/${userKey}.json`;
  await writeJson(blobName, { courseIds });
}

async function createUploadUrl({ courseId, resourceType, fileName, contentType }) {
  const siteId = await getSiteId();
  const driveId = await getDriveId();
  const safeCourse = (courseId || "course").replace(/[^a-zA-Z0-9-]/g, "-");
  const safeFileName = (fileName || "asset.bin").replace(/[^a-zA-Z0-9._-]/g, "-");
  const filePath = `${sharePointRootFolder}/uploads/${safeCourse}/${resourceType}-${Date.now()}-${safeFileName}`;
  const folderPath = filePath.slice(0, filePath.lastIndexOf("/"));
  await ensureFolder(folderPath);

  const uploadSession = await graphRequest(
    `/sites/${siteId}/drives/${driveId}/root:/${toDrivePath(filePath)}:/createUploadSession`,
    {
      method: "POST",
      body: JSON.stringify({
        item: {
          "@microsoft.graph.conflictBehavior": "replace",
          name: safeFileName,
          file: {}
        },
        deferCommit: false
      })
    }
  );

  const directFileUrl = `${getSiteUrl()}/${sharePointLibraryName}/${filePath}`.replace(/([^:]\/)\/+/, "$1");

  return {
    blobName: filePath,
    blobUrl: directFileUrl,
    uploadUrl: uploadSession.uploadUrl,
    maxChunkSize: 60 * 1024 * 1024,
    expectedContentType: contentType || "application/octet-stream"
  };
}

module.exports = {
  createUploadUrl,
  getCourses,
  saveCourses,
  getEnrollments,
  saveEnrollments
};