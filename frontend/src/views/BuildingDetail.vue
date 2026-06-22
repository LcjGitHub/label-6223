<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchBuilding } from '../api/buildings';

const props = defineProps({
  id: { type: [String, Number], required: true },
});

const router = useRouter();
const building = ref(null);
const loading = ref(false);

/**
 * 加载建筑详情
 */
async function loadDetail() {
  loading.value = true;
  try {
    const { data } = await fetchBuilding(props.id);
    building.value = data;
  } catch {
    ElMessage.error('加载详情失败');
    building.value = null;
  } finally {
    loading.value = false;
  }
}

/**
 * 返回列表页
 */
function goBack() {
  router.push('/');
}

onMounted(loadDetail);
watch(() => props.id, loadDetail);
</script>

<template>
  <div v-loading="loading" class="detail-page">
    <el-button class="back-btn" @click="goBack">← 返回列表</el-button>

    <template v-if="building">
      <div class="detail-card">
        <div class="button-preview">
          <div class="elevator-button" :class="{ active: building.still_in_use }">
            <span class="floor-num">▲</span>
          </div>
          <p class="preview-label">{{ building.button_type }}</p>
        </div>

        <div class="detail-info">
          <h2>{{ building.name }}</h2>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="城市">{{ building.city }}</el-descriptions-item>
            <el-descriptions-item label="年代">{{ building.era }}</el-descriptions-item>
            <el-descriptions-item label="按钮类型">{{ building.button_type }}</el-descriptions-item>
            <el-descriptions-item label="是否仍在用">
              <el-tag :type="building.still_in_use ? 'success' : 'info'">
                {{ building.still_in_use ? '仍在使用' : '已退役' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </template>

    <el-empty v-else-if="!loading" description="未找到该建筑记录" />
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 300px;
}

.back-btn {
  margin-bottom: 16px;
}

.detail-card {
  display: flex;
  gap: 32px;
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(92, 74, 58, 0.08);
}

.button-preview {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.elevator-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(145deg, #c9a227, #8b6914);
  border: 3px solid #5c4a3a;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

.elevator-button.active {
  opacity: 1;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4), 0 0 12px rgba(201, 162, 39, 0.6);
}

.floor-num {
  font-size: 24px;
  color: #3d3229;
}

.preview-label {
  font-size: 0.8rem;
  color: #8b7355;
  text-align: center;
  max-width: 120px;
}

.detail-info {
  flex: 1;
}

.detail-info h2 {
  font-size: 1.5rem;
  color: #5c4a3a;
  margin-bottom: 20px;
}

@media (max-width: 600px) {
  .detail-card {
    flex-direction: column;
    align-items: center;
  }
}
</style>
