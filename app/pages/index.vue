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
import type { Filters } from '~~/shared/types/filters';

const { data: userManwhas } = await useFetch<UserManwha[]>('/api/user-manwha');

const showMobileFilters = ref(false);

const filters = ref<Filters>({
  name: '',
  status: '',
  favoritesOnly: false,
  unratedOnly: false,
  minRating: 0,
  sortBy: 'updatedAt',
  sortOrder: 'desc',
});

const filteredManwhas = computed(() => {
  if (!userManwhas.value) return [];

  let result = [...userManwhas.value];

  if (filters.value.name) {
    const searchTerm = filters.value.name.toLowerCase();
    result = result.filter(
      um =>
        um.manwha.title.toLowerCase().includes(searchTerm) ||
        um.manwha.synonyms.some(s => s.toLowerCase().includes(searchTerm)),
    );
  }

  if (filters.value.status) {
    result = result.filter(um => um.status === filters.value.status);
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
    }

    return filters.value.sortOrder === 'asc' ? comparison : -comparison;
  });

  return result;
});
</script>

<style></style>
