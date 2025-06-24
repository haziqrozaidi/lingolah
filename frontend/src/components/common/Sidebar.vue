<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { UserButton, useUser } from '@clerk/vue'
import { useUserStore } from '../../stores/userStore'

const { user, isLoaded, isSignedIn } = useUser()
const userStore = useUserStore()

// Navigation sections with collapsible menus
const navigationSections = ref([
  {
    title: 'Main',
    isOpen: true,
    items: [{ name: 'Dashboard', path: '/', icon: 'pi pi-home' }],
  },
  {
    title: 'Flashcard',
    isOpen: true,
    items: [
      { name: 'Learn', path: '/learn', icon: 'pi pi-folder' },
      { name: 'Review', path: '/review', icon: 'pi pi-check-square' },
    ],
  },
  {
    title: 'Forum',
    isOpen: false,
    items: [{ name: 'Community', path: '/forum', icon: 'pi pi-users' }],
  },
  {
    title: 'Quiz',
    isOpen: false,
    items: [{ name: 'Quizes', path: '/quizes', icon: 'pi pi-file-edit' }],
  },
  {
    title: 'Video',
    isOpen: false,
    items: [
      { name: 'Watch', path: '/video', icon: 'pi pi-video' },
      { name: 'Help', path: '/help', icon: 'pi pi-question-circle' },
    ],
  },
])

// Admin navigation sections
const adminNavigationSections = ref([
  {
    title: 'Main',
    isOpen: true,
    items: [{ name: 'Dashboard', path: '/admin', icon: 'pi pi-home' }],
  },
  {
    title: 'Manage Flashcard',
    isOpen: true,
    items: [
      { name: 'Flashcard Set', path: '/admin/flashcard-set', icon: 'pi pi-folder' },
      { name: 'Flashcard', path: '/admin/flashcard', icon: 'pi pi-check-square' },
    ],
  },
  {
    title: 'Manage Forum',
    isOpen: false,
    items: [{ name: 'Reports', path: '/admin/forum', icon: 'pi pi-chart-bar' }],
  },
  {
    title: 'Manage Community',
    isOpen: false,
    items: [
      { name: 'Community', path: '/admin/community', icon: 'pi pi-users' },
      { name: 'Community Request', path: '/admin/community/request', icon: 'pi pi-file-edit' },
      { name: 'Community Delete', path: '/admin/community/delete', icon: 'pi pi-trash' },
    ],
  },
  {
    title: 'Manage Quizzes',
    isOpen: false,
    items: [{ name: 'Quizzes', path: '/admin/quizes', icon: 'pi pi-file-edit' }],
  },
])

// Toggle section collapse state
const toggleSection = (section) => {
  section.isOpen = !section.isOpen
}

// Global sidebar collapsed state
const isSidebarCollapsed = ref(false)
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>

<template>
  <div
    class="h-full flex flex-col bg-white transition-all duration-300"
    :class="{ 'w-20': isSidebarCollapsed, 'w-64': !isSidebarCollapsed }"
  >
    <!-- Logo Section - unchanged -->
    <div class="h-[72px] p-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-blue-600" v-if="!isSidebarCollapsed">LingoLah</h1>
      <div class="w-10 h-10 flex items-center justify-center" v-else>
        <span class="text-2xl font-bold text-blue-600">A</span>
      </div>
      <button @click="toggleSidebar" class="text-gray-500 hover:text-gray-700">
        <i
          :class="isSidebarCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
          class="text-lg"
        ></i>
      </button>
    </div>

    <!-- Navigation - unchanged section headers -->
    <nav class="flex-grow py-2 mt-2 overflow-y-auto">
      <div
        v-for="(section, sIndex) in userStore.role === 'admin'
          ? adminNavigationSections
          : navigationSections"
        :key="sIndex"
        class="mb-2"
      >
        <!-- Section Header - unchanged -->
        <div
          @click="toggleSection(section)"
          class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700"
          v-if="!isSidebarCollapsed"
        >
          <span class="text-xs font-semibold uppercase tracking-wider">{{ section.title }}</span>
          <i
            :class="section.isOpen ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
            class="text-xs"
          ></i>
        </div>

        <div v-else class="mx-2 my-3 h-px bg-gray-100"></div>

        <!-- Section Items - MODIFIED to use RouterLink directly -->
        <ul v-if="!isSidebarCollapsed" :class="{ hidden: !section.isOpen }" class="space-y-1 mb-3">
          <li v-for="item in section.items" :key="item.path">
            <RouterLink
              :to="item.path"
              class="flex items-center px-4 py-2 text-sm font-medium rounded-lg mx-2"
              :class="[
                $route.path === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <i :class="[item.icon, 'mr-3 text-lg']"></i>
              <span>{{ item.name }}</span>
            </RouterLink>
          </li>
        </ul>

        <!-- Collapsed View - Icons Only - MODIFIED to use RouterLink directly -->
        <ul v-else class="space-y-1 mb-2">
          <li v-for="item in section.items" :key="item.path">
            <RouterLink
              :to="item.path"
              class="flex justify-center items-center p-2 rounded-lg mx-2"
              :class="[
                $route.path === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
              :title="item.name"
            >
              <i :class="[item.icon, 'text-lg']"></i>
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <div class="p-3 border-t border-gray-200">
      <div class="flex items-center" :class="{ 'justify-center': isSidebarCollapsed }">
        <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img
            v-if="isLoaded && isSignedIn && user.imageUrl"
            :src="user.imageUrl"
            :alt="`${user.username || user.firstName || 'User'}'s avatar`"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="ml-3" v-if="!isSidebarCollapsed && isLoaded && isSignedIn">
          <p class="text-sm font-medium text-gray-700">
            {{
              user.username || user.firstName || user.primaryEmailAddress.emailAddress.split('@')[0]
            }}
          </p>
          <p class="text-xs text-gray-500">{{ user.primaryEmailAddress?.emailAddress }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
