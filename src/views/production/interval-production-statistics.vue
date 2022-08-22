<template>
  <div v-loading="loading">
    <!-- 区间产量统计（车数） -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="search.factory_date"
          :clearable="false"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="时间区间/h">
        <el-select
          v-model="search.hour_step"
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in timeInterval"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班次">
        <el-select
          v-model="search.classes"
          placeholder="请选择"
          multiple
          @change="changeClasses"
        >
          <el-option
            v-for="item in classesList"
            :key="item.global_name"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchFun">查询</el-button>
      </el-form-item>
      <el-button style="float:right" @click="viewChartsFun">显示图表</el-button>
    </el-form>
    <div v-for="(itemDiv,i) in classesListHeard" :key="i">
      <el-table
        :data="list[itemDiv]"
        border
        style="margin-top:20px;"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column
          prop="name"
          :label="'时间区间('+itemDiv+')'"
          width="90px"
        >
          <template slot-scope="{row}">
            {{ row.time_span }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="itemEquips in list.equips"
          :key="itemEquips"
          :label="itemEquips"
        >
          <el-table-column
            prop="name"
            label="总车"
            min-width="30px"
          >
            <template slot-scope="{row}">
              {{ row[itemEquips]?row[itemEquips][0]:'' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="区间车次"
            min-width="30px"
          >
            <template slot-scope="{row}">
              {{ row[itemEquips]?row[itemEquips][1]:'' }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="工厂时间）各机台区间产量柱状图"
      :visible.sync="dialogVisible"
      width="88%"
    >
      <div v-for="item in histogramList" :key="item.name">
        <h3 style="text-align:center">各机台区间产量对比图({{ item.name }})</h3>
        <div v-if="item.chartData.rows.length>0">
          <ve-histogram
            width="100%"
            height="500px"
            :data="item.chartData"
            :settings="chartSettings"
            :extend="extend"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setDate } from '@/utils/index'
// import { class_arrange_url } from '@/api/display_static_fun'
import { intervalOutputStatistics, globalCodesUrl } from '@/api/base_w'
export default {
  name: 'IntervalProductionStatistics',
  data() {
    this.chartSettings = {
      yAxisName: ['生产车']
    }
    this.extend = {
      series: {
        label: { show: true, position: 'top' }
      }
    }
    return {
      search: {
        hour_step: 2,
        factory_date: setDate()
        // factory_date: '2020-09-17'
      },
      timeInterval: [1, 2, 4, 8],
      classesList: [],
      disabled: false,
      list: [],
      dialogVisible: false,
      loading: false,
      classesListHeard: [],
      histogramList: []
    }
  },
  async created() {
    await this.getClasses()
    await this.getList()
  },
  methods: {
    async getList() {
      try {
        if (!this.search.factory_date) {
          this.$message.info('请选择时间')
          return
        }
        if (this.search.classes.length === 0 || !this.search.classes) {
          this.$message.info('请选择班次')
          return
        }
        this.loading = true
        this.classesListHeard = this.search.classes
        const data = await intervalOutputStatistics('get', null, { params: this.search })
        this.list = data
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {},
    async getClasses() {
      try {
        const data = await globalCodesUrl('get', {
          params: { all: 1, class_name: '班次' }
        })
        this.classesList = data.results || []
        if (this.classesList.length > 0) {
          if (this.classesList.length > 1) {
            this.search.classes = [this.classesList[0].global_name, this.classesList[1].global_name]
          } else {
            this.search.classes = [this.classesList[0].global_name]
          }
        }
        this.classesList.push({ global_name: '整日' })
      } catch (e) {
        //
      }
      // globalCodesUrl('get', {
      //   params: { all: 1, class_name: '班次' }
      // }).then(response => {
      //   this.classesList = response.results || []
      //   if (this.classesList.length > 0) {
      //     if (this.classesList.length > 1) {
      //       this.search.classes = [this.classesList[0].global_name, this.classesList[1].global_name]
      //     } else {
      //       this.search.classes = [this.classesList[0].global_name]
      //     }
      //   }
      //   this.classesList.push({ global_name: '整日' })
      // })
    },
    changeClasses(val) {
      const a = val.find(D => D === '整日')
      if (a) {
        if (val.length > 1 && val[val.length - 1] !== '整日') {
          this.search.classes = this.search.classes.filter(item => item !== '整日')
        } else {
          this.search.classes = ['整日']
        }
      }
    },
    searchFun() {
      this.getList()
    },
    viewChartsFun() {
      this.dialogVisible = true

      const list = JSON.parse(JSON.stringify(this.list))
      const chartData = []
      if (!list.equips || list.equips.length === 0) {
        return
      }
      list.equips.unshift('time_span')
      const columns = list.equips

      this.classesListHeard.forEach(D => {
        list[D].forEach(data => {
          this.list.equips.forEach(d => {
            if (data[d]) {
              data[d] = data[d][1]
            } else {
              data[d] = 0
            }
          })
        })
        chartData.push({
          name: D,
          chartData: {
            columns: columns,
            rows: list[D]
          }
        })
      })
      this.histogramList = chartData
    }
  }
}
</script>

<style>

</style>
