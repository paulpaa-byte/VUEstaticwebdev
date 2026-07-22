module.exports = async function (context) {
  try {
    const { getSiteContent } = require("../shared/blobStore");
    const siteContent = await getSiteContent();
    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: { siteContent }
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        error: error.message || "Site content API failed.",
        source: "SiteContentGet"
      }
    };
  }
};