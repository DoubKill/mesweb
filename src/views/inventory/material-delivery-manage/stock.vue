<template>
  <div>
    <!-- 原材料 巷道别批次库存统计 -->
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
      <el-form-item label="物料组名称">
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
      </el-form-item>
      <el-form-item label="巷道名称">
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
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable(1)"
        >导出当前页面</el-button>
        <el-button
          type="primary"
          :loading="btnExportLoad"
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
        min-width="20"
      />
      <el-table-column
        prop="code"
        label="物料编码"
        min-width="25"
      />
      <el-table-column
        prop="zc_material_code"
        label="中策物料编码"
        min-width="20"
      />
      <el-table-column
        prop="batch_no"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="unit"
        label="单位"
        width="70"
      />
      <el-table-column
        prop="pdm"
        label="PDM"
        width="70"
      />
      <el-table-column
        prop="group_name"
        label="物料组"
        min-width="20"
      />
      <el-table-column
        prop="tunnel_name"
        label="巷道"
        width="90"
      />
      <el-table-column
        prop="quantity"
        label="可用数量"
        width="70"
      />
      <el-table-column
        prop="weight"
        label="重量"
        width="70"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { materialCount } from '@/api/base_w'
import page from '@/components/page'
import { wmsInventory, wmsInventoryDown, wmsMaterialGroups, wmsTunnels } from '@/api/base_w_four'
export default {
  name: 'DeliveryStock',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      total: 0,
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
        const data = await wmsInventory('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
        this.tableData.push({
          name: '单页合计',
          quantity: sum(this.tableData, 'quantity'),
          weight: sum(this.tableData, 'weight')
        }, {
          name: '汇总',
          quantity: data.total_quantity,
          weight: data.total_weight
        })
      } catch (e) {
        this.loading = false
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.name === '单页合计' || row.name === '汇总') {
        return 'summary-cell-style'
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
      const _api = wmsInventoryDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '原材料库-库存统计.xlsx' // 下载的文件名
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

<style lang="scss" scoped>

</style>
