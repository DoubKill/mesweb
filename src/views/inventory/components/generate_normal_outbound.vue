<template>
  <div class="generate_normal_outbound">
    <!-- 正常出库 -->
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px">
      <el-form-item label="仓库名称">
        {{ warehouseName }}
      </el-form-item>
      <el-form-item label="仓库位置" prop="location">
        <stationInfoWarehouse
          ref="stationInfoWarehouseRef"
          :warehouse-name="warehouseName"
          @changSelect="changSelectStation"
        />
      </el-form-item>
      <el-form-item label="品质状态" prop="quality_status">
        <el-select
          v-model="ruleForm.quality_status"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码" prop="material_no">
        <materialCodeSelect :store-name="warehouseName" :default-val="ruleForm.material_no" @changSelect="materialCodeFun" />
      </el-form-item>
      <el-form-item label="可用库存数" prop="c">
        <!-- 按物料编码查到的 -->
        <el-input v-model="ruleForm.c" disabled />
      </el-form-item>
      <el-form-item label="需求数量" prop="need_qty">
        <el-input-number
          v-model="ruleForm.need_qty"
          controls-position="right"
          :max="ruleForm.c"
        />
      </el-form-item>
      <el-form-item label="需求重量">
        <el-input-number
          v-model="ruleForm.need_weight"
          controls-position="right"
          :precision="3"
        />
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
import stationInfoWarehouse from '@/components/select_w/warehouseSelectPosition'
export default {
  components: { materialCodeSelect, stationInfoWarehouse },
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
    var validateMy = (rule, value, callback, _val, error) => {
      if (!_val) {
        callback(new Error(error))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        warehouse_name: this.warehouseName,
        warehouse_info: this.warehouseInfo,
        material_no: '',
        inventory_type: '正常出库',
        order_no: 'order_no',
        status: 4,
        need_weight: undefined
      },
      rules: {
        material_no: [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        quality_status: [
          { required: true, message: '请选择品质状态', trigger: 'change' }
        ],
        c: [
          { required: true, message: '无库存数', trigger: 'blur',
            validator: (rule, value, callback) => {
              validateMy(rule, value, callback,
                this.ruleForm.c, '无库存数')
            } }
        ],
        location: [
          { required: true, message: '仓库位置', trigger: 'blur',
            validator: (rule, value, callback) => {
              validateMy(rule, value, callback,
                this.ruleForm.location, '仓库位置')
            } }
        ],
        need_qty: [
          { required: true, message: '请输入需求数量', trigger: 'blur' }
        ]
      },
      visible: false,
      loadingBtn: null,
      options: ['一等品', '三等品']
    }
  },
  watch: {
  },
  created() {
    // this.availableStock()
  },
  methods: {
    creadVal() {
      // 清空数据
      this.$refs.ruleForm.resetFields()
      // this.ruleForm = {}
      // this.ruleForm.warehouse_info = this.warehouseInfo
      // this.$set(this.ruleForm, 'material_no', null)
      this.loadingBtn = false
      if (this.$refs.stationInfoWarehouseRef) {
        this.$refs.stationInfoWarehouseRef.value = null
      }
    },
    materialCodeFun(val) {
      this.ruleForm.material_no = val.material_no || null
      this.ruleForm.c = val.all_qty || null
    },
    // async availableStock() {
    //   try {
    //     const data = await materialCount('get', null,
    //       { params: { material_no: this.ruleForm.material_no }})
    //     this.$set(this.ruleForm, 'c', data.all_qty)
    //   } catch (error) {
    //     //
    //   }
    // },
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
    },
    changSelectStation(val) {
      this.ruleForm.location = val ? val.name : ''
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
