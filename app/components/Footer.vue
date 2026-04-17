<template>
  <!-- O fundo e o texto usam as variáveis globais, e a borda usa o color-mix para se adaptar suavemente -->
  <footer
    class="w-full shrink-0 transition-colors duration-500 relative z-10 mt-auto border-t"
    :style="{
      paddingTop: theme.components.footer.paddingTop || '60px',
      paddingBottom: theme.components.footer.paddingBottom || '40px',
      backgroundColor: 'var(--theme-bg)',
      color: 'var(--theme-text)',
      borderColor: 'color-mix(in srgb, var(--theme-text) 10%, transparent)'
    }"
  >
    <div :class="['flex flex-col md:flex-row justify-between items-center gap-8 w-full mx-auto', theme.components.footer.innerContentWidth || 'cw-1']">

      <!-- ✨ Marca e Direitos de Autor ✨ -->
      <div class="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
        <span class="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[var(--theme-text)] to-[var(--theme-brand)] transition-colors duration-500">
          MEU LOGO
        </span>
        <p class="opacity-60 text-sm mt-2 transition-opacity hover:opacity-100 duration-300">
          © {{ new Date().getFullYear() }} Sirius Studio. Todos os direitos reservados.
        </p>
      </div>

      <!-- ✨ Links e Redes Sociais ✨ -->
      <div class="flex flex-col items-center md:items-end gap-5">
        
        <!-- Links Rápidos -->
        <div class="flex gap-6 text-sm opacity-80 font-medium">
          <NuxtLink to="/privacidade" class="hover:text-[var(--theme-brand)] transition-colors">Privacidade</NuxtLink>
          <NuxtLink to="/termos" class="hover:text-[var(--theme-brand)] transition-colors">Termos</NuxtLink>
          <NuxtLink to="/contactos" class="hover:text-[var(--theme-brand)] transition-colors">Suporte</NuxtLink>
        </div>
        
        <!-- Ícones Sociais (Invertem de cor automaticamente no Modo Escuro) -->
        <div class="flex gap-3">
          <a href="#" aria-label="Instagram" class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] hover:bg-[var(--theme-brand)] hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <i class="pi pi-instagram text-lg"></i>
          </a>
          <a href="#" aria-label="LinkedIn" class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] hover:bg-[var(--theme-brand)] hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <i class="pi pi-linkedin text-lg"></i>
          </a>
          <a href="#" aria-label="Twitter" class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] hover:bg-[var(--theme-brand)] hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <i class="pi pi-twitter text-lg"></i>
          </a>
        </div>

      </div>

    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import themeConfig from '~/config/theme.json';

const theme = computed(() => themeConfig);
</script>