<template>
  <div>
    <h3 class="text-lg font-semibold mb-3 mt-8">Resolved Reports</h3>
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="resolvedReports.length === 0" class="text-gray-500">No resolved reports.</div>
    <ul v-else>
      <li v-for="post in resolvedReports" :key="post.id" class="bg-green-50 border-l-4 border-green-500 border rounded p-4 mb-3">
        <div class="font-semibold">{{ post.title }}</div>
        <div class="text-xs text-gray-500">Author: {{ post.user?.username || 'Unknown' }}</div>
        <div class="text-xs text-amber-700">
          <span>Reported/Resolved</span>
        </div>
        <div class="text-xs text-gray-500">Moderator Notes: {{ post.moderationNote || 'None' }}</div>
        <div class="text-xs text-gray-500">Status: resolved</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ResolvedReportsSection',
  data() {
    return {
      resolvedReports: [],
      loading: true,
    };
  },
  mounted() {
    this.fetchResolvedReports();
  },
  methods: {
    async fetchResolvedReports() {
      try {
        const res = await fetch('http://localhost:3000/api/admin/forum/reported/resolved');
        if (!res.ok) throw new Error('Failed to fetch resolved reports');
        this.resolvedReports = await res.json();
      } catch (e) {
        this.resolvedReports = [];
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>