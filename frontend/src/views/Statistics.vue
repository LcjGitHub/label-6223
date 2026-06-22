<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchStatistics } from '../api/statistics';

const loading = ref(false);
const summary = ref({ total: 0, in_use: 0, retired: 0 });
const byCity = ref([]);

const maxValue = computed(() => {
  if (byCity.value.length === 0) return 0;
  return Math.max(...byCity.value.map((item) => item.total));
});

function getBarHeight(value) {
  if (maxValue.value === 0) return '0%';
  return `${(value / maxValue.value) * 100}%`;
}

async function loadStatistics() {
  loading.value = true;
  try {
    const { data } = await fetchStatistics();
    summary.value = data.summary;
    byCity.value = data.byCity;
  } catch {
    ElMessage.error('加载统计数据失败，请确认后端已启动');
  } finally {
    loading.value = false;
  }
}

onMounted(loadStatistics);
</script>

<template>
  <div class="statistics-page">
    <div class="page-header">
      <div class="header-left">
        <h2>统计概览</h2>
        <p class="header-subtitle">各城市老式电梯建筑数据统计</p>
      </div>
      <el-button type="primary" :loading="loading" @click="loadStatistics">
        🔄 刷新数据
      </el-button>
    </div>

    <div v-loading="loading" class="stats-content">
      <div class="summary-cards">
        <el-card shadow="hover" class="stat-card card-total">
          <div class="card-icon">🏢</div>
          <div class="card-info">
            <div class="card-label">建筑总数</div>
            <div class="card-value">{{ summary.total }}</div>
          </div>
        </el-card>

        <el-card shadow="hover" class="stat-card card-inuse">
          <div class="card-icon">✅</div>
          <div class="card-info">
            <div class="card-label">仍在用</div>
            <div class="card-value">{{ summary.in_use }}</div>
          </div>
        </el-card>

        <el-card shadow="hover" class="stat-card card-retired">
          <div class="card-icon">📜</div>
          <div class="card-info">
            <div class="card-label">已退役</div>
            <div class="card-value">{{ summary.retired }}</div>
          </div>
        </el-card>
      </div>

      <el-card shadow="hover" class="chart-card">
        <div class="chart-header">
          <h3>各城市建筑分布</h3>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="legend-dot dot-total"></span>
              建筑总数
            </span>
            <span class="legend-item">
              <span class="legend-dot dot-inuse"></span>
              仍在用
            </span>
            <span class="legend-item">
              <span class="legend-dot dot-retired"></span>
              已退役
            </span>
          </div>
        </div>

        <div v-if="byCity.length === 0" class="chart-empty">
          <div class="empty-icon">📊</div>
          <div class="empty-text">暂无数据</div>
        </div>

        <div v-else class="chart-container">
          <div class="chart-bars">
            <div v-for="city in byCity" :key="city.city" class="bar-group">
              <div class="bar-group-inner">
                <div class="bar bar-total" :style="{ height: getBarHeight(city.total) }">
                  <span class="bar-value">{{ city.total }}</span>
                </div>
                <div class="bar bar-inuse" :style="{ height: getBarHeight(city.in_use) }">
                  <span class="bar-value">{{ city.in_use }}</span>
                </div>
                <div class="bar bar-retired" :style="{ height: getBarHeight(city.retired) }">
                  <span class="bar-value">{{ city.retired }}</span>
                </div>
              </div>
              <div class="bar-label">{{ city.city }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.statistics-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 2px 12px rgba(92, 74, 58, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  border: none !important;
  border-radius: 12px !important;
  overflow: hidden;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
}

.card-icon {
  font-size: 40px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.card-total {
  background: linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%);
}
.card-total .card-icon {
  background: rgba(139, 105, 20, 0.15);
}

.card-inuse {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
}
.card-inuse .card-icon {
  background: rgba(103, 194, 58, 0.15);
}

.card-retired {
  background: linear-gradient(135deg, #f4f4f5 0%, #e9e9eb 100%);
}
.card-retired .card-icon {
  background: rgba(144, 147, 153, 0.15);
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-label {
  font-size: 0.875rem;
  color: #8b7a6b;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #5c4a3a;
  line-height: 1.2;
}

.chart-card {
  border: none !important;
  border-radius: 12px !important;
}

.chart-card :deep(.el-card__body) {
  padding: 20px 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  font-size: 1rem;
  color: #5c4a3a;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #8b7a6b;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
}

.dot-total {
  background: #8b6914;
}

.dot-inuse {
  background: #67c23a;
}

.dot-retired {
  background: #909399;
}

.chart-empty {
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.4;
}

.empty-text {
  font-size: 0.9rem;
  color: #8b7a6b;
}

.chart-container {
  width: 100%;
  height: 320px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100%;
  padding: 0 20px 0 20px;
  position: relative;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 140px;
}

.bar-group-inner {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  height: 260px;
  width: 100%;
}

.bar {
  width: 28px;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.5s ease;
  min-height: 2px;
  display: flex;
  justify-content: center;
}

.bar-total {
  background: linear-gradient(180deg, #a87d1e 0%, #8b6914 100%);
}

.bar-inuse {
  background: linear-gradient(180deg, #85ce61 0%, #67c23a 100%);
}

.bar-retired {
  background: linear-gradient(180deg, #a6a9ad 0%, #909399 100%);
}

.bar-value {
  position: absolute;
  top: -20px;
  font-size: 0.75rem;
  color: #5c4a3a;
  font-weight: 600;
  white-space: nowrap;
}

.bar-label {
  margin-top: 10px;
  font-size: 0.875rem;
  color: #5c4a3a;
  font-weight: 500;
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .bar-group-inner {
    gap: 4px;
  }

  .bar {
    width: 18px;
  }
}
</style>
