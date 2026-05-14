<script setup>
import { ref, onMounted, computed } from 'vue'
import { X } from 'lucide-vue-next'

const today = new Date().toISOString().split('T')[0]
const articles = ref([])
const showDetailModal = ref(false)
const selectedArticle = ref(null)
const activeTab = ref('all')

const reviewIntervals = [0, 1, 3, 6, 14, 29]
const reviewLabels = ['第1天', '第2天', '第4天', '第7天', '第15天', '第30天']

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'overdue', label: '逾期未复习' },
  { key: 'today', label: '今日到期' },
  { key: 'learning', label: '学习中' },
  { key: 'mastered', label: '已掌握' },
  { key: 'not_started', label: '未开始' }
]

onMounted(() => {
  loadArticles()
})

const loadArticles = () => {
  const saved = localStorage.getItem('listeningArticles')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed && Array.isArray(parsed) && parsed.length === 100) {
        articles.value = parsed
      } else {
        initArticles()
      }
    } catch {
      initArticles()
    }
  } else {
    initArticles()
  }
}

const saveArticles = () => {
  localStorage.setItem('listeningArticles', JSON.stringify(articles.value))
}

const initArticles = () => {
  const arr = []
  for (let i = 1; i <= 100; i++) {
    arr.push({
      id: i,
      status: 'not_started',
      reviews: [],
      lastStudyDate: null
    })
  }
  articles.value = arr
  saveArticles()
}

const resetArticles = () => {
  initArticles()
}

const filteredArticles = computed(() => {
  switch (activeTab.value) {
    case 'overdue':
      return articles.value.filter(a => a.status !== 'not_started' && a.status !== 'mastered' && getOverdueDays(a) > 0)
    case 'today':
      return articles.value.filter(a => a.status !== 'not_started' && a.status !== 'mastered' && getOverdueDays(a) === 0)
    case 'learning':
      return articles.value.filter(a => a.status === 'learning' || a.status === 'pending')
    case 'mastered':
      return articles.value.filter(a => a.status === 'mastered')
    case 'not_started':
      return articles.value.filter(a => a.status === 'not_started')
    default:
      return articles.value
  }
})

const stats = computed(() => {
  const total = articles.value.length
  const mastered = articles.value.filter(a => a.status === 'mastered').length
  const learning = articles.value.filter(a => a.status === 'learning' || a.status === 'pending').length
  const overdue = articles.value.filter(a => a.status !== 'not_started' && a.status !== 'mastered' && getOverdueDays(a) > 0).length
  const todayDue = articles.value.filter(a => a.status !== 'not_started' && a.status !== 'mastered' && getOverdueDays(a) === 0).length
  return { total, mastered, learning, overdue, todayDue }
})

const progress = computed(() => {
  if (stats.value.total === 0) return 0
  return Math.round((stats.value.mastered / stats.value.total) * 100)
})

const overdueList = computed(() => {
  return articles.value
    .filter(a => a.status !== 'not_started' && a.status !== 'mastered' && getOverdueDays(a) > 0)
    .sort((a, b) => getOverdueDays(b) - getOverdueDays(a))
    .slice(0, 5)
})

const todayDueList = computed(() => {
  return articles.value.filter(a => a.status !== 'not_started' && a.status !== 'mastered' && getOverdueDays(a) === 0)
})

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
      return { bg: '#f3f4f6', border: '#d1d5db', text: '#6b7280', badge: null }
    case 'mastered':
      return { bg: '#dcfce7', border: '#4ade80', text: '#166534', badge: null }
    case 'learning':
    case 'pending':
      if (overdueDays === 0) {
        return { bg: '#f3e8ff', border: '#a78bfa', text: '#6b21a8', badge: null }
      } else if (overdueDays <= 3) {
        return { bg: '#fef3c7', border: '#fbbf24', text: '#92400e', badge: { text: `+${overdueDays}天`, class: 'bg-yellow-500' } }
      } else if (overdueDays <= 7) {
        return { bg: '#ffedd5', border: '#fb923c', text: '#c2410c', badge: { text: `+${overdueDays}天`, class: 'bg-orange-500' } }
      } else {
        return { bg: '#fee2e2', border: '#f87171', text: '#991b1b', badge: { text: `+${overdueDays}天`, class: 'bg-red-500' } }
      }
    default:
      return { bg: '#f3f4f6', border: '#d1d5db', text: '#6b7280', badge: null }
  }
}

const getReviewDots = (article) => {
  const dots = []
  for (let i = 0; i < 6; i++) {
    dots.push(article.reviews.length > i)
  }
  return dots
}

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
    saveArticles()
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
      if (nextReviewIndex + 1 >= reviewIntervals.length) {
        article.status = 'mastered'
      }
      saveArticles()
    }
    closeDetail()
  }
}

const markReviewedDirect = (article) => {
  const nextReviewIndex = article.reviews.length
  if (nextReviewIndex < reviewIntervals.length) {
    article.reviews.push(today)
    article.lastStudyDate = today
    if (nextReviewIndex + 1 >= reviewIntervals.length) {
      article.status = 'mastered'
    }
    saveArticles()
  }
}

const checkAllOverdue = () => {
  overdueList.value.forEach(article => {
    markReviewedDirect(article)
  })
}

const checkAllToday = () => {
  todayDueList.value.forEach(article => {
    markReviewedDirect(article)
  })
}
</script>

<template>
  <div style="padding: 16px;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: #f3f4f6; border-radius: 12px; padding: 16px;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">总篇数</div>
          <div style="font-size: 24px; font-weight: bold; color: #1f2937;">{{ stats.total }}</div>
        </div>
        <div style="background: #fee2e2; border-radius: 12px; padding: 16px;">
          <div style="font-size: 12px; color: #ef4444; margin-bottom: 4px;">逾期未复习</div>
          <div style="font-size: 24px; font-weight: bold; color: #dc2626;">{{ stats.overdue }}</div>
        </div>
        <div style="background: #f3e8ff; border-radius: 12px; padding: 16px;">
          <div style="font-size: 12px; color: #9333ea; margin-bottom: 4px;">学习中</div>
          <div style="font-size: 24px; font-weight: bold; color: #7c3aed;">{{ stats.learning }}</div>
        </div>
        <div style="background: #dcfce7; border-radius: 12px; padding: 16px;">
          <div style="font-size: 12px; color: #22c55e; margin-bottom: 4px;">已掌握</div>
          <div style="font-size: 24px; font-weight: bold; color: #16a34a;">{{ stats.mastered }}</div>
        </div>
      </div>

      <div style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 14px; color: #6b7280;">总体进度</span>
          <span style="font-size: 14px; font-weight: 500; color: #1f2937;">{{ progress }}%</span>
        </div>
        <div style="height: 8px; background: #e5e7eb; border-radius: 9999px; overflow: hidden;">
          <div :style="{ width: progress + '%', height: '100%', background: '#22c55e', transition: 'all 0.3s' }"></div>
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :style="{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: activeTab === tab.key ? '#3b82f6' : '#ffffff',
            color: activeTab === tab.key ? '#ffffff' : '#6b7280',
            border: activeTab === tab.key ? 'none' : '1px solid #e5e7eb'
          }"
        >
          {{ tab.label }}
        </button>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; padding: 12px; background: #f9fafb; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 16px; height: 16px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 4px;"></div>
          <span style="font-size: 12px; color: #6b7280;">未开始</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 16px; height: 16px; background: #f3e8ff; border: 1px solid #a78bfa; border-radius: 4px;"></div>
          <span style="font-size: 12px; color: #6b7280;">学习中</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 16px; height: 16px; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 4px;"></div>
          <span style="font-size: 12px; color: #6b7280;">逾期1-3天</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 16px; height: 16px; background: #ffedd5; border: 1px solid #fb923c; border-radius: 4px;"></div>
          <span style="font-size: 12px; color: #6b7280;">逾期4-7天</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 16px; height: 16px; background: #fee2e2; border: 1px solid #f87171; border-radius: 4px;"></div>
          <span style="font-size: 12px; color: #6b7280;">逾期7天+</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 16px; height: 16px; background: #dcfce7; border: 1px solid #4ade80; border-radius: 4px;"></div>
          <span style="font-size: 12px; color: #6b7280;">已掌握</span>
        </div>
      </div>

      <div v-if="overdueList.length > 0" style="background: #fef2f2; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #fecaca;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 600; color: #1f2937;">逾期任务</span>
            <span style="padding: 2px 8px; background: #fecaca; color: #dc2626; font-size: 12px; border-radius: 9999px;">{{ overdueList.length }}项</span>
          </div>
          <button @click="checkAllOverdue" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">一键补签</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div
            v-for="article in overdueList"
            :key="article.id"
            style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px; border-radius: 8px;"
          >
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="width: 32px; height: 32px; background: #fee2e2; color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">{{ article.id }}</span>
              <span style="color: #6b7280;">第{{ article.id }}篇</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 12px; color: #ef4444;">逾期{{ getOverdueDays(article) }}天</span>
              <button @click="markReviewedDirect(article)" style="padding: 4px 8px; background: #22c55e; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">补签</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="todayDueList.length > 0" style="background: #eff6ff; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #bfdbfe;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 600; color: #1f2937;">今日到期</span>
            <span style="padding: 2px 8px; background: #bfdbfe; color: #2563eb; font-size: 12px; border-radius: 9999px;">{{ todayDueList.length }}项</span>
          </div>
          <button @click="checkAllToday" style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">一键打卡</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div
            v-for="article in todayDueList"
            :key="article.id"
            style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px; border-radius: 8px;"
          >
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="width: 32px; height: 32px; background: #f3e8ff; color: #7c3aed; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">{{ article.id }}</span>
              <span style="color: #6b7280;">第{{ article.id }}篇</span>
            </div>
            <button @click="markReviewedDirect(article)" style="padding: 4px 8px; background: #22c55e; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">打卡</button>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 12px; padding: 16px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
        <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 8px;">
          <div
            v-for="article in filteredArticles"
            :key="article.id"
            @click="openDetail(article)"
            :style="{
              position: 'relative',
              aspectRatio: '1',
              backgroundColor: getStatusStyle(article).bg,
              border: '2px solid ' + getStatusStyle(article).border,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }"
          >
            <span :style="{ fontSize: '14px', fontWeight: 'bold', color: getStatusStyle(article).text }">{{ article.id }}</span>
            <div style="display: flex; gap: 2px; margin-top: 4px;">
              <span
                v-for="(done, index) in getReviewDots(article)"
                :key="index"
                :style="{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: done ? '#6b7280' : '#d1d5db'
                }"
              ></span>
            </div>
            <span
              v-if="getStatusStyle(article).badge"
              :style="{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                padding: '2px 6px',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: getStatusStyle(article).badge.class
              }"
            >
              {{ getStatusStyle(article).badge.text }}
            </span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button @click="resetArticles" style="padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
          重置数据
        </button>
      </div>

      <div
        v-if="showDetailModal && selectedArticle"
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px;"
        @click.self="closeDetail"
      >
        <div style="background: white; border-radius: 16px; padding: 24px; width: 100%; max-width: 400px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="font-size: 20px; font-weight: bold;">第 {{ selectedArticle.id }} 篇</h3>
            <button @click="closeDetail" style="color: #9ca3af; background: none; border: none; cursor: pointer;">
              <X style="width: 24px; height: 24px;" />
            </button>
          </div>

          <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">状态</div>
            <span :style="{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: selectedArticle.status === 'not_started' ? '#f3f4f6' : selectedArticle.status === 'mastered' ? '#dcfce7' : '#f3e8ff',
              color: selectedArticle.status === 'not_started' ? '#6b7280' : selectedArticle.status === 'mastered' ? '#166534' : '#6b21a8'
            }">
              {{ selectedArticle.status === 'not_started' ? '未开始' : selectedArticle.status === 'mastered' ? '已掌握' : '学习中' }}
            </span>
          </div>

          <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">复习进度</div>
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px;">
              <div
                v-for="(done, index) in getReviewDots(selectedArticle)"
                :key="index"
                :style="{
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  borderRadius: '6px',
                  backgroundColor: done ? '#dcfce7' : '#f3f4f6',
                  color: done ? '#166534' : '#9ca3af'
                }"
              >
                {{ reviewLabels[index] }}
              </div>
            </div>
          </div>

          <div v-if="selectedArticle.reviews && selectedArticle.reviews.length > 0" style="margin-bottom: 16px;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">复习记录</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div
                v-for="(review, index) in selectedArticle.reviews"
                :key="index"
                style="font-size: 12px; color: #374151; padding: 4px 0;"
              >
                {{ reviewLabels[index] }}: {{ review }}
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button
              v-if="selectedArticle.status === 'not_started'"
              @click="startLearning"
              style="padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer;"
            >
              开始学习
            </button>
            <button
              v-else-if="selectedArticle.status !== 'mastered'"
              @click="markReviewed"
              style="padding: 12px; background: #22c55e; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer;"
            >
              标记已复习
            </button>
            <div v-else style="padding: 12px; background: #f3f4f6; color: #6b7280; border-radius: 8px; text-align: center; font-size: 14px;">
              已掌握
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
