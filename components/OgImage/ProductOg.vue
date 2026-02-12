<script setup>
defineProps({
  title: String,
  price: Number,
  image: String
})
</script>

<template>
  <div class="w-1200 h-630 bg-white flex items-center p-12">
    <div class="flex-1">
      <h1 class="text-5xl font-bold">{{ title }}</h1>
      <p class="text-3xl text-green-600 mt-4">
        Rp {{ price?.toLocaleString('id-ID') }}
      </p>
      <p class="text-gray-500 mt-2">Mars4Mart Serang</p>
    </div>
    <div v-if="image" class="w-1/2 h-full flex items-center justify-center">
      <img :src="image" class="max-h-full object-contain">
    </div>
  </div>
</template>