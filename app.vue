<template>
  <UApp>
  <NuxtLayout>
    
      <NuxtPage />
    
  </NuxtLayout>
  </UApp>
</template>

<script setup>
useHead({
  script: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-47ZF88NPY4',
      async: true
    },
    {
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-47ZF88NPY4');
      `
    }
  ]
})
</script>
