<!-- CreatePost.vue -->
<template>
  <form @submit.prevent="submit"
    class="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col gap-3 shadow">
    <input type="text" v-model="form.title" placeholder="What's your question or topic?"
      class="border rounded px-3 py-2 w-full text-base" required />
    <textarea v-model="form.content" placeholder="Add more details..." rows="3"
      class="border rounded px-3 py-2 w-full text-base" required></textarea>
    <div class="flex gap-2">
      <select v-model="form.category" required class="border rounded px-3 py-2 w-full text-base">
        <option value="" disabled>Select a category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <button type="submit"
        class="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 transition-colors">
        Post
      </button>
      <button type="button"
        class="bg-gray-200 text-gray-700 px-6 py-2 rounded font-semibold hover:bg-gray-300 transition-colors"
        @click="$emit('cancel')">
        Cancel
      </button>
    </div>
  </form>
</template>

<script>
import { useUserStore } from "@/stores/userStore";
export default {
  name: "CreatePost",
  props: {
    categories: { type: Array, required: true },
    communityId: { type: String, required: true }
  },
  data() {
    return {
      form: { title: '', content: '', category: '' }
    }
  },
  methods: {
    async submit() {
      const userStore = useUserStore();
      const dbUserId = await fetch(`http://localhost:3000/users/by-clerk-id/${userStore.userId}`)
        .then(res => res.json()).then(d => d.id);

      await fetch('http://localhost:3000/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.form,
          userId: dbUserId,
          communityId: this.communityId === 'general' ? null : this.communityId         // <-- send communityId!
        })
      });
      this.form = { title: '', content: '', category: '' };
      this.$emit('post-created');
    }
  }
}
</script>