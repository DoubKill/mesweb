<template>
  <div class="generate_normal_outbound">
    <!-- 正常出库 -->
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px">
      <el-form-item label="仓库名称">
        {{ warehouseval }}
      </el-form-item>
      <el-form-item label="物料编码" prop="b">
        <materialCodeSelect :default-val="ruleForm.b" @changSelect="materialCodeFun" />
      </el-form-item>
      <el-form-item label="可用库存数" prop="c">
        <!-- 按物料编码查到的 -->
        <el-input v-model="ruleForm.c" disabled />
      </el-form-item>
      <el-form-item label="需求数量" prop="d">
        <el-input v-model="ruleForm.d" />
      </el-form-item>
      <el-form-item label="需求重量">
        <el-input v-model="ruleForm.e" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visibleMethod(true)">取 消</el-button>
      <el-button type="primary" :loading="loadingBtn" @click="visibleMethod(false)">确 定</el-button>
    </div>
  </div>
</template>
<script>
import materialCodeSelect from '@/components/select_w/materialCodeSelect'

export default {
  components: { materialCodeSelect },
  props: {
    warehouseval: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      ruleForm: {
        b: null
      },
      rules: {
        b: [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        c: [
          { required: true, message: '无库存数', trigger: 'blur' }
        ],
        d: [
          { required: true, message: '请输入需求数量', trigger: 'blur' }
        ]
      },
      visible: false,
      loadingBtn: false
    }
  },
  methods: {
    creadVal() {
      // 清空数据
      this.$refs.ruleForm.resetFields()
      this.ruleForm = {}
      this.$set(this.ruleForm, 'b', null)
      // this.ruleForm.b = null
    },
    materialCodeFun(val) {
      this.ruleForm.b = val.id || null
    },
    visibleMethod(bool) {
      if (bool) {
        this.creadVal()
        this.$emit('visibleMethod')
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            return false
          }
        })
        // console.log(666)
        // this.loadingBtn = true
        //
      }
    }
  }
}
</script>

<style lang="scss">
.generate_normal_outbound{
  .el-input{
    width:300px;
  }
  .el-select{
    width:300px;
  }
  .dialog-footer{
    width:100%;
    text-align: right;
  }
}
</style>
