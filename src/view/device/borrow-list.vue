<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">领用列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading">
        <el-table-column type="index" :index="indexMethod" label="序号" width="100"></el-table-column>
        <el-table-column prop="resource_type" label="资源类型"></el-table-column>
        <el-table-column prop="resource_id" label="名称"></el-table-column>
        <el-table-column prop="user_id" label="领用人"></el-table-column>
        <el-table-column prop="borrow_reason" label="领用事由"></el-table-column>
        <el-table-column prop="borrow_date" label="领用时间"></el-table-column>
        <el-table-column prop="return_date" label="归还时间"></el-table-column>
        <el-table-column prop="comment" label="备注"></el-table-column>
        <el-table-column label="操作" fixed="right" width="275">
          <template #default="scope">
            <el-button
              plain
              size="small"
              type="primary"
              @click="handleEdit(scope.row.id)"
              v-if="false"
              >归还</el-button
            >
            <el-button
              plain
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-permission="{ permission: '删除领用记录', type: 'disabled' }"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import BorrowModel from '@/model/borrow'
const borrowModel = new BorrowModel()

export default {
  setup() {
    const tableData = ref([])
    const editModelId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)

    onMounted(() => {
      getModels()
    })

    const getModels = async () => {
      try {
        loading.value = true
        // tableData.value = await borrowModel.getRecords()
        tableData.value = await borrowModel.getUserRecords()
        loading.value = false
      } catch (error) {
        loading.value = false
        if (error.code === 10020) {
          tableData.value = []
        }
      }
    }

    const handleEdit = id => {
      showEdit.value = true
      editModelId.value = id
    }

    const handleDelete = id => {
      ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await borrowModel.deleteModel(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          getModels()
          ElMessage.success(`${res.message}`)
        }
      })
    }

    const editClose = () => {
      showEdit.value = false
      getModels()
    }

    const indexMethod = index => index + 1

    return {
      tableData,
      loading,
      showEdit,
      editClose,
      handleEdit,
      editModelId,
      indexMethod,
      handleDelete,
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
