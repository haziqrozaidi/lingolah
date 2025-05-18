<template>
  <div class="main-content">
    <div class="create-post">
      <div class="user-avatar">
        <img src="https://i.pravatar.cc/40" alt="User avatar">
      </div>
      <input type="text" class="post-input" placeholder="What's on your mind?">
      <button class="create-post-btn">Post</button>
    </div>
    <div class="post" v-for="post in posts" :key="post.id">
      <div class="post-content">
        <h3 class="post-title">{{ post.title }}</h3>
        <div class="post-meta">
          <div class="user-avatar small">
            <img src="https://i.pravatar.cc/30" alt="User avatar">
          </div>
          <div class="meta-details">
            <div class="user-info">
              <span class="username">{{ post.author }}</span>
              <span class="post-time">{{ post.time }}</span>
            </div>
            <div class="post-stats">
              <span class="stat">{{ post.views }} views</span>
              <span class="stat">{{ post.likes }} likes</span>
              <span class="stat">{{ post.comments }} comments</span>
            </div>
          </div>
          <button class="post-actions">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForumMainContent',
  props: {
    posts: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
@import '../assets/style.css';
</style>