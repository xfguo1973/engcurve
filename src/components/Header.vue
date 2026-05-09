<script setup>
import { RefreshCw } from 'lucide-vue-next'

const today = new Date()
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日·周${weekDays[today.getDay()]}`
</script>

<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
    <div>
      <h1 class="text-lg font-semibold text-gray-800">今日概览</h1>
    </div>
    <div class="flex items-center space-x-4">
      <span class="text-sm text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full">
        {{ dateStr }}
      </span>
      <button class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
        <RefreshCw class="w-4 h-4 text-gray-500" />
      </button>
      <button class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <span class="text-sm font-medium text-gray-600">我</span>
      </button>
    </div>
  </header>
</template>
