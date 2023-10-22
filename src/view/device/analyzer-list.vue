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
            <div class="descriptions">
              <el-descriptions column="1" :title="props.row.name">
                <el-descriptions-item>{{ props.row.description }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="100"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="组织">
          <template #default="scope">
            <div>{{getOrganizationById(scope.row.organization_id)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="管理员">
          <template #default="scope">
            <div>{{getManagerById(scope.row.manager_id)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag :type="getStateTagTypeById(scope.row.state_id)">{{getStateNameById(scope.row.state_id)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="240">
          <template #default="scope">
            <el-button
              plain
              size="small"
              type="primary"
              @click="handleBorrow(scope.row)"
              v-if="getStateAvailableById(scope.row.state_id)"
              >领用
            </el-button>
            <el-button
              plain
              size="small"
              type="success"
              @click="handleReturn(scope.row)"
              v-else-if="getStateBorrowedById(scope.row.state_id) && canReturn(scope.row)"
              >归还
            </el-button>
            <el-button
              plain
              size="small"
              type="success"
              disabled
              v-else-if="getStateBorrowedById(scope.row.state_id)"
              >归还
            </el-button>
            <el-button
              plain
              size="small"
              disabled
              v-else
              >禁用
            </el-button>
            <el-button
              plain
              size="small"
              type="primary"
              @click="handleEdit(scope.row.id)"
              v-permission="'更新资源'"
              >编辑
            </el-button>
            <!-- <el-button plain size="small" type="primary" @click="$router.push(`/__name/edit`)">编辑</el-button> -->
            <el-button
              plain
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-permission="'删除资源'"
              >删除
            </el-button>
            <!-- <el-button
              plain
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-permission="{ permission: '删除资源', type: 'disabled' }"
              >删除
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加按钮 -->
      <!-- <el-button class="mt-2" style="width: 100%" @click="$router.push(`/analyzer/edit`)">添加</el-button> -->
      <el-button
        type="primary"
        plain
        style="width: 100%"
        @click="handleCreate()"
        v-permission="'添加资源'"
        >添加
      </el-button>
    </div>

    <!-- 编辑页面 -->
    <object-modify v-else @editClose="editClose"
      :editModelId="editModelId"
      :organizationIdList="organizationIdList"
      :managerIdList="managerIdList"
      :stateIdList="stateIdList"></object-modify>

    <el-dialog v-model="formBorrow.visible" title="领用设备">
      <el-form :model="formBorrow" ref="form" @submit.prevent :rules="rules">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="formBorrow.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="formBorrow.description" autocomplete="off" />
        </el-form-item>
        <el-form-item label="组织" :label-width="formLabelWidth">
          <el-input v-model="formBorrow.organization_id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="领用事由" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8 }"
            placeholder="请输入描述"
            v-model="formBorrow.borrow_reason"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="领用时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="formBorrow.timeRange"
            type="datetimerange"
            :editable="false"
            start-placeholder="领用时间"
            end-placeholder="预计归还时间"
            :default-time="timeDefault"
            :unlink-panels="true"
            :shortcuts="timeShortcuts"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:00.000"
          />
          <!-- "YYYY-MM-DD HH:mm:ss.SSS" -->
        </el-form-item>
        <el-form-item class="submit">
          <el-button type="primary" @click="submitBorrowForm">确 认</el-button>
          <el-button @click="formBorrow.visible = false">取 消</el-button>
        </el-form-item>
      </el-form>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBorrowForm">确认</el-button>
        </span>
      </template> -->
    </el-dialog>

    <el-dialog v-model="formReturn.visible" title="归还设备">
      <el-form :model="formReturn" ref="form" @submit.prevent :rules="rules">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="formReturn.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="formReturn.description" autocomplete="off" />
        </el-form-item>
        <el-form-item label="组织" :label-width="formLabelWidth">
          <el-input v-model="formReturn.organization_id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8 }"
            placeholder="请输入描述"
            v-model="formReturn.comment"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="归还时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="formReturn.return_date"
            type="datetime"
            :editable="false"
            placeholder="归还时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss.SSS"
          />
        </el-form-item>
        <el-form-item class="submit">
          <el-button type="primary" @click="submitReturnForm">确 认</el-button>
          <el-button @click="formReturn.visible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, onMounted, ref, toRaw } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import GenericModel from '@/model/generic-model'
const genericModel = new GenericModel('v1/analyzer')
import ObjectModify from './analyzer-edit'
import ManagerModel from '@/lin/model/manager'
import { forEach } from 'lodash'
import { useDeviceList } from './device'
import { useDataList } from '../data'

export default {
  components: {
    ObjectModify,
  },
  setup() {
    const deviceName = 'analyzer'
    const { getModels } = useDeviceList()
    const tableData = ref([])
    const editModelId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)
    const organizationIdList = ref([])
    const managerIdList = ref([])
    const stateIdList = ref([])
    const tableHeight = ref(300)
    const formLabelWidth = '140px'
    const form = ref(null)
    /**
     * 表单规则验证
     */
    const { rules } = getRules()
    const formBorrow = ref({
      visible: false,
      // id: this.id,
      // user_id: this.user_id,
      // resource_type: this.resource_type,
      // resource_id: this.resource_id,
      borrow_reason: "",
      borrow_date: null,
      expect_return_date: null,
      return_date: null,
      comment: "",
      timeRange: ""
    })
    const formReturn = ref({
      visible: false,
      return_date: null,
      comment: ""
    })
    // const timeDefault = new Date(2000, 1, 1, 12, 0, 0)
    const timeDefault = ref([
      new Date(2000, 1, 1, 9, 0, 0),
      new Date(2000, 2, 1, 18, 30, 0),
    ]) // '12:00:00', '08:00:00'
    const timeShortcuts = [
      {
        text: '一小时',
        value: () => {
          const start = new Date()
          const end = new Date()
          end.setHours(start.getHours() + 1)
          return [start, end]
        },
      },
      {
        text: '一天',
        value: () => {
          const end = new Date()
          const start = new Date()
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
          return [start, end]
        },
      },
      {
        text: '一周',
        value: () => {
          const end = new Date()
          const start = new Date()
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
          return [start, end]
        },
      },
    ]
    const { getUsersAndStore, getUsersFromStore } = useDataList()

    onMounted(() => {
      window.addEventListener('resize', () => { setResize() }, false)
      setResize()
      loading.value = true
      getOrganizationList()
      getManagerList()
      getStateList()
      getDeviceList()
      loading.value = false
    })

    // 响应页面的宽度高度变化
    const setResize = () => {
      const height = window.innerHeight - 200
      tableHeight.value = height >= 120 ? height : 120
      // console.log(tableHeight)
    }

    const getDeviceList = async () => {
      tableData.value = await getModels(deviceName)
    }

    const getOrganizationList = async () => {
      const idList = await getModels('organization')
      // console.log(idList)
      organizationIdList.value = idList
    }

    /**
     * 获取管理员列表数据，@ref getAdminUsers
     */
    const getManagerList = async () => {
      try {
        const users = getUsersFromStore() || (await getUsersAndStore())
        // console.log(users)
        if (users) {
          let list = []
          users.forEach(item => {
            if (item.groups.find(group => (group.name === 'device') || (group.name === 'root'))) {
              list.push(item)
            }
          });
          managerIdList.value = list
        }
        else {
          const res = await ManagerModel.getManagers('device')    // MTODO: test or remove
          managerIdList.value = res.users
        }
        // console.log(managerIdList.value)
      } catch (e) {
        console.error(e)
      }
    }

    const getStateList = async () => {
      const idList = await getModels('state')
      // console.log(idList)
      stateIdList.value = idList
    }

    const getOrganizationById = id => {
      const item = organizationIdList.value.find(item => item.id === id) || {}
      return item.name
    }

    const getManagerById = id => {
      // console.log(managerIdList.value)
      const item = managerIdList.value.find(item => item.id === id) || {}
      return item.nickname  // item.username
    }

    const getStateById = id => {
      // console.log(stateIdList.value)
      const item = stateIdList.value.find(item => item.id === id) || {}
      return item
    }

    const getStateByName = name => {
      const item = stateIdList.value.find(item => item.name === name) || stateIdList[0]
      return item
    }

    const getStateNameById = id => {
      return getStateById(id).name
    }

    const getStateTagTypeById = id => {
      const typeList = [
        { type: "info", name: "未知"},
        { type: "", name: "空闲"},
        { type: "success", name: "预约"},
        { type: "warning", name: "领出"},
        { type: "danger", name: "禁用"},
      ]
      const item = typeList.find(item => item.name === getStateById(id).name) || typeList[0]
      return item.type
    }

    const getStateAvailableById = id => {
      return getStateById(id).name === "空闲"
    }

    const getStateBorrowedById = id => {
      return getStateById(id).name === "领出"
    }

    const canReturn = row => {
      // const store = useStore()
      // const user = computed(() => store.getters.user)
      // console.log(id, user.value.id, id === user.value.id)
      // return id === user.value.id
      return row.returnable
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
          getDeviceList()
          ElMessage.success(`${res.message}`)
        }
      })
    }

    const handleBorrow = row => {
      formBorrow.value = Object.assign(formBorrow.value, row);
      formBorrow.value.visible = true;
    }

    const handleReturn = row => {
      formReturn.value = Object.assign(formReturn.value, row);
      formReturn.value.visible = true;
    }

    const submitBorrowForm = async formName => {
      formBorrow.value.state_id = getStateByName("领出").id // MTODO
      formBorrow.value.borrow_date = formBorrow.value.timeRange[0]
      formBorrow.value.expect_return_date = formBorrow.value.timeRange[1]
      console.log(formBorrow.value)
      form.value.validate(async valid => {
        if (valid) {
          let res = await genericModel.borrowModel(formBorrow.value.id, formBorrow.value)
          if (res.code < window.MAX_SUCCESS_CODE) {
            ElMessage.success(`${res.message}`)
            formBorrow.value.visible = false
            loading.value = true
            getDeviceList()
            loading.value = false
          }
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    }

    const submitReturnForm = async formName => {
      formReturn.value.state_id = getStateByName("空闲").id // MTODO
      console.log(formReturn.value)
      form.value.validate(async valid => {
        if (valid) {
          let res = await genericModel.returnModel(formReturn.value.id, formReturn.value)
          if (res.code < window.MAX_SUCCESS_CODE) {
            ElMessage.success(`${res.message}`)
            formReturn.value.visible = false
            loading.value = true
            getDeviceList()
            loading.value = false
          }
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    }

    const editClose = () => {
      showEdit.value = false
      getDeviceList()
    }

    const indexMethod = index => index + 1

    return {
      tableData,
      loading,
      showEdit,
      organizationIdList,
      managerIdList,
      stateIdList,
      tableHeight,
      editClose,
      getOrganizationById,
      getManagerById,
      getStateNameById,
      getStateTagTypeById,
      getStateAvailableById,
      getStateBorrowedById,
      canReturn,
      handleCreate,
      handleEdit,
      handleBorrow,
      handleReturn,
      submitBorrowForm,
      submitReturnForm,
      editModelId,
      indexMethod,
      handleDelete,
      formLabelWidth,
      form,
      rules,
      formBorrow,
      formReturn,
      timeDefault,
      timeShortcuts
    }
  },
}

/**
 * 表单验证规则
 */
function getRules() {
  /**
   * 验证回调函数
   */
  const checkInfo = (rule, value, callback) => {
    if (!value) {
      callback(new Error('信息不能为空'))
    }
    callback()
  }
  const rules = {
    name: [{ validator: checkInfo, trigger: 'blur', required: true }],
  }
  return { rules }
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
