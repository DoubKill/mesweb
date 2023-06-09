<template>
  <div v-loading="loading" class="app-container rubber_repertory_manage-dialog">
    <!-- 锁定车数 混炼终练使用-->
    <el-table
      ref="multipleTable"
      border
      style="width: 100%"
      :data="tableData"
      :row-class-name="rowClassNameFn"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      /> -->
      <el-table-column :key="1" label="物料类型" align="center" prop="material_type" min-width="40" />
      <el-table-column :key="2" label="物料编码" align="center" prop="material_no" />
      <el-table-column :key="3" label="lot" align="center" prop="lot_no" />
      <el-table-column :key="4" label="托盘号" align="center" prop="container_no" min-width="50" />
      <el-table-column :key="5" label="库存位" align="center" prop="location" min-width="50" />
      <el-table-column
        :key="6"
        min-width="40"
        label="车数"
        align="center"
        prop=""
      >
        <template slot-scope="{row}">
          {{ row.qty }}
        </template>
      </el-table-column>
      <el-table-column :key="7" label="总重量" align="center" prop="total_weight" min-width="50" />
      <el-table-column
        :key="8"
        label="品质状态"
        align="center"
        min-width="50"
      >
        <template slot-scope="{row}">
          <span>{{ row.quality_level }}</span>
        </template>
      </el-table-column>
      <el-table-column :key="9" label="入库时间" align="center" prop="in_storage_time" />
      <el-table-column :key="10" label="机台号" width="60" align="center" prop="equip_no" />
      <el-table-column :key="11" label="车号" align="center" prop="memo" min-width="40" />
      <el-table-column :key="12" label="锁定状态" width="70">
        <template v-if="row.locked_status" slot-scope="{row}">
          {{ row.locked_status===1?'工艺锁定':row.locked_status===2?'快检锁定':'工艺/快检锁定' }}
        </template>
      </el-table-column>
      <el-table-column :key="13" label="锁定人" align="center" prop="locked_user" min-width="40" />
      <el-table-column :key="14" label="锁定原因" align="center" prop="locked_reason" min-width="40" />
    </el-table>
  </div>
</template>

<script>
import { productInventoryLock } from '@/api/jqy'
export default {
  name: 'GenerateAssignOutboundLock',
  components: {},
  props: {
    warehouseName: {
      type: String,
      default: ''
    },
    warehouseInfo: {
      type: Number,
      default: null
    },
    equip: {
      type: String,
      default: null
    },
    qualityStatus: {
      type: String,
      default: null
    },
    materialNo: {
      type: String,
      default: null
    },
    lockedStatus: {
      type: Number,
      default: null
    },
    tunnel: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      getParams: {
        equip_no: this.equip,
        tunnel: this.tunnel,
        locked_status: this.lockedStatus,
        quality_status: this.qualityStatus,
        material_no: this.materialNo,
        warehouse_name: this.warehouseName // 仓库名称
      },
      loading: false,
      multipleArr: []
    }
  },
  computed: {
  },
  watch: {
    show(bool) {
      if (bool) {
        this.tableData = []
        this.getParams = {
          equip_no: this.equip,
          tunnel: this.tunnel,
          locked_status: this.lockedStatus,
          quality_status: this.qualityStatus,
          material_no: this.materialNo,
          warehouse_name: this.warehouseName // 仓库名称
        }
        this.getTableData()
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      productInventoryLock('get', null, { params: this.getParams })
        .then(response => {
          this.tableData = response
          this.tableData.push({
            all: 1,
            material_type: '汇总',
            qty: sum(this.tableData, 'qty'),
            total_weight: sum(this.tableData, 'total_weight')
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    rowClassNameFn({ row, rowIndex }) {
      if (row.all) {
        return 'summary-cell-style'
      }
    },
    handleSelectionChange(arr) {
      this.multipleArr = arr
    }
  }
}
function sum(arr, params) {
  var s = 0

  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 1000) / 1000
  return s
}
</script>
<style lang="scss">
.rubber_repertory_manage-dialog{
  .dialog-footer{
    width:100%;
    text-align: right;
  }
  .red-cell-style{
    background: rgb(225, 148, 157);
    color:#000;
  }
  .deepred-cell-style{
    background: red;
    color:#000;
  }
}
</style>
