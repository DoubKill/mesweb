<template>
  <div style="margin-top: 25px">
    <el-form :inline="true">

      <el-form-item label="工程名">
        <el-input
          v-model="projectName"
          placeholder="密炼"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="performanceDate"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="performanceDateChange"
        />
      </el-form-item>
      <el-form-item label="机台">
        <el-select
          v-model="equipNo"
          clearable
          placeholder="请选择"
          @change="equipNoChange"
          @visible-change="equipNoVisibleChange"
        >
          <el-option
            v-for="item in equipNoOptions"
            :key="item.equip_no"
            :label="item.equip_no"
            :value="item.equip_no"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item style="float: right">
        <el-form-item>
          <el-button>
            下载全部
          </el-button>
        </el-form-item>
      </el-form-item> -->
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        label="处理"
        width="40"
      />
      <el-table-column
        prop="equip_no"
        label="机型"
      />
      <el-table-column
        prop="product_no"
        width="180px"
        label="胶料代码"
      >
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
            v-text="scope.row.product_no"
          />
          <el-button
            icon="el-icon-search"
            type="text"
            size="small"
            style="float: right; width: 30%"
            @click="clickProductNo(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="plan_weight"
        label="标准重量"
      />
      <el-table-column
        prop="plan_trains"
        label="日计划"
      />
      <el-table-column
        prop="actual_trains"
        label="日结果"
      />
      <el-table-column
        align="center"
        prop="mr_material_requisition_classes"
        label="早班"
      >
        <el-table-column
          prop="classes_data[0].plan_trains"
          label="计划"
        />
        <el-table-column
          prop="classes_data[0].actual_trains"
          label="结果"
        />
      </el-table-column>
      <el-table-column
        align="center"
        prop="mr_material_requisition_classes"
        label="中班"
      >
        <el-table-column
          prop="classes_data[1].plan_trains"
          label="计划"
        />
        <el-table-column
          prop="classes_data[1].actual_trains"
          label="结果"
        />
      </el-table-column>
      <el-table-column
        align="center"
        prop="mr_material_requisition_classes"
        label="晚班"
      >
        <el-table-column
          prop="classes_data[2].plan_trains"
          label="计划"
        />
        <el-table-column
          prop="classes_data[2].actual_trains"
          label="结果"
        />
      </el-table-column>
      <el-table-column
        prop="download"
        label="操作"
      >
        <!-- <template slot-scope="scope">
          <el-button type="text" size="small" @click="downloadClick(scope.row)">下载</el-button>
        </template> -->
      </el-table-column>
      <!-- <el-table-column label="发送到上辅机">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="sendToAu(scope.row)"
          >发送
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-dialog
      title="胶料产出反馈"
      :visible.sync="dialogVisibleRubber"
      width="900px"
    >
      <el-form :inline="true">
        <el-form-item label="胶料区分: ">
          {{ palletFeedObj.hasOwnProperty("stage")?palletFeedObj.stage:'--' }}
        </el-form-item>
        <el-form-item label="胶料编码: ">
          {{ palletFeedObj.product_no }}
        </el-form-item>
        <el-form-item label="班次: ">
          {{ palletFeedObj.classes }}
        </el-form-item>
        <el-form-item label="机台: ">
          {{ palletFeedObj.equip_no }}
        </el-form-item>

      </el-form>
      <el-table
        :data="palletFeedList"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="lot_no"
          label="LOT"
        >
          <template slot-scope="scope">
            {{ scope.row.LOT||'--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="product_no"
          label="胶料编码"
          width="140px"
        />
        <el-table-column
          prop="equip_no"
          label="机台"
        />

        <el-table-column label="BAT">
          <template slot-scope="scope">
            <div
              style="color:#1989fa;cursor:pointer"
              @click="clickBAT(scope.row)"
            >
              {{ scope.row.begin_trains }}--{{ scope.row.end_trains }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="actual_weight"
          label="生产重量"
        />
        <el-table-column label="生产时间">
          <template slot-scope="scope">
            {{ scope.row.end_time.split(' ')[1] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="classes"
          label="班次"
        />
        <el-table-column
          prop="operation_user"
          label="作业者"
        />
      </el-table>
      <page
        :total="totalRubber"
        :current-page="pageRubber"
        @currentChange="currentChangeRubber"
      />
    </el-dialog>
    <el-dialog
      title="BAT查询"
      :visible.sync="dialogVisibleBAT"
      width="900px"
    >
      <div style="position: relative">
        <el-form
          :inline="true"
          style="margin-right: 100px;"
        >
          <el-form-item label="胶料区分: ">
            {{ BATObj.stage }}
          </el-form-item>
          <el-form-item label="胶料编码: ">
            {{ BATObj.product_no }}
          </el-form-item>
          <el-form-item label="班次: ">
            {{ BATObj.classes }}
          </el-form-item>
          <el-form-item label="机台: ">
            {{ BATObj.equip_no }}
          </el-form-item>
          <el-form-item label="车次: ">
            {{ BATObj.begin_trains }} -- {{ BATObj.end_trains }}
          </el-form-item>

        </el-form>
        <!-- <el-button style="position: absolute;right:10px;top:0" @click="viewGraph">
          图形
        </el-button> -->
      </div>
      <el-table
        :data="BATList"
        style="width: 100%"
      >
        <el-table-column
          prop="equip_no"
          label="机台"
        />
        <el-table-column
          prop="name"
          label="日期"
          width="110"
        >
          <template slot-scope="scope">
            {{ scope.row.end_time.split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="classes"
          label="班次"
        />
        <el-table-column
          prop="product_no"
          label="胶料编码"
        />
        <el-table-column
          prop="actual_trains"
          label="车次"
        />
        <el-table-column
          prop="actual_weight"
          label="胶"
        />
        <el-table-column
          prop="end_time-begin-time"
          label="时间"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.begin_time }} -- {{ scope.row.end_time }}
          </template>
        </el-table-column>
        <el-table-column
          prop="equip_status.temperature"
          label="温度"
        />
        <el-table-column
          prop="equip_status.energy"
          label="电量"
        />
        <el-table-column
          prop="equip_status.rpm"
          label="RPM"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="clickView(scope.row,scope.$index)"
            >查看图表</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="分析图表"
      :modal="true"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="900px"
      :visible.sync="dialogVisibleGraph"
    >
      <!-- <div style="margin: 0 0 20px 5px;">2020-12-12</div>
      <div ref="main" style="width: 100%;height:400px;" /> -->
      <ve-line
        height="500px"
        :data="chartData"
        :settings="chartSettings"
        :after-set-option="afterSetOption"
      />
    </el-dialog>
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { getEquip, getPalletFeedBacks, getTrainsFeedbacks, getEchartsList, getProductActual, getPalletFeedbacks, postProductDayPlanNotice } from '@/api/banburying-performance-manage'
import page from '@/components/page'
import { setDate } from '@/utils'
export default {
  components: { page },
  data: function() {
    this.chartSettings = {
      labelMap: {
        created_date_date: '时间',
        power: '功率',
        temperature: '温度',
        energy: '能量',
        pressure: '压力',
        rpm: '转速'
      },
      axisSite: {
        right: ['temperature', 'rpm', 'energy', 'pressure']
      }
      // yAxisName: ['功率']
    }
    return {
      tableData: [],
      performanceDate: '',
      projectName: '',
      equipNo: '',
      equipNoOptions: [],
      dialogAddMaterialBaseInfoVisible: false,
      palletFeedObj: {},
      palletFeedList: [],
      BATObj: {},
      BATList: [],
      dialogVisibleRubber: false,
      tableDataRubber: [],
      tableDataBAT: [],
      dialogVisibleBAT: false,
      dialogVisibleGraph: false,
      currentPage: 1,
      total: 0,
      totalRubber: 0,
      pageRubber: 1,
      getParams: {
        page: 1
      },
      chartData: {
        columns: [
          'created_date_date',
          'power',
          'temperature',
          'energy',
          'pressure',
          'rpm'
        ],
        rows: []
      },
      options: {
        title: {
          show: true,
          text: '主标题',
          textAlign: 'left'
        },
        yAxis: [
          {
            min: 0,
            max: 2500,
            splitNumber: 5,
            interval: (2500 - 0) / 5
          },
          {
            min: 0,
            max: 200,
            splitNumber: 5,
            interval: (200 - 0) / 5
          }
        ],
        toolbox: {
          itemSize: 20,
          itemGap: 30,
          right: 50,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            saveAsImage: {
              name: '',
              pixelRatio: 2
            }
          }
        }
      }
    }
  },
  created() {
    this.currentChange(1)
  },
  methods: {
    downloadClick(rew) {
    },
    performanceDateChange() {
      this.currentChange(1)
    },
    equipNoVisibleChange(bool) {
      if (bool) {
        var app = this
        getEquip({ all: 1 }).then(function(response) {
          app.equipNoOptions = response.results
        })
      }
    },
    equipNoChange() {
      this.currentChange(1)
    },
    clickProductNo(row) {
      this.dialogVisibleRubber = true
      this.palletFeedObj = row
      this.getRubberCoding(1)
    },
    getRubberCoding(page) {
      var _this = this
      let performanceDate = this.performanceDate
      if (!performanceDate) {
        performanceDate = setDate()
      }
      getPalletFeedBacks({
        page: _this.pageRubber,
        product_no: _this.palletFeedObj.product_no,
        // product_no: 'L-1MB-J260-01',
        // plan_classes_uid: _this.palletFeedObj.plan_classes_uid,
        equip_no: _this.palletFeedObj.equip_no,
        day_time: performanceDate
        // equip_no: '115A01'
        // page: page
      }).then(function(response) {
        _this.totalRubber = response.count
        _this.palletFeedList = response.results || []
        // if (_this.tableDataTotal !== response.count) {
        //   _this.tableDataTotal = response.count
        // }
      })
    },
    currentChangeRubber(page) {
      this.pageRubber = page
      this.getRubberCoding()
    },
    clickBAT(row) {
      this.dialogVisibleBAT = true
      this.BATObj = row
      this.getBATList()
    },
    getBATList() {
      var _this = this
      getTrainsFeedbacks({
        plan_classes_uid: _this.BATObj.plan_classes_uid,
        equip_no: _this.BATObj.equip_no,
        actual_trains: _this.BATObj.begin_trains + ',' + _this.BATObj.end_trains
      }).then(function(response) {
        _this.BATList = response.results || []
      })
    },
    clickView(row) {
      this.dialogVisibleGraph = true
      this.getEchartsList(row)
    },
    // viewGraph() {
    //   this.dialogVisibleGraph = true
    //   this.getEchartsList()
    // },
    getEchartsList(row) {
      var _this = this
      getEchartsList({
        product_no: row.product_no,
        plan_classes_uid: row.plan_classes_uid,
        equip_no: row.equip_no,
        current_trains: row.actual_trains
      })
        .then(function(response) {
          var results = response.results
          results.forEach((element) => {
            element.created_date_date = element.product_time.split(' ')[1] ? element.product_time.split(' ')[1] : element.product_time
          })
          _this.chartData.rows = results
          _this.options.title.text = _this.chartData.rows.length > 0 &&
            // eslint-disable-next-line no-prototype-builtins
            _this.chartData.rows[0].hasOwnProperty('product_time')
            ? _this.chartData.rows[0].product_time.split(' ')[0] : ''
          _this.options.toolbox.feature.saveAsImage.name = '工艺曲线_' + (row.equip_no || '') + '-' + (row.product_no || '') + '-' + (row.begin_time || '')
        })
        // eslint-disable-next-line handle-callback-err
        .catch(() => { })
    },
    afterSetOption(chartObj) {
      chartObj.setOption(this.options)
    },
    currentChange: function(page) {
      this.beforeGetData()
      this.getParams['page'] = page
      this.tableData = []
      getProductActual(this.getParams).then(response => {
        // this.total = response.count
        this.tableData = response.data
      })
    },
    beforeGetData() {
      this.getParams['search_time'] = this.performanceDate
      this.getParams['equip_no'] = this.equipNo
    },
    detailsClick(row) {
      this.getDetailsParams['product_no'] = row.product_no
      this.getDetailsParams['equip_no'] = row.equip_no
      const app = this
      getPalletFeedbacks(this.getDetailsParams).then(function(response) {
        app.tableDataRubber = response.results
      })
      this.dialogVisibleRubber = true
    },
    opens() {
      this.$nextTick(() => {
        this.pie1()
      })
    },
    pie1() {
      // echarts.init(this.$refs.main).setOption(this.option1)
    },
    sendToAu(row) {
      var app = this
      postProductDayPlanNotice(row.id).then(function(response) {
        app.$message('发送成功')
      }).catch(function() {
        app.$message('发送失败')
      })
    }
    // currentChange(page) {
    //   this.getParams.page = page
    //   this.getPersonnelsList()
    // }
  }
}
</script>

<style lang="scss" scoped>
</style>
