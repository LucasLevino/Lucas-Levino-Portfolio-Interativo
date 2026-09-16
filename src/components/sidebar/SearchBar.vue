<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="p-2 border-b border-wa-border dark:border-wa-border-dark bg-white dark:bg-wa-bg-default-dark">
    <div class="relative flex items-center bg-wa-bg-app dark:bg-gray-800 rounded-lg px-3 py-1.5">
      <svg class="text-gray-400 shrink-0" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.608 0a3.606 3.606 0 1 1 0-7.212 3.606 3.606 0 0 1 0 7.212z"></path>
      </svg>
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text" 
        placeholder="Pesquisar ou começar uma nova conversa" 
        class="w-full bg-transparent border-none focus:ring-0 outline-none text-sm ml-3 text-wa-text-primary dark:text-wa-text-primary-dark placeholder-gray-500"
      />
    </div>
  </div>
</template>