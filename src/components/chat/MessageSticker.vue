<script setup lang="ts">
import { computed } from 'vue'
import type { StickerMessage } from '../../data/portfolio'
import { useLightbox } from '../../composables/useLightbox'

const props = defineProps<{
  message: StickerMessage;
  isRead: boolean;
}>()

const { openLightbox } = useLightbox()

const stickerCaption = computed(() => {
  if (!props.message.sticker) return 'Sticker'
  const parts = props.message.sticker.split('/')
  const filename = parts[parts.length - 1]
  const name = filename.split('.')[0]
  // Capitalize first letter and replace dashes/underscores with spaces
  const cleanName = name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' ')
  return `${cleanName} • Lucas Levino`
})
</script>

<template>
  <div class="relative flex flex-col items-end">
    <img :src="message.sticker" :alt="stickerCaption" class="w-32 sm:w-40 drop-shadow-md cursor-pointer hover:opacity-95 transition-opacity" @click="openLightbox(message.sticker, stickerCaption)" />

    <div
      class="mt-1 flex items-center gap-1 text-[11px] text-wa-text-secondary drop-shadow-sm dark:text-wa-text-secondary-dark bg-white/40 dark:bg-black/30 px-1.5 py-0.5 rounded-full">
      <span>{{ message.time }}</span>
      <svg v-if="message.sender === 'visitor'" viewBox="0 0 16 15" width="16" height="15" fill="currentColor"
        class="transition-colors duration-500" :class="isRead ? 'text-[#53bdeb]' : 'text-gray-500'">
        <path
          d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.346.125.467-.025l6.259-8.051a.365.365 0 0 0-.034-.516zM11.517 3.01l-.478-.372a.365.365 0 0 0-.51.063L5.166 9.579a.32.32 0 0 1-.484.033L2.35 7.478a.32.32 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l2.82 2.706c.143.14.346.125.467-.025l5.772-7.425l.434-.559a.365.365 0 0 0-.034-.516z">
        </path>
      </svg>
    </div>
  </div>
</template>
