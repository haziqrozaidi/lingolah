<template>
  <div class="admin-forum-container min-h-[calc(100vh-72px)] bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Forum Moderation Panel</h1>
        
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Reported Posts</h2>
            <div class="flex items-center">
              <div class="mr-4">
                <select v-model="filterStatus" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Reports</option>
                  <option value="pending">Pending Review</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Search posts..." 
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white rounded-lg overflow-hidden">
              <thead class="bg-gray-100 text-gray-700">
                <tr>
                  <th class="py-3 px-4 text-left text-sm font-semibold">Post Title</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold">Author</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold">Reported By</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold">Reason</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold">Status</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in filteredReportedPosts" :key="post.id" class="border-b border-gray-200 hover:bg-gray-50">
                  <td class="py-3 px-4 text-sm">
                    <div @click="openPostDetails(post)" class="text-blue-600 hover:underline cursor-pointer">
                      {{ truncateText(post.title, 60) }}
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm">{{ post.author }}</td>
                  <td class="py-3 px-4 text-sm">{{ post.reportedBy }}</td>
                  <td class="py-3 px-4 text-sm">{{ post.reportReason }}</td>
                  <td class="py-3 px-4 text-sm">
                    <span :class="getStatusBadgeClass(post.status)">{{ post.status }}</span>
                  </td>
                  <td class="py-3 px-4 text-sm">
                    <div class="flex gap-2">
                      <button 
                        @click="approvePost(post)"
                        class="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
                        Approve
                      </button>
                      <button 
                        @click="deletePost(post)"
                        class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredReportedPosts.length === 0">
                  <td colspan="6" class="py-4 text-center text-gray-500">No reported posts found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Recently Moderated Posts</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white rounded-lg overflow-hidden">
              <thead class="bg-gray-100 text-gray-700">
                <tr>
                  <th class="py-3 px-4 text-left text-sm font-semibold">Post Title</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold">Author</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold">Moderation Action</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold">Moderated By</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in recentlyModeratedPosts" :key="`moderated-${post.id}`" class="border-b border-gray-200 hover:bg-gray-50">
                  <td class="py-3 px-4 text-sm">
                    <div class="text-gray-800">{{ truncateText(post.title, 60) }}</div>
                  </td>
                  <td class="py-3 px-4 text-sm">{{ post.author }}</td>
                  <td class="py-3 px-4 text-sm">
                    <span :class="getActionBadgeClass(post.action)">{{ post.action }}</span>
                  </td>
                  <td class="py-3 px-4 text-sm">{{ post.moderatedBy }}</td>
                  <td class="py-3 px-4 text-sm">{{ formatDate(post.moderationDate) }}</td>
                </tr>
                <tr v-if="recentlyModeratedPosts.length === 0">
                  <td colspan="5" class="py-4 text-center text-gray-500">No moderation history found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Detail Modal -->
    <PostModerationModal 
      v-if="selectedPost" 
      :show="showModal" 
      :post="selectedPost"
      @close="closeModal"
      @approve="confirmApprove"
      @delete="confirmDelete"
    />

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Confirm {{ confirmAction }}</h3>
        <p class="mb-6">Are you sure you want to {{ confirmAction.toLowerCase() }} this post?</p>
        <div class="flex justify-end gap-3">
          <button 
            @click="cancelConfirmation" 
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100">
            Cancel
          </button>
          <button 
            @click="executeConfirmedAction" 
            :class="confirmAction === 'Delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
            class="px-4 py-2 text-white rounded">
            {{ confirmAction }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostModerationModal from '@/components/Forum/PostModerationModal.vue';

export default {
  name: 'AdminForumView',
  components: {
    PostModerationModal
  },
  data() {
    return {
      selectedPost: null,
      showModal: false,
      searchQuery: '',
      filterStatus: 'all',
      showConfirmation: false,
      confirmAction: '',
      postToModerate: null,
      reportedPosts: [
        {
          id: 1,
          title: "Can someone explain the usage of 'lah' in Malay sentences? I'm confused about when to use it.",
          author: "Pavel Gvay",
          time: "3 weeks ago",
          content: "I've been learning Malay for a few months now, but I'm really confused about when to use 'lah' in sentences...",
          views: "651,324",
          likes: "36,6545",
          comments: "56",
          reportedBy: "LanguageExpert22",
          reportReason: "Misleading information",
          reportDate: "2025-06-14T15:30:00Z",
          status: "pending"
        },
        {
          id: 4,
          title: "I love this app. Guys u all should use this to learn Malay language!",
          author: "Michal Malewicz",
          time: "2 weeks ago",
          content: "Just wanted to share how much I love this app! I've tried many language learning apps but this one really stands out...",
          views: "964,258",
          likes: "64,755",
          comments: "44",
          reportedBy: "ContentModerator",
          reportReason: "Spam/Promotional content",
          reportDate: "2025-06-12T10:15:00Z",
          status: "pending"
        },
        {
          id: 5,
          title: "This language makes no sense! Waste of time studying it.",
          author: "AngryLearner",
          time: "5 days ago",
          content: "I've spent two months trying to learn Malay and it's been a complete waste of time. The grammar is confusing and inconsistent...",
          views: "342,187",
          likes: "1,205",
          comments: "78",
          reportedBy: "MalaysianTeacher",
          reportReason: "Offensive content",
          reportDate: "2025-06-13T09:45:00Z",
          status: "pending"
        },
      ],
      recentlyModeratedPosts: [
        {
          id: 6,
          title: "Inappropriate joke about Malay cultural practices",
          author: "JokeUser123",
          action: "Deleted",
          moderatedBy: "AdminUser",
          moderationDate: "2025-06-14T16:20:00Z"
        },
        {
          id: 7,
          title: "Question about controversial political topics in Malaysia",
          author: "PoliticalAnalyst",
          action: "Approved",
          moderatedBy: "ModeratorUser",
          moderationDate: "2025-06-10T11:30:00Z"
        }
      ]
    };
  },
  computed: {
    filteredReportedPosts() {
      let filtered = [...this.reportedPosts];
      
      // Apply status filter
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(post => post.status === this.filterStatus);
      }
      
      // Apply search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(query) || 
          post.author.toLowerCase().includes(query) ||
          post.reportReason.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    }
  },
  methods: {
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    },
    openPostDetails(post) {
      this.selectedPost = post;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedPost = null;
    },
    approvePost(post) {
      this.postToModerate = post;
      this.confirmAction = 'Approve';
      this.showConfirmation = true;
    },
    deletePost(post) {
      this.postToModerate = post;
      this.confirmAction = 'Delete';
      this.showConfirmation = true;
    },
    confirmApprove() {
      this.approvePost(this.selectedPost);
      this.closeModal();
    },
    confirmDelete() {
      this.deletePost(this.selectedPost);
      this.closeModal();
    },
    cancelConfirmation() {
      this.showConfirmation = false;
      this.postToModerate = null;
      this.confirmAction = '';
    },
    executeConfirmedAction() {
      if (this.confirmAction === 'Delete') {
        // Delete post logic
        const index = this.reportedPosts.findIndex(p => p.id === this.postToModerate.id);
        if (index !== -1) {
          // Add to moderation history
          this.recentlyModeratedPosts.unshift({
            id: this.postToModerate.id,
            title: this.postToModerate.title,
            author: this.postToModerate.author,
            action: 'Deleted',
            moderatedBy: 'SyahmiSyazwan', // Current logged-in user
            moderationDate: new Date().toISOString()
          });
          
          // Remove from reported posts
          this.reportedPosts.splice(index, 1);
        }
      } else if (this.confirmAction === 'Approve') {
        // Approve post logic
        const post = this.reportedPosts.find(p => p.id === this.postToModerate.id);
        if (post) {
          post.status = 'resolved';
          
          // Add to moderation history
          this.recentlyModeratedPosts.unshift({
            id: this.postToModerate.id,
            title: this.postToModerate.title,
            author: this.postToModerate.author,
            action: 'Approved',
            moderatedBy: 'SyahmiSyazwan', // Current logged-in user
            moderationDate: new Date().toISOString()
          });
        }
      }
      
      this.showConfirmation = false;
      this.postToModerate = null;
      this.confirmAction = '';
    },
    getStatusBadgeClass(status) {
      return {
        'pending': 'bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs',
        'resolved': 'bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs'
      }[status] || 'bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs';
    },
    getActionBadgeClass(action) {
      return {
        'Deleted': 'bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs',
        'Approved': 'bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs'
      }[action] || 'bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs';
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}
</script>