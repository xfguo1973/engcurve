<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)
const isLoggedIn = ref(localStorage.getItem('currentUser') !== null)

watch(
  () => route.path,
  () => {
    isLoggedIn.value = localStorage.getItem('currentUser') !== null
  }
)

const showLayout = computed(function() {
  return isLoggedIn.value && !['/', '/register'].includes(route.path)
})

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

function handleNavClick(id) {
  // Fix: all routes use their id directly (overview → /overview, not /)
  router.push('/' + id)
  closeSidebar()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <template v-if="showLayout">
      <Sidebar
        :is-open="sidebarOpen"
        :current-route="route.name"
        @toggle="toggleSidebar"
        @close="closeSidebar"
        @nav-click="handleNavClick"
      />
      <div class="lg:ml-64">
        <Header @toggle-sidebar="toggleSidebar" />
        <main class="p-6">
          <router-view />
        </main>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>
