<script setup>
import { computed } from 'vue';

const props = defineProps({
  isGlass: Boolean,
  isScrolled: Boolean,
  isMobileMenuOpen: Boolean,
  
  brandName: { type: String, default: 'MEU LOGO' },
  signature: { type: String, default: '' },
  variation: { type: String, default: 'signature' }, // 'text-only', 'icon-text', 'minimal', 'signature'
  
  // ✨ NOVAS PROPS DE PERSONALIZAÇÃO ✨
  fontFamily: { type: String, default: 'inherit' },
  fontSize: { type: String, default: '' }, // Ex: '2rem', 'clamp(1.5rem, 3vw, 2.5rem)'
  textColor: { type: String, default: '' }, // Ex: '#d97706', 'var(--theme-text)'
  textEffect: { type: String, default: 'gradient' } // 'none', 'gradient', 'glow', 'shadow'
});

const initialLetter = computed(() => props.brandName.charAt(0).toUpperCase());

const forceWhiteText = computed(() => {
  return props.isGlass && !props.isScrolled && !props.isMobileMenuOpen;
});

// ✨ LÓGICA DE ESTILOS INLINE (Tipografia, Tamanho e Cor) ✨
const customStyles = computed(() => {
  const styles = {};
  
  // 1. Aplica a Família de Fonte (se fornecida)
  if (props.fontFamily && props.fontFamily !== 'inherit') {
    styles.fontFamily = `"${props.fontFamily}", sans-serif`;
  }
  
  // 2. Aplica o Tamanho (se não houver, o Tailwind lida com isso)
  if (props.fontSize) {
    styles.fontSize = props.fontSize;
  }

  // 3. Aplica a Cor Customizada (Mas APENAS se o efeito não for gradiente e o Glass não estiver a forçar Branco)
  if (props.textColor && props.textEffect !== 'gradient' && !forceWhiteText.value) {
    styles.color = props.textColor;
  } else if (forceWhiteText.value) {
    styles.color = 'white';
  }

  return styles;
});

// ✨ LÓGICA DE EFEITOS VISUAIS (Tailwind Classes) ✨
const effectClasses = computed(() => {
  if (forceWhiteText.value) {
    return 'drop-shadow-lg'; // Efeito padrão para leitura em fundos escuros no modo Glass
  }

  switch (props.textEffect) {
    case 'gradient':
      return 'bg-clip-text text-transparent bg-gradient-to-r from-[var(--theme-text)] to-[var(--theme-brand)]';
    case 'glow':
      // Um brilho sofisticado à volta da letra usando a cor da marca
      return 'drop-shadow-[0_0_12px_var(--theme-brand)] text-[var(--theme-text)]';
    case 'shadow':
      // Uma sombra premium clássica
      return 'drop-shadow-xl text-[var(--theme-text)]';
    case 'none':
    default:
      return 'text-[var(--theme-text)]';
  }
});
</script>

<template>
  <NuxtLink 
    to="/" 
    class="flex items-center gap-3 relative z-50 hover:opacity-80 transition-all duration-300 group" 
  >
    
    <div 
      v-if="variation === 'icon-text' || variation === 'minimal'"
      class="flex items-center justify-center w-10 h-10 rounded-xl font-black text-xl shadow-md transition-all duration-500 group-hover:scale-105"
      :class="forceWhiteText ? 'bg-white text-black' : 'bg-[var(--theme-brand)] text-white'"
    >
      {{ initialLetter }}
    </div>

    <div 
      v-if="variation !== 'minimal'"
      class="flex flex-col items-start justify-center"
    >
      <span 
        class="font-bold leading-none tracking-tight transition-all duration-500"
        :class="[
          !fontSize ? 'text-2xl md:text-3xl' : '', // Fallback de tamanho se não for customizado
          effectClasses // Injeta o Gradiente, Glow ou Shadow
        ]"
        :style="customStyles"
      >
        {{ brandName }}
      </span>
      
      <span 
        v-if="variation === 'signature' && signature"
        class="text-[0.6rem] md:text-xs font-medium tracking-[0.3em] uppercase mt-1 opacity-70 transition-colors duration-500"
        :class="forceWhiteText ? 'text-white' : 'text-[var(--theme-brand)]'"
        style="font-family: 'Inter', sans-serif;"
      >
        {{ signature }}
      </span>
    </div>

  </NuxtLink>
</template>