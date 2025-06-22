<template>
  <div>
    <!-- Create Post Form -->
    <form @submit.prevent="createPost"
      class="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col gap-3 shadow">
      <input type="text" v-model="newPost.title" placeholder="What's your question or topic?"
        class="border rounded px-3 py-2 w-full text-base" required />
      <textarea v-model="newPost.content" placeholder="Add more details..." rows="3"
        class="border rounded px-3 py-2 w-full text-base" required></textarea>
      <div class="flex gap-2">
        <input type="text" v-model="newPost.category" placeholder="Category (optional)"
          class="border rounded px-3 py-2 w-full text-base" />
        <button type="submit"
          class="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 transition-colors">
          Post
        </button>
      </div>
    </form>

    <!-- Display Posts -->
    <div v-for="post in posts" :key="post.id"
      class="forum-post bg-white rounded-xl p-4 mb-4 shadow flex flex-col sm:flex-row">
      <div class="post-avatar flex-shrink-0 mr-4 mb-2 sm:mb-0">
        <div
          class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-400">
          {{ post.user ? post.user.username[0] : '?' }}
        </div>
      </div>
      <div class="post-content flex-1 flex flex-col">
        <div class="post-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <h2 class="post-title font-semibold text-lg text-gray-800">{{ post.title }}</h2>
          <span class="post-time p-2 text-xs text-gray-500 mt-0.5">{{ formatDate(post.date) }}</span>
        </div>
        <div class="post-stats flex gap-4 sm:flex-row flex-col sm:gap-4 gap-1 text-xs text-gray-500">
          <span>{{ post.viewCount }} views</span>
        </div>
        <div class="flex gap-2 mt-2">
          <button class="btn-small" @click="openEditModal(post)">Edit</button>
          <button class="btn-small bg-red-500 hover:bg-red-600" @click="deletePost(post.id)">Delete</button>
          <button @click="reportPost(post.id)" :disabled="post.reported">
            {{ post.reported ? "Reported" : "Report" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 class="font-bold text-lg mb-2">Edit Post</h2>
        <form @submit.prevent="updatePost">
          <input v-model="editPost.title" class="input mb-2" required />
          <textarea v-model="editPost.content" class="input mb-2" required />
          <input v-model="editPost.category" class="input mb-2" />
          <div class="flex gap-2">
            <button type="submit" class="btn">Save</button>
            <button type="button" class="btn-small bg-gray-300" @click="closeEditModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/userStore";
export default {
  name: 'ForumMainContent',
  props: {
    // posts: { type: Array, required: false }
  },
  data() {
    return {
      posts: [],
      newPost: { title: '', content: '', category: '' },
      editPost: { id: '', title: '', content: '', category: '' },
      showModal: false,
      currentUserId: 'replace-with-user-id', // TODO: Set this from auth
      dbUserId: null
    }
  },
  async mounted() {
    this.fetchPosts();
    const userStore = useUserStore();
    this.dbUserId = await this.fetchDbUserIdByClerkId(userStore.userId);
    console.log("DB User ID:", this.dbUserId);
  },
  methods: {
    // In your Pinia store or a Vue method
    async fetchDbUserIdByClerkId(clerkUserId) {
      const res = await fetch(`http://localhost:3000/users/by-clerk-id/${clerkUserId}`);
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      // Now you have data.id as the DB user ID!
      return data.id;
    },
    async fetchPosts() {
      const res = await fetch('http://localhost:3000/api/forum/posts');
      this.posts = await res.json();
    },
    async createPost() {
      await fetch('http://localhost:3000/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.newPost,
          userId: this.dbUserId // Assuming you have user ID from auth
        })
      });
      this.newPost = { title: '', content: '', category: '' };
      await this.fetchPosts();
    },
    async reportPost(postId) {
      try {
        const res = await fetch(`http://localhost:3000/api/forum/posts/${postId}/report`, {
          method: 'POST',
        });
        if (!res.ok) {
          const error = await res.json();
          alert('Failed to report post: ' + error.error);
          return;
        }
        await this.fetchPosts(); // Refresh the posts list
        alert('Post reported!');
      } catch (err) {
        alert('Network error: ' + err.message);
      }
    },
    openEditModal(post) {
      this.editPost = { ...post };
      this.showModal = true;
    },
    closeEditModal() {
      this.showModal = false;
      this.editPost = { id: '', title: '', content: '', category: '' };
    },
    async updatePost() {
      await fetch(`http://localhost:4000/api/forum/posts/${this.editPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: this.editPost.title,
          content: this.editPost.content,
          category: this.editPost.category
        })
      });
      this.closeEditModal();
      await this.fetchPosts();
    },
    async deletePost(id) {
      if (!confirm('Are you sure you want to delete this post?')) return;
      await fetch(`http://localhost:4000/api/forum/posts/${id}`, {
        method: 'DELETE'
      });
      await this.fetchPosts();
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    }
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  width: 100%;
}

.btn {
  background-color: #3b82f6;
  color: #fff;
  padding: 0.25rem 1rem;
  border-radius: 0.5rem;
}

.btn-small {
  background-color: #3b82f6;
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
}
</style>