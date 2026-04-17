<template>
  <!-- Secção subtil com linha de topo e fundo que se adapta ao texto do tema (Claro/Escuro) -->
  <section 
    class="w-full py-12 md:py-10 border-y overflow-hidden transition-colors duration-500"
    :style="{ 
      borderColor: 'color-mix(in srgb, var(--theme-text) 5%, transparent)', 
      backgroundColor: 'color-mix(in srgb, var(--theme-text) 2%, transparent)' 
    }"
  >
    <div :class="['flex flex-col items-center gap-8 w-full mx-auto', contentWidth]">
      
      <!-- ✨ Título Opcional ✨ -->
      <h3 
        v-if="title" 
        class="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-center px-4 transition-colors duration-500"
        :style="{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }"
      >
        {{ title }}
      </h3>

      <!-- ✨ Contentor do Marquee (Deslize Contínuo) ✨ -->
      <!-- A classe 'mask-edges' cria um esbatimento transparente nas laterais -->
      <div class="relative w-full flex overflow-hidden group mask-edges">
        
        <!-- Pista animada que faz o deslize (pausa no hover) -->
        <div class="flex items-center gap-16 md:gap-24 w-max animate-marquee group-hover:[animation-play-state:paused]">
          
          <!-- Lista 1: Logótipos Originais -->
          <div class="flex items-center gap-16 md:gap-24 min-w-max px-8">
            <template v-for="(logo, index) in displayLogos" :key="'orig-' + index">
              <!-- Se for imagem (Adicionado drop-shadow para garantir que logos pretos fiquem visíveis no modo escuro) -->
              <img 
                v-if="logo.type === 'image'" 
                :src="logo.src" 
                :alt="logo.alt || 'Logo de cliente'" 
                class="h-8 md:h-10 object-contain opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" 
              />
              <!-- Se for apenas texto tipográfico (Fallback elegante) -->
              <div 
                v-else 
                class="text-xl md:text-2xl font-black uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all duration-500 cursor-default"
                :style="{ color: 'var(--theme-text)' }"
              >
                {{ logo.name }}
              </div>
            </template>
          </div>

          <!-- Lista 2: Cópia Exata (Obrigatório para o loop infinito perfeito) -->
          <div class="flex items-center gap-16 md:gap-24 min-w-max px-8">
            <template v-for="(logo, index) in displayLogos" :key="'dup-' + index">
              <img 
                v-if="logo.type === 'image'" 
                :src="logo.src" 
                :alt="logo.alt || 'Logo de cliente'" 
                class="h-8 md:h-10 object-contain opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" 
              />
              <div 
                v-else 
                class="text-xl md:text-2xl font-black uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all duration-500 cursor-default"
                :style="{ color: 'var(--theme-text)' }"
              >
                {{ logo.name }}
              </div>
            </template>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // O título por cima dos logos
  title: {
    type: String,
    default: 'Empresas que confiam em nós'
  },
  // Largura do contentor
  contentWidth: {
    type: String,
    default: 'cw-1'
  },
  // Array de logos. Suporta imagens ou texto.
  logos: {
    type: Array,
    default: () => []
  }
});

// 🚀 DADOS DE EXEMPLO (Placeholder)
const fallbackLogos = [
  { type: 'text', name: 'Acme Corp' },
  { type: 'text', name: 'Globex' },
  { type: 'text', name: 'Soylent' },
  { type: 'text', name: 'Initech' },
  { type: 'text', name: 'Umbrella' },
  { type: 'text', name: 'Massive Dynamic' },
  { type: 'text', name: 'Cyberdyne' },
];

const displayLogos = computed(() => {
  return props.logos && props.logos.length > 0 ? props.logos : fallbackLogos;
});
</script>

<style scoped>
/* Efeito de fade/desvanecimento nas pontas. Funciona perfeitamente em modo claro/escuro porque usa transparência alfa pura */
.mask-edges {
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

/* Animação CSS nativa para deslize infinito e super fluido */
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 35s linear infinite;
  will-change: transform;
}
</style>