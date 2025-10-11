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
  minRating: 0,
  genre: '',
  sortBy: 'lastReadAt',
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

  if (filters.value.minRating > 0) {
    result = result.filter(um => (um.rating ?? 0) >= filters.value.minRating);
  }

  if (filters.value.genre) {
    result = result.filter(um =>
      um.manwha.genres.some(g => g.toLowerCase() === filters.value.genre.toLowerCase()),
    );
  }

  result.sort((a, b) => {
    let comparison = 0;

    switch (filters.value.sortBy) {
      case 'lastReadAt':
        comparison = new Date(a.lastReadAt).getTime() - new Date(b.lastReadAt).getTime();
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
