import { ref } from 'vue'

const isOpen = ref(false)
const imageUrl = ref('')
const imageCaption = ref('')

export function useLightbox() {
  const openLightbox = (url?: string, caption?: string) => {
    if (!url) return
    imageUrl.value = url
    imageCaption.value = caption || ''
    isOpen.value = true
  }

  const closeLightbox = () => {
    isOpen.value = false
    setTimeout(() => {
      imageUrl.value = ''
      imageCaption.value = ''
    }, 300) // Limpa após a transição
  }

  return {
    isOpen,
    imageUrl,
    imageCaption,
    openLightbox,
    closeLightbox
  }
}
