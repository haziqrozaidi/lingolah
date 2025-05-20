<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './components/common/Sidebar.vue'
import Header from './components/common/Header.vue'
</script>

<template>
  <div class="flex min-h-screen w-full">
    <div class="w-64 flex-shrink-0 border-r border-gray-200">
      <Sidebar />
    </div>

    <div class="flex flex-col flex-grow">
      <div class="border-b border-gray-200">
        <Header />
      </div>

      <main class="flex-grow p-5">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
