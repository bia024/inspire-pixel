<template>
  <main class="legal-view">
    <article class="container">
      <header>
        <h1 class="page-title">Privacy Policy</h1>
      </header>
      <section class="content">
        <p><strong>Last updated:</strong> December 2024</p>
        <h2>Introduction</h2>
        <p>
          At InspirePixel, we take your privacy seriously. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit our website.
        </p>
        <h2>Information We Collect</h2>
        <p>We may collect information about you in a variety of ways, including:</p>
        <ul>
          <li>
            <strong>Personal Data:</strong> Name, email address, and other contact information you
            provide.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our website, such as pages
            visited and time spent.
          </li>
          <li>
            <strong>Cookies:</strong> We use cookies to enhance your experience and analyze site
            traffic.
          </li>
        </ul>
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and maintain our services</li>
          <li>Send you promotional emails and updates (with your consent)</li>
          <li>Improve our website and user experience</li>
          <li>Respond to your inquiries and support requests</li>
        </ul>
        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. However,
          no method of transmission over the internet is 100% secure.
        </p>
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at
          <a href="mailto:privacy@inspiralens.com">privacy@inspiralens.com</a>.
        </p>
      </section>
    </article>
  </main>
</template>

<style scoped lang="scss">
.legal-view {
  padding: 4rem 2rem;
  background-color: var(--bg-primary);
  flex: 1;

  .container {
    max-width: 50rem;
    margin: 0 auto;
  }

  .page-title {
    font-size: 2.5rem;
    color: var(--text-primary);
    margin-bottom: 2rem;
  }

  .content {
    color: var(--text-secondary);
    line-height: 1.8;

    h2 {
      color: var(--text-primary);
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 1rem;
    }

    ul {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;

      li {
        margin-bottom: 0.5rem;
      }
    }

    a {
      color: #e74c3c;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
