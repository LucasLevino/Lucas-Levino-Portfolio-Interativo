<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

import { portfolioData } from './data/portfolio'
import { useChat } from './composables/useChat'
import ChatItem from './components/sidebar/ChatItem.vue'
import SearchBar from './components/sidebar/SearchBar.vue'
import MessageBubble from './components/chat/MessageBubble.vue'
import ChatFooter from './components/chat/ChatFooter.vue'

import AvatarDefault from '/assets/avatar/avatar.webp'

const { filteredTabs, searchQuery, activeTabId, activeTab, isMobileChatOpen, selectTab, closeMobileChat } = useChat(portfolioData)

const chatScrollArea = ref<HTMLElement | null>(null)

watch(() => activeTab.value.id, async () => {
  await nextTick()
  if (chatScrollArea.value) {
    chatScrollArea.value.scrollTop = chatScrollArea.value.scrollHeight
  }
}, { immediate: true }) 
</script>

<template>
  <div class="flex h-screen w-screen items-center justify-center overflow-hidden bg-wa-bg-app dark:bg-wa-bg-app-dark">

    <article
      class="flex h-full w-full max-w-none shadow-none bg-wa-bg-default dark:bg-wa-bg-default-dark 2xl:shadow-2xl 3xl:rounded-lg">

      <aside
        class="flex-col w-full md:w-[30%] lg:w-[35%] min-w-[300px] max-w-[450px] border-r border-wa-border dark:border-wa-border-dark bg-white dark:bg-wa-bg-default-dark"
        :class="[isMobileChatOpen ? 'hidden md:flex' : 'flex']">
        <header
          class="flex h-16 shrink-0 items-center border-b border-wa-border bg-wa-bg-default px-4 dark:border-wa-border-dark dark:bg-wa-bg-default-dark">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600">
            <img :src="AvatarDefault" alt="Meu Perfil" class="h-full w-full object-cover" />
          </div>
          <div class="flex flex-col">
            <h1 class="ml-4 font-semibold">Lucas Levino</h1>
            <h2 class="ml-4 font-semibold text-xs text-wa-text-secondary dark:text-wa-text-secondary-dark">Meu Portfólio
            </h2>
          </div>
        </header>

        <SearchBar v-model="searchQuery" />

        <nav class="flex-1 overflow-y-auto bg-white dark:bg-wa-bg-default-dark">
          <ChatItem v-for="tab in filteredTabs" :key="tab.id" :tab="tab" :isActive="activeTabId === tab.id"
            @click="selectTab(tab.id)" />

          <div v-if="filteredTabs.length === 0" class="p-6 text-center text-sm text-wa-text-secondary">
            Nenhuma conversa encontrada.
          </div>
        </nav>
      </aside>

      <section class="relative flex-col flex-1 bg-wa-bg-chat dark:bg-wa-bg-chat-dark overflow-hidden"
        :class="[isMobileChatOpen ? 'flex' : 'hidden md:flex']">
        <header
          class="flex h-16 shrink-0 items-center border-b border-wa-border bg-wa-bg-default px-4 z-20 dark:border-wa-border-dark dark:bg-wa-bg-default-dark">
          <button @click="closeMobileChat" class="mr-3 -ml-2 p-2 text-wa-text-secondary md:hidden"
            aria-label="Voltar para lista">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
            </svg>
          </button>

          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-wa-primary font-bold text-white">
            <img v-if="activeTab.avatarImage" :src="activeTab.avatarImage" alt="Avatar"
              class="h-full w-full object-cover" />
            <span v-else>{{ activeTab.avatarText }}</span>
          </div>

          <div class="ml-4 flex flex-col">
            <h2 class="font-semibold leading-tight text-wa-text-primary dark:text-wa-text-primary-dark">
              {{ activeTab.title }}
            </h2>
            <span class="text-xs text-wa-text-secondary">online</span>
          </div>
        </header>

        <div
          class="absolute inset-0 z-0 opacity-40 bg-[url(/assets/bg-chat.webp)] dark:bg-[url(/assets/bg-chat-dark.webp)] bg-cover bg-no-repeat bg-center">
        </div>

        <div ref="chatScrollArea" class="relative z-10 flex flex-1 flex-col overflow-y-auto p-4 md:p-8 scroll-smooth">
          <TransitionGroup name="chat-list" tag="div" class="relative flex flex-col">
            <MessageBubble v-for="msg in activeTab.messages" :key="msg.id" :message="msg"
              :isRead="activeTab.isRead || false" />
          </TransitionGroup>
        </div>

        <ChatFooter />
      </section>

    </article>
  </div>
</template>