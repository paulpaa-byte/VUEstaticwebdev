const { requireAuthenticated, userKeyFromPrincipal } = require("../shared/auth");
const { saveEnrollments } = require("../shared/blobStore");

module.exports = async function (context, req) {
  try {
    const principal = requireAuthenticated(req);
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const courseIds = payload && Array.isArray(payload.courseIds) ? payload.courseIds : [];
    await saveEnrollments(userKeyFromPrincipal(principal), courseIds);
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { courseIds }
    };
  } catch (error) {
    context.res = {
      status: error.statusCode || 500,
      body: { error: error.message }
    };
  }
};