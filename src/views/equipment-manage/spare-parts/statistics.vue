<template>
  <div>
    <!-- 备件库 入出库分析统计 -->
    <el-form :inline="true">
      <el-form-item label="起止时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="物料分类">
        <el-input
          v-model="search.equip_component_type"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input
          v-model="search.spare__code"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input
          v-model="search.spare_name"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button :loading="btnExportLoad" type="primary" @click="exportTable">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      row-key="id"
      border
    >
      <el-table-column
        type="index"
        width="50"
        label="序号"
      />
      <el-table-column
        prop="spare__code"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="spare_name"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="component_type_name"
        label="备件分类"
        min-width="20"
      />
      <el-table-column
        prop="specification"
        label="规格型号"
        min-width="20"
      />
      <el-table-column
        prop="in_qty"
        label="入库数量"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogView(scope.row,1)"
          >{{ scope.row.in_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="out_qty"
        label="出库数量"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogView(scope.row,2)"
          >{{ scope.row.out_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="unit"
        label="数量单位"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="80%"
    >
      <el-form :inline="true">
        <el-form-item label="备件分类">
          <el-input v-model="currentObj.component_type_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="currentObj.spare_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="currentObj.specification" :disabled="true" />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        border
      >
        <el-table-column
          prop="spare_code"
          label="备件条码"
          min-width="20"
        />
        <el-table-column
          prop="area_name"
          label="库区"
          min-width="20"
        />
        <el-table-column
          prop="location_name"
          label="库位"
          min-width="20"
        />
        <el-table-column
          prop="quantity"
          label="数量"
          min-width="20"
        />
        <el-table-column
          prop="created_username"
          :label="currentObj.status===1?'入库人':'出库人'"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          :label="currentObj.status===1?'入库时间':'出库时间'"
          min-width="20"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { equipWarehouseStatistical } from '@/api/base_w_five'
export default {
  name: 'Statistics',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      dateValue: [],
      tableData: [],
      tableDataView: [],
      total: 0,
      loadingView: false,
      currentObj: {},
      dialogVisible: false,
      btnExportLoad: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const obj = {}
        Object.assign(obj, this.search)
        const data = await equipWarehouseStatistical('get', null, { params: obj })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.search.page = 1
      this.getList()
    },
    debounceSearch() {
      this.$debounce(this, 'changeSearch')
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    dialogView(row, status) {
      this.currentObj = JSON.parse(JSON.stringify(row))
      this.currentObj.status = status
      this.dialogVisible = true
      this.getViewList(status)
    },
    async getViewList(status) {
      try {
        this.loadingView = true
        const data = await equipWarehouseStatistical('get', null, { params: { status, equip_spare: this.currentObj.equip_spare }})
        this.tableDataView = data || []
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = equipWarehouseStatistical
      _api('get', null, { params: obj, responseType: 'blob' })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '配件入出库分析统计.xlsx' // 下载的文件名
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
</script>

<style>

</style>
