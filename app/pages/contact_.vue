<template>
  <main>
    <PageHeader
      :tag="headerConfig.tag"
      :tagIcon="headerConfig.tagIcon"
      :title="headerConfig.title"
      :highlight="headerConfig.highlight"
      :subtitle="headerConfig.subtitle"
    />
    <Sirius-ContactModel1 
      v-model:form="form"
      v-model:is-submitted="isSubmitted"
      :header-config="headerConfig"
      :contact-info="contactInfo"
      :form-schema="contactFormSchema"
      :submit-config="submitConfig"
      :success-config="successConfig"
      @submit="submitForm"
      @reset="resetForm"
    />
  </main>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({ layout: 'default' });

// ==========================================
// 1. ESTADO DA PÁGINA (DADOS E FLAGS)
// ==========================================
const isSubmitted = ref(false);
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

// ==========================================
// 2. CONFIGURAÇÕES VISUAIS (PROPS)
// ==========================================
const headerConfig = {
  tag: 'Só chamar',
  tagIcon: 'pi pi-envelope',
  title: 'Fale ',
  highlight: 'Conosco',
  subtitle: 'Tens um projeto em mente ou uma dúvida técnica? Preenche o formulário abaixo.'
};

const contactInfo = [
  { icon: 'pi pi-map-marker', title: 'Localização', content: 'Avenida da Liberdade, 110<br/>1250-146 Lisboa, Portugal' },
  { icon: 'pi pi-phone', title: 'Telefone', content: '+351 210 000 000<br/>Seg - Sex, 9h às 18h' },
  { icon: 'pi pi-envelope', title: 'Email', content: 'ola@siriusstudio.pt<br/>Suporte técnico 24/7' }
];

const contactFormSchema = [
  { name: 'name', label: 'Nome Completo', type: 'text', placeholder: 'O teu nome', required: true, fullWidth: false },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'O teu melhor email', required: true, fullWidth: false },
  { name: 'subject', label: 'Assunto', type: 'text', placeholder: 'Como podemos ajudar?', required: true, fullWidth: true },
  { name: 'message', label: 'Mensagem', type: 'textarea', placeholder: 'Conta-nos tudo sobre o teu projeto...', required: true, rows: 5, fullWidth: true }
];

const submitConfig = {
  label: 'Enviar Mensagem',
  icon: 'pi pi-send',
  terms: 'Ao enviares a mensagem concordas com os nossos termos de privacidade e tratamento de dados.'
};

const successConfig = {
  title: 'Mensagem Recebida!',
  message: 'Obrigado pelo teu contacto. A nossa equipa vai analisar a tua mensagem e responderemos num prazo máximo de 24 horas.',
  icon: 'pi pi-check',
  buttonLabel: 'Enviar nova mensagem'
};

// ==========================================
// 3. REGRAS DE NEGÓCIO (AÇÕES)
// ==========================================
const submitForm = async () => {
  // Chamada à API Nitro do Sirius Eco System
  console.log('Enviando para a API:', form.value);
  alert(JSON.stringify(form.value));
  // Simula tempo de rede
  // await new Promise(resolve => setTimeout(resolve, 1000));
  
  isSubmitted.value = true;
};

const resetForm = () => {
  form.value = { name: '', email: '', subject: '', message: '' };
  isSubmitted.value = false;
};
</script>