<template>
  <div class="about-page">
    <div class="about-card">
      <h1 class="about-title">关于 · 星图集</h1>
      <p class="about-desc">
        爱豆写真云，为你收纳海量高清写真、演唱会、红毯与日常瞬间，发现属于你的心动图鉴。
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.about-card {
  max-width: 560px;
  padding: var(--space-5);
  border: var(--border-soft);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-soft-lg);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
}

.about-title {
  font-size: 1.5rem;
  font-weight: var(--font-title);
  letter-spacing: var(--letter-relaxed);
  margin: 0 0 var(--space-3);
  color: var(--color-ink);
}

.about-desc {
  margin: 0;
  line-height: var(--line-body);
  color: var(--color-ink);
  opacity: 0.9;
}
</style>
