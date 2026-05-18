<script setup>
import { ref, computed, onMounted } from 'vue'
import { X, CheckCircle, RotateCcw, Clock, BookOpen, AlertTriangle, Zap } from 'lucide-vue-next'

// ── 艾宾浩斯复习间隔（天数）
const REVIEW_INTERVALS = [1, 2, 4, 7, 15, 30]
const TOTAL_REVIEWS = REVIEW_INTERVALS.length  // 6次后算掌握

// ── 100篇文章标题
const TITLES = Array.from({ length: 100 }, (_, i) => {
  const topics = [
    'Daily Routine','Travel Plans','Food & Health','Work Life','Shopping',
    'Weather Forecast','Family Time','Hobbies','Education','Technology',
    'Sports & Fitness','Music & Arts','Nature & Environment','City Life','History',
    'Science News','Social Media','Cooking Tips','Health Advice','Career Goals',
    'Weekend Plans','Cultural Exchange','Global Events','Animal World','Space Exploration',
    'Fashion Trends','Film Reviews','Book Club','Finance Basics','Volunteering',
    'Home Decor','Garden Life','Road Trip','Ocean Life','Mountain Adventure',
    'New Year Goals','Festival Traditions','Neighborhood','Public Transport','Job Interview',
    'Friendship','Team Work','Problem Solving','Creative Thinking','Time Management',
    'Healthy Habits','Stress Relief','Sleep Science','Memory Tips','Learning Languages',
    'Podcast Culture','Remote Work','Urban Farming','Zero Waste','Climate Change',
    'Digital Detox','Mental Health','Gratitude Journal','Morning Rituals','Evening Wind-down',
    'Coffee Culture','Tea Ceremony','Street Food','Fine Dining','Bakery Secrets',
    'Photography','Video Editing','Coding Basics','AI & Future','Robotics',
    'Electric Cars','Cycling City','Walking Benefits','Yoga Practice','Meditation Guide',
    'Art Museum','Theater Night','Concert Hall','Dance Lessons','Crafts Workshop',
    'Startup Story','Innovation Lab','Design Thinking','Customer Service','Leadership',
    'Negotiation Skills','Public Speaking','Writing Tips','Research Methods','Critical Thinking',
    'Parenting Tips','Children Education','Senior Life','Community Service','Charity Work',
    'Travel Budget','Backpacking','Luxury Hotels','Hostel Life','Cultural Shock',
    'Language Exchange','Pen Pal','Expat Life','Immigration Story','Multicultural Family'
  ]
  return `${(i + 1).toString().padStart(3, '0')} ${topics[i] || 'Passage ' + (i + 1)}`
})

// ── 状态计算
const articles = ref([])
const selectedArticle = ref(null)
const activeTab = ref('all')

function todayMidnight() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function getNextReviewDate(article) {
  if (!article.firstLearnDate || article.reviewCount >= TOTAL_REVIEWS) return null
  const interval = REVIEW_INTERVALS[article.reviewCount]
  const base = new Date(article.firstLearnDate)
  base.setHours(0, 0, 0, 0)
  base.setDate(base.getDate() + interval)
  return base
}

function getDueDays(article) {
  const next = getNextReviewDate(article)
  if (!next) return null
  return Math.floor((next - todayMidnight()) / 86400000)
}

function getStatus(article) {
  if (!article.firstLearnDate) return 'unstarted'
  if (article.reviewCount >= TOTAL_REVIEWS) return 'mastered'
  const due = getDueDays(article)
  if (due === null) return 'mastered'
  if (due > 0) return 'learning'
  if (due === 0) return 'dueToday'
  const overdue = -due
  if (overdue <= 3) return 'overdue1'
  if (overdue <= 7) return 'overdue2'
  return 'overdue3'
}

const STATUS_META = {
  unstarted: { label: '未开始',   dot: '#9ca3af', gridBg: '#e5e7eb', textClass: 'text-gray-500' },
  learning:  { label: '学习中',   dot: '#a855f7', gridBg: '#a855f7', textClass: 'text-purple-600' },
  dueToday:  { label: '今日到期', dot: '#3b82f6', gridBg: '#3b82f6', textClass: 'text-blue-600' },
  overdue1:  { label: '逾期1-3天',dot: '#fbbf24', gridBg: '#fbbf24', textClass: 'text-amber-600' },
  overdue2:  { label: '逾期4-7天',dot: '#f97316', gridBg: '#f97316', textClass: 'text-orange-600' },
  overdue3:  { label: '逾期7天+', dot: '#ef4444', gridBg: '#ef4444', textClass: 'text-red-600' },
  mastered:  { label: '已掌握',   dot: '#10b981', gridBg: '#10b981', textClass: 'text-emerald-600' },
}

function getOverdueLabel(article) {
  const s = getStatus(article)
  if (s === 'dueToday') return '今日'
  if (['overdue1','overdue2','overdue3'].includes(s)) return `+${-getDueDays(article)}天`
  return null
}

// ── 统计
const stats = computed(() => {
  const all = articles.value
  return {
    total:    all.length,
    mastered: all.filter(a => getStatus(a) === 'mastered').length,
    learning: all.filter(a => ['learning','dueToday','overdue1','overdue2','overdue3'].includes(getStatus(a))).length,
    overdue:  all.filter(a => ['overdue1','overdue2','overdue3','dueToday'].includes(getStatus(a))).length,
    unstarted:all.filter(a => getStatus(a) === 'unstarted').length,
  }
})
const progress = computed(() => Math.round((stats.value.mastered / 100) * 100))

// ── Tabs
const TABS = [
  { key: 'all',       label: '全部' },
  { key: 'overdue',   label: '逾期未复习' },
  { key: 'dueToday',  label: '今日到期' },
  { key: 'learning',  label: '学习中' },
  { key: 'mastered',  label: '已掌握' },
  { key: 'unstarted', label: '未开始' },
]

const filteredArticles = computed(() => {
  const all = articles.value
  const tab = activeTab.value
  if (tab === 'all')      return all
  if (tab === 'overdue')  return all.filter(a => ['overdue1','overdue2','overdue3'].includes(getStatus(a)))
  if (tab === 'dueToday') return all.filter(a => getStatus(a) === 'dueToday')
  if (tab === 'learning') return all.filter(a => getStatus(a) === 'learning')
  if (tab === 'mastered') return all.filter(a => getStatus(a) === 'mastered')
  if (tab === 'unstarted')return all.filter(a => getStatus(a) === 'unstarted')
  return all
})

const overdueList  = computed(() => articles.value.filter(a => ['overdue1','overdue2','overdue3'].includes(getStatus(a))))
const dueTodayList = computed(() => articles.value.filter(a => getStatus(a) === 'dueToday'))

// ── 打卡 / 补签
function checkin(article, isSupplementary = false) {
  const now = new Date().toISOString()
  if (!article.firstLearnDate) {
    article.firstLearnDate = now
    article.reviewCount = 0
    article.reviewHistory = []
  }
  if (!article.reviewHistory) article.reviewHistory = []
  article.reviewHistory.push({ date: now, count: article.reviewCount + 1, supplementary: isSupplementary })
  article.reviewCount = Math.min(article.reviewCount + 1, TOTAL_REVIEWS)
  article.lastReviewDate = now
  saveArticles()
}

function batchCheckin(list, isSupplementary = false) {
  list.forEach(a => checkin(a, isSupplementary))
}

// ── 详情弹窗
function openDetail(article) { selectedArticle.value = article }
function closeDetail()       { selectedArticle.value = null }

function getTimeline(article) {
  const history = article.reviewHistory || []
  return REVIEW_INTERVALS.map((interval, i) => {
    const planned = article.firstLearnDate ? (() => {
      const d = new Date(article.firstLearnDate)
      d.setDate(d.getDate() + interval)
      return d.toLocaleDateString('zh-CN')
    })() : '—'
    const actual = history[i]
    return {
      round: i + 1,
      interval: `+${interval}天`,
      planned,
      actual: actual ? new Date(actual.date).toLocaleDateString('zh-CN') : null,
      done: !!actual,
      supplementary: actual?.supplementary || false,
      isCurrent: i === article.reviewCount,
    }
  })
}

// ── 持久化
function saveArticles() {
  localStorage.setItem('listeningArticles_v2', JSON.stringify(articles.value))
}

function initArticles() {
  articles.value = TITLES.map((title, i) => ({
    id: i + 1, title,
    firstLearnDate: null, lastReviewDate: null,
    reviewCount: 0, reviewHistory: []
  }))
  saveArticles()
}

onMounted(() => {
  const saved = localStorage.getItem('listeningArticles_v2')
  if (saved) {
    articles.value = JSON.parse(saved)
    articles.value.forEach(a => { if (!a.reviewHistory) a.reviewHistory = [] })
  } else {
    initArticles()
  }
})

function resetAll() {
  if (confirm('确定要清空所有听力学习数据吗？此操作不可撤销。')) initArticles()
}
</script>

<template>
  <div class="space-y-5 pb-10">

    <!-- 标题栏 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-800">英语听力</h2>
        <p class="text-sm text-gray-400 mt-0.5">100篇 · 艾宾浩斯间隔复习 (+1/+2/+4/+7/+15/+30天)</p>
      </div>
      <button @click="resetAll" class="text-xs text-gray-400 hover:text-red-400 transition-colors">重置</button>
    </div>

    <!-- 4个统计卡片 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <div class="flex items-center gap-1.5 mb-2">
          <CheckCircle class="w-4 h-4 text-emerald-500" />
          <span class="text-xs font-medium text-emerald-600">已掌握</span>
        </div>
        <div class="text-2xl font-bold text-emerald-700">{{ stats.mastered }}</div>
        <div class="text-xs text-emerald-400 mt-0.5">/ 100 篇</div>
      </div>
      <div class="bg-purple-50 border border-purple-100 rounded-xl p-4">
        <div class="flex items-center gap-1.5 mb-2">
          <BookOpen class="w-4 h-4 text-purple-500" />
          <span class="text-xs font-medium text-purple-600">学习中</span>
        </div>
        <div class="text-2xl font-bold text-purple-700">{{ stats.learning }}</div>
        <div class="text-xs text-purple-400 mt-0.5">篇复习中</div>
      </div>
      <div class="bg-red-50 border border-red-100 rounded-xl p-4">
        <div class="flex items-center gap-1.5 mb-2">
          <AlertTriangle class="w-4 h-4 text-red-500" />
          <span class="text-xs font-medium text-red-600">逾期/到期</span>
        </div>
        <div class="text-2xl font-bold text-red-700">{{ stats.overdue }}</div>
        <div class="text-xs text-red-400 mt-0.5">篇待处理</div>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div class="flex items-center gap-1.5 mb-2">
          <Clock class="w-4 h-4 text-gray-400" />
          <span class="text-xs font-medium text-gray-500">未开始</span>
        </div>
        <div class="text-2xl font-bold text-gray-600">{{ stats.unstarted }}</div>
        <div class="text-xs text-gray-400 mt-0.5">篇待学习</div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="bg-white border border-gray-100 rounded-xl p-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-semibold text-gray-700">掌握进度</span>
        <span class="text-sm font-bold text-emerald-600">{{ progress }}%</span>
      </div>
      <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-700"
          :style="{ width: progress + '%', background: 'linear-gradient(90deg,#6ee7b7,#10b981)' }">
        </div>
      </div>
      <div class="flex justify-between text-xs text-gray-400 mt-1.5">
        <span>{{ stats.mastered }} 篇完成全部6次复习</span>
        <span>{{ 100 - stats.mastered }} 篇剩余</span>
      </div>
    </div>

    <!-- 逾期任务面板 -->
    <div v-if="overdueList.length > 0" class="bg-red-50 border border-red-200 rounded-xl p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <AlertTriangle class="w-4 h-4 text-red-500" />
          <span class="text-sm font-semibold text-red-700">逾期未复习（{{ overdueList.length }} 篇）</span>
        </div>
        <button @click="batchCheckin(overdueList, true)"
          class="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">
          一键补签全部
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div v-for="a in overdueList.slice(0, 15)" :key="a.id"
          class="flex items-center gap-1.5 bg-white border border-red-200 rounded-lg px-2 py-1 text-xs cursor-pointer hover:border-red-400 transition-colors"
          @click="openDetail(a)">
          <span class="text-gray-700 font-medium">{{ a.id }}</span>
          <span class="text-red-500 font-bold">{{ getOverdueLabel(a) }}</span>
          <button @click.stop="checkin(a, true)" class="text-red-400 hover:text-red-600 font-bold ml-0.5" title="补签">✓</button>
        </div>
        <span v-if="overdueList.length > 15" class="text-xs text-red-400 self-center">+{{ overdueList.length - 15 }} 篇</span>
      </div>
    </div>

    <!-- 今日到期面板 -->
    <div v-if="dueTodayList.length > 0" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <Zap class="w-4 h-4 text-blue-500" />
          <span class="text-sm font-semibold text-blue-700">今日到期（{{ dueTodayList.length }} 篇）</span>
        </div>
        <button @click="batchCheckin(dueTodayList)"
          class="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">
          一键打卡全部
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div v-for="a in dueTodayList" :key="a.id"
          class="flex items-center gap-1.5 bg-white border border-blue-200 rounded-lg px-2 py-1 text-xs cursor-pointer hover:border-blue-400 transition-colors"
          @click="openDetail(a)">
          <span class="text-gray-700 font-medium">{{ a.id }}</span>
          <span class="text-blue-500 font-bold">第{{ a.reviewCount + 1 }}次</span>
          <button @click.stop="checkin(a)" class="text-blue-400 hover:text-blue-600 font-bold ml-0.5" title="打卡">✓</button>
        </div>
      </div>
    </div>

    <!-- Tab 筛选 -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="tab in TABS" :key="tab.key" @click="activeTab = tab.key"
        :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
          activeTab === tab.key ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
        {{ tab.label }}
        <span v-if="tab.key === 'overdue' && stats.overdue > 0" class="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">{{ stats.overdue }}</span>
        <span v-if="tab.key === 'dueToday' && dueTodayList.length > 0" class="ml-1 bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-xs">{{ dueTodayList.length }}</span>
      </button>
    </div>

    <!-- 10×10 格子网格 -->
    <div class="bg-white border border-gray-100 rounded-xl p-4">
      <div v-if="activeTab !== 'all'" class="text-xs text-gray-400 mb-3">
        显示 {{ filteredArticles.length }} / 100 篇
      </div>

      <div class="grid gap-1.5" style="grid-template-columns: repeat(10, minmax(0, 1fr))">
        <div
          v-for="article in activeTab === 'all' ? articles : filteredArticles"
          :key="article.id"
          @click="openDetail(article)"
          class="relative aspect-square rounded-lg cursor-pointer transition-transform duration-150 hover:scale-110 hover:z-10 flex flex-col items-center justify-center overflow-hidden"
          :style="{ backgroundColor: STATUS_META[getStatus(article)].gridBg }"
          :title="article.title"
        >
          <!-- 编号 -->
          <span class="text-white font-bold select-none" style="font-size: clamp(8px,1.3vw,12px); line-height:1">
            {{ article.id }}
          </span>
          <!-- 逾期标签 -->
          <span v-if="getOverdueLabel(article)"
            class="absolute bottom-0 left-0 right-0 text-center text-white bg-black/25 select-none"
            style="font-size:6px; padding:1px 0; line-height:1.4">
            {{ getOverdueLabel(article) }}
          </span>
        </div>
      </div>

      <!-- 图例 -->
      <div class="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-3 border-t border-gray-100">
        <div v-for="(meta, key) in STATUS_META" :key="key" class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm shrink-0" :style="{ backgroundColor: meta.gridBg }"></span>
          <span class="text-xs text-gray-500">{{ meta.label }}</span>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <Teleport to="body">
      <div v-if="selectedArticle"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="closeDetail">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

          <!-- 弹窗头部 -->
          <div class="p-5 border-b border-gray-100 shrink-0">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="w-2.5 h-2.5 rounded-full shrink-0"
                    :style="{ backgroundColor: STATUS_META[getStatus(selectedArticle)].gridBg }"></span>
                  <span class="text-xs font-semibold" :class="STATUS_META[getStatus(selectedArticle)].textClass">
                    {{ STATUS_META[getStatus(selectedArticle)].label }}
                  </span>
                  <span v-if="getOverdueLabel(selectedArticle)"
                    class="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">
                    {{ getOverdueLabel(selectedArticle) }}
                  </span>
                </div>
                <h3 class="font-bold text-gray-800 text-base leading-snug truncate">{{ selectedArticle.title }}</h3>
                <p class="text-xs text-gray-400 mt-0.5">
                  已完成 {{ selectedArticle.reviewCount }}/{{ TOTAL_REVIEWS }} 次复习
                  <span v-if="selectedArticle.firstLearnDate">
                    · 首次 {{ new Date(selectedArticle.firstLearnDate).toLocaleDateString('zh-CN') }}
                  </span>
                </p>
              </div>
              <button @click="closeDetail" class="text-gray-300 hover:text-gray-500 shrink-0">
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- 复习时间线 -->
          <div class="p-5 overflow-y-auto flex-1">
            <div class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">艾宾浩斯复习时间线</div>
            <div class="space-y-3">
              <div v-for="row in getTimeline(selectedArticle)" :key="row.round"
                class="flex items-center gap-3">
                <!-- 状态圆点 -->
                <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2',
                  row.done
                    ? (row.supplementary ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-emerald-100 border-emerald-400 text-emerald-700')
                    : (row.isCurrent ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-gray-100 border-gray-200 text-gray-400')
                ]">{{ row.round }}</div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-sm font-medium text-gray-700">
                      第 {{ row.round }} 次
                      <span class="text-gray-400 text-xs ml-1">{{ row.interval }}</span>
                    </span>
                    <span v-if="row.done" class="text-xs shrink-0"
                      :class="row.supplementary ? 'text-amber-600' : 'text-emerald-600'">
                      {{ row.actual }} {{ row.supplementary ? '（补签）' : '✓' }}
                    </span>
                    <span v-else-if="row.isCurrent" class="text-xs text-blue-500 font-medium shrink-0">
                      待完成 · {{ row.planned }}
                    </span>
                    <span v-else class="text-xs text-gray-400 shrink-0">{{ row.planned }}</span>
                  </div>
                  <!-- 小进度条 -->
                  <div class="h-1 mt-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500"
                      :class="row.done ? (row.supplementary ? 'bg-amber-400' : 'bg-emerald-400') : (row.isCurrent ? 'bg-blue-300' : 'bg-gray-200')"
                      :style="{ width: row.done ? '100%' : (row.isCurrent ? '20%' : '0%') }">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="p-5 pt-0 shrink-0">
            <template v-if="getStatus(selectedArticle) === 'unstarted'">
              <button @click="checkin(selectedArticle); closeDetail()"
                class="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-colors">
                开始学习（记录第1次）
              </button>
            </template>
            <template v-else-if="getStatus(selectedArticle) === 'mastered'">
              <div class="w-full text-center py-3 bg-emerald-50 rounded-xl text-emerald-600 font-semibold">
                🎉 已掌握！全部6次复习完成
              </div>
            </template>
            <template v-else>
              <button
                v-if="['overdue1','overdue2','overdue3'].includes(getStatus(selectedArticle))"
                @click="checkin(selectedArticle, true); closeDetail()"
                class="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors">
                补签第 {{ selectedArticle.reviewCount + 1 }} 次复习
              </button>
              <button v-else
                @click="checkin(selectedArticle); closeDetail()"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors">
                完成第 {{ selectedArticle.reviewCount + 1 }} 次复习（{{ REVIEW_INTERVALS[selectedArticle.reviewCount] }} 天后下次）
              </button>
            </template>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
