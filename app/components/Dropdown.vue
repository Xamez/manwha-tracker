<template>
  <div ref="selectRef" class="relative w-full">
    <button
      type="button"
      class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white text-left flex items-center justify-between focus:border-white"
      @click="toggleDropdown"
    >
      <span>{{ selectedLabel }}</span>
      <Icon
        name="lucide:chevron-down"
        size="16"
        class="text-white/60 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="absolute z-50 w-full bg-gray-700 border border-gray-600 rounded shadow-lg max-h-62 overflow-y-auto"
        :class="dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'"
      >
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="w-full px-4 py-2 text-left transition-colors"
          :class="
            modelValue === option.value
              ? 'bg-primary text-white font-semibold'
              : 'text-white hover:bg-gray-600'
          "
          @click="selectOption(option.value)"
        >
          <slot name="option" :option="option" :selected="modelValue === option.value">
            {{ option.label }}
          </slot>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
interface SelectOption {
  value: string | number;
  label: string;
}

interface Props {
  modelValue: string | number;
  options: SelectOption[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const isOpen = ref(false);
const selectRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownPosition = ref<'top' | 'bottom'>('bottom');

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue);
  return selected?.label || '';
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => {
      calculateDropdownPosition();
    });
  }
}

function calculateDropdownPosition() {
  if (!selectRef.value || !dropdownRef.value) return;

  const selectRect = selectRef.value.getBoundingClientRect();
  const dropdownHeight = Math.min(248, props.options.length * 40); // max-h-60 = 248px, estimated 40px per option
  const spaceBelow = window.innerHeight - selectRect.bottom;
  const spaceAbove = selectRect.top;

  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    dropdownPosition.value = 'top';
  } else {
    dropdownPosition.value = 'bottom';
  }
}

function selectOption(value: string | number) {
  emit('update:modelValue', value);
  isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
