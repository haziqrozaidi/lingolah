<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask" @click.self="close">
            <div class="modal-container">
                <div class="modal-header">
                    <h3 class="modal-title">{{ post.title }}</h3>
                    <button class="modal-close" @click="close">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="post-author flex items-center mb-4">
                        <div
                            class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-white font-bold mr-3">
                            <img v-if="profileImage" :src="profileImage" :alt="post.user?.username || 'User'"
                                class="w-10 h-10 rounded-full object-cover" />
                            <span v-else>
                                {{ post.user?.username ? post.user.username.charAt(0) : '?' }}
                            </span>
                        </div>
                        <div>
                            <p class="font-semibold">{{ post.user?.username || 'Unknown' }}</p>
                            <p class="text-xs text-gray-500">{{ formatDate(post.date) }}</p>
                        </div>
                    </div>

                    <div class="post-content mb-6">
                        <p class="whitespace-pre-line">{{ post.content || "No content provided" }}</p>
                    </div>

                    <div class="post-stats flex gap-4 mb-6">
                        <span class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {{ post.viewCount }} views
                        </span>
                        <span class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {{ likes }} likes
                        </span>
                        <span class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M18 10c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7z" />
                            </svg>
                            {{ comments.length }} comments
                        </span>
                    </div>

                    <!-- Like Button (in modal) -->
                    <div class="mb-6">
                        <button @click="toggleLike" :class="liked ? 'text-blue-600 font-bold' : 'text-gray-500'"
                            class="flex items-center focus:outline-none">
                            <span v-if="liked">♥</span>
                            <span v-else>♡</span>
                            <span class="ml-1">{{ likes }} Like{{ likes === 1 ? '' : 's' }}</span>
                        </button>
                    </div>

                    <div class="comments-section">
                        <h4 class="font-semibold mb-4">{{ comments.length }} Comments</h4>

                        <div class="comment-form mb-6">
                            <div class="flex items-start">
                                <div
                                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-3">
                                    <img v-if="currentUserImage" :src="currentUserImage" :alt="currentUser"
                                        class="w-8 h-8 rounded-full object-cover" />
                                    <span v-else>{{ currentUser.charAt(0) }}</span>
                                </div>
                                <div class="flex-1">
                                    <textarea v-model="newComment"
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Write a comment..." rows="2"></textarea>
                                    <button @click="addComment"
                                        class="mt-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                        :disabled="!newComment.trim() || postingComment">
                                        <span v-if="postingComment">Posting...</span>
                                        <span v-else>Post Comment</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="comments-list space-y-4">
                            <div v-for="comment in comments" :key="comment.id" class="comment-item">
                                <div class="flex items-start">
                                    <div
                                        class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-3">
                                        <img v-if="commentImages[comment.userId]" :src="commentImages[comment.userId]"
                                            :alt="comment.user?.username || 'User'"
                                            class="w-8 h-8 rounded-full object-cover" />
                                        <span v-else>
                                            {{ comment.user?.username ? comment.user.username.charAt(0) : 'U' }}
                                        </span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="comment-header flex items-center mb-1">
                                            <span class="font-semibold mr-2">{{ comment.user?.username || comment.author
                                                || 'User' }}</span>
                                            <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt ||
                                                comment.time) }}</span>
                                        </div>
                                        <p class="text-sm">{{ comment.content }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script>
export default {
    name: 'PostDetailModal',
    props: {
        show: Boolean,
        post: {
            type: Object,
            required: true
        },
        currentUser: {
            type: String,
            default: 'Current User'
        },
        likes: {
            type: Number,
            default: 0
        },
        liked: {
            type: Boolean,
            default: false
        },
        comments: {
            type: Array,
            default: () => []
        },
        profileImage: {
            type: String,
            default: ''
        },
        commentImages: {
            type: Object,
            default: () => ({})
        },
        currentUserImage: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            newComment: '',
            postingComment: false
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        async addComment() {
            if (!this.newComment.trim()) return
            this.postingComment = true
            const commentPayload = {
                content: this.newComment,
                user: { username: this.currentUser },
                createdAt: new Date().toISOString(),
                // You can add other properties as needed
            }
            // Emit for parent to handle API call and refresh
            this.$emit('add-comment', commentPayload)
            this.newComment = ''
            this.postingComment = false
        },
        toggleLike() {
            this.$emit('toggle-like')
        },
        formatDate(date) {
            if (!date) return ''
            const d = typeof date === 'string' ? new Date(date) : date
            return d.toLocaleString()
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
    background-color: rgba(40, 40, 60, 0.18);
    /* frosted glass background */
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
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