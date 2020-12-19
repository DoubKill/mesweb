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
          :start-using="true"
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
      <el-form-item
        :label="'需求数量('+(warehouseName==='终炼胶库'?'车':'托')+')'"
        prop="need_qty"
      >
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
      <el-form-item v-if="$route.meta.title==='终炼胶出库计划'" label="关联发货计划">
        {{ ruleForm.deliveryPlan }}
        <el-button type="primary" @click="deliverClick">请添加</el-button>
      </el-form-item>
      <el-form-item v-if="$route.meta.title==='混炼胶出库计划'" label="机台号">
        <EquipSelect ref="EquipSelect" :is-multiple="true" @equipSelected="equipSelected" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visibleMethod(true)">取 消</el-button>
      <el-button type="primary" :loading="loadingBtn" @click="visibleMethod(false)">确 定</el-button>
    </div>

    <el-dialog
      title="发货计划管理"
      :visible.sync="dialogVisible"
      width="90%"
      append-to-body
    >
      <receiveList ref="receiveList" :show="dialogVisible" :defalut-val="handleSelection" :is-dialog="true" :material-no="ruleForm.material_no" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDeliveryPlan">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import materialCodeSelect from '@/components/select_w/materialCodeSelect'
import stationInfoWarehouse from '@/components/select_w/warehouseSelectPosition'
import receiveList from '../receive-good-manage/receive-list.vue'
import EquipSelect from '@/components/EquipSelect'
export default {
  components: { EquipSelect, materialCodeSelect, stationInfoWarehouse, receiveList },
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
          { required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              validateMy(rule, value, callback,
                this.ruleForm.c, '无库存数')
            } }
        ],
        location: [
          { required: true, trigger: 'blur',
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
      dialogVisible: false,
      handleSelection: [],
      options: this.warehouseName === '终炼胶库' ? ['一等品', '三等品'] : ['合格品', '不合格品']
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    creadVal() {
      // 清空数据
      this.$refs.ruleForm.resetFields()
      if (this.$refs.receiveList) {
        this.$refs.receiveList.clearReceiveSelect()
      }
      if (this.$refs.EquipSelect) {
        this.$refs.EquipSelect.equipId = null
      }
      this.handleSelection = []
      this.ruleForm.deliveryPlan = ''
      this.loadingBtn = false
      if (this.$refs.stationInfoWarehouseRef) {
        this.$refs.stationInfoWarehouseRef.value = null
      }
    },
    materialCodeFun(val) {
      this.ruleForm.material_no = val.material_no || null
      this.ruleForm.c = val.all_qty || null

      if (this.$refs.receiveList) {
        this.$refs.receiveList.clearReceiveSelect()
      }
      this.ruleForm.deliveryPlan = ''
      this.handleSelection = []
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
    },
    changSelectStation(val) {
      this.ruleForm.location = val ? val.name : ''
    },
    deliverClick() {
      if (!this.ruleForm.material_no) {
        this.$message.info('请选择物料编码')
        return
      }
      this.dialogVisible = true
    },
    sureDeliveryPlan() {
      // 选中发货计划
      let handleSelectionNum = 0
      this.handleSelection = this.$refs.receiveList.handleSelection
      this.ruleForm.deliveryPlan = ''
      this.handleSelection.forEach(D => {
        this.ruleForm.deliveryPlan += D.order_no + ';'
        handleSelectionNum += D.need_qty
      })
      if (handleSelectionNum > this.ruleForm.c) {
        this.$message.info('物料可用库存数不足')
      } else if (handleSelectionNum < this.ruleForm.c) {
        this.$message.info('物料可用库存数有余')
      }
      this.dialogVisible = false
    },
    equipSelected(arr) {
      // arr 机台数组id
      console.log(arr, 7777)
      this.$set(this.ruleForm, 'equipArrId', arr)
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
