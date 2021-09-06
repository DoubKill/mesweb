<template>
  <div v-loading="loading" class="delivery-document">
    <!-- 出库单据信息查询 -->
    <el-form :inline="true">
      <el-form-item label="库区">
        <el-select v-model="search.aaa" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in ['终炼胶库','混炼胶库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库口">
        <stationInfoWarehouse
          :warehouse-name="search.aaa"
          :start-using="true"
          @changSelect="changSelectStation"
        />
      </el-form-item>
      <el-form-item label="胶料编码">
        <materialCodeSelect
          :is-clearable="true"
          :store-name="search.aaa"
          :is-allow-create="true"
          @changSelect="materialCodeFun"
        />
      </el-form-item>
      <el-form-item label="出库单据号">
        <el-input v-model="search.order_no" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="search.status" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in optionsState"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库起止时间">
        <el-date-picker
          v-model="searchDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeList"
        />
      </el-form-item>
      <!-- <el-form-item style="float:right">
        <el-button
          type="primary"
          @click="exportTable"
        >导出表格</el-button>
      </el-form-item> -->
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        prop="id"
        label="序号"
        type="index"
        min-width="20"
      />
      <el-table-column
        prop="order_no"
        label="出库单据号"
        min-width="20"
      />
      <el-table-column
        prop="order_type"
        label="单据类型"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
        min-width="20"
      />
      <el-table-column
        label="状态"
        min-width="20"
        :formatter="(row)=>{
          let obj = optionsState.find(d=>d.id === row.status)
          return obj.name
        }"
      />
      <el-table-column
        prop="created_username"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="230"
      >
        <template slot-scope="{row}">
          <el-button
            size="mini"
            @click="showEditDialog(row)"
          >查看</el-button>
          <div v-if="row.status === 1||row.status === 2" style="display:inline-block">
            <el-button v-permission="['compoundRubber_plan','close']" size="mini" type="info" @click="closePlan($index,row)">关闭</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="出库单据"
      :visible.sync="dialogVisibleView"
      width="80%"
      :before-close="handleCloseView"
    >
      <el-form :inline="true">
        <el-form-item label="仓库名称">
          {{ warehouseName }}
        </el-form-item>
        <el-form-item label="出库单号">
          {{ rowObj.order_no }}
        </el-form-item>
        <el-form-item label="出库位置">
          {{ tableDataView[0]?tableDataView[0].station:'' }}
        </el-form-item>
        <el-form-item label="订单子编号">
          <el-input
            v-model="searchView.subnumber"
            clearable
            placeholder="请输入内容"
            @input="getDebounceView"
          />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        border
      >
        <el-table-column
          prop=""
          label="订单子编号"
          min-width="20"
        />
        <el-table-column
          prop="material_no"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="lot_no"
          label="Lot_No"
          min-width="25"
        />
        <el-table-column
          prop="pallet_no"
          label="托盘号"
          min-width="15"
        />
        <el-table-column
          prop="memo"
          label="车次"
          min-width="15"
        />
        <el-table-column
          prop="location"
          label="库位编号"
          min-width="20"
        />
        <el-table-column
          prop="last_updated_date"
          label="出库时间"
          min-width="20"
        />
        <el-table-column
          prop="status"
          label="状态"
          min-width="10"
          :formatter="(row)=>{
            let obj = optionsState1.find(d=>d.id === row.status)
            return obj.name
          }"
        />
      </el-table>
      <page
        :old-page="false"
        :total="totalView"
        :current-page="searchView.page"
        @currentChange="currentChangeView"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mixinRubberyOutboundOrder } from '@/api/base_w'
import { warehouseInfo } from '@/api/warehouse'
import page from '@/components/page'
import commitVal from '@/utils/common'
import { debounce } from '@/utils/index'
import myMixin from '../components-zl-hl/mixin-zl-hl'
import materialCodeSelect from '@/components/select_w/materialCodeSelect'
import stationInfoWarehouse from '@/components/select_w/warehouseSelectPosition'

export default {
  name: 'CompoundManage',
  components: { stationInfoWarehouse, materialCodeSelect, page },
  mixins: [myMixin],
  data() {
    return {
      loading: false,
      searchDate: [],
      search: {
        page: 1
      },
      dateSearch: [],
      total: 0,
      options1: commitVal.statusList,
      tableData: [],
      currentIndex: null,
      loadingBtn: false,
      rowVal: {},
      warehouseName: '混炼胶库',
      // 仓库id
      warehouseInfo: null,
      handleSelection: [],
      optionsState: [
        { name: '已创建', id: 1 },
        { name: '等待出库', id: 2 },
        { name: '已出库', id: 3 },
        { name: '关闭', id: 4 },
        { name: '失败', id: 5 }
      ],
      optionsState1: [
        { name: '完成', id: 1 },
        { name: '执行中', id: 2 },
        { name: '失败', id: 3 },
        { name: '新建', id: 4 },
        { name: '关闭', id: 5 }
      ]
    }
  },
  created() {
    this.getListWrehouseInfo()
    // this.getList()
    this.loading = true
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        this.tableData = []
        const data = await mixinRubberyOutboundOrder('get', null, { params: this.search })
        this.total = data.count
        this.tableData = data.results
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async getListWrehouseInfo() {
      try {
        const data = await warehouseInfo({ all: 1, name: this.warehouseName })
        this.warehouseInfo = data[0].id
        this.getList()
      } catch (error) {
        //
      }
    },
    getDebounce() {
      debounce(this, 'changeList')
    },
    materialCodeFun(obj) {
      this.search.material_no = obj ? obj.material_no : ''
      this.changeList()
    },
    changSelectStation(val) {
      this.search.station = val ? val.name : ''
      this.changeList()
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    changeList(val) {
      this.search.start_time = val ? val[0] : ''
      this.search.end_time = val ? val[1] : ''
      this.search.page = 1
      this.getList()
    },
    handleSelectionChange(val) {
      this.handleSelection = val
    },
    closePlan(index, row) {
      this.$confirm(
        '确定关闭?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        this.loading = true
        // await finalRubberyOutboundOrder('put', row.id, { data: { status: 4 }})
        this.$message.success('操作成功')
        this.getList()
      }).catch(() => {
        this.loading = false
      })
    },
    exportTable() {
      // responseType: 'blob'  get请求

      // barcodeQualityExport()
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '车间库存统计.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
    }
  }
}
</script>
<style lang="scss">
  .delivery-document{
    .el-dialog{
      min-width: 500px !important;
    }
  }
</style>
