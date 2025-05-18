<template>
  <div class="sidebar-left">
    <div class="filter-section">
      <div class="filter-option active">
        <div class="filter-icon active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="filter-text">
          <div class="filter-title-with-badge">
            <span class="filter-title">All Posts</span>
            <span class="badge">12</span>
          </div>
          <span class="filter-subtitle">See all forum posts</span>
        </div>
      </div>
      <div class="filter-option">
        <div class="filter-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21L21 17M20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="filter-text">
          <span class="filter-title">Following</span>
          <span class="filter-subtitle">Posts from people you follow</span>
        </div>
      </div>
    </div>
    <div class="tags-section">
      <h3 class="section-title">Popular Tags</h3>
      <div class="tag-list">
        <div class="tag-item" v-for="n in 5" :key="n">
          <span class="tag-name">#malaylanguage</span>
          <span class="tag-count">{{n * 123}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/style.css';
</style>