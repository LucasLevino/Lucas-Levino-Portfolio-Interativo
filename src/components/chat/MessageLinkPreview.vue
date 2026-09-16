<script setup lang="ts">
import type { OgCardMessage } from '../../data/portfolio'

defineProps<{
  message: OgCardMessage;
}>()
</script>

<template>
  <a :href="message.ogCard.url" target="_blank" rel="noopener noreferrer"
    class="mb-2 flex flex-col overflow-hidden rounded-md bg-black/5 transition-colors hover:bg-black/10 dark:bg-black/20 dark:hover:bg-black/30 border-l-4 border-[#027eb5] dark:border-[#53bdeb] cursor-pointer no-underline">
    <img v-if="message.ogCard.image" :src="message.ogCard.image" alt="Preview"
      class="h-[140px] w-full object-cover" />
    <div class="flex flex-col gap-0.5 p-2.5">
      <h3 class="truncate text-sm font-semibold text-wa-text-primary dark:text-wa-text-primary-dark">{{
        message.ogCard.title }}</h3>
      <p class="line-clamp-2 text-[13px] leading-snug text-wa-text-secondary dark:text-wa-text-secondary-dark">{{
        message.ogCard.description }}</p>
      <span
        class="mt-1 text-[10px] font-medium uppercase text-wa-text-secondary dark:text-wa-text-secondary-dark opacity-80">{{
          message.ogCard.domain }}</span>
    </div>
  </a>
</template>
