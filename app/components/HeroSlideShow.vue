<template>
  <section class="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
    
    <div class="absolute inset-0 w-full h-full z-0">
      <TransitionGroup name="hero-fade">
        <div
          v-for="(slide, index) in normalizedSlides"
          v-show="currentSlide === index"
          :key="slide.url"
          class="absolute inset-0 w-full h-full"
        >
          <video
            v-if="slide.type === 'video'"
            :src="slide.url"
            autoplay
            muted
            loop
            playsinline
            class="w-full h-full object-cover"
          ></video>
          
          <img
            v-else
            :src="slide.url"
            alt="Hero Background"
            class="w-full h-full object-cover"
          />
        </div>
      </TransitionGroup>
    </div>

    <div class="absolute inset-0 bg-black/50 z-10 transition-opacity duration-1000"></div>

    <AppContainer 
      class="relative z-20 text-center text-white flex flex-col items-center gap-6 px-4 mt-10" 
      :size="heroData.contentWidth"
    >
      
      <span v-if="heroData.tag" class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/20 text-white border border-white/30 backdrop-blur-sm">
        <i v-if="heroData.tagIcon" :class="['pi', heroData.tagIcon]"></i> {{ heroData.tag }}
      </span>

      <h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter drop-shadow-lg leading-tight">
        {{ heroData.titlePrefix }}
        <span v-if="heroData.titleHighlight" class="text-primary drop-shadow-md">
          {{ heroData.titleHighlight }}
        </span>
      </h1>

      <p v-if="heroData.subtitle" class="text-lg md:text-xl lg:text-2xl font-medium max-w-[60ch] opacity-90 drop-shadow-md leading-relaxed">
        {{ heroData.subtitle }}
      </p>

      <div v-if="$slots.default" class="mt-6 flex flex-wrap justify-center gap-4">
        <slot />
      </div>

    </AppContainer>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 1. Recebe apenas o objeto 'config'
const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
});

// 2. Mescla os padrões com o que vem da prop
const heroData = computed(() => ({
  tag: 'Arquitetura JSON-Driven',
  tagIcon: 'pi-sparkles',
  titlePrefix: 'O Futuro do',
  titleHighlight: 'Web Design',
  subtitle: 'Faz scroll para baixo e descobre o nosso universo através das páginas principais.',
  contentWidth: 'content', // 🧹 FAXINA: O antigo 'cw-1' deu lugar a 'content' ou 'site'
  slides: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
    "/fundo.mp4", 
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop"
  ],
  slideDuration: 5000,
  ...props.config // Sobrescreve com os dados do CMS
}));

// 3. Normalizador (Imagens vs Vídeos)
const normalizedSlides = computed(() => {
  return heroData.value.slides.map(slide => {
    if (typeof slide === 'object' && slide !== null && slide.url) {
      return slide;
    }
    
    const isVideo = typeof slide === 'string' && slide.match(/\.(mp4|webm|ogg)$/i);
    
    return {
      type: isVideo ? 'video' : 'image',
      url: slide
    };
  });
});

// 4. Lógica do Loop
const currentSlide = ref(0);
let slideInterval = null;

onMounted(() => {
  if (normalizedSlides.value && normalizedSlides.value.length > 1) {
    slideInterval = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % normalizedSlides.value.length;
    }, heroData.value.slideDuration);
  }
});

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
});
</script>

<style scoped>
/* Transição perfeita e controlada exclusivamente pelo Vue */
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 1.5s ease-in-out;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}
</style>