<template>
  <div class="w-full h-16 bg-dark flex justify-center border-b border-gray-800">
    <div class="w-[80%] h-full text-white flex items-center justify-between">
      <NuxtLink to="/" class="text-lg font-bold">Manwha Tracker</NuxtLink>
      <div v-if="authUser" class="flex items-center gap-4">
        <span class="text-white font-bold">{{ authUser.username }}</span>
        <button title="Logout" class="flex items-center" @click="handleLogout">
          <Icon name="lucide:log-out" class="text-primary hover:text-primary-lighter w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { authUser, fetchCurrentUser, logout } = useAuthUser();

await fetchCurrentUser();

const handleLogout = async () => {
  await logout();
};
</script>

<style></style>
