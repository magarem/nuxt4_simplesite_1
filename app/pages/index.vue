<template>
  <div>
    <div v-if="pending" class="flex justify-center p-20">
      <span class="animate-pulse text-slate-400 font-medium">Carregando layout...</span>
    </div>

    <div v-else-if="error" class="text-center py-24 text-red-500">
      <p>Erro ao carregar os dados da página.</p>
    </div>

    <div v-else class="w-full">
      
      <template v-for="(block, index) in heroBlocks" :key="'hero-' + index">
        <component 
          v-if="getDynamicComponent(block.componentName)" 
          :is="getDynamicComponent(block.componentName)" 
          v-bind="block.props" 
        />
        <div v-else class="p-6 border-2 border-dashed border-red-300 bg-red-50 text-red-600 rounded-2xl text-center font-medium w-full max-w-2xl mx-auto my-10">
          ⚠️ Componente Hero <strong>{{ block.componentName }}</strong> não foi encontrado. Verifique o nome exato no JSON e na pasta components.
        </div>
      </template>

      <main class="py-16 md:py-14 flex flex-col gap-16 md:gap-12">
        <template v-for="(block, index) in contentBlocks" :key="'content-' + index">
          <component 
            v-if="getDynamicComponent(block.componentName)" 
            :is="getDynamicComponent(block.componentName)" 
            v-bind="block.props" 
          />
          <div v-else class="p-6 border-2 border-dashed border-red-300 bg-red-50 text-red-600 rounded-2xl text-center font-medium w-full max-w-2xl mx-auto">
            ⚠️ Componente de Conteúdo <strong>{{ block.componentName }}</strong> não foi encontrado. Verifique o nome exato no JSON e na pasta components.
          </div>
        </template>
      </main>

    </div>
  </div>
</template>

<script setup>
import { computed, resolveComponent } from 'vue';

definePageMeta({
  layout: "topbar-glass",
});

// 1. Fetch blindado forçando o lado do cliente para contornar bloqueios locais
const { data: response, pending, error } = await useFetch('/data/index/_index.json', {
  server: false, 
  key: 'home-page-data' 
});

// 2. Extrator de Dados Seguro (inspirado na sua referência)
const allBlocks = computed(() => {
  // Captura o payload bruto, lidando com diferentes formatos de resposta
  const rawData = response.value?.data || response.value || {};
  
  // Verifica se é um array direto ou se está dentro da chave 'blocks'
  const list = Array.isArray(rawData) ? rawData : (rawData.blocks || []);
  
  return list;
});

// 3. Separação em Zonas (Baseado na flag isHero do JSON)
const heroBlocks = computed(() => {
  return allBlocks.value.filter(block => block.isHero === true || block.isHero === 'true');
});

const contentBlocks = computed(() => {
  return allBlocks.value.filter(block => !block.isHero || block.isHero === 'false');
});

// 4. ✨ A Função de Ouro: Resolve o Componente com Segurança ✨
const getDynamicComponent = (name) => {
  if (!name) return null;
  const comp = resolveComponent(name);
  // Se o Nuxt retornar uma string, significa que ele não achou o componente real!
  return typeof comp === 'string' ? null : comp;
}
</script>