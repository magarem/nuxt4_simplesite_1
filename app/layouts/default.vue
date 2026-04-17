<template>
  <div class="cw-0 shadow-2xl min-h-screen flex flex-col bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans transition-colors duration-500 relative mx-auto">
    
    <!-- ✨ TOPBAR UNIFICADA (Modo Padrão/Sólido) ✨ -->
    <!-- Como is-glass="false", ela assume o comportamento sticky e fundo sólido -->
    <SiteHeader :is-glass="false" />

    <!-- ✨ MAIN CONTENT ✨ -->
    <main class="flex-1 w-full flex flex-col">
       <slot />
    </main>

    <!-- ✨ FOOTER ✨ -->
    <Footer />

  </div>
</template>

<script setup>
import { computed } from 'vue';
// Usar o caminho relativo em vez do alias '~' para evitar erros de resolução de módulos no Node
import themeConfig from '../config/theme.json';

const theme = computed(() => themeConfig);
</script>