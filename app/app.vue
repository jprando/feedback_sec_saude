<script setup>
const colorMode = useColorMode()

colorMode.preference = 'light'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'pt-BR'
  }
})

const title = 'Manifeste-se'
const description = 'Sistema de feedback e manifestações da Prefeitura de Domingos Martins'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
    <!-- Header/Navbar -->
    <div class="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex-1 min-w-0">
          <AppLogo />
        </NuxtLink>

        <div class="flex items-center gap-2 sm:gap-4 ml-4">
          <UColorModeButton />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="mt-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
      <div class="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>Desenvolvido por Gerência CPD - Secretaria de Saúde PMDM</p>
        <p class="mt-1">Versão v1.0</p>
      </div>
    </footer>
  </div>
</template>
