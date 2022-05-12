<template>
  <div>
    <!--胶料超期报警 -->
    剩余有效天数（天）<el-input-number
      v-model="expire_days"
      style="margin-right:30px"
      controls-position="right"
      :min="1"
      :max="30"
      :step="1"
      step-strictly
      @change="changeList"
    />
    物料类别/规格&nbsp;<el-select v-model="stage" filterable placeholder="请选择" clearable @change="changeList">
      <el-option
        v-for="(item,k) in stageList"
        :key="k"
        :label="item.global_name"
        :value="item.global_name"
      />
    </el-select>
    <el-table
      v-loading="loading"
      style="margin-top:10px"
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        label="No."
        type="index"
        width="50"
      />
      <el-table-column
        prop="material_no"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        label="库存数（车）"
        min-width="10"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.material_no!=='汇总'&&scope.row.material_no!=='单页合计'"
            type="primary"
            @click="dialogShow(scope.row)"
          >{{ scope.row.qty }}</el-link>
          <span v-else>{{ scope.row.qty }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="total_weight"
        label="总重量（kg）"
        min-width="10"
      />
      <el-table-column
        prop="quality_status"
        label="品质状态"
        min-width="10"
      />
      <!-- :formatter="d=>{
          return d.quality_status===1?'合格品':d.quality_status===3?'不合格品':''
        }" -->
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
      <materialInventoryManage :expire-days="expire_days" :quality-status="currentObj.quality_status" :material-no="currentObj.material_no" :show="dialogVisible" :warehouse-name-props="'胶料库'" />
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
import { productExpiresList } from '@/api/base_w_five'
import { globalCodesUrl } from '@/api/base_w'
import page from '@/components/page'
export default {
  name: 'CarbonDeliveryOverdueQuery',
  components: { materialInventoryManage, page },
  data() {
    return {
      expire_days: 3,
      loading: false,
      tableData: [],
      dialogVisible: false,
      currentObj: {},
      total: 0,
      getParams: {
        page_size: 10
      },
      stageList: [],
      stage: ''
    }
  },
  created() {
    this.getList()
    globalCodesUrl('get', {
      params: {
        class_name: '胶料段次'
      }
    }).then((response) => {
      this.stageList = response.results
    }).catch(function() {
    })
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        Object.assign(this.getParams, { expire_days: this.expire_days, stage: this.stage })
        const data = await productExpiresList('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false

        this.tableData.push({
          material_no: '单页合计',
          qty: sum(this.tableData, 'qty'),
          total_weight: sum(this.tableData, 'total_weight')
        }, {
          material_no: '汇总',
          qty: data.total_weight,
          total_weight: data.total_quantity
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
    changeList() {
      this.getParams.page = 1
      this.getList()
    },
    dialogShow(row) {
      this.currentObj = row
      this.dialogVisible = true
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.material_no === '单页合计' || row.material_no === '汇总') {
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
