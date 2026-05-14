<script setup>
import { ref, computed } from 'vue'
import OverviewCards from '../components/OverviewCards.vue'
import ModuleProgress from '../components/ModuleProgress.vue'

// Mock data
const listeningStats = ref({
  total: 100,
  completed: 35,
  overdue: 5,
  today: 8
})

const reciteStats = ref({
  total: 50,
  completed: 20,
  overdue: 3,
  today: 5
})

const speakingStats = ref({
  total: 30,
  completed: 12,
  overdue: 0,
  today: 2
})

const overallProgress = computed(() => {
  const total = listeningStats.value.total + reciteStats.value.total + speakingStats.value.total
  const completed = listeningStats.value.completed + reciteStats.value.completed + speakingStats.value.completed
  return Math.round((completed / total) * 100)
})
</script>

<template>
  <div class="space-y-6">
    <OverviewCards />
    
    <!-- Quick Stats -->
    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">学习进度</h2>
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm text-gray-500">总体完成率</span>
        <span class="text-lg font-bold text-blue-600">{{ overallProgress }}%</span>
      </div>
      <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
          :style="{ width: `${overallProgress}%` }"
        ></div>
      </div>
    </div>

    <ModuleProgress />
  </div>
</template>