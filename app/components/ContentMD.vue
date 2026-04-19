<script setup>
import { computed } from 'vue';
import { parse } from 'marked';
import matter from 'gray-matter';

const props = defineProps({
  pagePath: String, // ex: 'about'
  fileName: String, // ex: 'textbox1.md'
  contentWidth: { type: String, default: 'cw-1' },
  layout: {
    type: Object,
    default: () => ({
      title: { show: true },
      maintext: { fontSize: '1.125rem' },
      topimage: { width: '100%', height: '400px' },
      sideimage: { width: '280px' }
    })
  }
});

// 1. Caminho Dinâmico para a API
const targetPath = computed(() => {
  if (!props.pagePath || !props.fileName) return null;
  // Junta a pasta e o arquivo para a API (ex: 'about/textbox1.md')
  return `${props.pagePath}/${props.fileName}`;
});

// ✨ 2. FETCH VIA API NITRO ✨
// O Nuxt vai transformar isso em: /api/content?path=about/textbox1.md
const { data: apiResponse, pending, error } = await useFetch('/api/content', {
  query: { path: targetPath },
  key: `api-content-${props.pagePath}-${props.fileName}`,
  server: false
});

/**
 * ✨ MOTOR DE PARSING HÍBRIDO ✨
 */
const articleData = computed(() => {
  const base = { title: '', body: '', topImage: '', author: '', date: '', sideImages: [] };
  
  if (!apiResponse.value) return base;

  // Cénario A: A sua API já dissecou o Markdown e enviou um JSON limpo
  if (apiResponse.value.md_data || apiResponse.value.metadata) {
    const meta = apiResponse.value.md_data || apiResponse.value.metadata;
    return {
      title: meta.title || '',
      body: apiResponse.value.md_content || apiResponse.value.body || '',
      topImage: meta.topImage || meta.topimage || '',
      author: meta.author || '',
      date: meta.date || '',
      sideImages: meta.images || meta.sideImages || []
    };
  }

  // Cénario B: A API enviou apenas o texto bruto (Raw Text)
  const rawText = typeof apiResponse.value === 'string' ? apiResponse.value : apiResponse.value.raw || '';
  if (!rawText) return base;

  try {
    const { data, content } = matter(rawText);
    return {
      title: data?.title || '',
      body: content || '',
      topImage: data?.topImage || data?.topimage || '',
      author: data?.author || '',
      date: data?.date || '',
      sideImages: data?.images || data?.sideImages || []
    };
  } catch (e) {
    console.warn("⚠️ Erro ao processar Frontmatter. Usando texto puro.");
    return { ...base, body: rawText };
  }
});

// Renderiza o Markdown para HTML
const renderedHtml = computed(() => {
  return articleData.value.body ? parse(articleData.value.body) : '';
});

// Mantém o prefixo /data/ para imagens locais da mesma pasta
const resolveImg = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return `/data/${props.pagePath}/${path}`;
};

// Formatação de Data
const formattedDate = computed(() => {
  if (!articleData.value.date) return '';
  return new Date(articleData.value.date).toLocaleDateString('pt-PT', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
});

/**
 * ✨ ESTILOS DINÂMICOS
 */
const dynamicStyles = computed(() => {
  const l = props.layout || {};
  return {
    '--local-title-size': l.title?.fontSize || 'clamp(2.25rem, 5vw, 3.5rem)',
    '--local-body-size': l.maintext?.fontSize || '1.125rem',
    '--local-topimg-h': l.topimage?.height || '400px',
    '--local-sideimg-w': l.sideimage?.width || '280px',
  };
});
</script>

<template>
  <div 
    :class="['content-component mx-auto', contentWidth]"
    :style="dynamicStyles"
  >
    <div v-if="pending" class="py-20 text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-amber-500"></i>
    </div>

    <div v-else-if="error" class="error-box p-10 border-2 border-dashed border-red-500/20 text-red-500 rounded-3xl text-center">
      <i class="pi pi-exclamation-circle text-3xl mb-2"></i>
      <p>Falha ao comunicar com a API: /api/content?path={{ targetPath }}</p>
    </div>

    <template v-else>
      <header v-if="layout.title?.show !== false && (articleData.title || articleData.author)" class="mb-10">
        <div class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest mb-4">
          <span v-if="articleData.author" class="text-amber-500">{{ articleData.author }}</span>
          <span v-if="articleData.date" class="opacity-40">{{ formattedDate }}</span>
        </div>
        <h1 v-if="articleData.title" class="text-[var(--local-title-size)] font-black leading-tight tracking-tighter">
          {{ articleData.title }}
        </h1>
        <div class="w-16 h-1 bg-amber-500 mt-6 rounded-full"></div>
      </header>

      <figure v-if="articleData.topImage" class="w-full mb-12 overflow-hidden rounded-[2rem] shadow-2xl border border-white/5">
        <img :src="resolveImg(articleData.topImage)" class="w-full h-[var(--local-topimg-h)] object-cover" />
      </figure>

      <div class="flex flex-col lg:flex-row gap-12 items-start">
        <aside v-if="articleData.sideImages?.length" class="w-full lg:w-[var(--local-sideimg-w)] shrink-0 sticky top-24">
          <div v-for="(img, idx) in articleData.sideImages" :key="idx" class="mb-4 rounded-2xl overflow-hidden border border-white/10">
            <img :src="resolveImg(img)" class="w-full h-auto" />
          </div>
        </aside>

        <article class="prose prose-invert max-w-none flex-1">
          <div v-html="renderedHtml" class="md-content"></div>
        </article>
      </div>
    </template>
  </div>
</template>

<style scoped>
.md-content :deep(p) {
  font-size: var(--local-body-size);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.md-content :deep(h2) {
  margin-top: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.md-content :deep(blockquote) {
  border-left: 4px solid #f59e0b;
  background: rgba(255, 255, 255, 0.03);
  padding: 2rem;
  font-style: italic;
  border-radius: 0 1rem 1rem 0;
}
</style>