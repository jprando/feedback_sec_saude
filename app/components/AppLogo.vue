<script setup lang="ts">
const colorMode = useColorMode()

const logoSrc = computed(() => {
  return colorMode.value === 'dark'
    ? '/brasao_pmdm_claro.png'
    : '/brasao_pmdm_escuro.png'
})
</script>

<template>
  <div class="flex items-center gap-2 sm:gap-3">
    <!-- Logo PNG -->
    <div class="flex-shrink-0">
      <img
        :src="logoSrc"
        alt="Prefeitura de Domingos Martins - Secretaria de Saúde"
        class="h-10 w-auto object-contain"
      />
    </div>

    <!-- Texto -->
    <div class="hidden sm:block min-w-0">
      <p class="text-xs font-bold text-slate-900 dark:text-white leading-tight">
        Domingos Martins
      </p>
      <p class="text-xs text-slate-700 dark:text-slate-300 font-medium">
        Saúde
      </p>
    </div>
  </div>
</template>
