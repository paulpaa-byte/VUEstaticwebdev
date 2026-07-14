const { requireAuthenticated, userKeyFromPrincipal } = require("../shared/auth");

module.exports = async function (context, req) {
  try {
    const { getEnrollments } = require("../shared/blobStore");
    const principal = requireAuthenticated(req);
    const courseIds = await getEnrollments(userKeyFromPrincipal(principal));
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