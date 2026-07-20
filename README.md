# Valuearc.net Careers Portal (Vue + Azure Static Web Apps)

This project is a Vue 2 learning portal deployed on Azure Static Web Apps with:

1. Microsoft Entra sign-in via SWA auth routes.
2. Role-based admin access through the administrator custom role.
3. Server-backed catalog/enrollment APIs.
4. SharePoint-based backend persistence for catalog/enrollment data and uploaded assets.
5. Browser-cache fallback mode when backend APIs are unavailable.

## Architecture

1. Frontend: Vue CLI app in src.
2. SWA config: public/staticwebapp.config.json.
3. API: Node-based functions in api.
4. Persistence layer: SharePoint via Microsoft Graph in api/shared/blobStore.js.

## Authentication and Roles

### Sign-in provider settings (SWA)

Set these in Azure Static Web App environment variables:

1. AZURE_CLIENT_ID
2. AZURE_CLIENT_SECRET

The login callback URI must exist in the Entra app registration:

1. https://<your-static-web-app-domain>/.auth/login/aad/callback

### Admin role

The admin UI is visible only when the signed-in user has the role name administrator.

Assign this through Static Web App Role management invitation flow and validate in:

1. /.auth/me

## SharePoint Backend Configuration

Set these in Azure Static Web App environment variables:

1. SP_SITE_URL
2. SP_LIBRARY_NAME
3. SHAREPOINT_ROOT_FOLDER (optional, defaults to learninghub)
4. STORAGE_TENANT_ID
5. STORAGE_CLIENT_ID
6. STORAGE_CLIENT_SECRET

For the storage identity app registration:

1. Grant Microsoft Graph application permission Sites.Selected (or Sites.ReadWrite.All for broader access).
2. Grant admin consent.
3. If using Sites.Selected, grant site-level permission to the target SharePoint site.

## Local Development

Install frontend dependencies:

```bash
npm install
```

Install API dependencies:

```bash
cd api
npm install
cd ..
```

Run frontend locally:

```bash
npm run serve
```

Build production bundle:

```bash
npm run build
```

## Deployment

Deployment runs from GitHub Actions workflow in .github/workflows.

Push to main to trigger production deployment.

## Resilience Behavior

If /api/courses or enrollment APIs fail, the app switches to browser-cache mode:

1. Course catalog is read/written from localStorage.
2. Enrollment changes are stored locally.
3. Upload API remains disabled until backend is available.

## Security Notes

1. Rotate client secrets if they are ever exposed.
2. Prefer least-privilege Graph permissions and site-scoped access.
3. Avoid storing sensitive values in source control.
