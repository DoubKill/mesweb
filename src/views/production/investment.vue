<template>
  <div v-loading="loading">
    <!-- 密炼投入履历 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <!-- <el-date-picker
          v-model="getParams.production_factory_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeList"
        /> -->
        <el-date-picker
          v-model="dateValue"
          :clearable="false"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          :equip_no_props="getParams.equip_no"
          :is-clear="false"
          :is-created="true"
          @changeSearch="equipSelected"
        />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input v-model="getParams.product_no" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="计划编号">
        <el-input v-model="getParams.plan_classes_uid" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="车次">
        <el-input v-model="getParams.trains" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="投入物料">
        <el-input v-model="getParams.display_name" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="条码">
        <el-input v-model="getParams.bra_code" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="getParams.created_username" clearable @input="changeInput" />
      </el-form-item>
      <!-- <el-form-item label="混炼/终炼">
        <el-select
          v-model="getParams.mixing_finished"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in ['混炼','终炼']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item> -->
    </el-form>

    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        width="40"
        label="No"
      />

      <el-table-column
        prop="production_factory_date"
        label="工厂日期"
        min-width="12"
      />
      <el-table-column
        prop="production_classes"
        label="班次"
        min-width="6"
      />
      <el-table-column
        prop="equip_no"
        label="生产机台"
        min-width="12"
      />
      <el-table-column
        prop="plan_classes_uid"
        label="计划编号"
        min-width="20"
      />
      <el-table-column
        prop="mixing_finished"
        label="混炼/终练"
        min-width="12"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
        min-width="18"
      />
      <!-- <template slot-scope="{row}">
          <el-link type="primary" @click="clickTrack(row)">{{ row.product_no }}</el-link>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="trains"
        label="车次"
        min-width="8"
      />
      <el-table-column
        label="投入物料"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-link type="primary" @click="checkList(row)">{{ row.display_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="实际投入物料"
        min-width="20"
      >
        <template slot-scope="{row}">
          {{ row.replace_material }}
        </template>
      </el-table-column>
      <el-table-column
        prop="bra_code"
        label="条码"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="投入时间"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="投入操作人"
        min-width="12"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="产出追踪表"
      :visible.sync="dialogVisible"
      width="90%"
    >
      <el-table
        :data="tableDataList"
        border
      >
        <el-table-column
          prop="factory_date"
          label="工厂日期"
        />
        <el-table-column
          prop="classes"
          label="班次"
        />
        <el-table-column
          prop="equip_no"
          label="机台"
        />
        <el-table-column
          prop="product_no"
          label="胶料编码"
        />
        <el-table-column
          prop="name"
          label="车次"
        >
          <template slot-scope="{row}">{{ row.begin_trains }}-{{ row.end_trains }}</template>
        </el-table-column>
        <el-table-column
          prop="created_date"
          label="生产时间"
        />
        <el-table-column
          label="lot_no"
        >
          <template slot-scope="{row}">
            <el-link type="primary" @click="clickLotNo(row)">{{ row.lot_no }}</el-link>
          </template>
        </el-table-column>
      </el-table>
      <page
        :old-page="false"
        :total="totalTrack"
        :current-page="pageTrack"
        @currentChange="currentChangeTrack"
      />
    </el-dialog>

    <el-dialog
      title="物料库存列表"
      :visible.sync="dialogVisibleMaterial"
      width="90%"
    >
      <el-table
        border
        fit
        style="width: 100%"
        :data="tableDataDialog"
      >
        <el-table-column label="No" type="index" align="center" />
        <el-table-column label="物料类型" align="center" prop="material_type" />
        <el-table-column label="物料编码" align="center" prop="material_no" />
        <el-table-column label="lot" align="center" prop="lot_no" />
        <el-table-column label="托盘号" align="center" prop="container_no" />
        <el-table-column label="库存位" align="center" prop="location" />
        <el-table-column label="库存数" align="center" prop="qty" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="单位重量" align="center" prop="unit_weight" />
        <!-- <el-table-column label="总重量" align="center" prop="total_weight" /> -->
        <el-table-column label="品质状态" align="center" prop="quality_status" />
      </el-table>
      <page
        :old-page="false"
        :total="totalMaterial"
        :current-page="pageMaterial"
        @currentChange="currentChangeMaterial"
      />
    </el-dialog>

    <el-dialog
      title="密炼投入物料信息"
      :visible.sync="dialogVisibleList"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="日期">
          <el-input v-model="currentInfo.production_factory_date" disabled />
        </el-form-item>
        <el-form-item label="班次">
          <el-input v-model="currentInfo.production_classes" disabled />
        </el-form-item>
        <el-form-item label="车次">
          <el-input v-model="currentInfo.trains" disabled />
        </el-form-item>
        <el-form-item label="机台">
          <el-input v-model="currentInfo.equip_no" disabled />
        </el-form-item>
        <el-form-item label="胶料编码">
          <el-input v-model="currentInfo.product_no" disabled />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingCheck"
        :data="tableDataCheck"
        border
      >
        <el-table-column
          prop="status"
          label="物料名称"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-link type="primary" @click="clickName(row)">{{ row.material_name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="product_no"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="bra_code"
          label="物料条码"
          min-width="20"
        />
        <el-table-column
          prop="standard_weight"
          label="单包重量kg"
          min-width="20"
        />
        <el-table-column
          prop="standard_error"
          label="单包误差kg"
          min-width="20"
        />
        <el-table-column
          prop="split_count"
          label="分包数"
          min-width="20"
        />
      </el-table>
    </el-dialog>

    <el-dialog
      :title="detailForm.equip_no?'密炼投入物料 胶料详细信息':'密炼投入物料 原材料基础信息'"
      :visible.sync="dialogVisibleDetail"
      width="50%"
    >
      <el-form v-if="detailForm.equip_no" :inline="true" label-width="150px">
        <el-form-item label="胶料编码">
          <el-input v-model="detailForm.product_no" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="机台">
          <el-input v-model="detailForm.equip_no" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="生产日期">
          <el-input v-model="detailForm.product_time" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="班次/班组">
          <el-input v-model="detailForm.classes" disabled style="width:100px" />
          <el-input v-model="detailForm.batch_group" disabled style="width:150px" />
        </el-form-item>
        <el-form-item label="车次">
          <el-input v-model="detailForm.trains" disabled style="width:100px" />
        </el-form-item>
      </el-form>
      <el-form v-else :inline="true" label-width="150px">
        <el-form-item label="代码">
          <el-input v-model="detailForm.TOFAC" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="品名">
          <el-input v-model="detailForm.WLMC" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="批号">
          <el-input v-model="detailForm.PH" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="detailForm.SL" disabled style="width:100px" />
          <el-input v-model="detailForm.SLDW" disabled style="width:150px" />
        </el-form-item>
        <el-form-item label="重量">
          <el-input v-model="detailForm.ZL" disabled style="width:100px" />
          <el-input v-model="detailForm.ZLDW" disabled style="width:150px" />
        </el-form-item>
        <el-form-item label="产地">
          <el-input v-model="detailForm.CD" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="供货商">
          <el-input v-model="detailForm.WLDWMC" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="生产日期">
          <el-input v-model="detailForm.SCRQ" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="使用期限">
          <el-input v-model="detailForm.SYQX" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input v-model="detailForm.DDH" disabled style="width:250px" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import equipSelect from '@/components/select_w/equip'
import classSelect from '@/components/ClassSelect'
import { batchChargeLogList, materialInventoryList } from '@/api/base_w_two'
import { palletFeedBacksUrl } from '@/api/base_w'
import Page from '@/components/page'
import { setDate } from '@/utils'

export default {
  name: 'InternalInvestment',
  components: { Page, equipSelect, classSelect },
  data() {
    return {
      getParams: {
        page: 1,
        page_size: 10
        // production_factory_date: setDate()
      },
      detailForm: {},
      currentInfo: {},
      tableData: [],
      dialogVisibleList: false,
      tableDataCheck: [],
      loadingCheck: [],
      tableDataList: [],
      total: 0,
      totalTrack: 0,
      loading: false,
      dialogVisibleDetail: false,
      dialogVisible: false,
      pageTrack: 1,
      page_sizeTrack: 10,
      currentObj: {},
      dialogVisibleMaterial: false,
      totalMaterial: 0,
      pageMaterial: 1,
      page_sizeMaterial: 10,
      lot_no_obj: {},
      tableDataDialog: [],
      dateValue: [setDate(), setDate()]
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    async checkList(row) {
      try {
        this.dialogVisibleList = true
        this.currentInfo = JSON.parse(JSON.stringify(row))
        const obj = {}
        obj.plan_classes_uid = row.plan_classes_uid
        obj.opera_type = 1
        obj.bra_code = row.bra_code
        obj.trains = row.trains
        this.loadingCheck = true
        const data = await batchChargeLogList('get', null, { params: obj })
        this.tableDataCheck = data
        this.loadingCheck = false
      } catch (e) {
        this.loadingCheck = false
      }
    },
    async clickName(row) {
      try {
        const obj = {}
        obj.opera_type = 2
        obj.bra_code = row.bra_code
        obj.select_name = row.material_name
        const data = await batchChargeLogList('get', null, { params: obj })
        if (data.length > 0) {
          this.detailForm = data[0]
          this.dialogVisibleDetail = true
        } else {
          this.$message('未查到原材料信息')
          this.detailForm = {}
        }
      } catch (e) {
        this.dialogVisibleDetail = false
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await batchChargeLogList('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getTrackList() {
      this.showTableDataChild = true
      try {
        const data = await palletFeedBacksUrl('get', null, { params: {
          page: this.pageTrack,
          page_size: this.page_sizeTrack,
          product_no: this.currentObj.product_no,
          production_factory_date: this.currentObj.production_factory_date,
          classes: this.currentObj.production_classes,
          day_time: this.currentObj.production_factory_date
        }})
        this.tableDataList = data.results || []
        this.totalTrack = data.count
      } catch (e) {
        //
      }
      this.showTableDataChild = false
    },
    changeList() {
      this.getParams.st = this.dateValue ? this.dateValue[0] : ''
      this.getParams.et = this.dateValue ? this.dateValue[1] : ''
      this.getParams.page = 1
      this.getList()
    },
    changeInput() {
      // 防抖
      debounce(this)
    },
    equipSelected(val) {
      this.getParams.equip_no = val
      this.changeList()
    },
    classChanged(val) {
      this.getParams.production_classes = val
      this.changeList()
    },
    clickTrack(row) {
      this.currentObj = row
      this.dialogVisible = true
      this.getTrackList()
    },
    clickLotNo(row) {
      this.lot_no_obj = row
      this.dialogVisibleMaterial = true
      this.getTableData()
    },
    currentChangeTrack(page, pageSize) {
      this.pageTrack = page
      this.page_sizeTrack = pageSize
      this.getTrackList()
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
    },
    getTableData() {
      materialInventoryList('get', null, { params: { page: this.pageMaterial,
        page_size: this.page_sizeMaterial,
        lot_no: this.lot_no_obj.lot_no }})
        .then(response => {
          this.tableDataDialog = response.results
          this.totalMaterial = response.count
        })
    },
    currentChangeMaterial(page, page_size) {
      this.pageMaterial = page
      this.page_sizeMaterial = page_size
      this.getTableData()
    }
  }
}
var timer
function debounce(_this) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    _this.changeList()
  }, 600)
}
</script>

<style>

</style>
