<script setup>
defineProps({
  // Estado Visual
  isGlass: Boolean,
  isScrolled: Boolean,
  isMobileMenuOpen: Boolean,
  isDark: Boolean,
  theme: Object,
  topbarConfig: Object,
  
  // Os Links Dinâmicos do CMS
  menuItems: {
    type: Array,
    default: () => []
  },

  // ✨ NOVA PROP: Controlo total da Tipografia do Menu ✨
  menuFont: {
    type: Object,
    default: () => ({
      family: 'inherit',
      sizeDesktop: '14px',
      sizeMobile: '18px',
      weight: '500' // 500 = medium, 700 = bold
    })
  }
});

defineEmits(['close-menu']);
</script>

<template>
  <nav 
    class="hidden md:flex items-center gap-8 tracking-wide" 
    :class="{'drop-shadow-md text-white': isGlass && !isScrolled}"
    :style="{ 
      fontFamily: menuFont.family, 
      fontSize: menuFont.sizeDesktop,
      fontWeight: menuFont.weight 
    }"
  >
    <NuxtLink 
      v-for="(item, index) in menuItems" 
      :key="`desktop-${index}`"
      :to="item.path" 
      class="relative py-2 group"
    >
      <span class="group-hover:text-[var(--theme-brand)] transition-colors duration-300">
        {{ item.label }}
      </span>
      <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--theme-brand)] transition-all duration-300 group-hover:w-full rounded-full"></span>
    </NuxtLink>
  </nav>

  <Transition name="mobile-menu">
    <div 
      v-if="isMobileMenuOpen" 
      class="md:hidden absolute top-full left-0 w-full flex flex-col items-center py-6 shadow-2xl border-b border-black/5 backdrop-blur-xl"
      :style="{ 
        backgroundColor: isDark ? 'var(--theme-bg)' : theme?.components?.topbar?.backgroundColor || '#ffffff',
        color: isDark ? 'var(--theme-text)' : theme?.components?.topbar?.textColor || '#000000' 
      }"
    >
      <nav class="flex flex-col w-full px-6 gap-2">
        
        <NuxtLink 
          v-for="(item, index) in menuItems" 
          :key="`mobile-${index}`"
          :to="item.path" 
          class="flex items-center justify-between w-full p-4 rounded-xl hover:bg-black/5 hover:text-[var(--theme-brand)] transition-all duration-300 group" 
          :style="{ 
            fontFamily: menuFont.family, 
            fontSize: menuFont.sizeMobile,
            fontWeight: '700' /* No mobile, links costumam ser mais pesados (bold) para clicar fácil */
          }"
          @click="$emit('close-menu')"
        >
          <span>{{ item.label }}</span>
          <i class="pi pi-arrow-right opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm"></i>
        </NuxtLink>

        <div class="mt-4 pt-4 border-t border-black/5 w-full">
          <button 
            class="w-full px-6 py-4 rounded-xl bg-[var(--theme-brand)] text-white font-bold text-sm uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95"
            :style="{ fontFamily: menuFont.family }"
          >
            Começar Projeto <i class="pi pi-sparkles"></i>
          </button>
        </div>
      </nav>
    </div>
  </Transition>
</template>

<style scoped>
/* Animações mantêm-se iguais */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.95);
}
</style>