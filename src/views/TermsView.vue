<template>
    <main class="legal-view">
        <article class="container">
            <header>
                <h1 class="page-title">Terms of Use</h1>
            </header>
            <section class="content">
                <p><strong>Last updated:</strong> December 2024</p>
                <h2>Acceptance of Terms</h2>
                <p>
                    By accessing and using InspirePixel, you accept and agree to be bound by the terms and
                    provisions of this agreement. If you do not agree to these terms, please do not use our service.
                </p>
                <h2>Use License</h2>
                <p>
                    Permission is granted to temporarily download one copy of the materials on InspirePixel for
                    personal, non-commercial transitory viewing only.
                </p>
                <p>This license shall automatically terminate if you violate any of these restrictions.</p>
                <h2>User Accounts</h2>
                <ul>
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You must be at least 13 years old to use this service</li>
                    <li>One person or legal entity may not maintain more than one free account</li>
                </ul>
                <h2>Pro Subscription</h2>
                <p>Pro subscriptions provide access to premium features including:</p>
                <ul>
                    <li>High-resolution image downloads</li>
                    <li>Access to exclusive content</li>
                    <li>Commercial use rights</li>
                    <li>Priority support</li>
                </ul>
                <p>Subscriptions are billed monthly and can be cancelled at any time.</p>
                <h2>Prohibited Uses</h2>
                <p>You may not use our service to:</p>
                <ul>
                    <li>Violate any laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Transmit harmful or malicious code</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
                <h2>Limitation of Liability</h2>
                <p>
                    InspirePixel shall not be liable for any damages arising from the use or inability to use
                    our service, even if we have been notified of the possibility of such damages.
                </p>
                <h2>Changes to Terms</h2>
                <p>
                    We reserve the right to modify these terms at any time. Continued use of the service after
                    changes constitutes acceptance of the new terms.
                </p>
                <h2>Contact</h2>
                <p>
                    For questions about these Terms of Use, contact us at
                    <a href="mailto:legal@inspirepixel.com">legal@inspirepixel.com</a>.
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
        max-width: 800px;
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
