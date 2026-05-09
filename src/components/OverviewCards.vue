<script setup>
import { CheckCircle, Flame, Calendar, Clock } from 'lucide-vue-next'

const overviewData = [
  {
    icon: CheckCircle,
    title: '今日完成',
    value: '1/3',
    subtitle: '听力已打卡',
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  {
    icon: Flame,
    title: '连续打卡',
    value: '12天',
    subtitle: '历史最长21天',
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50'
  },
  {
    icon: Calendar,
    title: '本月打卡',
    value: '28次',
    subtitle: '覆盖8天',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Clock,
    title: '今日待完成',
    value: '2项',
    subtitle: '背诵·口语',
    iconColor: 'text-gray-500',
    bgColor: 'bg-gray-50'
  }
]
</script>

<template>
  <div class="mb-8">
    <h2 class="text-sm font-medium text-gray-500 mb-4">今日概览</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="item in overviewData"
        :key="item.title"
        class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
      >
        <div class="flex items-start justify-between mb-3">
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', item.bgColor]">
            <component :is="item.icon" :class="['w-4 h-4', item.iconColor]" />
          </div>
        </div>
        <div class="text-2xl font-bold text-gray-800 mb-1">{{ item.value }}</div>
        <div class="text-xs text-gray-500">{{ item.subtitle }}</div>
      </div>
    </div>
  </div>
</template>
