<template>
  <div class="forum-container min-h-screen bg-gray-50 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-0">
    <div class="sidebar-left overflow-y-auto p-2 border-r border-gray-200">
      <ForumSidebarLeft
        :user-id="userId"
        :selected-community="selectedCommunity"
        @community-selected="selectedCommunity = $event"
      />
    </div>
    <div class="main-content overflow-y-auto p-2 h-full min-h-0">
      <ForumMainContent
        v-if="selectedCommunity"
        :posts="filteredPosts"
        :community="selectedCommunity"
        :userId="userId"
      />
      <div v-else>
        <p>Select a community to view and post.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import ForumMainContent from '@/components/Forum/ForumMainContent.vue'
import ForumSidebarLeft from '@/components/Forum/ForumSidebarLeft.vue'

const userStore = useUserStore()
const { userId } = storeToRefs(userStore)

const selectedCommunity = ref(null)
const posts = ref([])

const filteredPosts = computed(() => {
  if (!selectedCommunity.value) return []
  if (selectedCommunity.value.id === 'general') {
    return posts.value.filter(post => !post.communityId)
  }
  return posts.value.filter(post => post.communityId === selectedCommunity.value.id)
})
</script>

<style scoped>
.forum-container {
  /* Remove any default margin/padding */
  margin: 0;
  padding: 0;
}
.main-content,
.sidebar-left {
  padding: 0.5rem !important;
}
</style>