const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions
} = require("@azure/storage-blob");

const defaultCourses = require("./defaultCourses");

const containerName = process.env.LEARNING_CONTENT_CONTAINER || "learning-content";
const catalogBlobName = "catalog/courses.json";

function getConnectionString() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING setting is missing.");
  }

  return connectionString;
}

function parseConnectionString() {
  const parts = getConnectionString().split(";").reduce((map, segment) => {
    const [key, value] = segment.split("=");
    if (key && value) {
      map[key] = value;
    }
    return map;
  }, {});

  return {
    accountName: parts.AccountName,
    accountKey: parts.AccountKey
  };
}

function getBlobServiceClient() {
  return BlobServiceClient.fromConnectionString(getConnectionString());
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

  const { accountName, accountKey } = parseConnectionString();
  const credential = new StorageSharedKeyCredential(accountName, accountKey);
  const sas = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("cw"),
      startsOn: new Date(Date.now() - 5 * 60 * 1000),
      expiresOn: new Date(Date.now() + 15 * 60 * 1000),
      contentType: contentType || "application/octet-stream"
    },
    credential
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