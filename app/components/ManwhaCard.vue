<template>
  <NuxtLink :to="`/user-manwha/${userManwha.id}`">
    <div class="w-full h-[210px] rounded-md overflow-hidden relative group">
      <div
        class="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
        :style="{ backgroundImage: `url(${userManwha.manwha?.coverImage})` }"
      ></div>
      <div
        class="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end h-full bg-gradient-to-t from-black/100 to-black/1 text-white"
      >
        <h2 class="m-0 mb-2 text-sm md:text-md font-semibold">{{ userManwha.manwha?.title }}</h2>
        <p class="my-1 text-xs">
          Current chapter:
          <span class="text-primary font-bold">{{ userManwha.lastReadChapter }}</span>
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
const { userManwha } = defineProps<{ userManwha: UserManwha }>();
</script>

<style scoped>
* {
  transition: all 0.3s ease-in-out !important;
}
</style>
