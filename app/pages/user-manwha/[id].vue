<template>
  <div>
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
        class="hidden md:block w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] h-[400px] bg-cover bg-center -mt-8"
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
              'text-red-500': userManwhaData.isFavorite,
              'text-white/60': !userManwhaData.isFavorite,
            }"
            @click="toggleFavorite"
          >
            <Icon v-if="userManwhaData.isFavorite" name="mdi:heart" size="20" />
            <Icon v-else name="mdi:heart-outline" size="20" />
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
            <div
              v-if="manwha.alternativeTitles.length > 0"
              class="group relative inline-block mb-2"
            >
              <button class="text-sm text-white/60 hover:text-primary flex items-center gap-1">
                <Icon name="lucide:info" size="16" />
                <span>
                  {{ manwha.alternativeTitles.length }} alternative title{{
                    manwha.alternativeTitles.length > 1 ? 's' : ''
                  }}
                </span>
              </button>
              <div
                class="absolute left-0 top-full mt-2 w-max max-w-md bg-dark border border-white/20 rounded-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 shadow-xl"
              >
                <p class="text-xs text-white/60 mb-2 font-semibold">Alternative Titles:</p>
                <ul class="space-y-1">
                  <li
                    v-for="synonym in manwha.alternativeTitles"
                    :key="synonym"
                    class="text-sm text-white/90"
                  >
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

          <div v-if="manwha.genres.length > 0" class="flex-wrap gap-2 hidden md:flex">
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
            <div
              v-dompurify-html="manwha.description"
              class="prose prose-invert max-h-[145px]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Description for mobile -->
      <div v-if="manwha.genres.length > 0" class="flex flex-wrap gap-2 mt-6 md:hidden">
        <span
          v-for="genre in manwha.genres"
          :key="genre"
          class="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
        >
          {{ genre }}
        </span>
      </div>

      <div class="mt-4 md:hidden">
        <div v-if="manwha.description" class="text-white/80">
          <h2 class="text-xl font-semibold text-white mb-2">Description</h2>
          <div
            class="relative cursor-pointer"
            @click="!descriptionExpanded && (descriptionExpanded = true)"
          >
            <div
              ref="descriptionContentRef"
              v-dompurify-html="manwha.description"
              class="prose-invert transition-all duration-300"
              :class="{
                'max-h-[80px] overflow-hidden description-gradient': !descriptionExpanded,
                'prose max-h-none': descriptionExpanded,
              }"
            ></div>
            <button
              v-if="descriptionExpanded"
              class="mt-2 text-sm text-white/60"
              @click.stop="collapseDescription"
            >
              Show less
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white/5 rounded-lg p-6 mt-6 max-w-6xl mx-auto">
        <h2 class="text-xl font-semibold text-white mb-6">My Reading Progress</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="status" class="block text-sm font-medium mb-2">Status</label>
            <Dropdown v-model="userManwhaData.status" :options="statusOptions" />
          </div>

          <div>
            <label for="lastReadChapter" class="flex items-center gap-2 text-sm font-medium mb-2">
              <span>Current Chapter</span>
              <a
                v-if="userManwhaData.readingUrl && userManwhaData.lastReadChapter > 0"
                :href="generateManwhaUrl(userManwhaData.readingUrl, userManwhaData.lastReadChapter)"
                target="_blank"
                class="text-primary hover:text-primary-lighter"
                title="Open chapter in new tab"
                @click.stop
              >
                <Icon name="lucide:link" size="14" />
              </a>
            </label>
            <div class="relative">
              <input
                id="lastReadChapter"
                v-model.number="userManwhaData.lastReadChapter"
                type="number"
                min="0"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-primary focus:border-white"
                :class="{ 'pr-10 md:pr-4': userManwhaData.status === 'reading' }"
                placeholder="0"
              />
              <button
                v-if="userManwhaData.status === 'reading'"
                class="md:hidden absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center text-primary hover:text-primary-lighter"
                title="Increment chapter"
                @click="incrementChapter"
              >
                <Icon name="lucide:plus" size="20" />
              </button>
            </div>
          </div>

          <div class="md:col-span-2">
            <label for="rating" class="block text-sm font-medium mb-2">
              <span v-if="userManwhaData.rating">Your Rating: {{ userManwhaData.rating }}/10</span>
              <span v-else>Your Rating: Not rated</span>
            </label>
            <input
              id="rating"
              v-model.number="userManwhaData.rating"
              type="range"
              min="0"
              max="10"
              step="0.1"
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
            <div class="relative">
              <input
                id="startedAt"
                v-model="userManwhaData.startedAt"
                type="date"
                class="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded text-gray-400"
              />
              <Icon
                name="lucide:calendar"
                size="18"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label for="updatedAt" class="block text-sm font-medium mb-2">Last Updated Date</label>
            <p
              id="updatedAt"
              type="date"
              class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-gray-400 cursor-not-allowed"
            >
              {{ formatDate(userManwhaData.updatedAt) }}
            </p>
          </div>
        </div>

        <div v-if="errorMessage">
          <p class="mt-4 text-red-500">{{ errorMessage }}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-700">
          <button
            class="flex-1 px-6 py-2.5 bg-primary hover:bg-primary-lighter rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="saving"
            @click="saveUserManwha()"
          >
            <span>{{ userManwhaId ? 'Save Changes' : 'Add to My List' }}</span>
          </button>
          <NuxtLink
            to="/"
            class="flex-1 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 font-medium flex items-center justify-center"
          >
            Cancel
          </NuxtLink>
          <button
            v-if="userManwhaId"
            class="sm:w-auto px-6 py-2.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="deleting"
            @click="deleteUserManwha"
          >
            <span class="flex items-center justify-center gap-2">
              <Icon name="lucide:trash-2" size="16" />
              Delete
            </span>
          </button>
        </div>
      </div>
    </div>

    <DeleteModal
      v-model="showDeleteModal"
      message="Are you sure you want to delete this manwha from your list?"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script lang="ts" setup>
import { READING_STATUS } from '~~/shared/types/reading-status';

const route = useRoute();
const id = route.params.id as string;

const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const error = ref<string | null>(null);
const manwha = ref<Manwha | null>(null);
const userManwhaId = ref('');
const errorMessage = ref<string | null>(null);
const showDeleteModal = ref(false);

const statusOptions = Object.keys(READING_STATUS).map(key => ({
  value: key,
  label: READING_STATUS[key as ReadingStatus],
}));

const userManwhaData = ref({
  status: 'reading' as ReadingStatus,
  lastReadChapter: 0,
  rating: null as number | null,
  readingUrl: null as string | null,
  startedAt: new Date().toISOString().split('T')[0] as string,
  updatedAt: new Date().toISOString().split('T')[0] as string,
  isFavorite: false,
});

const descriptionExpanded = ref(false);
const descriptionContentRef = ref<HTMLElement | null>(null);

function collapseDescription() {
  if (descriptionContentRef.value) {
    descriptionContentRef.value.scrollTop = 0;
  }
  descriptionExpanded.value = false;
}

onMounted(async () => {
  try {
    loading.value = true;

    const userData = await $fetch<UserManwha>(`/api/user-manwha/${id}`);

    if (!userData.manwha) {
      error.value = 'Failed to load manwha details. Please try again later.';
      return;
    }

    manwha.value = userData.manwha;
    userManwhaId.value = userData.id;
    userManwhaData.value = {
      status: userData.status,
      lastReadChapter: userData.lastReadChapter,
      rating: userData.rating,
      readingUrl: userData.readingUrl,
      startedAt: (userData.startedAt
        ? new Date(userData.startedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]) as string,
      updatedAt: (userData.updatedAt
        ? new Date(userData.updatedAt).toISOString().split('T')[0]
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

async function saveUserManwha(redirect = true) {
  if (!manwha.value) return;

  if (!userManwhaData.value.startedAt) {
    errorMessage.value = 'Please select a valid start date.';
    return;
  }

  const body = {
    id: '',
    userId: '',
    manwha: manwha.value,
    status: userManwhaData.value.status,
    rating: userManwhaData.value.rating,
    lastReadChapter: userManwhaData.value.lastReadChapter,
    readingUrl: userManwhaData.value.readingUrl,
    startedAt: new Date(userManwhaData.value.startedAt),
    updatedAt: new Date(),
    isFavorite: userManwhaData.value.isFavorite,
  };

  saving.value = true;
  try {
    await $fetch('/api/user-manwha', {
      method: 'POST',
      body,
    });
    if (redirect) {
      navigateTo('/');
    }
  } catch (err) {
    console.error('Failed to save user manwha:', err);
  } finally {
    saving.value = false;
  }
}

function deleteUserManwha() {
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!manwha.value) return;

  showDeleteModal.value = false;
  deleting.value = true;

  try {
    await $fetch(`/api/user-manwha/${id}`, {
      method: 'DELETE',
    });
    navigateTo('/');
  } catch (err) {
    console.error('Failed to delete user manwha:', err);
  } finally {
    deleting.value = false;
  }
}

async function toggleFavorite() {
  if (!manwha.value) return;

  const previousValue = userManwhaData.value.isFavorite;
  userManwhaData.value.isFavorite = !previousValue;

  if (!userManwhaId.value) {
    return;
  }

  const body = {
    manwhaId: manwha.value.id,
    isFavorite: userManwhaData.value.isFavorite,
  };

  try {
    await $fetch('/api/user-manwha/favorite', {
      method: 'PATCH',
      body,
    });
  } catch (err) {
    console.error('Failed to update favorite status:', err);
    userManwhaData.value.isFavorite = previousValue;
  }
}

async function incrementChapter() {
  userManwhaData.value.lastReadChapter++;
  await saveUserManwha(false);
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

.description-gradient {
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 70%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 70%,
    transparent 100%
  );
}

* {
  scrollbar-width: auto;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
</style>
