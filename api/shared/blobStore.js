const {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions
} = require("@azure/storage-blob");
const { ClientSecretCredential, DefaultAzureCredential } = require("@azure/identity");

const defaultCourses = require("./defaultCourses");

const containerName = process.env.LEARNING_CONTENT_CONTAINER || "learning-content";
const catalogBlobName = "catalog/courses.json";
let blobServiceClient;

function parseConnectionString() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
  return connectionString.split(";").reduce((map, segment) => {
    const [key, ...valueParts] = segment.split("=");
    if (key && valueParts.length) {
      map[key] = valueParts.join("=");
    }
    return map;
  }, {});
}

function getStorageAccountUrl() {
  if (process.env.AZURE_STORAGE_ACCOUNT_URL) {
    return process.env.AZURE_STORAGE_ACCOUNT_URL.replace(/\/$/, "");
  }

  const parts = parseConnectionString();
  if (parts.BlobEndpoint) {
    return parts.BlobEndpoint.replace(/\/$/, "");
  }
  if (parts.AccountName) {
    return `https://${parts.AccountName}.blob.core.windows.net`;
  }

  throw new Error("AZURE_STORAGE_ACCOUNT_URL setting is missing.");
}

function getStorageAccountName() {
  const fromConnectionString = parseConnectionString().AccountName;
  if (fromConnectionString) {
    return fromConnectionString;
  }

  const accountUrl = new URL(getStorageAccountUrl());
  return accountUrl.hostname.split(".")[0];
}

function getTokenCredential() {
  const tenantId = process.env.STORAGE_TENANT_ID || process.env.AZURE_TENANT_ID;
  const clientId = process.env.STORAGE_CLIENT_ID || process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.STORAGE_CLIENT_SECRET || process.env.AZURE_CLIENT_SECRET;

  if (tenantId && clientId && clientSecret) {
    return new ClientSecretCredential(tenantId, clientId, clientSecret);
  }

  if (tenantId || clientId || clientSecret) {
    throw new Error(
      "Set STORAGE_TENANT_ID, STORAGE_CLIENT_ID, STORAGE_CLIENT_SECRET (or AZURE_* equivalents) together for Entra auth."
    );
  }

  // Local development fallback when az login or other default credentials are available.
  return new DefaultAzureCredential();
}

function getBlobServiceClient() {
  if (!blobServiceClient) {
    blobServiceClient = new BlobServiceClient(getStorageAccountUrl(), getTokenCredential());
  }
  return blobServiceClient;
}

async function getContainerClient() {
  const containerClient = getBlobServiceClient().getContainerClient(containerName);
  await containerClient.createIfNotExists();
  return containerClient;
}

async function readJson(blobName, fallbackValue) {
  const containerClient = await getContainerClient();
  const blobClient = containerClient.getBlobClient(blobName);
  const exists = await blobClient.exists();
  if (!exists) {
    return fallbackValue;
  }

  const download = await blobClient.download();
  const content = await streamToString(download.readableStreamBody);
  return JSON.parse(content);
}

async function writeJson(blobName, payload) {
  const containerClient = await getContainerClient();
  const blobClient = containerClient.getBlockBlobClient(blobName);
  const body = JSON.stringify(payload, null, 2);
  await blobClient.upload(body, Buffer.byteLength(body), {
    blobHTTPHeaders: {
      blobContentType: "application/json"
    }
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
  const blobName = `enrollments/${userKey}.json`;
  const payload = await readJson(blobName, { courseIds: [] });
  return Array.isArray(payload.courseIds) ? payload.courseIds : [];
}

async function saveEnrollments(userKey, courseIds) {
  const blobName = `enrollments/${userKey}.json`;
  await writeJson(blobName, { courseIds });
}

async function createUploadUrl({ courseId, resourceType, fileName, contentType }) {
  const containerClient = await getContainerClient();
  const safeCourse = (courseId || "course").replace(/[^a-zA-Z0-9-]/g, "-");
  const safeFileName = (fileName || "asset.bin").replace(/[^a-zA-Z0-9._-]/g, "-");
  const blobName = `uploads/${safeCourse}/${resourceType}-${Date.now()}-${safeFileName}`;
  const blobClient = containerClient.getBlockBlobClient(blobName);

  const startsOn = new Date(Date.now() - 5 * 60 * 1000);
  const expiresOn = new Date(Date.now() + 15 * 60 * 1000);
  const userDelegationKey = await getBlobServiceClient().getUserDelegationKey(startsOn, expiresOn);

  const sas = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("cw"),
      startsOn,
      expiresOn,
      contentType: contentType || "application/octet-stream"
    },
    userDelegationKey,
    getStorageAccountName()
  ).toString();

  return {
    blobName,
    blobUrl: blobClient.url,
    uploadUrl: `${blobClient.url}?${sas}`
  };
}

function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", data => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}

module.exports = {
  createUploadUrl,
  getCourses,
  saveCourses,
  getEnrollments,
  saveEnrollments
};