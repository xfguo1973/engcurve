<script setup>
import { Headphones, BookOpen, MessageCircle } from 'lucide-vue-next'

const modules = [
  {
    icon: Headphones,
    title: '英语听力',
    completed: 35,
    total: 100,
    color: 'green',
    status: '进行中'
  },
  {
    icon: BookOpen,
    title: '英语背诵',
    completed: 20,
    total: 50,
    color: 'blue',
    status: '进行中'
  },
  {
    icon: MessageCircle,
    title: '英语口语',
    completed: 12,
    total: 30,
    color: 'purple',
    status: '进行中'
  }
]

const getProgress = (completed, total) => {
  return Math.round((completed / total) * 100)
}
</script>

<template>
  <div class="bg-white rounded-xl p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">模块进度</h2>
    <div class="space-y-4">
      <div
        v-for="module in modules"
        :key="module.title"
        class="flex items-center"
      >
        <div :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center mr-4',
          module.color === 'green' ? 'bg-green-100' :
          module.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
        ]">
          <component :is="module.icon" :class="[
            'w-6 h-6',
            module.color === 'green' ? 'text-green-600' :
            module.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
          ]" />
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-1">
            <span class="font-medium text-gray-800">{{ module.title }}</span>
            <span class="text-sm text-gray-500">{{ module.completed }}/{{ module.total }}</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              :class="[
                'h-full rounded-full transition-all duration-500',
                module.color === 'green' ? 'bg-green-500' :
                module.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
              ]"
              :style="{ width: `${getProgress(module.completed, module.total)}%` }"
            ></div>
          </div>
        </div>
        <span :class="[
          'ml-4 px-3 py-1 rounded-full text-sm font-medium',
          module.color === 'green' ? 'bg-green-100 text-green-600' :
          module.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
        ]">
          {{ module.status }}
        </span>
      </div>
    </div>
  </div>
</template>