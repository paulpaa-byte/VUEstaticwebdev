const { requireRole } = require("../shared/auth");

module.exports = async function (context, req) {
  try {
    const { createUploadUrl } = require("../shared/blobStore");
    requireRole(req, "administrator");
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!payload || !payload.courseId || !payload.resourceType || !payload.fileName) {
      context.res = {
        status: 400,
        body: { error: "courseId, resourceType, and fileName are required." }
      };
      return;
    }

    const upload = await createUploadUrl(payload);
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: upload
    };
  } catch (error) {
    context.res = {
      status: error.statusCode || 500,
      body: { error: error.message }
    };
  }
};