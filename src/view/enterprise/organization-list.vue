<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">组织列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading">
        <el-table-column type="index" :index="indexMethod" label="序号" width="100"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="操作" fixed="right" width="275">
          <template #default="scope">
            <el-button plain size="small" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <!-- <el-button plain size="small" type="primary" @click="$router.push(`/__name/edit`)">编辑</el-button> -->
            <el-button
              plain
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-permission="{ permission: '删除组织', type: 'disabled' }"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑页面 -->
    <object-modify v-else @editClose="editClose" :editModelId="editModelId"></object-modify>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import GenericModel from '@/model/generic-model'
const genericModel = new GenericModel('v1/organization')
import ObjectModify from './organization-edit'

export default {
  components: {
    ObjectModify,
  },
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
        tableData.value = await genericModel.getModels()
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
        const res = await genericModel.deleteModel(id)
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
