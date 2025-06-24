<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { UserButton } from '@clerk/vue'

// Current date and time handling
const currentDateTime = ref('')

// Format date in YYYY-MM-DD HH:MM:SS format
const formatDate = (date) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// Update time every second
let timerInterval
const updateDateTime = () => {
  const now = new Date()
  currentDateTime.value = formatDate(now)
}

// Set up timer on component mount
onMounted(() => {
  updateDateTime() // Initial update
  timerInterval = setInterval(updateDateTime, 1000)
})

// Clean up timer on component unmount
onBeforeUnmount(() => {
  clearInterval(timerInterval)
})

// Notifications
const notifications = ref([
  { id: 1, text: 'New project assigned to you', time: '10 min ago', read: false },
  { id: 2, text: 'Meeting scheduled for tomorrow', time: '1 hour ago', read: false },
  { id: 3, text: 'Task deadline approaching', time: '3 hours ago', read: true },
])

const showNotifications = ref(false)
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}
const unreadCount = () => notifications.value.filter((n) => !n.read).length

// Search functionality
const searchQuery = ref('')
const showSearchResults = ref(false)

const handleSearchFocus = () => {
  showSearchResults.value = true
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}
</script>

<template>
  <header class="px-6 py-3 bg-white">
    <div class="flex items-center justify-between">
      <!-- Left section: Page title and breadcrumbs -->
      <div>
        <h1 class="text-xl font-semibold text-gray-800">Dashboard</h1>
        <div class="flex items-center text-sm text-gray-500">
          <span>Home</span>
          <span class="mx-2">/</span>
          <span class="text-gray-700">Dashboard</span>
        </div>
      </div>

      <!-- Right section: Search, time, notifications, and user menu -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search..."
              class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-60"
              @focus="handleSearchFocus"
              @blur="handleSearchBlur"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="pi pi-search text-gray-400"></i>
            </div>
          </div>

          <!-- Search results dropdown -->
          <div
            v-if="showSearchResults && searchQuery"
            class="absolute mt-2 w-full bg-white rounded-md shadow-lg z-10 border border-gray-200"
          >
            <div class="p-4">
              <div v-if="searchQuery" class="py-2">
                <p class="text-sm text-gray-500">Searching for "{{ searchQuery }}"...</p>
              </div>
              <div v-else class="py-2">
                <p class="text-sm text-gray-500">Enter search query</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="toggleNotifications"
            class="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <i class="pi pi-bell text-lg text-gray-600"></i>
            <span
              v-if="unreadCount() > 0"
              class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
            >
              {{ unreadCount() }}
            </span>
          </button>

          <!-- Notifications dropdown -->
          <div
            v-show="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200"
          >
            <div class="py-2">
              <div class="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-gray-700">Notifications</h3>
                  <span class="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
                    >Mark all as read</span
                  >
                </div>
              </div>
              <div
                v-for="notification in notifications"
                :key="notification.id"
                :class="[
                  'px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer',
                  { 'bg-blue-50': !notification.read },
                ]"
              >
                <div class="flex items-start">
                  <div class="flex-1">
                    <p class="text-sm text-gray-800">{{ notification.text }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                  </div>
                  <div v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div class="px-4 py-2 text-center">
                <a href="#" class="text-sm text-blue-500 hover:text-blue-700"
                  >View all notifications</a
                >
              </div>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div class="flex items-center">
          <UserButton />
        </div>
      </div>
    </div>
  </header>
</template>
