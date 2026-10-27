<script setup lang="ts">
import { computed } from 'vue'
import type { OgCardMessage } from '../../data/portfolio'
import { useLightbox } from '../../composables/useLightbox'

const props = defineProps<{
  message: OgCardMessage;
}>()

const { openLightbox } = useLightbox()

const isInternalRoute = computed(() => {
  return props.message.ogCard.url.startsWith('/archprompt')
})

const handleImageClick = (e: MouseEvent) => {
  if (isInternalRoute.value) {
    // Permite que o clique na imagem também abra a rota /archprompt diretamente
    return
  }
  e.preventDefault()
  if (props.message.ogCard.image) {
    openLightbox(props.message.ogCard.image)
  }
}
</script>

<template>
  <a :href="message.ogCard.url" :target="isInternalRoute ? '_self' : '_blank'" rel="noopener noreferrer"
    class="mb-2 flex flex-col overflow-hidden rounded-md bg-black/5 transition-colors hover:bg-black/10 dark:bg-black/20 dark:hover:bg-black/30 border-l-4 border-[#027eb5] dark:border-[#53bdeb] cursor-pointer no-underline group">
    <img v-if="message.ogCard.image" :src="message.ogCard.image" alt="Preview"
      class="h-[140px] w-full object-cover group-hover:opacity-90 transition-opacity" 
      @click="handleImageClick" />
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
