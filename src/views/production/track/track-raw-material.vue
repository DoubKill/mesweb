<template>
  <div v-loading="loading" class="track-raw-rubber">
    <!-- 条码追溯(原材料->终炼胶) -->
    <el-form :inline="true" size="small">
      <el-form-item label="追溯码">
        <el-input
          v-model="search.bra_code"
          placeholder="请输入内容"
          clearable
          style="width:300px"
          @input="barCodeInput"
        />
      </el-form-item>
      <br>
      <el-form-item label="商品名">
        <el-input
          v-model="search.trace_material"
          placeholder="请输入内容"
          clearable
          @input="barCodeInput"
        />
      </el-form-item>
      <el-form-item label="厂商">
        <el-input
          v-model="search.supplier"
          placeholder="请输入内容"
          clearable
          @input="barCodeInput"
        />
      </el-form-item>
      <el-form-item label="批次号">
        <el-input
          v-model="search.batch_no"
          placeholder="请输入内容"
          clearable
          @input="barCodeInput"
        />
      </el-form-item>
      <el-form-item label="生产日期">
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
      <el-form-item label="ERP入库日期">
        <el-date-picker
          v-model="dateValue1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeList">查询</el-button>
        <el-button v-permission="['barcode_trace','add']" type="primary" :disabled="btnExportLoad" @click="templateDownload(1)">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="singleTable" :data="tableData" border highlight-current-row @current-change="handleCurrentChange">
      <el-table-column type="index" width="40" label="No" />
      <el-table-column prop="scan_material_record" label="商品名" min-width="20" />
      <el-table-column prop="supplier" label="厂商" min-width="30" />
      <el-table-column prop="batch_no" label="批次号" min-width="20" />
      <el-table-column prop="product_time" label="生产日期" min-width="20" />
      <el-table-column prop="erp_in_time" label="ERP入库日期" min-width="20" />
      <el-table-column label="质检条码" min-width="23">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false">{{ scope.row.bra_code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="pallet_no" label="托盘号" min-width="10" />
      <el-table-column prop="standard_weight" label="重量kg" min-width="10" />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <h3 v-if="showInfo">追溯详情</h3>
    <el-form v-if="showInfo&&formData" :inline="true" size="small">
      <el-form-item label="质检条码">{{ formData.bra_code }}</el-form-item>
      <el-form-item label="商品名">{{ formData.material_name_record }}</el-form-item>
      <el-form-item label="厂商">{{ formData.supplier }}</el-form-item>
      <el-form-item label="批次号">{{ formData.batch_no }}</el-form-item>
      <el-form-item label="生产日期">{{ formData.product_time }}</el-form-item>
      <el-form-item label="ERP入库日期">{{ formData.erp_in_time }}</el-form-item>
      <el-form-item label="托盘号">{{ formData.pallet_no }}</el-form-item>
      <el-form-item label="重量">{{ formData.standard_weight }}</el-form-item>
    </el-form>
    <h4 v-if="showInfo" style="display:inline-block">物料追溯信息</h4>
    <div v-if="showInfo" style="float:right">
      <el-button type="primary" :disabled="btnExportLoad" @click="templateDownload(2)">导出PDF(正向追溯)</el-button>
    </div>
    <el-tabs v-if="showInfo" v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="(tabItem,index) in tabList" :key="tabItem" :label="tabItem" :name="index.toString()" />
      <el-table
        :data="tableData1"
        style="width: 100%"
        border
        :row-class-name="getRowClass"
      >
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-table :data="row.xl_detail" style="width: 100%" border>
              <el-table-column label="物料" prop="material_name" />
              <el-table-column label="商品名" prop="material_name" />
              <el-table-column label="厂商" prop="supplier" />
              <el-table-column label="批次号" prop="batch_no" />
              <el-table-column label="生产日期" prop="product_time" />
              <el-table-column label="ERP入库日期" prop="erp_in_time" />
              <el-table-column label="重量kg" prop="standard_weight" />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" width="40" label="No" />
        <el-table-column v-if="activeName!=='0'" prop="before" label="前段名-行号" width="90" />
        <el-table-column prop="scan_material_type" label="类别" width="60" />
        <el-table-column prop="scan_material" label="投入物料编码" min-width="20" />
        <el-table-column prop="product_no" label="胶料编码" min-width="20" />
        <el-table-column prop="equip_no" label="机台" width="50" />
        <el-table-column prop="product_time" label="生产日期" width="90" />
        <el-table-column label="班次/班组" width="80" :formatter="d=>{return (d.classes?d.classes:'')+'/'+(d.group?d.group:'')}" />
        <el-table-column prop="plan_classes_uid" label="计划编号" min-width="20" />
        <el-table-column prop="trains" label="车次" width="60" />
        <el-table-column prop="bra_code" label="追溯码" min-width="20" />
        <el-table-column prop="pallet_no" label="托盘号" min-width="20" />
        <el-table-column prop="standard_weight" label="重量kg/包" width="80" />
        <el-table-column prop="begin_time" label="密炼/配料 开始时间" min-width="20" />
        <el-table-column prop="end_time" label="密炼/配料 结束时间" min-width="20" />
        <el-table-column prop="arrange_rubber_time" label="收皮时间" min-width="20" />
      </el-table>
    </el-tabs>
  </div>
</template>

<script>
import Page from '@/components/page'
import { barcodeTrace } from '@/api/base_w_five'
import { setDate } from '@/utils'
export default {
  name: 'TrackRawMaterial',
  components: { Page },
  data() {
    return {
      search: { bra_code: '' },
      dateValue: [],
      dateValue1: [],
      loading: false,
      loadingInfo: false,
      btnExportLoad: false,
      total: 0,
      tableData: [],
      activeName: '0',
      tableData1: [],
      tabList: [],
      formData: {},
      showInfo: false,
      tableDataInfo: {}
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    async getList() {
      const obj = JSON.parse(JSON.stringify(this.search))
      if (obj.bra_code) {
        if (obj.bra_code.length < 9) {
          this.$message('追溯码最少输入9位')
          return
        }
      }
      obj.trace_flag = 0
      this.loading = true
      try {
        const data = await barcodeTrace('get', null, { params: obj })
        this.tableData = data.page_result || []
        this.total = data.total_data
        this.loading = false
      } catch (e) {
        this.loading = false
        this.tableData = []
      }
    },
    classChanged(val) {
      this.search.classes = val
    },
    changeDate() {
      this.search.st = this.dateValue ? this.dateValue[0] : ''
      this.search.et = this.dateValue ? this.dateValue[1] : ''
      this.search.se = this.dateValue1 ? this.dateValue1[0] : ''
      this.search.ee = this.dateValue1 ? this.dateValue1[1] : ''
    },
    changeList() {
      this.$refs.singleTable.setCurrentRow()
      this.showInfo = false
      this.search.page = 1
      this.getList()
    },
    barCodeInput() {
      // this.$debounce(this, 'changeDate')
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
    },
    handleClick(val) {
      this.getTrace(val.label)
    },
    handleCurrentChange(val) {
      this.showInfo = true
      this.formData = JSON.parse(JSON.stringify(val))

      this.getInfo()
    },
    async getInfo() {
      try {
        this.loadingInfo = true
        this.tableDataInfo = {}
        this.tableData1 = []
        const data = await barcodeTrace('post', null, { data: {
          trace_flag: 0, bra_code: this.formData.bra_code,
          code_type: this.formData.code_type
        }})
        this.activeName = '0'
        const key = Object.keys(data)
        this.tabList = key || []
        this.tableDataInfo = data || {}
        this.getTrace(key[0])

        this.loadingInfo = false
      } catch (e) {
        this.loadingInfo = false
      }
    },
    getTrace(key) {
      const arr = []
      const data = this.tableDataInfo || {}
      if (!data[key]) {
        return
      }
      data[key].forEach(d => {
        for (const product_no in d) {
          if (Object.hasOwnProperty.call(d, product_no)) {
            const element = d[product_no]
            if (Array.isArray(element)) {
              element[0].product_no = product_no
              element.forEach(dd => {
                dd.before = d.before
                dd.begin_time = dd.begin_time ? setDate(dd.begin_time, true) : ''
                dd.end_time = dd.end_time ? setDate(dd.end_time, true) : ''
                dd.arrange_rubber_time = dd.arrange_rubber_time ? setDate(dd.arrange_rubber_time, true) : ''
                dd.product_time = dd.product_time ? setDate(dd.product_time) : ''
              })
              arr.push(...element)
            }
          }
        }
      })
      this.tableData1 = arr || []
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.$refs.singleTable.setCurrentRow()
      this.showInfo = false
      this.getList()
    },
    getRowClass(row, rowIndex) {
      if (!row.row.xl_detail || row.row.xl_detail.length === 0) { // 判断当前行是否有子数据或者根据实际情况设置
        return 'row-expand-cover'
      }
    },
    templateDownload(type) {
      this.btnExportLoad = true
      let obj = Object.assign({ export: 1 }, {
        trace_flag: 0, bra_code: this.formData.bra_code,
        code_type: this.formData.code_type
      })
      if (type === 1) {
        obj = Object.assign({ export: 1, trace_flag: 0 }, this.search)
      }
      const _api = type === 1 ? 'get' : 'post'
      const _obj = type === 1 ? { params: obj } : { data: obj }
      barcodeTrace(_api, null, { responseType: 'blob', ..._obj })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = type === 1 ? '条码追溯(终炼胶->原材料).xlsx'
            : this.formData.bra_code + '追溯详情.xlsx' // 下载的文件名
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

<style lang="scss">
.track-raw-rubber{
    .row-expand-cover .cell .el-table__expand-icon {
      display: none;
    }
    .el-table__body tr.current-row>td{
      background-color: greenyellow;
    }
}
</style>
