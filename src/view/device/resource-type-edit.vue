<template>
  <div class="container">
    <div class="title" v-if="!editModelId">新建设备类型{{ editModelId }}</div>
    <div class="title" v-else>
      <span>修改设备类型</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>

    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="data" status-icon ref="form" label-width="100px" @submit.prevent :rules="rules">
            <el-form-item label="名称" prop="name">
              <el-input v-model="data.name" placeholder="请填写名称"></el-input>
            </el-form-item>
            <el-form-item label="数据表" prop="table_name">
              <el-input v-model="data.table_name" placeholder="请填写数据表名称"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请输入描述"
                v-model="data.description"
              >
              </el-input>
            </el-form-item>

            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm">保 存</el-button>
              <el-button @click="resetForm">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import GenericModel from '@/model/generic-model'
const genericModel = new GenericModel('resource-type')

export default {
  props: {
    editModelId: {
      type: Number,
      default: null,
    },
  },
  setup(props, context) {
    const form = ref(null)
    const loading = ref(false)
    const data = reactive({ name: '', table_name: '', description: '' })

    const listAssign = (a, b) => Object.keys(a).forEach(key => {
      a[key] = b[key] || a[key]
    })

    /**
     * 表单规则验证
     */
    const { rules } = getRules()

    onMounted(() => {
      if (props.editModelId) {
        getModel()
      }
    })

    const getModel = async () => {
      loading.value = true
      const res = await genericModel.getModel(props.editModelId)
      listAssign(data, res)
      loading.value = false
    }

    // 重置表单
    const resetForm = () => {
      form.value.resetFields()
    }

    const submitForm = async formName => {
      form.value.validate(async valid => {
        if (valid) {
          let res = {}
          if (props.editModelId) {
            res = await genericModel.editModel(props.editModelId, data)
            context.emit('editClose')
          } else {
            res = await genericModel.createModel(data)
            resetForm(formName)
          }
          if (res.code < window.MAX_SUCCESS_CODE) {
            ElMessage.success(`${res.message}`)
          }
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    }

    const back = () => {
      context.emit('editClose')
    }

    return {
      back,
      data,
      form,
      rules,
      resetForm,
      submitForm,
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
    table_name: [{ validator: checkInfo, trigger: 'blur', required: true }],
    // description: [{ validator: checkInfo, trigger: 'blur', required: true }],
  }
  return { rules }
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
