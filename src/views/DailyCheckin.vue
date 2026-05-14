<script setup>
import { ref, computed } from 'vue'

const tasks = ref([
  { id: 1, name: '英语听力', icon: '🎧', completed: true, type: 'listening' },
  { id: 2, name: '英语背诵', icon: '📖', completed: false, type: 'recite' },
  { id: 3, name: '英语口语', icon: '🎤', completed: false, type: 'speaking' }
])

const completedCount = computed(() => tasks.value.filter(t => t.completed).length)

const toggleTask = (task) => {
  task.completed = !task.completed
}
</script>

<template>
  <div class="space-y-6">
    <!-- 今日进度 -->
    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">今日打卡</h2>
      <div class="flex items-center justify-between mb-4">
        <span class="text-gray-600">完成进度</span>
        <span class="text-lg font-bold text-blue-600">{{ completedCount }}/{{ tasks.length }}</span>
      </div>
      <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
          :style="{ width: `${(completedCount / tasks.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="task in tasks"
        :key="task.id"
        @click="toggleTask(task)"
        :class="[
          'relative bg-white rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg',
          task.completed ? 'ring-2 ring-green-500' : ''
        ]"
      >
        <div 
          :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4',
            task.completed ? 'bg-green-100' : 'bg-gray-100'
          ]"
        >
          {{ task.icon }}
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">{{ task.name }}</h3>
        <div :class="[
          'text-sm',
          task.completed ? 'text-green-500' : 'text-gray-400'
        ]">
          {{ task.completed ? '已完成' : '待完成' }}
        </div>
        <div 
          v-if="task.completed"
          class="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
        >
          <span class="text-white text-sm">✓</span>
        </div>
      </div>
    </div>

    <!-- 激励语 -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
      <div class="text-lg font-medium mb-2">
        {{ completedCount === tasks.length ? '🎉 太棒了！今日任务已全部完成！' : '💪 加油！继续完成今日任务吧！' }}
      </div>
      <div class="text-sm opacity-80">
        坚持每天学习，英语水平一定会有提升！
      </div>
    </div>
  </div>
</template>