<script setup>
import { ref, computed, onMounted } from 'vue'
import { BookOpen, RotateCcw, ChevronRight, CheckCircle, X, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-vue-next'

const articles = ref([])
const currentArticle = ref(null)
const showDetail = ref(false)
const currentMode = ref('list') // list, learning, review

const titles = [
  '常用单词', '商务词汇', '旅游英语', '学术词汇',
  '日常对话', '职业英语', '考试词汇', '生活场景'
]

onMounted(function() {
  const saved = localStorage.getItem('reciteArticles')
  if (saved) {
    articles.value = JSON.parse(saved)
  } else {
    initArticles()
  }
})

function initArticles() {
  articles.value = []
  for (let i = 1; i <= 8; i++) {
    articles.value.push({
      id: i,
      title: titles[i - 1] || 'Vocabulary ' + i,
      words: generateWords(10),
      completed: Math.random() > 0.6,
      lastReview: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      reviewCount: Math.floor(Math.random() * 8),
      nextReview: null
    })
  }
  saveToStorage()
}

function generateWords(count) {
  const words = []
  const wordList = [
    { en: 'apple', zh: '苹果' },
    { en: 'book', zh: '书' },
    { en: 'computer', zh: '电脑' },
    { en: 'development', zh: '发展' },
    { en: 'education', zh: '教育' },
    { en: 'friend', zh: '朋友' },
    { en: 'government', zh: '政府' },
    { en: 'happiness', zh: '幸福' },
    { en: 'important', zh: '重要的' },
    { en: 'journey', zh: '旅程' },
    { en: 'knowledge', zh: '知识' },
    { en: 'language', zh: '语言' },
    { en: 'mountain', zh: '山' },
    { en: 'natural', zh: '自然的' },
    { en: 'opportunity', zh: '机会' },
    { en: 'practice', zh: '练习' },
    { en: 'question', zh: '问题' },
    { en: 'research', zh: '研究' },
    { en: 'solution', zh: '解决方案' },
    { en: 'technology', zh: '技术' }
  ]
  
  for (let i = 0; i < count; i++) {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)]
    words.push({
      id: i,
      english: randomWord.en,
      chinese: randomWord.zh,
      reviewed: Math.random() > 0.5,
      correct: Math.floor(Math.random() * 5),
      wrong: Math.floor(Math.random() * 2)
    })
  }
  
  return words
}

function saveToStorage() {
  localStorage.setItem('reciteArticles', JSON.stringify(articles.value))
}

function getOverdueDays(article) {
  if (!article.lastReview) return -1
  const last = new Date(article.lastReview)
  const now = new Date()
  const diff = now - last
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function getStatusStyle(article) {
  if (!article.lastReview) {
    return { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8' }
  }
  
  const days = getOverdueDays(article)
  if (days <= 1) {
    return { bg: '#f0fdf4', border: '#22c55e', text: '#166534' }
  } else if (days <= 3) {
    return { bg: '#fef3c7', border: '#fbbf24', text: '#92400e' }
  } else {
    return { bg: '#fee2e2', border: '#f87171', text: '#991b1b' }
  }
}

function getReviewDots(article) {
  const dots = []
  for (let i = 0; i < 8; i++) {
    dots.push(i < article.reviewCount)
  }
  return dots
}

const stats = computed(function() {
  const totalWords = articles.value.reduce(function(sum, a) { return sum + a.words.length }, 0)
  const reviewedWords = articles.value.reduce(function(sum, a) { 
    return sum + a.words.filter(function(w) { return w.reviewed }).length 
  }, 0)
  const todayPending = articles.value.filter(function(a) {
    if (!a.lastReview) return true
    const days = getOverdueDays(a)
    return days >= 1 || !a.completed
  }).length
  
  return { totalWords: totalWords, reviewedWords: reviewedWords, todayPending: todayPending }
})

function openDetail(article) {
  currentArticle.value = article
  showDetail.value = true
  currentMode.value = 'list'
}

function closeDetail() {
  showDetail.value = false
  currentArticle.value = null
}

function startLearning() {
  currentMode.value = 'learning'
}

const currentWordIndex = ref(0)
const showAnswer = ref(false)
const learningProgress = ref(0)

function markReviewed() {
  if (currentArticle.value && currentArticle.value.words[currentWordIndex.value]) {
    currentArticle.value.words[currentWordIndex.value].reviewed = true
    showAnswer.value = true
    
    setTimeout(function() {
      if (currentWordIndex.value < currentArticle.value.words.length - 1) {
        currentWordIndex.value++
        showAnswer.value = false
        learningProgress.value = ((currentWordIndex.value + 1) / currentArticle.value.words.length) * 100
      } else {
        currentArticle.value.completed = true
        currentArticle.value.lastReview = new Date().toISOString()
        currentArticle.value.reviewCount++
        saveToStorage()
        alert('学习完成！')
        closeDetail()
      }
    }, 1500)
  }
}

function updateReviewStatus() {
  articles.value.forEach(function(article) {
    const reviewedCount = article.words.filter(function(w) { return w.reviewed }).length
    article.completed = reviewedCount === article.words.length
  })
  saveToStorage()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800">背诵记忆</h2>
      <button 
        @click="initArticles"
        class="px-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
      >
        重置数据
      </button>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="bg-blue-50 rounded-xl p-4">
        <div class="text-sm text-blue-600 mb-1">总单词数</div>
        <div class="text-2xl font-bold text-blue-700">{{ stats.totalWords }}</div>
      </div>
      <div class="bg-green-50 rounded-xl p-4">
        <div class="text-sm text-green-600 mb-1">已背诵</div>
        <div class="text-2xl font-bold text-green-700">{{ stats.reviewedWords }}</div>
      </div>
      <div class="bg-purple-50 rounded-xl p-4">
        <div class="text-sm text-purple-600 mb-1">待复习</div>
        <div class="text-2xl font-bold text-purple-700">{{ stats.todayPending }}</div>
      </div>
    </div>

    <div class="space-y-3">
      <div 
        v-for="article in articles" 
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
              <BookOpen :class="['w-5 h-5', getStatusStyle(article).text]" />
            </div>
            <div>
              <div class="font-medium text-gray-800">{{ article.title }}</div>
              <div class="text-sm text-gray-500 flex items-center space-x-2">
                <span>{{ article.words.length }} 个单词</span>
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
          
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>

    <div v-if="showDetail && currentArticle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl w-full max-w-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">{{ currentArticle.title }}</h3>
          <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <div v-if="currentMode === 'list'" class="space-y-3 max-h-80 overflow-y-auto">
          <div 
            v-for="(word, index) in currentArticle.words" 
            :key="word.id"
            :class="[
              'flex items-center justify-between p-3 rounded-lg',
              word.reviewed ? 'bg-green-50' : 'bg-gray-50'
            ]"
          >
            <div>
              <div class="font-medium text-gray-800">{{ word.english }}</div>
              <div class="text-sm text-gray-500">{{ word.chinese }}</div>
            </div>
            <CheckCircle v-if="word.reviewed" class="w-5 h-5 text-green-500" />
          </div>
          
          <button 
            @click="startLearning"
            class="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all"
          >
            开始学习
          </button>
        </div>
        
        <div v-else-if="currentMode === 'learning'" class="space-y-6">
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              class="h-full bg-blue-500 rounded-full transition-all"
              :style="{ width: learningProgress + '%' }"
            ></div>
          </div>
          
          <div class="text-center py-12">
            <div class="text-4xl font-bold text-gray-800 mb-4">
              {{ currentArticle.words[currentWordIndex].english }}
            </div>
            <div v-if="showAnswer" class="text-2xl text-gray-500">
              {{ currentArticle.words[currentWordIndex].chinese }}
            </div>
          </div>
          
          <button 
            @click="markReviewed"
            :disabled="showAnswer"
            :class="[
              'w-full py-3 rounded-xl font-medium transition-all',
              showAnswer ? 'bg-gray-200 text-gray-400' : 'bg-green-500 text-white hover:bg-green-600'
            ]"
          >
            {{ showAnswer ? '自动跳转中...' : '认识，下一个' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
