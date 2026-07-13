<template>
  <main class="shell">
    <section class="card">
      <p class="eyebrow">Azure Static Web Apps</p>
      <h1>Microsoft Entra ID access</h1>
      <p class="summary">
        This site only serves authenticated users. After Azure Static Web Apps completes
        sign-in, the page reads the active identity from <code>/.auth/me</code>.
      </p>

      <p v-if="loading" class="status">Loading signed-in user details...</p>
      <p v-else-if="error" class="status error">{{ error }}</p>

      <div v-else-if="user" class="profile">
        <dl>
          <div>
            <dt>Name</dt>
            <dd>{{ user.userDetails }}</dd>
          </div>
          <div>
            <dt>Provider</dt>
            <dd>{{ user.identityProvider }}</dd>
          </div>
          <div>
            <dt>Roles</dt>
            <dd>{{ user.userRoles.join(", ") }}</dd>
          </div>
        </dl>
        <a class="button secondary" href="/logout">Sign out</a>
      </div>

      <div v-else class="actions">
        <p class="status">No active session was returned.</p>
        <a class="button" href="/login">Sign in with Entra ID</a>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      loading: true,
      user: null,
      error: ""
    };
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
          throw new Error("Azure Static Web Apps auth endpoint is not available in this environment.");
        }

        const payload = await response.json();
        const principal = payload.clientPrincipal;

        this.user = principal && principal.userId ? principal : null;

        if (!this.user) {
          this.error = "No authenticated principal was returned. Finish the Azure Entra setup and sign in again.";
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
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

.error {
  color: #9f1239;
}

.profile {
  margin-top: 1.75rem;
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
}
</style>
