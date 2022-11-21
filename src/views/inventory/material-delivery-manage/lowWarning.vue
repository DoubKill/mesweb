<template>
  <div class="lowWarning-style">
    <!-- 原材料 低库存预警 -->
    <el-form :inline="true">
      <el-form-item label="物料编码">
        <el-select v-model="search.material_no" allow-create filterable placeholder="请选择" clearable @visible-change="getMaterialsList" @change="changeList">
          <el-option
            v-for="item in options2"
            :key="item.material_no"
            :label="item.material_no"
            :value="item.material_no"
          />
        </el-select>
        <!-- <el-input v-model="search.material_no" clearable @input="debounceFun" /> -->
      </el-form-item>
      <el-form-item label="物料名称">
        <el-select v-model="search.material_name" allow-create filterable placeholder="请选择" clearable @visible-change="getMaterialsList" @change="changeList">
          <el-option
            v-for="item in options2"
            :key="item.material_name"
            :label="item.material_name"
            :value="item.material_name"
          />
        </el-select>
        <!-- <el-input v-model="search.material_name" clearable @input="debounceFun" /> -->
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="search.lower_only_flag_" @change="changeFlag">只显示低库存预警</el-checkbox>
      </el-form-item>
      <!-- <el-form-item label="物料组名称">
        <el-select
          v-model="search.material_group_name"
          clearable
          placeholder="请选择"
          filterable
          @change="changeList"
        >
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="巷道名称">
        <el-select
          v-model="search.tunnel_name"
          filterable
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in options1"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item style="float:right">
        <el-button
          type="primary"
          :disabled="btnExportLoad"
          @click="exportTable(1)"
        >导出当前页面</el-button>
        <el-button
          type="primary"
          :disabled="btnExportLoad"
          @click="exportTable(2)"
        >导出全部</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      border
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="name"
        label="物料名称"
        width="120"
      />
      <el-table-column
        prop="code"
        label="物料编码"
        width="170"
      />
      <el-table-column
        prop="zc_material_code"
        label="中策物料编码"
        width="100"
      />
      <!-- <el-table-column
        prop="batch_no"
        label="批次号"
        min-width="20"
      /> -->
      <el-table-column
        prop="unit"
        label="单位"
        width="60"
      />
      <el-table-column
        prop="pdm"
        label="PDM"
        width="60"
      />
      <el-table-column
        prop="group_name"
        label="物料组"
        width="90"
      />
      <!-- <el-table-column
        prop="tunnel_name"
        label="巷道"
        min-width="20"
      /> -->
      <el-table-column
        prop="quantity"
        label="有效库存数量"
        width="100"
      />
      <el-table-column
        prop="weight"
        label="有效库存重量(kg)"
        width="130"
      />
      <el-table-column
        prop="quantity_1"
        label="合格品数量"
        width="90"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.name!=='汇总'&&scope.row.name!=='单页合计'"
            type="primary"
            @click="dialogShow(scope.row,1)"
          >{{ scope.row.quantity_1 }}</el-link>
          <span v-else>{{ scope.row.quantity_1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="weight_1"
        label="合格品重量(kg)"
        width="110"
      />
      <el-table-column
        prop="quantity_5"
        label="待检品数量"
        width="90"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.name!=='汇总'&&scope.row.name!=='单页合计'"
            type="primary"
            @click="dialogShow(scope.row,5)"
          >{{ scope.row.quantity_5 }}</el-link>
          <span v-else>{{ scope.row.quantity_5 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="weight_5"
        label="待检品重量(kg)"
        width="110"
      />
      <el-table-column
        prop="quantity_3"
        label="不合格数量"
        width="100"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.name!=='汇总'&&scope.row.name!=='单页合计'"
            type="primary"
            @click="dialogShow(scope.row,3)"
          >{{ scope.row.quantity_3 }}</el-link>
          <span v-else>{{ scope.row.quantity_3 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="weight_3"
        label="不合格重量(kg)"
        width="110"
      />
      <el-table-column
        prop="total_quantity"
        label="总数量"
        width="60"
      />
      <el-table-column
        prop="total_weight"
        label="总重量(kg)"
        min-width="70"
      />
      <el-table-column
        prop="total_sl"
        label="总件数"
        min-width="70"
      />
      <el-table-column
        prop="total_zl"
        label="总唛头重量"
        min-width="70"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-alert
      :closable="false"
      style="color:#5200FF"
      title="有效库存重量=合格品重量+待检品重量，作为低库存预警的判断条件，与低库存基准值做比较。表格背景色说明：低于基准值"
      type="success"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="90%"
    >
      <materialInventoryManage :quality-status="currentObj.quality_status" :material-no="currentObj.MaterialCode" :show="dialogVisible" :warehouse-name-props="'原材料库'" />
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
import materialInventoryManage from '../components/material-inventory.vue'
import { debounce, setDate } from '@/utils'
import { materialCount } from '@/api/base_w'
import page from '@/components/page'
import { wmsStockSummsry, wmsMaterialGroups, wmsTunnels } from '@/api/base_w_four'
export default {
  name: 'DeliveryStock',
  components: { materialInventoryManage, page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      total: 0,
      currentObj: {},
      dialogVisible: false,
      options: [],
      options1: [],
      options2: [],
      tableData: [],
      loading: false,
      btnExportLoad: false
    }
  },
  created() {
    this.getMaterialGroupList()
    this.getTunnelList()
    this.getList()
  },
  methods: {
    async getMaterialsList(val) {
      if (val) {
        try {
          const data = await materialCount('get', null, { params: { store_name: '原材料库' }})
          this.options2 = data || []
        } catch (e) {
        //
        }
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await wmsStockSummsry('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
        this.tableData.forEach(d => {
          d.quantity = d.quantity_1 + d.quantity_5
          d.weight = d.weight_1 + d.weight_5
        })
        this.tableData.push({
          name: '单页合计',
          quantity: sum(this.tableData, 'quantity'),
          weight: sum(this.tableData, 'weight'),
          quantity_1: sum(this.tableData, 'quantity_1'),
          weight_1: sum(this.tableData, 'weight_1'),
          quantity_3: sum(this.tableData, 'quantity_3'),
          weight_3: sum(this.tableData, 'weight_3'),
          quantity_5: sum(this.tableData, 'quantity_5'),
          weight_5: sum(this.tableData, 'weight_5'),
          total_quantity: sum(this.tableData, 'total_quantity'),
          total_weight: sum(this.tableData, 'total_weight')
        }, {
          name: '汇总',
          quantity: data.total_quantity1 + data.total_quantity5,
          weight: data.total_weight1 + data.total_weight5,
          total_quantity: data.total_quantity,
          total_weight: data.total_weight,
          quantity_1: data.total_quantity1,
          weight_1: data.total_weight1,
          quantity_3: data.total_quantity3,
          weight_3: data.total_weight3,
          quantity_5: data.total_quantity5,
          weight_5: data.total_weight5
        })
      } catch (e) {
        this.loading = false
      }
    },
    dialogShow(row, val) {
      this.currentObj.quality_status = val
      this.currentObj.MaterialCode = row.code
      this.dialogVisible = true
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.name === '单页合计' || row.name === '汇总') {
        return 'summary-cell-style'
      } else if (row.flag === 'L') {
        return 'yellow-style'
      }
    },
    async getMaterialGroupList() {
      try {
        const data = await wmsMaterialGroups('get')
        this.options = data
      } catch (e) {
        //
      }
    },
    async getTunnelList() {
      try {
        const data = await wmsTunnels('get')
        this.options1 = data
      } catch (e) {
        //
      }
    },
    debounceFun() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeFlag() {
      this.search.page = 1
      this.search.lower_only_flag = this.search.lower_only_flag_ ? 1 : ''
      this.getList()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    exportTable(val) {
      this.btnExportLoad = true
      const obj = Object.assign({ export: val }, this.search)
      wmsStockSummsry('get', null, { params: obj, responseType: 'blob' })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = `原材料库-低库存预警${setDate('', true)}.xlsx` // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
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
.lowWarning-style{
    .yellow-style{
        background: rgb(218, 200, 100) !important;;
    }
}

</style>
