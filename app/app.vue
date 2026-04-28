<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();

// Mantemos o cookie apenas se usar o sistema de preview de conteúdo no CMS
const previewCookie = useCookie('preview_layer');

const clearPreview = () => {
  previewCookie.value = null;
  // Recarrega a página limpando a cache
  window.location.href = '/'; 
};
</script>

<template>
  <div class="min-h-screen transition-colors duration-500">
    
    <NuxtLoadingIndicator color="var(--color-primary)" :height="3" />
    
    <NuxtLayout>
      <NuxtPage :page-key="route.fullPath" />
    </NuxtLayout>

    <button 
      v-if="previewCookie" 
      @click="clearPreview"
      class="fixed bottom-6 right-6 z-[99] bg-red-500 text-white px-5 py-3 rounded-full shadow-2xl text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
    >
      <i class="pi pi-times mr-2"></i> Sair do Preview
    </button>
    
  </div>
</template>