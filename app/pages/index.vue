<template>
  <div class="flex flex-row gap-10">
    <FilterSidebar class="hidden sm:block" />
    <ManwhaGrid :user-manwhas="userManwhas ?? []" />
  </div>
</template>

<script lang="ts" setup>
const { data: userManwhas } = await useFetch<UserManwha[]>('/api/user-manwha');
</script>

<style></style>
