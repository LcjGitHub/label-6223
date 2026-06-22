<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { fetchStatistics } from '../api/statistics';

const loading = ref(false);
const summary = ref({ total: 0, in_use: 0, retired: 0 });
const byCity = ref([]);

const chartRef = ref(null);
let chartInstance = null;

async function loadStatistics() {
  loading.value = true;
  try {
    const { data } = await fetchStatistics();
    summary.value = data.summary;
    byCity.value = data.byCity;
    await nextTick();
    renderChart();
  } catch {
    ElMessage.error('加载统计数据失败，请确认后端已启动');
  } finally {
    loading.value = false;
  }
}

function renderChart() {
  if (!chartRef.value) return;

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }

  const cities = byCity.value.map((item) => item.city);
  const totals = byCity.value.map((item) => item.total);
  const inUseList = byCity.value.map((item) => item.in_use);
  const retiredList = byCity.value.map((item) => item.retired);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['建筑总数', '仍在用', '已退役'],
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '50px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: cities,
      axisLabel: { color: '#5c4a3a' },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: '#5c4a3a' },
    },
    series: [
      {
        name: '建筑总数',
        type: 'bar',
        data: totals,
        itemStyle: { color: '#8b6914', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 40,
      },
      {
        name: '仍在用',
        type: 'bar',
        data: inUseList,
        itemStyle: { color: '#67c23a', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 40,
      },
      {
        name: '已退役',
        type: 'bar',
        data: retiredList,
        itemStyle: { color: '#909399', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 40,
      },
    ],
  };

  chartInstance.setOption(option);
}

function handleResize() {
  chartInstance?.resize();
}

onMounted(() => {
  loadStatistics();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
  chartInstance = null;
});
</script>

<template>
  <div class="statistics-page">
    <div class="page-header">
      <h2>统计概览</h2>
      <p class="header-subtitle">各城市老式电梯建筑数据统计</p>
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
          <span class="chart-tip">按总数降序排列</span>
        </div>
        <div ref="chartRef" class="chart-container"></div>
      </el-card>

      <el-card shadow="hover" class="table-card" v-if="byCity.length > 0">
        <div class="chart-header">
          <h3>各城市明细</h3>
        </div>
        <el-table :data="byCity" stripe>
          <el-table-column prop="city" label="城市" />
          <el-table-column prop="total" label="建筑总数" align="center" />
          <el-table-column prop="in_use" label="仍在用" align="center">
            <template #default="{ row }">
              <el-tag type="success" size="small">{{ row.in_use }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="retired" label="已退役" align="center">
            <template #default="{ row }">
              <el-tag type="info" size="small">{{ row.retired }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
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

.chart-card,
.table-card {
  border: none !important;
  border-radius: 12px !important;
}

.chart-card :deep(.el-card__body),
.table-card :deep(.el-card__body) {
  padding: 20px 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 1rem;
  color: #5c4a3a;
}

.chart-tip {
  font-size: 0.75rem;
  color: #8b7a6b;
}

.chart-container {
  width: 100%;
  height: 360px;
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>
