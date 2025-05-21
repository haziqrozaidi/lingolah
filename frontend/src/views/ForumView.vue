<template>
    <div
        class="forum-container min-h-[calc(100vh-72px)] bg-gray-50 grid grid-cols-1 lg:grid-cols-[80px_240px_1fr_300px] gap-0">
        <div class="border-r border-gray-200">
            <Sidebar />
        </div>
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
import ForumSidebarLeft from '../components/Forum/ForumSidebarLeft.vue';
import ForumMainContent from '../components/Forum/ForumMainContent.vue';
import ForumSidebarRight from '../components/Forum/ForumSidebarRight.vue';

export default {
    components: {
        ForumSidebarLeft,
        ForumMainContent,
        ForumSidebarRight
    },
    data() {
        return {
            posts: [
                {
                    id: 1,
                    title: "Can someone explain the usage of 'lah' in Malay sentences? I'm confused about when to use it.",
                    author: "Pavel Gvay",
                    time: "3 weeks ago",
                    views: "651,324",
                    likes: "36,6545",
                    comments: "56"
                },
                {
                    id: 2,
                    title: "What's the best way to learn Malay?",
                    author: "AR Jakir",
                    time: "3 days ago",
                    views: "244,564",
                    likes: "10,920",
                    comments: "184"
                },
                {
                    id: 3,
                    title: "Is it true Malay language have many variation like other countries still talk in Malay but it sound different?",
                    author: "Mansurul Haque",
                    time: "1 week ago",
                    views: "601,066",
                    likes: "24,753",
                    comments: "209"
                },
                {
                    id: 4,
                    title: "I love this app. Guys u all should use this to learn Malay language!",
                    author: "Michal Malewicz",
                    time: "2 weeks ago",
                    views: "964,258",
                    likes: "64,755",
                    comments: "44"
                }
            ],
            videos: [
                {
                    id: 1,
                    title: "Mastering Basic Malay Phrases for Daily Conversations",
                    author: "Michele Hansen"
                },
                {
                    id: 2,
                    title: "Top 10 Malay Words You Should Know Before Visiting Malaysia",
                    author: "James McKinven"
                },
                {
                    id: 3,
                    title: "Understanding Malay Grammar: A Beginner's Guide",
                    author: "Mahfuzul Nabil"
                },
                {
                    id: 4,
                    title: "Common Mistakes to Avoid When Learning Malay",
                    author: "Dr. Jubed"
                },
                {
                    id: 5,
                    title: "How to Pronounce Malay Words Like a Native Speaker",
                    author: "Jesse Hanley"
                },
                {
                    id: 6,
                    title: "Learn Malay Through Music: Easy Songs for Beginners",
                    author: "Courtland Allen"
                }
            ]
        }
    }
}
</script>
