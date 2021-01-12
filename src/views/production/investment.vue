<template>
  <div v-loading="loading">
    <!-- 密炼投入履历 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="getParams.production_factory_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="生产机台">
        <equip-select
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="混炼/终练">
        <el-select
          v-model="getParams.mixing_finished"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in ['混炼','终练']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班次:">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="投入编码:">
        <material-code-select
          ref="materialCodeSelect"
          :is-all-obj="true"
          @changeSelect="materialCreateForm"
        />
      </el-form-item>
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
        prop="bra_code"
        label="条码"
      />
      <el-table-column
        prop="production_factory_date"
        label="工厂日期"
      />
      <el-table-column
        prop="production_classes"
        label="班次"
      />
      <el-table-column
        prop="mixing_finished"
        label="混炼/终练"
      />
      <el-table-column
        label="胶料编码"
      >
        <template slot-scope="{row}">
          <el-link type="primary" @click="clickTrack(row)">{{ row.product_no }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="equip_no"
        label="生产机台"
        width="80px"
      />
      <el-table-column
        prop="trains"
        label="车次"
        width="80px"
      />
      <el-table-column
        label="投入编码"
        prop="material_no"
      />
      <el-table-column
        prop="created_date"
        label="投入时间"
      />
      <el-table-column
        prop="created_username"
        label="投入操作人"
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
        <el-table-column label="总重量" align="center" prop="total_weight" />
        <el-table-column label="品质状态" align="center" prop="quality_status" />
      </el-table>
      <page
        :old-page="false"
        :total="totalMaterial"
        :current-page="pageMaterial"
        @currentChange="currentChangeMaterial"
      />
    </el-dialog>
  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect/index'
import classSelect from '@/components/ClassSelect'
import MaterialCodeSelect from '@/components/materialCodeSelect'
import { batchChargeLogList } from '@/api/base_w_two'
import { palletFeedBacksUrl } from '@/api/base_w'
import Page from '@/components/page'
import { getMaterialInventoryManage } from '@/api/material-inventory-manage'

export default {
  components: { Page, EquipSelect, classSelect, MaterialCodeSelect },
  data() {
    return {
      getParams: {
        page: 1,
        page_size: 10
      },
      tableData: [],
      tableDataList: [],
      total: 0,
      totalTrack: 0,
      loading: false,
      dialogVisible: false,
      pageTrack: 1,
      page_sizeTrack: 10,
      currentObj: {},
      dialogVisibleMaterial: false,
      totalMaterial: 0,
      pageMaterial: 1,
      page_sizeMaterial: 10,
      lot_no_obj: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = false
      try {
        this.loading = true
        const data = await batchChargeLogList('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.total = data.count
      } catch (e) {
        //
      }
      this.loading = false
    },
    async getTrackList() {
      this.showTableDataChild = true
      console.log(this.currentObj)
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
      this.getParams.page = 1
      this.getList()
    },
    equipSelected(obj) {
      this.getParams.equip_no = obj ? obj.equip_no : ''
      this.changeList()
    },
    classChanged(val) {
      this.getParams.production_classes = val
      this.changeList()
    },
    materialCreateForm(obj) {
      this.getParams.material_no = obj ? obj.material_no : ''
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
      getMaterialInventoryManage({ page: this.pageMaterial,
        page_size: this.page_sizeMaterial,
        lot_no: this.lot_no_obj.lot_no })
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
</script>

<style>

</style>
