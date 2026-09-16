<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'on-send', text: string): void
}>()

const message = ref('')

const sendMessage = () => {
  if (!message.value.trim()) return

  emit('on-send', message.value)
  message.value = ''
}
</script>

<template>
  <footer
    class="flex min-h-[62px] shrink-0 items-center gap-2 bg-wa-bg-default px-4 py-2 z-10 dark:bg-wa-bg-default-dark">

    <!-- Ícone de Anexo (mantido estético como no whats) -->
    <button
      class="p-2 text-wa-text-secondary transition-colors hover:text-wa-text-primary dark:hover:text-wa-text-primary-dark"
      aria-label="Anexar arquivo" disabled>
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.57.57 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z">
        </path>
      </svg>
    </button>

    <!-- Campo de Digitação -->
    <input 
      v-model="message"
      @keyup.enter="sendMessage"
      type="text" 
      placeholder="Envie uma mensagem pro meu WhatsApp..."
      class="flex-1 rounded-lg bg-white px-4 py-2.5 shadow-sm outline-none transition-all text-wa-text-primary dark:text-wa-text-primary-dark placeholder-wa-text-secondary focus:ring-1 focus:ring-wa-primary dark:bg-wa-msg-in-dark text-sm md:text-base"
      aria-label="Digite uma mensagem"
    />

    <!-- Botão de Microfone ou Enviar -->
    <button
      @click="message.trim() ? sendMessage() : null"
      class="p-2 text-wa-text-secondary transition-colors hover:text-wa-text-primary dark:hover:text-wa-text-primary-dark"
      :aria-label="message.trim() ? 'Enviar mensagem' : 'Mensagem de voz'" 
      :disabled="!message.trim()">
      
      <!-- Ícone de Enviar (aparece se tiver texto) -->
      <svg v-if="message.trim()" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
      </svg>
      
      <!-- Ícone de Microfone (aparece se não tiver texto) -->
      <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z">
        </path>
      </svg>
    </button>
  </footer>
</template>