<template>
  <main class="legal-view">
    <article class="container">
      <header>
        <h1 class="page-title">Copyright / DMCA</h1>
      </header>
      <section class="content">
        <p>
          InspirePixel respects the intellectual property rights of others. It is our policy to
          respond to any claim that Content posted on the Service infringes the copyright or other
          intellectual property infringement of any person.
        </p>
        <h2>DMCA Notice</h2>
        <p>
          If you are a copyright owner, or authorized on behalf of one, and you believe that the
          copyrighted work has been copied in a way that constitutes copyright infringement that is
          taking place through the Service, you must submit your notice in writing to the attention
          of "Copyright Infringement" of dmca@InspirePixel.com and include in your notice a detailed
          description of the alleged infringement.
        </p>
        <h2>Counter-Notice</h2>
        <p>
          If you believe that your Content that was removed (or to which access was disabled) is not
          infringing, or that you have the authorization from the copyright owner, the copyright
          owner's agent, or pursuant to the law, to post and use the material in your Content, you
          may send a counter-notice containing your contact information and a statement that you
          consent to the jurisdiction of the federal court.
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
  }
}
</style>
