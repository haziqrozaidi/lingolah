<template>
  <div>
    <h3 class="text-xl font-semibold mb-2">{{ community.name }}</h3>
    <h4 class="text-md font-medium mb-2">Pending Requests</h4>
    <div v-if="members.length === 0" class="text-gray-400">No pending requests.</div>
    <div
      v-else
      class="p-2"
      style="max-width:98vw;width:100%;overflow-x:auto;"
    >
      <DataTable
        :value="members"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5,10,20,50]"
        :globalFilterFields="['user.username','user.email','user.id']"
        v-model:filters="filters"
        responsiveLayout="scroll"
        dataKey="userId"
        class="mb-2 min-w-[700px] w-full"
        :style="{ minWidth: '700px' }"
      >
        <template #header>
          <div class="flex justify-between items-center gap-4 flex-wrap">
            <span class="text-lg font-semibold">Pending Members</span>
            <span class="pr-15-input-icon-left flex items-center">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Search username or email" class="w-94" />
            </span>
          </div>
        </template>
        <Column field="user.username" header="User" sortable style="min-width:170px;" />
        <Column field="user.email" header="Email" sortable style="min-width:230px;" />
        <Column header="Action" style="min-width:180px;">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                label="Approve"
                size="small"
                severity="success"
                @click="() => onApprove(slotProps.data.userId, community.id)"
              />
              <Button
                label="Reject"
                size="small"
                severity="danger"
                outlined
                @click="() => onReject(slotProps.data.userId, community.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
      <div class="mt-2 text-sm text-gray-500 text-right">
        Showing {{ filteredCount }} member{{ filteredCount === 1 ? '' : 's' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const { community, members, onApprove, onReject } = defineProps({
  community: { type: Object, required: true },
  members: { type: Array, required: true },
  onApprove: { type: Function, required: true },
  onReject: { type: Function, required: true }
})

// PrimeVue DataTable filter state
const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

// For filtered count in the footer
const filteredCount = computed(() => {
  if (!filters.value.global.value) return members.length
  const s = filters.value.global.value.toLowerCase()
  return members.filter(member =>
    (member.user.username && member.user.username.toLowerCase().includes(s)) ||
    (member.user.email && member.user.email.toLowerCase().includes(s)) ||
    (member.user.id && String(member.user.id).toLowerCase().includes(s))
  ).length
})
</script>