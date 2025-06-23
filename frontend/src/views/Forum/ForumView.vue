<template>
    <div
        class="forum-container min-h-[calc(100vh-72px)] bg-gray-50 grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-0">
        <div class="sidebar-left overflow-y-auto p-4 border-r border-gray-200">
            <ForumSidebarLeft />
        </div>
        <div class="main-content overflow-y-auto p-4">
            <ForumMainContent :posts="posts" />
        </div>
        <div class="sidebar-right  overflow-y-auto p-4 hidden lg:block">
            <ForumSidebarRight :videos="videos" />
        </div>
    </div>
</template>

<script>
import ForumMainContent from '@/components/Forum/ForumMainContent.vue';

export default {
    components: {
        ForumMainContent, 
    
}
}
</script>
