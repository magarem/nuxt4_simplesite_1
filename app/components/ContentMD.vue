<script setup>
import { computed } from 'vue';
import { parse } from 'marked';
import matter from 'gray-matter';

const props = defineProps({
  /**
   * Caminho do ficheiro .md (ex: 'revolucao-sirius.md')
   */
  path: {
    type: String,
    required: true
  },
  /**
   * Largura do contentor (cw-0, cw-1, cw-2, cw-3)
   */
  contentWidth: {
    type: String,
    default: 'cw-1'
  },
  /**
   * Configurações de Layout e Estilo dinâmico
   */
  layout: {
    type: Object,
    default: () => ({
      title: { 
        show: true, 
        fontFamily: 'inherit', 
        fontSize: 'clamp(2.25rem, 2vw, 3.5rem)', 
        color: { light: 'var(--theme-heading-text, var(--theme-text))', dark: 'var(--theme-heading-text, var(--theme-text))' } 
      },
      maintext: { 
        fontFamily: 'inherit', 
        fontSize: '1.125rem', 
        color: { light: 'var(--theme-text)', dark: 'var(--theme-text)' } 
      },
      topimage: { width: '100%', height: 'clamp(250px, 40vh, 450px)' },
      sideimage: { width: '280px', height: 'auto' }
    })
  }
});

// ✨ FETCH DOS DADOS INTEGRADO ✨
const { data: apiResponse, pending, error } = await useFetch('/api/content', {
  query: { path: props.path },
  key: `content-${props.path}`
});

/**
 * ✨ MOTOR DE DADOS ✨
 */
const articleData = computed(() => {
  const serverData = apiResponse.value?.md_data;
  const serverContent = apiResponse.value?.md_content;
  const rawContent = apiResponse.value?.raw || '';
  
  const base = { metadata: {}, body: '', title: '', topImage: '', sideImages: [], author: '', date: '' };

  if (serverData) {
    return {
      metadata: serverData,
      body: (serverContent || '').trim(),
      title: serverData.title || '',
      topImage: serverData.topimage || serverData.topImage || '',
      sideImages: serverData.images || serverData.sideImages || [],
      author: serverData.author || '',
      date: serverData.date || ''
    };
  }

  if (!rawContent) return base;

  try {
    const { data, content } = matter(rawContent);
    return {
      metadata: data || {},
      body: (content || '').trim(),
      title: data?.title || '',
      topImage: data?.topimage || data?.topImage || '',
      sideImages: data?.images || data?.sideImages || [],
      author: data?.author || '',
      date: data?.date || ''
    };
  } catch (e) {
    return { ...base, body: rawContent };
  }
});

const renderedHtml = computed(() => {
  if (!articleData.value.body) return '';
  return parse(articleData.value.body);
});

const formattedDate = computed(() => {
  if (!articleData.value.date) return '';
  try {
    return new Date(articleData.value.date).toLocaleDateString('pt-PT', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  } catch (e) { return articleData.value.date; }
});

const resolveImg = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return path.startsWith('/') ? path : `/images/${path}`;
};

/**
 * ✨ ESTILOS DINÂMICOS (LAYOUT PROP) ✨
 * Mapeamos o objeto layout para variáveis CSS que serão usadas no style scoped
 */
const dynamicStyles = computed(() => {
  const l = props.layout;
  return {
    '--local-title-font': l.title?.fontFamily || 'inherit',
    '--local-title-size': l.title?.fontSize || 'clamp(2.25rem, 5vw, 3.5rem)',
    '--local-title-color-light': l.title?.color?.light || 'var(--theme-text)',
    '--local-title-color-dark': l.title?.color?.dark || 'var(--theme-text)',
    
    '--local-body-font': l.maintext?.fontFamily || 'inherit',
    '--local-body-size': l.maintext?.fontSize || '1.125rem',
    '--local-body-color-light': l.maintext?.color?.light || 'var(--theme-text)',
    '--local-body-color-dark': l.maintext?.color?.dark || 'var(--theme-text)',

    '--local-topimg-w': l.topimage?.width || '100%',
    '--local-topimg-h': l.topimage?.height || '400px',
    
    '--local-sideimg-w': l.sideimage?.width || '280px',
    '--local-sideimg-h': l.sideimage?.height || 'auto',
  };
});
</script>

<template>
  <div 
    :class="['content-component', contentWidth, { 'is-loading': pending }]"
    :style="dynamicStyles"
  >
    <!-- ESTADO: CARREGAMENTO -->
    <div v-if="pending" class="status-overlay">
      <i class="pi pi-spin pi-spinner text-4xl"></i>
    </div>

    <!-- ESTADO: ERRO -->
    <div v-else-if="error" class="error-box">
      <i class="pi pi-exclamation-circle text-3xl mb-4"></i>
      <h3 class="text-xl font-bold">Conteúdo Indisponível</h3>
      <p class="opacity-70">{{ path }}</p>
    </div>

    <!-- ESTADO: SUCESSO -->
    <template v-else>
      <!-- 1. TOPBAR (Título condicional pelo layout.title.show) -->
      <header v-if="layout.title?.show !== false && (articleData.title || articleData.author)" class="content-topbar">
        <div class="meta-row">
          <span v-if="articleData.author" class="author-tag">{{ articleData.author }}</span>
          <span v-if="articleData.author && articleData.date" class="meta-separator">•</span>
          <time v-if="articleData.date" class="date-tag">{{ formattedDate }}</time>
        </div>
        <h1 v-if="articleData.title" class="main-title">{{ articleData.title }}</h1>
        <div class="accent-line"></div>
      </header>

      <!-- 2. BANNER PRINCIPAL -->
      <figure v-if="articleData.topImage" class="main-banner">
        <img :src="resolveImg(articleData.topImage)" alt="Banner" />
      </figure>

      <!-- 3. LAYOUT EDITORIAL -->
      <main class="editorial-grid">
        <!-- COLUNA LATERAL -->
        <aside v-if="articleData.sideImages && articleData.sideImages.length > 0" class="side-column">
          <div class="sticky-images">
            <div v-for="(img, idx) in articleData.sideImages" :key="idx" class="side-img-card">
              <img :src="resolveImg(img)" alt="Side image" />
            </div>
          </div>
        </aside>

        <!-- COLUNA PRINCIPAL -->
        <article class="text-column">
          <div class="prose article-body" v-html="renderedHtml"></div>
        </article>
      </main>
    </template>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.content-component {
  --c-brand: var(--theme-brand, #d97706);
  --gap: 4rem;
  font-family: var(--local-body-font);
  color: var(--local-body-color-light);
  line-height: 1.8;
  padding-bottom: 5rem;
  transition: all 0.5s ease;
}

/* Suporte Dark Mode para as cores locais */
:global(.dark) .content-component {
  color: var(--local-body-color-dark);
}

/* 1. Topbar */
.content-topbar { margin-bottom: 2.5rem; text-align: left; }
.meta-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; }
.author-tag { color: var(--c-brand); }
.date-tag { opacity: 0.5; }
.meta-separator { opacity: 0.2; }

.main-title { 
  font-family: var(--local-title-font);
  font-size: var(--local-title-size); 
  color: var(--local-title-color-light);
  font-weight: 900; 
  line-height: 1.1; 
  letter-spacing: -0.04em; 
  transition: color 0.5s ease; 
}
:global(.dark) .main-title { color: var(--local-title-color-dark); }

.accent-line { width: 60px; height: 4px; background: var(--c-brand); margin-top: 1.5rem; border-radius: 4px; }

/* 2. Banner */
.main-banner { 
  width: var(--local-topimg-w); 
  height: var(--local-topimg-h); 
  border-radius: 1.5rem; 
  overflow: hidden; 
  margin-bottom: 4rem; 
  margin-inline: auto;
  box-shadow: var(--theme-shadow-base, 0 20px 25px -5px rgba(0, 0, 0, 0.05)); 
  border: 1px solid color-mix(in srgb, var(--theme-text) 5%, transparent); 
}
.main-banner img { width: 100%; height: 100%; object-fit: cover; }

/* 3. Grid */
.editorial-grid { display: flex; flex-direction: column; gap: 2.5rem; }
@media (min-width: 1024px) { .editorial-grid { flex-direction: row; gap: var(--gap); align-items: flex-start; } }

/* Sidebar */
.side-column { width: 100%; }
@media (min-width: 1024px) { 
  .side-column { width: var(--local-sideimg-w); shrink: 0; }
  .sticky-images { position: sticky; top: 6rem; } 
}

.side-img-card { 
  width: 100%;
  height: var(--local-sideimg-h);
  border-radius: 1.25rem; 
  overflow: hidden; 
  border: 1px solid color-mix(in srgb, var(--theme-text) 8%, transparent); 
  margin-bottom: 1.5rem;
  transition: transform 0.4s ease; 
}
.side-img-card img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Typography */
.text-column { flex: 1; min-width: 0; }
.article-body { 
  font-size: var(--local-body-size); 
  max-width: none; 
}

:deep(.prose) {
  --tw-prose-body: var(--local-body-color-light);
  --tw-prose-headings: var(--local-title-color-light);
  --tw-prose-links: var(--c-brand);
  --tw-prose-bold: var(--local-title-color-light);
  --tw-prose-hr: color-mix(in srgb, var(--theme-text) 10%, transparent);
}

:global(.dark) :deep(.prose) {
  --tw-prose-body: var(--local-body-color-dark);
  --tw-prose-headings: var(--local-title-color-dark);
  --tw-prose-bold: var(--local-title-color-dark);
}

:deep(h2), :deep(h3) { margin-top: 2.5rem; letter-spacing: -0.02em; font-weight: 800; }
:deep(p) { margin-bottom: 1.75rem; }
:deep(blockquote) { border-left: 4px solid var(--c-brand); background: color-mix(in srgb, var(--theme-text) 3%, transparent); padding: 1.5rem 2rem; font-style: italic; font-size: 1.25rem; margin: 3rem 0; border-radius: 0 1.25rem 1.25rem 0; opacity: 0.9; }

/* States */
.status-overlay { @apply flex justify-center py-20 text-3xl; color: var(--c-brand); }
.error-box { @apply text-center p-16 border-2 border-dashed rounded-[2rem] text-red-500; border-color: color-mix(in srgb, currentColor 20%, transparent); }
</style>