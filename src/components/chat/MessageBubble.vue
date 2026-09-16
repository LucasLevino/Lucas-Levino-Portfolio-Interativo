<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '../../data/portfolio'

const props = defineProps<{
  message: Message;
  isRead: boolean;
}>()

const formattedText = computed(() => {
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
    <div v-if="message.sticker" class="relative flex flex-col items-end">
      <img :src="message.sticker" alt="Sticker" class="w-32 sm:w-40 drop-shadow-md" />

      <!-- Horário e Check flutuando -->
      <div
        class="mt-1 flex items-center gap-1 text-[11px] text-wa-text-secondary drop-shadow-sm dark:text-wa-text-secondary-dark bg-white/40 dark:bg-black/30 px-1.5 py-0.5 rounded-full">
        <span>{{ message.time }}</span>
        <svg v-if="message.sender === 'me'" viewBox="0 0 16 15" width="16" height="15" fill="currentColor"
          class="transition-colors duration-500" :class="isRead ? 'text-[#53bdeb]' : 'text-gray-500'">
          <path
            d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.346.125.467-.025l6.259-8.051a.365.365 0 0 0-.034-.516zM11.517 3.01l-.478-.372a.365.365 0 0 0-.51.063L5.166 9.579a.32.32 0 0 1-.484.033L2.35 7.478a.32.32 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l2.82 2.706c.143.14.346.125.467-.025l5.772-7.425l.434-.559a.365.365 0 0 0-.034-.516z">
          </path>
        </svg>
      </div>
    </div>

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
      <div v-if="message.iframe"
        class="mb-2 w-[260px] sm:w-[320px] md:w-[450px] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
        <iframe :src="message.iframe" class="h-[200px] md:h-[300px] w-full border-0" allowfullscreen>
        </iframe>
      </div>

      <!-- Open Graph Card (Link Preview) -->
      <a v-if="message.ogCard" :href="message.ogCard.url" target="_blank" rel="noopener noreferrer"
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