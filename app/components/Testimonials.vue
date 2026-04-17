<template>
  <section class="py-16 md:py-14 flex flex-col gap-16 md:gap-12">
    
    <PageHeader
      tag="O que dizem sobre nós"
      tagIcon="pi pi-star-fill"
      :title="title"
      highlight="Sirius Studio"
      :subtitle="subtitle"
    />

    <div :class="['flex flex-col gap-12 mx-auto', contentWidth]">
      
      <!-- ✨ Grelha de Testemunhos ✨ -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Cartão Adaptável ao Dark Mode -->
        <div 
          v-for="(review, index) in displayReviews" 
          :key="index" 
          class="flex flex-col h-full relative z-0 overflow-hidden group p-6 md:p-8 rounded-[var(--theme-radius-card,1rem)] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:!border-[var(--theme-brand)]"
          :style="{ 
            backgroundColor: 'color-mix(in srgb, var(--theme-text) 2%, transparent)', 
            borderColor: 'color-mix(in srgb, var(--theme-text) 8%, transparent)' 
          }"
        >
          
          <!-- Ícone de aspas decorativo (Fica gigante e semi-transparente no fundo) -->
          <i class="pi pi-quote-right absolute -bottom-4 -right-4 text-9xl opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 z-[-1] text-[var(--theme-brand)] pointer-events-none"></i>
          
          <!-- Avaliação (Estrelas) -->
          <div class="flex gap-1 text-amber-400 mb-6">
            <i v-for="star in review.rating || 5" :key="star" class="pi pi-star-fill text-sm drop-shadow-sm"></i>
          </div>
          
          <!-- Texto do Testemunho -->
          <p class="text-base md:text-lg italic opacity-90 mb-8 flex-1 leading-relaxed transition-colors duration-300">
            "{{ review.text }}"
          </p>
          
          <!-- Perfil do Cliente (Rodapé do cartão) -->
          <!-- Borda superior também atualizada com color-mix para adaptar ao Dark Mode -->
          <div 
            class="flex items-center gap-4 mt-auto pt-6 border-t transition-colors duration-300"
            :style="{ borderColor: 'color-mix(in srgb, var(--theme-text) 8%, transparent)' }"
          >
            <div class="relative">
              <img :src="review.avatar" :alt="review.name" class="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-[var(--theme-brand)] transition-colors duration-300 shadow-sm" />
              <!-- Pequeno ícone de verificação (Trust badge) -->
              <div class="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                <i class="pi pi-check text-[8px] font-bold"></i>
              </div>
            </div>
            
            <div class="flex flex-col">
              <span class="font-bold text-sm transition-colors duration-300" :style="{ color: 'var(--theme-heading-text, var(--theme-text))' }">{{ review.name }}</span>
              <span class="text-xs opacity-60 font-medium transition-colors duration-300">{{ review.role }}</span>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Histórias de Sucesso'
  },
  subtitle: {
    type: String,
    default: 'Descobre como ajudámos marcas ambiciosas a escalar e a transformar a sua presença digital de forma impactante.'
  },
  contentWidth: {
    type: String,
    default: 'cw-1'
  },
  reviews: {
    type: Array,
    default: () => []
  }
});

// 🚀 DADOS DE EXEMPLO (Placeholder Premium)
// Renderizados automaticamente se não passares a prop 'reviews'
const fallbackReviews = [
  {
    text: "A arquitetura JSON-driven revolucionou completamente a forma como gerimos o nosso site. A equipa da Sirius Studio entregou um produto incrivelmente rápido e flexível. O design é de outro nível.",
    name: "Catarina Mendes",
    role: "Diretora de Marketing @ Inovatech",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    rating: 5
  },
  {
    text: "Desde o momento em que lançámos a nova plataforma, as nossas taxas de conversão aumentaram 40%. A atenção ao detalhe e a performance extrema em Nuxt 4 fizeram toda a diferença no nosso funil.",
    name: "Ricardo Silva",
    role: "CEO @ E-Commerce Global",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    rating: 5
  },
  {
    text: "O visualizador interativo do portefólio que desenvolveram para nós deixou os nossos clientes deslumbrados. A experiência de utilizador é fluida, polida e reflete perfeitamente a identidade da nossa marca.",
    name: "Joana Alves",
    role: "Creative Director @ Studio XYZ",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    rating: 5
  }
];

const displayReviews = computed(() => {
  return props.reviews && props.reviews.length > 0 ? props.reviews : fallbackReviews;
});
</script>