const { requireRole, requireAuthenticated } = require("../shared/auth");

module.exports = async function (context, req) {
  try {
    const { getSiteContent, saveSiteContent } = require("../shared/blobStore");
    requireRole(req, "administrator");
    const principal = requireAuthenticated(req);
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const nextSiteContent = payload && payload.siteContent ? payload.siteContent : null;

    if (!nextSiteContent || typeof nextSiteContent !== "object") {
      context.res = { status: 400, body: { error: "Site content payload is required." } };
      return;
    }

    const currentSiteContent = await getSiteContent();
    const commitMessage = payload && payload.commitMessage ? String(payload.commitMessage).trim() : "";
    const committedSiteContent = {
      ...currentSiteContent,
      ...nextSiteContent,
      metadata: {
        ...(currentSiteContent.metadata || {}),
        ...(nextSiteContent.metadata || {}),
        lastCommittedAt: new Date().toISOString(),
        lastCommittedBy: principal.userDetails || principal.userId || "administrator",
        commitMessage
      }
    };

    await saveSiteContent(committedSiteContent);
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { siteContent: committedSiteContent }
    };
  } catch (error) {
    context.res = {
      status: error.statusCode || 500,
      body: { error: error.message }
    };
  }
};