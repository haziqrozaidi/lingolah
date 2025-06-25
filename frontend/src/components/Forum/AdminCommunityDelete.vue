<template>
  <div class="w-full py-10 px-2">
    <div class="max-w-6xl mx-auto w-full">
      <!-- Header Section -->
      <section class="mb-8">
        <h2 class="text-3xl font-bold mb-2 text-blue-800 flex items-center gap-2">
          <i class="pi pi-trash text-red-600"></i>
          Delete a Community
        </h2>
        <div class="h-1 w-20 bg-red-400 rounded mb-2"></div>
        <p class="text-gray-500 mb-2">
          You can permanently delete communities you manage. This action cannot be undone.
        </p>
      </section>
      <!-- Feedback Section -->
      <section v-if="feedback" class="mb-4">
        <div
          class="p-3 rounded border"
          :class="{
            'bg-green-100 text-green-800 border-green-300': feedbackType === 'success',
            'bg-red-100 text-red-800 border-red-300': feedbackType === 'error'
          }"
        >
          {{ feedback }}
        </div>
      </section>
      <!-- No Community Section -->
      <section v-if="communities.length === 0" class="mb-8">
        <div class="bg-white border border-gray-200 rounded-lg p-6 text-gray-500 shadow text-center">
          You do not manage any communities.
        </div>
      </section>
      <!-- Search and Pagination Controls -->
      <section v-else>
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div class="relative w-full md:w-96">
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
        <!-- Communities List: stretching edge to edge -->
        <ul class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <li
            v-for="comm in pagedCommunities"
            :key="comm.id"
            class="bg-white border border-gray-200 rounded-lg p-5 shadow flex flex-col justify-between min-h-[120px] hover:shadow-lg transition duration-150"
          >
            <div class="flex-1 mb-2">
              <div class="font-semibold text-lg text-blue-900 flex items-center gap-2 mb-1">
                <i class="pi pi-hashtag text-blue-600"></i> {{ comm.name }}
              </div>
            </div>
            <button
              class="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition disabled:opacity-60 w-full"
              @click="confirmDelete(comm)"
              :disabled="deletingId === comm.id"
            >
              {{ deletingId === comm.id ? "Deleting..." : "Delete" }}
            </button>
          </li>
        </ul>
      </section>
    </div>
    <!-- Confirm Dialog (not constrained to max-w-6xl) -->
    <Dialog v-model:visible="showConfirm" modal header="Confirm Delete" :closable="false">
      <div>Are you sure you want to delete <b>{{ toDelete?.name }}</b>? This action cannot be undone.</div>
      <template #footer>
        <button class="px-3 py-1 rounded bg-gray-300 mr-2" @click="showConfirm = false">Cancel</button>
        <button class="px-3 py-1 rounded bg-red-600 text-white" @click="deleteCommunity">Yes, Delete</button>
      </template>
    </Dialog>
    <!-- Loading Spinner -->
    <div v-if="loading" class="fixed inset-0 flex justify-center items-center bg-white bg-opacity-60 z-50">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSession } from '@clerk/vue'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import Paginator from 'primevue/paginator'

const { session } = useSession()
const communities = ref([])
const loading = ref(true)
const feedback = ref('')
const feedbackType = ref('success')
const deletingId = ref(null)
const showConfirm = ref(false)
const toDelete = ref(null)

const search = ref("")
const pageSize = 8
const currentPage = ref(1)

const filteredCommunities = computed(() => {
  if (!search.value?.trim()) return communities.value
  const s = search.value.trim().toLowerCase()
  return communities.value.filter(c =>
    c.name?.toLowerCase().includes(s)
  )
})

const pagedCommunities = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCommunities.value.slice(start, start + pageSize)
})

function onPage(event) {
  currentPage.value = Math.floor(event.first / pageSize) + 1
}
function onSearch() {
  currentPage.value = 1
}

const fetchCommunities = async () => {
  loading.value = true
  feedback.value = ''
  try {
    const token = await session.value.getToken()
    const res = await fetch('http://localhost:3000/api/community/admin', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch communities')
    const data = await res.json()
    communities.value = data.communities
  } catch (e) {
    feedback.value = 'Could not load communities'
    feedbackType.value = 'error'
  }
  loading.value = false
}

const confirmDelete = (comm) => {
  toDelete.value = comm
  showConfirm.value = true
}

const deleteCommunity = async () => {
  if (!toDelete.value) return
  deletingId.value = toDelete.value.id
  showConfirm.value = false
  feedback.value = ''
  feedbackType.value = 'success'
  try {
    const token = await session.value.getToken()
    const res = await fetch(`http://localhost:3000/api/community/${toDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed to delete community')
    }
    feedback.value = `Community "${toDelete.value.name}" deleted.`
    feedbackType.value = 'success'
    communities.value = communities.value.filter(c => c.id !== toDelete.value.id)
  } catch (e) {
    feedback.value = e.message
    feedbackType.value = 'error'
  }
  deletingId.value = null
  toDelete.value = null
}

onMounted(fetchCommunities)
</script>

<style scoped>
ul.grid {
  width: 100%;
}
li.bg-white {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 120px;
}
input[type="text"] {
  background: white;
}
</style>