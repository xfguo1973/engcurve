<script setup>
import { ref, computed, onMounted } from 'vue'
import { Play, Pause, RotateCcw, ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-vue-next'

const articles = ref([])
const currentArticle = ref(null)
const isPlaying = ref(false)
const showDetail = ref(false)
const reviewMode = ref(false)

const titles = [
  'Daily Routine', 'Travel Plans', 'Food and Health', 'Work Life', 
  'Shopping Experience', 'Weather Forecast', 'Family Time', 'Hobbies',
  'Education', 'Technology'
]

onMounted(function() {
  loadArticles()
})

function loadArticles() {
  const saved = localStorage.getItem('listeningArticles')
  if (saved) {
    articles.value = JSON.parse(saved)
  } else {
    initArticles()
  }
}

function saveArticles() {
  localStorage.setItem('listeningArticles', JSON.stringify(articles.value))
}

function initArticles() {
  articles.value = []
  for (let i = 1; i <= 10; i++) {
    articles.value.push({
      id: i,
      title: titles[i - 1] || 'Passage ' + i,
      content: 'This is the content of listening passage ' + i + '. It contains useful vocabulary and grammar for English learners.',
      completed: Math.random() > 0.5,
      lastReview: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      reviewCount: Math.floor(Math.random() * 5),
      nextReview: null
    })
  }
  saveArticles()
}

function resetArticles() {
  if (confirm('确定要重置所有听力数据吗？')) {
    initArticles()
    alert('数据已重置！')
  }
}

const filteredArticles = computed(function() {
  if (!reviewMode.value) {
    return articles.value
  }
  return articles.value.filter(function(a) {
    return !a.completed || (a.lastReview && shouldReview(a))
  })
})

const stats = computed(function() {
  const completed = articles.value.filter(function(a) { return a.completed }).length
  const total = articles.value.length
  return { completed: completed, total: total, percent: Math.round((completed / total) * 100) }
})

const progress = computed(function() {
  return Math.round((stats.value.completed / stats.value.total) * 100)
})

const overdueList = computed(function() {
  return articles.value.filter(function(a) { return a.lastReview && shouldReview(a) && !a.completed })
})

const todayDueList = computed(function() {
  return articles.value.filter(function(a) { 
    if (!a.lastReview) return false
    const days = getOverdueDays(a)
    return days >= 0 && days <= 1 && !a.completed
  })
})

function getOverdueDays(article) {
  if (!article.lastReview) return -1
  const last = new Date(article.lastReview)
  const now = new Date()
  const diff = now - last
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function shouldReview(article) {
  const days = getOverdueDays(article)
  return days >= 1
}

function getStatusStyle(article) {
  if (!article.lastReview) {
    return { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8', badge: null }
  }
  
  const days = getOverdueDays(article)
  if (days <= 1) {
    return { bg: '#f0fdf4', border: '#22c55e', text: '#166534', badge: null }
  } else if (days <= 3) {
    return { bg: '#fef3c7', border: '#fbbf24', text: '#92400e', badge: { text: '+' + days + '天', class: 'bg-yellow-500' } }
  } else if (days <= 5) {
    return { bg: '#ffedd5', border: '#fb923c', text: '#c2410c', badge: { text: '+' + days + '天', class: 'bg-orange-500' } }
  } else {
    return { bg: '#fee2e2', border: '#f87171', text: '#991b1b', badge: { text: '+' + days + '天', class: 'bg-red-500' } }
  }
}

function getReviewDots(article) {
  const dots = []
  for (let i = 0; i < 5; i++) {
    dots.push(i < article.reviewCount)
  }
  return dots
}

function openDetail(article) {
  currentArticle.value = article
  showDetail.value = true
}

function closeDetail() {
  showDetail.value = false
  currentArticle.value = null
  isPlaying.value = false
}

function startLearning() {
  isPlaying.value = true
  setTimeout(function() {
    isPlaying.value = false
  }, 5000)
}

function markReviewed() {
  if (currentArticle.value) {
    currentArticle.value.completed = true
    currentArticle.value.lastReview = new Date().toISOString()
    currentArticle.value.reviewCount++
    saveArticles()
    closeDetail()
    alert('学习完成！')
  }
}

function markReviewedDirect(article) {
  article.completed = true
  article.lastReview = new Date().toISOString()
  article.reviewCount++
  saveArticles()
}

function checkAllOverdue() {
  overdueList.value.forEach(function(article) {
    markReviewedDirect(article)
  })
  alert('已完成所有逾期任务！')
}

function checkAllToday() {
  todayDueList.value.forEach(function(article) {
    markReviewedDirect(article)
  })
  alert('已完成所有今日任务！')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800">听力训练</h2>
      <button 
        @click="resetArticles"
        class="px-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
      >
        重置数据
      </button>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="bg-blue-50 rounded-xl p-4">
        <div class="text-sm text-blue-600 mb-1">总任务</div>
        <div class="text-2xl font-bold text-blue-700">{{ stats.total }}</div>
      </div>
      <div class="bg-green-50 rounded-xl p-4">
        <div class="text-sm text-green-600 mb-1">已完成</div>
        <div class="text-2xl font-bold text-green-700">{{ stats.completed }}</div>
      </div>
      <div class="bg-purple-50 rounded-xl p-4">
        <div class="text-sm text-purple-600 mb-1">完成率</div>
        <div class="text-2xl font-bold text-purple-700">{{ stats.percent }}%</div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-800">学习进度</h3>
        <span class="text-sm text-gray-500">{{ stats.completed }}/{{ stats.total }}</span>
      </div>
      <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>

    <div class="flex items-center space-x-4">
      <button 
        @click="reviewMode = false"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all',
          !reviewMode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
        ]"
      >
        全部
      </button>
      <button 
        @click="reviewMode = true"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all',
          reviewMode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
        ]"
      >
        待复习
      </button>
      <button 
        v-if="overdueList.length > 0"
        @click="checkAllOverdue"
        class="ml-auto px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all"
      >
        完成全部逾期 ({{ overdueList.length }})
      </button>
      <button 
        v-if="todayDueList.length > 0"
        @click="checkAllToday"
        class="px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-all"
      >
        完成今日任务 ({{ todayDueList.length }})
      </button>
    </div>

    <div class="space-y-3">
      <div 
        v-for="article in filteredArticles" 
        :key="article.id"
        @click="openDetail(article)"
        :class="[
          'bg-white rounded-xl p-4 cursor-pointer hover:shadow-md transition-all border-l-4',
          getStatusStyle(article).border
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', getStatusStyle(article).bg]">
              <Clock :class="['w-5 h-5', getStatusStyle(article).text]" />
            </div>
            <div>
              <div class="font-medium text-gray-800">{{ article.title }}</div>
              <div class="text-sm text-gray-500 flex items-center space-x-2">
                <span>复习 {{ article.reviewCount }} 次</span>
                <div class="flex space-x-1">
                  <span 
                    v-for="(dot, index) in getReviewDots(article)" 
                    :key="index"
                    :class="[
                      'w-2 h-2 rounded-full',
                      dot ? 'bg-green-500' : 'bg-gray-200'
                    ]"
                  ></span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <span 
              v-if="getStatusStyle(article).badge"
              :class="[
                'px-2 py-1 text-xs text-white rounded-full',
                getStatusStyle(article).badge.class
              ]"
            >
              {{ getStatusStyle(article).badge.text }}
            </span>
            <ChevronRight class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDetail && currentArticle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl w-full max-w-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">{{ currentArticle.title }}</h3>
          <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        
        <div class="bg-gray-50 rounded-xl p-4 mb-6">
          <p class="text-gray-700 leading-relaxed">{{ currentArticle.content }}</p>
        </div>
        
        <div class="flex items-center justify-center space-x-4">
          <button 
            @click="startLearning"
            :disabled="isPlaying"
            :class="[
              'flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all',
              isPlaying ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'
            ]"
          >
            <Play v-if="!isPlaying" class="w-5 h-5" />
            <Pause v-else class="w-5 h-5" />
            <span>{{ isPlaying ? '播放中...' : '开始播放' }}</span>
          </button>
          
          <button 
            @click="markReviewed"
            class="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all"
          >
            <CheckCircle class="w-5 h-5" />
            <span>标记完成</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
