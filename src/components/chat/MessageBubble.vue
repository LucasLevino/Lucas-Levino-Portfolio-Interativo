<script setup lang="ts">
import { computed } from 'vue'
import type { Message, StickerMessage, IframeMessage, OgCardMessage } from '../../data/portfolio'
import MessageSticker from './MessageSticker.vue'
import MessageIframe from './MessageIframe.vue'
import MessageLinkPreview from './MessageLinkPreview.vue'

const props = defineProps<{
  message: Message;
  isRead: boolean;
}>()

const formattedText = computed(() => {
  if (!('text' in props.message) || !props.message.text) return '';
  const urlRegex = /(https?:\/\/[^\s]+|mailto:[^\s]+)/g;
  return props.message.text.replace(urlRegex, (url) => {
    const displayUrl = url.startsWith('mailto:') ? url.replace('mailto:', '') : url;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#027eb5] dark:text-[#53bdeb] hover:underline">${displayUrl}</a>`;
  });
})
</script>

<template>
  <div class="relative mb-3 flex w-fit max-w-[85%] flex-col md:max-w-[70%]"
    :class="[message.sender === 'me' ? 'self-end' : 'self-start']">

    <!-- 10.2. LAYOUT DE FIGURINHA (STICKER) -->
    <MessageSticker v-if="message.type === 'sticker'" :message="message as StickerMessage" :isRead="isRead" />

    <!-- LAYOUT DO BALÃO PADRÃO (Texto, Iframe, Link) -->
    <div v-else class="relative flex flex-col rounded-lg px-2 py-2 text-[15px] leading-relaxed shadow-sm" :class="[
      message.sender === 'me'
        ? 'rounded-tr-none bg-wa-msg-out dark:bg-wa-msg-out-dark'
        : 'rounded-tl-none bg-wa-msg-in dark:bg-wa-msg-in-dark'
    ]">
      <!-- Cauda do balão -->
      <span class="absolute top-0 w-2 h-3"
        :class="message.sender === 'me' ? '-right-2 text-wa-msg-out dark:text-wa-msg-out-dark' : '-left-2 text-wa-msg-in dark:text-wa-msg-in-dark'">
        <svg v-if="message.sender === 'me'" viewBox="0 0 8 13" width="8" height="13" fill="currentColor">
          <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
        </svg>
        <svg v-else viewBox="0 0 8 13" width="8" height="13" fill="currentColor">
          <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path>
        </svg>
      </span>

      <!-- Iframe (Figma/Vídeos) -->
      <MessageIframe v-if="message.type === 'iframe'" :message="message as IframeMessage" />

      <!-- Open Graph Card (Link Preview) -->
      <MessageLinkPreview v-if="message.type === 'ogCard'" :message="message as OgCardMessage" />

      <!-- Texto da mensagem e Horário -->
      <div class="flex flex-wrap items-end justify-between gap-3 px-1">
        <p class="flex-1 whitespace-pre-wrap text-wa-text-primary dark:text-wa-text-primary-dark"
          v-html="formattedText"></p>

        <span
          class="flex shrink-0 items-center gap-1 pb-[2px] text-[11px] text-wa-text-secondary dark:text-wa-text-secondary-dark">
          {{ message.time }}
          <svg v-if="message.sender === 'me'" viewBox="0 0 16 15" width="16" height="15" fill="currentColor"
            class="transition-colors duration-500"
            :class="isRead ? 'text-[#53bdeb]' : 'text-gray-400 dark:text-gray-500'">
            <path
              d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.346.125.467-.025l6.259-8.051a.365.365 0 0 0-.034-.516zM11.517 3.01l-.478-.372a.365.365 0 0 0-.51.063L5.166 9.579a.32.32 0 0 1-.484.033L2.35 7.478a.32.32 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l2.82 2.706c.143.14.346.125.467-.025l5.772-7.425l.434-.559a.365.365 0 0 0-.034-.516z">
            </path>
          </svg>
        </span>
      </div>
    </div> 

  </div>
</template>