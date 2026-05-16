<script setup>
defineProps({
  modules: {
    type: Array,
    default: function() {
      return []
    }
  }
})

function getProgress(completed, total) {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}
</script>

<template>
  <div class="bg-white rounded-xl p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-6">学习模块</h3>
    
    <div class="space-y-4">
      <div 
        v-for="module in modules" 
        :key="module.id"
        class="group"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-3">
            <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', module.color.bg]">
              <component :is="module.icon" :class="['w-5 h-5', module.color.text]" />
            </div>
            <div>
              <div class="font-medium text-gray-800">{{ module.name }}</div>
              <div class="text-sm text-gray-500">{{ module.completed }}/{{ module.total }} 任务</div>
            </div>
          </div>
          <div class="text-sm font-medium" :class="module.color.text">{{ getProgress(module.completed, module.total) }}%</div>
        </div>
        
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            :class="['h-full rounded-full transition-all duration-500', module.color.bg]"
            :style="{ width: getProgress(module.completed, module.total) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
