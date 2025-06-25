<template>
  <Dialog
    :visible="visible"
    :header="`Members of ${community?.name || ''}`"
    modal
    :closable="true"
    :dismissableMask="true"
    :style="{ width: '64rem', maxWidth: '98vw' }"
    class="rounded-lg"
    @update:visible="onDialogUpdate"
  >
    <div>
      <DataTable
        :value="members"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5,10,20,50]"
        :globalFilterFields="['user.username','user.email','user.id']"
        v-model:filters="filters"
        responsiveLayout="scroll"
        class="w-full"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold">Members</span>
            <span class="p-input-icon-left">
              <i class="pi pi-search padding-left-30px" />
              <InputText v-model="filters['global'].value" placeholder="Search username, email, or ID" />
            </span>
          </div>
        </template>
        <Column field="user.username" header="Username" sortable />
        <Column field="user.email" header="Email" sortable />
        <Column field="status" header="Status" sortable>
          <template #body="slotProps">
            <span v-if="slotProps.data.status" class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
              {{ slotProps.data.status }}
            </span>
          </template>
        </Column>
        <Column v-if="isAdmin" header="">
          <template #body="slotProps">
            <Button
              v-if="canKick(slotProps.data)"
              icon="pi pi-user-minus"
              class="p-button-rounded p-button-danger p-button-text p-1"
              title="Kick this member"
              @click="kickMember(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
      <div class="mt-3 text-sm text-gray-500 text-right">
        Showing {{ filteredCount }} member{{ filteredCount === 1 ? '' : 's' }}
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'

// FilterMatchMode import: 
// If you have PrimeVue v3.25+ use the below import, otherwise just use the string 'contains'
/* Uncomment if you're on v3.25+:
import { FilterMatchMode } from 'primevue/api'
*/

const props = defineProps({
  show: Boolean,
  members: {
    type: Array,
    default: () => []
  },
  community: {
    type: Object,
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  adminId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['close', 'update:show', 'kick'])

const visible = ref(props.show)

watch(
  () => props.show,
  (v) => {
    visible.value = v
  }
)

function onDialogUpdate(val) {
  visible.value = val
  emit('update:show', val)
  if (!val) emit('close')
}

function canKick(member) {
  return String(member.user.id) !== String(props.adminId)
}

function kickMember(member) {
  if (!confirm(`Are you sure you want to kick ${member.user.username || member.user.email || member.user.id}?`)) return
  emit('kick', member)
}

// PrimeVue DataTable Filter
// Use 'contains' as match mode string for all PrimeVue versions
const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

// For filtered count in the footer
const filteredCount = computed(() => {
  if (!filters.value.global.value) return props.members.length
  const s = filters.value.global.value.toLowerCase()
  return props.members.filter(member =>
    (member.user.username && member.user.username.toLowerCase().includes(s)) ||
    (member.user.email && member.user.email.toLowerCase().includes(s)) ||
    (member.user.id && String(member.user.id).toLowerCase().includes(s))
  ).length
})
</script>