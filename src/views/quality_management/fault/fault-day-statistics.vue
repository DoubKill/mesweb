<template>
  <div class="fault-day-statistics">
    <el-date-picker
      v-model="searchDate"
      type="date"
      placeholder="选择日期"
      value-format="yyyy-MM-dd"
      style="margin-bottom:20px"
      :clearable="false"
      @change="datePicker"
    />
    <!-- 设备别故障日统计 -->
    <div style="display:flex">
      <div style="width:65%">
        <el-table
          :data="tableData"
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column
            prop="date"
            label="设备名称"
            min-width="20"
          />
          <el-table-column v-for="(item,index) in classList" :key="index" :label="item.global_name">
            <el-table-column
              prop="name"
              label="故障时间"
              min-width="20"
            />
            <el-table-column
              prop="province"
              label="故障率"
              min-width="20"
            />
          </el-table-column>
          <el-table-column
            :label="searchDate"
            min-width="20"
          >
            <el-table-column
              prop="name"
              label="故障时间"
              min-width="20"
            />
            <el-table-column
              prop="address"
              label="故障率"
              min-width="20"
            />
          </el-table-column>
        </el-table>
      </div>
      <div style="width:30%;text-align:center">
        <h3 style="margin-top: 0;">炼胶工程设备故障占比</h3>
        <ve-pie
          style="width:100%;"
          :data="chartData2"
          :extend="extend"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import { globalCodesUrl } from '@/api/base_w'
export default {
  data() {
    this.extend = {
      series: {
        animation: false
      }
    }
    return {
      searchDate: setDate(),
      classList: [],
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '0.8',
        zip: 200333
      }, {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '0.8',
        zip: 200333
      }],
      chartData2: {
        columns: ['global_name', 'global_no'],
        rows: [
          { global_name: 1, global_no: 2 },
          { global_name: 2, global_no: 2 },
          { global_name: 3, global_no: 2 },
          { global_name: 4, global_no: 0 },
          { global_name: 5, global_no: 0 },
          { global_name: 6, global_no: 0 },
          { global_name: 7, global_no: 2 }
        ]
      }
    }
  },
  created() {
    this.getClass()
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        // const data = await matTestMethods('get', null, { params: this.search })
        // this.tableData = data.results
        // this.total = data.count
        // this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    getClass() {
      globalCodesUrl('get', {
        params: {
          class_name: '班次'
        }
      }).then((response) => {
        this.classList = response.results
        this.getList()

      // eslint-disable-next-line handle-callback-err
      }).catch((error) => {
      })
    },
    datePicker(val) {
      if (!val) {
        this.$message.info('请选择日期')
        return
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        //   sums[index] += ' 元'
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  }
}
</script>

<style>
/* .fault-day-statistics{
} */
</style>
