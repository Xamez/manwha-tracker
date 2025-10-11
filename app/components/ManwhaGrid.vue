<template>
  <div
    class="grid gap-8 justify-center sm:justify-start grid-cols-[repeat(auto-fill,150px)] grid-rows-[repeat(auto-fill,210px)] min-w-0 w-full"
  >
    <AddManwhaCard />
    <ManwhaCard v-for="userManwha in userManwhas" :key="userManwha.id" :user-manwha="userManwha" />
  </div>
</template>

<script lang="ts" setup>
const { userManwhas } = defineProps<{ userManwhas: UserManwha[] }>();
</script>
