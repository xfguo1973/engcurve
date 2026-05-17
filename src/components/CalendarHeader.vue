<script setup>
import { ref, computed, onMounted } from 'vue'

const today = new Date()
const currentDate = ref(new Date())

onMounted(function() {
  currentDate.value = new Date()
})

const todayStr = computed(function() {
  return currentDate.value.getFullYear() + '年' + (currentDate.value.getMonth() + 1) + '月' + currentDate.value.getDate() + '日'
})

const todayWeekday = computed(function() {
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekDays[currentDate.value.getDay()]
})

const weekData = computed(function() {
  const data = []
  const day = new Date(currentDate.value)
  day.setDate(day.getDate() - day.getDay())
  
  for (let i = 0; i < 7; i++) {
    const isToday = day.toDateString() === today.toDateString()
    const isFuture = day > today
    
    data.push({
      date: day.getDate(),
      weekday: ['日', '一', '二', '三', '四', '五', '六'][i],
      isToday: isToday,
      isFuture: isFuture,
      fullDate: new Date(day)
    })
    
    day.setDate(day.getDate() + 1)
  }
  
  return data
})
</script>

<template>
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold">{{ todayStr }}</h2>
        <p class="text-blue-100">{{ todayWeekday }}</p>
      </div>
      <div class="text-right">
        <div class="text-4xl font-bold">25</div>
        <div class="text-blue-100">连续打卡天数</div>
      </div>
    </div>
    
    <div class="grid grid-cols-7 gap-2">
      <div 
        v-for="(day, index) in weekData" 
        :key="index"
        :class="[
          'text-center py-3 rounded-lg',
          day.isToday ? 'bg-white text-blue-600 font-semibold' :
          day.isFuture ? 'text-blue-200' : 'text-white'
        ]"
      >
        <div class="text-xs opacity-70">{{ day.weekday }}</div>
        <div class="text-lg font-medium">{{ day.date }}</div>
      </div>
    </div>
  </div>
</template>
