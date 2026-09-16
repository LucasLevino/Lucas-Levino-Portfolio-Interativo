import { ref, computed, onMounted, onUnmounted } from 'vue'
import { portfolioData, type Tab } from '../data/portfolio'

const tabs = ref<Tab[]>(portfolioData)
const searchQuery = ref('') // 1. Variável que guarda o que o usuário digita

const getInitialTab = () => {
  const hash = window.location.hash.replace('#', '')
  return tabs.value.some(t => t.id === hash) ? hash : portfolioData[0].id
}

const activeTabId = ref<string>(getInitialTab())
const isMobileChatOpen = ref<boolean>(false)

export function useChat() {
  const activeTab = computed(() => {
    return tabs.value.find(tab => tab.id === activeTabId.value) || tabs.value[0]
  })

  const filteredTabs = computed(() => {
    if (!searchQuery.value.trim()) return tabs.value;
    
    const query = searchQuery.value.toLowerCase();
    
    return tabs.value.filter(tab => {
      const matchTitle = tab.title.toLowerCase().includes(query);
      const matchMessages = tab.messages.some(msg => msg.text.toLowerCase().includes(query));
      return matchTitle || matchMessages;
    });
  })

  const selectTab = (id: string) => {
    activeTabId.value = id
    isMobileChatOpen.value = true
    window.location.hash = id

    const selected = tabs.value.find(t => t.id === id)
    if (selected) {
      if (selected.unreadCount && selected.unreadCount > 0) {
        selected.unreadCount = 0;
        setTimeout(() => {
          selected.isRead = true;
        }, 600);
      } else {
        selected.isRead = true;
      }
    }
  }

  const closeMobileChat = () => {
    isMobileChatOpen.value = false
  }

  const handleHashChange = () => {
    const hash = window.location.hash.replace('#', '')
    if (hash && tabs.value.some(t => t.id === hash)) {
      activeTabId.value = hash
    }
  }

  onMounted(() => {
    window.location.hash = activeTabId.value
    window.addEventListener('hashchange', handleHashChange)
  })

  onUnmounted(() => {
    window.removeEventListener('hashchange', handleHashChange)
  })

  return {
    tabs,
    filteredTabs, 
    searchQuery,  
    activeTabId,
    activeTab,
    isMobileChatOpen,
    selectTab,
    closeMobileChat
  }
}