<script setup>
import { ref } from 'vue'

const speakingTasks = ref([
  { id: 1, title: '日常问候', category: '日常对话', completed: true, level: '初级' },
  { id: 2, title: '点餐用语', category: '日常对话', completed: false, level: '初级' },
  { id: 3, title: '购物交流', category: '日常对话', completed: false, level: '初级' },
  { id: 4, title: '旅行问路', category: '旅行', completed: false, level: '中级' },
  { id: 5, title: '酒店入住', category: '旅行', completed: false, level: '中级' },
  { id: 6, title: '机场英语', category: '旅行', completed: false, level: '中级' },
  { id: 7, title: '工作会议', category: '职场', completed: false, level: '高级' },
  { id: 8, title: '商务谈判', category: '职场', completed: false, level: '高级' },
  { id: 9, title: '面试英语', category: '职场', completed: false, level: '高级' },
  { id: 10, title: '社交聚会', category: '社交', completed: false, level: '中级' }
])

const completedCount = speakingTasks.value.filter(t => t.completed).length
</script>

<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-purple-50 rounded-xl p-4">
        <div class="text-sm text-purple-600 mb-1">总任务</div>
        <div class="text-2xl font-bold text-purple-700">{{ speakingTasks.length }}</div>
      </div>
      <div class="bg-green-50 rounded-xl p-4">
        <div class="text-sm text-green-600 mb-1">已完成</div>
        <div class="text-2xl font-bold text-green-700">{{ completedCount }}</div>
      </div>
      <div class="bg-blue-50 rounded-xl p-4">
        <div class="text-sm text-blue-600 mb-1">进行中</div>
        <div class="text-2xl font-bold text-blue-700">{{ speakingTasks.length - completedCount }}</div>
      </div>
      <div class="bg-orange-50 rounded-xl p-4">
        <div class="text-sm text-orange-600 mb-1">完成率</div>
        <div class="text-2xl font-bold text-orange-700">{{ Math.round((completedCount / speakingTasks.length) * 100) }}%</div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="bg-white rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-lg font-semibold text-gray-800">口语学习进度</span>
        <span class="text-lg font-bold text-purple-600">{{ completedCount }}/{{ speakingTasks.length }}</span>
      </div>
      <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
          :style="{ width: `${(completedCount / speakingTasks.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">口语任务列表</h2>
      <div class="space-y-3">
        <div
          v-for="task in speakingTasks"
          :key="task.id"
          :class="[
            'flex items-center justify-between p-4 rounded-xl border-2 transition-all',
            task.completed ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200 hover:border-purple-300'
          ]"
        >
          <div class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center mr-4',
              task.completed ? 'bg-green-100' : 'bg-purple-100'
            ]">
              <span class="text-xl">{{ task.completed ? '✓' : '🎤' }}</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-800">{{ task.title }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-gray-500">{{ task.category }}</span>
                <span :class="[
                  'text-xs px-2 py-0.5 rounded-full',
                  task.level === '初级' ? 'bg-green-100 text-green-600' :
                  task.level === '中级' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                ]">
                  {{ task.level }}
                </span>
              </div>
            </div>
          </div>
          <button 
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              task.completed 
                ? 'bg-gray-100 text-gray-500' 
                : 'bg-purple-500 text-white hover:bg-purple-600'
            ]"
            :disabled="task.completed"
          >
            {{ task.completed ? '已完成' : '开始练习' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 练习提示 -->
    <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
      <h3 class="font-semibold mb-2">💡 口语练习小贴士</h3>
      <ul class="space-y-2 text-sm opacity-90">
        <li>• 每天坚持练习15-30分钟</li>
        <li>• 大声朗读，注意发音和语调</li>
        <li>• 尝试用英语思考，培养语感</li>
        <li>• 可以录音回放，对比标准发音</li>
      </ul>
    </div>
  </div>
</template>