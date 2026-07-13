<template>
  <main class="shell">
    <section class="card">
      <header class="head">
        <div>
          <p class="eyebrow">Azure Static Web Apps</p>
          <h1>Microsoft Entra ID access</h1>
        </div>
        <span class="badge" :class="isAuthenticated ? 'ok' : 'neutral'">
          {{ isAuthenticated ? "Signed in" : "Anonymous" }}
        </span>
      </header>

      <nav class="nav">
        <a href="/" :class="currentPath === '/' ? 'active' : ''">Home</a>
        <a href="/profile" :class="currentPath.startsWith('/profile') ? 'active' : ''">Profile</a>
      </nav>

      <p class="summary" v-if="isProfileRoute">
        The profile route is protected by Static Web Apps authorization. You can only open it
        after sign-in.
      </p>
      <p class="summary" v-else>
        This home page loads for everyone. Use Sign in or Sign up to continue with Microsoft
        Entra ID and view your details from <code>/.auth/me</code>.
      </p>

      <p v-if="loading" class="status">Loading signed-in user details...</p>
      <p v-else-if="error" class="status error">{{ error }}</p>

      <div v-else-if="user" class="profile">
        <section class="account-card">
          <div class="account-top">
            <p class="tenant">{{ tenantName }}</p>
            <a class="account-link" href="/logout">Sign out</a>
          </div>

          <div class="identity-block">
            <img
              class="avatar"
              :src="avatarSrc"
              :alt="user.userDetails + ' profile photo'"
              @error="handleAvatarError"
            >

            <div>
              <p class="identity-name">{{ user.userDetails }}</p>
              <p class="identity-provider">Provider: {{ user.identityProvider }}</p>
              <p class="identity-roles">Roles: {{ user.userRoles.join(", ") }}</p>

              <div class="quick-links">
                <a
                  class="account-link"
                  :href="viewAccountUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View account
                </a>
                <a
                  class="account-link"
                  :href="m365ProfileUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My Microsoft 365 profile
                </a>
              </div>
            </div>
          </div>
        </section>

        <section v-if="isAdministrator" class="admin-panel">
          <h2>Administrator panel</h2>
          <p>
            Your account includes the <strong>administrator</strong> role. Use this area for
            admin-only controls.
          </p>
        </section>

        <section class="profile-links">
          <h2>Account links</h2>
          <a class="link-chip" :href="passwordResetUrl" target="_blank" rel="noopener noreferrer">
            Reset password (Entra SSPR)
          </a>
          <a class="link-chip" :href="profilePageUrl" target="_blank" rel="noopener noreferrer">
            Update profile (Entra My Account)
          </a>
        </section>

        <a class="button secondary" href="/logout">Sign out</a>
      </div>

      <div v-else class="actions">
        <p class="status">You are not signed in yet.</p>
        <div class="actions-row">
          <a class="button" href="/login">Sign in</a>
          <a class="button alt" href="/signup">Sign up</a>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      currentPath: window.location.pathname,
      passwordResetUrl: "https://passwordreset.microsoftonline.com/",
      profilePageUrl: "https://myaccount.microsoft.com/",
      viewAccountUrl: "https://myaccount.microsoft.com/",
      m365ProfileUrl: "https://www.office.com/profile",
      avatarSrc: "",
      loading: true,
      user: null,
      error: ""
    };
  },
  computed: {
    isAuthenticated() {
      return Boolean(this.user && this.user.userId);
    },
    isProfileRoute() {
      return this.currentPath.startsWith("/profile");
    },
    isAdministrator() {
      return Boolean(this.user && this.user.userRoles && this.user.userRoles.includes("administrator"));
    },
    tenantName() {
      if (!this.user || !this.user.userDetails) {
        return "Your tenant";
      }

      const email = this.user.userDetails;
      const atIndex = email.indexOf("@");
      if (atIndex === -1) {
        return "Your tenant";
      }

      return email.slice(atIndex + 1);
    }
  },
  mounted() {
    this.loadUser();
  },
  methods: {
    async loadUser() {
      try {
        const response = await fetch("/.auth/me", {
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          this.user = null;
          return;
        }

        const payload = await response.json();
        const principal = payload.clientPrincipal;

        this.user = principal && principal.userId ? principal : null;
        if (this.user) {
          this.avatarSrc = this.getOfficeAvatarUrl(this.user.userDetails);
        }
      } catch (error) {
        this.error = "Unable to read sign-in state right now.";
      } finally {
        this.loading = false;
      }
    },
    getOfficeAvatarUrl(userEmail) {
      return "https://outlook.office.com/owa/service.svc/s/GetPersonaPhoto?size=HR96x96&email=" + encodeURIComponent(userEmail);
    },
    getInitialsAvatarUrl(userEmail) {
      return "https://ui-avatars.com/api/?name=" + encodeURIComponent(userEmail) + "&background=1d4ed8&color=ffffff&size=128";
    },
    handleAvatarError() {
      if (!this.user || !this.user.userDetails) {
        return;
      }

      const fallback = this.getInitialsAvatarUrl(this.user.userDetails);
      if (this.avatarSrc !== fallback) {
        this.avatarSrc = fallback;
      }
    }
  }
};
</script>

<style scoped>
.shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background:
    radial-gradient(circle at top left, rgba(0, 120, 212, 0.18), transparent 35%),
    linear-gradient(135deg, #f4f7fb 0%, #e7eef8 100%);
  color: #10233d;
}

.card {
  width: min(680px, 100%);
  padding: 2.5rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 80px rgba(16, 35, 61, 0.14);
  backdrop-filter: blur(8px);
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.badge.ok {
  background: rgba(4, 120, 87, 0.14);
  color: #065f46;
}

.badge.neutral {
  background: rgba(30, 64, 175, 0.1);
  color: #1e40af;
}

.nav {
  margin-top: 1.25rem;
  display: flex;
  gap: 0.75rem;
}

.nav a {
  text-decoration: none;
  color: #0a5fb4;
  font-weight: 700;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: rgba(10, 95, 180, 0.1);
}

.nav a.active {
  background: #0a5fb4;
  color: #fff;
}

.eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0a5fb4;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.05;
}

.summary,
.status,
dd {
  font-size: 1rem;
  line-height: 1.6;
}

.summary {
  margin: 1rem 0 0;
  max-width: 52ch;
}

.status {
  margin: 1.5rem 0 0;
}

.status.compact {
  margin-top: 1rem;
}

.error {
  color: #9f1239;
}

.profile {
  margin-top: 1.75rem;
}

.account-card {
  margin-bottom: 1rem;
  border: 1px solid rgba(16, 35, 61, 0.14);
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

.account-top {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid rgba(16, 35, 61, 0.1);
}

.tenant {
  margin: 0;
  font-weight: 700;
}

.identity-block {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 1rem;
  padding: 1rem;
}

.avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(10, 95, 180, 0.25);
}

.identity-name {
  margin: 0;
  font-weight: 700;
  font-size: 1.08rem;
}

.identity-provider,
.identity-roles {
  margin: 0.35rem 0 0;
  color: #334155;
  line-height: 1.5;
}

.quick-links {
  margin-top: 0.75rem;
  display: grid;
  gap: 0.35rem;
}

.account-link {
  color: #0a5fb4;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.admin-panel {
  margin: 1.25rem 0 1.75rem;
  border: 1px solid rgba(16, 35, 61, 0.14);
  background: rgba(10, 95, 180, 0.06);
  border-radius: 14px;
  padding: 1rem;
}

.admin-panel h2 {
  margin: 0;
  font-size: 1rem;
}

.admin-panel p {
  margin: 0.6rem 0 0;
  line-height: 1.5;
}

.profile-links {
  margin: 0 0 1.5rem;
  display: grid;
  gap: 0.65rem;
}

.profile-links h2 {
  margin: 0;
  font-size: 1rem;
}

.link-chip {
  display: inline-flex;
  width: fit-content;
  text-decoration: none;
  font-weight: 700;
  color: #0a5fb4;
  background: rgba(10, 95, 180, 0.12);
  border-radius: 999px;
  padding: 0.55rem 0.95rem;
}

dl {
  display: grid;
  gap: 1rem;
  margin: 0 0 1.75rem;
}

dt {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4a6583;
}

dd {
  margin: 0.25rem 0 0;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.3rem;
  border-radius: 999px;
  background: #0a5fb4;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.button.secondary {
  background: #10233d;
}

.button.alt {
  background: #1d4ed8;
}

.actions-row {
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

code {
  padding: 0.1rem 0.35rem;
  border-radius: 6px;
  background: rgba(16, 35, 61, 0.08);
}

@media (max-width: 640px) {
  .shell {
    padding: 1rem;
  }

  .card {
    padding: 1.5rem;
  }

  .identity-block {
    grid-template-columns: 1fr;
  }
}
</style>
