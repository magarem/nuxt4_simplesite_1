<script setup>
import { ref, computed, resolveComponent, onMounted } from 'vue';

const route = useRoute();
const pageData = ref(null);
const pending = ref(true);
const error = ref(null);

// Resolve o caminho da pasta
const slugPath = computed(() => {
  const s = route.params.slug;
  if (!s || s.length === 0) return 'index';
  return Array.isArray(s) ? s.join('/') : s;
});

const fetchPageData = async () => {
  pending.value = true;
  const targetUrl = `/data/${slugPath.value}/_index.json`;
  console.log("🔍 Tentando buscar em:", targetUrl);

  try {
    // Usamos o $fetch (nativo do Nuxt/OhMyFetch) que é mais direto
    const response = await $fetch(targetUrl);
    console.log("✅ Sucesso! Dados recebidos:", response);
    pageData.value = response;
  } catch (err) {
    console.error("❌ Falha crítica no Fetch:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }
};

// Dispara a busca quando o componente monta no navegador
onMounted(() => {
  fetchPageData();
});

// Re-executa se a rota mudar (navegação entre páginas)
watch(() => route.fullPath, () => {
  fetchPageData();
});

const allBlocks = computed(() => pageData.value?.blocks || []);
const heroBlocks = computed(() => allBlocks.value.filter(b => b.isHero));
const contentBlocks = computed(() => allBlocks.value.filter(b => !b.isHero));

const getDynamicComponent = (name) => {
  if (!name) return null;
  const comp = resolveComponent(name);
  return typeof comp === 'string' ? null : comp;
};
</script>

<template>
  <div class="sirius-engine mt-9">
    <div v-if="pending" class="p-20 text-center">
      <p class="animate-pulse">Sincronizando com Sirius Data...</p>
    </div>

    <div v-else-if="error" class="p-20 text-center text-red-500">
      <h2 class="font-bold">Erro ao carregar pacote</h2>
      <p>{{ error.message }}</p>
      <code class="text-xs bg-black p-2 block mt-2">Caminho: /data/{{ slugPath }}/_index.json</code>
    </div>

   <div v-else-if="pageData" class="flex flex-col gap-16 md:gap-10 pb-24">
  
  <template v-for="block in allBlocks" :key="block.id">
     <component 
      :is="getDynamicComponent(block.componentName)" 
      v-bind="block.props"
      :id="block.id"
      :page-path="slugPath"
    />
  </template>
  
</div>
  </div>
</template>