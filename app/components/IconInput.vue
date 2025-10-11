<template>
  <div class="relative w-full">
    <div
      class="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none flex items-center justify-center"
    >
      <Icon :name="icon" :size="iconSize" />
    </div>

    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      class="w-full py-1 pl-10 border border-white/60 focus:border-white rounded-md text-white placeholder:text-white/40"
      :class="{ 'pr-10': modelValue }"
      @input="handleInput"
    />

    <button
      v-if="modelValue"
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white flex items-center justify-center"
      aria-label="Clear input"
      @click="clearInput"
    >
      <Icon name="mdi:close-circle" :size="iconSize" />
    </button>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue?: string;
  icon?: string;
  iconSize?: string;
  type?: string;
  placeholder?: string;
  id?: string;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  icon: 'lucide:search',
  iconSize: '16',
  type: 'text',
  placeholder: '',
  id: 'search-input',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function clearInput() {
  emit('update:modelValue', '');
}
</script>
