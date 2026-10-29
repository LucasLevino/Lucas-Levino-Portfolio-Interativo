<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import PortfolioView from './views/PortfolioView.vue'
import ArchPromptView from './views/ArchPromptView.vue'

const getNormalizedPath = () => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  return path.toLowerCase()
}

const currentPath = ref<string>(getNormalizedPath())

const isArchStudioRoute = computed(() => {
  return currentPath.value === '/archstudio' || currentPath.value === '/archprompt'
})

const handlePopState = () => {
  currentPath.value = getNormalizedPath()
}

const navigateTo = (path: string) => {
  window.history.pushState({}, '', path)
  currentPath.value = getNormalizedPath()
}

watch(
  isArchStudioRoute,
  isArch => {
    if (isArch) {
      document.title = 'ArchStudio | Gerador de Prompts Arquitetônicos — Lucas Levino'
    } else {
      document.title = 'Lucas Levino | Especialista e Arquiteto de Software'
    }
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>

<template>
  <ArchPromptView v-if="isArchStudioRoute" @navigate-home="navigateTo('/')" />
  <PortfolioView v-else />
</template>
