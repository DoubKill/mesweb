<template>
  <div v-loading="loading" class="app-container">
    <!-- 胶料库  出入库履历查询 -->
    <el-form :inline="true">
      <el-form-item label="入库时间">
        <el-date-picker
          v-model="searchDate"
          :disabled="isDialog"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="出库时间">
        <el-date-picker
          v-model="searchDate1"
          :disabled="isDialog"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate1"
        />
      </el-form-item>
      <!-- <el-form-item label="类型">
        <el-select
          v-model="search.type"
          placeholder="请选择"
          clearable
          @change="changeList"
        >
          <el-option
            v-for="item in options1"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="出库/入库">
        <el-select
          v-model="search.order_type"
          placeholder="请选择"
          :disabled="isDialog"
          @change="changeList"
        >
          <el-option
            v-for="item in ['出库','入库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="仓库名称">
        <span v-if="warehouseNameProps">{{ warehouseNameProps }}</span>
        <el-select
          v-else
          v-model="search.warehouse_name"
          placeholder="请选择"
          @change="warehouseSelectFun"
        >
          <el-option
            v-for="item in ['混炼胶库','终炼胶库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <!-- <warehouseSelect :created-is="true" @changSelect="warehouseSelectFun" /> -->
      </el-form-item>
      <el-form-item v-if="(warehouseNameProps!=='原材料库'&&warehouseNameProps!=='炭黑库')&&!isDialog" label="巷道">
        <el-select
          v-model="search.tunnel"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in ['1','2','3','4']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="巷道">
        <el-select v-model="search.tunnel" filterable clearable placeholder="请选择" @visible-change="getTunnelNameList" @change="changeList">
          <el-option
            v-for="item in TunnelNameList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="(warehouseNameProps!=='原材料库'&&warehouseNameProps!=='炭黑库')&&!isDialog" label="胶料名称">
        <el-select v-model="search.product_no" allow-create filterable placeholder="请选择" clearable @visible-change="getProductList" @change="changeList">
          <el-option
            v-for="item in options"
            :key="item.material_no"
            :label="item.material_no"
            :value="item.material_no"
          />
        </el-select>
        <!-- <el-input v-model="search.material_no" clearable @input="debounceList" /> -->
      </el-form-item>
      <el-form-item v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="物料编码">
        <el-select v-model="search.material_no" allow-create filterable placeholder="请选择" clearable @visible-change="getMaterialsList" @change="changeList">
          <el-option
            v-for="item in options3"
            :key="item.code"
            :label="item.code"
            :value="item.code"
          />
        </el-select>
        <!-- <el-input v-model="search.material_no" clearable @input="debounceList" /> -->
      </el-form-item>
      <el-form-item v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="物料名称">
        <el-select v-model="search.material_name" allow-create filterable placeholder="请选择" clearable @visible-change="getMaterialsList" @change="changeList">
          <el-option
            v-for="item in options3"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <!-- <el-input v-model="search.material_name" clearable @input="debounceList" /> -->
      </el-form-item>
      <el-form-item label="出库单据号">
        <el-input v-model="search.order_no" clearable @input="debounceList" />
      </el-form-item>
      <el-form-item label="出库任务号">
        <el-input v-model="search.task_no" clearable @input="debounceList" />
      </el-form-item>
      <el-form-item label="托盘号">
        <el-input v-model="search.pallet_no" clearable @input="debounceList" />
      </el-form-item>
      <el-form-item label="质检条码">
        <el-input v-model="search.lot_no" clearable @input="debounceList" />
      </el-form-item>
      <el-form-item v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="品质状态">
        <el-select
          v-model="search.quality_status"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in [{value:1,label:'合格'},{value:3,label:'不合格'},{value:5,label:'待检'}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="是否进烘房">
        <el-select
          v-model="search.is_entering"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in ['Y','N']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="机台">
        <selectEquip
          :equip_no_props.sync="search.equip_no"
          @changeSearch="changeList"
        />
      </el-form-item>
      <!-- <el-form-item label="车次">
        <el-input-number v-model="search.num" controls-position="right" :min="1" :max="search.num1" @change="changeList" />-
        <el-input-number v-model="search.num1" controls-position="right" :min="search.num" :max="999" @change="changeList" />
      </el-form-item> -->
      <el-form-item v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="批次号">
        <el-input v-model="search.l_batch_no" clearable @input="debounceList" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable(false)"
        >导出当前页</el-button>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable(true)"
        >导出所有</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      :data="tableData"
      border
      fit
    >
      <el-table-column label="No" type="index" align="center" width="40" />
      <el-table-column label="胶料名称" align="center" prop="product_no" />
      <el-table-column label="机台" align="center" prop="equip_no" />
      <el-table-column label="车次" align="center" prop="memo" width="50" />
      <el-table-column label="重量(kg)" align="center" prop="weight" width="80" />
      <el-table-column label="托盘号" align="center" prop="pallet_no" width="80" />
      <el-table-column v-if="(warehouseNameProps!=='原材料库'&&warehouseNameProps!=='炭黑库')&&!isDialog" label="巷道" align="center" prop="location" width="50">
        <template slot-scope="{row}">
          {{ row.location?row.location.split('-')[0]:'' }}
        </template>
      </el-table-column>
      <el-table-column v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="巷道" align="center" width="50">
        <template slot-scope="{row}">
          {{ row.location?row.location.split('-')[1]:'' }}
        </template>
      </el-table-column>
      <el-table-column label="质检条码" align="center" prop="lot_no" width="150" />
      <el-table-column label="入库单号" align="center" prop="inbound_order_no" />
      <!-- <el-table-column label="入库发起人" align="center" prop="" /> -->
      <el-table-column label="入库发起时间" align="center" prop="inbound_time" />
      <!-- <el-table-column label="入库完成时间" align="center" prop="" /> -->
      <el-table-column label="出库单据号" align="center" prop="order_no" />
      <el-table-column label="出库任务号" align="center" prop="outbound_order_no" />
      <el-table-column label="出库发起时间" align="center" prop="outbound_time" />
      <el-table-column label="出库发起人" align="center" prop="outbound_user" />
      <!-- <el-table-column label="出库完成时间" align="center" prop="" /> -->
      <el-table-column
        v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'"
        label="查看处理履历"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.order_type==='出库'"
            size="mini"
            type="primary"
            @click="checkList(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="处理履历"
      :visible.sync="dialogVisibleList"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="物料名称">
          <el-input v-model="currentInfo.material_name" disabled />
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input v-model="currentInfo.material_code" disabled />
        </el-form-item>
        <el-form-item label="批次号">
          <el-input v-model="currentInfo.lot_no" disabled />
        </el-form-item>
      </el-form>
      <el-table
        id="out-table"
        v-loading="loadingCheck"
        :data="tableDataCheck"
        border
      >
        <el-table-column
          prop="status"
          label="处理内容"
          min-width="20"
        />
        <el-table-column
          prop="quality_status"
          label="品质状态"
          min-width="20"
        />
        <el-table-column
          prop="result"
          label="处理结果"
          min-width="20"
        />
        <el-table-column
          prop="except_reason"
          label="处理说明"
          min-width="20"
        />
        <el-table-column
          prop="created_username"
          label="处理人"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          label="处理时间"
          min-width="20"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisibleList=false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { productInOutHistory } from '@/api/base_w'
import page from '@/components/page'
import { wmsTunnels, thTunnels } from '@/api/base_w_four'
import { batchingMaterials } from '@/api/base_w'
import { wmsExceptHandle, wmsMaterials, thMaterials } from '@/api/jqy'
// import warehouseSelect from '@/components/select_w/warehouseSelect'
import { setDate, debounce, exportExcel } from '@/utils'
import selectEquip from '@/components/select_w/equip'
export default {
  name: 'MaterialInoutRecordRubber',
  components: { page, selectEquip },
  props: {
    warehouseNameProps: {
      type: String,
      default: ''
    },
    isDialog: {
      type: Boolean,
      default: false
    },
    dialogSearch: {
      type: Object,
      default() {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: {
        page: 1,
        warehouse_name: '混炼胶库'
      },
      searchDate: [],
      searchDate1: [],
      currentInfo: {},
      TunnelNameList: [],
      tableDataCheck: [],
      dialogVisibleList: false,
      loadingCheck: false,
      total: 0,
      loading: false,
      options: [],
      options1: ['指定出库', '正常出库'],
      options2: [],
      options3: [],
      tableData: [],
      btnExportLoad: false
    }
  },
  watch: {
    show(bool) {
      if (bool) {
        this.search = {
          page: 1,
          order_type: '出库'
        }
        Object.assign(this.search, this.dialogSearch)

        if (this.warehouseNameProps) {
          this.search.warehouse_name = this.warehouseNameProps
        }
        this.searchDate = [this.search.start_time, this.search.end_time]
        this.getList()
      }
    }
  },
  created() {
    this.search.out_st = setDate() + ' 00:00:00'
    this.search.out_et = setDate(null, true)

    if (this.isDialog) {
      Object.assign(this.search, this.dialogSearch)
    }
    if (this.warehouseNameProps) {
      this.search.warehouse_name = this.warehouseNameProps
    }
    this.searchDate1 = [this.search.out_st, this.search.out_et]
    this.getList()
  },
  methods: {
    setDate,
    async getMaterialsList(val) {
      if (val) {
        try {
          const api = this.warehouseNameProps === '原材料库' ? wmsMaterials : thMaterials
          const data = await api('get', null, { params: { all: 1 }})
          this.options3 = data || []
        } catch (e) {
        //
        }
      }
    },
    async getProductList(val) {
      if (val) {
        try {
          const data = await batchingMaterials('get', null, { params: { all: 1 }})
          this.options = data || []
        } catch (e) {
        //
        }
      }
    },
    async getTunnelNameList(val) {
      if (val) {
        try {
          if (this.warehouseNameProps === '原材料库') {
            const data = await wmsTunnels('get')
            this.TunnelNameList = data || []
          } else if (this.warehouseNameProps === '炭黑库') {
            const data = await thTunnels('get')
            this.TunnelNameList = data || []
          } else {
            return
          }
        } catch (e) {
        //
        }
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await productInOutHistory('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    changeDate(val) {
      this.search.in_st = val ? val[0] : ''
      this.search.in_et = val ? val[1] : ''
      this.search.page = 1
      this.getList()
    },
    changeDate1(val) {
      this.search.out_st = val ? val[0] : ''
      this.search.out_et = val ? val[1] : ''
      this.search.page = 1
      this.getList()
    },
    async checkList(row) {
      try {
        this.dialogVisibleList = true
        this.currentInfo = {
          material_name: row.material_name,
          material_code: row.material_no,
          lot_no: row.lot_no
        }
        this.loadingCheck = true
        const data = await wmsExceptHandle('get', null, { params: this.currentInfo })
        this.tableDataCheck = data.results
        this.loadingCheck = false
      } catch (e) {
        this.loadingCheck = false
      }
    },
    warehouseSelectFun() {
      this.search.page = 1
      this.getList()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    debounceList() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    exportTable(bool) {
      // true导出所有
      if (bool) {
        if (this.tableData.length === 0) {
          this.$message.info('暂无数据')
          return
        }
        const obj = Object.assign({ export: 1 }, this.search)
        productInOutHistory('get', null, { responseType: 'blob', params: obj })
          .then(res => {
            const link = document.createElement('a')
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            link.download = this.search.warehouse_name + '出入库履历.xlsx' // 下载的文件名
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            this.btnExportLoad = false
          }).catch(e => {
            this.btnExportLoad = false
          })
      } else {
        // null, [{ wpx: 50 }, { wpx: 50 }, { wpx: 120 }]
        exportExcel(this.search.warehouse_name + '出入库履历')
      }
    }
  }
}
</script>

<style>

</style>
