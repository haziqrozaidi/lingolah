<template>
  <div class="max-w-7xl mx-auto mt-10 px-2 w-full">
    <!-- Community Creation Section -->
    <section class="bg-white rounded-lg shadow p-6 mb-10 border border-gray-200 w-full">
      <h2 class="text-xl font-bold mb-4 text-blue-800 flex items-center gap-2">
        <i class="pi pi-plus-circle text-blue-700"></i> Create a New Community
      </h2>
      <CommunityCreateForm :user-id="userId" :user-role="userRole" @created="refreshCommunities" />
    </section>

    <!-- My Communities Section -->
    <section class="bg-white rounded-lg shadow p-6 border border-gray-200 w-full">
      <h2 class="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2">
        <i class="pi pi-users text-blue-700"></i> My Communities
      </h2>
      <div v-if="communities.length === 0" class="text-gray-400 text-center py-8">
        You have not joined any communities yet.
      </div>
      <div v-else>
        <!-- Search and Paging Controls -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div class="relative w-full sm:w-80">
            <span class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>
            <input
              v-model="search"
              type="text"
              placeholder="Search communities..."
              class="pl-10 pr-4 py-2 rounded border border-gray-300 w-full focus:ring-2 focus:ring-blue-500"
              @input="onSearch"
            />
          </div>
          <Paginator
            :rows="pageSize"
            :totalRecords="filteredCommunities.length"
            :first="(currentPage - 1) * pageSize"
            @page="onPage"
            template="PrevPageLink PageLinks NextPageLink"
            class="!w-auto"
          />
        </div>
        <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          <li
            v-for="community in pagedCommunities"
            :key="community.id"
            class="bg-blue-50 border border-blue-100 shadow-sm rounded-lg p-5 flex flex-col justify-between hover:shadow-lg hover:border-blue-300 transition-all min-h-[170px] w-full"
          >
            <div class="flex-1 flex flex-col">
              <div class="text-lg font-semibold mb-2 text-blue-900 flex items-center gap-2">
                <i class="pi pi-hashtag text-blue-600"></i> {{ community.name }}
              </div>
              <div class="text-sm text-gray-600 mb-2 flex gap-4">
                <span>
                  <i class="pi pi-users mr-1"></i> Members: <span class="font-semibold">{{ community.memberCount ?? '—' }}</span>
                </span>
                <span
                  v-if="community.status"
                  class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200"
                >
                  {{ community.status }}
                </span>
              </div>
              <div class="flex-1"></div>
            </div>
            <Button
              label="View Members"
              icon="pi pi-users"
              class="mt-4 w-full p-button-sm p-button-outlined"
              @click="showMembers(community)"
            />
          </li>
        </ul>
      </div>
    </section>

    <!-- Members Modal -->
    <CommunityMembersModal
      v-model:show="modalOpen"
      :members="communityMembers"
      :community="selectedCommunity"
      :is-admin="userRole === 'admin'"
      :admin-id="userId"
      @kick="handleKickMember"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import CommunityCreateForm from '@/components/Forum/CommunityCreateForm.vue'
import CommunityMembersModal from '@/components/Forum/CommunityMembersModal.vue'
import { useUserStore } from '@/stores/userStore'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const userStore = useUserStore()
const userId = userStore.userId
const userRole = userStore.role

const communities = ref([])
const selectedCommunity = ref(null)
const communityMembers = ref([])
const modalOpen = ref(false)

// search and paging state
const search = ref("")
const pageSize = 6
const currentPage = ref(1)

// Filtered communities based on search
const filteredCommunities = computed(() => {
  if (!search.value?.trim()) return communities.value
  const s = search.value.trim().toLowerCase()
  return communities.value.filter(c =>
    c.name?.toLowerCase().includes(s)
    || ("" + c.memberCount).includes(s)
    || (c.status?.toLowerCase().includes(s))
  )
})

// Communities for the current page
const pagedCommunities = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCommunities.value.slice(start, start + pageSize)
})

function onPage(event) {
  currentPage.value = Math.floor(event.first / pageSize) + 1
}

function onSearch() {
  currentPage.value = 1 // reset to first page when searching
}

async function handleKickMember(member) {
  if (!selectedCommunity.value || !member?.user?.id) return
  try {
    const res = await fetch(
      `${API_URL}/api/community/${selectedCommunity.value.id}/members/${member.user.id}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    if (!res.ok) throw new Error('Failed to kick member')
    await showMembers(selectedCommunity.value)
    await fetchCommunities()
  } catch (e) {
    alert('Failed to kick member: ' + e.message)
  }
}
async function fetchCommunities() {
  const res = await fetch(`${API_URL}/api/community/joined?clerkUserId=` + encodeURIComponent(userId), {
    credentials: 'include'
  })
  const data = await res.json()
  communities.value = data.communities || []
  currentPage.value = 1
}

async function showMembers(community) {
  selectedCommunity.value = community
  communityMembers.value = []
  modalOpen.value = true
  try {
    const res = await fetch(`${API_URL}/api/community/${community.id}/members`, {
      credentials: 'include'
    })
    const data = await res.json()
    communityMembers.value = data.members || []
  } catch (e) {
    communityMembers.value = []
  }
}

function refreshCommunities() {
  fetchCommunities()
}

onMounted(fetchCommunities)
</script>

<style scoped>
ul.grid {
  width: 100%;
}
ul.grid > li {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 170px;
}
input[type="text"] {
  background: white;
}
</style>