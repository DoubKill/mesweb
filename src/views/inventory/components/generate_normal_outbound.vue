<template>
  <div class="generate_normal_outbound">
    <!-- 正常出库 -->
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px">
      <el-form-item label="仓库名称">
        {{ warehouseName }}
      </el-form-item>
      <el-form-item label="物料编码" prop="material_no">
        <materialCodeSelect :default-val="ruleForm.material_no" @changSelect="materialCodeFun" />
      </el-form-item>
      <el-form-item label="可用库存数" prop="c">
        <!-- 按物料编码查到的 -->
        <el-input v-model="ruleForm.c" disabled />
      </el-form-item>
      <el-form-item label="需求数量" prop="need_qty">
        <!-- <el-input v-model="ruleForm.need_qty" /> -->
        <el-input-number
          v-model="ruleForm.need_qty"
          controls-position="right"
          :max="ruleForm.c"
        />
      </el-form-item>
      <el-form-item label="需求重量">
        <el-input v-model="ruleForm.need_weight" />
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
import { materialCount } from '@/api/base_w'
export default {
  components: { materialCodeSelect },
  props: {
    warehouseName: {
      type: String,
      default() {
        return ''
      }
    },
    warehouseInfo: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      ruleForm: {
        warehouse_name: this.warehouseName,
        warehouse_info: this.warehouseInfo,
        material_no: 'C-HMB-F150-12',
        inventory_type: '正常出库',
        order_no: 'order_no',
        status: 4,
        need_weight: null
      },
      rules: {
        material_no: [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        c: [
          { required: false, message: '无库存数', trigger: 'blur' }
        ],
        need_qty: [
          { required: true, message: '请输入需求数量', trigger: 'blur' }
        ]
      },
      visible: false,
      loadingBtn: null
    }
  },
  watch: {
  },
  created() {
    this.availableStock()
  },
  methods: {
    creadVal() {
      // 清空数据
      this.$refs.ruleForm.resetFields()
      this.ruleForm = {}
      // this.$set(this.ruleForm, 'material_no', null)
      this.loadingBtn = false
    },
    materialCodeFun(val) {
      this.ruleForm.material_no = val.id || null
    },
    async availableStock() {
      try {
        const data = await materialCount('get', null,
          { params: { material_no: this.ruleForm.material_no }})
        this.$set(this.ruleForm, 'c', data.all_qty)
      } catch (error) {
        //
      }
    },
    visibleMethod(bool) {
      if (bool) {
        this.creadVal()
        this.$emit('visibleMethod')
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.loadingBtn = true
            this.$emit('visibleMethodSubmit', this.ruleForm)
          } else {
            return false
          }
        })
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
  .el-input-number{
     width:auto;
  }
}
</style>
