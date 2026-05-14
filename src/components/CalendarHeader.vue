<script setup>
import { ref, computed, onMounted } from 'vue'
import { RefreshCw, Menu } from 'lucide-vue-next'

defineEmits(['toggleSidebar'])

const today = new Date()
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const dayLabels = ['日', '一', '二', '三', '四', '五', '六']

const checkinDays = ref([])

onMounted(() => {
  const saved = localStorage.getItem('checkinDays')
  if (saved) {
    checkinDays.value = JSON.parse(saved)
  }
})

const todayStr = computed(() => {
  return `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
})

const todayWeekday = computed(() => {
  return weekDays[today.getDay()]
})

const weekData = computed(() => {
  const result = []
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  
  let checkinCount = 0
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    const isToday = dateStr === today.toISOString().split('T')[0]
    const isChecked = checkinDays.value.includes(dateStr)
    const isFuture = date > today
    
    if (isChecked) checkinCount++
    
    result.push({
      day: dayLabels[i],
      date: date.getDate(),
      dateStr,
      isToday,
      isChecked,
      isFuture
    })
  }
  
  return { days: result, checkinCount }
})
</script>

<template>
  <div class="bg-white border-b border-gray-200">
    <!-- Top bar -->
    <div class="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-gray-100">
      <div class="flex items-center space-x-4">
        <button 
          class="lg:hidden w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          @click="$emit('toggleSidebar')"
        >
          <Menu class="w-5 h-5 text-gray-600" />
        </button>
        <h1 class="text-lg font-semibold text-gray-800">英语打卡</h1>
      </div>
      <div class="flex items-center space-x-4">
        <button class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
          <RefreshCw class="w-4 h-4 text-gray-500" />
        </button>
        <button class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span class="text-sm font-medium text-gray-600">我</span>
        </button>
      </div>
    </div>
    
    <!-- Calendar section -->
    <div class="flex items-center justify-between px-4 lg:px-6 py-4">
      <!-- Date display -->
      <div class="flex items-center">
        <div class="text-center mr-6">
          <div class="text-4xl font-bold text-gray-800">{{ today.getDate() }}</div>
          <div class="text-sm text-gray-500">{{ todayWeekday }}</div>
          <div class="text-xs text-gray-400">{{ todayStr }}</div>
        </div>
        
        <!-- Weekly calendar -->
        <div class="flex items-center gap-2">
          <div
            v-for="item in weekData.days"
            :key="item.dateStr"
            :class="[
              'w-12 h-14 rounded-lg flex flex-col items-center justify-center transition-all',
              item.isToday ? 'bg-blue-500 text-white' :
              item.isChecked && !item.isFuture ? 'bg-green-100 text-green-600' :
              item.isFuture ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            <span class="text-xs">{{ item.day }}</span>
            <span class="text-sm font-medium">{{ item.date }}</span>
          </div>
        </div>
      </div>
      
      <!-- Week checkin count -->
      <div class="text-right">
        <div class="text-sm text-gray-500">本周打卡</div>
        <div class="text-lg font-semibold text-gray-800">{{ weekData.checkinCount }}/7天</div>
      </div>
    </div>
  </div>
</template>