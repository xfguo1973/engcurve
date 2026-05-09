<script setup>
import { LayoutDashboard, CheckCircle, Headphones, BookOpen, MessageCircle, BarChart, Calendar, Settings } from 'lucide-vue-next';

defineProps({
  activeNav: String
});

const emit = defineEmits(['setActiveNav']);

const navItems = [
  { id: 'overview', label: '总览', icon: LayoutDashboard },
  { id: 'daily', label: '今日打卡', icon: CheckCircle },
  { id: 'listening', label: '英语听力', icon: Headphones },
  { id: 'recite', label: '英语背诵', icon: BookOpen },
  { id: 'speaking', label: '英语口语', icon: MessageCircle },
  { id: 'statistics', label: '学习统计', icon: BarChart },
  { id: 'calendar', label: '打卡日历', icon: Calendar },
  { id: 'settings', label: '设置', icon: Settings }
];
</script>

<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
    <div class="h-16 flex items-center px-4 border-b border-gray-200">
      <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
        <span class="text-white font-bold text-sm">英</span>
      </div>
      <span class="text-lg font-semibold text-gray-800">英语打卡</span>
    </div>
    
    <nav class="flex-1 py-4">
      <div class="px-3">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="emit('setActiveNav', item.id)"
          :class="[
            'w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer',
            activeNav === item.id
              ? 'bg-blue-50 text-primary font-medium'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </nav>
  </aside>
</template>
