<script setup>
import { ref } from 'vue'

const settings = ref({
  dailyReminder: true,
  dataBackup: true,
  soundEffect: false,
  darkMode: false,
  autoCheckin: false
})

const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

function logout() {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('currentUser')
    window.location.href = '/engcurve/'
  }
}

function exportData() {
  const data = {
    listeningArticles: localStorage.getItem('listeningArticles'),
    reciteArticles: localStorage.getItem('reciteArticles'),
    checkinDays: localStorage.getItem('checkinDays')
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'engcurve-backup-' + new Date().toISOString().split('T')[0] + '.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  alert('数据已导出！')
}

function importData() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = function(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function(event) {
        try {
          const data = JSON.parse(event.target.result)
          if (data.listeningArticles) localStorage.setItem('listeningArticles', data.listeningArticles)
          if (data.reciteArticles) localStorage.setItem('reciteArticles', data.reciteArticles)
          if (data.checkinDays) localStorage.setItem('checkinDays', data.checkinDays)
          alert('数据导入成功！')
        } catch (err) {
          alert('导入失败，请确保文件格式正确')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

function clearAllData() {
  if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
    localStorage.clear()
    alert('数据已清空！')
  }
}

function getUserNameFirstChar() {
  if (currentUser.name && currentUser.name.length > 0) {
    return currentUser.name.charAt(0)
  }
  return '用'
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-6">基本设置</h2>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 class="font-medium text-gray-800">每日提醒</h3>
            <p class="text-sm text-gray-500">每天定时提醒您学习打卡</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.dailyReminder" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 class="font-medium text-gray-800">数据备份</h3>
            <p class="text-sm text-gray-500">自动备份学习数据</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.dataBackup" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 class="font-medium text-gray-800">音效</h3>
            <p class="text-sm text-gray-500">完成打卡时播放提示音</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.soundEffect" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 class="font-medium text-gray-800">深色模式</h3>
            <p class="text-sm text-gray-500">使用深色主题界面</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.darkMode" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-4">
          <div>
            <h3 class="font-medium text-gray-800">自动打卡</h3>
            <p class="text-sm text-gray-500">完成学习后自动打卡</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.autoCheckin" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-6">数据管理</h2>
      
      <div class="space-y-3">
        <button @click="exportData" class="w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-left">
          <div class="font-medium">导出数据</div>
          <div class="text-sm opacity-70">将学习数据导出为JSON文件</div>
        </button>

        <button @click="importData" class="w-full py-3 px-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-left">
          <div class="font-medium">导入数据</div>
          <div class="text-sm opacity-70">从JSON文件导入学习数据</div>
        </button>

        <button @click="clearAllData" class="w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-left">
          <div class="font-medium">清空数据</div>
          <div class="text-sm opacity-70">删除所有学习数据（不可恢复）</div>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-6">账户信息</h2>
      
      <div class="flex items-center space-x-4 mb-6">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <span class="text-white text-2xl font-bold">{{ getUserNameFirstChar() }}</span>
        </div>
        <div>
          <div class="font-semibold text-gray-800">{{ currentUser.name || '未设置' }}</div>
        </div>
      </div>

      <button @click="logout" class="w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium">
        退出登录
      </button>
    </div>

    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">关于</h2>
      <div class="text-sm text-gray-500 space-y-2">
        <p>英语打卡 v1.0.0</p>
        <p>基于艾宾浩斯遗忘曲线的英语学习工具</p>
        <p>帮助您科学地复习和记忆英语知识</p>
      </div>
    </div>
  </div>
</template>
