import { ref, computed } from 'vue'
import type { Tab } from '../data/portfolio'
import { useHashRouter } from './useHashRouter'

export function useChat(initialTabs: Tab[]) {
  const tabs = ref<Tab[]>(initialTabs)
  const searchQuery = ref('')
  const isMobileChatOpen = ref<boolean>(false)

  const validHashes = initialTabs.map(t => t.id)
  const defaultHash = validHashes.length > 0 ? validHashes[0] : ''

  const { currentHash: activeTabId, setHash } = useHashRouter(defaultHash, validHashes)

  const activeTab = computed(() => {
    return tabs.value.find(tab => tab.id === activeTabId.value) || tabs.value[0]
  })

  const filteredTabs = computed(() => {
    if (!searchQuery.value.trim()) return tabs.value;
    
    const query = searchQuery.value.toLowerCase();
    
    return tabs.value.filter(tab => {
      const matchTitle = tab.title.toLowerCase().includes(query);
      const matchMessages = tab.messages.some(msg => 'text' in msg && msg.text && msg.text.toLowerCase().includes(query));
      return matchTitle || matchMessages;
    });
  })

  const selectTab = (id: string) => {
    setHash(id)
    isMobileChatOpen.value = true

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