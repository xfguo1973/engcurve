<script setup>import { ref, computed, onMounted } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
const today = new Date().toISOString().split('T')[0];
const currentFilter = ref('all');
const showDetailModal = ref(false);
const selectedArticle = ref(null);
const articles = ref([]);
onMounted(() => {
 const saved = localStorage.getItem('listeningArticles');
 if (saved) {
 articles.value = JSON.parse(saved);
 }
 else {
 initArticles();
 }
});
const initArticles = () => {
 const arr = [];
 for (let i = 1; i <= 100; i++) {
 arr.push({
 id: i,
 status: 'not_started',
 reviews: [],
 lastStudyDate: null
 });
 }
 articles.value = arr;
 saveToStorage();
};
const saveToStorage = () => {
 localStorage.setItem('listeningArticles', JSON.stringify(articles.value));
};
const filteredArticles = computed(() => {
 switch (currentFilter.value) {
 case 'today':
 return articles.value.filter(a => a.status === 'pending');
 case 'learning':
 return articles.value.filter(a => a.status === 'learning');
 case 'mastered':
 return articles.value.filter(a => a.status === 'mastered');
 case 'not_started':
 return articles.value.filter(a => a.status === 'not_started');
 default:
 return articles.value;
 }
});
const stats = computed(() => {
 const total = articles.value.length;
 const learned = articles.value.filter(a => a.status !== 'not_started').length;
 const todayPending = articles.value.filter(a => a.status === 'pending').length;
 const mastered = articles.value.filter(a => a.status === 'mastered').length;
 const completionRate = Math.round((mastered / total) * 100);
 return { learned, todayPending, mastered, completionRate };
});
const getStatusColor = (status) => {
 switch (status) {
 case 'not_started': return 'bg-white border-gray-200';
 case 'learning': return 'bg-purple-50 border-purple-200';
 case 'pending': return 'bg-orange-50 border-orange-200';
 case 'mastered': return 'bg-green-50 border-green-200';
 default: return 'bg-white border-gray-200';
 }
};
const getReviewDots = (article) => {
 const dots = [];
 for (let i = 0; i < 6; i++) {
 dots.push(article.reviews.includes(i));
 }
 return dots;
};
const openDetail = (article) => {
 selectedArticle.value = article;
 showDetailModal.value = true;
};
const closeDetail = () => {
 showDetailModal.value = false;
 selectedArticle.value = null;
};
const startLearning = () => {
 if (!selectedArticle.value)
 return;
 const article = articles.value.find(a => a.id === selectedArticle.value.id);
 if (article) {
 article.status = 'learning';
 article.reviews = [0];
 article.lastStudyDate = today;
 updateReviewStatus();
 saveToStorage();
 closeDetail();
 }
};
const markReviewed = () => {
 if (!selectedArticle.value)
 return;
 const article = articles.value.find(a => a.id === selectedArticle.value.id);
 if (article) {
 const nextReview = article.reviews.length;
 if (nextReview < 6) {
 article.reviews.push(nextReview);
 article.lastStudyDate = today;
 updateReviewStatus();
 saveToStorage();
 closeDetail();
 }
 }
};
const updateReviewStatus = () => {
 articles.value.forEach(article => {
 if (article.status === 'learning') {
 const nextReviewIndex = article.reviews.length;
 if (nextReviewIndex >= 6) {
 article.status = 'mastered';
 return;
 }
 const reviewDays = [0, 1, 3, 6, 14, 29];
 const lastDate = article.lastStudyDate;
 if (!lastDate)
 return;
 const last = new Date(lastDate);
 const now = new Date();
 const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
 if (diffDays >= reviewDays[nextReviewIndex]) {
 article.status = 'pending';
 }
 }
 });
};
const reviewLabels = ['第1天', '第2天', '第4天', '第7天', '第15天', '第30天'];
const todayReviewTasks = computed(() => {
 return articles.value.filter(a => a.status === 'pending');
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
            <span class="text-blue-600 text-sm sm:text-base">🎧</span>
          </div>
          <h1 class="text-sm font-semibold text-gray-800 sm:text-lg">英语听力 · 艾宾浩斯打卡</h1>
        </div>
        <span class="text-xs text-gray-500 sm:text-sm">今天 {{ today }}</span>
      </div>
    </header>

    <div class="p-4 sm:p-6">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 sm:mb-6">
        <div class="bg-gray-100 rounded-xl p-3 sm:p-4">
          <div class="text-xs text-gray-500 mb-1">已学篇数</div>
          <div class="text-xl sm:text-2xl font-bold text-gray-800">{{ stats.learned }}</div>
        </div>
        <div class="bg-gray-100 rounded-xl p-3 sm:p-4">
          <div class="text-xs text-gray-500 mb-1">今日待复习</div>
          <div class="text-xl sm:text-2xl font-bold text-gray-800">{{ stats.todayPending }}</div>
        </div>
        <div class="bg-gray-100 rounded-xl p-3 sm:p-4">
          <div class="text-xs text-gray-500 mb-1">已掌握</div>
          <div class="text-xl sm:text-2xl font-bold text-gray-800">{{ stats.mastered }}</div>
        </div>
        <div class="bg-gray-100 rounded-xl p-3 sm:p-4">
          <div class="text-xs text-gray-500 mb-1">完成率</div>
          <div class="text-xl sm:text-2xl font-bold text-gray-800">{{ stats.completionRate }}%</div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
        <div class="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <div class="w-2.5 h-2.5 bg-white border border-gray-300 rounded"></div>
            <span>未开始</span>
            <div class="w-2.5 h-2.5 bg-purple-200 rounded ml-2"></div>
            <span>学习中</span>
            <div class="w-2.5 h-2.5 bg-orange-200 rounded ml-2"></div>
            <span>待复习</span>
            <div class="w-2.5 h-2.5 bg-green-200 rounded ml-2"></div>
            <span>已掌握</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <button
            @click="currentFilter = 'all'"
            :class="[
              'px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm transition-all',
              currentFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            全部100篇
          </button>
          <button
            @click="currentFilter = 'today'"
            :class="[
              'px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm transition-all',
              currentFilter === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            今日复习
          </button>
          <button
            @click="currentFilter = 'learning'"
            :class="[
              'px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm transition-all',
              currentFilter === 'learning' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            学习中
          </button>
          <button
            @click="currentFilter = 'mastered'"
            :class="[
              'px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm transition-all',
              currentFilter === 'mastered' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            已掌握
          </button>
          <button
            @click="currentFilter = 'not_started'"
            :class="[
              'px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm transition-all',
              currentFilter === 'not_started' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            未开始
          </button>
        </div>

        <div class="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3">
          <button
            v-for="article in filteredArticles"
            :key="article.id"
            @click="openDetail(article)"
            :class="[
              'relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:shadow-md cursor-pointer',
              getStatusColor(article.status)
            ]"
          >
            <span class="text-sm font-semibold text-gray-700 sm:text-lg">{{ article.id }}</span>
            <div class="flex gap-0.5 mt-1">
              <span
                v-for="(done, index) in getReviewDots(article)"
                :key="index"
                :class="[
                  'w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full',
                  done ? 'bg-gray-700' : 'bg-gray-300'
                ]"
              ></span>
            </div>
          </button>
        </div>

        <div class="flex justify-center mt-6">
          <button class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ChevronDown class="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6">
        <div class="flex items-center mb-4">
          <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
            <span class="text-blue-600">📝</span>
          </div>
          <h2 class="font-medium text-gray-800">今日复习任务</h2>
        </div>
        <div v-if="todayReviewTasks.length === 0" class="text-gray-500 text-sm">
          暂无复习任务，继续学习新篇目吧！
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="task in todayReviewTasks"
            :key="task.id"
            class="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
          >
            <div class="flex items-center">
              <span class="text-gray-700">第 {{ task.id }} 篇</span>
              <span class="text-xs text-orange-500 ml-2">待复习</span>
            </div>
            <button
              @click="() => { selectedArticle = task; showDetailModal = true; }"
              class="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
            >
              开始复习
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showDetailModal && selectedArticle"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeDetail"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">第 {{ selectedArticle.id }} 篇</h3>
          <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div class="mb-6">
          <div class="text-sm text-gray-500 mb-2">复习进度</div>
          <div class="flex gap-2">
            <div
              v-for="(done, index) in getReviewDots(selectedArticle)"
              :key="index"
              :class="[
                'flex-1 py-2 rounded-lg text-center text-xs font-medium transition-all',
                done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              ]"
            >
              {{ reviewLabels[index] }}
              <div :class="['mt-1', done ? 'text-green-400' : 'text-gray-300']">✓</div>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button
            v-if="selectedArticle.status === 'not_started'"
            @click="startLearning"
            class="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
          >
            开始学习
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
            ✓ 已掌握
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
