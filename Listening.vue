<script setup>
import { ref, computed, onMounted } from 'vue'

const REVIEW_INTERVALS = [1, 2, 4, 7, 15, 30]
const activeTab = ref('all')
const articles = ref([])
const selectedArticle = ref(null)
const showDetail = ref(false)

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}
function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}
function formatDate(v) {
  if (!v) return '—'
  return new Date(v).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}
function formatDateFull(v) {
  if (!v) return '—'
  return new Date(v).toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })
}
function isToday(v) {
  if (!v) return false
  return startOfDay(new Date(v)).getTime() === startOfDay(new Date()).getTime()
}
function overdueDays(article) {
  if (!article.nextReview) return 0
  const diff = startOfDay(new Date()).getTime() - startOfDay(new Date(article.nextReview)).getTime()
  return diff > 0 ? Math.floor(diff / 86400000) : 0
}
function getState(article) {
  if (article.mastered) return 'mastered'
  if (article.reviewCount === 0) return 'notStarted'
  const od = overdueDays(article)
  if (od > 0) return 'overdue'
  if (article.nextReview && isToday(article.nextReview)) return 'today'
  return 'learning'
}
function cellStyle(article) {
  const state = getState(article)
  if (state === 'mastered')   return 'mastered'
  if (state === 'notStarted') return 'notStarted'
  if (state === 'today' || state === 'learning') return 'learning'
  const od = overdueDays(article)
  if (od <= 3)  return 'overdue1'
  if (od <= 7)  return 'overdue2'
  return 'overdue3'
}
const cellClasses = {
  mastered:   'bg-emerald-500 border-emerald-400 text-white shadow-emerald-100',
  notStarted: 'bg-slate-100 border-slate-200 text-slate-400',
  learning:   'bg-violet-500 border-violet-400 text-white shadow-violet-100',
  overdue1:   'bg-amber-400 border-amber-300 text-white shadow-amber-100',
  overdue2:   'bg-orange-500 border-orange-400 text-white shadow-orange-100',
  overdue3:   'bg-red-500 border-red-400 text-white shadow-red-100',
}

function saveArticles() {
  localStorage.setItem('listeningArticles', JSON.stringify(articles.value))
}
function initArticles() {
  articles.value = []
  for (let i = 1; i <= 100; i++) {
    const reviewCount = Math.floor(Math.random() * 7)
    const reviewHistory = []
    let lastReview = null, nextReview = null, mastered = false
    if (reviewCount > 0) {
      let d = new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000)
      reviewHistory.push({ date: d.toISOString(), status: '初次学习' })
      for (let j = 1; j < reviewCount; j++) {
        d = addDays(d, REVIEW_INTERVALS[j - 1])
        reviewHistory.push({ date: d.toISOString(), status: `第${j + 1}次复习` })
      }
      lastReview = d.toISOString()
      mastered = reviewCount >= 6
      if (!mastered) nextReview = addDays(d, REVIEW_INTERVALS[reviewCount - 1]).toISOString()
    }
    articles.value.push({ id: i, title: `听力篇章 ${i}`, reviewCount, reviewHistory, lastReview, nextReview, mastered })
  }
  saveArticles()
}
function loadArticles() {
  const saved = localStorage.getItem('listeningArticles')
  articles.value = saved ? JSON.parse(saved) : []
  if (!articles.value.length) initArticles()
}
function resetArticles() {
  if (confirm('确定要重置所有听力数据吗？此操作不可撤销。')) {
    localStorage.removeItem('listeningArticles')
    initArticles()
  }
}
onMounted(loadArticles)

function doReview(article) {
  const now = new Date()
  article.reviewCount += 1
  const status = article.reviewCount === 1 ? '初次学习' : `第${article.reviewCount}次复习`
  article.reviewHistory.push({ date: now.toISOString(), status })
  article.lastReview = now.toISOString()
  article.mastered = article.reviewCount >= 6
  article.nextReview = article.mastered ? null : addDays(now, REVIEW_INTERVALS[article.reviewCount - 1]).toISOString()
  saveArticles()
  if (selectedArticle.value && selectedArticle.value.id === article.id) {
    selectedArticle.value = { ...article }
  }
}
function checkAllToday() { todayDueList.value.forEach(a => doReview(a)) }
function catchUpOverdue() { overdueList.value.forEach(a => doReview(a)) }

const overdueList  = computed(() => articles.value.filter(a => getState(a) === 'overdue').sort((a,b) => overdueDays(b)-overdueDays(a)))
const todayDueList = computed(() => articles.value.filter(a => getState(a) === 'today'))
const masteredCount = computed(() => articles.value.filter(a => a.mastered).length)
const stats = computed(() => ({
  total: articles.value.length,
  mastered: masteredCount.value,
  today: todayDueList.value.length,
  overdue: overdueList.value.length,
  learning: articles.value.filter(a => getState(a) === 'learning').length,
}))
const progress = computed(() => Math.round((stats.value.mastered / 100) * 100))
const TABS = [
  { key: 'all', label: '全部' },
  { key: 'overdue', label: '逾期未复习' },
  { key: 'today', label: '今日到期' },
  { key: 'learning', label: '学习中' },
  { key: 'mastered', label: '已掌握' },
  { key: 'notStarted', label: '未开始' },
]
const tabCount = computed(() => ({
  all: 100,
  overdue: stats.value.overdue,
  today: stats.value.today,
  learning: stats.value.learning,
  mastered: stats.value.mastered,
  notStarted: articles.value.filter(a => getState(a) === 'notStarted').length,
}))
const filteredArticles = computed(() => {
  if (activeTab.value === 'all') return articles.value
  return articles.value.filter(a => {
    const s = getState(a)
    if (activeTab.value === 'overdue')    return s === 'overdue'
    if (activeTab.value === 'today')      return s === 'today'
    if (activeTab.value === 'learning')   return s === 'learning'
    if (activeTab.value === 'mastered')   return s === 'mastered'
    if (activeTab.value === 'notStarted') return s === 'notStarted'
    return true
  })
})
function openDetail(article) { selectedArticle.value = { ...article }; showDetail.value = true }
function closeDetail() { showDetail.value = false; selectedArticle.value = null }
const INTERVAL_LABELS = ['+1天', '+2天', '+4天', '+7天', '+15天', '+30天']
function reviewStepState(article, idx) {
  if (idx < article.reviewCount) return 'done'
  if (idx === article.reviewCount && !article.mastered) return 'next'
  return 'pending'
}
function modalHeaderClass(article) {
  const s = getState(article)
  if (s === 'mastered') return 'bg-emerald-500'
  if (s === 'notStarted') return 'bg-slate-400'
  if (s === 'today' || s === 'learning') return 'bg-violet-500'
  const od = overdueDays(article)
  if (od <= 3) return 'bg-amber-500'
  if (od <= 7) return 'bg-orange-500'
  return 'bg-red-500'
}
</script>

<template>
  <div class="space-y-6 pb-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">听力训练</h2>
        <p class="mt-1 text-sm text-slate-500">艾宾浩斯间隔复习 · 100篇听力 · 6次复习后掌握</p>
      </div>
      <button @click="resetArticles" class="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 transition">重置数据</button>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-4 border border-sky-100">
        <div class="text-xs font-medium text-sky-500 uppercase tracking-wide">总篇数</div>
        <div class="mt-2 text-3xl font-bold text-slate-900">{{ stats.total }}</div>
        <div class="mt-1 text-xs text-slate-400">100篇听力材料</div>
      </div>
      <div class="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 p-4 border border-violet-100">
        <div class="text-xs font-medium text-violet-500 uppercase tracking-wide">今日到期</div>
        <div class="mt-2 text-3xl font-bold text-slate-900">{{ stats.today }}</div>
        <div class="mt-1 text-xs text-slate-400">需要今日复习</div>
      </div>
      <div class="rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 p-4 border border-rose-100">
        <div class="text-xs font-medium text-rose-500 uppercase tracking-wide">逾期任务</div>
        <div class="mt-2 text-3xl font-bold text-slate-900">{{ stats.overdue }}</div>
        <div class="mt-1 text-xs text-slate-400">需要补签复习</div>
      </div>
      <div class="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 border border-emerald-100">
        <div class="text-xs font-medium text-emerald-500 uppercase tracking-wide">已掌握</div>
        <div class="mt-2 text-3xl font-bold text-slate-900">{{ stats.mastered }}</div>
        <div class="mt-1 text-xs text-slate-400">完成全部复习</div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-slate-700">总体掌握进度</span>
        <span class="text-sm font-bold text-slate-900">{{ progress }}% <span class="font-normal text-slate-400">({{ stats.mastered }}/100)</span></span>
      </div>
      <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
        <span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-full bg-violet-500"></span>学习中/今日 {{ stats.learning + stats.today }}</span>
        <span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"></span>逾期1-3天</span>
        <span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-full bg-orange-500"></span>逾期4-7天</span>
        <span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-full bg-red-500"></span>逾期7天+</span>
        <span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>已掌握 {{ stats.mastered }}</span>
        <span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-full bg-slate-300"></span>未开始</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tab in TABS" :key="tab.key"
        @click="activeTab = tab.key"
        :class="['flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition', activeTab === tab.key ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300']"
      >
        {{ tab.label }}
        <span :class="['text-xs px-1.5 py-0.5 rounded-full', activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500']">{{ tabCount[tab.key] }}</span>
      </button>
    </div>

    <!-- Overdue + Today panels -->
    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-2xl bg-white p-5 border border-rose-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-sm font-semibold text-rose-600">⏰ 逾期未复习</div>
            <div class="mt-1 text-2xl font-bold text-slate-900">{{ stats.overdue }} <span class="text-base font-normal text-slate-400">篇</span></div>
          </div>
          <button @click="catchUpOverdue" :disabled="stats.overdue === 0" class="rounded-xl bg-rose-50 border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition">一键补签</button>
        </div>
        <div class="space-y-2 max-h-52 overflow-y-auto">
          <div v-if="overdueList.length === 0" class="text-sm text-slate-400 text-center py-4">暂无逾期任务 🎉</div>
          <div v-for="article in overdueList.slice(0, 6)" :key="article.id" class="flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2 cursor-pointer hover:bg-rose-100 transition" @click="openDetail(article)">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{{ article.id }}</span>
              <span class="text-sm font-medium text-slate-700 truncate max-w-28">{{ article.title }}</span>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="text-xs font-bold text-rose-600 bg-rose-100 rounded-full px-2 py-0.5">+{{ overdueDays(article) }}天</span>
              <button @click.stop="doReview(article)" class="text-xs font-medium text-white bg-rose-500 rounded-lg px-2.5 py-1 hover:bg-rose-600 transition">补签</button>
            </div>
          </div>
          <div v-if="overdueList.length > 6" class="text-xs text-center text-slate-400 pt-1">还有 {{ overdueList.length - 6 }} 篇逾期…</div>
        </div>
      </div>

      <div class="rounded-2xl bg-white p-5 border border-violet-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-sm font-semibold text-violet-600">📅 今日到期</div>
            <div class="mt-1 text-2xl font-bold text-slate-900">{{ stats.today }} <span class="text-base font-normal text-slate-400">篇</span></div>
          </div>
          <button @click="checkAllToday" :disabled="stats.today === 0" class="rounded-xl bg-violet-50 border border-violet-200 px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-100 disabled:opacity-40 disabled:cursor-not-allowed transition">一键打卡</button>
        </div>
        <div class="space-y-2 max-h-52 overflow-y-auto">
          <div v-if="todayDueList.length === 0" class="text-sm text-slate-400 text-center py-4">今日无到期任务 ✅</div>
          <div v-for="article in todayDueList.slice(0, 6)" :key="article.id" class="flex items-center justify-between rounded-xl bg-violet-50 px-3 py-2 cursor-pointer hover:bg-violet-100 transition" @click="openDetail(article)">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{{ article.id }}</span>
              <div>
                <div class="text-sm font-medium text-slate-700">{{ article.title }}</div>
                <div class="text-xs text-slate-400">{{ INTERVAL_LABELS[article.reviewCount] }}周期</div>
              </div>
            </div>
            <button @click.stop="doReview(article)" class="text-xs font-medium text-white bg-violet-500 rounded-lg px-2.5 py-1 hover:bg-violet-600 transition flex-shrink-0">打卡</button>
          </div>
          <div v-if="todayDueList.length > 6" class="text-xs text-center text-slate-400 pt-1">还有 {{ todayDueList.length - 6 }} 篇待打卡…</div>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          篇章网格
          <span class="ml-2 font-normal text-slate-400 normal-case">{{ filteredArticles.length }} 篇</span>
        </h3>
      </div>

      <!-- All tab: strict 10×10 -->
      <div v-if="activeTab === 'all'" class="grid grid-cols-10 gap-1.5">
        <div
          v-for="article in articles" :key="article.id"
          @click="openDetail(article)"
          :class="['relative rounded-xl border-2 cursor-pointer transition-all hover:scale-110 hover:shadow-md shadow-sm aspect-square flex flex-col items-center justify-center select-none', cellClasses[cellStyle(article)]]"
        >
          <span class="text-[11px] font-bold leading-none">{{ article.id }}</span>
          <span v-if="getState(article) === 'overdue'" class="mt-0.5 text-[8px] font-bold leading-none opacity-90">+{{ overdueDays(article) }}天</span>
          <div v-else class="mt-0.5 flex gap-px">
            <span v-for="i in 6" :key="i" :class="['w-1 h-1 rounded-full', i <= article.reviewCount ? 'bg-white' : 'bg-white/25']"></span>
          </div>
        </div>
      </div>

      <!-- Other tabs: card grid -->
      <div v-else class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        <div
          v-for="article in filteredArticles" :key="article.id"
          @click="openDetail(article)"
          :class="['relative rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-md shadow-sm p-3', cellClasses[cellStyle(article)]]"
        >
          <div class="flex items-start justify-between mb-1">
            <span class="text-base font-bold">{{ article.id }}</span>
            <span v-if="getState(article) === 'overdue'" class="text-[10px] font-bold bg-black/20 rounded-full px-1.5 py-0.5">+{{ overdueDays(article) }}天</span>
            <span v-else-if="getState(article) !== 'notStarted'" class="text-[10px] font-semibold opacity-80">{{ article.reviewCount }}/6</span>
          </div>
          <div class="text-[11px] font-medium opacity-90 truncate">{{ article.title }}</div>
          <div class="mt-2 flex gap-0.5">
            <span v-for="i in 6" :key="i" :class="['flex-1 h-1 rounded-full', i <= article.reviewCount ? 'bg-white' : 'bg-white/25']"></span>
          </div>
        </div>
        <div v-if="filteredArticles.length === 0" class="col-span-full text-center text-sm text-slate-400 py-8">该分类下暂无篇章</div>
      </div>
    </div>

    <!-- Detail modal -->
    <Teleport to="body">
      <div v-if="showDetail && selectedArticle" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="closeDetail">
        <div class="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div :class="['p-6 text-white flex-shrink-0', modalHeaderClass(selectedArticle)]">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-white/70 text-sm">第 {{ selectedArticle.id }} 篇</div>
                <h3 class="text-xl font-bold mt-1">{{ selectedArticle.title }}</h3>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/80">
                  <span>复习进度 {{ selectedArticle.reviewCount }}/6</span>
                  <span v-if="getState(selectedArticle) === 'overdue'" class="bg-black/20 rounded-full px-2 py-0.5 font-bold text-xs">逾期 +{{ overdueDays(selectedArticle) }} 天</span>
                  <span v-else-if="selectedArticle.mastered" class="bg-black/20 rounded-full px-2 py-0.5 text-xs">✓ 已掌握</span>
                  <span v-else-if="getState(selectedArticle) === 'today'" class="bg-black/20 rounded-full px-2 py-0.5 text-xs">今日到期</span>
                  <span v-else-if="getState(selectedArticle) === 'notStarted'" class="bg-black/20 rounded-full px-2 py-0.5 text-xs">未开始</span>
                  <span v-else class="bg-black/20 rounded-full px-2 py-0.5 text-xs">学习中</span>
                </div>
              </div>
              <button @click="closeDetail" class="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl leading-none transition flex-shrink-0">×</button>
            </div>
            <div class="mt-4 h-2 rounded-full bg-white/25 overflow-hidden">
              <div class="h-full rounded-full bg-white/80 transition-all" :style="{ width: (selectedArticle.reviewCount / 6 * 100) + '%' }"></div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5 overflow-y-auto">
            <!-- Timeline -->
            <div>
              <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">艾宾浩斯复习时间线</div>
              <div class="grid grid-cols-6 gap-1.5">
                <div
                  v-for="(interval, idx) in REVIEW_INTERVALS" :key="idx"
                  :class="['rounded-xl p-2 text-center border-2 transition', reviewStepState(selectedArticle, idx) === 'done' ? 'bg-emerald-50 border-emerald-200' : reviewStepState(selectedArticle, idx) === 'next' ? 'bg-violet-50 border-violet-300 ring-2 ring-violet-200' : 'bg-slate-50 border-slate-200']"
                >
                  <div :class="['text-[11px] font-bold', reviewStepState(selectedArticle, idx) === 'done' ? 'text-emerald-600' : reviewStepState(selectedArticle, idx) === 'next' ? 'text-violet-600' : 'text-slate-400']">
                    {{ INTERVAL_LABELS[idx] }}
                  </div>
                  <div class="mt-1 text-[9px] text-slate-400 leading-tight">
                    <template v-if="reviewStepState(selectedArticle, idx) === 'done'">✓ {{ formatDate(selectedArticle.reviewHistory[idx]?.date) }}</template>
                    <template v-else-if="reviewStepState(selectedArticle, idx) === 'next'">→ 下次</template>
                    <template v-else>待复习</template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Review history -->
            <div>
              <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">复习记录详情</div>
              <div class="space-y-2">
                <div v-if="!selectedArticle.reviewHistory.length" class="text-sm text-slate-400 text-center py-3 bg-slate-50 rounded-xl">暂无复习记录，点击下方开始学习</div>
                <div v-for="(item, idx) in selectedArticle.reviewHistory" :key="idx" class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                  <div class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">{{ idx + 1 }}</span>
                    <span class="text-sm font-medium text-slate-700">{{ item.status }}</span>
                  </div>
                  <span class="text-sm text-slate-400">{{ formatDateFull(item.date) }}</span>
                </div>
              </div>
            </div>

            <!-- Next review -->
            <div v-if="!selectedArticle.mastered" class="rounded-xl bg-slate-50 p-3 flex items-center justify-between">
              <span class="text-sm text-slate-500">下次复习时间</span>
              <span :class="['text-sm font-semibold', getState(selectedArticle) === 'overdue' ? 'text-red-600' : 'text-slate-800']">
                {{ selectedArticle.nextReview ? formatDateFull(selectedArticle.nextReview) : '—' }}
                <span v-if="getState(selectedArticle) === 'overdue'" class="ml-1 text-xs text-red-400">(已逾期 {{ overdueDays(selectedArticle) }} 天)</span>
              </span>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-1">
              <button v-if="selectedArticle.reviewCount === 0" @click="doReview(selectedArticle)" class="flex-1 rounded-xl bg-violet-600 text-white py-3 text-sm font-semibold hover:bg-violet-700 transition">
                🎯 开始学习
              </button>
              <template v-else-if="!selectedArticle.mastered">
                <button @click="doReview(selectedArticle)" :class="['flex-1 rounded-xl text-white py-3 text-sm font-semibold transition', getState(selectedArticle) === 'overdue' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-violet-600 hover:bg-violet-700']">
                  {{ getState(selectedArticle) === 'overdue' ? '📝 补签复习' : '✅ 打卡复习' }}
                </button>
              </template>
              <div v-else class="flex-1 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 py-3 text-sm font-semibold text-center">
                🏆 已完全掌握
              </div>
              <button @click="closeDetail" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">关闭</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
