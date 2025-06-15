<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header/Navigation -->
    <header class="bg-white dark:bg-gray-900 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <NuxtLink to="/" class="text-xl font-bold text-primary-600">
            EventSphere
          </NuxtLink>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/events" class="text-gray-600 hover:text-primary-600">
              Eventos
            </NuxtLink>
            <NuxtLink to="/admin" class="text-gray-600 hover:text-primary-600">
              Admin
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 dark:bg-gray-900 py-6 mt-auto">
      <div class="container mx-auto px-4 text-center text-sm text-gray-500">
        © 2025 EventSphere - Sistema de Gestão de Eventos
      </div>
    </footer>

    <!-- Notifications -->
    <UNotifications />
  </div>
</template>
