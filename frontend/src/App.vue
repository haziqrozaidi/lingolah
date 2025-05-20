<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './components/common/Sidebar.vue'
import Header from './components/common/Header.vue'
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">
    <div class="fixed h-full w-64 border-r border-gray-200">
      <Sidebar />
    </div>

    <div class="ml-64 flex flex-col w-full">
      <div class="fixed top-0 right-0 left-64 border-b border-gray-200 bg-white z-10">
        <Header />
      </div>

      <main class="pt-[header-height] flex-grow overflow-y-auto h-screen">
        <div class="p-5">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.pt-\[header-height\] {
  padding-top: 72px; /* Adjusted to match the header's height of 72px */
}
</style>
