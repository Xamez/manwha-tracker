<template>
  <Modal v-model="isOpen" title="Delete Manwha" size="medium">
    <div class="space-y-4">
      <p class="text-white/80">{{ message }}</p>
      <div class="flex gap-3">
        <button
          class="flex-1 px-6 py-2.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 font-medium"
          @click="emit('confirm')"
        >
          <span class="flex items-center justify-center gap-2">
            <Icon name="lucide:trash-2" size="16" />
            Delete
          </span>
        </button>
        <button
          class="flex-1 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 font-medium"
          @click="isOpen = false"
        >
          Cancel
        </button>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
const isOpen = defineModel<boolean>({ required: true });

defineProps<{
  message?: string;
}>();

const emit = defineEmits<{
  confirm: [];
}>();
</script>
