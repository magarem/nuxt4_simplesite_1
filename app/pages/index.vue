<template>
  <div>
    
    <div v-if="pending" class="flex items-center justify-center min-h-[50vh] p-20">
      <span class="animate-pulse tracking-widest uppercase text-lg md:text-xl font-medium text-text-muted">
        Carregando layout...
      </span>
    </div>

    <div v-else-if="error" class="text-center py-24 text-red-500 flex flex-col items-center gap-4">
      <i class="pi pi-exclamation-triangle text-4xl"></i>
      <p class="text-lg">Erro ao carregar os dados da página.</p>
      <button @click="refresh" class="text-sm underline opacity-70 hover:opacity-100 transition-opacity">
        Tentar novamente
      </button>
    </div>

    <div v-else class="w-full">
      
      <section id="hero-zone" class="w-full">
        <template v-for="(block, index) in heroBlocks" :key="'hero-' + index">
          <component 
            v-if="getDynamicComponent(block.componentName)" 
            :is="getDynamicComponent(block.componentName)" 
            v-bind="block.props" 
          />
          <div v-else class="p-6 my-4 mx-auto max-w-2xl bg-red-500/10 text-red-500 rounded-cartao border border-red-500/20 text-center">
            ⚠️ Componente Hero <strong>{{ block.componentName }}</strong> não foi encontrado. Verifique o nome exato no JSON e na pasta components.
          </div>
        </template>
      </section>

      <main id="content-zone" class="w-full py-16 md:py-20 px-5 transition-colors duration-500">
        
        <AppContainer size="content" class="flex flex-col gap-16 md:gap-15">
          <template v-for="(block, index) in contentBlocks" :key="'content-' + index">
            <div class="w-full">
              <component 
                v-if="getDynamicComponent(block.componentName)" 
                :is="getDynamicComponent(block.componentName)" 
                v-bind="block.props" 
              />
              <div v-else class="p-6 my-4 mx-auto w-full bg-red-500/10 text-red-500 rounded-cartao border border-red-500/20 text-center">
                ⚠️ Componente de Conteúdo <strong>{{ block.componentName }}</strong> não foi encontrado. Verifique o nome exato no JSON e na pasta components.
              </div>
            </div>
          </template>
        </AppContainer>

      </main>

    </div>
  </div>
</template>

<script setup>
import { computed, resolveComponent, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const previewCookie = useCookie('preview_layer');

// Usa o layout transparente definido anteriormente
definePageMeta({
  layout: "topbar-glass",
});

// ✨ CARREGAMENTO BLINDADO VIA CMS
const { 
  data: response, 
  pending, 
  error, 
  refresh 
} = await useAsyncData(
  `home-page-data-${route.query.version || previewCookie.value || 'base'}`,
  () => $fetch('/api/content', {
    query: { 
      path: 'home', 
      node: 'data', 
      t: Date.now(),
      version: route.query.version || previewCookie.value 
    }
  }),
  { server: true, lazy: false }
);

// Atualiza a página automaticamente se a versão do preview no URL mudar
watch(() => route.query.version, () => {
  refresh();
});

// ✨ EXTRATOR DE DADOS SEGURO
const allBlocks = computed(() => {
  const rawData = response.value || {};
  return Array.isArray(rawData) ? rawData : (rawData.blocks || []);
});

// ✨ SEPARAÇÃO EM ZONAS (Hero vs Conteúdo)
const heroBlocks = computed(() => {
  return allBlocks.value.filter(block => block.isHero === true || block.isHero === 'true');
});

const contentBlocks = computed(() => {
  return allBlocks.value.filter(block => !block.isHero || block.isHero === 'false');
});

// ✨ RESOLUÇÃO DO COMPONENTE COM SEGURANÇA
const getDynamicComponent = (name) => {
  if (!name) return null;
  const comp = resolveComponent(name);
  return typeof comp === 'string' ? null : comp;
}
</script>