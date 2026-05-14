<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import CalendarHeader from './components/CalendarHeader.vue'

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar :sidebarOpen="sidebarOpen" @close="closeSidebar" />
    
    <!-- Mobile overlay -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>
    
    <!-- Right side: Calendar + Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Calendar Header -->
      <CalendarHeader @toggleSidebar="toggleSidebar" />
      
      <!-- Main content area -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <div class="max-w-7xl mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>