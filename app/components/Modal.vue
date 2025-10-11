<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]"
        @mousedown="handleOverlayMouseDown"
        @mouseup="handleOverlayMouseUp"
      >
        <div
          class="bg-dark rounded-lg max-w-[800px] w-[80%] max-h-[90vh] overflow-y-auto shadow-2xl transition-transform duration-300"
          :class="modelValue ? 'scale-100' : 'scale-90'"
          @mousedown.stop
          @mouseup.stop
        >
          <div class="flex items-center justify-between p-6 border-b border-gray-800">
            <slot name="header">
              <h3 class="text-xl font-semibold text-white m-0">{{ title }}</h3>
            </slot>
            <button
              class="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 text-white"
              @click="close"
            >
              <Icon name="lucide:x" size="24" />
            </button>
          </div>
          <div class="p-6 text-white">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

let isMouseDownOutside = false;

function handleOverlayMouseDown(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    isMouseDownOutside = true;
  }
}

function handleOverlayMouseUp(event: MouseEvent) {
  if (isMouseDownOutside && event.target === event.currentTarget) {
    close();
  }
  isMouseDownOutside = false;
}

function close() {
  emit('update:modelValue', false);
}
</script>
