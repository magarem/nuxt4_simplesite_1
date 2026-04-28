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
    // 🧹 FAXINA: Agora usamos os nomes do nosso AppContainer: 'site', 'content' ou 'full'
    default: 'content' 
  },
  class: {
    type: String,
    default: ''
  }
});

// Lógica de bordas: Full-bleed no mobile, arredondado global no desktop
// 🧹 FAXINA: Usando a variável --radius-cartao do main.css
const borderLogic = computed(() => {
  if (props.contentWidth === 'full') return 'rounded-none';
  return 'rounded-none md:rounded-cartao';    
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
  <AppContainer :size="contentWidth" :class="['w-full', props.class]">
    
    <div 
      :class="[
        'flex flex-col md:flex-row gap-2 md:h-[65vh] overflow-hidden transition-all duration-500',
        borderLogic
      ]"
    >
      <div 
        class="w-full md:w-1/2 h-[45vh] md:h-full relative overflow-hidden group cursor-pointer"
        @click="openLightbox(0)"
      >
        <img 
          v-if="mainImage"
          :src="resolveImage(mainImage)" 
          alt="Main Banner" 
          class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300"></div>
        
        <div class="absolute bottom-6 left-6 bg-black/50 backdrop-blur-xl text-white text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-2xl">
          <i class="pi pi-search-plus mr-2"></i> Ver Galeria
        </div>
      </div>

      <div 
        v-if="gridImages.length" 
        class="w-full md:w-1/2 grid grid-cols-2 grid-rows-2 gap-2 h-[45vh] md:h-full"
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
            class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300"></div>
          
          <div 
            v-if="index === 3 && images.length > 5" 
            class="absolute inset-0 bg-primary/80 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-black transition-all group-hover:bg-primary"
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
          class="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center"
        >
          
          <div class="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-50">
            <div class="text-white/80 font-black tracking-widest text-xs bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
              {{ currentIndex + 1 }} / {{ images.length }}
            </div>
            
            <div class="flex items-center gap-4">
              <button 
                @click="toggleSlideshow" 
                class="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-primary text-white rounded-full transition-all active:scale-90"
              >
                <i :class="['pi text-xl', isPlaying ? 'pi-pause' : 'pi-play']"></i>
              </button>
              <button 
                @click="closeLightbox" 
                class="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-red-500 text-white rounded-full transition-all active:scale-90"
              >
                <i class="pi pi-times text-xl"></i>
              </button>
            </div>
          </div>

          <button 
            @click.stop="stopSlideshow(); prevImage()" 
            class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/20 text-white rounded-full transition-all hover:-translate-x-1 z-50 border border-white/10"
          >
            <i class="pi pi-chevron-left text-2xl"></i>
          </button>

          <div 
            class="w-full h-full flex items-center justify-center p-4 md:p-20"
            @click.self="closeLightbox"
          >
            <img 
              :src="resolveImage(images[currentIndex])" 
              class="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none animate-in zoom-in-95 duration-300"
              alt="Zoomed Gallery Image"
            />
          </div>

          <button 
            @click.stop="stopSlideshow(); nextImage()" 
            class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/20 text-white rounded-full transition-all hover:translate-x-1 z-50 border border-white/10"
          >
            <i class="pi pi-chevron-right text-2xl"></i>
          </button>

        </div>
      </Transition>
    </Teleport>
  </AppContainer>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>