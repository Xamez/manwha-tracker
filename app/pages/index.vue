<template>
  <div class="flex flex-row gap-10">
    <FilterSidebar
      class="hidden sm:block"
      :user-manwhas="userManwhas ?? []"
      @filter-change="handleFilterChange"
    />
    <ManwhaGrid :user-manwhas="filteredManwhas" />
  </div>
</template>

<script lang="ts" setup>
import type { Filters } from '~~/shared/types/filters';

const { data: userManwhas } = await useFetch<UserManwha[]>('/api/user-manwha');

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

function handleFilterChange(newFilters: Filters) {
  filters.value = newFilters;
}
</script>

<style></style>
