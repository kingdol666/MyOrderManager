<template>
  <div class="order-manager">
    <div class="header">
      <h2 class="title">分类管理</h2>
      <div class="actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          <span>增加</span>
        </el-button>
      </div>
    </div>

    <el-alert
      v-if="error"
      title="加载分类失败"
      type="error"
      :description="error.message"
      show-icon
      closable
    />

    <el-card shadow="hover" class="table-container">

    <el-table 
      v-loading="loading"
      :data="tableData" 
      border 
      stripe
      style="width: 100%"
      :header-cell-style="{background: '#f5f7fa', color: '#606266'}"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="name" label="分类名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="available" label="是否可用" width="120" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.available ? 'success' : 'danger'">
            {{ scope.row.available ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" align="center">
        <template #default="scope">
          {{ formatArrayToDateTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180" align="center">
        <template #default="scope">
          {{ formatArrayToDateTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" align="center">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入分类描述"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="是否可用" prop="available">
          <el-switch v-model="formData.available" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDialogConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.order-manager {
  padding: 24px;
  height: 100%;
  background-color: #f5f7fa;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px 24px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    .title {
      color: #303133;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .table-container {
    margin-top: 0;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    
    :deep(.el-card__body) {
      padding: 0;
    }
  }

  .pagination-container {
    margin-top: 16px;
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }

  :deep(.el-table) {
    border-radius: 8px;
    overflow: hidden;

    .el-table__header-wrapper {
      th {
        background-color: #f8f9fa !important;
        color: #495057;
        font-weight: 600;
      }
    }

    .el-table__row {
      transition: all 0.3s;

      &:hover {
        background-color: #f8f9fa !important;
        transform: translateY(-1px);
      }
      
      td {
        padding: 12px 0;
        border-bottom: 1px solid #e9ecef;
      }
    }

    .el-button {
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
    }
  }
}
</style>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCategorys, createCategory, deleteCategory, updateCategory } from '../api';
import { useMainStore } from '../store';

const loading = ref(false);
const tableData = ref([]);
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

const dialogVisible = ref(false);
const dialogTitle = ref('');
const store = useMainStore();

const fetchData = async () => {
  loading.value = true;
  try {
    const categories = await getCategorys();
    store.setCategories(categories);
    
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const datas = Array.isArray(store.categories) ? store.categories : [];
    
    tableData.value = datas.slice(start, end);
    pagination.total = categories.length;
  } catch (error) {
    console.error('获取分类数据失败:', error);
    store.setCategories([]);
    tableData.value = [];
    pagination.total = 0;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const formData = ref({
  id: null,
  name: '',
  description: '',
  available: true,
  createTime: '',
  updateTime: ''
});

const formRef = ref(null);
const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
};

const handleDialogConfirm = async () => {
  try {
    await formRef.value.validate();
    
    const now = new Date().toISOString();
    if (dialogTitle.value === '增加数据') {
      formData.value.createTime = now;
      console.log(formData.value)
      // 调用API创建分类
      const category = {
        name: formData.value.name,
        description: formData.value.description, 
        available: formData.value.available,
        createTime: formData.value.createTime
      };
      const response = await createCategory(category);
      formData.value.id = response.id;
      store.addProduct({...formData.value});
    } else {
      formData.value.updateTime = now;
      // 封装要更新的字段
      const updateData = {
        name: formData.value.name,
        description: formData.value.description,
        available: formData.value.available,
        updateTime: formData.value.updateTime
      };
      await updateCategory(formData.value.id, updateData);
      store.updateProduct({...formData.value});
    }
    
    ElMessage.success(`${dialogTitle.value}成功`);
    dialogVisible.value = false;
    fetchData(); // 刷新数据
  } catch (error) {
    console.error('操作失败:', error);
    ElMessage.error(`${dialogTitle.value}失败: ${error.message}`);
  }
};

const handleAdd = () => {
  dialogTitle.value = '增加数据';
  formData.value = {
    id: null,
    name: '',
    description: '',
    available: true,
    createTime: '',
    updateTime: ''
  };
  dialogVisible.value = true;
};

const handleEdit = (index, row) => {
  dialogTitle.value = '编辑数据';
  formData.value = {...row};
  dialogVisible.value = true;
};

const handleDelete = (index, row) => {
  ElMessageBox.confirm(
    `确定要删除 ID 为 ${row.id} 的分类吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await deleteCategory(row.id);
      store.removeCategory(row.id);
      ElMessage.success('删除成功');
      fetchData();
    })
    .catch(() => {
      ElMessage.info('取消删除');
    });
};

const handleSizeChange = (newSize) => {
  pagination.pageSize = newSize;
  pagination.currentPage = 1;
  fetchData();
};

const handleCurrentChange = (newPage) => {
  pagination.currentPage = newPage;
  fetchData();
};

const formatDateTime = (dateTime) => {
  if (!dateTime) return '-';
  try {
    return new Date(dateTime).toLocaleString();
  } catch (e) {
    return dateTime;
  }
};
function formatArrayToDateTime(timeArray) {
  // 1. 输入验证
  if (!Array.isArray(timeArray) || timeArray.length < 6) {
    console.error('Invalid input: timeArray must be an array with at least 6 elements.');
    return '未知时间'; // 或者返回空字符串 ''
  }

  // 解构赋值，并处理纳秒（如果存在）
  const [year, month, day, hour, minute, second, nanoseconds = 0] = timeArray;

  // 2. 处理月份 (JavaScript Date 对象月份是 0-indexed) 和纳秒
  const monthIndex = month - 1; // 将 1-based 月份转为 0-based
  const milliseconds = Math.floor(nanoseconds / 1000000); // 纳秒转毫秒

  try {
    // 3. 创建 Date 对象
    const date = new Date(year, monthIndex, day, hour, minute, second, milliseconds);

    // 4. 检查 Date 对象是否有效 (防止如 month=13 等无效输入导致 Invalid Date)
    if (isNaN(date.getTime())) {
       console.error('Invalid date components in array:', timeArray);
       return 'Invalid Date';
    }

    // 5. 手动格式化为 'YYYY-MM-DD HH:mm:ss'
    const formattedYear = date.getFullYear();
    // getMonth() 返回 0-11，加 1 变回 1-12，然后补零
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(date.getDate()).padStart(2, '0');
    const formattedHour = String(date.getHours()).padStart(2, '0');
    const formattedMinute = String(date.getMinutes()).padStart(2, '0');
    const formattedSecond = String(date.getSeconds()).padStart(2, '0');
    // 如果需要毫秒，可以添加：
    // const formattedMilliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${formattedYear}-${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}:${formattedSecond}`;

  } catch (error) {
    console.error('Error creating or formatting date:', error);
    return 'Error Formatting Date';
  }
}
</script>

<style scoped>
.manager-container {
  padding: 20px;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar {
  margin-bottom: 20px;
}

:deep(.el-table) {
  flex: 1;
  margin-bottom: 0;
  width: 100%;
  
  .el-table__row {
    height: 60px;
  }
  
  .el-table__cell {
    padding: 16px 0;
  }
  
  .el-button {
    margin: 0 4px;
  }
  
  .el-table__body tr:hover>td {
    background-color: #f5f7fa;
  }
}

.pagination-container {
  margin-top: 20px;
  padding: 12px 0;
  display: flex;
  justify-content: flex-end;
  background: #fff;
  border-radius: 4px;
}

.dialog-footer button:first-child {
  margin-right: 12px;
}

/* 对话框表单样式 */
:deep(.el-dialog) {
  max-width: 90%;
  width: 800px !important;
}

:deep(.el-form-item__content) {
  width: 100%;
}
</style>
