<template>
  <div class="flex flex-col gap-16 md:gap-12">
    <section class="cw-1 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
      
      <div class="flex flex-col gap-6 lg:col-span-1">
        <UiCard
          v-for="(info, index) in contactInfo"
          :key="index"
          content-padding="p-6"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 shrink-0 rounded-xl bg-[var(--theme-brand)]/10 text-[var(--theme-brand)] flex items-center justify-center text-xl transition-colors group-hover:bg-[var(--theme-brand)] group-hover:text-white"
            >
              <i :class="info.icon"></i>
            </div>
            <div>
              <h3
                class="font-bold text-lg mb-1 transition-colors"
                :style="{ color: 'var(--theme-heading-text, var(--theme-text))' }"
              >
                {{ info.title }}
              </h3>
              <p
                class="text-sm opacity-80 leading-relaxed transition-colors"
                :style="{ color: 'var(--theme-text)' }"
                v-html="info.content"
              ></p>
            </div>
          </div>
        </UiCard>
      </div>

      <UiCard
        class="lg:col-span-2 relative overflow-hidden"
        content-padding="p-8 md:p-10"
      >
        <h2
          class="text-2xl font-bold mb-6 transition-colors duration-300"
          :style="{ color: 'var(--theme-heading-text, var(--theme-text))' }"
        >
          {{ formTitle }}
        </h2>

        <UiFormBuilder
          v-model="form"
          :schema="formSchema"
          :submit-config="submitConfig"
          :success-config="successConfig"
          :is-submitted="isSubmitted"
          @submit="handleSubmit"
          @reset="handleReset"
        />
      </UiCard>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. Recebemos apenas as Configurações Visuais (Props do JSON)
const props = defineProps({
  contactInfo: { type: Array, required: true },
  formTitle: { type: String, default: "Envia-nos uma mensagem" },
  formSchema: { type: Array, required: true },
  submitConfig: { type: Object, required: true },
  successConfig: { type: Object, required: true },
});

// 2. Estado INTERNO do Componente (Sem dependência do Pai)
const isSubmitted = ref(false);
const form = ref({});

// 3. Montagem Dinâmica do Formulário
// Isto permite que o CMS adicione campos novos e o componente saiba lidar com eles sozinho
onMounted(() => {
  props.formSchema.forEach(field => {
    form.value[field.name] = '';
  });
});

// 4. Lógica de Negócio Encriptada no Componente
const handleSubmit = async () => {
  // Aqui fará a chamada à sua API Nitro no futuro
  console.log('✅ Enviando para a API do Sirius Eco System:', form.value);
  
  // Simula um carregamento de rede
  // await new Promise(resolve => setTimeout(resolve, 800));
  
  // Muda o estado para mostrar a mensagem de sucesso (successConfig)
  isSubmitted.value = true;
};

const handleReset = () => {
  // Limpa todos os campos dinamicamente
  Object.keys(form.value).forEach(key => {
    form.value[key] = '';
  });
  isSubmitted.value = false;
};
</script>