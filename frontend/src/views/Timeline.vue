<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchBuildingsByEra } from '../api/buildings';

const router = useRouter();
const eraGroups = ref([]);
const loading = ref(false);

async function loadTimeline() {
  loading.value = true;
  try {
    const { data } = await fetchBuildingsByEra();
    eraGroups.value = data;
  } catch {
    ElMessage.error('加载时间轴数据失败，请确认后端已启动');
  } finally {
    loading.value = false;
  }
}

function goDetail(id) {
  router.push({ path: `/buildings/${id}`, query: { from: 'timeline' } });
}

function handleKeydown(e, id) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    goDetail(id);
  }
}

onMounted(loadTimeline);
</script>

<template>
  <div v-loading="loading" class="timeline-page">
    <h2 class="page-title">年代时间轴</h2>

    <el-empty v-if="!loading && eraGroups.length === 0" description="暂无建筑数据" />

    <div v-else class="timeline">
      <div
        v-for="(group, index) in eraGroups"
        :key="group.era"
        class="era-block"
      >
        <div class="era-marker">
          <div class="era-dot"></div>
          <div v-if="index < eraGroups.length - 1" class="era-line"></div>
        </div>

        <div class="era-content">
          <div class="era-header">
            <span class="era-name">{{ group.era }}</span>
            <el-tag size="small" type="info" class="era-count">
              {{ group.count }} 座建筑
            </el-tag>
          </div>

          <div class="building-cards">
            <div
              v-for="building in group.buildings"
              :key="building.id"
              class="building-card"
              tabindex="0"
              role="button"
              :aria-label="`查看${building.name}详情`"
              @click="goDetail(building.id)"
              @keydown="handleKeydown($event, building.id)"
            >
              <div class="card-main">
                <h4 class="card-name">{{ building.name }}</h4>
                <span class="card-city">{{ building.city }}</span>
              </div>
              <div class="card-meta">
                <el-tag size="small" type="info">
                  {{ building.button_type }}
                </el-tag>
              </div>
              <el-icon class="card-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue';

export default {
  components: { ArrowRight },
};
</script>

<style scoped>
.timeline-page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(92, 74, 58, 0.08);
}

.page-title {
  font-size: 1.25rem;
  color: #5c4a3a;
  margin-bottom: 24px;
}

.timeline {
  display: flex;
  flex-direction: column;
}

.era-block {
  display: flex;
  gap: 20px;
  min-height: 60px;
}

.era-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
  flex-shrink: 0;
  padding-top: 6px;
}

.era-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(145deg, #c9a227, #8b6914);
  border: 2px solid #5c4a3a;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(201, 162, 39, 0.4);
}

.era-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, #c9a227, rgba(201, 162, 39, 0.15));
  margin: 4px 0;
}

.era-content {
  flex: 1;
  padding-bottom: 28px;
}

.era-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.era-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #5c4a3a;
}

.era-count {
  font-size: 0.75rem;
}

.building-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.building-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #faf6f0;
  border: 1px solid #ebe5d9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.building-card:hover,
.building-card:focus-visible {
  background: #f5efe3;
  border-color: #c9a227;
  box-shadow: 0 2px 8px rgba(201, 162, 39, 0.15);
  transform: translateX(4px);
  outline: none;
}

.building-card:focus-visible {
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.3), 0 2px 8px rgba(201, 162, 39, 0.15);
}

.card-main {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #3d3229;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-city {
  font-size: 0.8rem;
  color: #8b7355;
}

.card-meta {
  flex-shrink: 0;
}

.card-arrow {
  color: #8b7355;
  font-size: 14px;
  flex-shrink: 0;
}

.building-card:hover .card-arrow {
  color: #c9a227;
}
</style>
