<template>
  <section class="w-full py-24 md:py-32 overflow-hidden relative">
    <!-- ✨ Fundo Dinâmico (Escuro no Modo Claro, Branco no Modo Escuro) ✨ -->
    <div class="absolute inset-0 bg-[var(--theme-text)] z-0 transition-colors duration-500"></div>

    <!-- ✨ Efeitos Visuais (Luzes baseadas na cor da marca) ✨ -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none mix-blend-screen">
      <div class="absolute -top-[30%] -right-[10%] w-[60%] h-[80%] bg-[var(--theme-brand)] rounded-full blur-[140px] transition-colors duration-500"></div>
      <div class="absolute -bottom-[30%] -left-[10%] w-[60%] h-[80%] bg-[var(--theme-brand)] rounded-full blur-[140px] transition-colors duration-500"></div>
    </div>

    <!-- ✨ Conteúdo Central ✨ -->
    <div :class="['relative z-10 flex flex-col items-center text-center px-4 mx-auto', contentWidth]">
      
      <!-- Título Impactante (Usa a cor de fundo atual para garantir contraste perfeito) -->
      <h2 
        class="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 drop-shadow-lg leading-[1.1] max-w-[15ch] transition-colors duration-500"
        :style="{ color: 'var(--theme-bg)' }"
      >
        {{ title }}
      </h2>

      <!-- Subtítulo / Descrição (Adaptado com color-mix) -->
      <p 
        v-if="subtitle" 
        class="text-lg md:text-xl max-w-[55ch] mb-12 font-medium leading-relaxed transition-colors duration-500"
        :style="{ color: 'color-mix(in srgb, var(--theme-bg) 80%, transparent)' }"
      >
        {{ subtitle }}
      </p>

      <!-- Botão de Ação Primária -->
      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <!-- O Hover do botão também inverte dinamicamente consoante o tema! -->
        <NuxtLink 
          :to="buttonLink" 
          class="inline-flex items-center justify-center px-10 py-5 bg-[var(--theme-brand)] text-white font-black text-sm uppercase tracking-[0.15em] rounded-2xl hover:scale-105 hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)] transition-all duration-300 shadow-[0_0_30px_rgba(217,119,6,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95 group"
          :style="{ borderRadius: 'var(--theme-radius-btn, 1rem)' }"
        >
          {{ buttonText }} <i class="pi pi-arrow-right ml-4 text-lg transition-transform group-hover:translate-x-2"></i>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Pronto para dar vida à tua ideia?'
  },
  subtitle: {
    type: String,
    default: 'Junta-te às marcas inovadoras que já transformaram a sua presença digital connosco. O teu próximo grande projeto começa agora.'
  },
  buttonText: {
    type: String,
    default: 'Iniciar Projeto'
  },
  buttonLink: {
    type: String,
    default: '/contact'
  },
  contentWidth: {
    type: String,
    default: 'cw-1'
  }
});
</script>