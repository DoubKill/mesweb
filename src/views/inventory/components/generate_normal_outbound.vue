<template>
  <div class="generate_normal_outbound">
    <!-- 正常出库 -->
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px">
      <el-form-item label="仓库名称">
        仓库名称
      </el-form-item>
      <el-form-item label="物料类型" prop="a">
        <materielTypeSelect :warehouse-name="ruleForm.a" />
      </el-form-item>
      <el-form-item label="物料编码" prop="b">
        <el-input v-model="ruleForm.b" @blur="blurMaterialCode" />
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
import materielTypeSelect from '@/components/select_w/materielTypeSelect'
export default {
  components: { materielTypeSelect },
  data() {
    var validatePass = (rule, value, callback, _val, error) => {
      if (!_val) {
        callback(new Error(error))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {},
      rules: {
        a: [
          { required: true, validator: (rule, value, callback) => {
            validatePass(rule, value, callback,
              this.ruleForm.a, '请选择物料类型')
          } }
        ],
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
    blurMaterialCode() {},
    visibleMethod(bool) {
      if (bool) {
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
