<template>
  <div class="w-screen h-screen bg-darker">
    <div class="flex items-center justify-center h-full">
      <div class="w-full max-w-md m-5 p-8 space-y-6 bg-dark rounded-md text-white">
        <h2 class="text-2xl font-bold text-center">Login</h2>

        <form @submit.prevent="handleLogin" class="space-y-4 mb-4">
          <div>
            <label for="email" class="text-sm font-medium">Email</label>
            <input v-model="email" id="email" type="email" placeholder="test@gmail.com" required class="w-full px-3 py-2 mt-2 border border-gray focus:border-white/60 rounded-md" />
          </div>
          <div>
            <label for="password" class="text-sm font-medium">Password</label>
            <input v-model="password" id="password" type="password" placeholder="••••••••" required class="w-full px-3 py-2 mt-2 border border-gray focus:border-white/60 rounded-md" />
          </div>

          <div v-if="errorMessage" class="text-sm text-red-400">
            {{ errorMessage }}
          </div>

          <button type="submit" :disabled="!email || !password || loading" class="w-full px-4 py-2 font-bold text-white bg-primary hover:bg-primary-lighter rounded-md">Login</button>
        </form>

        <div class="flex gap-2 justify-center text-sm">
          <p class="text-gray-300">Don't have an account?</p>
          <NuxtLink to="/register" class="text-primary-lighter hover:underline">Create an account</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'unauthenticated',
})

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

async function handleLogin() {
  loading.value = true;

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'post',
      body: { email: email.value, password: password.value }
    });
    const { user } = response;
    localStorage.setItem('user', JSON.stringify(user));
    await navigateTo('/');
  } catch (error: any) {
    if (error.data?.message) {
      errorMessage.value = error.data.message;
    } else {
      errorMessage.value = 'An error occurred. Please try again.';
    }
  } finally {
    loading.value = false;
  }
}
</script>