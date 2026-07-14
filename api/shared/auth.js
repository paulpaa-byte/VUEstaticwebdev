function parseClientPrincipal(req) {
  const encoded = req.headers["x-ms-client-principal"] || req.headers["X-MS-CLIENT-PRINCIPAL"];
  if (!encoded) {
    return null;
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const principal = JSON.parse(decoded);
  return {
    ...principal,
    userRoles: principal.userRoles || []
  };
}

function requireAuthenticated(req) {
  const principal = parseClientPrincipal(req);
  if (!principal || !principal.userId) {
    const error = new Error("Authentication required.");
    error.statusCode = 401;
    throw error;
  }

  return principal;
}

function requireRole(req, roleName) {
  const principal = requireAuthenticated(req);
  if (!principal.userRoles.includes(roleName)) {
    const error = new Error("Administrator role required.");
    error.statusCode = 403;
    throw error;
  }

  return principal;
}

function userKeyFromPrincipal(principal) {
  return (principal.userDetails || principal.userId || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

module.exports = {
  parseClientPrincipal,
  requireAuthenticated,
  requireRole,
  userKeyFromPrincipal
};