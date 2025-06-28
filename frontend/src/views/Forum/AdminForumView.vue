<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Forum Moderation</h1>
    <section>
      <h2 class="text-lg font-semibold mb-2">Pending Reported Posts</h2>
      <div v-if="pending.length === 0" class="mb-4 text-gray-500">No reported posts needing moderation.</div>
      <ul>
        <li v-for="post in pending" :key="post.id" class="border rounded p-4 mb-3 flex justify-between items-center">
          <div>
            <div class="font-semibold">{{ post.title }}</div>
            <!-- Show report details if loaded -->
            <div v-if="reportDetailsMap[post.id]" class="text-sm text-amber-700">
              <span>Reported by: {{ reportDetailsMap[post.id].reporter?.username || 'N/A' }}</span>
              <span> | Reason: {{ reportDetailsMap[post.id].reason || 'N/A' }}</span>
              <span> | Date: {{ formatDate(reportDetailsMap[post.id].dateReported) }}</span>
            </div>
            <div v-else class="text-sm text-amber-700">
              <span>Report details loading...</span>
            </div>
            <div class="text-xs text-gray-500">Author: {{ post.user?.username || 'Unknown' }}</div>
          </div>
          <button class="ml-4 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            @click="openModal(post.id)">
            Moderate
          </button>
        </li>
      </ul>
    </section>
    <section class="mt-10">
      <ResolvedReportsSection />
    </section>
    <!-- Modal -->
    <PostModerationModal :show="modal.show" :postId="modal.postId" @close="closeModal" @moderated="onModerated" />
  </div>
</template>

<script>
import PostModerationModal from '@/components/Forum/PostModerationModal.vue';
import ResolvedReportsSection from '@/components/Forum/ResolvedReportSection.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default {
  name: 'ForumModerationPage',
  components: { PostModerationModal, ResolvedReportsSection },
  data() {
    return {
      pending: [],
      resolved: [],
      modal: {
        show: false,
        postId: null,
      },
      reportDetailsMap: {}, // Map postId to report details
    };
  },
  mounted() {
    this.fetchReports();
  },
  methods: {
    async fetchReports() {
      const [pending, resolved] = await Promise.all([
        fetch(`${API_URL}/api/admin/forum/reported/pending`).then(r => r.json()),
        fetch(`${API_URL}/api/admin/forum/reported/resolved`).then(r => r.json())
      ]);
      this.pending = pending;
      this.resolved = resolved;

      // Fetch report details for all posts (pending & resolved)
      const allPosts = [...pending, ...resolved];
      await this.fetchAllReportDetails(allPosts);
    },
    async fetchAllReportDetails(posts) {
      // For each post, fetch its report details and store in reportDetailsMap
      const promises = posts.map(async post => {
        try {
          const res = await fetch(`${API_URL}/api/admin/forum/posts/${post.id}/report`);
          if (res.ok) {
            const details = await res.json();
            this.reportDetailsMap[post.id] = details;
          } else {
            this.reportDetailsMap[post.id] = { reason: 'N/A', reporter: { username: 'N/A' }, dateReported: null };
          }
        } catch (e) {
          this.reportDetailsMap[post.id] = { reason: 'N/A', reporter: { username: 'N/A' }, dateReported: null };
        }
      });
      await Promise.all(promises);
    },
    openModal(postId) {
      this.modal.show = true;
      this.modal.postId = postId;
    },
    closeModal() {
      this.modal.show = false;
      this.modal.postId = null;
    },
    async onModerated({ action, postId, notes }) {
      await this.fetchReports();
      // Optionally, show a confirmation
      this.$nextTick(() => {
        if (action === 'approved') {
          alert('Post approved and report resolved.');
        } else if (action === 'deleted') {
          alert('Post deleted and report resolved.');
        }
      });
    },
    formatDate(dateString) {
      if (!dateString) return '';
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
};
</script>