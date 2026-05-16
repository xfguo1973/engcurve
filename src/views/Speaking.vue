<script setup>
import { ref, computed } from 'vue'
import { Mic, MicOff, CheckCircle, RotateCcw } from 'lucide-vue-next'

const speakingTasks = ref([
  { id: 1, title: '自我介绍', content: '请介绍一下你自己，包括你的姓名、年龄、职业和兴趣爱好。', completed: true },
  { id: 2, title: '我的一天', content: '描述一下你典型的一天是如何度过的。', completed: true },
  { id: 3, title: '最喜欢的食物', content: '你最喜欢的食物是什么？为什么喜欢它？', completed: false },
  { id: 4, title: '旅行经历', content: '分享一次你难忘的旅行经历。', completed: false },
  { id: 5, title: '未来计划', content: '你未来五年的计划是什么？', completed: false },
  { id: 6, title: '最喜欢的电影', content: '推荐一部你最喜欢的电影并说明理由。', completed: false },
  { id: 7, title: '学习英语的方法', content: '你是如何学习英语的？有什么好的方法？', completed: false },
  { id: 8, title: '周末活动', content: '你周末通常做什么？', completed: false },
  { id: 9, title: '最喜欢的季节', content: '你最喜欢哪个季节？为什么？', completed: false },
  { id: 10, title: '梦想职业', content: '你梦想的职业是什么？', completed: false }
])

const isRecording = ref(false)
const currentTask = ref(null)

const completedCount = computed(function() {
  return speakingTasks.value.filter(function(t) { return t.completed }).length
})

const progress = computed(function() {
  return Math.round((completedCount.value / speakingTasks.value.length) * 100)
})

function startRecording(task) {
  currentTask.value = task
  isRecording.value = true
  
  setTimeout(function() {
    isRecording.value = false
    task.completed = true
    currentTask.value = null
    alert('录音完成！任务已标记为完成')
  }, 5000)
}

function resetTasks() {
  if (confirm('确定要重置所有口语练习数据吗？')) {
    speakingTasks.value.forEach(function(task) {
      task.completed = false
    })
    alert('数据已重置！')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800">口语练习</h2>
      <button 
        @click="resetTasks"
        class="px-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
      >
        重置数据
      </button>
    </div>

    <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">口语练习进度</h3>
          <p class="text-purple-100 mt-1">{{ completedCount }}/{{ speakingTasks.length }} 任务完成</p>
        </div>
        <div class="text-right">
          <div class="text-4xl font-bold">{{ progress }}%</div>
        </div>
      </div>
      <div class="mt-4 h-3 bg-white bg-opacity-30 rounded-full overflow-hidden">
        <div 
          class="h-full bg-white rounded-full transition-all duration-500"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="task in speakingTasks" 
        :key="task.id"
        :class="[
          'bg-white rounded-xl p-6 transition-all',
          task.completed ? 'border-2 border-green-200' : 'border-2 border-gray-100 hover:border-purple-200'
        ]"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="font-semibold text-gray-800">{{ task.title }}</h4>
            <p class="text-sm text-gray-500 mt-1">{{ task.content }}</p>
          </div>
          <CheckCircle v-if="task.completed" class="w-6 h-6 text-green-500" />
        </div>
        
        <button 
          v-if="!task.completed"
          @click="startRecording(task)"
          :disabled="isRecording"
          :class="[
            'w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2',
            isRecording && currentTask?.id === task.id 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
          ]"
        >
          <Mic v-if="!isRecording || currentTask?.id !== task.id" class="w-5 h-5" />
          <MicOff v-else class="w-5 h-5" />
          <span>{{ isRecording && currentTask?.id === task.id ? '录音中...' : '开始录音' }}</span>
        </button>
        
        <div v-else class="w-full py-3 bg-green-50 text-green-600 rounded-xl font-medium text-center">
          ✓ 已完成
        </div>
      </div>
    </div>
  </div>
</template>
