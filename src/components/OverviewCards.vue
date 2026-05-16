<script setup>
import { ref } from 'vue'
import { BookOpen, Headphones, CheckCircle, TrendingUp } from 'lucide-vue-next'

const cards = ref([
  { 
    title: '今日学习', 
    value: '30分钟', 
    icon: BookOpen, 
    color: 'blue',
    bg: 'bg-blue-50',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-500'
  },
  { 
    title: '听力练习', 
    value: '15篇', 
    icon: Headphones, 
    color: 'green',
    bg: 'bg-green-50',
    textColor: 'text-green-600',
    bgColor: 'bg-green-500'
  },
  { 
    title: '已背诵', 
    value: '42个', 
    icon: CheckCircle, 
    color: 'purple',
    bg: 'bg-purple-50',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-500'
  },
  { 
    title: '连续打卡', 
    value: '25天', 
    icon: TrendingUp, 
    color: 'orange',
    bg: 'bg-orange-50',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-500'
  }
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div 
      v-for="card in cards" 
      :key="card.title"
      :class="['rounded-xl p-4', card.bg]"
    >
      <div class="flex items-center justify-between mb-3">
        <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', card.bgColor]">
          <component :is="card.icon" class="w-5 h-5 text-white" />
        </div>
      </div>
      <div :class="['text-2xl font-bold', card.textColor]">{{ card.value }}</div>
      <div class="text-sm text-gray-500 mt-1">{{ card.title }}</div>
    </div>
  </div>
</template>
