<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import OverviewCards from './components/OverviewCards.vue'
import ModuleProgress from './components/ModuleProgress.vue'
import ListeningPage from './components/ListeningPage.vue'
import { Menu, X } from 'lucide-vue-next'

const activeNav = ref('overview')
const sidebarOpen = ref(false)

const setActiveNav = (nav) => {
  activeNav.value = nav
  sidebarOpen.value = false
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar :activeNav="activeNav" @setActiveNav="setActiveNav" :sidebarOpen="sidebarOpen" />
    
    <!-- Mobile overlay -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header @toggleSidebar="toggleSidebar" />
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <div class="max-w-7xl mx-auto">
          <template v-if="activeNav === 'overview'">
            <OverviewCards />
            <ModuleProgress />
          </template>
          <template v-else-if="activeNav === 'daily'">
            <div class="bg-white rounded-xl p-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">今日打卡</h2>
              <p class="text-gray-500">点击下方按钮完成今日打卡任务</p>
              <div class="mt-6 grid grid-cols-3 gap-4">
                <div class="bg-green-50 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-green-600">✓</div>
                  <div class="text-sm text-gray-600 mt-2">英语听力</div>
                  <div class="text-xs text-gray-400">已完成</div>
                </div>
                <div class="bg-orange-50 rounded-lg p-4 text-center">
                  <button class="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    开始背诵
                  </button>
                  <div class="text-sm text-gray-600 mt-2">英语背诵</div>
                  <div class="text-xs text-gray-400">待完成</div>
                </div>
                <div class="bg-red-50 rounded-lg p-4 text-center">
                  <button class="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    开始口语
                  </button>
                  <div class="text-sm text-gray-600 mt-2">英语口语</div>
                  <div class="text-xs text-gray-400">待完成</div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="activeNav === 'listening'">
            <ListeningPage />
          </template>
          <template v-else-if="activeNav === 'recite'">
            <div class="bg-white rounded-xl p-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">英语背诵</h2>
              <div class="space-y-4">
                <div class="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div class="flex items-center justify-between">
                    <span>核心词汇 · 第1单元</span>
                    <span class="text-green-500 text-sm">已完成</span>
                  </div>
                </div>
                <div class="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div class="flex items-center justify-between">
                    <span>核心词汇 · 第2单元</span>
                    <span class="text-orange-500 text-sm">待复习</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="activeNav === 'speaking'">
            <div class="bg-white rounded-xl p-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">英语口语</h2>
              <div class="space-y-4">
                <div class="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div class="flex items-center justify-between">
                    <span>日常对话 · 问候</span>
                    <span class="text-green-500 text-sm">已完成</span>
                  </div>
                </div>
                <div class="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div class="flex items-center justify-between">
                    <span>日常对话 · 点餐</span>
                    <span class="text-red-500 text-sm">漏打卡</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="activeNav === 'statistics'">
            <div class="bg-white rounded-xl p-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">学习统计</h2>
              <div class="grid grid-cols-4 gap-4">
                <div class="bg-blue-50 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-blue-600">45</div>
                  <div class="text-sm text-gray-600 mt-1">总打卡次数</div>
                </div>
                <div class="bg-green-50 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-green-600">12</div>
                  <div class="text-sm text-gray-600 mt-1">连续天数</div>
                </div>
                <div class="bg-orange-50 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-orange-600">85%</div>
                  <div class="text-sm text-gray-600 mt-1">完成率</div>
                </div>
                <div class="bg-purple-50 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-purple-600">21</div>
                  <div class="text-sm text-gray-600 mt-1">最长连续</div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="activeNav === 'calendar'">
            <div class="bg-white rounded-xl p-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">打卡日历</h2>
              <div class="grid grid-cols-7 gap-2 text-center">
                <div class="text-gray-400 text-sm py-2">日</div>
                <div class="text-gray-400 text-sm py-2">一</div>
                <div class="text-gray-400 text-sm py-2">二</div>
                <div class="text-gray-400 text-sm py-2">三</div>
                <div class="text-gray-400 text-sm py-2">四</div>
                <div class="text-gray-400 text-sm py-2">五</div>
                <div class="text-gray-400 text-sm py-2">六</div>
                <div class="py-2">1</div>
                <div class="py-2">2</div>
                <div class="py-2">3</div>
                <div class="py-2">4</div>
                <div class="py-2">5</div>
                <div class="py-2">6</div>
                <div class="py-2">7</div>
                <div class="py-2">8</div>
                <div class="py-2">9</div>
                <div class="bg-green-500 text-white rounded-full py-2">10</div>
                <div class="bg-green-500 text-white rounded-full py-2">11</div>
                <div class="bg-green-500 text-white rounded-full py-2">12</div>
                <div class="bg-green-500 text-white rounded-full py-2">13</div>
                <div class="bg-green-500 text-white rounded-full py-2">14</div>
                <div class="bg-green-500 text-white rounded-full py-2">15</div>
                <div class="bg-green-500 text-white rounded-full py-2">16</div>
                <div class="bg-green-500 text-white rounded-full py-2">17</div>
                <div class="bg-green-500 text-white rounded-full py-2">18</div>
                <div class="bg-green-500 text-white rounded-full py-2">19</div>
                <div class="bg-green-500 text-white rounded-full py-2">20</div>
                <div class="bg-green-500 text-white rounded-full py-2">21</div>
                <div class="bg-green-500 text-white rounded-full py-2">22</div>
                <div class="bg-green-500 text-white rounded-full py-2">23</div>
                <div class="bg-green-500 text-white rounded-full py-2">24</div>
                <div class="bg-green-500 text-white rounded-full py-2">25</div>
                <div class="bg-green-500 text-white rounded-full py-2">26</div>
                <div class="bg-green-500 text-white rounded-full py-2">27</div>
                <div class="bg-green-500 text-white rounded-full py-2">28</div>
                <div class="py-2">29</div>
                <div class="py-2">30</div>
              </div>
            </div>
          </template>
          <template v-else-if="activeNav === 'settings'">
            <div class="bg-white rounded-xl p-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">设置</h2>
              <div class="space-y-4">
                <div class="flex items-center justify-between py-3 border-b">
                  <span class="text-gray-700">每日提醒</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between py-3 border-b">
                  <span class="text-gray-700">数据备份</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between py-3 border-b">
                  <span class="text-gray-700">音效</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </template>
        </div>
      </main>
    </div>
  </div>
</template>
