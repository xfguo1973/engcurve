<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-vue-next'

const router = useRouter()

const form = ref({
  name: '',
  password: ''
})

const showPassword = ref(false)
const error = ref('')

function handleLogin() {
  error.value = ''

  if (!form.value.name) {
    error.value = '请输入用户名'
    return
  }

  if (!form.value.password) {
    error.value = '请输入密码'
    return
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(function(u) {
    return u.name === form.value.name && u.password === form.value.password
  })

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    router.push('/overview')  // Fix: use router.push instead of window.location.href
  } else {
    error.value = '用户名或密码错误'
  }
}

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center mb-4">
          <User class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-800">欢迎回来</h1>
        <p class="text-gray-500 mt-2">请登录您的账户</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
          <div class="relative">
            <User class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="form.name"
              type="text"
              placeholder="请输入用户名"
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Eye v-if="showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{{ error }}</div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2"
        >
          <span>登 录</span>
          <ArrowRight class="w-5 h-5" />
        </button>
      </form>

      <div class="mt-6 text-center">
        <span class="text-gray-500">还没有账户？</span>
        <button
          @click="goToRegister"
          class="text-blue-600 font-medium ml-1 hover:underline"
        >
          立即注册
        </button>
      </div>
    </div>
  </div>
</template>
