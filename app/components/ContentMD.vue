<script setup>
import { computed, watch } from "vue";
import { marked } from "marked";
import { useRoute } from "vue-router";

const route = useRoute();
const previewCookie = useCookie("preview_layer");

const props = defineProps({
  pagePath: String,
  fileName: String,
  // 🧹 FAXINA: Atualizado de 'cw-1' para 'w-full', deixando a responsabilidade da largura máxima para o AppContainer pai
  contentWidth: { type: String, default: "w-full" },
  layout: {
    type: Object,
    default: () => ({
      title: { show: true },
      topimage: { width: "100%", height: "500px" },
      sideimage: { width: "280px" },
    }),
  },
});

const targetPath = computed(() => {
  if (!props.pagePath || !props.fileName) return "";
  return `${props.pagePath}/${props.fileName}`;
});

const {
  data: apiResponse,
  pending,
  error,
  refresh,
} = await useAsyncData(
  `md-${props.pagePath}-${props.fileName}-${route.query.version || previewCookie.value || "base"}`,
  () =>
    $fetch("/api/content", {
      query: {
        path: targetPath.value,
        t: Date.now(),
        version: route.query.version || previewCookie.value,
      },
    }),
  { server: true, lazy: false },
);

watch(targetPath, () => refresh());

const articleData = computed(() => {
  const base = {
    title: "",
    body: "",
    topImage: "",
    author: "",
    date: "",
    sideImages: [],
  };
  if (!apiResponse.value || typeof apiResponse.value !== "object") return base;

  const meta = apiResponse.value.md_data || {};
  return {
    title: meta.title || "",
    body: apiResponse.value.md_content || "",
    topImage: meta.topImage || meta.topimage || "",
    author: meta.author || "",
    date: meta.date || "",
    sideImages: meta.images || meta.sideImages || [],
  };
});

const renderedHtml = computed(() => {
  try {
    return articleData.value.body ? marked.parse(articleData.value.body) : "";
  } catch (e) {
    console.error("Erro ao converter Markdown para HTML:", e);
    return "<p>Erro ao formatar o texto.</p>";
  }
});

const resolveImg = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `/data/${props.pagePath}/${path}`;
};

const formattedDate = computed(() => {
  if (!articleData.value.date) return "";
  try {
    return new Date(articleData.value.date).toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return articleData.value.date;
  }
});

const dynamicStyles = computed(() => {
  const l = props.layout || {};
  return {
    "--local-topimg-h": l.topimage?.height || "500px",
    "--local-sideimg-w": l.sideimage?.width || "280px",
  };
});
</script>
<template>
  <div class="flex flex-col lg:flex-row gap-16 items-start">
    <aside
      v-if="articleData.sideImages?.length"
      class="w-full lg:w-[var(--local-sideimg-w)] shrink-0 sticky top-32"
    >
      <div
        v-for="(img, idx) in articleData.sideImages"
        :key="idx"
        class="mb-8 rounded-cartao overflow-hidden border border-border transition-all duration-500 shadow-lg hover:shadow-2xl"
      >
        <img :src="resolveImg(img)" alt="" class="w-full h-auto object-cover" />
      </div>
    </aside>

    <article
      class="md-content w-full flex-1 transition-colors duration-500 max-w-copy mx-auto"
    >
      <div v-html="renderedHtml" class="[&>*:first-child]:mt-0"></div>
    </article>
  </div>
</template>

<style scoped>
/* 🧹 O seu CSS Limpo e Objetivo! As imagens do Markdown vão herdar a variável do main.css perfeitamente. */
.md-content :deep(img) {
  border-radius: 1.5rem; /* Se quiser, pode usar var(--radius-cartao) aqui também para máxima sincronia! */
  margin: 3rem 0;
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
</style>
