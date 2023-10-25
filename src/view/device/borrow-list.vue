<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">领用列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" :max-height="tableHeight">
        <el-table-column type="index" :index="indexMethod" label="序号" width="100"></el-table-column>
        <el-table-column prop="resource_type_name" label="资源类型"></el-table-column>
        <el-table-column prop="resource_name" label="名称"></el-table-column>
        <el-table-column prop="nickname" label="领用人"></el-table-column>
        <el-table-column prop="borrow_reason" label="领用事由"></el-table-column>
        <el-table-column prop="borrow_date" label="领用时间"></el-table-column>
        <el-table-column prop="return_date" label="归还时间"></el-table-column>
        <el-table-column prop="comment" label="备注"></el-table-column>
        <!-- <el-table-column label="操作" fixed="right">
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
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import BorrowModel from '@/model/borrow'
const borrowModel = new BorrowModel()
import { useDataList } from '../data'

export default {
  setup() {
    const deviceList = ref({
      analyzer: []
    })
    const tableData = ref([])
    const editModelId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)
    const tableHeight = ref(300)
    const { getUsersAndStore, getUsersFromStore, getModelsAndStore, getDataFromStore } = useDataList()

    onMounted(() => {
      window.addEventListener('resize', () => { setResize() }, false)
      setResize()
      getModels()
    })

    // 响应页面的宽度高度变化
    const setResize = () => {
      const height = window.innerHeight - 200
      tableHeight.value = height >= 120 ? height : 120
      // console.log(tableHeight)
    }

    const getResourceType = (type) => {
      const typeList = getDataFromStore('resource-type')
      return typeList.find(item => item.table_name === type) || {name: type}
    }

    const getDevice = (type, id) => {
      const deviceList = JSON.parse(sessionStorage.getItem(type))
      return deviceList.find(item => item.id === id) || {name: '-'}
    }

    const getUser = (id) => {
      const users = getUsersFromStore()
      return users.find(item => item.id === id) || {nickname: '-'}
    }

    const getModels = async () => {
      try {
        let borrowList = []

        loading.value = true
        // const modelList = await borrowModel.getRecords()
        const modelList = await borrowModel.getUserRecords()
        modelList.forEach(item => {
          const resourceType = getResourceType(item.resource_type)
          const device = getDevice(item.resource_type, item.resource_id)
          const user = getUser(item.user_id)
          item.resource_type_name = resourceType.name
          item.resource_name = device.name
          item.nickname = user.nickname
          borrowList.push(item)
        })

        tableData.value = borrowList
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
      tableHeight,
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
