<template>
  <div class="forum-container">
    <!-- Left Sidebar -->
    <ForumSidebarLeft />
    
    <!-- Main Content -->
    <ForumMainContent :posts="posts" />
    
    <!-- Right Sidebar -->
    <ForumSidebarRight :videos="videos" />
  </div>
</template>

<script>
import ForumSidebarLeft from '../components/ForumSidebarLeft.vue';
import ForumMainContent from '../components/ForumMainContent.vue';
import ForumSidebarRight from '../components/ForumSidebarRight.vue';
import '../assets/style.css';

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
