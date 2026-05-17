<script setup>
import { Home, Headphones, BookOpen, Mic, Calendar, BarChart, CheckSquare, Settings, X } from 'lucide-vue-next'

defineProps({
  isOpen: Boolean,
  currentRoute: String
})

const emit = defineEmits(['toggle', 'close', 'nav-click'])

const navItems = [
  { id: 'overview', name: '学习概览', icon: Home },
  { id: 'listening', name: '听力训练', icon: Headphones },
  { id: 'recite', name: '背诵记忆', icon: BookOpen },
  { id: 'speaking', name: '口语练习', icon: Mic },
  { id: 'calendar', name: '打卡日历', icon: Calendar },
  { id: 'statistics', name: '学习统计', icon: BarChart },
  { id: 'daily-checkin', name: '每日打卡', icon: CheckSquare },
  { id: 'settings', name: '设置', icon: Settings }
]

function handleNavClick(id) {
  emit('nav-click', id)
}
</script>

<template>
  <aside 
    :class="[
      'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">英语打卡</h1>
      <button 
        @click="emit('toggle')"
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        <X class="w-5 h-5 text-gray-600" />
      </button>
    </div>
    
    <nav class="p-4 space-y-2">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="handleNavClick(item.id)"
        :class="[
          'w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all',
          currentRoute === item.id.charAt(0).toUpperCase() + item.id.slice(1).replace(/-./g, x => x[1].toUpperCase())
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-100'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="font-medium">{{ item.name }}</span>
      </button>
    </nav>
  </aside>
</template>
