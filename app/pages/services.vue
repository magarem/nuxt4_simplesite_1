<template>
  <div class="py-16 md:py-24 flex flex-col gap-16 md:gap-12">
    
    <!-- Cabeçalho da Página -->
    <PageHeader
      tag="Portefólio Visual"
      tagIcon="pi pi-briefcase"
      title="Os Nossos"
      highlight="Serviços"
      subtitle="Clica em qualquer cartão para abrires o visualizador de alta resolução e explorares o nosso trabalho ao detalhe."
    />

    <!-- ✨ CONTEÚDO PRINCIPAL: Grelha com o novo UiCard ✨ -->
    <section class="cw-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <!-- Chamada ao componente UiCard atualizado -->
      <UiCard
        v-for="(service, index) in services"
        :key="index"
        :title="service.title"
        :description="service.description"
        content-padding="p-6 md:p-8"
        class="!cursor-pointer h-full"
        @click="openModal(index)"
      >
        <!-- Injeção da Imagem no slot de topo do UiCard -->
        <template #image>
          <div class="w-full h-64 md:h-72 overflow-hidden relative bg-black/5 shrink-0 border-b border-black/5">
            <!-- Overlay escuro no Hover com Ícone de Lupa -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center text-white">
              <i class="pi pi-search-plus text-4xl transform scale-50 group-hover:scale-100 transition-transform duration-300"></i>
            </div>
            <!-- Imagem de fundo com scale no hover -->
            <img
              :src="service.image"
              :alt="service.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0"
            />
          </div>
        </template>
      </UiCard>

    </section>

    <!-- ✨ MODAL E SLIDESHOW (Ecrã Inteiro) ✨ -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg"
        >
          <!-- Barra de Topo do Modal -->
          <div class="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 text-white">
            <div class="flex items-center gap-6">
              <span class="text-sm font-bold opacity-70 uppercase tracking-widest">
                {{ currentIndex + 1 }} / {{ services.length }}
              </span>
              <button @click.stop="toggleSlideshow" class="flex items-center gap-2 hover:text-[var(--theme-brand)] transition-colors">
                <i :class="isSlideshowRunning ? 'pi pi-pause' : 'pi pi-play'"></i>
                <span class="text-sm font-bold uppercase tracking-wider">{{ isSlideshowRunning ? "Pausar" : "Slideshow" }}</span>
              </button>
            </div>

            <button @click.stop="closeModal" class="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--theme-brand)] transition-colors">
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>

          <!-- Controlos de Navegação (Esquerda/Direita) -->
          <button @click.stop="prevImage" class="absolute left-4 md:left-10 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--theme-brand)] hover:scale-110 transition-all text-white backdrop-blur-md">
            <i class="pi pi-chevron-left text-2xl"></i>
          </button>
          <button @click.stop="nextImage" class="absolute right-4 md:right-10 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--theme-brand)] hover:scale-110 transition-all text-white backdrop-blur-md">
            <i class="pi pi-chevron-right text-2xl"></i>
          </button>

          <!-- Imagem e Texto Central do Modal -->
          <div class="w-full h-full p-4 md:p-24 flex flex-col items-center justify-center relative cursor-auto" @click.self="closeModal">
            <Transition name="slide-fade" mode="out-in">
              <img
                :key="currentIndex"
                :src="currentService.image"
                :alt="currentService.title"
                class="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />
            </Transition>

            <div class="mt-8 text-center text-white max-w-2xl">
              <h3 class="text-3xl font-black mb-2">{{ currentService.title }}</h3>
              <p class="text-lg opacity-80">{{ currentService.description }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";
import UiCard from "~/components/ui/Card.vue";

// Define o layout
definePageMeta({
  layout: "default",
});

// 🚀 BASE DE DADOS SIMULADA
const services = ref([
  {
    title: "Arquitetura de Marcas",
    description: "Desenvolvimento de identidades visuais completas, desde o logótipo até aos brand guidelines, tudo estruturado para escalar.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Design UI/UX Avançado",
    description: "Interfaces focadas na conversão do utilizador, aliadas a experiências fluidas e sistemas de design modulares em Vue 3.",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Fotografia de Produto",
    description: "Imagens de alta resolução e direção de arte meticulosa para fazer os teus produtos brilharem no digital e na impressão.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Desenvolvimento Nuxt 4",
    description: "Arquiteturas Jamstack ultra-rápidas e otimizadas para SEO, com motores CSS geridos a 100% por variáveis JSON.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Estratégia Digital",
    description: "Consultoria dedicada ao crescimento do teu negócio através de análise de dados, funis de conversão e automações.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Produção 3D & Animação",
    description: "Trazemos ideias impossíveis à vida através de modelação tridimensional e animação fluida para WebGL.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  },
]);

// 🚀 ESTADO DO MODAL & SLIDESHOW
const isModalOpen = ref(false);
const currentIndex = ref(0);
const isSlideshowRunning = ref(false);
let slideshowTimer = null;

// Computada para saber qual o serviço a mostrar no modal
const currentService = computed(() => services.value[currentIndex.value]);

// Ações do Modal
const openModal = (index) => {
  currentIndex.value = index;
  isModalOpen.value = true;
  // Bloqueia o scroll da página enquanto o modal está aberto
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = "";
  stopSlideshow(); 
};

const nextImage = () => {
  if (currentIndex.value < services.value.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0; 
  }
};

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = services.value.length - 1; 
  }
};

// Lógica do Slideshow
const startSlideshow = () => {
  isSlideshowRunning.value = true;
  slideshowTimer = setInterval(() => {
    nextImage();
  }, 3500); 
};

const stopSlideshow = () => {
  isSlideshowRunning.value = false;
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }
};

const toggleSlideshow = () => {
  if (isSlideshowRunning.value) {
    stopSlideshow();
  } else {
    startSlideshow();
  }
};

// Segurança: Garantir que o temporizador é limpo se o componente for destruído
onUnmounted(() => {
  stopSlideshow();
  document.body.style.overflow = ""; 
});
</script>

<style scoped>
/* Animações CSS para o Vue Transition do Modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animação para a troca de imagem fluida no modal */
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from {
  transform: translateX(20px) scale(0.98);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-20px) scale(0.98);
  opacity: 0;
}
</style>