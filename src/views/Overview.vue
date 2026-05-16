<script setup>
import { ref, computed } from 'vue'
import { Headphones, BookOpen, Mic, CheckSquare } from 'lucide-vue-next'
import CalendarHeader from '../components/CalendarHeader.vue'
import OverviewCards from '../components/OverviewCards.vue'
import ModuleProgress from '../components/ModuleProgress.vue'

const modules = ref([
  { 
    id: 'listening', 
    name: '听力训练', 
    completed: 15, 
    total: 50,
    icon: Headphones,
    color: { bg: 'bg-green-100', text: 'text-green-600' }
  },
  { 
    id: 'recite', 
    name: '背诵记忆', 
    completed: 42, 
    total: 100,
    icon: BookOpen,
    color: { bg: 'bg-blue-100', text: 'text-blue-600' }
  },
  { 
    id: 'speaking', 
    name: '口语练习', 
    completed: 8, 
    total: 30,
    icon: Mic,
    color: { bg: 'bg-purple-100', text: 'text-purple-600' }
  },
  { 
    id: 'daily-checkin', 
    name: '每日打卡', 
    completed: 25, 
    total: 30,
    icon: CheckSquare,
    color: { bg: 'bg-orange-100', text: 'text-orange-600' }
  }
])

const overallProgress = computed(function() {
  const total = modules.value.reduce(function(sum, m) { return sum + m.total }, 0)
  const completed = modules.value.reduce(function(sum, m) { return sum + m.completed }, 0)
  return Math.round((completed / total) * 100)
})

const todayTasks = ref([
  { id: 1, name: '完成3篇听力练习', completed: true },
  { id: 2, name: '背诵10个单词', completed: true },
  { id: 3, name: '口语练习15分钟', completed: false },
  { id: 4, name: '每日打卡', completed: true }
])
</script>

<template>
  <div class="space-y-6">
    <CalendarHeader />
    
    <OverviewCards />
    
    <div class="grid lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-6">今日任务</h3>
        
        <div class="space-y-3">
          <div 
            v-for="task in todayTasks" 
            :key="task.id"
            :class="[
              'flex items-center space-x-3 p-4 rounded-xl transition-all',
              task.completed ? 'bg-green-50' : 'bg-gray-50'
            ]"
          >
            <div :class="[
              'w-6 h-6 rounded-full border-2 flex items-center justify-center',
              task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
            ]">
              <CheckSquare v-if="task.completed" class="w-4 h-4 text-white" />
            </div>
            <span :class="[
              'font-medium',
              task.completed ? 'text-green-600 line-through' : 'text-gray-700'
            ]">{{ task.name }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-6">总体进度</h3>
        
        <div class="flex items-center justify-center mb-6">
          <div class="relative w-32 h-32">
            <svg class="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#f3f4f6"
                stroke-width="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#8b5cf6"
                stroke-width="12"
                fill="none"
                stroke-linecap="round"
                :stroke-dasharray="352"
                :stroke-dashoffset="352 - (352 * overallProgress / 100)"
                class="transition-all duration-1000"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold text-gray-800">{{ overallProgress }}%</span>
              <span class="text-sm text-gray-500">完成度</span>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">学习天数</span>
            <span class="font-medium text-gray-800">45天</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">累计学习</span>
            <span class="font-medium text-gray-800">22.5小时</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">平均每天</span>
            <span class="font-medium text-gray-800">30分钟</span>
          </div>
        </div>
      </div>
    </div>
    
    <ModuleProgress :modules="modules" />
  </div>
</template>
