<template>
  <div class="sidebar-right">
    <div class="video-section">
      <h3 class="section-title">Recommended Videos</h3>
      <div class="video-list">
        <div v-for="video in videos" :key="video.id" class="video-item">
          <div class="video-thumbnail">
            <img src="https://via.placeholder.com/325x180" alt="Video thumbnail">
            <div class="play-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3L19 12L5 21V3Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="video-info">
            <h4 class="video-title">{{ video.title }}</h4>
            <span class="video-author">{{ video.author }}</span>
            <div class="video-stats">
              <span>12K views</span>
              <span>•</span>
              <span>3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'ForumSidebarRight',
  props: {
    videos: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
@import '../assets/style.css';
</style>