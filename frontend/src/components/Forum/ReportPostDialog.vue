<template>
  <Dialog :visible="visible" modal header="Report Post" :closable="!submitting" @hide="onHide">
    <form @submit.prevent="submitReport" @click.stop>
      <div class="mb-3">
        <label class="block font-medium mb-1">Reason</label>
        <Dropdown v-model="reason" :options="reasonOptions" optionLabel="label" optionValue="value"
          placeholder="Select reason" class="w-full" required />
      </div>
      <div class="mb-3">
        <label class="block font-medium mb-1">Details (optional)</label>
        <Textarea v-model="details" class="w-full" autoResize rows="3" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" @click="close" :disabled="submitting" severity="secondary" />
        <Button type="submit" label="Report" :loading="submitting" severity="danger" />
      </div>
      <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
      <div v-if="success" class="text-green-600 mt-2">Report submitted!</div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useUserStore } from "@/stores/userStore";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const props = defineProps({
  postId: { type: String, required: true },
  visible: { type: Boolean, required: true },
})
const emit = defineEmits(['update:visible', 'reported'])

const reason = ref('');
const details = ref('');
const submitting = ref(false);
const error = ref('');
const success = ref(false);

const reasonOptions = [
  { label: 'Spam', value: 'spam' },
  { label: 'Offensive', value: 'offensive' },
  { label: 'Other', value: 'other' }
];

// Watch for dialog open to reset fields
watch(() => props.visible, (val) => {
  if (val) {
    reason.value = '';
    details.value = '';
    error.value = '';
    success.value = false;
  }
})

// Expose visible as a computed so we can pass it to Dialog
const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

function close() {
  emit('update:visible', false)
}

function onHide() {
  reason.value = '';
  details.value = '';
  error.value = '';
  success.value = false;
  emit('update:visible', false)
}

async function submitReport() {
  error.value = '';
  success.value = false;
  submitting.value = true;
  const userStore = useUserStore();
  const dbUserId = await fetch(`${API_URL}/users/by-clerk-id/${userStore.userId}`)
    .then(res => res.json()).then(d => d.id);
  try {
    console.log("Submitting report with reporterId:", dbUserId);

    const res = await fetch(`${API_URL}/api/forum/posts/${props.postId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason: reason.value,
        details: details.value,
        reporterId: dbUserId,
      }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to report post');
    }
    success.value = true;
    emit('reported', { postId: props.postId, reason: reason.value, details: details.value });
    setTimeout(() => close(), 1200);
  } catch (e) {
    error.value = e.message;
  }
  submitting.value = false;
}
</script>