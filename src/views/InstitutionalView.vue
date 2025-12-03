<template>
  <main class="institutional-view">
    <article class="container">
      <header>
        <h1 class="page-title">About InspirePixel</h1>
      </header>
      <section class="content">
        <p>
          Welcome to <strong>InspirePixel</strong>, your premier destination for high-quality visual
          inspiration. Our mission is to empower creators, designers, and dreamers with a curated
          collection of breathtaking imagery.
        </p>
        <p>
          Founded in 2024, InspirePixel started as a small project to share the beauty of the world
          through the lens of talented photographers. Today, we are a growing community dedicated to
          visual excellence.
        </p>
        <h2>Our Vision</h2>
        <p>
          We believe that great design starts with great inspiration. Whether you are working on a
          website, a presentation, or just looking for a beautiful wallpaper, we want to be your
          go-to source.
        </p>
        <h2>Why Choose Us?</h2>
        <ul>
          <li><strong>Curated Quality:</strong> Every image is hand-picked for its aesthetic value.</li>
          <li><strong>Diverse Categories:</strong> From nature to architecture, we cover it all.</li>
          <li><strong>Creator Friendly:</strong> We support artists and respect copyright.</li>
        </ul>
      </section>
    </article>
  </main>
</template>

<style scoped lang="scss">
.institutional-view {
  padding: 4rem 2rem;
  background-color: #fff;
  flex: 1;

  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  .page-title {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
  }

  .content {
    color: #555;
    line-height: 1.8;
    font-size: 1.1rem;

    p {
      margin-bottom: 1.5rem;
    }

    h2 {
      color: #2c3e50;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }

    ul {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;

      li {
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
