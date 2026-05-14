<script setup>
import { ref, computed, onMounted } from 'vue'

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

const checkinDays = ref([])

onMounted(() => {
  const saved = localStorage.getItem('checkinDays')
  if (saved) {
    checkinDays.value = JSON.parse(saved)
  }
})

const monthDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const startDay = firstDay.getDay()
  
  const days = []
  
  for (let i = 0; i < startDay; i++) {
    days.push({ date: null, isEmpty: true })
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const isToday = dateStr === today.toISOString().split('T')[0]
    const isChecked = checkinDays.value.includes(dateStr)
    
    days.push({
      date: i,
      dateStr,
      isEmpty: false,
      isToday,
      isChecked
    })
  }
  
  return days
})

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const goToToday = () => {
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth()
}

const checkinCount = computed(() => {
  return checkinDays.value.filter(d => {
    const date = new Date(d)
    return date.getFullYear() === currentYear.value && date.getMonth() === currentMonth.value
  }).length
})

const currentMonthStr = computed(() => {
  return `${currentYear.value}年${monthNames[currentMonth.value]}`
})
</script>

<template>
  <div class="space-y-6">
    <!-- 日历头部 -->
    <div class="bg-white rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <button 
          @click="prevMonth"
          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          ◀
        </button>
        <div class="text-center">
          <h2 class="text-xl font-semibold text-gray-800">{{ currentMonthStr }}</h2>
          <div class="text-sm text-gray-500">本月打卡 {{ checkinCount }} 天</div>
        </div>
        <button 
          @click="nextMonth"
          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          ▶
        </button>
      </div>

      <!-- 星期标题 -->
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div 
          v-for="day in weekDays" 
          :key="day"
          class="text-center py-2 text-sm font-medium text-gray-500"
        >
          {{ day }}
        </div>
      </div>

      <!-- 日期格子 -->
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="(day, index) in monthDays"
          :key="index"
          :class="[
            'aspect-square rounded-lg flex items-center justify-center text-sm transition-all',
            day.isEmpty ? 'bg-transparent' :
            day.isToday ? 'bg-blue-500 text-white font-medium' :
            day.isChecked ? 'bg-green-100 text-green-600' :
            'text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ day.date }}
        </div>
      </div>

      <div class="mt-4 text-center">
        <button 
          @click="goToToday"
          class="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          回到今天
        </button>
      </div>
    </div>

    <!-- 打卡统计 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-green-50 rounded-xl p-4">
        <div class="text-sm text-green-600 mb-1">连续打卡</div>
        <div class="text-2xl font-bold text-green-700">12天</div>
      </div>
      <div class="bg-blue-50 rounded-xl p-4">
        <div class="text-sm text-blue-600 mb-1">本月打卡</div>
        <div class="text-2xl font-bold text-blue-700">{{ checkinCount }}天</div>
      </div>
      <div class="bg-orange-50 rounded-xl p-4">
        <div class="text-sm text-orange-600 mb-1">今年打卡</div>
        <div class="text-2xl font-bold text-orange-700">128天</div>
      </div>
      <div class="bg-purple-50 rounded-xl p-4">
        <div class="text-sm text-purple-600 mb-1">总打卡</div>
        <div class="text-2xl font-bold text-purple-700">365天+</div>
      </div>
    </div>
  </div>
</template>