<template>
  <div>
    <h3 class="text-xl font-semibold mb-2">{{ community.name }}</h3>
    <h4 class="text-md font-medium mb-2">Pending Requests</h4>
    <div v-if="members.length === 0" class="text-gray-400">No pending requests.</div>
    <DataTable
      v-else
      :value="members"
      responsiveLayout="scroll"
      dataKey="userId"
      class="mb-2"
    >
      <Column field="user.name" header="User" />
      <Column field="user.email" header="Email" />
      <Column header="Action">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button
              label="Approve"
              size="small"
              severity="success"
              @click="onApprove(slotProps.data.userId, community.id)"
            />
            <Button
              label="Reject"
              size="small"
              severity="danger"
              outlined
              @click="onReject(slotProps.data.userId, community.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

// Don't define any local onApprove/onReject functions!
const { community, members, onApprove, onReject } = defineProps({
  community: { type: Object, required: true },
  members: { type: Array, required: true },
  onApprove: { type: Function, required: true },
  onReject: { type: Function, required: true }
})
</script>