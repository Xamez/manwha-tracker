<template>
  <div class="w-full h-[210px] rounded-md overflow-hidden relative group">
    <NuxtLink :to="`/user-manwha/${userManwha.manwha.id}`" class="block h-full">
      <div
        class="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
        :style="{ backgroundImage: `url(${userManwha.manwha.coverImage})` }"
      ></div>
      <div
        class="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end h-full bg-gradient-to-t from-black/90 to-black/5 text-white"
      >
        <h2 class="m-0 mb-2 text-sm md:text-md font-semibold">{{ userManwha.manwha.title }}</h2>
        <div class="flex items-center justify-between gap-2">
          <p class="my-1 text-xs">
            Chapter:
            <!-- Used to avoid hydration issues -->
            <ClientOnly>
              <a
                v-if="userManwha.readingUrl"
                :href="generateManwhaUrl(userManwha.readingUrl, currentChapter)"
                target="_blank"
                class="text-primary font-bold underline cursor-pointer group/link inline-block relative"
                @click.stop
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
            </ClientOnly>
          </p>
          <button
            v-if="userManwha.status === 'reading'"
            class="w-6 h-6 flex items-center justify-center rounded bg-black/40 hover:bg-primary text-white opacity-0 group-hover:opacity-100"
            @click.prevent="() => updateChapter(currentChapter + 1)"
          >
            <Icon name="lucide:plus" size="14" />
          </button>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const { userManwha } = defineProps<{ userManwha: UserManwha }>();

const currentChapter = ref(userManwha.lastReadChapter);

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
