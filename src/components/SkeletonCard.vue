<template>
  <div class="skeleton-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-content">
      <div class="skeleton-title"></div>
      <div class="skeleton-category"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton-card {
  background: var(--card-bg);
  border-radius: 0.9375rem;
  overflow: hidden;
  box-shadow: 0 0.625rem 1.875rem var(--card-shadow);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.skeleton-image {
  height: 15.625rem;
  width: 100%;
  background: #e0e0e0;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 1.5s infinite;
  }
}

.skeleton-content {
  padding: 1.5rem;
}

.skeleton-title {
  height: 1.5rem;
  width: 70%;
  background: #e0e0e0;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 1.5s infinite;
  }
}

.skeleton-category {
  height: 1rem;
  width: 40%;
  background: #e0e0e0;
  border-radius: 0.625rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 1.5s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

:global(.dark-mode) {
  .skeleton-image,
  .skeleton-title,
  .skeleton-category {
    background: #2d3748;

    &::after {
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    }
  }
}
</style>
