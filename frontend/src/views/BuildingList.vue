<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { fetchBuildings, createBuilding, updateBuilding, deleteBuilding } from '../api/buildings';

const router = useRouter();
const route = useRoute();
const buildings = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref('新增记录');
const editingId = ref(null);

const activeCity = computed(() => route.query.city || '');

const filteredBuildings = computed(() => {
  if (!activeCity.value) return buildings.value;
  return buildings.value.filter((b) => b.city === activeCity.value);
});

function clearCityFilter() {
  router.replace({ path: '/', query: {} });
}

const emptyForm = () => ({
  name: '',
  city: '',
  era: '',
  button_type: '',
  still_in_use: true,
});

const form = ref(emptyForm());

/**
 * 加载样式列表
 */
async function loadList() {
  loading.value = true;
  try {
    const { data } = await fetchBuildings();
    buildings.value = data;
  } catch {
    ElMessage.error('加载列表失败，请确认后端已启动');
  } finally {
    loading.value = false;
  }
}

/**
 * 打开新增对话框
 */
function openCreate() {
  editingId.value = null;
  dialogTitle.value = '新增记录';
  form.value = emptyForm();
  dialogVisible.value = true;
}

/**
 * 打开编辑对话框
 * @param {object} row
 */
function openEdit(row) {
  editingId.value = row.id;
  dialogTitle.value = '编辑记录';
  form.value = {
    name: row.name,
    city: row.city,
    era: row.era,
    button_type: row.button_type,
    still_in_use: row.still_in_use,
  };
  dialogVisible.value = true;
}

/**
 * 提交表单（新增或更新）
 */
async function submitForm() {
  if (!form.value.name || !form.value.city || !form.value.era || !form.value.button_type) {
    ElMessage.warning('请填写所有必填项');
    return;
  }

  try {
    if (editingId.value) {
      await updateBuilding(editingId.value, form.value);
      ElMessage.success('更新成功');
    } else {
      await createBuilding(form.value);
      ElMessage.success('新增成功');
    }
    dialogVisible.value = false;
    await loadList();
  } catch {
    ElMessage.error('保存失败');
  }
}

/**
 * 删除记录
 * @param {object} row
 */
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确定删除「${row.name}」的记录吗？`, '确认删除', {
      type: 'warning',
    });
    await deleteBuilding(row.id);
    ElMessage.success('删除成功');
    await loadList();
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('删除失败');
  }
}

/**
 * 跳转详情页
 * @param {number} id
 */
function goDetail(id) {
  router.push(`/buildings/${id}`);
}

onMounted(loadList);
</script>

<template>
  <div class="list-page">
    <div class="toolbar">
      <div class="toolbar-left">
        <h2>按钮样式列表</h2>
        <el-tag v-if="activeCity" closable type="warning" class="city-filter-tag" @close="clearCityFilter">
          城市：{{ activeCity }}
        </el-tag>
      </div>
      <el-button type="primary" @click="openCreate">新增记录</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="filteredBuildings"
      stripe
      class="building-table"
      @row-click="(row) => goDetail(row.id)"
    >
      <el-table-column prop="name" label="建筑名" min-width="120" />
      <el-table-column prop="city" label="城市" width="90" />
      <el-table-column prop="era" label="年代" width="110" />
      <el-table-column prop="button_type" label="按钮类型" min-width="160" />
      <el-table-column label="是否仍在用" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="row.still_in_use ? 'success' : 'info'" size="small">
            {{ row.still_in_use ? '在用' : '已退役' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center" @click.stop>
        <template #default="{ row }">
          <el-button link type="primary" @click.stop="goDetail(row.id)">详情</el-button>
          <el-button link type="warning" @click.stop="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click.stop="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="建筑名" required>
          <el-input v-model="form.name" placeholder="如：和平饭店" />
        </el-form-item>
        <el-form-item label="城市" required>
          <el-input v-model="form.city" placeholder="如：上海" />
        </el-form-item>
        <el-form-item label="年代" required>
          <el-input v-model="form.era" placeholder="如：1930年代" />
        </el-form-item>
        <el-form-item label="按钮类型" required>
          <el-input v-model="form.button_type" placeholder="如：黄铜圆形机械按钮" />
        </el-form-item>
        <el-form-item label="是否仍在用">
          <el-switch v-model="form.still_in_use" active-text="在用" inactive-text="已退役" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.list-page {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(92, 74, 58, 0.08);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar h2 {
  font-size: 1.125rem;
  color: #5c4a3a;
}

.city-filter-tag {
  font-size: 0.85rem;
}

.building-table {
  cursor: pointer;
}

.building-table :deep(.el-table__row:hover) {
  background-color: #faf6f0 !important;
}
</style>
