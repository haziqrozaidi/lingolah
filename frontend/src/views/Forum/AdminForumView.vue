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
            <div class="text-sm text-gray-600">Reported by: {{ post.reportedBy || 'N/A' }} | Reason: {{ post.reportReason || 'N/A' }}</div>
            <div class="text-xs text-gray-500">Author: {{ post.user?.username || 'Unknown' }} | Date: {{ formatDate(post.reportDate) }}</div>
          </div>
          <button
            class="ml-4 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            @click="openModal(post.id)">
            Moderate
          </button>
        </li>
      </ul>
    </section>
    <section class="mt-10">
      <h2 class="text-lg font-semibold mb-2">Resolved Reported Posts</h2>
      <div v-if="resolved.length === 0" class="mb-4 text-gray-500">No resolved reports yet.</div>
      <ul>
        <li v-for="post in resolved" :key="post.id" class="border rounded p-4 mb-3">
          <div class="font-semibold">{{ post.title }}</div>
          <div class="text-xs text-gray-500">Author: {{ post.user?.username || 'Unknown' }}</div>
          <div class="text-xs text-gray-500">Resolved: {{ formatDate(post.reportDate) }}</div>
          <div class="text-xs text-gray-500">Moderator Notes: {{ post.moderationNotes || 'None' }}</div>
          <div class="text-xs text-gray-500">Status: {{ post.status || 'resolved' }}</div>
        </li>
      </ul>
    </section>
    <!-- Modal -->
    <PostModerationModal
      :show="modal.show"
      :postId="modal.postId"
      @close="closeModal"
      @moderated="onModerated"
    />
  </div>
</template>

<script>
import PostModerationModal from '@/components/Forum/PostModerationModal.vue';

export default {
  name: 'ForumModerationPage',
  components: { PostModerationModal },
  data() {
    return {
      pending: [],
      resolved: [],
      modal: {
        show: false,
        postId: null,
      },
    };
  },
  mounted() {
    this.fetchReports();
  },
  methods: {
    async fetchReports() {
      const [pending, resolved] = await Promise.all([
        fetch('http://localhost:3000/api/admin/forum/reported/pending').then(r => r.json()),
        fetch('http://localhost:3000/api/admin/forum/reported/resolved').then(r => r.json())
      ]);
      this.pending = pending;
      this.resolved = resolved;
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