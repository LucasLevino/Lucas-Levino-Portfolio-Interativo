<script setup lang="ts">
import type { IframeMessage } from '../../data/portfolio'

defineProps<{
  message: IframeMessage;
}>()
</script>

<template>
  <div class="mb-2 w-[260px] sm:w-[320px] md:w-[450px] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
    <iframe :src="message.iframe" class="h-[200px] md:h-[300px] w-full border-0" allowfullscreen>
    </iframe>
  </div>
</template>
