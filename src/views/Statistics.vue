<script setup>
import { ref } from 'vue'

const stats = ref({
  totalCheckins: 45,
  continuousDays: 12,
  completionRate: 85,
  longestStreak: 21,
  listeningCompleted: 35,
  reciteCompleted: 20,
  speakingCompleted: 12,
  weeklyData: [6, 7, 5, 7, 6, 7, 7],
  monthlyData: [22, 28, 25, 30, 28]
})
</script>

<template>
  <div class="space-y-6">
    <!-- 核心统计 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-blue-50 rounded-xl p-4">
        <div class="text-sm text-blue-600 mb-1">总打卡次数</div>
        <div class="text-2xl font-bold text-blue-700">{{ stats.totalCheckins }}</div>
      </div>
      <div class="bg-green-50 rounded-xl p-4">
        <div class="text-sm text-green-600 mb-1">连续天数</div>
        <div class="text-2xl font-bold text-green-700">{{ stats.continuousDays }}</div>
      </div>
      <div class="bg-orange-50 rounded-xl p-4">
        <div class="text-sm text-orange-600 mb-1">完成率</div>
        <div class="text-2xl font-bold text-orange-700">{{ stats.completionRate }}%</div>
      </div>
      <div class="bg-purple-50 rounded-xl p-4">
        <div class="text-sm text-purple-600 mb-1">最长连续</div>
        <div class="text-2xl font-bold text-purple-700">{{ stats.longestStreak }}天</div>
      </div>
    </div>

    <!-- 模块统计 -->
    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">模块完成情况</h2>
      <div class="space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600">英语听力</span>
            <span class="text-green-600 font-medium">{{ stats.listeningCompleted }}/100</span>
          </div>
          <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-green-500 rounded-full" :style="{ width: `${stats.listeningCompleted}%` }"></div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600">英语背诵</span>
            <span class="text-blue-600 font-medium">{{ stats.reciteCompleted }}/50</span>
          </div>
          <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full" :style="{ width: `${(stats.reciteCompleted / 50) * 100}%` }"></div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600">英语口语</span>
            <span class="text-purple-600 font-medium">{{ stats.speakingCompleted }}/30</span>
          </div>
          <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-purple-500 rounded-full" :style="{ width: `${(stats.speakingCompleted / 30) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 本周打卡趋势 -->
    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">本周打卡趋势</h2>
      <div class="flex items-end justify-between h-40">
        <div 
          v-for="(count, index) in stats.weeklyData" 
          :key="index"
          class="flex-1 flex flex-col items-center"
        >
          <div 
            class="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500"
            :style="{ height: `${count * 12}px` }"
          ></div>
          <span class="text-xs text-gray-400 mt-2">{{ ['日', '一', '二', '三', '四', '五', '六'][index] }}</span>
          <span class="text-xs text-gray-500">{{ count }}次</span>
        </div>
      </div>
    </div>

    <!-- 月度统计 -->
    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">月度统计</h2>
      <div class="grid grid-cols-5 gap-4">
        <div 
          v-for="(count, index) in stats.monthlyData" 
          :key="index"
          class="text-center p-4 bg-gray-50 rounded-xl"
        >
          <div class="text-2xl font-bold text-blue-600">{{ count }}</div>
          <div class="text-xs text-gray-500">2024年{{ index + 1 }}月</div>
        </div>
      </div>
    </div>
  </div>
</template>