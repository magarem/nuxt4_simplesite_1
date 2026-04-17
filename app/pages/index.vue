<template>
    
    <HeroSlideShow />

    <SocialProof title="Empresas de topo escolhem a Sirius" />

    <div class="py-16 md:py-14 flex flex-col gap-16 md:gap-12">
      <QuickNavigation />
      <Testimonials />
      <CallToAction />
    </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import HeroSlideShow from "~/components/HeroSlideShow.vue";
import QuickNavigation from "~/components/QuickNavigation.vue";

// Dizemos ao Nuxt para não usar o "default", mas sim o nosso layout de vidro!
definePageMeta({
  layout: "topbar-glass",
});

// Array com as imagens do nosso Slideshow
const heroImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop",
];

const currentSlide = ref(0);
let slideInterval = null;

onMounted(() => {
  // Muda a imagem a cada 5 segundos (5000ms)
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % heroImages.length;
  }, 5000);
});

onUnmounted(() => {
  // Limpa o intervalo quando saímos da página para poupar memória
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
