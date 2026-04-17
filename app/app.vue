<template>
  <!-- O app.vue agora é apenas o ponto de entrada limpo -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// O app.vue continua a ser o sítio perfeito para injetar o nosso CSS Dinâmico 
// porque ele roda logo no início e nunca é desmontado!

// ✨ ATUALIZAÇÃO: Como o ficheiro agora está dentro de 'app/', voltamos a usar o atalho principal ~/
import themeConfig from '~/config/theme.json';

const theme = computed(() => themeConfig);

// 🚀 A MÁGICA: Mapeamos o JSON para variáveis CSS Nativas
const dynamicThemeStyles = computed(() => {
  const g = theme.value.global;
  
  const themeVars = {
    // Variáveis Originais
    '--theme-outside-bg': g.colors?.outsideBackground,
    '--theme-bg': g.colors?.background,
    '--theme-text': g.colors?.text,
    '--theme-brand': g.colors?.brand,
    '--theme-font': g.typography?.fontFamily,
    '--theme-base-size': g.typography?.baseSize,
    '--theme-padding': g.layout?.mobileMargin,

    // ✨ NOVAS VARIÁVEIS DO DESIGN SYSTEM AVANÇADO ✨
    '--theme-radius-btn': g.design?.radius?.buttons,
    '--theme-radius-card': g.design?.radius?.cards,
    '--theme-font-heading': g.design?.fonts?.headings,
    '--theme-heading-text': g.design?.colors?.headingText,
    '--theme-gradient-end': g.design?.colors?.gradientEnd,
    '--theme-shadow-base': g.design?.shadows?.base,
    '--theme-shadow-hover': g.design?.shadows?.hover,

    // Limites Dinâmicos
    ...(g.layout?.contentWidth_0 && { '--theme-cw-0': g.layout.contentWidth_0 }),
    ...(g.layout?.contentWidth_1 && { '--theme-cw-1': g.layout.contentWidth_1 }),
    ...(g.layout?.contentWidth_2 && { '--theme-cw-2': g.layout.contentWidth_2 }),
    ...(g.layout?.contentWidth_3 && { '--theme-cw-3': g.layout.contentWidth_3 }),
  };

  const cssRules = Object.entries(themeVars)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');

  return `:root { ${cssRules} }`;
});

useHead({
  style: [
    { id: 'sirius-dynamic-theme', innerHTML: dynamicThemeStyles }
  ]
});
</script>