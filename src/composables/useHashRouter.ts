import { ref, onMounted, onUnmounted } from 'vue'

export function useHashRouter(defaultHash: string, validHashes: string[]) {
  const getInitialHash = () => {
    const hash = window.location.hash.replace('#', '')
    return validHashes.includes(hash) ? hash : defaultHash
  }

  const currentHash = ref<string>(getInitialHash())

  const setHash = (hash: string) => {
    currentHash.value = hash
    window.location.hash = hash
  }

  const handleHashChange = () => {
    const hash = window.location.hash.replace('#', '')
    if (hash && validHashes.includes(hash)) {
      currentHash.value = hash
    }
  }

  onMounted(() => {
    window.location.hash = currentHash.value
    window.addEventListener('hashchange', handleHashChange)
  })

  onUnmounted(() => {
    window.removeEventListener('hashchange', handleHashChange)
  })

  return {
    currentHash,
    setHash
  }
}
