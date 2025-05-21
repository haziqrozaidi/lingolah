<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

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
    items: [
      { name: 'Community', path: '/forum', icon: 'pi pi-users' },
      { name: 'Reports', path: '/reports', icon: 'pi pi-chart-bar' },
      { name: 'Documents', path: '/documents', icon: 'pi pi-file' },
    ],
  },
  {
    title: 'Quiz',
    isOpen: false,
    items: [
      { name: 'Quizes', path: '/quizes', icon: 'pi pi-file-edit' },
      { name: 'Quiz', path: '/quiz', icon: 'pi pi-check' },
    ],
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
      <div v-for="(section, sIndex) in navigationSections" :key="sIndex" class="mb-2">
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

    <!-- User Profile Section - unchanged -->
    <div class="p-3 border-t border-gray-200">
      <div class="flex items-center" :class="{ 'justify-center': isSidebarCollapsed }">
        <div class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
        <div class="ml-3" v-if="!isSidebarCollapsed">
          <p class="text-sm font-medium text-gray-700">johnsmith</p>
          <p class="text-xs text-gray-500">johnsmith@example.com</p>
        </div>
      </div>
    </div>
  </div>
</template>
