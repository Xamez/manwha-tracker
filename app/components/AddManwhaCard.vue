<template>
  <button @click="isModalOpen = true">
    <div class="w-full h-[210px] rounded-md overflow-hidden relative group">
      <div
        class="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
        :style="{
          backgroundImage: `url(https://i.pinimg.com/736x/ff/8a/76/ff8a76543389ea307d2a96635dd0668f.jpg)`,
        }"
      ></div>
      <div
        class="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-center h-full bg-black/60 text-white"
      >
        <div class="flex flex-col items-center gap-3 group-hover:scale-110">
          <Icon name="lucide:plus" size="64" class="group-hover:rotate-90" />
          <h2 class="m-0 text-md md:text-lg font-bold">Add Manwha</h2>
        </div>
      </div>
    </div>
  </button>

  <AddManwhaModal v-model="isModalOpen" />
</template>

<script lang="ts" setup>
const isModalOpen = ref(false);
</script>

<style scoped>
* {
  transition: all 0.3s ease-in-out !important;
}
</style>
