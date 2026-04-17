<template>
  <section class="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
    
    <!-- ✨ Slideshow de Imagens ✨ -->
    <div class="absolute inset-0 w-full h-full z-0">
      <TransitionGroup name="hero-fade">
        <img
          v-for="(img, index) in images"
          v-show="currentSlide === index"
          :key="img"
          :src="img"
          alt="Hero Background"
          class="absolute inset-0 w-full h-full object-cover"
        />
      </TransitionGroup>
    </div>

    <!-- Overlay Escuro para garantir que o texto fique legível -->
    <div class="absolute inset-0 bg-black/50 z-10 transition-opacity duration-1000"></div>

    <!-- Conteúdo Central do Hero -->
    <div class="relative z-20 text-center text-white flex flex-col items-center gap-6 px-4 mt-10" :class="contentWidth">
      
      <!-- Tag Opcional -->
      <span v-if="tag" class="sirius-tag !bg-white/20 !text-white border border-white/30 backdrop-blur-sm">
        <i v-if="tagIcon" :class="['pi', tagIcon]"></i> {{ tag }}
      </span>

      <!-- Título Impactante -->
      <h1 class="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-lg">
        {{ titlePrefix }}
        <span v-if="titleHighlight" class="text-[var(--theme-brand)] drop-shadow-md">
          {{ titleHighlight }}
        </span>
      </h1>

      <!-- Subtítulo -->
      <p v-if="subtitle" class="text-lg md:text-xl font-medium max-w-[60ch] opacity-90 drop-shadow-md leading-relaxed">
        {{ subtitle }}
      </p>

      <!-- Slot para injetar botões dinamicamente (se necessário) -->
      <div v-if="$slots.default" class="mt-4 flex gap-4">
        <slot />
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  // Textos
  tag: { type: String, default: 'Arquitetura JSON-Driven' },
  tagIcon: { type: String, default: 'pi-sparkles' },
  titlePrefix: { type: String, default: 'O Futuro do' },
  titleHighlight: { type: String, default: 'Web Design' },
  subtitle: { type: String, default: 'Faz scroll para baixo e descobre o nosso universo através das páginas principais.' },
  
  // Largura do texto
  contentWidth: { type: String, default: 'cw-1' },
  
  // Imagens do Slideshow
  images: {
    type: Array,
    default: () => [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  
  // Configuração (em milissegundos)
  slideDuration: { type: Number, default: 5000 }
});

const currentSlide = ref(0);
let slideInterval = null;

onMounted(() => {
  // Apenas inicia o intervalo se houver mais de 1 imagem
  if (props.images && props.images.length > 1) {
    slideInterval = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % props.images.length;
    }, props.slideDuration);
  }
});

onUnmounted(() => {
  // Limpa o intervalo para libertar memória quando o utilizador sai da página
  if (slideInterval) {
    clearInterval(slideInterval);
  }
});
</script>

<style scoped>
/* Animação CSS premium para a transição suave entre imagens */
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 1.5s ease-in-out;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}
</style>