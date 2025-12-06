<script setup>
import Header from '../components/Header.vue'
import InstagramStories from '../components/InstagramStories.vue'
// Futuramente...:
// import InstagramFeed from '../components/InstagramFeed.vue'
</script>

<template>
    <div class="instagram-view">
        <Header />
        <main class="main-content">
            <InstagramStories />
            <!-- Next implementation: feed 2 -->
            <div class="feed-placeholder">
                <h2>Feed de Posts</h2>
                <p>Em breve...</p>
            </div>
        </main>
    </div>
</template>

<style scoped>
.main-content {
    padding-top: 2rem;
    max-width: 975px;
    margin: 0 auto;
}
</style>