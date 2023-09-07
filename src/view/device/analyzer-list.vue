<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">抓包工具列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" :max-height="tableHeight">
        <el-table-column type="expand">
          <template #default="props">
            <!-- <div>名称：{{ props.row.name }}</div>
            <div>描述：{{ props.row.description }}</div> -->

            <!-- <el-row :gutter="20">
              <el-col :span="8" :offset="6">
                <div class="grid-content ep-bg-purple">名称：{{ props.row.name }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8" :offset="6">
                <div class="grid-content ep-bg-purple">描述：{{ props.row.description }}</div>
              </el-col>
            </el-row> -->

            <div class="descriptions">
              <!-- <el-descriptions title="User Info" direction="direction"> -->
              <el-descriptions column="1" :title="props.row.name">
                <!-- <el-descriptions-item label="名称：">{{ props.row.name }}</el-descriptions-item> -->
                <el-descriptions-item>{{ props.row.description }}</el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- <el-form status-icon ref="form" label-width="100px" @submit.prevent :rules="rules">
              <el-form-item label="名称：">
                <div>{{ props.row.name }}</div>
              </el-form-item>
              <el-form-item label="描述：">
                <div>{{ props.row.description }}</div>
              </el-form-item>
            </el-form> -->
          </template>
        </el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="100"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="管理员">
          <template #default="scope">
            <div>{{getManagerById(scope.row.manager_id)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag :type="getStateTagTypeById(scope.row.state_id)">{{getStateById(scope.row.state_id)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="240">
          <template #default="scope">
            <el-button plain size="small" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <!-- <el-button plain size="small" type="primary" @click="$router.push(`/__name/edit`)">编辑</el-button> -->
            <el-button
              plain
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-permission="{ permission: '删除抓包工具', type: 'disabled' }"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加按钮 -->
      <!-- <el-button class="mt-2" style="width: 100%" @click="$router.push(`/analyzer/edit`)">添加</el-button> -->
      <el-button type="primary" plain style="width: 100%" @click="handleCreate()">添加</el-button>
    </div>

    <!-- 编辑页面 -->
    <object-modify v-else @editClose="editClose"
      :editModelId="editModelId"
      :managerIdList="managerIdList"
      :stateIdList="stateIdList"></object-modify>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import GenericModel from '@/model/generic-model'
const genericModel = new GenericModel('v1/analyzer')
const dynamicModel = new GenericModel('v1/analyzer')
import ObjectModify from './analyzer-edit'
import ManagerModel from '@/lin/model/manager'

export default {
  components: {
    ObjectModify,
  },
  setup() {
    const tableData = ref([])
    const editModelId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)
    const managerIdList = ref([])
    const stateIdList = ref([])
    const tableHeight = ref(300)

    onMounted(() => {
      window.addEventListener('resize', () => { setResize() }, false)
      setResize()
      loading.value = true
      getManagerList()
      getStateList()
      getModels()
      loading.value = false
    })

    // 响应页面的宽度高度变化
    const setResize = () => {
      const height = window.innerHeight - 200
      tableHeight.value = height >= 120 ? height : 120
      // console.log(tableHeight)
    }

    const getModels = async () => {
      try {
        tableData.value = await genericModel.getModels()
      } catch (error) {
        if (error.code === 10020) {
          tableData.value = []
        }
      }
    }

    /**
     * 获取管理员列表数据，@ref getAdminUsers
     */
    const getManagerList = async () => {
      try {
        const managerGroup = (await ManagerModel.getAllGroups()).find(group => group.name === '设备管理员') || {}
        const groupId = managerGroup.id || 0
        const res = await ManagerModel.getAdminUsers({
          groupId: groupId,
          count: 100,
          page: 0,
        })
        managerIdList.value = res.items
      } catch (e) {
        console.error(e)
      }
    }

    const getStateList = async () => {
      dynamicModel.setRoute('v1/state')
      const idList = await dynamicModel.getModels()
      // console.log(idList)
      stateIdList.value = idList
    }

    const getManagerById = id => {
      // console.log(managerIdList.value)
      const item = managerIdList.value.find(item => item.id === id) || {}
      return item.username
    }

    const getStateById = id => {
      // console.log(stateIdList.value)
      const item = stateIdList.value.find(item => item.id === id) || {}
      return item.name
    }

    const getStateTagTypeById = id => {
      const typeList = [
        { type: "info", name: "未知"},
        { type: "", name: "空闲"},
        { type: "success", name: "预约"},
        { type: "warning", name: "领出"},
        { type: "danger", name: "禁用"},
      ]
      const state = stateIdList.value.find(item => item.id === id) || {}
      const item = typeList.find(item => item.name === state.name) || typeList[0]
      return item.type
    }

    const handleCreate = () => {
      showEdit.value = true
      editModelId.value = null
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
      managerIdList,
      stateIdList,
      tableHeight,
      editClose,
      getManagerById,
      getStateById,
      getStateTagTypeById,
      handleCreate,
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

  // .el-row {
  //   margin-bottom: 20px;
  // }
  // .el-row:last-child {
  //   margin-bottom: 0;
  // }
  // .el-col {
  //   border-radius: 4px;
  // }

  // .grid-content {
  //   border-radius: 4px;
  //   min-height: 36px;
  // }

  .descriptions {
    margin-top: 8px;
    margin-left: 20px;
  }
}
</style>
