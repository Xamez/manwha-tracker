<template>
  <div
    class="w-full h-[190px] md:h-[210px] relative group"
    @touchstart.capture="isTouchDevice ? handleTap($event) : null"
  >
    <span
      v-if="
        userManwha.manwha.lastAvailableChapter &&
        userManwha.manwha.lastAvailableChapter > currentChapter
      "
      class="absolute -top-1 -right-1 z-20 flex size-3"
      title="New chapters available"
    >
      <span
        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"
      ></span>
      <span class="relative inline-flex size-3 rounded-full bg-green-500"></span>
    </span>
    <div class="w-full h-full rounded-md overflow-hidden relative cursor-pointer">
      <div class="block h-full">
        <div
          class="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
          :style="{ backgroundImage: `url(${userManwha.manwha.coverImage})` }"
        ></div>

        <div
          v-if="showUpdateScreen"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 text-white p-4"
        >
          <button
            class="absolute size-6 flex items-center justify-center top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/30 text-white z-20"
            @click="showUpdateScreen = false"
            @touchstart="showUpdateScreen = false"
          >
            <Icon name="lucide:x" size="18" />
          </button>

          <p class="text-sm text-gray-400 mb-1">Current chapter:</p>
          <p class="text-3xl font-bold mb-4">{{ currentChapter }}</p>

          <button
            class="size-8 flex items-center justify-center rounded-md bg-primary text-white"
            @touchstart="updateChapter(currentChapter + 1)"
          >
            <Icon name="lucide:plus" size="24" />
          </button>
        </div>

        <div
          v-else
          class="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end h-full bg-gradient-to-t from-black/90 to-black/5 text-white"
          @click="handleNavigationClick"
        >
          <h2 class="m-0 mb-2 text-sm md:text-md font-semibold">{{ userManwha.manwha.title }}</h2>
          <div class="flex items-center justify-between gap-2">
            <p class="my-1 text-xs">
              Chapter:
              <a
                v-if="userManwha.readingUrl"
                :href="generateManwhaUrl(userManwha.readingUrl, currentChapter)"
                target="_blank"
                class="text-primary font-bold underline cursor-pointer group/link inline-block relative"
              >
                {{ currentChapter }}
                <Icon
                  name="lucide:link"
                  size="12"
                  class="absolute left-full ml-1 opacity-0 group-hover/link:opacity-100"
                  style="color: #5540ec"
                />
              </a>
              <span v-else class="text-primary font-bold">
                {{ currentChapter }}
              </span>
            </p>
            <button
              v-if="userManwha.status === 'reading'"
              class="w-6 h-6 flex items-center justify-center rounded bg-black/40 hover:bg-primary text-white opacity-0 group-hover:opacity-100"
              @click.stop="() => updateChapter(currentChapter + 1)"
            >
              <Icon name="lucide:plus" size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const { userManwha } = defineProps<{ userManwha: UserManwha }>();

const currentChapter = ref(userManwha.lastReadChapter);
const showUpdateScreen = ref(false);

const router = useRouter();

const DOUBLE_TAP_DELAY = 150;
let lastTouchTime = 0;
let tapTimeout: ReturnType<typeof setTimeout>;

const isTouchDevice = ref(false);

onMounted(() => {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    isTouchDevice.value = true;
  }
});

function handleNavigationClick() {
  router.push(`/user-manwha/${userManwha.manwha.id}`);
}

function handleTap(event: TouchEvent) {
  event.preventDefault();
  if (showUpdateScreen.value) return;

  const now = new Date().getTime();
  const timeSinceLastTouch = now - lastTouchTime;

  if (timeSinceLastTouch < DOUBLE_TAP_DELAY && timeSinceLastTouch > 0) {
    clearTimeout(tapTimeout);
    showUpdateScreen.value = true;
    lastTouchTime = 0;
  } else {
    lastTouchTime = now;
    tapTimeout = setTimeout(() => {
      handleNavigationClick();
      lastTouchTime = 0;
    }, DOUBLE_TAP_DELAY);
  }
}

async function updateChapter(newChapter: number) {
  const previousChapter = currentChapter.value;
  currentChapter.value = newChapter;

  const body = {
    id: userManwha.id,
    userId: userManwha.userId,
    manwha: userManwha.manwha,
    status: userManwha.status,
    rating: userManwha.rating,
    lastReadChapter: newChapter,
    readingUrl: userManwha.readingUrl,
    startedAt: userManwha.startedAt,
    updatedAt: new Date(),
    isFavorite: userManwha.isFavorite,
  };

  try {
    await $fetch('/api/user-manwha', {
      method: 'POST',
      body,
    });
  } catch (error) {
    console.error('Failed to update chapter:', error);
    currentChapter.value = previousChapter;
  }
}
</script>

<style scoped>
* {
  transition: all 0.3s ease-in-out !important;
}
</style>
