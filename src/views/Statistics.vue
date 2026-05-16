<script setup>
import { ref, computed } from 'vue'
import { TrendingUp, BookOpen, Headphones, Mic } from 'lucide-vue-next'

const stats = ref({
  totalDays: 45,
  totalHours: 22.5,
  avgMinutes: 30,
  longestStreak: 25,
  listeningCompleted: 65,
  reciteCompleted: 42,
  speakingCompleted: 27,
  weeklyData: [
    { day: '周一', count: 45 },
    { day: '周二', count: 30 },
    { day: '周三', count: 60 },
    { day: '周四', count: 40 },
    { day: '周五', count: 55 },
    { day: '周六', count: 90 },
    { day: '周日', count: 75 }
  ]
})

const weeklyTotal = computed(function() {
  return stats.value.weeklyData.reduce(function(sum, d) { return sum + d.count }, 0)
})

const maxWeeklyCount = computed(function() {
  return Math.max(...stats.value.weeklyData.map(function(d) { return d.count }))
})
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold text-gray-800">学习统计</h2>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-80">学习天数</div>
            <div class="text-3xl font-bold mt-1">{{ stats.totalDays }}</div>
          </div>
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <TrendingUp class="w-6 h-6" />
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-80">累计学习</div>
            <div class="text-3xl font-bold mt-1">{{ stats.totalHours }}h</div>
          </div>
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <BookOpen class="w-6 h-6" />
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-80">日均学习</div>
            <div class="text-3xl font-bold mt-1">{{ stats.avgMinutes }}min</div>
          </div>
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <Headphones class="w-6 h-6" />
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-80">最长连续</div>
            <div class="text-3xl font-bold mt-1">{{ stats.longestStreak }}天</div>
          </div>
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <Mic class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-6">本周学习时长</h3>
        
        <div class="flex items-end justify-between h-48 gap-4">
          <div 
            v-for="data in stats.weeklyData" 
            :key="data.day"
            class="flex-1 flex flex-col items-center"
          >
            <div class="w-full bg-gray-100 rounded-t-lg overflow-hidden" style="height: 140px;">
              <div 
                class="w-full bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-500"
                :style="{ height: (data.count / maxWeeklyCount * 100) + '%' }"
              ></div>
            </div>
            <div class="text-sm text-gray-500 mt-2">{{ data.day }}</div>
            <div class="text-xs text-gray-400">{{ data.count }}min</div>
          </div>
        </div>
        
        <div class="mt-4 text-center text-gray-500">
          本周总计: {{ weeklyTotal }} 分钟
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-6">模块进度</h3>
        
        <div class="space-y-6">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">听力训练</span>
              <span class="text-green-600 font-medium">{{ stats.listeningCompleted }}%</span>
            </div>
            <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-green-500 rounded-full"
                :style="{ width: stats.listeningCompleted + '%' }"
              ></div>
            </div>
          </div>
          
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">背诵记忆</span>
              <span class="text-blue-600 font-medium">{{ (stats.reciteCompleted / 50 * 100).toFixed(0) }}%</span>
            </div>
            <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-blue-500 rounded-full"
                :style="{ width: (stats.reciteCompleted / 50 * 100) + '%' }"
              ></div>
            </div>
          </div>
          
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">口语练习</span>
              <span class="text-purple-600 font-medium">{{ (stats.speakingCompleted / 30 * 100).toFixed(0) }}%</span>
            </div>
            <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-purple-500 rounded-full"
                :style="{ width: (stats.speakingCompleted / 30 * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-6">学习成就</h3>
      
      <div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl mx-auto flex items-center justify-center mb-2">
            <span class="text-white text-2xl">🎯</span>
          </div>
          <div class="text-sm text-gray-600">初学者</div>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-xl mx-auto flex items-center justify-center mb-2">
            <span class="text-white text-2xl">🔥</span>
          </div>
          <div class="text-sm text-gray-600">连续7天</div>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl mx-auto flex items-center justify-center mb-2">
            <span class="text-white text-2xl">💪</span>
          </div>
          <div class="text-sm text-gray-600">连续14天</div>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl mx-auto flex items-center justify-center mb-2">
            <span class="text-white text-2xl">🏆</span>
          </div>
          <div class="text-sm text-gray-600">连续30天</div>
        </div>
        <div class="text-center opacity-50">
          <div class="w-16 h-16 bg-gray-200 rounded-xl mx-auto flex items-center justify-center mb-2">
            <span class="text-gray-400 text-2xl">📚</span>
          </div>
          <div class="text-sm text-gray-400">学习100小时</div>
        </div>
        <div class="text-center opacity-50">
          <div class="w-16 h-16 bg-gray-200 rounded-xl mx-auto flex items-center justify-center mb-2">
            <span class="text-gray-400 text-2xl">🎧</span>
          </div>
          <div class="text-sm text-gray-400">听力50篇</div>
        </div>
        <div class="text-center opacity-50">
          <div class="w-16 h-16 bg-gray-200 rounded-xl mx-auto flex items-center justify-center mb-2">
            <span class="text-gray-400 text-2xl">📖</span>
          </div>
          <div class="text-sm text-gray-400">背诵200词</div>
        </div>
        <div class="text-center opacity-50">
          <div class="w-16 h-16 bg-gray-200 rounded-xl mx-auto flex items-center justify-center mb-2">
            <span class="text-gray-400 text-2xl">🎤</span>
          </div>
          <div class="text-sm text-gray-400">口语30次</div>
        </div>
      </div>
    </div>
  </div>
</template>
