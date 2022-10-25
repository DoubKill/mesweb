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
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="备件分类">
        <el-input
          v-model="search.equip_component_type"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件代码">
        <el-input
          v-model="search.spare_code"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件名称">
        <el-input
          v-model="search.spare_name"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['equip_warehouse_statistical', 'export']" :loading="btnExportLoad" type="primary" @click="exportTable">导出Excel</el-button>
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
        label="备件代码"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialog1(scope.row)"
          >{{ scope.row.spare__code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="spare_name"
        label="备件名称"
        min-width="20"
      />
      <el-table-column
        prop="component_type_name"
        label="备件分类"
        width="100"
      />
      <el-table-column
        prop="specification"
        label="规格型号"
        width="120"
      />
      <el-table-column
        prop="technical_params"
        label="用途"
        width="120"
      />
      <el-table-column
        prop="in_qty"
        label="入库数量"
        width="120"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogView(scope.row,'入库')"
          >{{ scope.row.in_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="unit"
        label="数量单位"
        width="120"
      />
      <el-table-column
        prop="in_money"
        label="入库金额"
        width="120"
      />
      <el-table-column
        prop="out_qty"
        label="出库数量"
        width="120"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogView(scope.row,'出库')"
          >{{ scope.row.out_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="out_money"
        label="出库金额"
        width="120"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="currentObj.status+'详细履历'"
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
        <el-form-item label="用途">
          <el-input v-model="currentObj.technical_params" :disabled="true" />
        </el-form-item>
        <el-form-item style="float:right">
          <el-button
            type="primary"
            @click="exportOutTable"
          >导出明细Excel</el-button>
        </el-form-item>
      </el-form>
      <el-table
        id="out-table"
        v-loading="loadingView"
        :data="tableDataView"
        border
      >
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
          :label="currentObj.status==='入库'?'入库人':'出库人'"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          :label="currentObj.status==='入库'?'入库时间':'出库时间'"
          min-width="20"
        />
        <el-table-column
          prop="order_id"
          :label="currentObj.status==='入库'?'入库单据':'出库单据'"
          min-width="20"
        />
        <el-table-column
          v-if="currentObj.status==='出库'"
          prop="work_order_no"
          label="工单编号"
          min-width="20"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">返回</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="备件代码定义"
      :visible.sync="dialogVisible1"
      width="900px"
    >
      <el-form
        :inline="true"
        label-width="120px"
      >
        <el-form-item
          label="备件分类"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.equip_component_type_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="关键部位"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.key_parts_flag_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="备件代码"
          style=""
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.spare_code"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="库存下限"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.lower_stock"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="备件名称"
          style=""
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.spare_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="库存上限"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.upper_stock"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="规格型号"
          style=""
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.specification"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="计划价格(元)"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.cost"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="用途"
          style=""
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.technical_params"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="材质"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.texture_material"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="标准单位"
          style=""
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.unit"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="有限期(天)"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.period_validity"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisible1=false"
        >返回</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import page from '@/components/page'
import { exportExcel, setDate } from '@/utils/index'
import { equipWarehouseStatistical } from '@/api/base_w_five'
import { equipSpareErp } from '@/api/jqy'
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
      creatOrder: {},
      dialogVisible: false,
      dialogVisible1: false,
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
    dialog1(row) {
      this.currentInfo = row
      this.dialogVisible1 = true
      this.getErpInfo()
    },
    async getErpInfo() {
      try {
        const data = await equipSpareErp('get', null, { params: { spare_code: this.currentInfo.spare__code }})
        if (data.results.length > 0) {
          this.creatOrder = data.results[0]
        }
      } catch (e) {
        //
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
        const data = await equipWarehouseStatistical('get', null, { params: { detail: 1, status, equip_spare: this.currentObj.equip_spare }})
        this.tableDataView = data.results || []
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
    exportOutTable() {
      exportExcel(this.currentObj.status + '履历明细')
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
          link.download = `配件入出库分析统计${setDate('', true)}.xlsx` // 下载的文件名
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
