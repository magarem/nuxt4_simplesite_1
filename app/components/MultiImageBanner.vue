<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
    validator: (value) => value.length > 0
  },
  contentWidth: {
    type: String,
    default: 'cw-1'
  },
  class: {
    type: String,
    default: ''
  }
});

// ==========================================
// ✨ TRUQUE JIT: LARGURAS RESPONSIVAS ✨
// ==========================================
const safelistWidths = {
  'cw-0': 'cw-0',
  'cw-1': 'cw-0 md:cw-1',
  'cw-2': 'cw-0 md:cw-2',
  'cw-3': 'cw-0 md:cw-3',
  'full': 'w-full'
};

// Lógica de bordas: Full-bleed no mobile, arredondado no desktop (se não for cw-0 ou full)
const borderLogic = computed(() => {
  if (props.contentWidth === 'cw-0' || props.contentWidth === 'full') {
    return 'rounded-none 2xl:rounded-2xl'; 
  }
  return 'rounded-none md:rounded-2xl';    
});

const mainImage = computed(() => props.images[0]);
const gridImages = computed(() => props.images.slice(1, 5));

const resolveImage = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('global:')) return `/data/_global/image/${path.replace('global:', '')}`;
  if (path.startsWith('/')) return path;
  return `/data/${path}`; 
};

// ==========================================
// ✨ LÓGICA DO LIGHTBOX & SLIDESHOW ✨
// ==========================================
const isLightboxOpen = ref(false);
const currentIndex = ref(0);
const isPlaying = ref(false);
let slideshowInterval = null;

const openLightbox = (index) => {
  currentIndex.value = index;
  isLightboxOpen.value = true;
  document.body.style.overflow = 'hidden'; 
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
  stopSlideshow();
  document.body.style.overflow = ''; 
};

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
};

const toggleSlideshow = () => {
  if (isPlaying.value) stopSlideshow();
  else startSlideshow();
};

const startSlideshow = () => {
  isPlaying.value = true;
  slideshowInterval = setInterval(nextImage, 3000);
};

const stopSlideshow = () => {
  isPlaying.value = false;
  if (slideshowInterval) clearInterval(slideshowInterval);
};

// Navegação por teclado
const handleKeydown = (e) => {
  if (!isLightboxOpen.value) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') { stopSlideshow(); nextImage(); }
  if (e.key === 'ArrowLeft') { stopSlideshow(); prevImage(); }
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  stopSlideshow(); 
});
</script>

<template>
  <div :class="['w-full', safelistWidths[contentWidth] || safelistWidths['cw-1'], props.class]">
    
    <div 
      :class="[
        'flex flex-col md:flex-row gap-2 md:h-[60vh] overflow-hidden',
        borderLogic
      ]"
    >
      
      <div 
        class="w-full md:w-1/2 h-[40vh] md:h-full relative overflow-hidden group cursor-pointer"
        @click="openLightbox(0)"
      >
        <img 
          v-if="mainImage"
          :src="resolveImage(mainImage)" 
          alt="Main Banner" 
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
        <div class="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <i class="pi pi-search-plus mr-2"></i> Ver Galeria
        </div>
      </div>

      <div 
        v-if="gridImages.length" 
        class="w-full md:w-1/2 grid grid-cols-2 grid-rows-2 gap-2 h-[40vh] md:h-full"
      >
        <div 
          v-for="(img, index) in gridImages" 
          :key="index"
          class="relative overflow-hidden group cursor-pointer"
          @click="openLightbox(index + 1)"
        >
          <img 
            :src="resolveImage(img)" 
            :alt="`Gallery Image ${index + 1}`" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
          
          <div 
            v-if="index === 3 && images.length > 5" 
            class="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold transition-colors group-hover:bg-black/50"
          >
            +{{ images.length - 5 }}
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="isLightboxOpen" 
          class="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center"
        >
          
          <div class="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-50">
            <div class="text-white/60 font-medium tracking-widest text-sm bg-black/40 px-4 py-1.5 rounded-full">
              {{ currentIndex + 1 }} / {{ images.length }}
            </div>
            
            <div class="flex items-center gap-4">
              <button 
                @click="toggleSlideshow" 
                class="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                :title="isPlaying ? 'Pausar Slideshow' : 'Iniciar Slideshow'"
              >
                <i :class="['pi text-xl', isPlaying ? 'pi-pause' : 'pi-play']"></i>
              </button>
              <button 
                @click="closeLightbox" 
                class="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-red-500/80 text-white rounded-full transition-colors"
                title="Fechar (Esc)"
              >
                <i class="pi pi-times text-xl"></i>
              </button>
            </div>
          </div>

          <button 
            @click.stop="stopSlideshow(); prevImage()" 
            class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-white/30 text-white rounded-full transition-all hover:-translate-x-1 z-50"
          >
            <i class="pi pi-chevron-left text-2xl"></i>
          </button>

          <div 
            class="w-full h-full flex items-center justify-center p-4 md:p-20"
            @click.self="closeLightbox"
          >
            <img 
              :src="resolveImage(images[currentIndex])" 
              class="max-w-full max-h-full object-contain drop-shadow-2xl select-none"
              alt="Zoomed Gallery Image"
            />
          </div>

          <button 
            @click.stop="stopSlideshow(); nextImage()" 
            class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-white/30 text-white rounded-full transition-all hover:translate-x-1 z-50"
          >
            <i class="pi pi-chevron-right text-2xl"></i>
          </button>

        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Animação suave para abrir/fechar o Lightbox */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>