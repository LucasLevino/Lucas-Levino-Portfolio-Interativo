<script setup lang="ts">
import { computed } from 'vue'
import type { Tab } from '../../data/portfolio'

const props = defineProps<{
  tab: Tab;
  isActive: boolean;
}>()

// 1. Pega dinamicamente a última mensagem real do array da conversa
const lastMessage = computed(() => {
  const msgs = props.tab.messages;
  return msgs.length > 0 ? msgs[msgs.length - 1] : null;
})

// 2. Inteligência para exibir o texto correto (Tratando figurinhas e links)
const previewText = computed(() => {
  if (!lastMessage.value) return '';
  if ('text' in lastMessage.value && lastMessage.value.text) return lastMessage.value.text;
  if (lastMessage.value.type === 'sticker') return '📷 Figurinha';
  if (lastMessage.value.type === 'iframe' || lastMessage.value.type === 'ogCard') return '🔗 Link';
  return '';
})
</script>

<template>
  <button 
    class="group flex w-full cursor-pointer items-center gap-3 border-b border-wa-border p-3 text-left transition-colors hover:bg-wa-bg-default dark:border-wa-border-dark dark:hover:bg-gray-800"
    :class="isActive ? 'bg-wa-bg-default dark:bg-gray-800' : 'bg-white dark:bg-wa-bg-default-dark'"
  >
    <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-wa-bg-app font-bold text-wa-text-secondary dark:bg-gray-700 dark:text-wa-text-primary-dark">
      <img v-if="tab.avatarImage" :src="tab.avatarImage" alt="Avatar" class="h-full w-full object-cover" />
      <span v-else>{{ tab.avatarText }}</span>
    </div>

    <div class="flex flex-1 flex-col overflow-hidden">
      
      <div class="flex items-center justify-between">
        <h2 class="truncate text-[17px] font-normal text-wa-text-primary dark:text-wa-text-primary-dark">
          {{ tab.title }}
        </h2>
        <span 
          class="shrink-0 text-xs"
          :class="tab.unreadCount ? 'text-wa-primary' : 'text-wa-text-secondary'"
        >
          {{ lastMessage ? lastMessage.time : tab.time }}
        </span>
      </div>
      
      <div class="flex items-center justify-between gap-2 mt-0.5">
        
        <div class="flex flex-1 items-center gap-1 truncate">
          <svg 
            v-if="lastMessage?.sender === 'me'" 
            viewBox="0 0 16 15" width="16" height="15" fill="currentColor" 
            class="shrink-0 transition-colors duration-500"
            :class="tab.isRead ? 'text-[#53bdeb]' : 'text-gray-400 dark:text-gray-500'"
          >
            <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.346.125.467-.025l6.259-8.051a.365.365 0 0 0-.034-.516zM11.517 3.01l-.478-.372a.365.365 0 0 0-.51.063L5.166 9.579a.32.32 0 0 1-.484.033L2.35 7.478a.32.32 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l2.82 2.706c.143.14.346.125.467-.025l5.772-7.425l.434-.559a.365.365 0 0 0-.034-.516z"></path>
          </svg>
          
          <p class="truncate text-[14px] text-wa-text-secondary dark:text-wa-text-secondary-dark">
            {{ previewText }}
          </p>
        </div>
        
        <span 
          v-if="tab.unreadCount && tab.unreadCount > 0" 
          class="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-wa-primary px-1 text-[11px] font-bold text-white"
        >
          {{ tab.unreadCount }}
        </span>
      </div>

    </div>
  </button>
</template>