<script setup>
import { computed, resolveComponent } from 'vue';
import { useRoute } from 'vue-router';
// Importação explícita do PageHeader para garantir que a build não falhe
import PageHeader from '~/components/PageHeader.vue';

const route = useRoute();
const previewCookie = useCookie('preview_layer');

// 1. Caminho limpo dinâmico
const targetUrl = computed(() => {
  const s = route.params.slug;
  if (!s || s.length === 0) return '';
  return Array.isArray(s) ? s.join('/') : s;
});

// ✨ 2. Extração segura (Pending e Error)
const { data: pageData, pending, error, refresh } = await useAsyncData(
  `content-${route.path}-${route.query.version || previewCookie.value || 'v1'}`, 
  () => $fetch('/api/content', {
    query: { 
      path: targetUrl.value, 
      node: 'data',
      version: route.query.version || previewCookie.value 
    }
  }),
  {
    watch: [() => route.path, () => route.query.version]
  }
);

// 3. Extrator de Blocos Seguro
const allBlocks = computed(() => pageData.value?.blocks || []);

// 4. Resolve o Componente com Segurança
const getDynamicComponent = (name) => {
  if (!name) return null;
  const comp = resolveComponent(name);
  return typeof comp === 'string' ? null : comp;
};
</script>

<template>
  <div class="w-full transition-colors duration-500">
  
    <div v-if="pending" class="flex items-center justify-center min-h-[50vh] p-20">
      <span class="animate-pulse tracking-widest uppercase text-lg font-medium text-text-muted">
        Sincronizando com Sirius Data...
      </span>
    </div>

    <div v-else-if="error" class="text-center py-24 text-red-500 flex flex-col items-center gap-4">
      <i class="pi pi-exclamation-triangle text-4xl"></i>
      <h2 class="text-xl font-bold">Erro ao carregar pacote</h2>
      <p class="text-text-muted">{{ error.message }}</p>
      
      <code class="text-xs bg-bg-muted text-text-muted p-3 rounded-lg block mt-2 border border-border">
        Caminho falhado: /data/{{ targetUrl }}/_index.json
      </code>
      
      <button @click="refresh" class="text-sm underline opacity-70 hover:opacity-100 transition-opacity mt-4 text-text-main">
        Tentar novamente
      </button>
    </div>

    <AppContainer v-else-if="pageData" size="content" class="mt-10">
      
      <PageHeader v-if="pageData.title" :title="pageData.title" />

      <main class="flex flex-col gap-16 md:gap-15 py-10 md:py-5">
        <template v-for="block in allBlocks" :key="block.id">
          
          <component 
            v-if="getDynamicComponent(block.componentName)"
            :is="getDynamicComponent(block.componentName)" 
            v-bind="block.props"
            :id="block.id"
            :page-path="targetUrl" 
          />
          
          <div v-else class="p-6 my-4 mx-auto max-w-2xl bg-red-500/10 text-red-500 rounded-cartao border border-red-500/20 text-center w-full">
            ⚠️ Componente Dinâmico <strong>{{ block.componentName }}</strong> não foi encontrado.
          </div>
          
        </template>
      </main>

    </AppContainer>

  </div>
</template>