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
                            {{ post.author.charAt(0) }}
                        </div>
                        <div>
                            <p class="font-semibold">{{ post.author }}</p>
                            <p class="text-xs text-gray-500">{{ post.time }}</p>
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
                            {{ post.views }} views
                        </span>
                        <span class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {{ post.likes }} likes
                        </span>
                    </div>

                    <div class="comments-section">
                        <h4 class="font-semibold mb-4">{{ comments.length }} Comments</h4>

                        <div class="comment-form mb-6">
                            <div class="flex items-start">
                                <div
                                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-3">
                                    {{ currentUser.charAt(0) }}
                                </div>
                                <div class="flex-1">
                                    <textarea v-model="newComment"
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Write a comment..." rows="2"></textarea>
                                    <button @click="addComment"
                                        class="mt-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                        :disabled="!newComment.trim()">
                                        Post Comment
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="comments-list space-y-4">
                            <div v-for="comment in comments" :key="comment.id" class="comment-item">
                                <div class="flex items-start">
                                    <div
                                        class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-3">
                                        {{ comment.author.charAt(0) }}
                                    </div>
                                    <div class="flex-1">
                                        <div class="comment-header flex items-center mb-1">
                                            <span class="font-semibold mr-2">{{ comment.author }}</span>
                                            <span class="text-xs text-gray-500">{{ comment.time }}</span>
                                        </div>
                                        <p class="text-sm">{{ comment.content }}</p>
                                        <div class="comment-actions mt-2 flex items-center">
                                            <button class="text-xs text-gray-500 hover:text-blue-500 mr-3">Like</button>
                                            <button class="text-xs text-gray-500 hover:text-blue-500">Reply</button>
                                        </div>
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
            required: true,
            default: () => ({
                title: '',
                author: '',
                time: '',
                content: '',
                views: '',
                likes: '',
                comments: [] // Ensure comments is always an array
            })
        },
        currentUser: {
            type: String,
            default: 'Current User'
        }
    },
    data() {
        return {
            newComment: ''
        }
    },
    computed: {
        comments() {
            return this.post.comments || []
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        addComment() {
            if (!this.newComment.trim()) return

            const newComment = {
                id: Date.now(),
                author: this.currentUser,
                time: 'Just now',
                content: this.newComment,
                likes: 0
            }

            this.$emit('add-comment', newComment)
            this.newComment = ''
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