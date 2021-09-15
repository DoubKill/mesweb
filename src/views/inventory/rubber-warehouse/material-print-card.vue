<template>
  <div v-loading="loading" class="app-container">
    <!-- 出库口补打印卡片 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="searchDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="出库/入库">
        <el-select
          v-model="search.order_type"
          placeholder="请选择"
          clearable
          @change="changeList"
        >
          <el-option
            v-for="item in ['出库','入库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="仓库名称">
        <span v-if="warehouseNameProps">{{ warehouseNameProps }}</span>
        <el-select
          v-else
          v-model="search.warehouse_name"
          placeholder="请选择"
          clearable
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
      <el-form-item label="物料编码">
        <el-input v-model="search.material_no" @input="debounceList" />
      </el-form-item>
      <el-form-item label="出入库单号">
        <el-input v-model="search.order_no" @input="debounceList" />
      </el-form-item>
      <el-form-item label="托盘号">
        <el-input v-model="search.pallet_no" @input="debounceList" />
      </el-form-item>
      <el-form-item label="质检条码">
        <el-input v-model="search.lot_no" @input="debounceList" />
      </el-form-item>
      <el-form-item label="打印机所在出库口">
        <stationInfoWarehouse
          ref="stationInfoWarehouseRef"
          :warehouse-name="search.warehouse_name"
          :start-using="true"
          :created-is="false"
          @changSelect="changSelectStation"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-switch
          v-model="is_showed"
          style="display:block;"
          active-text="打印时显示区间"
          @change="showedChange"
        />
        <el-button
          style="float:right;margin:10px 0;"
          @click="printingFun"
        >打印</el-button>
      </el-form-item>
    </el-form>

    <el-table
      id="out-table"
      :data="tableData"
      border
      fit
    >
      <el-table-column label="No" type="index" align="center" width="40" />
      <el-table-column label="类型" align="center" prop="order_type" width="50" />
      <el-table-column label="出入库单号" align="center" prop="order_no" />
      <el-table-column label="质检条码" align="center" prop="lot_no" />
      <!-- <el-table-column label="仓库类型" align="center" prop="warehouse_type" /> -->
      <!-- <el-table-column  label="仓库名称" align="center" prop="warehouse_name" /> -->
      <el-table-column label="托盘号" align="center" prop="pallet_no" />
      <el-table-column label="机台" align="center">
        <template v-if="row.product_info" slot-scope="{row}">
          {{ row.product_info.equip_no }}
        </template>
      </el-table-column>
      <el-table-column label="时间/班次" align="center">
        <template v-if="row.product_info" slot-scope="{row}">
          {{ row.product_info.classes }}
        </template>
      </el-table-column>
      <el-table-column label="车号" align="center">
        <template v-if="row.product_info" slot-scope="{row}">
          {{ row.product_info.memo }}
        </template>
      </el-table-column>
      <el-table-column label="物料编码" align="center" prop="material_no" />
      <el-table-column label="出入库原因" align="center" prop="inout_reason" />
      <el-table-column label="出入库类型" align="center" prop="inout_num_type" />
      <el-table-column label="出入库数" align="center" prop="qty" width="50" />
      <el-table-column label="单位" align="center" prop="unit" width="40" />
      <el-table-column label="重量" align="center" prop="weight" width="80" />
      <el-table-column label="库位号" align="center" prop="" width="80" />
      <el-table-column label="发起人" align="center" prop="initiator" width="80" />
      <el-table-column label="发起时间" align="center" prop="start_time" />
      <el-table-column
        label="完成时间"
        align="center"
        prop="fin_time"
      />
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>
<script>
import { inventoryLog } from '@/api/base_w'
import stationInfoWarehouse from '@/components/select_w/warehouseSelectPosition'
import page from '@/components/page'
// import warehouseSelect from '@/components/select_w/warehouseSelect'
import { setDate, debounce } from '@/utils'
export default {
  name: 'MaterialPrintCard',
  components: { page, stationInfoWarehouse },
  props: {
    warehouseNameProps: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      search: {
        page: 1,
        order_type: '出库',
        warehouse_name: ''
      },
      searchDate: [setDate(null, true), setDate(null, true)],
      total: 0,
      loading: false,
      options1: ['指定出库', '正常出库'],
      options2: [],
      tableData: [],
      btnExportLoad: false,
      is_showed: false
    }
  },
  created() {
    if (this.warehouseNameProps) {
      this.search.warehouse_name = this.warehouseNameProps
    }
    this.search.start_time = setDate(null, true)
    this.search.end_time = setDate(null, true)
    this.getList()
  },
  methods: {
    setDate,
    async getList() {
      try {
        this.loading = true
        const data = await inventoryLog('get', null, { params: this.search })
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
      this.search.start_time = val ? val[0] : ''
      this.search.end_time = val ? val[1] : ''
      this.search.page = 1
      this.getList()
    },
    warehouseSelectFun() {
      this.search.station = ''
      this.search.station_no = ''
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
    changSelectStation(val) {
      this.search.station = val ? val.name : ''
      this.search.station_no = val ? val.id : ''
    },
    async getShowed() {
    //   try {
    //     const data = await showQualifiedRange('get')
    //     this.is_showed = data.is_showed
    //   } catch (e) {
    //     //
    //   }
    },
    async showedChange() {
      try {
        // await showQualifiedRange('post', null, { data: { is_showed: this.is_showed }})
      } catch (e) {
        //
      }
    },
    async printingFun() {
      try {
        // if (this.labelPrintList.length === 0) return
        // const arr = []
        // this.labelPrintList.forEach(D => {
        //   arr.push(D.lot_no)
        // })
        // await labelPrint('post', null, { data: { lot_no: arr }})
        this.$message.success('打印任务已连接')
      } catch (e) {
        //
      }
    }
  }
}
</script>

<style>

</style>
