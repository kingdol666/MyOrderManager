<template>
  <div class="order-manager">
    <div class="header">
      <h2 class="title">菜单管理</h2>
      <div class="actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          <span>增加</span>
        </el-button>
      </div>
    </div>

    <el-alert
      v-if="error"
      title="加载菜单失败"
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
      <el-table-column prop="name" label="名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="price" label="价格" width="120" align="center">
        <template #default="scope">
          {{ formatPrice(scope.row.price) }}
        </template>
      </el-table-column>
      <el-table-column prop="imageUrl" label="图片" width="120" align="center">
        <template #default="scope">
          <el-image style="width: 50px; height: 50px" :src="scope.row.imageUrl" :preview-src-list="[scope.row.imageUrl]"
            fit="cover" v-if="scope.row.imageUrl" />
          <span v-else>无图</span>
        </template>
      </el-table-column>
      <el-table-column prop="available" label="是否可用" width="120" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.available ? 'success' : 'danger'">
            {{ scope.row.available ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isRecommend" label="是否推荐" width="120" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.isRecommend ? 'success' : 'info'">
            {{ scope.row.isRecommend ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="salesCount" label="销量" width="100" align="center" />
      <el-table-column prop="categoryName" label="分类" min-width="120" show-overflow-tooltip />
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
      <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- Add/Edit Dialog (Placeholder) -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" class="scrollable-dialog">
      <el-form :model="formData" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入商品描述" />
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input-number v-model="formData.price" :precision="2" :step="0.1" :min="0" placeholder="请输入价格" />
        </el-form-item>

        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="formData.categoryId" placeholder="请选择分类">
            <el-option v-for="category in store.categories" :key="category.id" :label="category.name"
              :value="category.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否可用" prop="available">
          <el-switch v-model="formData.available" />
        </el-form-item>

        <el-form-item label="是否推荐" prop="isRecommend">
          <el-switch v-model="formData.isRecommend" />
        </el-form-item>

        <el-form-item label="销量" prop="salesCount">
          <el-input-number v-model="formData.salesCount" :min="0" />
        </el-form-item>

        <el-form-item label="商品图片" prop="imageUrl">
          <el-upload action="#" :auto-upload="false" :on-change="handleImageChange" :show-file-list="false">
            <el-button type="primary">上传图片</el-button>
            <div v-if="formData.imageUrl" class="image-preview">
              <el-image :src="formData.imageUrl" style="width: 100px; height: 100px" />
            </div>
          </el-upload>
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

const loading = ref(false);
const tableData = ref([]);
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

const dialogVisible = ref(false);
const dialogTitle = ref('');

import { useMainStore } from '../store'
import { getMenuItems, getCategorys, createMenuItem, updataMenuItem, deleteMenuItem } from '../api'
const store = useMainStore()

// --- Data Fetching ---
const fetchData = () => {
  loading.value = true;
  console.log(store.products)
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;

  tableData.value = store.products.slice(start, end);
  pagination.total = store.products.length;

  loading.value = false;
};

// --- Lifecycle Hook ---
onMounted(
  async () => {
    try {
      const categories = await getCategorys();
      store.setCategories(categories);
      const menuItems = await getMenuItems()
      console.log('从API获取的菜单项数据:', menuItems)
      // 检查每个菜单项的isRecommend值
      menuItems.forEach(item => {
        console.log(`菜单项ID: ${item.id}, 名称: ${item.name}, 是否推荐: ${item.isRecommend}`)
      })
      store.setProducts(menuItems)
      console.log('store中的products:', store.products)
      fetchData();
    } catch (error) {
      console.error('获取菜单项失败:', error)
    }
  });

// Watch for products changes
watch(() => store.products, () => {
  fetchData();
});

const handleDelete = (index, row) => {
  ElMessageBox.confirm(
    `确定要删除 ID 为 ${row.id} 的商品吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await deleteMenuItem(row.id)
      store.removeProduct(row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('取消删除')
    });
};

const handleSizeChange = (newSize) => {
  pagination.pageSize = newSize;
  pagination.currentPage = 1; // Reset to first page when size changes
  fetchData();
};

const handleCurrentChange = (newPage) => {
  pagination.currentPage = newPage;
  fetchData();
};

const formData = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  available: true,
  isRecommend: false,
  salesCount: 0,
  categoryId: 1,
  categoryName: '',
  createTime: '',
  updateTime: ''
});

const formRef = ref(null);
const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }]
};

const handleImageChange = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.value.imageUrl = e.target.result;
  };
  reader.readAsDataURL(file.raw);
};

const handleDialogConfirm = async () => {
  try {
    await formRef.value.validate();

    const selectedCategory = store.categories.find(cat => cat.id === formData.value.categoryId);
    formData.value.categoryName = selectedCategory ? selectedCategory.name : '';

    const now = new Date().toISOString();
    if (dialogTitle.value === '增加数据') {
      formData.value.createTime = now;

      // 准备菜单项数据
      const menuItem = {
        name: formData.value.name,
        description: formData.value.description,
        price: formData.value.price,
        available: formData.value.available,
        isRecommend: formData.value.isRecommend,
        salesCount: formData.value.salesCount,
      };

      // 获取上传的文件
      const fileInput = document.querySelector('.el-upload input[type="file"]');
      const file = fileInput?.files[0];

      if (!file) {
        throw new Error('请上传商品图片');
      }

      // 调用API创建菜单项
      const response = await createMenuItem(file, menuItem, formData.value.categoryId);

      store.addProduct({ ...formData.value });
      ElMessage.success('创建菜单项成功');
      location.reload();
    } else {
      formData.value.updateTime = now;

      // 准备菜单项数据
      const menuItem = {
        id: formData.value.id,
        name: formData.value.name,
        description: formData.value.description,
        price: formData.value.price,
        available: formData.value.available,
        isRecommend: formData.value.isRecommend,
        salesCount: formData.value.salesCount,
      };

      // 获取上传的文件
      const fileInput = document.querySelector('.el-upload input[type="file"]');
      const file = fileInput?.files[0] || null;

      // 调用API更新菜单项
      const response = await updataMenuItem(file, menuItem, formData.value.categoryId);

      store.updateProduct({ ...formData.value });
      ElMessage.success('更新菜单项成功');
    }

    dialogVisible.value = false;
    fetchData();
  } catch (error) {
    console.error('操作失败:', error);
    ElMessage.error(`操作失败: ${error.message}`);
  }
};

const handleAdd = () => {
  dialogTitle.value = '增加数据';
  formData.value = {
    id: null,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    available: true,
    isRecommend: false,
    salesCount: 0,
    categoryId: 1,
    categoryName: '',
    createTime: '',
    updateTime: ''
  };
  dialogVisible.value = true;
};

const handleEdit = (index, row) => {
  dialogTitle.value = '编辑数据';

  // 直接使用 row 的数据创建一个新的对象来设置 formData
  // 确保 formData 的初始状态完全基于选中的行
  // 使用浅拷贝 {...row} 通常足够，除非 row 中有深层嵌套的对象/数组需要独立修改
  formData.value = { ...row };

  // （可选）如果担心 row 可能缺少某些 formData 中定义的字段，
  // 可以先用默认值填充，再用 row 覆盖，但这通常不是编辑场景所需要的。
  // 比如:
  // const defaultFormData = { ... }; // 定义一个包含所有默认值的对象
  // formData.value = { ...defaultFormData, ...row };
  // 但对于编辑，直接用 row 的数据通常是正确的。

  dialogVisible.value = true;
};

// --- Utility Functions ---
const formatPrice = (price) => {
  return price ? `¥${Number(price).toFixed(2)}` : '-';
};

const formatDateTime = (dateTime) => {
  if (!dateTime) return '-';
  try {
    return new Date(dateTime).toLocaleString();
  } catch (e) {
    return dateTime; // Return original if parsing fails
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
