<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  fetchButtonTypes,
  createButtonType,
  updateButtonType,
  deleteButtonType,
} from '../api/buttonTypes';

const buttonTypes = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref('新增类型');
const editingId = ref(null);

const emptyForm = () => ({
  type_name: '',
  material: '',
  shape: '',
  common_era: '',
});

const form = ref(emptyForm());

/**
 * 加载按钮类型列表
 */
async function loadList() {
  loading.value = true;
  try {
    const { data } = await fetchButtonTypes();
    buttonTypes.value = data;
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
  dialogTitle.value = '新增类型';
  form.value = emptyForm();
  dialogVisible.value = true;
}

/**
 * 打开编辑对话框
 * @param {object} row
 */
function openEdit(row) {
  editingId.value = row.id;
  dialogTitle.value = '编辑类型';
  form.value = {
    type_name: row.type_name,
    material: row.material,
    shape: row.shape,
    common_era: row.common_era,
  };
  dialogVisible.value = true;
}

/**
 * 提交表单（新增或更新）
 */
async function submitForm() {
  if (
    !form.value.type_name ||
    !form.value.material ||
    !form.value.shape ||
    !form.value.common_era
  ) {
    ElMessage.warning('请填写所有必填项');
    return;
  }

  try {
    if (editingId.value) {
      await updateButtonType(editingId.value, form.value);
      ElMessage.success('更新成功');
    } else {
      await createButtonType(form.value);
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
    await ElMessageBox.confirm(`确定删除「${row.type_name}」的记录吗？`, '确认删除', {
      type: 'warning',
    });
    await deleteButtonType(row.id);
    ElMessage.success('删除成功');
    await loadList();
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('删除失败');
  }
}

onMounted(loadList);
</script>

<template>
  <div class="list-page">
    <div class="toolbar">
      <h2>按钮类型图鉴</h2>
      <el-button type="primary" @click="openCreate">新增类型</el-button>
    </div>

    <el-table v-loading="loading" :data="buttonTypes" stripe class="type-table">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="type_name" label="类型名称" min-width="180" />
      <el-table-column prop="material" label="材质" width="120" />
      <el-table-column prop="shape" label="形状" width="120" />
      <el-table-column prop="common_era" label="常见年代" width="140" />
      <el-table-column label="操作" width="160" align="center">
        <template #default="{ row }">
          <el-button link type="warning" @click.stop="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click.stop="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="类型名称" required>
          <el-input v-model="form.type_name" placeholder="如：黄铜圆形机械按钮" />
        </el-form-item>
        <el-form-item label="材质" required>
          <el-input v-model="form.material" placeholder="如：黄铜" />
        </el-form-item>
        <el-form-item label="形状" required>
          <el-input v-model="form.shape" placeholder="如：圆形" />
        </el-form-item>
        <el-form-item label="常见年代" required>
          <el-input v-model="form.common_era" placeholder="如：1910s-1930s" />
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

.toolbar h2 {
  font-size: 1.125rem;
  color: #5c4a3a;
}

.type-table :deep(.el-table__row:hover) {
  background-color: #faf6f0 !important;
}
</style>
