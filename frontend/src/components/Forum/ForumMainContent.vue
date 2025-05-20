<template>
  <div class="main-content space-y-4">
    <div class="create-post bg-white rounded-xl shadow-sm p-4 flex items-center">
      <div class="user-avatar w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-white font-bold">
        <span>U</span>
      </div>
      <input 
        type="text" 
        class="post-input flex-1 mx-4 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        placeholder="What's on your mind?"
      >
      <button class="create-post-btn px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors">
        Post
      </button>
    </div>
    
    <div 
      v-for="post in posts" 
      :key="post.id" 
      class="post bg-white rounded-xl shadow-sm p-5"
    >
      <div class="post-content">
        <h3 class="post-title text-lg font-semibold text-gray-800 mb-3 leading-snug">{{ post.title }}</h3>
        <div class="post-meta flex items-center">
          <div class="user-avatar small w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs text-white font-bold">
            <span>{{ post.author.charAt(0) }}</span>
          </div>
          <div class="meta-details flex-1 ml-3">
            <div class="user-info">
              <span class="username text-sm font-semibold">{{ post.author }}</span>
              <span class="post-time text-xs text-gray-500 mt-0.5">{{ post.time }}</span>
            </div>
            <div class="post-stats flex gap-4 sm:flex-row flex-col sm:gap-4 gap-1 text-xs text-gray-500">
              <span>{{ post.views }} views</span>
              <span>{{ post.likes }} likes</span>
              <span>{{ post.comments }} comments</span>
            </div>
          </div>
          <button class="post-actions text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
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