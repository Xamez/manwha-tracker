<template>
  <div
    class="grid gap-8 justify-center sm:justify-start grid-cols-[repeat(auto-fill,140px)] grid-rows-[repeat(auto-fill,190px)] md:grid-cols-[repeat(auto-fill,150px)] md:grid-rows-[repeat(auto-fill,210px)] min-w-0 w-full"
  >
    <AddManhwaCard />
    <ManhwaCard v-for="userManhwa in userManhwas" :key="userManhwa.id" :user-manhwa="userManhwa" />
  </div>
</template>

<script lang="ts" setup>
const { userManhwas } = defineProps<{ userManhwas: UserManhwa[] }>();
</script>
