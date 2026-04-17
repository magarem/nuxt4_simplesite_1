<template>
  <section :class="['py-0 w-full', contentWidth]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <UiCard
        v-for="(link, index) in displayLinks"
        :key="index"
        content-padding="p-8"
        class="hover:-translate-y-2"
      >
        <!-- ✨ Usamos o default slot do UiCard para alinhar tudo ao centro ✨ -->
        <div class="flex flex-col items-center text-center gap-5 h-full relative">
          
          <!-- Link invisível que cobre o cartão inteiro -->
          <NuxtLink :to="link.to" class="absolute inset-0 z-10" :aria-label="link.title"></NuxtLink>

          <!-- Ícone do Cartão -->
          <div class="w-16 h-16 shrink-0 rounded-2xl bg-[var(--theme-brand)]/10 text-[var(--theme-brand)] flex items-center justify-center text-2xl transition-all duration-300 group-hover:bg-[var(--theme-brand)] group-hover:text-white group-hover:-translate-y-2 group-hover:shadow-lg">
            <i :class="['pi', link.icon]"></i>
          </div>
          
          <!-- Título e Descrição -->
          <div>
            <h3 class="font-bold text-2xl mb-2 transition-colors" :style="{ color: 'var(--theme-heading-text, var(--theme-text))' }">
              {{ link.title }}
            </h3>
            <p class="text-sm opacity-80 leading-relaxed transition-colors" :style="{ color: 'var(--theme-text)' }">
              {{ link.description }}
            </p>
          </div>
          
          <!-- Call to Action -->
          <span class="text-[var(--theme-brand)] font-bold text-sm tracking-wider uppercase mt-auto group-hover:underline relative z-20">
            {{ link.ctaText }} &rarr;
          </span>
        </div>
      </UiCard>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import UiCard from '~/components/ui/Card.vue';

const props = defineProps({
  // Define a largura do contentor
  contentWidth: {
    type: String,
    default: 'cw-1'
  },
  // Array de objetos com os links (Opcional, pois temos um fallback)
  links: {
    type: Array,
    default: () => []
  }
});

// ✨ DADOS DE EXEMPLO (Fallback Padrão)
// Se chamares apenas <QuickNavigation /> sem props, ele renderiza isto:
const defaultLinks = [
  {
    to: '/about',
    icon: 'pi-users',
    title: 'Quem Somos',
    description: 'Conhece a nossa história, a nossa visão e a fantástica equipa por trás da magia.',
    ctaText: 'Ler Mais'
  },
  {
    to: '/services',
    icon: 'pi-briefcase',
    title: 'Serviços',
    description: 'Explora o nosso portefólio interativo e descobre as soluções exclusivas que oferecemos.',
    ctaText: 'Ver Trabalhos'
  },
  {
    to: '/contact',
    icon: 'pi-envelope',
    title: 'Contacto',
    description: 'Tens um projeto inovador em mente? Fala connosco e vamos construir algo incrível.',
    ctaText: 'Falar Connosco'
  }
];

// Computada que decide se usa os links fornecidos ou os originais
const displayLinks = computed(() => {
  return props.links && props.links.length > 0 ? props.links : defaultLinks;
});
</script>