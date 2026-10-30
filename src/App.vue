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

type RouteMeta = { title: string; description: string; url: string }

const META: Record<'home' | 'archstudio', RouteMeta> = {
  home: {
    title: 'Lucas Levino | Especialista e Arquiteto de Software',
    description: 'Lucas Levino: Desenvolvedor Full Stack e Arquiteto de Software em Cuiabá-MT. Especialista na TVCA, cofundador da Sitemakers. Vue 3, Laravel, React, Flutter e SEO.',
    url: 'https://lucaslevino.com/'
  },
  archstudio: {
    title: 'ArchStudio: Gerador de Prompts para Arquitetura e 3D | Lucas Levino',
    description: 'Gerador de prompts de IA para arquitetura: monte prompts em 6 fases para fachadas, interiores, iluminação, móveis 3D e plantas baixas. Grátis, no navegador.',
    url: 'https://lucaslevino.com/archstudio'
  }
}

const setTag = (selector: string, attr: string, value: string) => {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

const applyMeta = (meta: RouteMeta) => {
  document.title = meta.title
  setTag('link[rel="canonical"]', 'href', meta.url)
  setTag('meta[name="description"]', 'content', meta.description)
  setTag('meta[property="og:title"]', 'content', meta.title)
  setTag('meta[property="og:description"]', 'content', meta.description)
  setTag('meta[property="og:url"]', 'content', meta.url)
  setTag('meta[name="twitter:title"]', 'content', meta.title)
  setTag('meta[name="twitter:description"]', 'content', meta.description)
  setTag('meta[name="twitter:url"]', 'content', meta.url)
}

watch(
  isArchStudioRoute,
  isArch => applyMeta(isArch ? META.archstudio : META.home),
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
