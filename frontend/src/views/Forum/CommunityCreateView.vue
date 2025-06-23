<template>
  <div>
    <CommunityCreateForm :user-id="userId" :user-role="userRole" />
  </div>
</template>

<script>
import CommunityCreateForm from '@/components/Forum/CommunityCreateForm.vue'
// Replace with your real user store or authentication method
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'CommunityCreateView',
  components: {
    CommunityCreateForm
  },
  setup() {
    const userStore = useUserStore()
    const userId = userStore.userId // e.g. 'abc123'
    const userRole = userStore.role // e.g. 'admin'

    return { userId, userRole }
  }
}
</script>