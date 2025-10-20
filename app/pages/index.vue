<template>
  <div class="flex flex-col gap-4">
    <div class="sm:hidden flex gap-4 mb-4">
      <IconInput
        v-model="filters.name"
        icon="lucide:search"
        placeholder="Search..."
        class="flex-1"
      />
      <button
        class="px-4 py-2 bg-primary hover:bg-primary-lighter rounded flex items-center justify-center"
        @click="showMobileFilters = !showMobileFilters"
      >
        <Icon name="lucide:sliders-horizontal" class="w-5 h-5" />
      </button>
    </div>

    <div class="flex flex-row gap-10 relative">
      <FilterSidebar v-model="filters" class="hidden sm:block" :user-manwhas="userManwhas ?? []" />

      <MobileDrawer v-model="showMobileFilters" title="Filters">
        <FilterSidebar v-model="filters" :user-manwhas="userManwhas ?? []" hide-search />
      </MobileDrawer>

      <ManwhaGrid :user-manwhas="filteredManwhas" class="flex-1" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DEFAULT_FILTERS, FILTERS_STORAGE_KEY, type Filters } from '~~/shared/types/filters';
import { READING_STATUS_ORDER } from '~~/shared/types/reading-status';

const { data: userManwhas } = await useFetch<UserManwha[]>('/api/user-manwha', {
  key: 'user-manwha',
});

const showMobileFilters = ref(false);

// Load filters from localStorage on mount
const filters = ref<Filters>(DEFAULT_FILTERS);

// Load saved filters from localStorage
onMounted(() => {
  if (import.meta.client) {
    try {
      const savedFilters = localStorage.getItem(FILTERS_STORAGE_KEY);
      if (savedFilters) {
        filters.value = { ...DEFAULT_FILTERS, ...JSON.parse(savedFilters) };
      }
    } catch (error) {
      console.error('Failed to load filters from localStorage:', error);
    }
  }
});

watch(
  filters,
  newFilters => {
    if (import.meta.client) {
      try {
        localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(newFilters));
      } catch (error) {
        console.error('Failed to save filters to localStorage:', error);
      }
    }
  },
  { deep: true },
);

const filteredManwhas = computed(() => {
  if (!userManwhas.value) return [];

  let result = [...userManwhas.value];

  if (filters.value.name) {
    const searchTerm = filters.value.name.toLowerCase();
    result = result.filter(
      um =>
        um.manwha.title.toLowerCase().includes(searchTerm) ||
        um.manwha.alternativeTitles.some(s => s.toLowerCase().includes(searchTerm)),
    );
  }

  if (filters.value.statuses.length > 0) {
    result = result.filter(um => filters.value.statuses.includes(um.status));
  }

  if (filters.value.favoritesOnly) {
    result = result.filter(um => um.isFavorite);
  }

  if (filters.value.unratedOnly) {
    result = result.filter(um => um.rating === null);
  }

  if (filters.value.minRating > 0) {
    result = result.filter(um => um.rating === null || um.rating >= filters.value.minRating);
  }

  result.sort((a, b) => {
    let comparison = 0;

    switch (filters.value.sortBy) {
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'startedAt':
        comparison = new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
        break;
      case 'rating':
        comparison = (a.rating ?? 0) - (b.rating ?? 0);
        break;
      case 'title':
        comparison = a.manwha.title.localeCompare(b.manwha.title);
        break;
      case 'meanScore':
        comparison = (a.manwha.meanScore ?? 0) - (b.manwha.meanScore ?? 0);
        break;
      case 'status':
        comparison = READING_STATUS_ORDER[a.status] - READING_STATUS_ORDER[b.status];
        break;
      case 'unreadChapters': {
        const lastAvailableChapterA = a.manwha.lastAvailableChapter ?? 0;
        const lastAvailableChapterB = b.manwha.lastAvailableChapter ?? 0;
        comparison =
          lastAvailableChapterA - a.lastReadChapter - (lastAvailableChapterB - b.lastReadChapter);
        break;
      }
    }

    return filters.value.sortOrder === 'asc' ? comparison : -comparison;
  });

  return result;
});
</script>

<style></style>
