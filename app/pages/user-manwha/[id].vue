<template>
  <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
    <Icon name="lucide:loader-2" size="48" class="animate-spin text-primary" />
  </div>

  <div
    v-else-if="error"
    class="flex flex-col items-center justify-center min-h-[60vh] text-white/60"
  >
    <Icon name="lucide:alert-circle" size="48" class="mb-4" />
    <p class="text-lg">{{ error }}</p>
    <NuxtLink to="/" class="mt-4 text-primary hover:underline">Go back to home</NuxtLink>
  </div>

  <div v-else-if="manwha" class="pb-8">
    <div
      v-if="manwha.bannerImage"
      class="hidden md:block not-even:w-full h-[400px] bg-cover bg-center relative -mt-8"
      :style="{ backgroundImage: `url(${manwha.bannerImage})` }"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-dark/30 to-dark"></div>
    </div>

    <div
      class="flex flex-row gap-4 md:gap-6 relative z-10 max-w-6xl mx-auto"
      :class="{ 'md:-mt-28': manwha.bannerImage }"
    >
      <div class="relative">
        <button
          class="absolute -top-3 -left-4 z-10 w-10 h-10 rounded-full bg-black/80 flex items-center justify-center"
          :class="{
            'text-primary': userManwhaData.isFavorite,
            'text-white/60': !userManwhaData.isFavorite,
          }"
          @click="toggleFavorite"
        >
          <Icon
            :name="userManwhaData.isFavorite ? 'lucide:heart' : 'lucide:heart'"
            :class="{ 'fill-current': userManwhaData.isFavorite }"
            size="20"
          />
        </button>

        <div class="w-[120px] md:w-[240px] aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
          <img
            v-if="manwha.coverImage"
            :src="manwha.coverImage"
            :alt="manwha.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-white/10 flex items-center justify-center">
            <Icon name="lucide:file-image" size="64" class="text-white/40" />
          </div>
        </div>
      </div>

      <div class="flex-1 space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">{{ manwha.title }}</h1>
          <div v-if="manwha.synonyms.length > 0" class="group relative inline-block mb-2">
            <button
              class="text-sm text-white/60 hover:text-primary flex items-center gap-1 transition-colors"
            >
              <Icon name="lucide:info" size="16" />
              <span>
                {{ manwha.synonyms.length }} alternative title{{
                  manwha.synonyms.length > 1 ? 's' : ''
                }}
              </span>
            </button>
            <div
              class="absolute left-0 top-full mt-2 w-max max-w-md bg-dark border border-white/20 rounded-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 shadow-xl"
            >
              <p class="text-xs text-white/60 mb-2 font-semibold">Alternative Titles:</p>
              <ul class="space-y-1">
                <li v-for="synonym in manwha.synonyms" :key="synonym" class="text-sm text-white/90">
                  {{ synonym }}
                </li>
              </ul>
            </div>
          </div>
          <div v-if="manwha.meanScore" class="flex items-center gap-2 text-white/80">
            <Icon name="lucide:star" size="20" class="text-yellow-400" />
            <span class="text-lg font-semibold">{{ manwha.meanScore / 10 }}/10</span>
          </div>
        </div>

        <div v-if="manwha.genres.length > 0" class="flex flex-wrap gap-2">
          <span
            v-for="genre in manwha.genres"
            :key="genre"
            class="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
          >
            {{ genre }}
          </span>
        </div>

        <div v-if="manwha.description" class="text-white/80 hidden md:block">
          <h2 class="text-xl font-semibold text-white mb-2">Description</h2>
          <div v-dompurify-html="manwha.description" class="prose prose-invert max-w-none"></div>
        </div>
      </div>
    </div>

    <!-- Description for mobile -->
    <div class="max-w-6xl mx-auto mt-4 md:hidden">
      <div v-if="manwha.description" class="text-white/80">
        <h2 class="text-xl font-semibold text-white mb-2">Description</h2>
        <div v-dompurify-html="manwha.description" class="prose prose-invert max-w-none"></div>
      </div>
    </div>

    <div class="bg-white/5 rounded-lg p-6 mt-6 max-w-6xl mx-auto">
      <h2 class="text-xl font-semibold text-white mb-6">My Reading Progress</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="status" class="block text-sm font-medium mb-2">Status</label>
          <select
            id="status"
            v-model="userManwhaData.status"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-primary focus:border-white"
          >
            <option v-for="(label, key) in READING_STATUS" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
        </div>

        <div>
          <label for="lastReadChapter" class="block text-sm font-medium mb-2">
            Current Chapter
          </label>
          <input
            id="lastReadChapter"
            v-model.number="userManwhaData.lastReadChapter"
            type="number"
            min="0"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-primary focus:border-white"
            placeholder="0"
          />
        </div>

        <div class="md:col-span-2">
          <label for="rating" class="block text-sm font-medium mb-2">
            Your Rating: {{ userManwhaData.rating || 0 }}/10
          </label>
          <input
            id="rating"
            v-model.number="userManwhaData.rating"
            type="range"
            min="0"
            max="10"
            step="0.5"
            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <div class="md:col-span-2">
          <label for="readingUrl" class="block text-sm font-medium mb-2">
            Reading URL (optional)
          </label>
          <input
            id="readingUrl"
            v-model="userManwhaData.readingUrl"
            type="url"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-primary focus:border-white"
            placeholder="https://demonicscans.org/manga/Solo-Leveling"
          />
        </div>

        <div>
          <label for="startedAt" class="block text-sm font-medium mb-2">Start Date</label>
          <input
            id="startedAt"
            v-model="userManwhaData.startedAt"
            type="date"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-gray-400"
          />
        </div>

        <div>
          <label for="lastReadAt" class="block text-sm font-medium mb-2">Last Read Date</label>
          <input
            id="lastReadAt"
            v-model="userManwhaData.lastReadAt"
            type="date"
            readonly
            class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-gray-400 cursor-not-allowed"
          />
        </div>
      </div>

      <div class="flex gap-3 pt-6 mt-6 border-t border-gray-700">
        <button
          class="flex-1 px-6 py-3 bg-primary hover:bg-primary-lighter rounded text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="saving"
          @click="saveUserManwha"
        >
          <span v-if="saving" class="flex items-center justify-center gap-2">
            <Icon name="lucide:loader-2" size="20" class="animate-spin" />
            Saving...
          </span>
          <span v-else>Save</span>
        </button>
        <NuxtLink
          to="/"
          class="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded text-white font-medium transition-colors flex items-center justify-center"
        >
          Cancel
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { READING_STATUS } from '~~/shared/types/reading-status';

const route = useRoute();
const id = route.params.id as string;

const loading = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);
const manwha = ref<Manwha | null>(null);

const userManwhaData = ref({
  status: 'reading' as ReadingStatus,
  lastReadChapter: 0,
  rating: null as number | null,
  readingUrl: null as string | null,
  startedAt: new Date().toISOString().split('T')[0] as string,
  lastReadAt: new Date().toISOString().split('T')[0] as string,
  isFavorite: false,
});

onMounted(async () => {
  try {
    loading.value = true;

    const userData = (await $fetch(`/api/user-manwha/${id}`)) as UserManwha;

    if (!userData.manwha) {
      error.value = 'Failed to load manwha details. Please try again later.';
      return;
    }

    manwha.value = userData.manwha;
    userManwhaData.value = {
      status: userData.status,
      lastReadChapter: userData.lastReadChapter,
      rating: userData.rating,
      readingUrl: userData.readingUrl,
      startedAt: (userData.startedAt
        ? new Date(userData.startedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]) as string,
      lastReadAt: (userData.lastReadAt
        ? new Date(userData.lastReadAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]) as string,
      isFavorite: userData.isFavorite,
    };
  } catch (err) {
    console.error('Failed to fetch user manwha:', err);
    error.value = 'Failed to load manwha details. Please try again later.';
  } finally {
    loading.value = false;
  }
});

function buildRequestBody(): UserManwha {
  if (!manwha.value) {
    throw new Error('Manwha data is required');
  }

  return {
    id: '',
    userId: '',
    manwha: manwha.value,
    status: userManwhaData.value.status,
    rating: userManwhaData.value.rating,
    lastReadChapter: userManwhaData.value.lastReadChapter,
    readingUrl: userManwhaData.value.readingUrl,
    startedAt: new Date(userManwhaData.value.startedAt),
    lastReadAt: new Date(),
    isFavorite: userManwhaData.value.isFavorite,
  };
}

async function saveUserManwha() {
  if (!manwha.value) return;

  saving.value = true;
  try {
    await $fetch('/api/user-manwha', {
      method: 'POST',
      body: buildRequestBody(),
    });
    navigateTo('/');
  } catch (err) {
    console.error('Failed to save user manwha:', err);
    alert('Failed to save. Please try again.');
  } finally {
    saving.value = false;
  }
}

async function toggleFavorite() {
  if (!manwha.value) return;

  const previousValue = userManwhaData.value.isFavorite;
  userManwhaData.value.isFavorite = !previousValue;

  try {
    await $fetch('/api/user-manwha', {
      method: 'POST',
      body: buildRequestBody(),
    });
  } catch (err) {
    console.error('Failed to update favorite status:', err);
    userManwhaData.value.isFavorite = previousValue;
  }
}
</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  opacity: 1;
}

.prose {
  max-height: 150px;
  overflow-y: auto;
}

* {
  scrollbar-width: auto;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
</style>
