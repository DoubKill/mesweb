<template>
  <div>
    <!--原材料 即将超期查询 -->
    超期天数（天）<el-input-number
      v-model="expire_days"
      controls-position="right"
      :min="1"
      :max="30"
      :step="1"
      step-strictly
      @change="getList"
    />
    <el-table
      v-loading="loading"
      style="margin-top:10px"
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        prop="id"
        label="No."
        type="index"
        width="50"
      />
      <el-table-column
        prop="MaterialName"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="MaterialCode"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        label="库存数（托）"
        min-width="10"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.MaterialName!=='汇总'&&scope.row.MaterialName!=='单页合计'"
            type="primary"
            @click="dialogShow(scope.row)"
          >{{ scope.row.quantity }}</el-link>
          <span v-else>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="unit"
        label="单位"
        min-width="10"
      />
      <el-table-column
        label="单位重量（kg）"
        min-width="10"
        :formatter="d=>{
          if(d.WeightOfActual&&d.quantity&&d.MaterialName!=='汇总'&&d.MaterialName!=='单页合计'){
            return Math.round(d.WeightOfActual/d.quantity * 1000) / 1000
          }
          return ''
        }"
      />
      <el-table-column
        prop="WeightOfActual"
        label="总重量（kg）"
        min-width="10"
      />
      <el-table-column
        prop="quality_status"
        label="品质状态"
        min-width="10"
        :formatter="d=>{
          return d.quality_status===1?'合格品':d.quality_status===3?'不合格品':''
        }"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="90%"
    >
      <materialInventoryManage :expire-days="expire_days" :quality-status="currentObj.quality_status" :material-code="currentObj.MaterialCode" :show="dialogVisible" :warehouse-name-props="'原材料库'" />
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogVisible=false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import materialInventoryManage from '../components/material-inventory-manage.vue'
import { wmsExpireList } from '@/api/base_w_five'
import page from '@/components/page'
export default {
  name: 'CarbonDeliveryOverdueQuery',
  components: { materialInventoryManage, page },
  data() {
    return {
      expire_days: 30,
      loading: false,
      tableData: [],
      dialogVisible: false,
      currentObj: {},
      total: 0,
      getParams: {
        page_size: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        Object.assign(this.getParams, { expire_days: this.expire_days })
        const data = await wmsExpireList('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false

        this.tableData.push({
          MaterialName: '单页合计',
          quantity: sum(this.tableData, 'quantity'),
          WeightOfActual: sum(this.tableData, 'WeightOfActual')
        }, {
          MaterialName: '汇总',
          quantity: data.total_quantity,
          WeightOfActual: data.total_weight
        })
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
    },
    dialogShow(row) {
      this.currentObj = row
      this.dialogVisible = true
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.MaterialName === '单页合计' || row.MaterialName === '汇总') {
        return 'summary-cell-style'
      }
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

<style lang="scss" scoped>

</style>
