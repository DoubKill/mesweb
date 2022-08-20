<template>
  <div v-loading="loading">
    <!-- 密炼扫码结果查询 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="dateValue"
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
      <!-- <el-form-item label="物料名">
        <el-input v-model="getParams.material_name" clearable @input="changeInput" />
      </el-form-item> -->
      <el-form-item label="计划编号">
        <el-input v-model="getParams.plan_classes_uid" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="车次">
        <el-input v-model="getParams.trains" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="扫码物料">
        <el-input v-model="getParams.scan_material" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="条码">
        <el-input v-model="getParams.bar_code" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="扫码人">
        <el-input v-model="getParams.scan_username" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="扫码结果">
        <el-select
          v-model="getParams.scan_result"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in ['成功','失败']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
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
        prop="factory_date"
        label="工厂日期"
        width="100"
      />
      <el-table-column
        prop="plan_classes_uid"
        label="计划号"
      />
      <el-table-column
        prop="mix_classes"
        label="班次"
        width="50"
      />
      <el-table-column
        prop="equip_no"
        label="生产机台"
        width="50"
      />
      <el-table-column
        prop="mixing_finished"
        label="混炼/终练"
        width="80"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
      />
      <el-table-column
        prop="scan_material"
        label="扫码物料名"
      />
      <el-table-column
        prop="scan_material_type"
        label="扫码物料类别"
      />
      <el-table-column
        prop="bar_code"
        label="条码"
      />
      <el-table-column
        prop="scan_train"
        label="扫码车次"
        width="80"
      />
      <el-table-column
        prop="unit"
        label="单位"
        width="50"
      />
      <el-table-column
        prop="scan_username"
        label="扫码人"
        width="70"
      />
      <el-table-column
        prop="scan_time"
        label="扫码时间"
      />
      <el-table-column
        prop="init_weight"
        label="初始重量/包数"
      />
      <el-table-column
        prop="scan_result"
        label="扫码结果"
        width="70"
      />
      <el-table-column
        prop="scan_message"
        label="扫码返回信息"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import equipSelect from '@/components/select_w/equip'
import classSelect from '@/components/ClassSelect'
import { batchScanLog } from '@/api/base_w_two'
import Page from '@/components/page'
import { setDate } from '@/utils'

export default {
  name: 'InvestmentResult',
  components: { Page, equipSelect, classSelect },
  data() {
    return {
      getParams: {
        page: 1,
        page_size: 10
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
    async getList() {
      try {
        this.loading = true
        const data = await batchScanLog('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.getParams.factory_date_after = this.dateValue ? this.dateValue[0] : ''
      this.getParams.factory_date_before = this.dateValue ? this.dateValue[1] : ''
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
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
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
