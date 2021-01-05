<template>
  <div>
    <!-- 没用到 -->
    <el-button
      @click="centerDialogVisible = true"
    >全屏</el-button>
    <div v-loading="loading">
      <el-input v-model="input" style="width:300px;margin-bottom:20px" placeholder="请输入内容" />
      <br>
      <div style="display:flex">
        <div>
          <el-table
            :data="tableData"
            style="height: min-content;"
            border
          >
            <el-table-column
              updated
              upstream
              align="center"
              type="index"
              label="No"
              width="50"
            />
            <el-table-column label="工号">
              <template slot-scope="scope">
                {{ scope.row.num?scope.row.num:'--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="username"
              label="用户名"
            />
            <el-table-column
              prop="use_flag"
              label="使用"
              width="80"
            />
            <el-table-column label="创建人">
              <template slot-scope="scope">
                {{ scope.row.created_username?scope.row.created_username:'--' }}
              </template>
            </el-table-column>
            <el-table-column label="创建日期">
              <template slot-scope="scope">
                {{ scope.row.created_date?scope.row.created_date:'--' }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <ve-line
          style="width:50%;"
          :data="chartData"
          :not-set-unchange="notSetUnchange"
        />
      </div>
      <div style="display:flex">
        <ve-histogram
          style="width:50%;"
          :data="chartData1"
          :not-set-unchange="notSetUnchange"
        />
        <ve-pie
          style="width:50%;"
          :not-set-unchange="notSetUnchange"
          :data="chartData2"
          :extend="extend"
        />
      </div>
    </div>

    <el-dialog
      title="看板"
      :visible.sync="centerDialogVisible"
      width="100%"
      fullscreen
      center
    >
      <div v-loading="loading">
        <el-input v-model="input" style="width:300px;margin-bottom:20px" placeholder="请输入内容" />
        <br>
        <div style="display:flex">
          <div>
            <el-table
              :data="tableData"
              style="height: min-content;"
              border
            >
              <el-table-column
                updated
                upstream
                align="center"
                type="index"
                label="No"
                width="50"
              />
              <el-table-column label="工号">
                <template slot-scope="scope">
                  {{ scope.row.num?scope.row.num:'--' }}
                </template>
              </el-table-column>
              <el-table-column
                prop="username"
                label="用户名"
              />
              <el-table-column
                prop="use_flag"
                label="使用"
                width="80"
              />
              <el-table-column label="创建人">
                <template slot-scope="scope">
                  {{ scope.row.created_username?scope.row.created_username:'--' }}
                </template>
              </el-table-column>
              <el-table-column label="创建日期">
                <template slot-scope="scope">
                  {{ scope.row.created_date?scope.row.created_date:'--' }}
                </template>
              </el-table-column>
            </el-table>
          </div>

          <ve-line
            style="width:50%;"
            :data="chartData"
            :not-set-unchange="notSetUnchange"
          />
        </div>
        <div style="display:flex">
          <ve-histogram
            style="width:50%;"
            :data="chartData1"
            :not-set-unchange="notSetUnchange"
          />
          <ve-pie
            style="width:50%;"
            :not-set-unchange="notSetUnchange"
            :data="chartData2"
            :extend="extend"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { classesListUrl } from '@/api/base_w'
import { personnelsUrl } from '@/api/user'
import { order1, order2 } from '@/api/base_w_two'

export default {
  components: { },
  data() {
    // :settings="chartSettings"
    // this.chartSettings = {
    //   hoverAnimation: true
    // }
    this.extend = {
      series: {
        animation: false
      }
    }
    return {
      notSetUnchange: ['dataZoom'],
      input: '默认数据',
      getParamsPage: 1,
      loading: true,
      tableData: [],
      chartData: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: []
      },
      chartData1: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: []
      },
      chartData2: {
        columns: ['global_name', 'global_no'],
        rows: []
      }
    }
  },
  created() {
    timeInterFun(this)
  },
  destroyed() {
    window.clearInterval(this.timeInter)
  },
  methods: {
    async getList() {
      try {
        const arr = await Promise.all([
          classesListUrl('get', null, { params: { id: 2 }}),
          personnelsUrl('get', null, {}),
          order1('get'),
          order2('get')
        ])
        const num = Math.floor(Math.random() * (100 - 0 + 1) + 0)
        this.chartData2.rows = arr[0].results
        this.tableData = arr[1].results
        this.chartData1.rows = arr[2].results
        this.chartData.rows = arr[3].results
        arr[1].results.forEach(D => {
          D.username += (num + D.id)
        })
        this.chartData2.rows.forEach(D => {
          D.global_no += (num - D.id + 10)
        })
        // console.log(arr, 'arr')
      } catch (e) {
        //
      }
      this.loading = false
    },
    changePage() {

    }
  }
}
function timeInterFun(_this) {
  _this.timeInter = setInterval(() => {
    _this.getList()
    console.log(1)
  }, 1000)
}
</script>

<style>

</style>
