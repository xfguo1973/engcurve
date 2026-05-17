<script setup>
import { ref, computed } from 'vue'
import { CheckCircle, X, Gift } from 'lucide-vue-next'

const tasks = ref([
  { id: 1, name: '完成听力练习', icon: '🎧', completed: false, points: 10 },
  { id: 2, name: '背诵10个单词', icon: '📖', completed: false, points: 15 },
  { id: 3, name: '口语练习15分钟', icon: '🎤', completed: false, points: 20 },
  { id: 4, name: '阅读一篇英文文章', icon: '📚', completed: false, points: 10 },
  { id: 5, name: '复习之前学过的内容', icon: '🔄', completed: false, points: 15 },
  { id: 6, name: '写一段英文日记', icon: '✍️', completed: false, points: 20 }
])

const completedCount = computed(function() {
  return tasks.value.filter(function(t) { return t.completed }).length
})

const totalPoints = computed(function() {
  return tasks.value.filter(function(t) { return t.completed }).reduce(function(sum, t) { return sum + t.points }, 0)
})

const progress = computed(function() {
  return Math.round((completedCount.value / tasks.value.length) * 100)
})

function toggleTask(task) {
  task.completed = !task.completed
  
  if (task.completed) {
    const checkinDays = JSON.parse(localStorage.getItem('checkinDays') || '[]')
    const today = new Date().toISOString().split('T')[0]
    if (!checkinDays.includes(today)) {
      checkinDays.push(today)
      localStorage.setItem('checkinDays', JSON.stringify(checkinDays))
    }
  }
}

const rewards = ref([
  { id: 1, name: '学习加速卡', description: '下次学习时间缩短20%', points: 50, claimed: false },
  { id: 2, name: '双倍积分卡', description: '下次学习积分翻倍', points: 100, claimed: false },
  { id: 3, name: '跳过复习卡', description: '可跳过一次复习', points: 80, claimed: false }
])

function claimReward(reward) {
  if (totalPoints.value >= reward.points && !reward.claimed) {
    reward.claimed = true
    alert('恭喜！已领取 ' + reward.name)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold">每日打卡</h2>
          <p class="text-orange-100 mt-1">今日进度</p>
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

    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4">
        <div class="text-sm text-gray-500 mb-1">完成任务</div>
        <div class="text-2xl font-bold text-gray-800">{{ completedCount }}/{{ tasks.length }}</div>
      </div>
      <div class="bg-white rounded-xl p-4">
        <div class="text-sm text-gray-500 mb-1">获得积分</div>
        <div class="text-2xl font-bold text-yellow-600">{{ totalPoints }}</div>
      </div>
      <div class="bg-white rounded-xl p-4">
        <div class="text-sm text-gray-500 mb-1">连续打卡</div>
        <div class="text-2xl font-bold text-green-600">25天</div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-6">今日任务</h3>
      
      <div class="space-y-3">
        <div 
          v-for="task in tasks" 
          :key="task.id"
          @click="toggleTask(task)"
          :class="[
            'flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all',
            task.completed ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-100 hover:border-orange-200'
          ]"
        >
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center text-xl',
              task.completed ? 'bg-green-100' : 'bg-white'
            ]">
              {{ task.icon }}
            </div>
            <span :class="[
              'font-medium',
              task.completed ? 'text-green-600 line-through' : 'text-gray-700'
            ]">{{ task.name }}</span>
          </div>
          
          <div class="flex items-center space-x-3">
            <span :class="[
              'text-sm font-medium',
              task.completed ? 'text-green-500' : 'text-gray-400'
            ]">+{{ task.points }} 积分</span>
            <div :class="[
              'w-6 h-6 rounded-full border-2 flex items-center justify-center',
              task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
            ]">
              <CheckCircle v-if="task.completed" class="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <Gift class="w-5 h-5 mr-2 text-yellow-500" />
        积分兑换
      </h3>
      
      <div class="grid sm:grid-cols-3 gap-4">
        <div 
          v-for="reward in rewards" 
          :key="reward.id"
          :class="[
            'rounded-xl p-4 border-2 transition-all',
            reward.claimed 
              ? 'bg-gray-50 border-gray-200 opacity-60' 
              : totalPoints >= reward.points 
                ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-400 cursor-pointer' 
                : 'bg-gray-50 border-gray-200'
          ]"
        >
          <div class="text-xl mb-2">🎁</div>
          <div class="font-medium text-gray-800">{{ reward.name }}</div>
          <div class="text-sm text-gray-500 mt-1">{{ reward.description }}</div>
          <div :class="[
            'mt-3 px-3 py-2 rounded-lg text-sm font-medium text-center',
            reward.claimed 
              ? 'bg-gray-200 text-gray-500' 
              : totalPoints >= reward.points 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-200 text-gray-400'
          ]">
            {{ reward.claimed ? '已领取' : totalPoints >= reward.points ? '立即兑换' : reward.points + ' 积分' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
