<template>
  <div>
    <!-- 药品投入 -->
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="getParams.batch_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :clearable="false"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select @classSelected="classChanged" />
      </el-form-item>
      <el-form-item label="称量机台">
        <el-select
          v-model="getParams.equip_no"
          clearable
          placeholder="请选择"
          filterable
          @change="changeList"
        >
          <el-option
            v-for="item in options1"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="罐号">
        <el-select
          v-model="getParams.tank_no"
          clearable
          placeholder="请选择"
          filterable
          @change="changeList"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投入物料">
        <el-input v-model="getParams.material_name" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="条码">
        <el-input v-model="getParams.bra_code" clearable @input="changeInput" />
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="getParams.created_username" clearable @input="changeInput" />
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
        prop="equip_no"
        label="称量设备"
      />
      <el-table-column
        prop="tank_no"
        label="罐号"
      />
      <el-table-column
        prop="scan_material"
        label="投入原材料"
      >
        <template slot-scope="{row}">
          <el-link type="primary" @click="clickName(row,1)">{{ row.scan_material }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="bra_code"
        label="原材料条码"
      />
      <el-table-column
        prop="scan_material"
        label="投入包数"
      >
        <template slot-scope="{row}">
          <el-link type="primary" @click="clickName(row,2)">{{ row.total_num }}</el-link>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="batch_group"
        label="投入班组"
      /> -->
      <el-table-column
        prop="batch_classes"
        label="投入班次"
      />
      <el-table-column
        prop="batch_time"
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
      title="投料明细"
      :visible.sync="dialogVisibleList"
      width="50%"
    >
      <el-table
        v-loading="loadingList"
        :data="tableDataList"
        border
      >
        <el-table-column
          prop="bra_code"
          label="条码"
          min-width="20"
        />
        <el-table-column
          prop="batch_time"
          label="投入时间"
          min-width="20"
        />
        <el-table-column
          prop="created_username"
          label="投入人"
          min-width="20"
        />
      </el-table>
    </el-dialog>

    <el-dialog
      title="原材料基础信息"
      :visible.sync="dialogVisibleDetail"
      width="50%"
    >
      <el-form :inline="true" label-width="150px">
        <el-form-item label="代码">
          <el-input v-model="detailForm.tofac" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="品名">
          <el-input v-model="detailForm.wlmc" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="批号">
          <el-input v-model="detailForm.ph" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="detailForm.sl" disabled style="width:100px" />
          <el-input v-model="detailForm.sldw" disabled style="width:150px" />
        </el-form-item>
        <el-form-item label="重量">
          <el-input v-model="detailForm.zl" disabled style="width:100px" />
          <el-input v-model="detailForm.zldw" disabled style="width:150px" />
        </el-form-item>
        <el-form-item label="产地">
          <el-input v-model="detailForm.cd" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="供货商">
          <el-input v-model="detailForm.wldwmc" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="生产日期">
          <el-input v-model="detailForm.scrq" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="使用期限">
          <el-input v-model="detailForm.syqx" disabled style="width:250px" />
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input v-model="detailForm.ddh" disabled style="width:250px" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ClassSelect from '@/components/ClassSelect'
// import MaterialCodeSelect from '@/components/materialCodeSelect'
// import inputDevices from './components/input-devices'
import Page from '@/components/page'
import { setDate } from '@/utils'
import { weightBatchingLogList } from '@/api/base_w_two'
export default {
  name: 'DrugInvestment',
  components: { Page, ClassSelect },
  data() {
    return {
      getParams: {
        page: 1,
        page_size: 10,
        batch_time: setDate()
      },
      detailForm: {},
      dialogVisibleList: false,
      tableDataList: [],
      loadingList: false,
      dialogVisibleDetail: false,
      options: ['1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A',
        '1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B', '9B', '10B', '11B'],
      options1: ['F01', 'F02', 'F03', 'S01', 'S02'],
      tableData: [],
      total: 0

    }
  },
  created() {
    this.getList()
  },
  methods: {
    async clickName(row, val) {
      try {
        val === 1 ? this.dialogVisibleDetail = true : this.dialogVisibleList = true
        const obj = {}
        obj.batch_time = this.getParams.batch_time
        obj.bra_code = row.bra_code
        obj.opera_type = val
        this.loadingList = true
        const data = await weightBatchingLogList('get', null, { params: obj })
        if (val === 1) {
          if (data.length > 0) {
            this.detailForm = data[0]
          } else {
            this.detailForm = {}
          }
        } else {
          this.tableDataList = data || []
        }
        this.loadingList = false
      } catch (e) {
        this.loadingList = false
      }
    },
    async getList() {
      try {
        const data = await weightBatchingLogList('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.total = data.count
      } catch (e) {
        //
      }
    },
    classChanged(val) {
      this.getParams.batch_classes = val
      this.getList()
    },
    currentChange(page, page_size) {
      this.getParams.page = page
      this.getParams.page_size = page_size
      this.getList()
    },
    changeInput() {
      // 防抖
      debounce(this)
    },
    changeList() {
      if (!this.getParams.batch_time) {
        this.$message.info('请选择工厂日期')
        return
      }
      this.getParams.page = 1
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
