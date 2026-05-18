<script setup>
import { ref, computed, onMounted } from 'vue'
import { Play, ChevronRight, Clock, CheckCircle } from 'lucide-vue-next'

const reviewIntervals = [1, 2, 4, 7, 15, 30]
const activeTab = ref('all')
const articles = ref([])
const currentArticle = ref(null)
const showDetail = ref(false)

const titles = Array.from({ length: 100 }, (_, index) => `听力篇章 ${index + 1}`)

onMounted(() => {
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

function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function formatDate(value) {
  if (!value) return '暂无'
  const date = new Date(value)
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

function isToday(value) {
  if (!value) return false
  const target = new Date(value)
  const now = new Date()
  return target.getFullYear() === now.getFullYear() && target.getMonth() === now.getMonth() && target.getDate() === now.getDate()
}

function initArticles() {
  articles.value = []
  for (let i = 1; i <= 100; i++) {
    const reviewCount = Math.floor(Math.random() * 7)
    const reviewHistory = []
    let nextReview = null
    let lastReview = null
    let mastered = false

    if (reviewCount > 0) {
      let reviewDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      reviewHistory.push({ date: reviewDate.toISOString(), status: '初次学习' })
      for (let j = 1; j < reviewCount; j++) {
        reviewDate = addDays(reviewDate, reviewIntervals[j - 1])
        reviewHistory.push({ date: reviewDate.toISOString(), status: `复习第 ${j + 1} 次` })
      }
      lastReview = reviewDate.toISOString()
      mastered = reviewCount >= 6
      if (!mastered) {
        nextReview = addDays(reviewDate, reviewIntervals[reviewCount - 1]).toISOString()
      }
    }

    articles.value.push({
      id: i,
      title: titles[i - 1],
      content: `这是第 ${i} 篇听力内容，包含实用听力练习和复习提示。`,
      reviewCount,
      reviewHistory,
      lastReview,
      nextReview,
      mastered
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

function getOverdueDays(article) {
  if (!article.nextReview) return 0
  const diff = Date.now() - new Date(article.nextReview).getTime()
  return diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0
}

function getState(article) {
  if (article.mastered) return 'mastered'
  if (article.reviewCount === 0) return 'notStarted'
  const overdueDays = getOverdueDays(article)
  if (overdueDays > 0) return 'overdue'
  if (article.nextReview && isToday(article.nextReview)) return 'today'
  return 'learning'
}

function getStatusStyle(article) {
  const state = getState(article)
  if (state === 'mastered') {
    return { card: 'border-emerald-200 bg-emerald-50', badge: 'bg-emerald-500', label: '已掌握' }
  }
  if (state === 'notStarted') {
    return { card: 'border-slate-200 bg-slate-50', badge: 'bg-slate-400', label: '未开始' }
  }
  if (state === 'today') {
    return { card: 'border-violet-200 bg-violet-50', badge: 'bg-violet-500', label: '学习中' }
  }
  const overdueDays = getOverdueDays(article)
  if (overdueDays <= 3) {
    return { card: 'border-amber-200 bg-amber-50', badge: 'bg-amber-500', label: '逾期1-3天' }
  }
  if (overdueDays <= 7) {
    return { card: 'border-orange-200 bg-orange-50', badge: 'bg-orange-500', label: '逾期4-7天' }
  }
  return { card: 'border-rose-200 bg-rose-50', badge: 'bg-rose-500', label: '逾期7天以上' }
}

function updateReview(article) {
  const now = new Date()
  article.reviewCount += 1
  article.reviewHistory.push({ date: now.toISOString(), status: article.reviewCount >= 6 ? '已掌握' : `复习第 ${article.reviewCount} 次` })
  article.lastReview = now.toISOString()
  article.mastered = article.reviewCount >= 6
  article.nextReview = article.mastered ? null : addDays(now, reviewIntervals[article.reviewCount - 1]).toISOString()
  saveArticles()
}

function markReviewed(article) {
  if (!article) return
  updateReview(article)
  closeDetail()
  alert('已记录复习，继续保持！')
}

const filteredArticles = computed(() => {
  return articles.value.filter((article) => {
    const state = getState(article)
    if (activeTab.value === 'all') return true
    if (activeTab.value === 'overdue') return state === 'overdue'
    if (activeTab.value === 'today') return state === 'today'
    if (activeTab.value === 'learning') return state === 'learning'
    if (activeTab.value === 'mastered') return state === 'mastered'
    if (activeTab.value === 'notStarted') return state === 'notStarted'
    return true
  })
})

const overdueList = computed(() => articles.value.filter((article) => getState(article) === 'overdue'))
const todayDueList = computed(() => articles.value.filter((article) => getState(article) === 'today'))
const learningCount = computed(() => articles.value.filter((article) => getState(article) === 'learning').length)
const masteredCount = computed(() => articles.value.filter((article) => getState(article) === 'mastered').length)
const notStartedCount = computed(() => articles.value.filter((article) => getState(article) === 'notStarted').length)

const stats = computed(() => ({
  total: articles.value.length,
  mastered: masteredCount.value,
  today: todayDueList.value.length,
  overdue: overdueList.value.length,
  percent: Math.round((masteredCount.value / articles.value.length) * 100)
}))

const progress = computed(() => Math.round((stats.value.mastered / stats.value.total) * 100))

function openDetail(article) {
  currentArticle.value = article
  showDetail.value = true
}

function closeDetail() {
  showDetail.value = false
  currentArticle.value = null
}

function checkAllToday() {
  todayDueList.value.forEach((article) => updateReview(article))
  alert('今日到期任务已一键打卡')
}

function catchUpOverdue() {
  overdueList.value.forEach((article) => updateReview(article))
  alert('逾期任务已一键补签')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-slate-900">听力训练</h2>
      <button @click="resetArticles" class="rounded-2xl border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-100 transition">重置数据</button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-3xl bg-sky-50 p-5 border border-sky-100">
        <div class="text-sm text-sky-600">总听力</div>
        <div class="mt-2 text-3xl font-semibold text-slate-900">{{ stats.total }}</div>
      </div>
      <div class="rounded-3xl bg-amber-50 p-5 border border-amber-100">
        <div class="text-sm text-amber-600">今日到期</div>
        <div class="mt-2 text-3xl font-semibold text-slate-900">{{ stats.today }}</div>
      </div>
      <div class="rounded-3xl bg-rose-50 p-5 border border-rose-100">
        <div class="text-sm text-rose-600">逾期任务</div>
        <div class="mt-2 text-3xl font-semibold text-slate-900">{{ stats.overdue }}</div>
      </div>
      <div class="rounded-3xl bg-emerald-50 p-5 border border-emerald-100">
        <div class="text-sm text-emerald-600">已掌握</div>
        <div class="mt-2 text-3xl font-semibold text-slate-900">{{ stats.mastered }}</div>
      </div>
    </div>

    <div class="rounded-3xl bg-white p-6 border border-slate-100">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="text-sm text-slate-500">复习进度</div>
          <div class="text-xl font-semibold text-slate-900">{{ stats.percent }}%</div>
        </div>
        <div class="text-sm text-slate-500">已完成 {{ stats.mastered }}/{{ stats.total }}</div>
      </div>
      <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 transition-all" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <button @click="activeTab = 'all'" :class="['px-4 py-2 rounded-full transition', activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700']">全部</button>
      <button @click="activeTab = 'overdue'" :class="['px-4 py-2 rounded-full transition', activeTab === 'overdue' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700']">逾期未复习</button>
      <button @click="activeTab = 'today'" :class="['px-4 py-2 rounded-full transition', activeTab === 'today' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700']">今日到期</button>
      <button @click="activeTab = 'learning'" :class="['px-4 py-2 rounded-full transition', activeTab === 'learning' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700']">学习中</button>
      <button @click="activeTab = 'mastered'" :class="['px-4 py-2 rounded-full transition', activeTab === 'mastered' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700']">已掌握</button>
      <button @click="activeTab = 'notStarted'" :class="['px-4 py-2 rounded-full transition', activeTab === 'notStarted' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700']">未开始</button>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-3xl bg-white p-5 border border-rose-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-sm text-rose-500">逾期任务</div>
            <div class="mt-2 text-3xl font-semibold text-slate-900">{{ stats.overdue }}</div>
          </div>
          <button @click="catchUpOverdue" class="rounded-2xl bg-rose-50 px-4 py-2 text-rose-600 hover:bg-rose-100 transition">一键补签</button>
        </div>
        <div class="space-y-3">
          <div v-if="overdueList.length === 0" class="text-sm text-slate-500">当前没有逾期任务。</div>
          <div v-for="article in overdueList.slice(0, 4)" :key="article.id" class="rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <div class="flex items-center justify-between">
              <div class="text-sm font-medium text-rose-700">{{ article.title }}</div>
              <span class="text-xs font-semibold text-rose-600">+{{ article.overdueDays }}天</span>
            </div>
            <div class="mt-2 text-sm text-rose-600">下次复习：{{ formatDate(article.nextReview) }}</div>
          </div>
        </div>
      </div>
      <div class="rounded-3xl bg-white p-5 border border-emerald-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-sm text-emerald-500">今日到期</div>
            <div class="mt-2 text-3xl font-semibold text-slate-900">{{ stats.today }}</div>
          </div>
          <button @click="checkAllToday" class="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-600 hover:bg-emerald-100 transition">一键打卡</button>
        </div>
        <div class="space-y-3">
          <div v-if="todayDueList.length === 0" class="text-sm text-slate-500">今天没有到期任务。</div>
          <div v-for="article in todayDueList.slice(0, 4)" :key="article.id" class="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <div class="flex items-center justify-between">
              <div class="text-sm font-medium text-emerald-700">{{ article.title }}</div>
              <span class="text-xs font-semibold text-emerald-600">今日到期</span>
            </div>
            <div class="mt-2 text-sm text-emerald-600">复习次数：{{ article.reviewCount }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-10 gap-3">
      <div v-for="article in filteredArticles" :key="article.id" @click="openDetail(article)" :class="['rounded-3xl p-3 border shadow-sm transition hover:shadow-lg', getStatusStyle(article).card]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-slate-600">{{ article.id }}</span>
          <span v-if="article.overdueDays > 0" class="text-[10px] font-bold uppercase tracking-[0.15em] text-white rounded-full px-2 py-1" :class="getStatusStyle(article).badge">+{{ article.overdueDays }}天</span>
        </div>
        <div class="text-sm font-medium text-slate-900 truncate">{{ article.title }}</div>
        <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{{ article.reviewCount }}/6</span>
          <span>{{ article.stateLabel }}</span>
        </div>
      </div>
    </div>

    <div v-if="showDetail && currentArticle" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-3xl rounded-[32px] bg-white p-6 shadow-2xl">
        <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 class="text-2xl font-semibold text-slate-900">{{ currentArticle.title }}</h3>
            <p class="mt-2 text-sm text-slate-500">{{ getStatusStyle(currentArticle).label }} · 复习 {{ currentArticle.reviewCount }} / 6 次</p>
          </div>
          <button @click="closeDetail" class="text-3xl text-slate-400 hover:text-slate-700">×</button>
        </div>

        <div class="grid gap-4 lg:grid-cols-2 mt-6">
          <div class="rounded-3xl bg-slate-50 p-5">
            <div class="text-sm text-slate-500 mb-2">内容预览</div>
            <p class="text-sm leading-7 text-slate-700">{{ currentArticle.content }}</p>
            <div class="mt-4 text-sm text-slate-600">下次复习：{{ currentArticle.nextReview ? formatDate(currentArticle.nextReview) : '已掌握' }}</div>
          </div>
          <div class="rounded-3xl bg-slate-50 p-5">
            <div class="text-sm text-slate-500 mb-2">复习记录</div>
            <div class="space-y-3">
              <div v-for="(item, index) in currentArticle.reviewHistory" :key="index" class="rounded-2xl bg-white p-3 border border-slate-100">
                <div class="flex items-center justify-between text-sm text-slate-700">
                  <span>{{ formatDate(item.date) }}</span>
                  <span class="font-semibold text-slate-900">{{ item.status }}</span>
                </div>
              </div>
              <div v-if="!currentArticle.reviewHistory.length" class="text-sm text-slate-500">暂无复习记录。</div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-4">
          <button @click="markReviewed(currentArticle)" class="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition">
            <Play class="w-4 h-4" /> 一键打卡
          </button>
          <button @click="markReviewed(currentArticle)" class="inline-flex items-center gap-2 rounded-3xl bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700 transition">
            <CheckCircle class="w-4 h-4" /> 标记复习
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
