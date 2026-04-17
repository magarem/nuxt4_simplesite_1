<template>
  <div>
    <pre>{{ body }}</pre>
  </div>
</template>

<script setup>
const { data: body } = await useAsyncData(
  'about',
  () => $fetch('/data/about.md', { responseType: 'text' })
)
</script>