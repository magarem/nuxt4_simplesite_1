<script setup>
defineProps({
  isDark: Boolean,
  isGlass: Boolean,
  isScrolled: Boolean,
  isMobileMenuOpen: Boolean
});

// Emite eventos para o Pai executar a lógica
defineEmits(['toggle-theme', 'toggle-menu']);
</script>

<template>
  <div 
    class="flex items-center gap-2 md:gap-4 relative z-50" 
    :class="{'text-white': isGlass && !isScrolled && !isMobileMenuOpen}"
  >
    <button 
      @click="$emit('toggle-theme')" 
      class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-black/10 active:scale-95 transition-all duration-300" 
      aria-label="Mudar Tema"
    >
      <i :class="['pi text-lg md:text-xl transition-transform duration-500', isDark ? 'pi-sun rotate-180 text-amber-300' : 'pi-moon']"></i>
    </button>

    <button class="hidden md:inline-flex px-5 py-2.5 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] font-bold text-xs uppercase tracking-wider hover:bg-[var(--theme-brand)] hover:text-white hover:scale-105 transition-all duration-300 shadow-md">
      Começar
    </button>

    <button 
      class="md:hidden flex items-center justify-center w-12 h-12 rounded-full hover:bg-black/10 active:scale-95 transition-all duration-300"
      @click="$emit('toggle-menu')"
      :aria-label="isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'"
    >
      <i :class="['pi text-2xl transition-transform duration-500', isMobileMenuOpen ? 'pi-times rotate-90' : 'pi-bars']"></i>
    </button>
  </div>
</template>