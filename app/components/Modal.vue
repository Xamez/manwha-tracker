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
        :class="slideFromRight ? 'sm:items-center sm:justify-center justify-end' : ''"
        @mousedown="handleOverlayMouseDown"
        @mouseup="handleOverlayMouseUp"
      >
        <Transition
          :enter-active-class="
            slideFromRight
              ? 'transition-transform duration-300 ease-out'
              : 'transition-transform duration-300'
          "
          :leave-active-class="
            slideFromRight
              ? 'transition-transform duration-300 ease-in'
              : 'transition-transform duration-300'
          "
          :enter-from-class="slideFromRight ? 'translate-x-full sm:translate-x-0' : ''"
          :leave-to-class="slideFromRight ? 'translate-x-full sm:translate-x-0' : ''"
        >
          <div
            v-if="modelValue"
            class="bg-dark rounded-lg max-h-[90vh] overflow-y-auto shadow-2xl transition-transform duration-300"
            :class="[
              slideFromRight
                ? 'h-full sm:h-auto w-[85%] sm:w-[80%] rounded-l-lg sm:rounded-lg'
                : `${modalSize} scale-100`,
            ]"
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
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: boolean;
  title: string;
  slideFromRight?: boolean;
  size?: 'large' | 'medium' | 'small';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const modalSize = computed(() => {
  switch (props.size) {
    case 'large':
      return 'w-[80%]';
    case 'medium':
      return 'w-[60%]';
    case 'small':
      return 'w-[40%]';
    default:
      return 'w-[80%]';
  }
});

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
