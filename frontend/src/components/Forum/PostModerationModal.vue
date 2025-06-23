<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Moderate Post</h3>
          <button class="modal-close" @click="close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Report Information -->
          <div v-if="reportedPost" class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 class="font-semibold text-amber-800">Report Details</h4>
            </div>
            <div class="mt-2 ml-7 text-sm text-amber-700">
              <p><span class="font-semibold">Reported by:</span> {{ reportedPost.reportedBy || 'N/A' }}</p>
              <p><span class="font-semibold">Reason:</span> {{ reportedPost.reportReason || 'N/A' }}</p>
              <p><span class="font-semibold">Date reported:</span> {{ formatDate(reportedPost.reportDate) }}</p>
              <p v-if="reportedPost.reportResolved" class="text-green-700 font-semibold mt-2">
                <span class="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                This report has already been resolved.
              </p>
            </div>
          </div>
          
          <!-- Post Content -->
          <div v-if="reportedPost" class="post-author flex items-center mb-4">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-white font-bold mr-3">
              {{ reportedPost.user?.username?.charAt(0) || '?' }}
            </div>
            <div>
              <p class="font-semibold">{{ reportedPost.user?.username || reportedPost.author }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(reportedPost.date || reportedPost.time) }}</p>
            </div>
          </div>

          <h3 v-if="reportedPost" class="text-xl font-semibold mb-3">{{ reportedPost.title }}</h3>
          
          <div v-if="reportedPost" class="post-content mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p class="whitespace-pre-line">{{ reportedPost.content || "No content provided" }}</p>
          </div>

          <div v-if="reportedPost" class="post-stats flex gap-4 mb-6">
            <span class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ reportedPost.viewCount || reportedPost.views }} views
            </span>
            <span class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {{ reportedPost.likes || 0 }} likes
            </span>
            <span class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {{ reportedPost.comments || 0 }} comments
            </span>
          </div>

          <!-- Moderation Notes -->
          <div class="mb-6">
            <label for="moderationNotes" class="block mb-2 font-medium text-gray-700">Moderation Notes:</label>
            <textarea 
              id="moderationNotes" 
              v-model="moderationNotes" 
              rows="3" 
              class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about this moderation decision..."></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3">
            <button @click="close" class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button 
              v-if="!reportedPost.reportResolved"
              @click="approvePost" 
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
              Approve Post
            </button>
            <button 
              v-if="!reportedPost.reportResolved"
              @click="deletePost" 
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
              Delete Post
            </button>
            <button 
              v-if="reportedPost.reportResolved"
              disabled
              class="px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed">
              Moderation Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'PostModerationModal',
  props: {
    show: Boolean,
    postId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      reportedPost: null,
      moderationNote: '',
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.fetchReportedPost();
      }
    },
    postId(val) {
      if (val && this.show) {
        this.fetchReportedPost();
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
      this.reportedPost = null;
      this.moderationNotes = '';
    },
    async fetchReportedPost() {
      // Fetch the reported post details from backend (adjust the endpoint as needed)
      try {
        const res = await fetch(`http://localhost:3000/api/admin/forum/reported/${this.postId}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        this.reportedPost = data;
        this.moderationNotes = data.moderationNote || '';
      } catch (error) {
        this.reportedPost = null;
        alert('Failed to fetch reported post details.');
      }
    },
    async approvePost() {
      // Send moderation action to backend to approve the post
      if (this.reportedPost?.reportResolved) return;
      try {
        const res = await fetch(`http://localhost:3000/api/admin/forum/moderate/${this.postId}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes : this.moderationNotes })
        });
        if (!res.ok) throw new Error('Failed to approve post');
        this.$emit('moderated', { action: 'approved', postId: this.postId, notes: this.moderationNotes });
        this.close();
      } catch (error) {
        alert('Failed to approve post.');
      }
    },
    async deletePost() {
      // Send moderation action to backend to delete the post
      if (this.reportedPost?.reportResolved) return;
      if (!confirm('Are you sure you want to delete this post?')) return;
      try {
        const res = await fetch(`http://localhost:3000/api/admin/forum/moderate/${this.postId}/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: this.moderationNotes })
        });
        if (!res.ok) throw new Error('Failed to delete post');
        this.$emit('moderated', { action: 'deleted', postId: this.postId, notes: this.moderationNotes });
        this.close();
      } catch (error) {
        alert('Failed to delete post.');
      }
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
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>