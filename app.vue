<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-primary-800 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold">Eventos</NuxtLink>
        <nav class="space-x-4">
          <UButton to="/events" variant="ghost">Eventos</UButton>
        </nav>
      </div>
    </header>

    <NuxtPage class="flex-1 container mx-auto p-4" />

    <footer class="bg-gray-100 mt-auto py-4">
      <div class="container mx-auto text-center text-sm text-gray-600">
        © 2025 Site de Eventos
      </div>
    </footer>
  </div>
</template>
