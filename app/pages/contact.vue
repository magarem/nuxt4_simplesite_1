<template>
  <div class="py-16 md:py-14 flex flex-col gap-16 md:gap-12">
    
    <!-- ✨ 1. CABEÇALHO DA PÁGINA ✨ -->
    <PageHeader
      tag="Só chamar"
      tagIcon="pi pi-envelope"
      title="Fale "
      highlight="Conosco"
      subtitle="Tens um projeto em mente ou uma dúvida técnica? Preenche o formulário abaixo ou usa os nossos canais diretos para chegares até nós."
    />

    <!-- ✨ 2. CONTEÚDO (INFORMAÇÕES E FORMULÁRIO) ✨ -->
    <section class="cw-1 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
      
      <!-- Lado Esquerdo: Cartões de Informação (Horizontal Layout via Slot) -->
      <div class="flex flex-col gap-6 lg:col-span-1">
        
        <UiCard content-padding="p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 shrink-0 rounded-xl bg-[var(--theme-brand)]/10 text-[var(--theme-brand)] flex items-center justify-center text-xl transition-colors group-hover:bg-[var(--theme-brand)] group-hover:text-white">
              <i class="pi pi-map-marker"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg mb-1 transition-colors" :style="{ color: 'var(--theme-heading-text, var(--theme-text))' }">Localização</h3>
              <p class="text-sm opacity-80 leading-relaxed transition-colors" :style="{ color: 'var(--theme-text)' }">
                Avenida da Liberdade, 110<br/>1250-146 Lisboa, Portugal
              </p>
            </div>
          </div>
        </UiCard>

        <UiCard content-padding="p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 shrink-0 rounded-xl bg-[var(--theme-brand)]/10 text-[var(--theme-brand)] flex items-center justify-center text-xl transition-colors group-hover:bg-[var(--theme-brand)] group-hover:text-white">
              <i class="pi pi-phone"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg mb-1 transition-colors" :style="{ color: 'var(--theme-heading-text, var(--theme-text))' }">Telefone</h3>
              <p class="text-sm opacity-80 leading-relaxed transition-colors" :style="{ color: 'var(--theme-text)' }">
                +351 210 000 000<br/>Seg - Sex, 9h às 18h
              </p>
            </div>
          </div>
        </UiCard>

        <UiCard content-padding="p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 shrink-0 rounded-xl bg-[var(--theme-brand)]/10 text-[var(--theme-brand)] flex items-center justify-center text-xl transition-colors group-hover:bg-[var(--theme-brand)] group-hover:text-white">
              <i class="pi pi-envelope"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg mb-1 transition-colors" :style="{ color: 'var(--theme-heading-text, var(--theme-text))' }">Email</h3>
              <p class="text-sm opacity-80 leading-relaxed transition-colors" :style="{ color: 'var(--theme-text)' }">
                ola@siriusstudio.pt<br/>Suporte técnico 24/7
              </p>
            </div>
          </div>
        </UiCard>

      </div>

      <!-- Lado Direito: Formulário de Contacto (Envolvido num UiCard gigante) -->
      <UiCard class="lg:col-span-2 relative overflow-hidden" content-padding="p-8 md:p-10">
        
        <h2 class="text-2xl font-bold mb-2 transition-colors duration-300" :style="{ color: 'var(--theme-heading-text, var(--theme-text))' }">
          Envia-nos uma mensagem
        </h2>
        
        <!-- Mensagem de Sucesso (Fundo dinâmico para Dark Mode) -->
        <Transition name="fade">
          <div 
            v-if="isSubmitted" 
            class="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-xl text-center p-8 rounded-2xl transition-colors duration-300"
            :style="{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 90%, transparent)' }"
          >
            <div class="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg border border-green-500/20">
              <i class="pi pi-check"></i>
            </div>
            <h3 class="text-3xl font-black mb-2" :style="{ color: 'var(--theme-heading-text, var(--theme-text))' }">Mensagem Recebida!</h3>
            <p class="text-base opacity-80 max-w-md transition-colors" :style="{ color: 'var(--theme-text)' }">
              Obrigado pelo teu contacto. A nossa equipa vai analisar a tua mensagem e responderemos num prazo máximo de 24 horas.
            </p>
            <button @click="isSubmitted = false" class="sirius-btn-secondary mt-8 !px-8">Enviar nova mensagem</button>
          </div>
        </Transition>

        <!-- O Formulário -->
        <form @submit.prevent="submitForm" class="flex flex-col gap-6 relative z-10 mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label for="name" class="font-bold opacity-80 uppercase tracking-wider text-[10px]" :style="{ color: 'var(--theme-text)' }">Nome Completo</label>
              <input type="text" id="name" required 
                class="border border-transparent focus:border-[var(--theme-brand)] rounded-xl p-4 outline-none transition-all w-full bg-[color-mix(in_srgb,var(--theme-text)_5%,transparent)] focus:bg-[var(--theme-bg)] shadow-inner" 
                :style="{ color: 'var(--theme-text)' }" 
                placeholder="O teu nome" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="email" class="font-bold opacity-80 uppercase tracking-wider text-[10px]" :style="{ color: 'var(--theme-text)' }">Email</label>
              <input type="email" id="email" required 
                class="border border-transparent focus:border-[var(--theme-brand)] rounded-xl p-4 outline-none transition-all w-full bg-[color-mix(in_srgb,var(--theme-text)_5%,transparent)] focus:bg-[var(--theme-bg)] shadow-inner" 
                :style="{ color: 'var(--theme-text)' }" 
                placeholder="O teu melhor email" />
            </div>
          </div>
          
          <div class="flex flex-col gap-2">
            <label for="subject" class="font-bold opacity-80 uppercase tracking-wider text-[10px]" :style="{ color: 'var(--theme-text)' }">Assunto</label>
            <input type="text" id="subject" required 
              class="border border-transparent focus:border-[var(--theme-brand)] rounded-xl p-4 outline-none transition-all w-full bg-[color-mix(in_srgb,var(--theme-text)_5%,transparent)] focus:bg-[var(--theme-bg)] shadow-inner" 
              :style="{ color: 'var(--theme-text)' }" 
              placeholder="Como podemos ajudar?" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="message" class="font-bold opacity-80 uppercase tracking-wider text-[10px]" :style="{ color: 'var(--theme-text)' }">Mensagem</label>
            <textarea id="message" rows="5" required 
              class="border border-transparent focus:border-[var(--theme-brand)] rounded-xl p-4 outline-none transition-all w-full resize-none bg-[color-mix(in_srgb,var(--theme-text)_5%,transparent)] focus:bg-[var(--theme-bg)] shadow-inner" 
              :style="{ color: 'var(--theme-text)' }" 
              placeholder="Conta-nos tudo sobre o teu projeto..."></textarea>
          </div>

          <div class="flex items-center justify-between mt-2 flex-wrap gap-4">
            <p class="text-xs opacity-60 max-w-[40ch] transition-colors" :style="{ color: 'var(--theme-text)' }">
              Ao enviares a mensagem concordas com os nossos termos de privacidade e tratamento de dados.
            </p>
            <button type="submit" class="sirius-btn-primary w-full md:w-auto">
              Enviar Mensagem <i class="pi pi-send ml-2"></i>
            </button>
          </div>
        </form>
      </UiCard>

    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UiCard from '~/components/ui/Card.vue';

// Dizemos expressamente ao Nuxt para usar o layout padrão
definePageMeta({
  layout: 'default'
});

const isSubmitted = ref(false);

// Lógica de submissão do formulário
const submitForm = () => {
  // Num cenário real, aqui farias o teu pedido POST (fetch/axios)
  isSubmitted.value = true;
};
</script>

<style scoped>
/* Animação suave de Transição do sucesso */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, backdrop-filter 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}
</style>