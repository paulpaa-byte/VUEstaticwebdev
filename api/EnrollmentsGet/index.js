const { requireAuthenticated, userKeyFromPrincipal } = require("../shared/auth");
const { getEnrollments } = require("../shared/blobStore");

module.exports = async function (context, req) {
  try {
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