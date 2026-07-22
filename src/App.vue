<template>
  <main class="shell">
    <section class="card">
            <nav class="nav">
              <div class="nav-links">
                <a class="nav-brand" href="/" aria-label="Valuearc home">
                  <img class="nav-brand-logo" src="/valuearc-logo.svg" alt="Valuearc logo">
                </a>
                <a href="/" :class="showHome ? 'active' : ''">Home</a>
                <a href="/about" :class="isAboutRoute ? 'active' : ''">About Us</a>
                <a href="/vision" :class="isVisionRoute ? 'active' : ''">Vision</a>
                <a href="/contact" :class="isContactRoute ? 'active' : ''">Contact</a>
                <a href="/news-media" :class="isNewsRoute ? 'active' : ''">News & Media</a>
                <a href="/services-portfolio" :class="isPortfolioRoute ? 'active' : ''">Services</a>
                <a href="/trainings" :class="isTrainingsRoute ? 'active' : ''">Trainings</a>
              </div>
              <div v-if="showHome && !isAuthenticated" class="nav-auth">
                <a class="nav-auth-link signin" href="/login">Sign In</a>
                <a class="nav-auth-link signup" href="/.auth/login/aad?post_login_redirect_uri=/trainings">Sign Up</a>
              </div>
            </nav>

            <header class="head">
              <div>
                <p class="eyebrow">VALUEARC.NET</p>
                <h1>{{ pageTitle }}</h1>
              </div>
              <div class="header-actions">
                <span v-if="isAuthenticated && !isInternalUser" class="badge neutral">
                  Guest
                </span>
                <a v-if="isAuthenticated" class="employee-login" href="/profile">{{ userTypeLabel }} Login</a>
                <a v-if="isAdministrator" class="employee-link" href="/admin">Admin</a>
              </div>
            </header>

            <p class="summary" v-if="isAdminRoute">
              Manage the Microsoft cloud training catalog. Files are uploaded to SharePoint and
              course metadata is stored server-side through Azure Functions.
            </p>
            <p class="summary" v-else-if="isProfileRoute">
              Review your registered courses, open training materials, and manage your Microsoft Entra
              account links.
            </p>
            <p class="summary" v-else-if="isAboutRoute">
              Learn more about Valuearc.net and how we support clients with consulting and talent solutions.
            </p>
            <p class="summary" v-else-if="isVisionRoute">
              Explore the long-term direction and strategic vision that guides our consulting practice.
            </p>
            <p class="summary" v-else-if="isContactRoute">
              Reach our team for hiring support, partnership conversations, and candidate assistance.
            </p>
            <p class="summary" v-else-if="isNewsRoute">
              Follow our latest announcements, industry updates, and media mentions.
            </p>
            <p class="summary" v-else-if="isPortfolioRoute">
              Review our job consultancy services portfolio and engagement models.
            </p>
            <p class="summary" v-else-if="isTrainingsRoute">
              Browse the training catalog and register for courses. Guest users can sign in or self sign up.
            </p>
            <p class="summary" v-else>
              Explore current job openings, connect with our consultants, and follow company
              updates from one place.
            </p>

            <p v-if="loading" class="status">Loading user and training catalog...</p>
            <p v-if="!loading && error" class="status error">{{ error }}</p>

            <template v-if="!loading">
              <section v-if="showHome" class="home-experience">
                <article class="hero-banner panel">
                  <div class="hero-layout">
                    <div class="hero-content-panel">
                      <p class="mini-kicker">Valuearc.net Consulting</p>
                      <h2>Consulting, talent, and delivery support for ambitious businesses</h2>
                      <p class="hero-copy">
                        Valuearc.net helps organizations solve growth, transformation, and hiring challenges
                        with practical consulting expertise, specialist search capability, and execution-focused support.
                      </p>
                      <div class="hero-proof-line">
                        <span>Strategy Advisory</span>
                        <span>Talent Search</span>
                        <span>Business Transformation</span>
                      </div>
                      <div class="hero-cta-row">
                        <a class="button" href="/services-portfolio">Explore Services</a>
                        <a class="button ghost" href="/contact">Talk to an Expert</a>
                      </div>
                      <div class="actions-row" v-if="!isAuthenticated">
                        <a class="hero-signin" href="/login">Employee or Guest login to track opportunities</a>
                      </div>
                      <div class="hero-trust-strip" aria-label="Valuearc strengths">
                        <div>
                          <strong>Enterprise-ready</strong>
                          <span>Consulting engagements designed for measurable outcomes</span>
                        </div>
                        <div>
                          <strong>Specialist network</strong>
                          <span>Cross-functional talent across consulting, delivery, and operations</span>
                        </div>
                      </div>
                    </div>

                    <div class="hero-visuals" aria-hidden="true">
                      <div class="hero-photo hero-photo-main">
                        <div class="photo-label">
                          <strong>Advisory Excellence</strong>
                          <span>Business transformation and talent strategy</span>
                        </div>
                      </div>
                      <div class="hero-photo-grid">
                        <div class="hero-photo hero-photo-team"></div>
                        <div class="hero-photo hero-photo-growth"></div>
                      </div>
                    </div>
                  </div>

                  <div class="hero-metrics hero-metrics-home">
                    <div>
                      <strong>{{ jobOpenings.length }}</strong>
                      <p>Open opportunities</p>
                    </div>
                    <div>
                      <strong>40+</strong>
                      <p>Consulting specialists</p>
                    </div>
                    <div>
                      <strong>12</strong>
                      <p>Industry verticals served</p>
                    </div>
                    <div>
                      <strong>95%</strong>
                      <p>Client retention focus</p>
                    </div>
                  </div>
                </article>

                <article class="panel spotlight-panel">
                  <div class="spotlight-copy">
                    <p class="mini-kicker dark-kicker">What We Do</p>
                    <h2>Supporting growth through consulting and workforce capability</h2>
                    <p>
                      We help organizations strengthen hiring, operational delivery, and market readiness.
                      Our teams work across permanent hiring, contract staffing, leadership search, and
                      advisory programs that accelerate business outcomes.
                    </p>
                  </div>
                  <div class="spotlight-grid">
                    <article class="spotlight-card">
                      <span>01</span>
                      <h3>Consulting Advisory</h3>
                      <p>Business-aligned guidance for workforce planning, transformation, and capability building.</p>
                    </article>
                    <article class="spotlight-card">
                      <span>02</span>
                      <h3>Talent Solutions</h3>
                      <p>Specialist sourcing and placement across leadership, technical, and delivery roles.</p>
                    </article>
                    <article class="spotlight-card">
                      <span>03</span>
                      <h3>Delivery Support</h3>
                      <p>Flexible support models that help clients execute critical projects with confidence.</p>
                    </article>
                  </div>
                </article>

                <article class="panel sectors-panel">
                  <div class="sectors-head">
                    <div>
                      <p class="mini-kicker dark-kicker">Focus Areas</p>
                      <h2>Where Valuearc.net creates impact</h2>
                    </div>
                  </div>
                  <div class="sector-grid">
                    <article class="sector-card sector-card-consulting">
                      <div>
                        <h3>Business Consulting</h3>
                        <p>Strategy, operations, transformation, and program support.</p>
                      </div>
                    </article>
                    <article class="sector-card sector-card-hiring">
                      <div>
                        <h3>Talent Acquisition</h3>
                        <p>Permanent, contract, and executive search services.</p>
                      </div>
                    </article>
                    <article class="sector-card sector-card-careers">
                      <div>
                        <h3>Career Growth</h3>
                        <p>Candidate support, career mobility, and leadership pathways.</p>
                      </div>
                    </article>
                  </div>
                </article>

              </section>

              <section v-if="isAboutRoute" class="panel-grid single-panel-layout">
                <article class="panel section-panel">
                  <h2>About Us</h2>
                  <p>
                    Valuearc.net is a consulting and talent advisory firm committed to helping organizations
                    solve business challenges with the right combination of strategy, execution support, and
                    specialist hiring. We work with clients to strengthen delivery capability, improve workforce
                    planning, and place professionals who can contribute from day one.
                  </p>
                  <p>
                    Our team combines market knowledge, disciplined search practices, and practical business
                    insight to support both employers and candidates. The result is a more thoughtful, reliable,
                    and outcome-focused consulting experience.
                  </p>
                  <div class="page-media-grid" aria-label="About visual highlights">
                    <figure class="media-card">
                      <img
                        class="page-gif"
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80"
                        alt="Consulting team collaboration"
                        loading="lazy"
                      >
                      <figcaption>Collaborative consulting workshops that align teams quickly.</figcaption>
                    </figure>
                    <figure class="media-card">
                      <img
                        class="page-gif"
                        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80"
                        alt="Consulting team in strategy discussion"
                        loading="lazy"
                      >
                      <figcaption>Advisory engagements driven by business outcomes.</figcaption>
                    </figure>
                  </div>
                </article>
              </section>

              <section v-if="isVisionRoute" class="panel-grid single-panel-layout">
                <article class="panel section-panel">
                  <h2>Vision</h2>
                  <p>
                    Our vision is to become a trusted consulting and recruitment partner for organizations that
                    value quality, transparency, and measurable results. We aim to build long-term relationships
                    by helping clients create high-performing teams and helping professionals find meaningful,
                    growth-oriented opportunities.
                  </p>
                  <p>
                    We believe the future belongs to firms that combine people expertise with operational clarity,
                    digital readiness, and a strong commitment to delivery excellence.
                  </p>
                  <div class="page-media-grid" aria-label="Vision visual highlights">
                    <figure class="media-card">
                      <img
                        class="page-gif"
                        src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1000&q=80"
                        alt="Enterprise strategic planning workshop"
                        loading="lazy"
                      >
                      <figcaption>Strategic direction supported by measurable transformation plans.</figcaption>
                    </figure>
                    <figure class="media-card">
                      <img
                        class="page-gif"
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80"
                        alt="Business growth dashboard"
                        loading="lazy"
                      >
                      <figcaption>Future-ready capability building for long-term competitiveness.</figcaption>
                    </figure>
                  </div>
                </article>
              </section>

              <section v-if="isContactRoute" class="panel-grid single-panel-layout">
                <article class="panel section-panel">
                  <h2>Contact</h2>
                  <p>
                    We welcome discussions with employers, hiring managers, candidates, and strategic partners.
                    Whether you need recruitment support, consulting guidance, or more information about our
                    services, our team is ready to assist.
                  </p>
                  <div class="profile-links">
                    <a class="link-chip" href="mailto:careers@valuearc.net">careers@valuearc.net</a>
                    <a class="link-chip" href="tel:+18005550199">+1 (800) 555-0199</a>
                    <a class="link-chip" href="mailto:media@valuearc.net">media@valuearc.net</a>
                    <span class="hint">Business hours: Monday to Friday, 9:00 AM to 6:00 PM</span>
                  </div>
                  <div class="page-media-grid" aria-label="Contact visual highlights">
                    <figure class="media-card">
                      <img
                        class="page-gif"
                        src="https://images.unsplash.com/photo-1573164574396-6ad8d9f3f521?auto=format&fit=crop&w=1000&q=80"
                        alt="Enterprise customer support team"
                        loading="lazy"
                      >
                      <figcaption>Fast response and dedicated support for clients and candidates.</figcaption>
                    </figure>
                    <figure class="media-card">
                      <img
                        class="page-gif"
                        src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80"
                        alt="Support desk and communication"
                        loading="lazy"
                      >
                      <figcaption>Connect with our specialists for hiring and consulting needs.</figcaption>
                    </figure>
                  </div>
                </article>
              </section>

              <section v-if="isNewsRoute" class="panel-grid single-panel-layout">
                <article class="panel section-panel">
                  <h2>News and Media</h2>
                  <p>
                    This section highlights company updates, market insights, partnership announcements,
                    and leadership perspectives from Valuearc.net. It reflects the conversations and trends
                    that shape our consulting and talent advisory work.
                  </p>
                  <div class="news-grid" aria-label="Latest updates">
                    <article class="news-card">
                      <p class="news-meta">July 2026 · Market Outlook</p>
                      <h3>Quarterly Hiring Pulse for Digital and Cloud Teams</h3>
                      <p>
                        Our latest market report covers compensation benchmarks, high-demand skill clusters,
                        and practical hiring guidance for growth-stage organizations.
                      </p>
                    </article>
                    <article class="news-card">
                      <p class="news-meta">June 2026 · Partnership</p>
                      <h3>Talent Delivery Alliance Expanded Across North America</h3>
                      <p>
                        Valuearc.net expanded its consulting partner network to support enterprise clients
                        with faster specialist onboarding and broader delivery coverage.
                      </p>
                    </article>
                    <article class="news-card">
                      <p class="news-meta">May 2026 · Webinar</p>
                      <h3>Leadership Session on Workforce Transformation</h3>
                      <p>
                        Senior advisors shared operating models for building resilient teams and improving
                        hiring velocity without compromising quality.
                      </p>
                    </article>
                  </div>
                  <ul class="news-list">
                    <li>Valuearc.net publishes a quarterly consulting and hiring market outlook report.</li>
                    <li>New partnership launched to support digital, analytics, and transformation hiring programs.</li>
                    <li>Leadership webinar announced on future-ready workforce planning and capability building.</li>
                    <li>Customer success stories are now released monthly with measurable delivery outcomes.</li>
                    <li>Press briefing packs are available for media and analyst conversations.</li>
                    <li>Community events and career clinics are announced every quarter.</li>
                  </ul>
                  <p class="news-note">
                    Media and analyst requests: <a href="mailto:media@valuearc.net">media@valuearc.net</a>
                  </p>
                  <div class="social-links">
                    <a class="link-chip" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                      <span class="social-icon social-facebook" aria-hidden="true">f</span>
                      Follow on Facebook
                    </a>
                    <a class="link-chip" href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                      <span class="social-icon social-twitter" aria-hidden="true">x</span>
                      Follow on Twitter
                    </a>
                    <a class="link-chip" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                      <span class="social-icon social-instagram" aria-hidden="true">ig</span>
                      Follow on Instagram
                    </a>
                    <a class="link-chip" href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                      <span class="social-icon social-youtube" aria-hidden="true">yt</span>
                      Follow on YouTube
                    </a>
                  </div>
                </article>
              </section>

              <section v-if="isPortfolioRoute" class="panel-grid single-panel-layout">
                <article class="panel section-panel">
                  <h2>Job Consultancy Services Portfolio</h2>
                  <p>
                    Our portfolio is designed to support organizations across the full hiring lifecycle,
                    from strategic leadership mandates to scalable recruitment programs and early-career talent
                    development. Every engagement is tailored to business goals, speed requirements, and market complexity.
                  </p>
                  <div class="portfolio-grid">
                    <div class="portfolio-item">
                      <h3>Executive Search</h3>
                      <p>Leadership search for strategic, confidential, and business-critical mandates.</p>
                    </div>
                    <div class="portfolio-item">
                      <h3>Permanent Hiring</h3>
                      <p>End-to-end sourcing, screening, and placement for permanent roles.</p>
                    </div>
                    <div class="portfolio-item">
                      <h3>Contract Staffing</h3>
                      <p>Flexible workforce support for project delivery, transformation, and specialist needs.</p>
                    </div>
                    <div class="portfolio-item">
                      <h3>Campus and Early Careers</h3>
                      <p>Graduate hiring pipelines, internship programs, and early-career talent development.</p>
                    </div>
                  </div>
                </article>
              </section>

              <section v-if="isTrainingsRoute" class="panel-grid single-panel-layout">
                <article class="panel section-panel">
                  <h2>Training Catalog</h2>
                  <p>
                    Explore available training tracks and register for the courses you want to complete.
                    You can view all courses as a guest. Sign in or self sign up to register.
                  </p>
                  <div class="actions-row" v-if="!isAuthenticated">
                    <a class="button" href="/login">Login to register</a>
                    <a class="button secondary" href="/.auth/login/aad?post_login_redirect_uri=/trainings">Self Sign Up</a>
                  </div>
                  <div class="course-list">
                    <article v-for="course in courses" :key="course.id" class="course-card">
                      <div class="course-head">
                        <div>
                          <p class="course-track">{{ course.category }}</p>
                          <h3>{{ course.title }}</h3>
                        </div>
                        <span class="pill">{{ course.level }}</span>
                      </div>

                      <p class="course-description">{{ course.description }}</p>

                      <ul class="course-meta">
                        <li>Format: {{ course.format }}</li>
                        <li>Duration: {{ course.duration }}</li>
                      </ul>

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
                        <button
                          v-if="isAuthenticated"
                          class="button small"
                          type="button"
                          @click="toggleEnrollment(course.id)"
                        >
                          {{ isEnrolled(course.id) ? 'Unregister' : 'Register course' }}
                        </button>
                        <a v-else class="button small" href="/login">Register</a>
                      </div>
                    </article>
                  </div>
                </article>
              </section>

              <section v-if="isProfileRoute" class="panel-grid profile-layout">
                <section v-if="isAuthenticated" class="account-card profile-account-card">
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
                      <p class="identity-provider">Account type: {{ userTypeLabel }}</p>
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

              <section v-if="!isAdminRoute && !isProfileRoute" class="quick-links-footer" aria-label="Quick navigation links">
                <nav class="quick-links-strip">
                  <a href="/" :class="showHome ? 'active' : ''">Home</a>
                  <a href="/about" :class="isAboutRoute ? 'active' : ''">About Us</a>
                  <a href="/vision" :class="isVisionRoute ? 'active' : ''">Vision</a>
                  <a href="/contact" :class="isContactRoute ? 'active' : ''">Contact</a>
                  <a href="/news-media" :class="isNewsRoute ? 'active' : ''">News & Media</a>
                  <a href="/services-portfolio" :class="isPortfolioRoute ? 'active' : ''">Services</a>
                  <a href="/trainings" :class="isTrainingsRoute ? 'active' : ''">Trainings</a>
                </nav>
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
            resolvedUserEmail: "",
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
          userEmail() {
            if (this.resolvedUserEmail) {
              return this.resolvedUserEmail;
            }

            return this.user && this.user.userDetails ? this.user.userDetails.toLowerCase() : "";
          },
          userDomain() {
            if (!this.userEmail || !this.userEmail.includes("@")) {
              return "";
            }

            return this.userEmail.split("@")[1].trim();
          },
          hasGuestRole() {
            const roles = this.user && Array.isArray(this.user.userRoles) ? this.user.userRoles : [];
            return roles.some(role => String(role || "").toLowerCase() === "guest");
          },
          hasGuestClaim() {
            const claims = this.user && Array.isArray(this.user.claims) ? this.user.claims : [];
            const guestClaimTypes = ["usertype", "role", "groups", "wids"];

            return claims.some(claim => {
              const typ = String((claim && claim.typ) || "").toLowerCase();
              const val = String((claim && claim.val) || "").toLowerCase();
              if (!val) {
                return false;
              }

              const typeMatch = guestClaimTypes.some(candidate => typ.includes(candidate));
              return typeMatch && (val === "guest" || val.includes("external"));
            });
          },
          isInternalDomain() {
            if (!this.userDomain) {
              return false;
            }

            return this.userDomain === "valuearc.net"
              || this.userDomain.endsWith(".valuearc.net")
              || this.userDomain === "valuearcnet.onmicrosoft.com"
              || this.userDomain.endsWith(".onmicrosoft.com");
          },
          isInternalUser() {
            if (!this.isAuthenticated) {
              return false;
            }

            // Explicit guest markers from Entra should always be treated as guest accounts.
            if (this.hasGuestRole || this.hasGuestClaim) {
              return false;
            }

            if (this.isInternalDomain) {
              return true;
            }

            // If we cannot resolve a reliable domain or claim, default to employee to prevent false guest labels.
            if (!this.userDomain) {
              return true;
            }

            return false;
          },
          userTypeLabel() {
            if (!this.isAuthenticated) {
              return "Employee";
            }

            return this.isInternalUser ? "Employee" : "Guest";
          },
          isProfileRoute() {
            return this.currentPath.startsWith("/profile");
          },
          isAdminRoute() {
            return this.currentPath.startsWith("/admin");
          },
          isAboutRoute() {
            return this.currentPath.startsWith("/about");
          },
          isVisionRoute() {
            return this.currentPath.startsWith("/vision");
          },
          isContactRoute() {
            return this.currentPath.startsWith("/contact");
          },
          isNewsRoute() {
            return this.currentPath.startsWith("/news-media");
          },
          isPortfolioRoute() {
            return this.currentPath.startsWith("/services-portfolio");
          },
          isTrainingsRoute() {
            return this.currentPath.startsWith("/trainings");
          },
          showHome() {
            return !this.isProfileRoute
              && !this.isAdminRoute
              && !this.isAboutRoute
              && !this.isVisionRoute
              && !this.isContactRoute
              && !this.isNewsRoute
              && !this.isPortfolioRoute
              && !this.isTrainingsRoute;
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

            if (this.isAboutRoute) {
              return "About Us";
            }

            if (this.isVisionRoute) {
              return "Vision";
            }

            if (this.isContactRoute) {
              return "Contact";
            }

            if (this.isNewsRoute) {
              return "News and Media";
            }

            if (this.isPortfolioRoute) {
              return "Job Consultancy Services Portfolio";
            }

            if (this.isTrainingsRoute) {
              return "Trainings";
            }

            return "Valuearc | The Innovation Center";
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
                this.resolvedUserEmail = this.resolvePrincipalEmail(this.user);
                this.avatarSrc = "/api/profile-photo";
              } else {
                this.resolvedUserEmail = "";
              }
            } catch (loadError) {
              this.user = null;
              this.resolvedUserEmail = "";
            }
          },
          resolvePrincipalEmail(principal) {
            const candidates = [];

            if (principal && principal.userDetails) {
              candidates.push(principal.userDetails);
            }

            const claims = principal && Array.isArray(principal.claims) ? principal.claims : [];
            const preferredClaimTypes = [
              "preferred_username",
              "email",
              "emails",
              "upn",
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"
            ];

            preferredClaimTypes.forEach(type => {
              const claim = claims.find(item => (item.typ || "").toLowerCase() === type.toLowerCase());
              if (claim && claim.val) {
                candidates.push(claim.val);
              }
            });

            for (let index = 0; index < candidates.length; index += 1) {
              const value = String(candidates[index] || "").trim().toLowerCase();
              if (value.includes("@")) {
                return value;
              }
            }

            return "";
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
        --royal-900: #111f66;
        --royal-800: #1a2f8a;
        --royal-700: #2b47b8;
        --royal-600: #3b63e6;
        --royal-500: #7ea3ff;
        --ink-900: #ecf2ff;
        --ink-700: #b8c7f2;
        --surface-soft: rgba(140, 168, 255, 0.12);
        --surface-card: rgba(12, 20, 48, 0.78);
        --border-soft: rgba(144, 170, 255, 0.28);
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem;
        font-family: "Segoe UI", "Segoe UI Variable", "Helvetica Neue", Arial, sans-serif;
        background:
          radial-gradient(circle at 12% 10%, rgba(101, 132, 255, 0.28), transparent 28%),
          radial-gradient(circle at 88% 12%, rgba(72, 108, 255, 0.2), transparent 30%),
          radial-gradient(circle at 50% 100%, rgba(16, 29, 83, 0.42), transparent 45%),
          linear-gradient(145deg, #060a1f 0%, #0a1234 50%, #0e1c49 100%);
        color: var(--ink-900);
      }

      .card {
        width: min(1120px, 100%);
        padding: 2.5rem;
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(12, 20, 48, 0.9), rgba(9, 17, 42, 0.84));
        border: 1px solid var(--border-soft);
        box-shadow: 0 26px 84px rgba(2, 6, 22, 0.55);
        backdrop-filter: blur(10px);
      }

      .head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 1rem;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .eyebrow {
        margin: 0 0 0.75rem;
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #9ab4ff;
      }

      h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 3.25rem);
        line-height: 1.05;
        font-family: "Segoe UI", "Segoe UI Variable", "Helvetica Neue", Arial, sans-serif;
        font-weight: 700;
        color: #f6f8ff;
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
        background: rgba(126, 163, 255, 0.14);
        color: #bdd0ff;
      }

      .employee-login,
      .employee-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        padding: 0.55rem 0.95rem;
        font-weight: 700;
        text-decoration: none;
      }

      .employee-login {
        background: linear-gradient(135deg, var(--royal-800), var(--royal-700));
        color: #fff;
        box-shadow: 0 10px 24px rgba(59, 99, 230, 0.34);
      }

      .employee-link {
        background: rgba(126, 163, 255, 0.14);
        color: #c5d5ff;
      }

      .nav {
        margin-top: 0;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding: 0.45rem 0.55rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        background: linear-gradient(180deg, rgba(19, 47, 131, 0.96), rgba(11, 31, 92, 0.96));
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        flex: 1 1 auto;
        min-width: max-content;
      }

      .nav-brand {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 52px;
        min-width: 52px;
        height: 44px;
        padding: 0;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.14);
        flex: 0 0 auto;
      }

      .nav-brand:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .nav-brand-logo {
        width: 28px;
        height: 28px;
        object-fit: contain;
        display: block;
      }

      .nav-auth {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        margin-left: 0.35rem;
        flex: 0 0 auto;
      }

      .nav-auth-link {
        text-decoration: none;
        font-weight: 700;
        font-size: 0.85rem;
        padding: 0.45rem 0.75rem;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.24);
        color: #fff;
        white-space: nowrap;
      }

      .nav-auth-link.signin {
        background: linear-gradient(135deg, #3b63e6, #2b47b8);
      }

      .nav-auth-link.signup {
        background: rgba(166, 190, 255, 0.18);
      }

      .nav::-webkit-scrollbar {
        display: none;
      }

      .nav a {
        text-decoration: none;
        color: rgba(255, 255, 255, 0.92);
        font-weight: 600;
        font-size: 0.95rem;
        padding: 0.6rem 0.85rem;
        border-radius: 4px;
        background: transparent;
        border: 1px solid transparent;
        white-space: nowrap;
        letter-spacing: 0.01em;
        flex: 0 0 auto;
        text-align: center;
        transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
      }

      .nav a:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.14);
        color: #fff;
      }

      .nav a.active {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.22);
        color: #fff;
        box-shadow: inset 0 -2px 0 #7ea3ff;
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
        color: #d2ddff;
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
          radial-gradient(circle at 88% 10%, rgba(145, 177, 255, 0.3), transparent 34%),
          linear-gradient(135deg, var(--royal-900), var(--royal-700));
        color: #f8fbff;
        border: 0;
        overflow: hidden;
        padding: 1.6rem;
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

      .dark-kicker {
        color: var(--royal-700);
        opacity: 1;
      }

      .hero-layout {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 1rem;
        align-items: center;
      }

      .hero-content-panel {
        padding: 1.5rem;
        border-radius: 22px;
        background: linear-gradient(180deg, rgba(12, 24, 61, 0.9), rgba(12, 20, 48, 0.86));
        border: 1px solid rgba(142, 168, 255, 0.28);
        box-shadow: 0 24px 40px rgba(2, 6, 22, 0.44);
        color: #eaf0ff;
      }

      .hero-copy {
        margin-top: 0.9rem;
        color: #bacaf0;
        font-size: 1.02rem;
      }

      .hero-cta-row {
        margin-top: 1rem;
        display: flex;
        gap: 0.7rem;
        flex-wrap: wrap;
      }

      .hero-banner .button {
        min-width: 180px;
        box-shadow: 0 10px 24px rgba(6, 24, 58, 0.2);
      }

      .hero-content-panel .button {
        box-shadow: 0 12px 26px rgba(30, 64, 175, 0.2);
      }

      .hero-content-panel .button.ghost {
        background: rgba(143, 169, 255, 0.14);
        color: #e8efff;
        border: 1px solid rgba(151, 175, 255, 0.35);
      }

      .hero-signin {
        color: var(--royal-700);
        font-weight: 700;
        text-decoration: none;
        border-bottom: 1px solid rgba(30, 64, 175, 0.35);
        width: fit-content;
      }

      .hero-signin:hover {
        color: var(--royal-800);
        border-bottom-color: rgba(18, 49, 127, 0.8);
      }

      .hero-proof-line {
        margin-top: 1rem;
        display: flex;
        gap: 0.65rem;
        flex-wrap: wrap;
      }

      .hero-proof-line span {
        border: 1px solid rgba(30, 64, 175, 0.2);
        border-radius: 999px;
        padding: 0.35rem 0.7rem;
        font-size: 0.82rem;
        font-weight: 700;
        background: rgba(30, 64, 175, 0.08);
        color: var(--royal-700);
      }

      .hero-trust-strip {
        margin-top: 1.2rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .hero-trust-strip div {
        padding-top: 0.85rem;
        border-top: 1px solid rgba(16, 35, 61, 0.08);
      }

      .hero-trust-strip strong,
      .hero-trust-strip span {
        display: block;
      }

      .hero-trust-strip span {
        margin-top: 0.25rem;
        font-size: 0.88rem;
        color: #b3c4ef;
      }

      .button.ghost {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.36);
        color: #f8fbff;
      }

      .hero-visuals {
        display: grid;
        gap: 0.75rem;
      }

      .hero-photo-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .hero-photo {
        position: relative;
        min-height: 180px;
        border-radius: 18px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background-size: cover;
        background-position: center;
        box-shadow: inset 0 -80px 100px rgba(7, 22, 48, 0.28);
      }

      .hero-photo-main {
        min-height: 270px;
        background-image:
          linear-gradient(180deg, rgba(5, 31, 71, 0.08), rgba(5, 31, 71, 0.56)),
          url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80');
      }

      .hero-photo-team {
        background-image:
          linear-gradient(180deg, rgba(5, 31, 71, 0.1), rgba(5, 31, 71, 0.5)),
          url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80');
      }

      .hero-photo-growth {
        background-image:
          linear-gradient(180deg, rgba(5, 31, 71, 0.1), rgba(5, 31, 71, 0.5)),
          url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80');
      }

      .photo-label {
        position: absolute;
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
      }

      .photo-label strong,
      .photo-label span {
        display: block;
      }

      .photo-label strong {
        font-size: 1.1rem;
      }

      .photo-label span {
        margin-top: 0.25rem;
        font-size: 0.92rem;
        opacity: 0.92;
      }

      .hero-metrics {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.7rem;
      }

      .hero-metrics-home {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .hero-metrics div {
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 12px;
        padding: 0.7rem;
        background: rgba(255, 255, 255, 0.08);
      }

      .hero-metrics strong {
        font-size: 1.4rem;
      }

      .hero-metrics p {
        margin: 0.2rem 0 0;
        font-size: 0.88rem;
        opacity: 0.95;
      }

      .home-links-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.85rem;
      }

      .quick-links-footer {
        margin-top: 2rem;
        padding-top: 0.85rem;
        padding-bottom: 0.15rem;
        border-top: 1px solid rgba(144, 170, 255, 0.24);
        position: relative;
        z-index: 0;
        clear: both;
      }

      .quick-links-strip {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding: 0.4rem 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        background: linear-gradient(180deg, rgba(19, 47, 131, 0.96), rgba(11, 31, 92, 0.96));
        scrollbar-width: none;
        -ms-overflow-style: none;
        width: 100%;
        box-sizing: border-box;
      }

      .quick-links-strip::-webkit-scrollbar {
        display: none;
      }

      .quick-links-strip a {
        text-decoration: none;
        color: rgba(255, 255, 255, 0.92);
        font-weight: 600;
        font-size: 0.86rem;
        padding: 0.45rem 0.7rem;
        border-radius: 4px;
        background: transparent;
        border: 1px solid transparent;
        white-space: nowrap;
        letter-spacing: 0.01em;
        flex: 0 0 auto;
        text-align: center;
      }

      .quick-links-strip a:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.14);
        color: #fff;
      }

      .quick-links-strip a.active {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.22);
        color: #fff;
        box-shadow: none;
      }

      .page-media-grid {
        margin-top: 0.4rem;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.85rem;
      }

      .media-card {
        margin: 0;
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid rgba(143, 169, 255, 0.22);
        background: rgba(16, 30, 73, 0.78);
      }

      .page-gif {
        display: block;
        width: 100%;
        height: 180px;
        object-fit: cover;
      }

      .media-card figcaption {
        padding: 0.65rem 0.75rem;
        font-size: 0.88rem;
        color: #c4d4fa;
      }

      .spotlight-panel,
      .sectors-panel,
      .home-links-panel {
        background: linear-gradient(180deg, rgba(13, 24, 58, 0.85), rgba(11, 20, 49, 0.84));
      }

      .sectors-head h2,
      .spotlight-copy h2 {
        margin: 0.25rem 0 0;
        font-size: clamp(1.35rem, 2vw, 1.85rem);
      }

      .spotlight-panel {
        display: grid;
        grid-template-columns: 0.9fr 1.1fr;
        gap: 1rem;
        align-items: start;
      }

      .spotlight-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.8rem;
      }

      .spotlight-card {
        border-radius: 16px;
        padding: 1rem;
        background: rgba(21, 35, 81, 0.7);
        border: 1px solid rgba(143, 169, 255, 0.2);
        box-shadow: 0 10px 30px rgba(2, 7, 24, 0.32);
      }

      .spotlight-card span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 999px;
        background: rgba(126, 163, 255, 0.18);
        color: #cfe0ff;
        font-weight: 700;
      }

      .spotlight-card h3 {
        margin: 0.75rem 0 0.35rem;
      }

      .spotlight-card p {
        margin: 0;
        color: #b8c8f1;
      }

      .sector-grid {
        margin-top: 0.95rem;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.85rem;
      }

      .sector-card {
        min-height: 240px;
        display: flex;
        align-items: end;
        border-radius: 18px;
        overflow: hidden;
        padding: 1rem;
        color: #fff;
        background-size: cover;
        background-position: center;
        box-shadow: inset 0 -90px 120px rgba(6, 22, 48, 0.45);
      }

      .sector-card h3 {
        margin: 0 0 0.3rem;
      }

      .sector-card p {
        margin: 0;
        max-width: 28ch;
      }

      .sector-card-consulting {
        background-image:
          linear-gradient(180deg, rgba(5, 31, 71, 0.08), rgba(5, 31, 71, 0.65)),
          url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80');
      }

      .sector-card-hiring {
        background-image:
          linear-gradient(180deg, rgba(5, 31, 71, 0.08), rgba(5, 31, 71, 0.65)),
          url('https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&w=1200&q=80');
      }

      .sector-card-careers {
        background-image:
          linear-gradient(180deg, rgba(5, 31, 71, 0.08), rgba(5, 31, 71, 0.65)),
          url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80');
      }

      .home-link-card {
        display: block;
        text-decoration: none;
        border: 1px solid rgba(143, 169, 255, 0.2);
        border-radius: 14px;
        padding: 1.05rem;
        background: linear-gradient(180deg, rgba(20, 34, 80, 0.82), rgba(15, 27, 67, 0.82));
        color: #eaf0ff;
        min-height: 128px;
        display: grid;
        align-content: start;
        gap: 0.45rem;
        transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
      }

      .home-link-card.active {
        border-color: rgba(126, 163, 255, 0.55);
        box-shadow: 0 10px 24px rgba(59, 99, 230, 0.24);
      }

      .home-link-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 26px rgba(2, 6, 22, 0.4);
        border-color: rgba(126, 163, 255, 0.45);
      }

      .home-link-card h3 {
        margin: 0;
        font-size: 1rem;
      }

      .home-link-card p {
        margin: 0;
        color: #b8c8f1;
      }

      .section-panel {
        scroll-margin-top: 1.25rem;
        min-height: 460px;
        display: grid;
        gap: 0.9rem;
        align-content: start;
        background:
          linear-gradient(180deg, rgba(15, 28, 69, 0.9), rgba(11, 22, 57, 0.9));
      }

      .single-panel-layout {
        grid-template-columns: 1fr;
        max-width: 980px;
        margin-inline: auto;
      }

      .panel {
        background: var(--surface-card);
        border: 1px solid var(--border-soft);
        border-radius: 18px;
        padding: 1.35rem;
        box-shadow: 0 12px 26px rgba(2, 6, 22, 0.34);
        min-height: 100%;
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
        color: #cfddff;
        display: grid;
        gap: 0.5rem;
      }

      .news-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.8rem;
      }

      .news-card {
        border: 1px solid rgba(143, 169, 255, 0.2);
        border-radius: 14px;
        padding: 0.85rem;
        background: rgba(20, 35, 83, 0.7);
      }

      .news-meta {
        margin: 0;
        font-size: 0.78rem;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--royal-700);
      }

      .news-card h3 {
        margin: 0.4rem 0 0.45rem;
        font-size: 1rem;
      }

      .news-card p {
        margin: 0;
        color: #b7c8f1;
      }

      .news-note {
        margin: 0;
        color: #d2dfff;
      }

      .news-note a {
        color: var(--royal-700);
        font-weight: 700;
      }

      .social-links .link-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        border-color: rgba(151, 175, 255, 0.25);
        background: var(--surface-soft);
        color: #eef3ff;
      }

      .social-icon {
        width: 1.4rem;
        height: 1.4rem;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        text-transform: uppercase;
        font-weight: 800;
        color: #fff;
      }

      .social-facebook {
        background: #1877f2;
      }

      .social-twitter {
        background: #111827;
      }

      .social-instagram {
        background: linear-gradient(135deg, #f97316, #ec4899 55%, #8b5cf6);
      }

      .social-youtube {
        background: #dc2626;
      }

      .social-links {
        margin-top: 1rem;
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .portfolio-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.8rem;
      }

      .portfolio-item {
        border: 1px solid rgba(143, 169, 255, 0.2);
        border-radius: 14px;
        padding: 0.8rem;
        background: rgba(18, 31, 75, 0.7);
      }

      .portfolio-item h3 {
        margin: 0 0 0.35rem;
        font-size: 1rem;
      }

      .portfolio-item p {
        margin: 0;
        color: #b7c8f1;
      }

      .course-list {
        display: grid;
        gap: 1rem;
      }

      .compact-list {
        gap: 0.8rem;
      }

      .course-card {
        border: 1px solid rgba(143, 169, 255, 0.22);
        border-radius: 16px;
        padding: 1rem;
        background: rgba(17, 30, 73, 0.74);
      }

      .compact-card {
        background: rgba(20, 34, 80, 0.8);
      }

      .course-head {
        display: flex;
        justify-content: space-between;
        gap: 0.8rem;
        align-items: flex-start;
      }

      .course-track {
        margin: 0 0 0.25rem;
        color: #9ab4ff;
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
        background: rgba(126, 163, 255, 0.16);
        font-size: 0.8rem;
        font-weight: 700;
      }

      .course-description {
        margin: 0.85rem 0 0;
      }

      .course-meta {
        margin: 0.85rem 0 0;
        padding-left: 1rem;
        color: #b7c8f1;
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
        background: linear-gradient(135deg, var(--royal-700), var(--royal-600));
        color: #fff;
        font-weight: 700;
        text-decoration: none;
        border: 0;
        cursor: pointer;
      }

      .button.secondary {
        background: linear-gradient(135deg, #26397b, #1b295c);
      }

      .button.small {
        padding: 0.65rem 0.95rem;
        font-size: 0.9rem;
      }

      .hint {
        margin: 0.9rem 0 0;
        color: #b7c8f1;
      }

      .account-card {
        margin-top: 1.75rem;
        border: 1px solid rgba(143, 169, 255, 0.24);
        border-radius: 16px;
        overflow: hidden;
        background: rgba(13, 24, 59, 0.85);
      }

      .profile-account-card {
        grid-column: 1 / -1;
        margin-top: 0;
      }

      .account-top {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        align-items: center;
        padding: 0.8rem 1rem;
        border-bottom: 1px solid rgba(143, 169, 255, 0.24);
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
        border: 2px solid rgba(126, 163, 255, 0.42);
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
        color: #aac3ff;
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      .link-chip {
        display: inline-flex;
        width: fit-content;
        text-decoration: none;
        font-weight: 700;
        color: #d8e5ff;
        background: rgba(126, 163, 255, 0.14);
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
        color: #d8e5ff;
      }

      .admin-form .full-width {
        grid-column: 1 / -1;
      }

      .asset-field {
        display: grid;
        gap: 0.65rem;
        border: 1px solid rgba(143, 169, 255, 0.18);
        background: rgba(13, 25, 61, 0.66);
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
        color: #b7c8f1;
      }

      .admin-form input,
      .admin-form select,
      .admin-form textarea {
        border: 1px solid rgba(143, 169, 255, 0.32);
        border-radius: 12px;
        padding: 0.8rem 0.9rem;
        font: inherit;
        background: rgba(5, 13, 35, 0.72);
        color: #e8efff;
      }

      code {
        padding: 0.1rem 0.35rem;
        border-radius: 6px;
        background: rgba(16, 35, 61, 0.08);
      }

      @media (max-width: 860px) {
        .card {
          padding: 1.5rem;
          border-radius: 20px;
        }

        .head {
          display: grid;
          grid-template-columns: 1fr;
        }

        .brand-logo {
          width: 46px;
          height: 46px;
        }

        .nav-links {
          min-width: 0;
        }

        .header-actions {
          justify-content: flex-start;
        }

        .panel-grid,
        .profile-layout,
        .admin-form {
          grid-template-columns: 1fr;
        }

        .hero-layout,
        .hero-metrics,
        .spotlight-panel,
        .spotlight-grid,
        .sector-grid {
          grid-template-columns: 1fr;
        }

        .hero-trust-strip {
          grid-template-columns: 1fr;
        }

        .hero-photo-grid,
        .hero-metrics-home {
          grid-template-columns: 1fr 1fr;
        }

        .home-links-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .page-media-grid {
          grid-template-columns: 1fr;
        }

        .quick-links-strip {
          padding: 0.3rem 0.4rem;
        }

        .portfolio-grid {
          grid-template-columns: 1fr;
        }

        .news-grid {
          grid-template-columns: 1fr;
        }

        .hero-photo-main {
          min-height: 220px;
        }

        .hero-photo,
        .sector-card {
          min-height: 200px;
        }

        .panel,
        .hero-content-panel,
        .spotlight-card,
        .portfolio-item,
        .course-card,
        .asset-field {
          padding: 1rem;
        }

        .upload-inline,
        .course-actions,
        .admin-actions {
          align-items: stretch;
        }

        .file-select,
        .admin-form input,
        .admin-form select,
        .admin-form textarea,
        .button,
        .button.small,
        .employee-login,
        .employee-link {
          width: 100%;
        }
      }

      @media (max-width: 640px) {
        .shell {
          padding: 0.75rem;
        }

        .card {
          padding: 1rem;
        }

        .course-head,
        .identity-block {
          display: grid;
          grid-template-columns: 1fr;
        }

        h1 {
          font-size: clamp(1.8rem, 10vw, 2.5rem);
        }

        .summary,
        .status,
        .course-description,
        .hint,
        .identity-provider,
        .identity-roles {
          font-size: 0.95rem;
        }

        .header-actions {
          display: grid;
          grid-template-columns: 1fr;
          width: 100%;
        }

        .nav-brand {
          width: 48px;
          min-width: 48px;
          height: 40px;
        }

        .nav {
          gap: 0.35rem;
          padding: 0.4rem;
        }

        .nav::-webkit-scrollbar {
          display: none;
        }

        .nav a {
          text-align: center;
          white-space: nowrap;
          flex: 0 0 auto;
          padding: 0.55rem 0.7rem;
          font-size: 0.9rem;
        }

        .nav-links {
          min-width: max-content;
        }

        .nav-auth {
          display: none;
        }

        .quick-links-strip a {
          flex: 0 0 auto;
          font-size: 0.83rem;
          padding: 0.42rem 0.62rem;
        }

        .hero-stats {
          grid-template-columns: 1fr;
        }

        .hero-layout {
          gap: 0.75rem;
        }

        .hero-banner h2 {
          font-size: clamp(1.55rem, 8vw, 2rem);
        }

        .hero-content-panel {
          padding: 0.95rem;
        }

        .hero-copy {
          font-size: 0.95rem;
        }

        .hero-cta-row,
        .hero-proof-line,
        .social-links {
          grid-template-columns: 1fr;
        }

        .hero-cta-row,
        .hero-proof-line,
        .social-links,
        .quick-links,
        .profile-links {
          display: grid;
        }

        .hero-cta-row {
          gap: 0.6rem;
        }

        .hero-proof-line {
          gap: 0.45rem;
        }

        .hero-trust-strip {
          gap: 0.55rem;
        }

        .hero-visuals {
          gap: 0.5rem;
        }

        .hero-photo-main {
          min-height: 180px;
        }

        .hero-photo-grid {
          display: none;
        }

        .hero-metrics-home {
          grid-template-columns: 1fr 1fr;
        }

        .hero-metrics div {
          padding: 0.65rem;
        }

        .spotlight-panel,
        .sectors-panel,
        .home-links-panel {
          gap: 0.75rem;
        }

        .spotlight-card h3,
        .sector-card h3,
        .home-link-card h3 {
          font-size: 0.98rem;
        }

        .sector-card {
          min-height: 180px;
        }

        .course-card,
        .panel {
          border-radius: 14px;
        }

        .section-panel {
          min-height: auto;
        }

        .hero-proof-line span,
        .link-chip,
        .home-link-card,
        .employee-login,
        .employee-link {
          width: 100%;
        }

        .home-links-grid {
          grid-template-columns: 1fr;
        }

        .account-top {
          align-items: flex-start;
          flex-direction: column;
        }
      }

      @media (max-width: 420px) {
        .card {
          padding: 0.85rem;
        }

        .hero-layout,
        .hero-metrics-home,
        .hero-trust-strip {
          grid-template-columns: 1fr;
        }

        .hero-banner {
          padding: 0.85rem;
        }

        .hero-content-panel,
        .panel,
        .course-card,
        .asset-field {
          padding: 0.85rem;
        }

        .button,
        .button.small {
          min-width: 0;
          padding-left: 1rem;
          padding-right: 1rem;
        }
      }
    </style>
