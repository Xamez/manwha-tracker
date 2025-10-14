<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-300 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="sm:hidden fixed inset-0 bg-black/70" @click="close"></div>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      leave-active-class="transition-transform duration-300 ease-in"
      enter-from-class="translate-x-full"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="modelValue"
        class="sm:hidden fixed right-0 top-0 h-full w-[80%] bg-dark overflow-y-auto text-white z-100"
        @click.stop
      >
        <div class="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 class="text-xl font-semibold">{{ title }}</h2>
          <button class="flex items-center" @click="close">
            <Icon name="lucide:x" size="24" />
          </button>
        </div>
        <div class="p-4">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: boolean;
  title: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

function close() {
  emit('update:modelValue', false);
}
</script>
