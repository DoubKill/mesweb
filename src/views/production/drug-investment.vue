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
      />
      <el-table-column
        prop="bra_code"
        label="原材料条码"
      />
      <el-table-column
        prop="batch_group"
        label="投入班组"
      />
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
