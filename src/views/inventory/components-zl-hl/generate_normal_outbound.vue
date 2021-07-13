<template>
  <div class="generate_normal_outbound">
    <!-- 正常出库 -->
    <el-form ref="ruleForm" inline :model="ruleForm" :rules="rules" label-width="100px">
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
          :druss-delivery="drussDelivery"
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
      <el-form-item v-if="['帘布库出库计划'].includes($route.meta.title)" label="物料名称" prop="material_no">
        <materialCodeSelect label-show="material_name" :store-name="warehouseName" :status="ruleForm.quality_status" :default-val="ruleForm.material_no" @changSelect="materialCodeFun" />
      </el-form-item>
      <el-form-item v-else label="物料编码" prop="material_no">
        <materialCodeSelect :store-name="warehouseName" :status="ruleForm.quality_status" :station="ruleForm.station" :default-val="ruleForm.material_no" @changSelect="materialCodeFun" />
      </el-form-item>
      <el-form-item v-if="rawMaterial||drussDelivery" label="库存余量" prop="c">
        <!-- 按物料编码查到的 -->
        <el-input v-model="ruleForm.c" disabled />
      </el-form-item>
      <el-form-item v-if="!rawMaterial&&!drussDelivery" label="可用库存数" prop="c">
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
          :min="0"
          step-strictly
          @change="changeNeedQty"
        />
      </el-form-item>
      <el-form-item label="需求重量">
        <el-input-number
          v-model="ruleForm.need_weight"
          controls-position="right"
          :disabled="!rawMaterial&&!drussDelivery"
          :precision="3"
          :min="0"
        />
      </el-form-item>
      <el-form-item v-if="$route.meta.title==='终炼胶出库计划'" label="关联发货计划">
        {{ ruleForm.deliveryPlan }}
        <el-button type="primary" @click="deliverClick">请添加</el-button>
      </el-form-item>
      <el-form-item v-if="$route.meta.title==='混炼胶出库计划'" label="机台号">
        <EquipSelect ref="EquipSelect" equip-type="密炼设备" :is-multiple="true" @equipSelected="equipSelected" />
      </el-form-item>
      <el-button type="primary" @click="inventorySearch">查找库位</el-button>
    </el-form>

    <el-table
      ref="multipleTable"
      border
      style="width: 100%"
      :data="tableData"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column :key="1" label="物料类型" align="center" prop="material_type" />
      <el-table-column :key="2" label="物料编码" align="center" prop="material_no" />
      <el-table-column v-if="['帘布库出库计划'].includes($route.meta.title)" :key="3" label="物料名称" align="center" prop="material_name" />
      <el-table-column :key="4" label="lot" align="center" prop="lot_no" />
      <el-table-column :key="5" label="托盘号" align="center" prop="container_no" />
      <el-table-column :key="6" label="库存位" align="center" prop="location" />
      <el-table-column
        v-if="warehouseName === '终炼胶库'"
        :key="7"
        width="60"
        label="车数"
        align="center"
        prop=""
      >
        <template slot-scope="{row}">
          {{ row.qty }}
        </template>
      </el-table-column>
      <el-table-column :key="17" label="总重量" align="center" prop="total_weight" />
      <el-table-column
        :key="8"
        label="品质状态"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="['帘布库出库计划'].includes($route.meta.title)">{{ row.quality_status }}</span>
          <span v-else>{{ row.quality_level }}</span>
        </template>
      </el-table-column>
      <el-table-column :key="9" label="入库时间" align="center" prop="in_storage_time" />
      <el-table-column :key="10" label="机台号" width="50" align="center" prop="equip_no" />
      <el-table-column
        v-if="['混炼胶出库计划','终炼胶出库计划'].includes($route.meta.title)"
        :key="18"
        label="计划车数"
        align="center"
        :formatter="(row)=>{
          if(!row.qty){
            return
          }
          let a = Number(row.qty)
          return a.toFixed(0)
        }"
      />
      <el-table-column
        v-if="['终炼胶出库计划'].includes($route.meta.title)"
        :key="12"
        label="车次"
        align="center"
        prop="memo"
        :formatter="(row)=>{
          if(!row.memo){
            return
          }
          return row.memo.replace(',','-')
        }"
      />
      <el-table-column v-else :key="11" label="车号" align="center" prop="memo" />
      <el-table-column :key="13" label="货位状态" align="center" prop="location_status" />
    </el-table>

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
import { bzFinalInventorySearch, bzMixinInventorySearch } from '@/api/base_w_four'
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
    drussDelivery: { // 是不是炭黑
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
      tableData: [],
      multipleSelection: [],
      options: ['一等品', '三等品', '待检品']
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
        this.ruleForm.station_no = b ? b.id : ''
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
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection()
      }
      this.multipleSelection = []

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
      this.ruleForm.need_qty = undefined
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
      this.ruleForm.all_weight = val.all_weight || null
      if (val.material_name) {
        this.ruleForm.material_name = val.material_name || null
      }

      if (this.rawMaterial || this.drussDelivery) {
        this.ruleForm.c = val.all_weight || null
      } else {
        this.ruleForm.c = val.all_qty || null
        const a = (val.all_weight / val.all_qty).toFixed(2)
        if (this.ruleForm.c === this.ruleForm.need_qty) {
          this.ruleForm.need_weight = this.ruleForm.all_weight
          return
        }
        this.ruleForm.need_weight = this.ruleForm.need_qty * a
      }

      if (this.$refs.receiveList) {
        this.$refs.receiveList.clearReceiveSelect()
      }
      this.ruleForm.deliveryPlan = ''
      this.handleSelection = []
    },
    changeNeedQty() {
      if (!this.rawMaterial && !this.drussDelivery) {
        const a = (this.ruleForm.all_weight / this.ruleForm.c).toFixed(2)

        if (this.ruleForm.c === this.ruleForm.need_qty) {
          this.ruleForm.need_weight = this.ruleForm.all_weight
          return
        }
        this.ruleForm.need_weight = this.ruleForm.need_qty * a
      }
    },
    handleSelectionChange(arr) {
      this.multipleSelection = arr
    },
    visibleMethod(bool) {
      if (bool) {
        this.creadVal()
        this.$emit('visibleMethod')
      } else {
        if (this.multipleSelection.length === 0) {
          this.$message.info('请选择物料')
          return
        }
        const dispatchArr = []
        if (this.handleSelection && this.handleSelection.length > 0) {
          this.handleSelection.forEach(D => {
            dispatchArr.push(D.id)
          })
          this.$set(this.ruleForm, 'dispatch', dispatchArr)
        } else {
          this.$set(this.ruleForm, 'dispatch', [])
        }
        const arr = []
        this.multipleSelection.forEach((D) => {
          arr.push({
            order_no: 'order_no',
            pallet_no: D.container_no,
            need_qty: D.qty,
            need_weight: D.total_weight,
            material_no: D.material_no,
            material_name: D.material_name,
            inventory_type: '指定出库',
            inventory_reason: D.inventory_reason,
            unit: D.unit,
            status: 4,
            warehouse_info: this.warehouseInfo,
            quality_status: ['帘布库出库计划'].includes(this.$route.meta.title) ? D.quality_status : D.quality_level,
            dispatch: this.ruleForm.dispatch || [],
            equip: this.ruleForm.equip || [],
            location: D.location,
            station: this.ruleForm.station,
            station_no: this.ruleForm.station_no
          })
        })
        this.loadingBtn = true
        this.$emit('visibleMethodSubmit', this.ruleForm)
      }
    },
    changSelectStation(val) {
      if (this.rawMaterial || this.drussDelivery) {
        this.ruleForm.station = val ? val.station : ''
        this.ruleForm.station_no = val ? val.station_no : ''
        localStorage.setItem('ycl-station', JSON.stringify(val))
      } else {
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection()
        }
        this.multipleSelection = []
        this.tableData = []
        this.ruleForm.station = val ? val.name : ''
        this.ruleForm.station_no = val ? val.id : ''
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
      console.log(this.handleSelection, 'this.handleSelection')
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
    },
    inventorySearch() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            if (!this.ruleForm.need_qty && !this.rawMaterial && !this.drussDelivery) {
              this.$message.info('请输入需求数量!')
              return
            }
            if (!this.ruleForm.need_weight && (this.rawMaterial || this.drussDelivery)) {
              this.$message.info('请输入需求重量!')
              return
            }
            if (this.rawMaterial || this.drussDelivery) {
              if (this.ruleForm.c < this.ruleForm.need_weight) {
                this.$message.info('库存余量不足!')
                return
              }
            }
            const _api = this.warehouseName === '混炼胶库' ? bzMixinInventorySearch : bzFinalInventorySearch
            const data = await _api('get', null, { params: this.ruleForm })
            this.tableData = data
          } catch (error) {
          //
          }
        } else {
          return false
        }
      })
    },
    getRowKeys(row) {
      if (this.rawMaterial || this.drussDelivery) {
        return row.sn
      } else {
        return row.id
      }
    }
  }
}
</script>

<style lang="scss">
.generate_normal_outbound{
  // .el-input{
    // width:280px;
  // }
  // .el-select{
    // width:280px;
  // }
  .dialog-footer{
    width:100%;
    text-align: right;
  }
  .el-input-number{
     width:auto;
  }
}
</style>
