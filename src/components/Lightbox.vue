<script setup lang="ts">
import { useLightbox } from '../composables/useLightbox'

const { isOpen, imageUrl, imageCaption, closeLightbox } = useLightbox()
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div v-if="isOpen" 
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-sm" 
        @click="closeLightbox">
        
        <!-- Botão de Fechar -->
        <button 
          class="absolute top-4 right-4 z-10 p-2 text-white/70 transition-colors hover:text-white md:top-8 md:right-8" 
          @click.stop="closeLightbox" 
          aria-label="Fechar visualização">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        </button>

        <!-- Container da Imagem e Legenda -->
        <div class="flex flex-col items-center justify-center h-full w-full pointer-events-none" @click.stop>
          <img 
            :src="imageUrl" 
            alt="Visualização Ampliada" 
            class="object-contain drop-shadow-2xl select-none pointer-events-auto"
            :class="imageCaption ? 'w-[283px] h-[283px]' : 'max-h-[85vh] max-w-[90vw]'" 
          />
          
          <!-- Legenda -->
          <div v-if="imageCaption" class="mt-6 px-4 py-2 text-center text-white/90 text-sm md:text-base font-medium tracking-wide">
            {{ imageCaption }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox-fade-enter-active img {
  animation: lightbox-scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.lightbox-fade-leave-active img {
  animation: lightbox-scale-out 0.25s ease forwards;
}

@keyframes lightbox-scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes lightbox-scale-out {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.9);
    opacity: 0;
  }
}
</style>
