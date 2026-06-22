<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowRight } from '@element-plus/icons-vue';
import { fetchCities } from '../api/buildings';

const router = useRouter();
const cities = ref([]);
const loading = ref(false);

async function loadCities() {
  loading.value = true;
  try {
    const { data } = await fetchCities();
    cities.value = data;
  } catch {
    ElMessage.error('加载城市列表失败，请确认后端已启动');
  } finally {
    loading.value = false;
  }
}

function goCity(city) {
  router.push({ path: '/', query: { city } });
}

onMounted(loadCities);
</script>

<template>
  <div class="city-index-page">
    <div class="page-header">
      <div class="header-left">
        <h2>城市索引</h2>
        <p class="header-subtitle">浏览各城市中的老式电梯建筑分布</p>
      </div>
    </div>

    <div v-loading="loading" class="city-grid">
      <div v-if="!loading && cities.length === 0" class="empty-state">
        <div class="empty-icon">🏙️</div>
        <div class="empty-text">暂无城市数据</div>
      </div>

      <el-card
        v-for="item in cities"
        :key="item.city"
        shadow="hover"
        class="city-card"
        @click="goCity(item.city)"
      >
        <div class="city-card-inner">
          <div class="city-name">{{ item.city }}</div>
          <div class="city-count">
            <span class="count-number">{{ item.count }}</span>
            <span class="count-label">栋建筑</span>
          </div>
          <div class="city-action">
            <span>查看列表</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.city-index-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 2px 12px rgba(92, 74, 58, 0.08);
}

.page-header h2 {
  font-size: 1.25rem;
  color: #5c4a3a;
  margin-bottom: 4px;
}

.header-subtitle {
  font-size: 0.875rem;
  color: #8b7a6b;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  min-height: 200px;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.4;
}

.empty-text {
  font-size: 0.9rem;
  color: #8b7a6b;
}

.city-card {
  border: none !important;
  border-radius: 12px !important;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%);
}

.city-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(92, 74, 58, 0.15) !important;
}

.city-card :deep(.el-card__body) {
  padding: 20px 24px;
}

.city-card-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.city-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #5c4a3a;
}

.city-count {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.count-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #8b6914;
  line-height: 1.2;
}

.count-label {
  font-size: 0.85rem;
  color: #8b7a6b;
}

.city-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: #8b6914;
  font-weight: 500;
}

.city-action .el-icon {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.city-card:hover .city-action .el-icon {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .city-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
