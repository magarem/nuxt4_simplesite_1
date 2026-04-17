<template>
  <header
    :class="[
      'w-full shrink-0 flex items-center transition-all duration-500 z-50',
      isGlass ? 'fixed top-0' : 'sticky top-0 shadow-sm border-b border-black/5',
      { 'border-b border-black/10 shadow-lg backdrop-blur-xl': isGlass && isScrolled }
    ]"
    :style="headerStyles"
  >
    <!-- Conteúdo Interno -->
    <div :class="['flex justify-between items-center w-full mx-auto transition-colors duration-500 py-1', theme.components.topbar.innerContentWidth]">
      
      <!-- ✨ Logo Premium ✨ -->
      <NuxtLink to="/" class="font-black text-2xl md:text-3xl tracking-tighter hover:scale-[1.02] transition-transform duration-300 flex items-center gap-2 relative z-50" :class="{'drop-shadow-lg text-white': isGlass && !isScrolled && !isMobileMenuOpen}">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-[var(--theme-text)] to-[var(--theme-brand)]" :style="(isGlass && !isScrolled && !isMobileMenuOpen) ? { color: 'white', background: 'none' } : {}">
          MEU LOGO
        </span>
      </NuxtLink>
      
      <!-- ✨ Navegação Desktop Premium ✨ -->
      <nav class="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide" :class="{'drop-shadow-md text-white': isGlass && !isScrolled}">
        <NuxtLink to="/" class="relative py-2 group">
          <span class="group-hover:text-[var(--theme-brand)] transition-colors duration-300">Início</span>
          <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--theme-brand)] transition-all duration-300 group-hover:w-full rounded-full"></span>
        </NuxtLink>
        <NuxtLink to="/about" class="relative py-2 group">
          <span class="group-hover:text-[var(--theme-brand)] transition-colors duration-300">Sobre Nós</span>
          <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--theme-brand)] transition-all duration-300 group-hover:w-full rounded-full"></span>
        </NuxtLink>
        <NuxtLink to="/services" class="relative py-2 group">
          <span class="group-hover:text-[var(--theme-brand)] transition-colors duration-300">Serviços</span>
          <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--theme-brand)] transition-all duration-300 group-hover:w-full rounded-full"></span>
        </NuxtLink>
        <NuxtLink to="/contact" class="relative py-2 group">
          <span class="group-hover:text-[var(--theme-brand)] transition-colors duration-300">Contactos</span>
          <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--theme-brand)] transition-all duration-300 group-hover:w-full rounded-full"></span>
        </NuxtLink>

        <!-- ✨ NOVO: Botão Light/Dark Mode (Desktop) ✨ -->
        <button 
          @click="toggleTheme" 
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/10 transition-all hover:scale-110 active:scale-95" 
          title="Mudar Tema"
        >
          <i :class="['pi text-lg transition-transform duration-500', isDark ? 'pi-sun rotate-180 text-amber-300' : 'pi-moon']"></i>
        </button>

        <!-- Botão CTA (Call to Action) Integrado -->
        <button class="ml-2 px-5 py-2.5 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] font-bold text-xs uppercase tracking-wider hover:bg-[var(--theme-brand)] hover:text-white hover:scale-105 transition-all duration-300 shadow-md">
          Começar
        </button>
      </nav>

      <!-- ✨ Ações Mobile (Botão Tema + Hamburger) ✨ -->
      <div class="md:hidden flex items-center gap-2 relative z-50" :class="{'text-white': isGlass && !isScrolled && !isMobileMenuOpen}">
        
        <!-- ✨ NOVO: Botão Light/Dark Mode (Mobile) ✨ -->
        <button 
          @click="toggleTheme" 
          class="w-12 h-12 flex items-center justify-center rounded-full hover:bg-black/10 active:scale-95 transition-all duration-300" 
          aria-label="Mudar Tema"
        >
          <i :class="['pi text-xl transition-transform duration-500', isDark ? 'pi-sun rotate-180 text-amber-300' : 'pi-moon']"></i>
        </button>

        <button 
          class="flex items-center justify-center w-12 h-12 rounded-full hover:bg-black/10 active:scale-95 transition-all duration-300"
          @click="toggleMobileMenu"
          :aria-label="isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'"
        >
          <i :class="['pi text-2xl transition-transform duration-500', isMobileMenuOpen ? 'pi-times rotate-90' : 'pi-bars']"></i>
        </button>
      </div>
    </div>

    <!-- ✨ Menu Dropdown Mobile Refinado ✨ -->
    <Transition name="mobile-menu">
      <div 
        v-if="isMobileMenuOpen" 
        class="md:hidden absolute top-full left-0 w-full flex flex-col items-center py-6 shadow-2xl border-b border-black/5 backdrop-blur-xl"
        :style="{ 
          backgroundColor: isDark ? 'var(--theme-bg)' : theme.components.topbar.backgroundColor,
          color: isDark ? 'var(--theme-text)' : theme.components.topbar.textColor 
        }"
      >
        <nav class="flex flex-col w-full px-6 gap-2">
          <NuxtLink to="/" class="flex items-center justify-between w-full p-4 rounded-xl font-bold text-lg hover:bg-black/5 hover:text-[var(--theme-brand)] transition-all duration-300 group" @click="closeMobileMenu">
            <span>Início</span>
            <i class="pi pi-arrow-right opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm"></i>
          </NuxtLink>
          <NuxtLink to="/about" class="flex items-center justify-between w-full p-4 rounded-xl font-bold text-lg hover:bg-black/5 hover:text-[var(--theme-brand)] transition-all duration-300 group" @click="closeMobileMenu">
            <span>Sobre Nós</span>
            <i class="pi pi-arrow-right opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm"></i>
          </NuxtLink>
          <NuxtLink to="/services" class="flex items-center justify-between w-full p-4 rounded-xl font-bold text-lg hover:bg-black/5 hover:text-[var(--theme-brand)] transition-all duration-300 group" @click="closeMobileMenu">
            <span>Serviços</span>
            <i class="pi pi-arrow-right opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm"></i>
          </NuxtLink>
          <NuxtLink to="/contact" class="flex items-center justify-between w-full p-4 rounded-xl font-bold text-lg hover:bg-black/5 hover:text-[var(--theme-brand)] transition-all duration-300 group" @click="closeMobileMenu">
            <span>Contactos</span>
            <i class="pi pi-arrow-right opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm"></i>
          </NuxtLink>

          <!-- Divisor e CTA Mobile -->
          <div class="mt-4 pt-4 border-t border-black/5 w-full">
            <button class="w-full px-6 py-4 rounded-xl bg-[var(--theme-brand)] text-white font-bold text-sm uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95">
              Começar Projeto <i class="pi pi-sparkles"></i>
            </button>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import themeConfig from '~/config/theme.json';

const props = defineProps({
  isGlass: {
    type: Boolean,
    default: false
  }
});

const theme = computed(() => themeConfig);
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

// ✨ ESTADO DO TEMA (Claro / Escuro)
const isDark = ref(false);

// Isolamos a lógica de aplicar o tema numa função para ser reutilizada
const applyTheme = () => {
  const g = theme.value.global;
  if (isDark.value) {
    document.documentElement.style.setProperty('--theme-bg', g.colors.text); // Fundo vira texto (Preto)
    document.documentElement.style.setProperty('--theme-text', g.colors.background); // Texto vira fundo (Branco)
  } else {
    document.documentElement.style.removeProperty('--theme-bg'); // Volta ao normal
    document.documentElement.style.removeProperty('--theme-text');
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  // Guarda a preferência na memória do navegador
  localStorage.setItem('sirius-dark-mode', isDark.value.toString());
  applyTheme();
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleResize = () => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

const handleScroll = () => {
  if (props.isGlass) {
    isScrolled.value = window.scrollY > 50;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  if (props.isGlass) {
    window.addEventListener('scroll', handleScroll);
  }

  // ✨ RECUPERAÇÃO DO TEMA ✨
  // Verifica se o utilizador já tinha ativado o modo escuro anteriormente e aplica automaticamente
  const savedTheme = localStorage.getItem('sirius-dark-mode');
  if (savedTheme === 'true') {
    isDark.value = true;
    applyTheme();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (props.isGlass) {
    window.removeEventListener('scroll', handleScroll);
  }
});

// Calcula as cores e posições da Topbar em tempo real
const headerStyles = computed(() => {
  // A Topbar adapta-se ao modo escuro em sincronia com o resto da página
  const baseBg = isDark.value ? 'var(--theme-bg)' : theme.value.components.topbar.backgroundColor;
  const baseText = isDark.value ? 'var(--theme-text)' : theme.value.components.topbar.textColor;

  const base = {
    height: theme.value.components.topbar.height,
    backgroundColor: baseBg,
    color: baseText,
  };

  // Se for o layout Glass, injeta lógica extra
  if (props.isGlass) {
    const forceSolidBg = isMobileMenuOpen.value;
    
    return {
      ...base,
      backgroundColor: (isScrolled.value || forceSolidBg) ? baseBg : 'transparent',
      color: (isScrolled.value || forceSolidBg) ? baseText : '#ffffff',
      /* Truque para não quebrar a caixa cw-0 */
      maxWidth: 'var(--theme-cw-0, 100%)',
      left: '50%',
      transform: 'translateX(-50%)'
    };
  }

  return base;
});
</script>

<style scoped>
/* Animação fluida avançada para o menu mobile */
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