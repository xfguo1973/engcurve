<script setup>
import { Headphones, BookOpen, MessageCircle, RefreshCw, CheckCircle, ChevronRight } from 'lucide-vue-next'

const moduleData = [
  {
    id: 'listening',
    name: '英语听力',
    icon: Headphones,
    status: 'completed',
    statusText: '今日已打卡',
    statusColor: 'bg-green-100 text-green-600',
    progressDays: [
      { day: '第1天', status: 'completed', date: '' },
      { day: '第3天', status: 'completed', date: '' },
      { day: '第7天', status: 'current', date: '今日' },
      { day: '第15天', status: 'pending', date: '5月16日' },
      { day: '第30天', status: 'pending', date: '5月31日' }
    ],
    weeklyCount: 5,
    totalCount: 5,
    buttonText: '已完成打卡',
    buttonColor: 'bg-gray-100 text-gray-600'
  },
  {
    id: 'recite',
    name: '英语背诵',
    icon: BookOpen,
    status: 'pending',
    statusText: '今日待打卡',
    statusColor: 'bg-orange-100 text-orange-600',
    progressDays: [
      { day: '第1天', status: 'completed', date: '' },
      { day: '第3天', status: 'completed', date: '' },
      { day: '第7天', status: 'completed', date: '' },
      { day: '第15天', status: 'current', date: '今日' },
      { day: '第30天', status: 'pending', date: '5月31日' }
    ],
    weeklyCount: 4,
    totalCount: 4,
    buttonText: '立即打卡',
    buttonColor: 'bg-primary text-white hover:bg-blue-600'
  },
  {
    id: 'speaking',
    name: '英语口语',
    icon: MessageCircle,
    status: 'missed',
    statusText: '昨日漏打',
    statusColor: 'bg-red-100 text-red-600',
    progressDays: [
      { day: '第1天', status: 'completed', date: '' },
      { day: '第3天', status: 'missed', date: '已漏打' },
      { day: '第7天', status: 'current', date: '今日' },
      { day: '第15天', status: 'pending', date: '5月16日' },
      { day: '第30天', status: 'pending', date: '5月31日' }
    ],
    weeklyCount: 3,
    totalCount: 4,
    buttonText: '立即打卡',
    buttonColor: 'bg-primary text-white hover:bg-blue-600'
  }
]

const getDayStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'current':
      return 'bg-blue-500 text-white border-blue-500'
    case 'missed':
      return 'bg-red-100 text-red-700 border-red-200'
    default:
      return 'bg-gray-100 text-gray-500 border-gray-200'
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-medium text-gray-500">三大模块 · 艾宾浩斯复习进度</h2>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="module in moduleData"
        :key="module.id"
        class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div class="p-4 border-b border-gray-100">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                <component :is="module.icon" class="w-4 h-4 text-primary" />
              </div>
              <span class="font-medium text-gray-800">{{ module.name }}</span>
            </div>
            <span :class="['text-xs px-2 py-1 rounded-full', module.statusColor]">
              {{ module.statusText }}
            </span>
          </div>
          
          <div class="flex gap-2 mb-4">
            <div
              v-for="(day, index) in module.progressDays"
              :key="index"
              :class="[
                'flex-1 rounded-lg p-2 text-center border transition-all',
                getDayStatusClass(day.status)
              ]"
            >
              <div class="text-xs font-medium">{{ day.day }}</div>
              <div v-if="day.date" class="text-xs opacity-75">{{ day.date }}</div>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center text-gray-500">
              <RefreshCw class="w-4 h-4 mr-1" />
              <span>本周已打卡</span>
            </div>
            <span class="font-semibold text-gray-800">{{ module.weeklyCount }} <span class="font-normal text-gray-400">/{{ module.totalCount }}次</span></span>
          </div>
        </div>
        
        <div class="p-4">
          <button
            :class="[
              'w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer',
              module.buttonColor
            ]"
          >
            <CheckCircle v-if="module.status === 'completed'" class="w-4 h-4" />
            <ChevronRight v-else class="w-4 h-4" />
            <span>{{ module.buttonText }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
