# Vue Basic

[Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/overview) allows you to easily build [Vue.js](https://vuejs.org/) apps in minutes. Use this repo with the [Vue quickstart](https://docs.microsoft.com/azure/static-web-apps/getting-started?tabs=vue) to build and customize a new static site.

## Microsoft Entra ID authentication

This app is configured for tenant-restricted Microsoft Entra ID authentication in Azure Static Web Apps.

### Azure prerequisites

1. Use an Azure Static Web Apps Standard plan. Custom identity providers are not available on the Free plan.
2. Create a Microsoft Entra app registration for the site.
3. Add this redirect URI to the app registration:

```text
https://<your-static-web-app-domain>/.auth/login/aad/callback
```

4. Create a client secret for the app registration.
5. In the Static Web App resource, add these application settings:

```text
AZURE_CLIENT_ID=<application-client-id>
AZURE_CLIENT_SECRET=<client-secret-value>
```

6. Replace `<TENANT_ID>` in [public/staticwebapp.config.json](./public/staticwebapp.config.json) with your Microsoft Entra tenant ID.
7. Keep the app registration audience tenant-specific so only users from your tenant can sign in.

### Behavior

- All routes require an authenticated user.
- Unauthenticated requests are redirected to `/.auth/login/aad`.
- The Vue app reads the signed-in principal from `/.auth/me` and shows the active user.
- Signing out goes through `/.auth/logout`.

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Lints and fixes files

```bash
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
