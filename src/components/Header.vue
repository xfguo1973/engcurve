<script setup>
import { ref } from 'vue'
import { Menu, Bell, User } from 'lucide-vue-next'

defineEmits(['toggle-sidebar'])

const today = new Date()
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const dateStr = today.getFullYear() + '年' + (today.getMonth() + 1) + '月' + today.getDate() + '日·周' + weekDays[today.getDay()]

const currentUser = ref(JSON.parse(localStorage.getItem('currentUser') || '{}'))

function getUserNameFirstChar() {
  if (currentUser.value.name && currentUser.value.name.length > 0) {
    return currentUser.value.name.charAt(0)
  }
  return '用'
}
</script>

<template>
  <header class="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
    <div class="flex items-center space-x-4">
      <button 
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        <Menu class="w-5 h-5 text-gray-600" />
      </button>
      <div class="text-sm text-gray-500">{{ dateStr }}</div>
    </div>
    
    <div class="flex items-center space-x-4">
      <button class="p-2 rounded-lg hover:bg-gray-100 relative">
        <Bell class="w-5 h-5 text-gray-600" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span class="text-white font-medium">{{ getUserNameFirstChar() }}</span>
        </div>
        <span class="hidden sm:block font-medium text-gray-800">{{ currentUser.name || '用户' }}</span>
      </div>
    </div>
  </header>
</template>
