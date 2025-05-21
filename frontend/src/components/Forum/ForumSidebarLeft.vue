<template>
  <div class="sidebar-left h-fit space-y-5">
    <div class="filter-section bg-white rounded-xl shadow-sm p-4">
      <div
        class="filter-option flex items-center p-3 rounded-lg mb-2 cursor-pointer transition-all bg-blue-500 text-white">
        <div class="filter-icon flex items-center justify-center w-6 h-6 rounded bg-white/20 text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </div>
        <div class="filter-text ml-3">
          <div class="filter-title-with-badge flex items-center">
            <span class="filter-title text-sm font-semibold">All Posts</span>
            <span class="badge ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">12</span>
          </div>
          <span class="filter-subtitle text-xs opacity-90">See all forum posts</span>
        </div>
      </div>
      <div class="filter-option flex items-center p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
        <div class="filter-icon flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-700">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <div class="filter-text ml-3">
          <div class="filter-title-with-badge flex items-center"><span
              class="filter-title text-sm font-semibold text-blue-500">Following</span>
          </div>
          <span class="filter-subtitle text-xs text-gray-500">Posts from people you follow</span>
        </div>
      </div>
    </div>

    <div class="tags-section bg-white rounded-xl shadow-sm p-4">
      <h3 class="section-title text-base font-semibold text-gray-800 mb-4">Popular Tags</h3>
      <div class="tag-list space-y-2">
        <div v-for="n in 5" :key="n" class="tag-item flex justify-between items-center py-2 border-b border-gray-100">
          <span class="tag-name text-sm font-medium text-blue-500">#malaylanguage</span>
          <span class="tag-count text-xs text-gray-500">{{ n * 123 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForumSidebarLeft'
}
</script>