<template>
  <main class="shell">
    <section class="card">
            <header class="head">
              <div>
                <p class="eyebrow">Valuearc.net</p>
                <h1>{{ pageTitle }}</h1>
              </div>
              <span class="badge" :class="isAuthenticated ? 'ok' : 'neutral'">
                {{ isAuthenticated ? "Signed in" : "Anonymous" }}
              </span>
            </header>

            <nav class="nav">
              <a href="/" :class="showHome ? 'active' : ''">Home</a>
              <a href="/profile" :class="isProfileRoute ? 'active' : ''">Profile</a>
              <a v-if="isAdministrator" href="/admin" :class="isAdminRoute ? 'active' : ''">Admin</a>
            </nav>

            <p class="summary" v-if="isAdminRoute">
              Manage the Microsoft cloud training catalog. Files are uploaded to SharePoint and
              course metadata is stored server-side through Azure Functions.
            </p>
            <p class="summary" v-else-if="isProfileRoute">
              Review your registered courses, open training materials, and manage your Microsoft Entra
              account links.
            </p>
            <p class="summary" v-else>
              Explore current job openings, connect with our consultants, and follow company
              updates from one place.
            </p>

            <p v-if="loading" class="status">Loading user and training catalog...</p>
            <p v-if="!loading && error" class="status error">{{ error }}</p>

            <template v-if="!loading">
              <section v-if="isAuthenticated" class="account-card">
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
                    <p class="identity-roles">Roles: {{ user.userRoles.join(', ') }}</p>

                    <div class="quick-links">
                      <a class="account-link" :href="viewAccountUrl" target="_blank" rel="noopener noreferrer">
                        View account
                      </a>
                      <a class="account-link" :href="m365ProfileUrl" target="_blank" rel="noopener noreferrer">
                        My Microsoft 365 profile
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              <section v-if="showHome" class="home-experience">
                <article class="hero-banner panel">
                  <p class="mini-kicker">Valuearc.net Consulting</p>
                  <h2>Build teams that deliver measurable business impact</h2>
                  <p>
                    Valuearc.net connects organizations with high-performing talent across strategy,
                    technology, and operations. Explore our services, latest insights, and open opportunities.
                  </p>
                  <div class="hero-stats">
                    <div>
                      <span>{{ jobOpenings.length }}</span>
                      <p>Open positions</p>
                    </div>
                    <div>
                      <span>{{ categoryOptions.length }}</span>
                      <p>Practice areas</p>
                    </div>
                    <div>
                      <span>{{ formatOptions.length }}</span>
                      <p>Engagement models</p>
                    </div>
                  </div>
                  <div class="actions-row" v-if="!isAuthenticated">
                    <a class="button" href="/login">Sign in</a>
                  </div>
                </article>

                <nav class="section-nav panel" aria-label="Homepage sections">
                  <a href="#about">About Us</a>
                  <a href="#vision">Vision</a>
                  <a href="#contact">Contact</a>
                  <a href="#news">News and Media</a>
                  <a href="#portfolio">Services Portfolio</a>
                  <a href="#jobs">Job Openings</a>
                </nav>

                <article id="about" class="panel section-panel">
                  <h2>About Us</h2>
                  <p>
                    Valuearc.net is an advisory and recruitment consultancy focused on business transformation,
                    specialist hiring, and workforce modernization. We partner with enterprises and growth-stage
                    firms to attract talent that can execute strategic goals.
                  </p>
                </article>

                <article id="vision" class="panel section-panel">
                  <h2>Vision</h2>
                  <p>
                    To become the most trusted consulting and talent partner by combining deep domain expertise,
                    transparent hiring practices, and measurable value delivery for clients and candidates.
                  </p>
                </article>

                <article id="contact" class="panel section-panel">
                  <h2>Contact</h2>
                  <div class="profile-links">
                    <a class="link-chip" href="mailto:careers@valuearc.net">careers@valuearc.net</a>
                    <a class="link-chip" href="tel:+18005550199">+1 (800) 555-0199</a>
                    <a class="link-chip" href="mailto:media@valuearc.net">media@valuearc.net</a>
                    <span class="hint">Business hours: Monday to Friday, 9:00 AM to 6:00 PM</span>
                  </div>
                </article>

                <article id="news" class="panel section-panel">
                  <h2>News and Media</h2>
                  <ul class="news-list">
                    <li>Valuearc.net publishes quarterly consulting talent trend report.</li>
                    <li>New partnership launched for digital and analytics hiring programs.</li>
                    <li>Leadership webinar announced: Future-ready workforce planning.</li>
                  </ul>
                </article>

                <article id="portfolio" class="panel section-panel">
                  <h2>Job Consultancy Services Portfolio</h2>
                  <div class="portfolio-grid">
                    <div class="portfolio-item">
                      <h3>Executive Search</h3>
                      <p>C-level and leadership mandates for strategic functions.</p>
                    </div>
                    <div class="portfolio-item">
                      <h3>Permanent Hiring</h3>
                      <p>End-to-end sourcing and placement for full-time roles.</p>
                    </div>
                    <div class="portfolio-item">
                      <h3>Contract Staffing</h3>
                      <p>Agile workforce support for project and delivery teams.</p>
                    </div>
                    <div class="portfolio-item">
                      <h3>Campus and Early Careers</h3>
                      <p>Graduate hiring pipelines and internship conversion programs.</p>
                    </div>
                  </div>
                </article>

                <article id="jobs" class="panel section-panel">
                  <h2>Job Openings</h2>
                  <div class="course-list">
                    <article v-for="job in jobOpenings" :key="job.id" class="course-card">
                      <div class="course-head">
                        <div>
                          <p class="course-track">{{ job.department }}</p>
                          <h3>{{ job.title }}</h3>
                        </div>
                        <span class="pill">{{ job.level }}</span>
                      </div>

                      <p class="course-description">{{ job.summary }}</p>

                      <ul class="course-meta">
                        <li>Work model: {{ job.workModel }}</li>
                        <li>Location: {{ job.location }}</li>
                      </ul>

                      <div class="course-actions">
                        <a class="link-chip" :href="job.detailsUrl" target="_blank" rel="noopener noreferrer">
                          View details
                        </a>
                        <a class="link-chip" :href="job.detailsUrl" target="_blank" rel="noopener noreferrer">
                          Apply now
                        </a>
                      </div>
                    </article>
                  </div>
                </article>
              </section>

              <section v-if="isProfileRoute" class="panel-grid profile-layout">
                <article class="panel">
                  <h2>Your registered courses</h2>
                  <p v-if="!isAuthenticated" class="hint">
                    Sign in to register for courses and build your learning plan.
                  </p>
                  <div v-else-if="enrolledCourses.length" class="course-list compact-list">
                    <article v-for="course in enrolledCourses" :key="course.id" class="course-card compact-card">
                      <div class="course-head">
                        <div>
                          <p class="course-track">{{ course.category }}</p>
                          <h3>{{ course.title }}</h3>
                        </div>
                        <span class="pill">{{ course.level }}</span>
                      </div>
                      <p class="course-description">{{ course.description }}</p>
                      <div class="course-actions">
                        <a v-if="course.detailPath" class="link-chip" :href="course.detailPath" target="_blank" rel="noopener noreferrer">
                          Course details
                        </a>
                        <a v-if="course.videoUrl" class="link-chip" :href="course.videoUrl" target="_blank" rel="noopener noreferrer">
                          Video
                        </a>
                        <a v-if="course.documentUrl" class="link-chip" :href="course.documentUrl" target="_blank" rel="noopener noreferrer">
                          Document
                        </a>
                        <a v-if="course.pdfUrl" class="link-chip" :href="course.pdfUrl" target="_blank" rel="noopener noreferrer">
                          PDF
                        </a>
                        <a v-if="downloadTarget(course)" class="link-chip" :href="downloadTarget(course)" :download="course.downloadName">
                          Download
                        </a>
                        <button class="button secondary small" type="button" @click="toggleEnrollment(course.id)">
                          Remove
                        </button>
                      </div>
                    </article>
                  </div>
                  <p v-else class="hint">You have not registered for any courses yet.</p>
                </article>

                <article class="panel">
                  <h2>Account tools</h2>
                  <div class="profile-links">
                    <a class="link-chip" :href="passwordResetUrl" target="_blank" rel="noopener noreferrer">
                      Reset password (Entra SSPR)
                    </a>
                    <a class="link-chip" :href="profilePageUrl" target="_blank" rel="noopener noreferrer">
                      Update profile (Entra My Account)
                    </a>
                    <a class="link-chip" :href="viewAccountUrl" target="_blank" rel="noopener noreferrer">
                      View account
                    </a>
                    <a class="link-chip" :href="m365ProfileUrl" target="_blank" rel="noopener noreferrer">
                      My Microsoft 365 profile
                    </a>
                  </div>
                </article>
              </section>

              <section v-if="isAdminRoute" class="panel-grid">
                <article v-if="isAdministrator" class="panel">
                  <h2>Admin console</h2>
                  <p class="hint compact-hint">
                    Add course metadata and upload files to SharePoint. Upload a file to auto-fill each
                    course resource URL.
                  </p>
                  <form class="admin-form" @submit.prevent="saveCourse">
                    <label>
                      Title
                      <input v-model.trim="draftCourse.title" type="text" required>
                    </label>
                    <label>
                      Category
                      <select v-model="draftCourse.category" required>
                        <option value="" disabled>Select category</option>
                        <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
                      </select>
                    </label>
                    <label>
                      Level
                      <select v-model="draftCourse.level" required>
                        <option value="" disabled>Select level</option>
                        <option v-for="level in levelOptions" :key="level" :value="level">{{ level }}</option>
                      </select>
                    </label>
                    <label>
                      Duration
                      <input v-model.trim="draftCourse.duration" type="text" required>
                    </label>
                    <label>
                      Format
                      <select v-model="draftCourse.format" required>
                        <option value="" disabled>Select format</option>
                        <option v-for="format in formatOptions" :key="format" :value="format">{{ format }}</option>
                      </select>
                    </label>
                    <div class="asset-field full-width">
                      <label>
                        Course detail path or URL
                        <input v-model.trim="draftCourse.detailPath" type="text" required placeholder="https://...">
                      </label>
                      <div class="upload-inline">
                        <label class="file-select">
                          Detail file upload
                          <input type="file" @change="setSelectedFile('detailPath', $event)">
                        </label>
                        <button class="button small" type="button" @click="uploadSelectedFile('detailPath', 'details')">
                          {{ uploadLabel('detailPath') }}
                        </button>
                      </div>
                      <p v-if="selectedFiles.detailPath" class="selected-file">Selected: {{ selectedFiles.detailPath.name }}</p>
                    </div>

                    <div class="asset-field full-width">
                      <label>
                        Video URL
                        <input v-model.trim="draftCourse.videoUrl" type="text" placeholder="https://...">
                      </label>
                      <div class="upload-inline">
                        <label class="file-select">
                          Video upload
                          <input type="file" accept="video/*" @change="setSelectedFile('videoUrl', $event)">
                        </label>
                        <button class="button small" type="button" @click="uploadSelectedFile('videoUrl', 'videos')">
                          {{ uploadLabel('videoUrl') }}
                        </button>
                      </div>
                      <p v-if="selectedFiles.videoUrl" class="selected-file">Selected: {{ selectedFiles.videoUrl.name }}</p>
                    </div>

                    <div class="asset-field full-width">
                      <label>
                        Document URL
                        <input v-model.trim="draftCourse.documentUrl" type="text" placeholder="https://...">
                      </label>
                      <div class="upload-inline">
                        <label class="file-select">
                          Document upload
                          <input type="file" @change="setSelectedFile('documentUrl', $event)">
                        </label>
                        <button class="button small" type="button" @click="uploadSelectedFile('documentUrl', 'documents')">
                          {{ uploadLabel('documentUrl') }}
                        </button>
                      </div>
                      <p v-if="selectedFiles.documentUrl" class="selected-file">Selected: {{ selectedFiles.documentUrl.name }}</p>
                    </div>

                    <div class="asset-field full-width">
                      <label>
                        PDF URL
                        <input v-model.trim="draftCourse.pdfUrl" type="text" placeholder="https://...">
                      </label>
                      <div class="upload-inline">
                        <label class="file-select">
                          PDF upload
                          <input type="file" accept="application/pdf" @change="setSelectedFile('pdfUrl', $event)">
                        </label>
                        <button class="button small" type="button" @click="uploadSelectedFile('pdfUrl', 'pdfs')">
                          {{ uploadLabel('pdfUrl') }}
                        </button>
                      </div>
                      <p v-if="selectedFiles.pdfUrl" class="selected-file">Selected: {{ selectedFiles.pdfUrl.name }}</p>
                    </div>
                    <label>
                      Download name
                      <input v-model.trim="draftCourse.downloadName" type="text" required>
                    </label>
                    <label class="full-width">
                      Description
                      <textarea v-model.trim="draftCourse.description" rows="4" required></textarea>
                    </label>
                    <div class="admin-actions">
                      <button class="button" type="submit" :disabled="savingCourse">
                        {{ savingCourse ? 'Saving...' : (draftCourse.id ? 'Update course' : 'Add course') }}
                      </button>
                      <button v-if="draftCourse.id" class="button secondary" type="button" @click="resetDraftCourse">
                        Cancel edit
                      </button>
                    </div>
                  </form>
                </article>

                <article v-if="isAdministrator" class="panel">
                  <h2>Catalog management</h2>
                  <div class="course-list compact-list">
                    <article v-for="course in courses" :key="course.id" class="course-card compact-card">
                      <div class="course-head">
                        <div>
                          <p class="course-track">{{ course.category }}</p>
                          <h3>{{ course.title }}</h3>
                        </div>
                        <span class="pill">{{ course.level }}</span>
                      </div>
                      <p class="course-description">{{ course.description }}</p>
                      <div class="course-actions">
                        <button class="button small" type="button" @click="editCourse(course)">Edit</button>
                        <button class="button secondary small" type="button" @click="deleteCourse(course.id)">
                          Delete
                        </button>
                      </div>
                    </article>
                  </div>
                </article>

                <article v-else class="panel">
                  <h2>Admin console</h2>
                  <p class="hint">Only users with the administrator role can manage courses.</p>
                </article>
              </section>
      </template>
    </section>
  </main>
</template>

<script>
      const DEFAULT_COURSES = [
        {
          id: "sharepoint-foundations",
          title: "SharePoint Online Foundations",
          category: "SharePoint",
          level: "Intermediate",
          duration: "3 hours",
          format: "Guide + checklist",
          detailPath: "/course-materials/sharepoint-online-foundations.md",
          videoUrl: "",
          documentUrl: "",
          pdfUrl: "",
          downloadName: "sharepoint-online-foundations.md",
          description: "Learn site architecture, document collaboration, permissions, and content lifecycle basics for SharePoint Online."
        },
        {
          id: "exchange-online-operations",
          title: "Exchange Online Operations",
          category: "Exchange Online",
          level: "Intermediate",
          duration: "2.5 hours",
          format: "Guide + lab notes",
          detailPath: "/course-materials/exchange-online-operations.md",
          videoUrl: "",
          documentUrl: "",
          pdfUrl: "",
          downloadName: "exchange-online-operations.md",
          description: "Cover mailbox administration, transport hygiene, retention, and common operational tasks in Exchange Online."
        },
        {
          id: "teams-admin-essentials",
          title: "Microsoft Teams Admin Essentials",
          category: "Teams",
          level: "Beginner",
          duration: "2 hours",
          format: "Playbook",
          detailPath: "/course-materials/teams-admin-essentials.md",
          videoUrl: "",
          documentUrl: "",
          pdfUrl: "",
          downloadName: "teams-admin-essentials.md",
          description: "Build a working foundation for Teams policies, meetings, app governance, and collaboration rollout."
        },
        {
          id: "entra-id-core-identity",
          title: "Microsoft Entra ID Core Identity",
          category: "Entra ID",
          level: "Advanced",
          duration: "3.5 hours",
          format: "Architecture guide",
          detailPath: "/course-materials/entra-id-core-identity.md",
          videoUrl: "",
          documentUrl: "",
          pdfUrl: "",
          downloadName: "entra-id-core-identity.md",
          description: "Understand tenants, authentication flows, application registrations, conditional access, and identity governance."
        },
        {
          id: "defender-xdr-essentials",
          title: "Microsoft Defender XDR Essentials",
          category: "Defender",
          level: "Advanced",
          duration: "4 hours",
          format: "Workbook",
          detailPath: "/course-materials/defender-xdr-essentials.md",
          videoUrl: "",
          documentUrl: "",
          pdfUrl: "",
          downloadName: "defender-xdr-essentials.md",
          description: "Review alert triage, endpoint and email protection, incident workflows, and defender operations baselines."
        },
        {
          id: "intune-device-management",
          title: "Intune Device Management",
          category: "Intune",
          level: "Intermediate",
          duration: "2 hours",
          format: "Starter pack",
          detailPath: "/course-materials/intune-device-management.md",
          videoUrl: "",
          documentUrl: "",
          pdfUrl: "",
          downloadName: "intune-device-management.md",
          description: "Practice enrollment, compliance, configuration profiles, app deployment, and endpoint management patterns."
        }
      ];

      function emptyDraftCourse() {
        return {
          id: "",
          title: "",
          category: "",
          level: "",
          duration: "",
          format: "",
          detailPath: "",
          videoUrl: "",
          documentUrl: "",
          pdfUrl: "",
          downloadName: "",
          description: ""
        };
      }

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
            error: "",
            offlineMode: false,
            courses: [],
            enrollments: {},
            savingCourse: false,
            uploadingField: "",
            selectedFiles: {
              detailPath: null,
              videoUrl: null,
              documentUrl: null,
              pdfUrl: null
            },
            categoryOptions: [
              "Cloud Infrastructure",
              "Identity & Access",
              "Security & Compliance",
              "Collaboration & Productivity",
              "Data & Analytics",
              "DevOps & Automation",
              "AI & Copilot",
              "Endpoint Management"
            ],
            levelOptions: [
              "Beginner",
              "Intermediate",
              "Advanced",
              "Expert"
            ],
            formatOptions: [
              "Self-paced eLearning",
              "Instructor-led Virtual",
              "Instructor-led In-person",
              "Hands-on Lab",
              "Workshop",
              "Certification Prep",
              "Webinar"
            ],
            draftCourse: emptyDraftCourse()
          };
        },
        computed: {
          isAuthenticated() {
            return Boolean(this.user && this.user.userId);
          },
          isProfileRoute() {
            return this.currentPath.startsWith("/profile");
          },
          isAdminRoute() {
            return this.currentPath.startsWith("/admin");
          },
          showHome() {
            return !this.isProfileRoute && !this.isAdminRoute;
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
          },
          pageTitle() {
            if (this.isAdminRoute) {
              return "Admin Console";
            }

            if (this.isProfileRoute) {
              return "Your Learning Profile";
            }

            return "Valuearc.net Careers";
          },
          currentUserKey() {
            return this.user && this.user.userDetails ? this.user.userDetails.toLowerCase() : "anonymous";
          },
          enrolledCourseIds() {
            return this.enrollments[this.currentUserKey] || [];
          },
          enrolledCourses() {
            return this.courses.filter(course => this.enrolledCourseIds.includes(course.id));
          },
          downloadableCourses() {
            return this.courses.filter(course => Boolean(this.downloadTarget(course)));
          },
          jobOpenings() {
            return this.courses.map(course => ({
              id: course.id,
              title: course.title,
              department: course.category || "General",
              level: course.level || "Open",
              workModel: course.format || "Full-time",
              location: course.duration || "Remote / Hybrid",
              summary: course.description || "Explore this role and apply through the details page.",
              detailsUrl: course.detailPath || "/"
            }));
          }
        },
        mounted() {
          this.bootstrapApp();
        },
        methods: {
          async bootstrapApp() {
            try {
              await Promise.all([this.fetchCourses(), this.loadUser()]);
              if (this.isAuthenticated) {
                await this.fetchEnrollments();
              }
            } catch (bootstrapError) {
              if (!this.error) {
                this.error = bootstrapError.message || "Unable to load the learning portal right now.";
              }
            } finally {
              this.loading = false;
            }
          },
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
              const authPayload = Array.isArray(payload) ? payload[0] : payload;
              const principal = authPayload ? authPayload.clientPrincipal : null;

              this.user = principal && principal.userId ? principal : null;
              if (this.user) {
                this.avatarSrc = "/api/profile-photo";
              }
            } catch (loadError) {
              this.user = null;
            }
          },
          async apiFetch(url, options = {}) {
            const response = await fetch(url, {
              headers: {
                Accept: "application/json",
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...(options.headers || {})
              },
              ...options
            });

            if (!response.ok) {
              let message = "Request failed.";
              try {
                const payload = await response.json();
                message = payload.error || message;
              } catch (parseError) {
                message = response.statusText || message;
              }
              throw new Error(message);
            }

            return response.status === 204 ? null : response.json();
          },
          async fetchCourses() {
            try {
              const payload = await this.apiFetch("/api/courses");
              this.courses = (payload && payload.courses ? payload.courses : DEFAULT_COURSES).map(course => this.normalizeCourse(course));
              this.writeLocalCourses(this.courses);
              this.offlineMode = false;
              if (this.error && this.error.includes("browser cache mode")) {
                this.error = "";
              }
            } catch (fetchError) {
              const localCourses = this.readLocalCourses();
              this.courses = (localCourses || DEFAULT_COURSES).map(course => this.normalizeCourse(course));
              this.writeLocalCourses(this.courses);
              this.enableLocalMode("Course service is temporarily unavailable. Running in browser cache mode.");
            }
          },
          async fetchEnrollments() {
            try {
              const payload = await this.apiFetch("/api/enrollments");
              this.enrollments = {
                ...this.enrollments,
                [this.currentUserKey]: payload && payload.courseIds ? payload.courseIds : []
              };
              this.writeLocalEnrollments(this.enrollments);
            } catch (fetchError) {
              this.enrollments = this.readLocalEnrollments();
              this.error = "Enrollment service is unavailable. Using browser cache mode for enrollments.";
            }
          },
          isEnrolled(courseId) {
            return this.enrolledCourseIds.includes(courseId);
          },
          async toggleEnrollment(courseId) {
            if (!this.isAuthenticated) {
              return;
            }

            const current = [...this.enrolledCourseIds];
            const next = current.includes(courseId)
              ? current.filter(id => id !== courseId)
              : [...current, courseId];

            this.enrollments = {
              ...this.enrollments,
              [this.currentUserKey]: next
            };

            try {
              await this.apiFetch("/api/enrollments/save", {
                method: "POST",
                body: JSON.stringify({ courseIds: next })
              });
            } catch (saveError) {
              this.error = "Enrollment service is unavailable. Saved changes in browser cache.";
            }

            this.writeLocalEnrollments(this.enrollments);
          },
          editCourse(course) {
            this.draftCourse = { ...course };
            this.selectedFiles = {
              detailPath: null,
              videoUrl: null,
              documentUrl: null,
              pdfUrl: null
            };
          },
          resetDraftCourse() {
            this.draftCourse = emptyDraftCourse();
            this.selectedFiles = {
              detailPath: null,
              videoUrl: null,
              documentUrl: null,
              pdfUrl: null
            };
          },
          async saveCourse() {
            this.savingCourse = true;
            const normalized = this.normalizeCourse({
              ...this.draftCourse,
              id: this.draftCourse.id || this.slugify(this.draftCourse.title)
            });

            try {
              const payload = await this.apiFetch("/api/courses/save", {
                method: "POST",
                body: JSON.stringify({ course: normalized })
              });

              this.courses = (payload && payload.courses ? payload.courses : []).map(course => this.normalizeCourse(course));
              this.writeLocalCourses(this.courses);
              this.offlineMode = false;
              this.resetDraftCourse();
            } catch (saveError) {
              this.error = "Course API is unavailable. Saved changes in browser cache.";
              this.upsertLocalCourse(normalized);
              this.resetDraftCourse();
            } finally {
              this.savingCourse = false;
            }
          },
          async deleteCourse(courseId) {
            try {
              const payload = await this.apiFetch("/api/courses/delete/" + encodeURIComponent(courseId), {
                method: "DELETE"
              });

              this.courses = (payload && payload.courses ? payload.courses : []).map(course => this.normalizeCourse(course));
              this.writeLocalCourses(this.courses);

              const nextEnrollments = {};
              Object.keys(this.enrollments).forEach(key => {
                nextEnrollments[key] = (this.enrollments[key] || []).filter(id => id !== courseId);
              });
              this.enrollments = nextEnrollments;
              this.writeLocalEnrollments(this.enrollments);
            } catch (deleteError) {
              this.error = "Course API is unavailable. Saved deletion in browser cache.";
              this.removeLocalCourse(courseId);
            }
          },
          slugify(value) {
            return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          },
          normalizeCourse(course) {
            return {
              ...course,
              detailPath: course.detailPath || course.materialPath || "",
              videoUrl: course.videoUrl || "",
              documentUrl: course.documentUrl || "",
              pdfUrl: course.pdfUrl || "",
              downloadName: course.downloadName || "course-resource"
            };
          },
          setSelectedFile(fieldKey, event) {
            const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
            this.selectedFiles = {
              ...this.selectedFiles,
              [fieldKey]: file
            };

            if (file && !this.draftCourse.downloadName) {
              this.draftCourse.downloadName = file.name;
            }
          },
          uploadLabel(fieldKey) {
            return this.uploadingField === fieldKey ? "Uploading..." : "Upload";
          },
          async uploadSelectedFile(fieldKey, resourceType) {
            const file = this.selectedFiles[fieldKey];
            if (!file) {
              this.error = "Choose a file before uploading.";
              return;
            }

            const courseId = this.draftCourse.id || this.slugify(this.draftCourse.title || "course");
            this.uploadingField = fieldKey;
            this.error = "";

            try {
              const payload = await this.apiFetch("/api/assets/upload-url", {
                method: "POST",
                body: JSON.stringify({
                  courseId,
                  resourceType,
                  fileName: file.name,
                  contentType: file.type || "application/octet-stream"
                })
              });

              const chunkSize = payload.maxChunkSize || 60 * 1024 * 1024;
              const total = file.size;
              let start = 0;
              let uploadedFileUrl = payload.blobUrl;

              while (start < total) {
                const end = Math.min(start + chunkSize, total);
                const chunk = file.slice(start, end);
                const uploadResponse = await fetch(payload.uploadUrl, {
                  method: "PUT",
                  headers: {
                    "Content-Range": `bytes ${start}-${end - 1}/${total}`,
                    "Content-Type": file.type || "application/octet-stream"
                  },
                  body: chunk
                });

                if (![200, 201, 202].includes(uploadResponse.status)) {
                  const uploadErrorBody = await uploadResponse.text();
                  throw new Error(uploadErrorBody || "File upload failed.");
                }

                if (uploadResponse.status === 200 || uploadResponse.status === 201) {
                  try {
                    const completedItem = await uploadResponse.json();
                    if (completedItem && completedItem.webUrl) {
                      uploadedFileUrl = completedItem.webUrl;
                    }
                  } catch (parseError) {
                    // Final response can be empty; keep fallback URL.
                  }
                }

                start = end;
              }

              this.draftCourse[fieldKey] = uploadedFileUrl;
              if (!this.draftCourse.downloadName) {
                this.draftCourse.downloadName = file.name;
              }
            } catch (uploadError) {
              this.error = uploadError.message || "Upload failed.";
            } finally {
              this.uploadingField = "";
            }
          },
          enableLocalMode(message) {
            this.offlineMode = true;
            this.error = message;
          },
          localCoursesKey() {
            return "learninghub:courses";
          },
          localEnrollmentsKey() {
            return "learninghub:enrollments";
          },
          readLocalCourses() {
            try {
              const payload = localStorage.getItem(this.localCoursesKey());
              if (!payload) {
                return null;
              }
              const parsed = JSON.parse(payload);
              return Array.isArray(parsed) ? parsed : null;
            } catch (readError) {
              return null;
            }
          },
          writeLocalCourses(courses) {
            try {
              localStorage.setItem(this.localCoursesKey(), JSON.stringify(courses || []));
            } catch (writeError) {
              // Ignore local storage write failures to avoid blocking UX.
            }
          },
          readLocalEnrollments() {
            try {
              const payload = localStorage.getItem(this.localEnrollmentsKey());
              if (!payload) {
                return {};
              }
              const parsed = JSON.parse(payload);
              return parsed && typeof parsed === "object" ? parsed : {};
            } catch (readError) {
              return {};
            }
          },
          writeLocalEnrollments(enrollments) {
            try {
              localStorage.setItem(this.localEnrollmentsKey(), JSON.stringify(enrollments || {}));
            } catch (writeError) {
              // Ignore local storage write failures to avoid blocking UX.
            }
          },
          upsertLocalCourse(course) {
            const existingIndex = this.courses.findIndex(item => item.id === course.id);
            if (existingIndex === -1) {
              this.courses = [...this.courses, course];
            } else {
              const next = [...this.courses];
              next.splice(existingIndex, 1, course);
              this.courses = next;
            }
            this.writeLocalCourses(this.courses);
          },
          removeLocalCourse(courseId) {
            this.courses = this.courses.filter(course => course.id !== courseId);
            this.writeLocalCourses(this.courses);

            const nextEnrollments = {};
            Object.keys(this.enrollments).forEach(key => {
              nextEnrollments[key] = (this.enrollments[key] || []).filter(id => id !== courseId);
            });
            this.enrollments = nextEnrollments;
            this.writeLocalEnrollments(this.enrollments);
          },
          downloadTarget(course) {
            return course.pdfUrl || course.documentUrl || course.detailPath || "";
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
        width: min(1120px, 100%);
        padding: 2.5rem;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 24px 80px rgba(16, 35, 61, 0.14);
        backdrop-filter: blur(8px);
      }

      .head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
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
        flex-wrap: wrap;
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

      .summary,
      .status,
      .course-description,
      .hint,
      .identity-provider,
      .identity-roles {
        font-size: 1rem;
        line-height: 1.6;
      }

      .summary {
        margin: 1rem 0 0;
        max-width: 72ch;
      }

      .status {
        margin: 1.5rem 0 0;
      }

      .error {
        color: #9f1239;
      }

      .panel-grid {
        margin-top: 1.75rem;
        display: grid;
        grid-template-columns: 1.1fr 1.3fr;
        gap: 1.25rem;
      }

      .profile-layout {
        grid-template-columns: 1.2fr 0.8fr;
      }

      .home-experience {
        margin-top: 1.75rem;
        display: grid;
        gap: 1.15rem;
      }

      .hero-banner {
        background:
          linear-gradient(135deg, rgba(6, 39, 91, 0.94), rgba(12, 76, 145, 0.92)),
          radial-gradient(circle at top right, rgba(255, 255, 255, 0.2), transparent 40%);
        color: #f8fbff;
        border: 0;
      }

      .hero-banner h2 {
        margin: 0.5rem 0 0;
        font-size: clamp(1.8rem, 3.5vw, 2.5rem);
        line-height: 1.15;
      }

      .hero-banner p {
        max-width: 74ch;
      }

      .mini-kicker {
        margin: 0;
        font-size: 0.78rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 700;
        opacity: 0.95;
      }

      .section-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .section-nav a {
        text-decoration: none;
        font-weight: 700;
        color: #0a5fb4;
        border: 1px solid rgba(10, 95, 180, 0.3);
        border-radius: 999px;
        padding: 0.5rem 0.85rem;
        background: #fff;
      }

      .section-panel {
        scroll-margin-top: 1.25rem;
      }

      .panel {
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid rgba(16, 35, 61, 0.1);
        border-radius: 18px;
        padding: 1.35rem;
      }

      .panel h2 {
        margin: 0 0 0.75rem;
        font-size: 1.2rem;
      }

      .compact-hint {
        margin-top: -0.1rem;
      }

      .hero-panel p {
        margin-top: 0.5rem;
      }

      .hero-stats {
        margin-top: 1.25rem;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.85rem;
      }

      .hero-stats div {
        border-radius: 16px;
        padding: 0.9rem;
        background: rgba(10, 95, 180, 0.08);
      }

      .hero-stats span {
        display: block;
        font-size: 1.6rem;
        font-weight: 700;
      }

      .hero-stats p {
        margin: 0.2rem 0 0;
        color: #475569;
      }

      .news-list {
        margin: 0.2rem 0 0;
        padding-left: 1.2rem;
        color: #334155;
        display: grid;
        gap: 0.5rem;
      }

      .portfolio-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.8rem;
      }

      .portfolio-item {
        border: 1px solid rgba(16, 35, 61, 0.1);
        border-radius: 14px;
        padding: 0.8rem;
        background: rgba(244, 247, 251, 0.75);
      }

      .portfolio-item h3 {
        margin: 0 0 0.35rem;
        font-size: 1rem;
      }

      .portfolio-item p {
        margin: 0;
        color: #475569;
      }

      .course-list {
        display: grid;
        gap: 1rem;
      }

      .compact-list {
        gap: 0.8rem;
      }

      .course-card {
        border: 1px solid rgba(16, 35, 61, 0.1);
        border-radius: 16px;
        padding: 1rem;
        background: rgba(244, 247, 251, 0.72);
      }

      .compact-card {
        background: #fff;
      }

      .course-head {
        display: flex;
        justify-content: space-between;
        gap: 0.8rem;
        align-items: flex-start;
      }

      .course-track {
        margin: 0 0 0.25rem;
        color: #0a5fb4;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .course-head h3 {
        margin: 0;
        font-size: 1.05rem;
      }

      .pill {
        border-radius: 999px;
        padding: 0.35rem 0.7rem;
        background: rgba(16, 35, 61, 0.08);
        font-size: 0.8rem;
        font-weight: 700;
      }

      .course-description {
        margin: 0.85rem 0 0;
      }

      .course-meta {
        margin: 0.85rem 0 0;
        padding-left: 1rem;
        color: #475569;
      }

      .course-actions,
      .actions-row,
      .admin-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
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
        border: 0;
        cursor: pointer;
      }

      .button.secondary {
        background: #10233d;
      }

      .button.small {
        padding: 0.65rem 0.95rem;
        font-size: 0.9rem;
      }

      .hint {
        margin: 0.9rem 0 0;
        color: #475569;
      }

      .account-card {
        margin-top: 1.75rem;
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

      .tenant,
      .identity-name {
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
        font-size: 1.08rem;
      }

      .quick-links,
      .profile-links {
        margin-top: 0.75rem;
        display: grid;
        gap: 0.55rem;
      }

      .account-link {
        color: #0a5fb4;
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 2px;
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

      .admin-form {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.9rem;
      }

      .admin-form label {
        display: grid;
        gap: 0.35rem;
        font-weight: 700;
        color: #334155;
      }

      .admin-form .full-width {
        grid-column: 1 / -1;
      }

      .asset-field {
        display: grid;
        gap: 0.65rem;
        border: 1px solid rgba(16, 35, 61, 0.08);
        background: rgba(244, 247, 251, 0.55);
        border-radius: 12px;
        padding: 0.85rem;
      }

      .upload-inline {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .file-select {
        display: grid;
        gap: 0.35rem;
        min-width: min(420px, 100%);
      }

      .selected-file {
        margin: 0;
        font-size: 0.9rem;
        color: #475569;
      }

      .admin-form input,
      .admin-form select,
      .admin-form textarea {
        border: 1px solid rgba(16, 35, 61, 0.16);
        border-radius: 12px;
        padding: 0.8rem 0.9rem;
        font: inherit;
        background: #fff;
      }

      code {
        padding: 0.1rem 0.35rem;
        border-radius: 6px;
        background: rgba(16, 35, 61, 0.08);
      }

      @media (max-width: 860px) {
        .panel-grid,
        .profile-layout,
        .admin-form {
          grid-template-columns: 1fr;
        }

        .portfolio-grid {
          grid-template-columns: 1fr;
        }

        .section-nav {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 640px) {
        .shell {
          padding: 1rem;
        }

        .card {
          padding: 1.5rem;
        }

        .head,
        .course-head,
        .identity-block {
          display: grid;
          grid-template-columns: 1fr;
        }

        .hero-stats {
          grid-template-columns: 1fr;
        }

        .section-nav {
          grid-template-columns: 1fr;
        }
      }
    </style>
