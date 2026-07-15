const { requireAuthenticated } = require("../shared/auth");

module.exports = async function (context, req) {
  try {
    const { getUserPhoto } = require("../shared/blobStore");
    const principal = requireAuthenticated(req);
    const delegatedToken = req.headers["x-ms-token-aad-access-token"] || req.headers["X-MS-TOKEN-AAD-ACCESS-TOKEN"] || "";

    const photo = await getUserPhoto({
      userEmail: principal.userDetails,
      delegatedToken
    });

    context.res = {
      status: 200,
      isRaw: true,
      headers: {
        "Content-Type": photo.contentType,
        "Cache-Control": "private, max-age=900"
      },
      body: photo.content
    };
  } catch (error) {
    if (error.statusCode === 404) {
      context.res = {
        status: 404,
        body: { error: "Profile photo not found." }
      };
      return;
    }

    context.res = {
      status: error.statusCode || 500,
      body: { error: error.message || "Unable to load profile photo." }
    };
  }
};
