<template>
  <div class="w-full max-w-4xl mx-auto py-4 px-2">
    <!-- Categories -->
    <div class="flex flex-wrap gap-2 mb-2">
      <button
        @click="setCategoryFilter('All')"
        :class="[
          'px-4 py-1 rounded-full border transition',
          selectedCategory === 'All'
            ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow'
            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-400'
        ]"
      >
        All
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        @click="setCategoryFilter(cat)"
        :class="[
          'px-4 py-1 rounded-full border transition',
          selectedCategory === cat
            ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow'
            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-400'
        ]"
      >
        {{ cat }}
      </button>
    </div>
    <!-- Search & Create Post Row -->
    <div class="flex items-center gap-2 mb-4">
      <input v-model="searchQuery"
        type="text"
        placeholder="Search posts..."
        class="border rounded px-3 py-2 text-sm focus:outline-blue-400 flex-1 min-w-0 w-full md:w-96"
        @input="handleSearch"
      />
      <button
        class="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition"
        @click="showCreate = true"
      >
        <i class="pi pi-plus mr-2"></i> Create Post
      </button>
    </div>

    <!-- Create Post Modal -->
    <transition name="modal">
      <div v-if="showCreate" class="modal-mask" @click.self="showCreate = false">
        <div class="modal-container">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-bold text-lg">Create Post</h2>
            <button class="text-2xl text-gray-400 hover:text-gray-600" @click="showCreate = false">&times;</button>
          </div>
          <CreatePost
            :categories="categories"
            :community-id="community.id"
            @post-created="handlePostCreated"
            @cancel="showCreate = false"
          />
        </div>
      </div>
    </transition>

    <!-- No Posts Available Section -->
    <div v-if="paginatedPosts.length === 0" class="w-full flex flex-col items-center justify-center my-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4l3 3m6 1A9 9 0 11 3 12a9 9 0 0118 0z" />
      </svg>
      <div class="text-gray-500 text-lg font-semibold mb-1">No posts available</div>
      <div class="text-gray-400 text-base">Be the first to create a post by clicking the button above.</div>
    </div>

    <!-- Display Posts (thread style) -->
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="post in paginatedPosts"
        :key="post.id"
        class="bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg transition p-5 flex gap-4 cursor-pointer forum-thread"
        @click="openPostDetailModal(post)"
      >
        <!-- Left: User avatar -->
        <div class="flex flex-col items-center min-w-[60px]">
          <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-400 mb-2 overflow-hidden">
            <img
              v-if="userImages[post.userId]"
              :src="userImages[post.userId]"
              :alt="post.user?.username || 'User'"
              class="w-12 h-12 object-cover"
            />
            <span v-else>{{ post.user?.username?.charAt(0) || '?' }}</span>
          </div>
          <button
            @click.stop="toggleLike(post.id)"
            :class="liked[post.id] ? 'text-blue-600 font-bold' : 'text-gray-400'"
            class="flex flex-col items-center focus:outline-none group"
            title="Like"
          >
            <span class="text-xl leading-none group-hover:text-blue-600 transition">
              <i class="pi pi-heart"></i>
            </span>
            <span class="text-xs mt-0.5">{{ likes[post.id] || 0 }}</span>
          </button>
        </div>
        <!-- Right: Post content -->
        <div class="flex-1 flex flex-col min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between">
            <div class="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span v-if="post.user?.username" class="font-medium text-gray-700">
                {{ post.user.username }}
              </span>
              <span v-if="post.category" class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 ml-2 text-xs">
                {{ post.category }}
              </span>
              <span class="mx-1">•</span>
              <span class="post-time">{{ formatDate(post.date) }}</span>
              <span class="mx-1">•</span>
              <span>{{ post.viewCount }} views</span>
            </div>
            <!-- 3-dot menu -->
            <div class="relative ml-2">
              <button class="kebab-btn hover:text-blue-500 transition-colors" @click.stop="toggleMenu(post.id)">
                <span>⋮</span>
              </button>
              <div v-if="activeMenu === post.id" class="dropdown-menu z-30">
                <ul>
                  <li v-if="dbUserId && post.userId === dbUserId">
                    <button @click.stop="openEditModal(post); closeMenu()">Edit</button>
                  </li>
                  <li v-if="dbUserId && post.userId === dbUserId">
                    <button class="text-red-600" @click.stop="deletePost(post.id); closeMenu()">Delete</button>
                  </li>
                  <li v-if="dbUserId && post.userId !== dbUserId">
                    <button @click.stop="openReportDialog(post.id)">Report</button>
                    <ReportPostDialog :postId="currentReportPostId" v-model:visible="showReportDialogVisible"
                      @reported="onReported" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <h2 class="font-semibold text-xl text-gray-800 mb-2 truncate">{{ post.title }}</h2>
          <div class="text-gray-700 text-base mb-1 line-clamp-3 forum-thread-content" v-html="post.content"></div>
          <div class="flex gap-6 text-sm mt-2">
            <span class="flex items-center gap-1 text-gray-500">
              <i class="pi pi-heart"></i> {{ likes[post.id] || 0 }} Likes
            </span>
            <span class="flex items-center gap-1 text-gray-500">
              <i class="pi pi-comments"></i>
              {{ (commentLists[post.id] && commentLists[post.id].length) || 0 }} Comments
            </span>
          </div>
          <div class="mt-2 border-t pt-2">
            <div v-for="(comment, idx) in (commentLists[post.id] ? commentLists[post.id].slice(0, 2) : [])"
              :key="comment.id" class="mb-2 text-sm">
              <span class="font-medium text-gray-700">{{ comment.user?.username || 'User' }}:</span>
              <span>{{ comment.content }}</span>
              <span class="text-xs text-gray-400 ml-2">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <div v-if="commentLists[post.id] && commentLists[post.id].length > 2"
              class="text-xs text-blue-500 cursor-pointer" @click.stop="openPostDetailModal(post)">
              Show more comments
            </div>
            <div class="flex gap-2 mt-2">
              <input v-model="commentInputs[post.id]" type="text" placeholder="Add a comment..."
                class="border rounded px-2 py-1 text-sm flex-1 focus:outline-blue-400" @keyup.enter.stop="postComment(post.id)" @click.stop />
              <button class="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-600 transition"
                @click.stop="postComment(post.id)">Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-4">
      <button
        class="px-2 py-1 mx-1 rounded border"
        :class="currentPage === 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-700 border-gray-200'"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >Prev</button>
      <button
        v-for="page in totalPages"
        :key="page"
        class="px-2 py-1 mx-1 rounded border"
        :class="currentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-700 border-gray-200'"
        @click="goToPage(page)"
      >{{ page }}</button>
      <button
        class="px-2 py-1 mx-1 rounded border"
        :class="currentPage === totalPages ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-700 border-gray-200'"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >Next</button>
    </div>

    <!-- Edit Modal -->
    <div v-if="showModal" class="modal-mask" @click.self="closeEditModal">
      <div class="edit-modal-container">
        <h2 class="font-bold text-2xl mb-6">Edit Post</h2>
        <form @submit.prevent="updatePost" class="flex flex-col gap-4">
          <input type="text" v-model="editPost.title" placeholder="Title"
            class="border rounded px-3 py-2 w-full text-base" required />
          <textarea v-model="editPost.content" placeholder="Content" rows="10"
            class="border rounded px-3 py-2 w-full text-base" required></textarea>
          <select v-model="editPost.category" required class="border rounded px-3 py-2 w-full text-base">
            <option value="" disabled>Select a category</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <div class="flex gap-2 justify-end mt-4">
            <button type="button"
              class="bg-gray-200 text-gray-700 px-6 py-2 rounded font-semibold hover:bg-gray-300 transition-colors"
              @click="closeEditModal">
              Cancel
            </button>
            <button type="submit"
              class="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 transition-colors">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Post Detail Modal as a component -->
    <PostDetailModal v-if="showPostDetailModal" :show="showPostDetailModal" :post="detailPostData"
      :currentUser="currentUsername" :likes="likes[detailPostData.id] || 0" :liked="liked[detailPostData.id]"
      :comments="commentLists[detailPostData.id] || []" :profileImage="userImages[detailPostData.userId] || ''"
      :commentImages="commentImages" :currentUserImage="userImages[dbUserId] || ''" @close="closePostDetailModal"
      @add-comment="handleAddComment" @toggle-like="() => toggleLike(detailPostData.id)" />
  </div>
</template>

<script>
import PostDetailModal from './PostDetailModal.vue'
import ReportPostDialog from '@/components/Forum/ReportPostDialog.vue'
import CreatePost from './CreatePost.vue'
import { useUserStore } from "@/stores/userStore";

const PAGE_SIZE = 6;

export default {
  name: 'ForumMainContent',
  components: {
    PostDetailModal,
    CreatePost,
    ReportPostDialog
  },
  props: {
    community: { type: Object, required: true }
  },
  data() {
    return {
      showReportDialogVisible: false,
      currentReportPostId: null,
      commentImages: {},
      userImages: {},
      posts: [],
      filtered: [],
      newPost: { title: '', content: '', category: '' },
      editPost: { id: '', title: '', content: '', category: '' },
      showModal: false,
      dbUserId: null,
      activeMenu: null,
      likes: {},
      liked: {},
      commentInputs: {},
      commentLists: {},
      showPostDetailModal: false,
      detailPostData: {},
      showCreate: false,
      selectedCategory: 'All',
      categories: [
        "General Discussion",
        "Help & Support",
        "Feature Requests",
        "Bug Reports",
        "Announcements & Updates",
        "Language Learning Resources",
        "Tutorials & Guides",
        "Feedback & Suggestions",
        "Contributing & Development",
        "Localization & Translations",
        "Off-topic"
      ],
      searchQuery: '',
      currentPage: 1,
    }
  },
  computed: {
    filteredPosts() {
      let posts;
      if (!this.community || this.community.id === 'general') {
        posts = this.posts.filter(p => !p.communityId);
      } else {
        posts = this.posts.filter(p => p.communityId === this.community.id);
      }
      if (this.selectedCategory !== "All") {
        posts = posts.filter(p => p.category === this.selectedCategory);
      }
      if (this.searchQuery.trim().length > 0) {
        const q = this.searchQuery.toLowerCase();
        posts = posts.filter(
          p =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            (p.user && p.user.username && p.user.username.toLowerCase().includes(q))
        );
      }
      return posts;
    },
    paginatedPosts() {
      const start = (this.currentPage - 1) * PAGE_SIZE;
      return this.filteredPosts.slice(start, start + PAGE_SIZE);
    },
    totalPages() {
      return Math.ceil(this.filteredPosts.length / PAGE_SIZE) || 1;
    },
    currentUsername() {
      const userStore = useUserStore();
      return userStore.username || 'Current User';
    }
  },
  watch: {
    community: {
      immediate: true,
      handler() {
        this.currentPage = 1;
        this.fetchPosts();
      }
    }
  },
  async mounted() {
    const userStore = useUserStore();
    this.dbUserId = await this.fetchDbUserIdByClerkId(userStore.userId);
    await this.fetchPosts();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    handleSearch() {
      this.currentPage = 1;
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
    async handlePostCreated() {
      await this.fetchPosts();
      this.showCreate = false;
      this.currentPage = 1;
    },
    openReportDialog(postId) {
      this.currentReportPostId = postId;
      this.showReportDialogVisible = true;
    },
    onReported() {
      this.showReportDialogVisible = false;
    },
    async fetchUserProfile(userId) {
      if (!userId) return null;
      const res = await fetch(`http://localhost:3000/api/clerk-user/${userId}`);
      if (!res.ok) return null;
      return await res.json();
    },
    async countView(postId) {
      if (!postId) return;
      await fetch(`http://localhost:3000/api/forum/posts/${postId}/view`, { method: 'POST' });
    },
    setCategoryFilter(cat) {
      this.selectedCategory = cat;
      this.currentPage = 1;
    },
    handleClickOutside(e) {
      if (!e.target.closest('.kebab-btn') && !e.target.closest('.dropdown-menu')) {
        this.activeMenu = null;
      }
    },
    toggleMenu(postId) {
      this.activeMenu = this.activeMenu === postId ? null : postId;
    },
    closeMenu() {
      this.activeMenu = null;
    },
    async fetchDbUserIdByClerkId(clerkUserId) {
      const res = await fetch(`http://localhost:3000/users/by-clerk-id/${clerkUserId}`);
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      return data.id;
    },
    async fetchPosts() {
      const res = await fetch('http://localhost:3000/api/forum/posts');
      const allPosts = await res.json();
      this.posts = allPosts;

      let filtered;
      if (!this.community || this.community.id === 'general') {
        filtered = this.posts.filter(p => !p.communityId);
      } else {
        filtered = this.posts.filter(p => p.communityId === this.community.id);
      }
      for (const post of filtered) {
        await this.fetchLikeStatus(post.id);
        await this.fetchComments(post.id);
        if (!this.userImages[post.userId]) {
          const profile = await this.fetchUserProfile(post.userId);
          if (profile && profile.imageUrl) {
            this.userImages[post.userId] = profile.imageUrl;
          }
        }
      }
    },
    async createPost() {
      const userStore = useUserStore();
      if (!this.dbUserId) {
        this.dbUserId = await this.fetchDbUserIdByClerkId(userStore.userId);
      }
      await fetch('http://localhost:3000/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.newPost,
          userId: this.dbUserId,
          communityId: this.community.id
        })
      });
      this.newPost = { title: '', content: '', category: '' };
      this.showCreate = false;
      await this.fetchPosts();
      this.currentPage = 1;
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
      await fetch(`http://localhost:3000/api/forum/posts/${this.editPost.id}`, {
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
      await fetch(`http://localhost:3000/api/forum/posts/${id}`, {
        method: 'DELETE'
      });
      await this.fetchPosts();
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    async fetchLikeStatus(postId) {
      const res = await fetch(`http://localhost:3000/api/forum/posts/${postId}/like-status?userId=${this.dbUserId}`);
      const data = await res.json();
      this.likes[postId] = data.count;
      this.liked[postId] = data.liked;
    },
    async toggleLike(postId) {
      await fetch(`http://localhost:3000/api/forum/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: this.dbUserId })
      });
      await this.fetchLikeStatus(postId);
      if (this.detailPostData && this.detailPostData.id === postId) {
        await this.fetchLikeStatus(postId);
      }
      this.countView(postId);
    },
    async fetchComments(postId) {
      const res = await fetch(`http://localhost:3000/api/forum/posts/${postId}/comments`);
      const comments = await res.json();
      this.commentLists[postId] = comments;

      for (const comment of comments) {
        const userId = comment.userId;
        if (userId && !this.commentImages[userId]) {
          const profile = await this.fetchUserProfile(userId);
          if (profile && profile.imageUrl) {
            this.commentImages[userId] = profile.imageUrl;
          }
        }
      }
    },
    async postComment(postId) {
      const content = this.commentInputs[postId];
      if (!content) return;
      await fetch(`http://localhost:3000/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId: this.dbUserId })
      });
      this.commentInputs[postId] = '';
      await this.fetchComments(postId);
      this.countView(postId);
    },
    async openPostDetailModal(post) {
      this.detailPostData = post;
      this.showPostDetailModal = true;
      this.fetchComments(post.id);
      this.fetchLikeStatus(post.id);
      this.countView(post.id);

      if (!this.userImages[post.userId]) {
        const profile = await this.fetchUserProfile(post.userId);
        if (profile && profile.imageUrl) {
          this.userImages[post.userId] = profile.imageUrl;
        }
      }

      try {
        const res = await fetch(`http://localhost:3000/api/forum/posts/${post.id}`);
        if (res.ok) {
          const updatedPost = await res.json();
          this.detailPostData = updatedPost;
          const idx = this.posts.findIndex(p => p.id === post.id);
          if (idx !== -1) this.posts[idx] = updatedPost;
        }
      } catch (e) { }
    },
    closePostDetailModal() {
      this.showPostDetailModal = false;
      this.detailPostData = {};
    },
    async handleAddComment(commentPayload) {
      await this.postComment(this.detailPostData.id, commentPayload.content);
      await this.fetchComments(this.detailPostData.id);
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
  width: 100vw;
  height: 100vh;
  background-color: rgba(40, 40, 60, 0.18);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}
.edit-modal-container {
  width: 98%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
}
.modal-container {
  width: 95%;
  max-width: 540px;
  background-color: #fff;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
.kebab-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.6rem;
  line-height: 1;
  padding: 0 5px;
}
.dropdown-menu {
  position: absolute;
  top: 1.8rem;
  right: 0.5rem;
  z-index: 20;
  background: white;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  padding: 0.25rem 0;
}
.dropdown-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.dropdown-menu li {
  width: 100%;
}
.dropdown-menu button {
  width: 100%;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  text-align: left;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
}
.dropdown-menu button:disabled {
  color: #aaa;
  cursor: not-allowed;
}
.dropdown-menu .text-red-600 {
  color: #dc2626;
}
.forum-thread-content {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 1.2em;
}
@media (max-width: 900px) {
  .edit-modal-container {
    max-width: 98vw;
    padding: 1.3rem 0.5rem;
  }
}
</style>