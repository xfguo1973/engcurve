<script setup>
import { ref, computed, onMounted } from 'vue'
import { X } from 'lucide-vue-next'

const today = new Date().toISOString().split('T')[0]
const showDetailModal = ref(false)
const selectedArticle = ref(null)
const articles = ref([])

// 艾宾浩斯复习间隔（天数）
const reviewIntervals = [0, 1, 3, 6, 13, 29, 59] // 第1、2、4、7、14、30、60天
const reviewLabels = ['第1天', '第2天', '第4天', '第7天', '第14天', '第30天', '第60天']

onMounted(() => {
  const saved = localStorage.getItem('reciteArticles')
  if (saved) {
    articles.value = JSON.parse(saved)
    updateReviewStatus()
  } else {
    initArticles()
  }
})

const initArticles = () => {
  const arr = []
  const titles = [
    'The Power of Reading', 'Morning Routine', 'Travel Dreams', 'Friendship', 'Nature Beauty',
    'Technology Today', 'Healthy Living', 'Music Love', 'Family Time', 'Career Goals',
    'Learning English', 'Books I Love', 'Food Culture', 'Season Changes', 'City Life',
    'Sports Spirit', 'Art Appreciation', 'Science Wonder', 'History Stories', 'Future Vision'
  ]
  for (let i = 1; i <= 20; i++) {
    arr.push({
      id: i,
      title: titles[i - 1] || `Passage ${i}`,
      status: 'not_started',
      reviews: [],
      lastStudyDate: null
    })
  }
  articles.value = arr
  saveToStorage()
}

const saveToStorage = () => {
  localStorage.setItem('reciteArticles', JSON.stringify(articles.value))
}

const getOverdueDays = (article) => {
  if (!article.lastStudyDate || article.status === 'not_started' || article.status === 'mastered') {
    return 0
  }
  
  const nextReviewIndex = article.reviews.length
  if (nextReviewIndex >= reviewIntervals.length) {
    return 0
  }
  
  const last = new Date(article.lastStudyDate)
  const now = new Date()
  const daysSinceLast = Math.floor((now - last) / (1000 * 60 * 60 * 24))
  const expectedDays = reviewIntervals[nextReviewIndex]
  
  return Math.max(0, daysSinceLast - expectedDays)
}

const getStatusStyle = (article) => {
  const overdueDays = getOverdueDays(article)
  
  switch (article.status) {
    case 'not_started':
      return { bg: 'bg-gray-50', border: 'border-gray-200', label: '未开始', labelClass: 'bg-gray-100 text-gray-600' }
    case 'mastered':
      return { bg: 'bg-green-50', border: 'border-green-300', label: '已完成', labelClass: 'bg-green-100 text-green-600' }
    case 'learning':
    case 'pending':
      if (overdueDays === 0 && article.reviews.length > 0) {
        return { bg: 'bg-blue-50', border: 'border-blue-300', label: '待复习', labelClass: 'bg-blue-100 text-blue-600' }
      } else if (overdueDays > 0) {
        return { bg: 'bg-red-50', border: 'border-red-300', label: '紧急', labelClass: 'bg-red-100 text-red-600' }
      }
      return { bg: 'bg-blue-50', border: 'border-blue-300', label: '待复习', labelClass: 'bg-blue-100 text-blue-600' }
    default:
      return { bg: 'bg-gray-50', border: 'border-gray-200', label: '未知', labelClass: 'bg-gray-100 text-gray-600' }
  }
}

const getReviewDots = (article) => {
  const dots = []
  const todayIndex = article.reviews.length
  for (let i = 0; i < 7; i++) {
    if (i < article.reviews.length) {
      dots.push({ type: 'completed', label: reviewLabels[i] })
    } else if (i === todayIndex && article.status !== 'not_started' && article.status !== 'mastered') {
      dots.push({ type: 'today', label: reviewLabels[i] })
    } else {
      dots.push({ type: 'pending', label: reviewLabels[i] })
    }
  }
  return dots
}

const updateReviewStatus = () => {
  articles.value.forEach(article => {
    if (article.status === 'learning' || article.status === 'pending') {
      const nextReviewIndex = article.reviews.length
      if (nextReviewIndex >= reviewIntervals.length) {
        article.status = 'mastered'
        return
      }
      
      if (!article.lastStudyDate) return
      
      const last = new Date(article.lastStudyDate)
      const now = new Date()
      const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24))
      
      if (diffDays >= reviewIntervals[nextReviewIndex]) {
        article.status = 'pending'
      }
    }
  })
}

const stats = computed(() => {
  const todayPending = articles.value.filter(a => {
    const days = getOverdueDays(a)
    return days === 0 && a.status !== 'not_started' && a.status !== 'mastered'
  }).length
  const mastered = articles.value.filter(a => a.status === 'mastered').length
  const continuousDays = 12
  const retentionRate = 87
  
  return { todayPending, mastered, continuousDays, retentionRate }
})

const openDetail = (article) => {
  selectedArticle.value = article
  showDetailModal.value = true
}

const closeDetail = () => {
  showDetailModal.value = false
  selectedArticle.value = null
}

const startLearning = () => {
  if (!selectedArticle.value) return
  
  const article = articles.value.find(a => a.id === selectedArticle.value.id)
  if (article) {
    article.status = 'learning'
    article.reviews = [today]
    article.lastStudyDate = today
    updateReviewStatus()
    saveToStorage()
    closeDetail()
  }
}

const markReviewed = () => {
  if (!selectedArticle.value) return
  
  const article = articles.value.find(a => a.id === selectedArticle.value.id)
  if (article) {
    const nextReviewIndex = article.reviews.length
    if (nextReviewIndex < reviewIntervals.length) {
      article.reviews.push(today)
      article.lastStudyDate = today
      updateReviewStatus()
      saveToStorage()
      closeDetail()
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-blue-50 rounded-xl p-4">
        <div class="text-sm text-blue-600 mb-1">今日待复习</div>
        <div class="text-2xl font-bold text-blue-700">{{ stats.todayPending }}</div>
      </div>
      <div class="bg-green-50 rounded-xl p-4">
        <div class="text-sm text-green-600 mb-1">已掌握</div>
        <div class="text-2xl font-bold text-green-700">{{ stats.mastered }}</div>
      </div>
      <div class="bg-orange-50 rounded-xl p-4">
        <div class="text-sm text-orange-600 mb-1">连续打卡</div>
        <div class="text-2xl font-bold text-orange-700">{{ stats.continuousDays }}天</div>
      </div>
      <div class="bg-purple-50 rounded-xl p-4">
        <div class="text-sm text-purple-600 mb-1">记忆保留率</div>
        <div class="text-2xl font-bold text-purple-700">{{ stats.retentionRate }}%</div>
      </div>
    </div>

    <!-- 遗忘曲线图 -->
    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-6">艾宾浩斯遗忘曲线</h2>
      <div class="relative h-64">
        <svg class="w-full h-full" viewBox="0 0 400 200">
          <!-- 网格线 -->
          <line v-for="i in 5" :key="`h-${i}`" x1="50" :y1="30 + i * 34" x2="380" :y2="30 + i * 34" stroke="#f3f4f6" stroke-width="1" />
          <line v-for="i in 8" :key="`v-${i}`" :x1="50 + i * 40" y1="30" :x2="50 + i * 40" y2="190" stroke="#f3f4f6" stroke-width="1" />
          
          <!-- 自然遗忘曲线（虚线） -->
          <path d="M 50 30 Q 150 100, 250 140 T 380 170" stroke="#e5e7eb" stroke-width="2" stroke-dasharray="5,5" fill="none" />
          
          <!-- 复习后记忆曲线（蓝色实线） -->
          <path d="M 50 30 L 80 40 L 120 35 L 160 50 L 200 45 L 240 60 L 280 55 L 320 70 L 360 65 L 380 75" stroke="#3b82f6" stroke-width="3" fill="none" />
          
          <!-- 数据点 -->
          <circle cx="50" cy="30" r="4" fill="#3b82f6" />
          <circle cx="80" cy="40" r="4" fill="#3b82f6" />
          <circle cx="120" cy="35" r="4" fill="#3b82f6" />
          <circle cx="160" cy="50" r="4" fill="#3b82f6" />
          <circle cx="200" cy="45" r="4" fill="#3b82f6" />
          <circle cx="240" cy="60" r="4" fill="#3b82f6" />
          <circle cx="280" cy="55" r="4" fill="#3b82f6" />
          <circle cx="320" cy="70" r="4" fill="#3b82f6" />
          <circle cx="360" cy="65" r="4" fill="#3b82f6" />
          <circle cx="380" cy="75" r="4" fill="#3b82f6" />
        </svg>
        <div class="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-xs text-gray-400">
          <span>0天</span>
          <span>7天</span>
          <span>14天</span>
          <span>21天</span>
          <span>30天</span>
        </div>
        <div class="absolute top-0 left-0 flex flex-col justify-between h-full text-xs text-gray-400" style="width: 40px;">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        <!-- 图例 -->
        <div class="absolute bottom-8 right-8 flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-0.5 bg-gray-300" style="background: repeating-linear-gradient(to right, #e5e7eb, #e5e7eb 5px, transparent 5px, transparent 10px);"></div>
            <span class="text-xs text-gray-500">自然遗忘</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-0.5 bg-blue-500"></div>
            <span class="text-xs text-gray-500">复习后记忆</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 复习节点时间轴 -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
      <h2 class="text-lg font-semibold mb-4">艾宾浩斯复习节点</h2>
      <div class="flex items-center justify-between">
        <div 
          v-for="(label, index) in reviewLabels" 
          :key="index"
          class="flex flex-col items-center"
        >
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium mb-2">
            {{ index + 1 }}
          </div>
          <span class="text-xs">{{ label }}</span>
        </div>
      </div>
    </div>

    <!-- 短文列表 -->
    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">短文列表</h2>
      <div class="space-y-3">
        <div
          v-for="article in articles"
          :key="article.id"
          @click="openDetail(article)"
          :class="[
            'p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md',
            getStatusStyle(article).bg,
            getStatusStyle(article).border
          ]"
        >
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="font-medium text-gray-800">第 {{ article.id }} 篇 · {{ article.title }}</h3>
            </div>
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusStyle(article).labelClass]">
              {{ getStatusStyle(article).label }}
            </span>
          </div>
          <!-- 复习节点 -->
          <div class="flex items-center gap-2">
            <div
              v-for="(dot, index) in getReviewDots(article)"
              :key="index"
              class="flex flex-col items-center"
            >
              <div :class="[
                'w-3 h-3 rounded-full',
                dot.type === 'completed' ? 'bg-blue-500' :
                dot.type === 'today' ? 'bg-yellow-400' : 'bg-gray-300'
              ]"></div>
              <span class="text-xs text-gray-400 mt-1">{{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div
      v-if="showDetailModal && selectedArticle"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeDetail"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">第 {{ selectedArticle.id }} 篇</h3>
          <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="mb-4">
          <h4 class="font-medium text-gray-800 mb-2">{{ selectedArticle.title }}</h4>
          <span :class="['px-3 py-1.5 rounded-full text-sm font-medium', getStatusStyle(selectedArticle).labelClass]">
            {{ getStatusStyle(selectedArticle).label }}
          </span>
        </div>

        <div class="mb-6">
          <div class="text-sm text-gray-500 mb-3">复习进度</div>
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="(dot, index) in getReviewDots(selectedArticle)"
              :key="index"
              :class="[
                'py-2 rounded-lg text-center text-xs font-medium transition-all',
                dot.type === 'completed' ? 'bg-green-100 text-green-600' :
                dot.type === 'today' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
              ]"
            >
              {{ dot.label }}
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button
            v-if="selectedArticle.status === 'not_started'"
            @click="startLearning"
            class="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
          >
            开始背诵
          </button>
          <button
            v-else-if="selectedArticle.status !== 'mastered'"
            @click="markReviewed"
            class="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
          >
            标记已复习
          </button>
          <div
            v-else
            class="w-full py-3 bg-gray-100 text-gray-500 rounded-xl text-center font-medium"
          >
            ✓ 已完成全部复习
          </div>
        </div>
      </div>
    </div>
  </div>
</template>