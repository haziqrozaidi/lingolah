<template>
  <div class="sidebar-right sticky top-5 h-fit">
    <div class="video-section bg-white rounded-xl shadow-sm p-4">
      <h3 class="section-title text-base font-semibold text-gray-800 mb-4">Recommended Videos</h3>
      <div class="video-list space-y-4">
        <div 
          v-for="video in videos" 
          :key="video.id" 
          class="video-item rounded-lg overflow-hidden transition-transform hover:-translate-y-0.5"
        >
          <div class="video-thumbnail relative rounded-lg overflow-hidden mb-2 aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
            <span>Video Thumbnail</span>
            <div class="play-icon absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="video-info px-1">
            <h4 class="video-title text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{{ video.title }}</h4>
            <span class="video-author text-xs text-gray-500 block mb-1">{{ video.author }}</span>
            <div class="video-stats flex gap-2 text-xs text-gray-500">
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