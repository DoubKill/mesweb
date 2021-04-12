<template>
  <div class="generate_normal_outbound">
    <!-- 正常出库 -->
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px">
      <el-form-item label="仓库名称">
        {{ warehouseName }}
      </el-form-item>
      <el-form-item label="出库口" prop="station">
        <stationInfoWarehouse
          ref="stationInfoWarehouseRef"
          :warehouse-name="warehouseName"
          :start-using="true"
          :created-is="true"
          :raw-material="rawMaterial"
          :show="show"
          @changSelect="changSelectStation"
        />
      </el-form-item>
      <el-form-item label="品质状态" prop="quality_status">
        <el-select
          v-model="ruleForm.quality_status"
          placeholder="请选择"
          @change="changeQuality"
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
        <materialCodeSelect :store-name="warehouseName" :status="ruleForm.quality_status" :default-val="ruleForm.material_no" @changSelect="materialCodeFun" />
      </el-form-item>
      <el-form-item v-if="rawMaterial" label="库存余量" prop="c">
        <!-- 按物料编码查到的 -->
        <el-input v-model="ruleForm.c" disabled />
      </el-form-item>
      <el-form-item v-if="!rawMaterial" label="可用库存数" prop="c">
        <!-- 按物料编码查到的 -->
        <el-input v-model="ruleForm.c" disabled />
      </el-form-item>
      <el-form-item
        :label="'需求数量('+(warehouseName==='帘布库'?'托':'车')+')'"
      >
        <!-- prop="need_qty" -->
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
        <EquipSelect ref="EquipSelect" equip-type="密炼设备" :is-multiple="true" @equipSelected="equipSelected" />
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
    },
    rawMaterial: { // 是不是原材料
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
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
        need_weight: undefined,
        station: '',
        quality_status: ['终炼胶库', '混炼胶库'].includes(this.warehouseName) ? '一等品' : '合格品'
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
                this.ruleForm.c, '无库存')
            } }
        ],
        station: [
          { required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              validateMy(rule, value, callback,
                this.ruleForm.station, '出库口')
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
      options: ['终炼胶库', '混炼胶库'].includes(this.warehouseName) ? ['一等品', '三等品'] : ['合格品', '不合格品']
    }
  },
  watch: {
    show(val) {
      if (val) {
        if (this.warehouseName === '混炼胶库') {
          if (this.$refs.stationInfoWarehouseRef) {
            const a = localStorage.getItem('hl-station')
            const b = a ? JSON.parse(a) : null
            this.ruleForm.station = b ? b.name : ''
            this.$refs.stationInfoWarehouseRef.value = b ? b.id : ''
          }
          // this.ruleForm.quality_status = localStorage.getItem('hl-quality') || null
        }
      }
    }
  },
  updated() {
    if (this.warehouseName === '混炼胶库') {
      if (this.$refs.stationInfoWarehouseRef) {
        const a = localStorage.getItem('hl-station')
        const b = a ? JSON.parse(a) : null
        this.ruleForm.station = b ? b.name : ''
        this.$refs.stationInfoWarehouseRef.value = b ? b.id : ''
      }
      // this.ruleForm.quality_status = localStorage.getItem('hl-quality') || null
    }
  },
  mounted() {
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
      this.ruleForm.dispatch = []
      this.ruleForm.equip = []
      this.ruleForm.need_weight = undefined
      this.handleSelection = []
      this.ruleForm.deliveryPlan = ''
      this.loadingBtn = false
      if (this.warehouseName === '混炼胶库') {
        // 不让清除出库口和品质状态
        this.$emit('refresList')
        return
      }
      // this.ruleForm.quality_status = null
      if (this.$refs.stationInfoWarehouseRef) {
        this.$refs.stationInfoWarehouseRef.value = null
      }
    },
    materialCodeFun(val) {
      this.ruleForm.material_no = val.material_no || null
      if (this.rawMaterial) {
        this.ruleForm.c = val.all_weight || null
      } else {
        this.ruleForm.c = val.all_qty || null
      }

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
        const dispatchArr = []
        if (this.handleSelection && this.handleSelection.length > 0) {
          this.handleSelection.forEach(D => {
            dispatchArr.push(D.id)
          })
          this.$set(this.ruleForm, 'dispatch', dispatchArr)
        } else {
          this.$set(this.ruleForm, 'dispatch', [])
        }
        if (!this.ruleForm.need_qty && !this.rawMaterial) {
          this.$message.info('请输入需求数量!')
          return
        }
        if (!this.ruleForm.need_weight && this.rawMaterial) {
          this.$message.info('请输入需求重量!')
          return
        }
        if (this.rawMaterial) {
          if (this.ruleForm.c < this.ruleForm.need_weight) {
            this.$message.info('库存余量不足!')
            return
          }
        }
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
      if (this.rawMaterial) {
        this.ruleForm.station = val ? val.station : ''
        this.ruleForm.station_no = val ? val.station_no : ''
        localStorage.setItem('ycl-station', JSON.stringify(val))
      } else {
        this.ruleForm.station = val ? val.name : ''
      }
      if (val && this.warehouseName === '混炼胶库') {
        const obj = { name: val.name, id: val.id }
        localStorage.setItem('hl-station', JSON.stringify(obj))
      }
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
        this.$message.info('物料可用库存不足')
      } else if (handleSelectionNum < this.ruleForm.c) {
        this.$message.info('物料可用库存有余')
      }
      this.dialogVisible = false
    },
    equipSelected(arr) {
      // arr 机台数组id
      if (arr && arr.length > 0) {
        this.$set(this.ruleForm, 'equip', arr)
      } else {
        if (Object.prototype.hasOwnProperty.call(this.ruleForm, 'equip')) {
          delete this.ruleForm.equip
        }
      }
    },
    changeQuality(val) {
      if (val && this.warehouseName === '混炼胶库') {
        localStorage.setItem('hl-quality', val)
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
