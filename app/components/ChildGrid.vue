<script setup>
import { computed } from 'vue';

const props = defineProps({
  parentPath: {
    type: String,
    required: true,
  },
  cWidth: {
    type: String,
    // 🧹 FAXINA: Substituímos 'cw-1' por 'w-full' para deixar o AppContainer fluir
    default: 'w-full' 
  }
});

const { data: nodeData, pending, error } = await useFetch('/api/tree', {
  query: { path: props.parentPath },
  key: `grid-${props.parentPath}`
});

const filteredChildren = computed(() => {
  if (!nodeData.value || !nodeData.value.children) return [];
  return nodeData.value.children.filter(child => child.type === 'folder');
});
</script>

<template>
  <section class="sirius-grid-section w-full transition-colors duration-500 mb-20" :class="cWidth">
    
    <div v-if="pending" class="sirius-grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="sirius-loading-card animate-pulse bg-bg-muted rounded-cartao h-72 border border-border"></div>
    </div>

    <div v-else-if="error" class="sirius-error-state p-10 text-center border border-red-500/20 bg-red-500/5 rounded-cartao text-red-500">
      <i class="pi pi-exclamation-triangle text-3xl mb-3"></i>
      <p>Erro ao carregar os itens desta secção.</p>
    </div>

    <div 
      v-else-if="filteredChildren.length > 0" 
      class="sirius-grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <NuxtLink 
        v-for="child in filteredChildren" 
        :key="child.path" 
        :to="child.path"
        class="sirius-grid-card group flex flex-col bg-bg-muted border border-border rounded-cartao overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
      >
        <div class="sirius-card-image-wrap aspect-[4/3] w-full overflow-hidden bg-text-main/5 relative border-b border-border">
          
          <img 
            v-if="child.metadata.image" 
            :src="child.metadata.image" 
            :alt="child.title"
            class="sirius-card-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div v-else class="sirius-card-image-placeholder w-full h-full flex items-center justify-center text-text-muted">
            <i class="pi pi-image text-5xl opacity-50"></i>
          </div>
          
          <div class="sirius-card-tag absolute top-3 right-3 bg-bg-base/80 backdrop-blur-md px-3 py-1 rounded-full border border-border text-[10px] font-bold text-text-main uppercase tracking-widest">
            {{ child.metadata.tag || 'Ver Mais' }}
          </div>
        </div>

        <div class="sirius-card-content p-6 flex-1 flex flex-col">
          <h3 class="sirius-card-title text-xl font-black font-sans text-text-main mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {{ child.metadata.title }}
          </h3>
          <p class="sirius-card-desc text-text-muted text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
            {{ child.description || '' }}
          </p>
          
          <div class="sirius-card-cta mt-auto flex items-center text-primary text-sm font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
            Ler mais <i class="pi pi-arrow-right ml-2 text-xs"></i>
          </div>
        </div>
      </NuxtLink>
    </div>

    <div v-else class="sirius-empty-state p-20 text-center text-text-muted uppercase text-sm font-bold tracking-widest border border-border rounded-cartao bg-bg-muted">
      Nenhum projeto ou serviço encontrado nesta secção.
    </div>

  </section>
</template>

<style scoped>
/* 🧹 TODO O CSS DO FORMULÁRIO FOI APAGADO! 
   O componente agora está leve, rápido e herda 100% da identidade do main.css */
</style>