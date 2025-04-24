<template>
  <div class="order-manager">
    <div class="header">
      <h2 class="title">订单管理</h2>
      <div class="actions">
        <el-button type="primary" @click="fetchData">
          <el-icon><Refresh /></el-icon>
          <span>刷新</span>
        </el-button>
      </div>
    </div>

    <el-alert
      v-if="error"
      title="加载订单失败"
      type="error"
      :description="error.message"
      show-icon
      closable
    />

    <el-card shadow="hover" class="table-container">
      <el-table 
        v-loading="loading"
        :data="store.orders" 
        border 
        stripe
        style="width: 100%"
        :header-cell-style="{background: '#f5f7fa', color: '#606266'}"
      >
        <el-table-column prop="orderNumber" label="订单号" width="180" />
        <el-table-column prop="userName" label="用户" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{row}">
            <el-tag :type="getStatusType(row.status)">
              {{
                row.status === 'PENDING' ? '待处理' :
                row.status === 'PAID' ? '已支付' :
                row.status === 'COMPLETED' ? '已完成' :
                row.status === 'PREPARING' ? '处理中' :
                row.status === 'CANCELLED' ? '已取消' : row.status
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="120" />
        <el-table-column label="订单项">
          <template #default="{row}">
            <div v-for="(item, index) in row.orderItems" :key="index" class="order-item">
              <span>{{ item.itemName }} ×{{ item.quantity }} = ¥{{ item.price * item.quantity }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{row}">
            <el-button size="small" type="primary" @click="handleEdit(row.id)">处理</el-button>
            <el-button size="small" type="success" @click="handleComplete(row.id)">完成</el-button>
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
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useMainStore } from '../store'
import { getOrders,handleOrder,completeOrder } from '../api'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const store = useMainStore()
const loading = ref(false)
const error = ref(null)
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const fetchData = async () => {
  try {
    console.log('开始获取订单数据...')
    loading.value = true
    error.value = null
    
    console.log('分页参数:', {
      page: pagination.currentPage,
      size: pagination.pageSize
    })
    
    const response = await getOrders()
    
    console.log('API响应:', response)
    
    // 检查响应数据结构
    if (response && Array.isArray(response)) {
      store.setOrders(response)
      pagination.total = response.length
    } else if (response && response.data) {
      store.setOrders(response.data.list || response.data)
      pagination.total = response.data.total || response.data.length || 0
    } else {
      throw new Error('无效的响应数据格式')
    }
    
    console.log('订单数据加载成功', store.orders)
  } catch (err) {
    console.error('获取订单数据失败:', err)
    error.value = {
      message: err.message || '获取订单数据失败'
    }
  } finally {
    console.log('请求完成，重置loading状态')
    loading.value = false
  }
}

const getStatusType = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'PAID':
      return 'primary'
    case 'COMPLETED':
      return 'success'
    case 'CANCELLED':
      return 'danger'
    case 'PREPARING':
      return 'primary'
    default:
      return 'info'
  }
}

const handleSizeChange = (newSize) => {
  pagination.pageSize = newSize
  pagination.currentPage = 1
  fetchData()
}

const handleCurrentChange = (newPage) => {
  pagination.currentPage = newPage
  fetchData()
}

onMounted(() => {
  fetchData()
})

// 移除对store.orders的watch监听，避免循环调用

const handleEdit = async (orderId) => {
  try {
    const result = await handleOrder(orderId)
    console.log('处理订单', orderId)
    ElMessage.success(result)
    await fetchData()
  } catch (err) {
    console.error('处理订单失败:', err)
    ElMessage.error(err.message || '处理订单失败')
  }
}

const handleComplete = async (orderId) => {
  try {
    const result = await completeOrder(orderId)
    console.log('完成订单', orderId)
    ElMessage.success(result)
    await fetchData()
  } catch (err) {
    console.error('操作完成订单失败:', err)
  }
}
</script>

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

  .order-item {
    padding: 8px 0;
    color: #606266;
    font-size: 14px;
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
