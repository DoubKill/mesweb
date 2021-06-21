<template>
  <div class="material-menni-report">
    <!-- 胶料门尼数据上报 -->
    上报日期
    <el-date-picker
      v-model="created_date"
      style="margin:0 10px;"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="选择日期"
      :clearable="false"
      @change="changeList"
    />
    <el-button
      v-permission="['product_report_value','add']"
      type="primary"
      :loading="loadingBtn"
      @click="addFun"
    >提交</el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        prop="report_equip_no"
        label="设备编号"
        min-width="20"
      />
      <el-table-column
        prop="data_point_name"
        label="数据点"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="上报时间"
        min-width="20"
      />
      <el-table-column
        prop="value"
        label="检测值"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="提交时间"
        min-width="20"
      />
      <el-table-column
        label="工厂日期"
        width="160"
      >
        <template slot="header" slot-scope="scope">
          工厂日期
          <el-popover
            v-model="visible"
            placement="right"
            trigger="click"
          >
            <el-date-picker
              v-model="factory_date_all"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :clearable="false"
              @change="changeFactoryDate($event,scope)"
            />
            <i
              slot="reference"
              class="el-icon-edit slotIconStyle"
            />
          </el-popover>
        </template>
        <template slot-scope="{row,$index}">
          <div class="tableDateStyle">
            <el-date-picker
              v-model="row.production_factory_date"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              value-format="yyyy-MM-dd"
              @change="changeProduct($index)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="生产机台"
        width="120"
      >
        <template slot-scope="{row,$index}">
          <el-select
            v-model="row.equip_no"
            placeholder="请选择"
            @change="changeProduct($index)"
          >
            <el-option
              v-for="item in machineList"
              :key="item.equip_no"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="班次"
        width="120"
      >
        <template slot-scope="{row,$index}">
          <el-select
            v-model="row.production_class"
            placeholder="请选择"
            @change="changeProduct($index)"
          >
            <el-option
              v-for="item in classOptions"
              :key="item.global_name"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="胶料"
        width="180"
      >
        <template slot-scope="{row,$index}">
          <all-product-no-select
            :params-obj="{
              factory_date:row.production_factory_date,
              equip_no:row.equip_no,
              classes:row.production_class
            }"
            :default-val="row.product_no"
            @productBatchingChanged="productBatchingChanged($event,row,$index)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="车次"
        width="120"
      >
        <template slot-scope="{row}">
          <el-input
            v-model="row.actual_trains"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import { equipUrl } from '@/api/base_w'
import { class_arrange_url } from '@/api/display_static_fun'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import { productReportValue } from '@/api/base_w_four'
export default {
  name: 'RubberMenniReport',
  components: { allProductNoSelect },
  data() {
    return {
      tableData: [],
      created_date: setDate(),
      spanArr: [],
      pos: '',
      loading: false,
      visible: false,
      factory_date_all: '',
      machineList: [],
      classOptions: [],
      loadingBtn: false
    }
  },
  created() {
    this.getList()
    this.getClassOptions()
    this.getMachineList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await productReportValue('get', null, { params: this.search })
        this.tableData = data
        this.loading = false
        if (this.tableData.length === 0) return
        this.spanArr = []
        this.pos = null
        for (var i = 0; i < this.tableData.length; i++) {
          this.$set(this.tableData[i], 'production_factory_date', '')
          if (i === 0) {
            this.spanArr.push(1)
            this.pos = 0
          } else {
            if (this.tableData[i].id === this.tableData[i - 1].id) {
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
            } else {
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
      } catch (e) { this.loading = false }
    },
    async getClassOptions() {
      try {
        const data = await class_arrange_url('get')
        this.classOptions = data.results
      } catch (e) {
        //
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0, 1, 2].includes(columnIndex) && this.spanArr) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    getMachineList() {
      var _this = this
      equipUrl('get', { params: { all: 1, category_name: '密炼设备' }})
        .then(function(response) {
          _this.machineList = response.results || []
        })
        .catch(function() { })
    },
    changeFactoryDate(val) {
      if (val) {
        this.tableData.forEach(d => {
          d.production_factory_date = val
          d.product_no = ''
        })
      }
    },
    productBatchingChanged(val, row, index) {
      this.$set(this.tableData[index], 'product_no', val ? val.material_no : '')
    },
    changeProduct(index) {
      this.$set(this.tableData[index], 'product_no', '')
    },
    changeList() {
      if (!this.report_date) {
        this.$message('请选择上报日期')
        return
      }
      this.getList()
    },
    async addFun() {
      // try {
      // this.tableData.forEach(d => {
      //   if (!d.production_factory_date || !d.equip_no || !d.production_class || !d.product_no || !d.actual_trains) {
      //     throw new Error('每行：工厂日期、生产机台、班次、胶料、车次必填')
      //   }
      // })
      // } catch (error) {
      // this.$message(error.message)
      // return
      // }
      let arr = []
      arr = this.tableData.filter(d => d.production_factory_date &&
        d.equip_no && d.production_class && d.product_no && d.actual_trains)
      if (arr.length === 0) {
        this.$message('暂无可提交数据；工厂日期、生产机台、班次、胶料、车次必填')
        return
      }
      try {
        this.loadingBtn = true
        await productReportValue('post', null, {
          data: arr
        })
        this.$message.success('提交成功')
        this.getList()
        this.loadingBtn = false
      } catch (e) { this.loadingBtn = false }
    }
  }
}
</script>

<style lang="scss" >
.material-menni-report{
  .tableDateStyle{
      .el-input, .el-input__inner{
          width: 150px;
      }
  }
    .slotIconStyle{
        font-size:24px;
    }
}

</style>
