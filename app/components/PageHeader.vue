<template>
  <!-- Padding vertical reduzido (py-4 md:py-6) para um formato mais compacto (Low Profile) -->
  <section :class="['flex flex-col relative w-full py-4 md:py-0', alignmentClass, contentWidth]">
    
    <!-- ✨ LOW PROFILE TAG (Simples, sem linhas, texto menor) ✨ -->
    <div v-if="tag" class="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--theme-brand)] mb-2 opacity-80">
      <i v-if="tagIcon" :class="[tagIcon, 'text-sm']"></i> 
      {{ tag }}
    </div>

    <!-- ✨ TÍTULO PRINCIPAL ✨ -->
    <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-snug text-[var(--theme-heading-text,var(--theme-text))] mb-2">
      {{ title }} 
      <span v-if="highlight" class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-brand)] to-amber-500">
        {{ highlight }}
      </span>
    </h1>

    <!-- ✨ SUBTÍTULO ✨ -->
    <p v-if="subtitle" class="text-sm md:text-base font-normal opacity-60 max-w-[65ch] leading-relaxed">
     22 {{ subtitle }}
    </p>

    <!-- ✨ SLOT EXTRA ✨ -->
    <div v-if="$slots.default" class="mt-4 md:mt-5 w-full flex" :class="slotAlignmentClass">
      <slot />
    </div>
    
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { 
    type: String, 
    required: true 
  },
  highlight: { 
    type: String, 
    default: '' 
  },
  subtitle: { 
    type: String, 
    default: '' 
  },
  tag: { 
    type: String, 
    default: '' 
  },
  tagIcon: { 
    type: String, 
    default: '' 
  },
  contentWidth: { 
    type: String, 
    default: 'cw-1' 
  },
  /**
   * ✨ PROP DE ALINHAMENTO ✨
   * Define se o texto e os elementos estão à esquerda, centro ou direita.
   * Valores: 'left', 'center', 'right'
   */
  BoxAlign: { 
    type: String, 
    default: 'left' 
  }
});

// Computada inteligente para lidar com o alinhamento do Flexbox e Texto
const alignmentClass = computed(() => {
  if (props.BoxAlign === 'left') return 'text-left items-start';
  if (props.BoxAlign === 'right') return 'text-right items-end';
  return 'text-center items-center mx-auto'; // Fallback para centro
});

// Garante que qualquer elemento injetado no <slot /> (como botões) herde o alinhamento
const slotAlignmentClass = computed(() => {
  if (props.BoxAlign === 'left') return 'justify-start';
  if (props.BoxAlign === 'right') return 'justify-end';
  return 'justify-center';
});
</script>