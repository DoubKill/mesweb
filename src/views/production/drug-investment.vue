<template>
  <div>
    <!-- 药品投入 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="getParams.production_factory_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :clearable="false"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="投入设备:">
        <inputDevices @changSelect="inputDevicesChange" />
      </el-form-item>
      <el-form-item label="罐号">
        <inputDevices is-equip="tank_no" @changSelect="tankNoChange" />
      </el-form-item>
      <el-form-item label="班次">
        <class-select @classSelected="classChanged" />
      </el-form-item>
      <!-- <el-form-item label="区间">
        <el-select
          v-model="getParams.interval"
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in ['班次','日','周','月','年']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码:">
        <material-code-select
          ref="materialCodeSelect"
          :is-all-obj="true"
          @changeSelect="materialCreateForm"
        />
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
        prop="tank_no"
        label="罐号"
      />
      <el-table-column
        prop="production_factory_date"
        label="工厂日期"
      />
      <el-table-column
        prop="equip_no"
        label="投入设备"
      />
      <el-table-column
        prop="weight_batch_no"
        label="小料配方"
      />
      <el-table-column
        prop="material_no"
        label="物料编码"
      />
      <el-table-column
        prop="quantity"
        label="投入数量"
      />
      <el-table-column
        prop="actual_weight"
        label="投入重量"
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
import inputDevices from './components/input-devices'
import Page from '@/components/page'
import { setDate } from '@/utils'
import { weightBatchingLogList } from '@/api/base_w_two'
export default {
  name: 'DrugInvestment',
  components: { Page, inputDevices, ClassSelect },
  data() {
    return {
      getParams: {
        page: 1,
        page_size: 10,
        production_factory_date: setDate(),
        interval: '班次'
      },
      tableData: [],
      total: 0

    }
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
      this.getParams.classes = val
      this.getList()
    },
    currentChange(page, page_size) {
      this.getParams.page = page
      this.getParams.page_size = page_size
      this.getList()
    },
    materialCreateForm(obj) {
      this.getParams.material_no = obj ? obj.material_no : ''
      this.changeList()
    },
    changeList() {
      if (!this.getParams.production_factory_date) {
        this.$message.info('请选择工厂日期')
        return
      }
      this.getParams.page = 1
      this.getList()
    },
    tankNoChange(obj) {
      console.log(obj, 'obj')
      this.getParams.tank_no = obj ? obj.tank_no : ''
      this.changeList()
    },
    inputDevicesChange(obj) {
      this.getParams.equip_no = obj ? obj.equip_no : ''
      this.changeList()
    }
  }
}
</script>

<style>

</style>
