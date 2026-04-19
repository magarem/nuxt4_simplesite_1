<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

import SiteHeaderLogo from '~/components/SiteHeaderLogo.vue';
import SiteHeaderMenu from '~/components/SiteHeaderMenu.vue';
import SiteHeaderExtra from '~/components/SiteHeaderExtra.vue';

const componentMap = {
  SiteHeaderLogo,
  SiteHeaderMenu,
  SiteHeaderExtra
};

const props = defineProps({
  isGlass: { type: Boolean, default: false }
});
console.log("🚀 ~ props:", props)


const { data: topbarConfig, pending: topbarPending } = await useFetch('/data/_topbar.json', {
  server: false, 
  key: 'topbar-data' 
});

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const isDark = ref(false);

const applyTheme = () => {
  if (!topbarConfig.value) return;
  if (isDark.value) {
    document.documentElement.style.setProperty('--theme-bg', topbarConfig.value.textColor); 
    document.documentElement.style.setProperty('--theme-text', topbarConfig.value.backgroundColor); 
  } else {
    document.documentElement.style.removeProperty('--theme-bg'); 
    document.documentElement.style.removeProperty('--theme-text');
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('sirius-dark-mode', isDark.value.toString());
  applyTheme();
};

const toggleMobileMenu = () => isMobileMenuOpen.value = !isMobileMenuOpen.value;
const closeMobileMenu = () => isMobileMenuOpen.value = false;

const handleResize = () => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) closeMobileMenu();
};

const handleScroll = () => {
  if (props.isGlass) isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  if (props.isGlass) window.addEventListener('scroll', handleScroll);

  const savedTheme = localStorage.getItem('sirius-dark-mode');
  if (savedTheme === 'true') {
    isDark.value = true;
    setTimeout(applyTheme, 50);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (props.isGlass) window.removeEventListener('scroll', handleScroll);
});

const headerStyles = computed(() => {
  if (!topbarConfig.value) return {};
  const baseBg = isDark.value ? 'var(--theme-bg)' : topbarConfig.value.backgroundColor;
  const baseText = isDark.value ? 'var(--theme-text)' : topbarConfig.value.textColor;
  const base = { height: topbarConfig.value.height, backgroundColor: baseBg, color: baseText };

  if (props.isGlass) {
    const forceSolidBg = isMobileMenuOpen.value;
    return {
      ...base,
      backgroundColor: (isScrolled.value || forceSolidBg) ? baseBg : 'transparent',
      color: (isScrolled.value || forceSolidBg) ? baseText : '#ffffff',
      maxWidth: 'var(--theme-cw-0, 100%)',
      left: '50%',
      transform: 'translateX(-50%)'
    };
  }
  return base;
});

// ✨ NOVA LÓGICA DE ALINHAMENTO ✨
// Converte a propriedade "align" do JSON na regra flexbox correspondente
const getAlignClass = (align) => {
  switch (align) {
    case 'center': return 'justify-center';
    case 'right': return 'justify-end';
    case 'left':
    default: return 'justify-start';
  }
};
</script>

<template>
  <header
    v-if="!topbarPending && topbarConfig"
    :class="[
      'w-full shrink-0 flex items-center transition-all duration-500 z-50', /* ✨ Removido o 'relative' daqui */
      isGlass ? 'fixed top-0' : 'sticky top-0 shadow-sm border-b border-black/5 relative', /* ✨ O relative só entra se não for Glass */
      { 'border-b border-black/10 shadow-lg backdrop-blur-xl': isGlass && isScrolled }
    ]"
    :style="headerStyles"
  >
    <div :class="['flex w-full mx-auto transition-colors duration-500 py-1', topbarConfig.innerContentWidth]">
      
      <div 
        v-for="block in topbarConfig.blocks" 
        :key="block.id"
        :class="['flex-1 flex items-center', getAlignClass(block.align)]"
      >
        <component 
          :is="componentMap[block.componentName]"
          :is-glass="isGlass"
          :is-scrolled="isScrolled"
          :is-mobile-menu-open="isMobileMenuOpen"
          :is-dark="isDark"
          :topbar-config="topbarConfig"
          v-bind="block.props"
          @toggle-theme="toggleTheme"
          @toggle-menu="toggleMobileMenu"
          @close-menu="closeMobileMenu"
        />
      </div>

    </div>
  </header>
  
  <div 
    v-else 
    :class="[
      'w-full h-20 bg-gray-50/10 backdrop-blur-sm animate-pulse z-50',
      isGlass ? 'fixed top-0 left-0' : 'relative'
    ]"
  ></div>
</template>