import { ref } from 'vue'

const isOpen = ref(false)
const imageUrl = ref('')

export function useLightbox() {
  const openLightbox = (url?: string) => {
    if (!url) return
    imageUrl.value = url
    isOpen.value = true
  }

  const closeLightbox = () => {
    isOpen.value = false
    setTimeout(() => {
      imageUrl.value = ''
    }, 300) // Limpa após a transição
  }

  return {
    isOpen,
    imageUrl,
    openLightbox,
    closeLightbox
  }
}
