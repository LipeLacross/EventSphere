<template>
  <div class="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
    <UHeader>
      <template #logo>
        <NuxtLink to="/" class="text-xl font-bold">Eventos</NuxtLink>
      </template>
      <template #actions>
        <UButton to="/events" variant="ghost">Eventos</UButton>
      </template>
    </UHeader>

    <main class="flex-1 container mx-auto p-4">
      <slot />
    </main>

    <UFooter class="bg-gray-100 mt-auto py-4">
      <div class="container mx-auto text-center text-sm text-gray-600">
        © 2025 Site de Eventos
      </div>
    </UFooter>
  </div>
</template>
