<template>
  <div
    v-loading="loading"
    class="report-batch-style"
  >
    <!-- <el-button
      size="mini"
      @click="clickView({},1)"
    >查看图表</el-button> -->
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="search_date"
          type="daterange"
          range-separator="至"
          :clearable="true"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="胶料">
        <all-product-no-select @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
      <el-form-item label="机台">
        <selectEquip
          :equip_no_props.sync="getParams.equip_no"
          @changeSearch="changeSearch"
        />
      </el-form-item>
      <el-form-item label="班次">
        <el-select
          v-model="getParams.classes"
          placeholder="请选择"
          clearable
          @change="changeSearch"
          @visible-change="visibleChange"
        >
          <el-option
            v-for="item in classesList"
            :key="item.id"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loadingTable"
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="No"
        width="40px"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        width="55px"
      />
      <el-table-column
        prop="equip_no"
        label="作业时间"
        width="95px"
      >
        <template slot-scope="scope">{{ scope.row.end_time.split(' ')[0] }}</template>
      </el-table-column>
      <el-table-column
        prop="classes"
        label="班次"
        width="55px"
      />
      <el-table-column
        prop="class_group"
        label="班组"
        width="60px"
      >
        <template slot-scope="scope">{{ scope.row.class_group?scope.row.class_group:'--' }}</template>
      </el-table-column>
      <el-table-column label="生产时间" width="80px">
        <template slot-scope="scope">{{ scope.row.end_time.split(' ')[1] }}</template>
      </el-table-column>
      <el-table-column
        prop="product_no"
        label="胶料编码"
        min-width="40px"
      >
        <template slot-scope="scope">
          <div
            style="color:#1989fa;cursor:pointer"
            @click="clickProductNo(scope.row)"
          >{{ scope.row.product_no }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="equip_no"
        label="BATNO"
        width="90px"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.begin_trains===scope.row.end_trains">
            {{ scope.row.begin_trains }}
          </span>
          <span v-else>
            {{ scope.row.begin_trains }}--{{ scope.row.end_trains }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="actual_weight"
        label="生产重量"
        width="90px"
      />
      <el-table-column
        prop="equip_no"
        label="有效时间"
      >
        <template slot-scope="scope">{{ scope.row.end_time }} -- {{ setEndTime(scope.row.end_time) }}</template>
      </el-table-column>
      <el-table-column
        prop="lot_no"
        label="LOT NO"
        width="200px"
      >
        <template slot-scope="scope">{{ scope.row.lot_no?scope.row.lot_no:'--' }}</template>
      </el-table-column>
      <el-table-column
        prop="operation_user"
        label="作业者"
        width="70px"
      />
    </el-table>

    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="胶料产出反馈"
      :visible.sync="dialogVisibleRubber"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="胶料区分: ">{{ palletFeedObj.hasOwnProperty("stage")?palletFeedObj.stage:'--' }}</el-form-item>
        <el-form-item label="胶料编码: ">{{ palletFeedObj.product_no }}</el-form-item>
        <el-form-item label="班次: ">{{ palletFeedObj.classes }}</el-form-item>
        <el-form-item label="机台: ">{{ palletFeedObj.equip_no }}</el-form-item>
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
          <template slot-scope="scope">{{ scope.row.lot_no||'--' }}</template>
        </el-table-column>
        <el-table-column
          prop="product_no"
          label="胶料编码"
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
            >{{ scope.row.begin_trains }}--{{ scope.row.end_trains }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="actual_weight"
          label="生产重量"
        />
        <el-table-column label="生产时间">
          <template slot-scope="scope">{{ scope.row.end_time.split(' ')[1] }}</template>
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
      width="90%"
    >
      <div style="position: relative">
        <el-form
          :inline="true"
          style="margin-right: 100px;"
        >
          <el-form-item label="胶料区分: ">{{ BATObj.stage }}</el-form-item>
          <el-form-item label="胶料编码: ">{{ BATObj.product_no }}</el-form-item>
          <el-form-item label="班次: ">{{ BATObj.classes }}</el-form-item>
          <el-form-item label="机台: ">{{ BATObj.equip_no }}</el-form-item>
          <el-form-item label="车次: ">{{ BATObj.begin_trains }} -- {{ BATObj.end_trains }}</el-form-item>
        </el-form>
      </div>
      <el-table
        :data="BATList"
        style="width: 100%"
        border
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
          <template slot-scope="scope">{{ scope.row.end_time.split(' ')[0] }}</template>
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
          label="时间"
          width="160"
        >
          <template slot-scope="scope">{{ scope.row.begin_time }} -- {{ scope.row.end_time }}</template>
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
      <ve-line
        height="500px"
        :data="chartData"
        :settings="chartSettings"
        :after-set-option="afterSetOption"
        :extend="extend"
        :colors="colors"
        :toolbox="toolbox"
      />
    </el-dialog>
  </div>
</template>

<script>
import { setDate } from '@/utils/index'
import page from '@/components/page'
import selectEquip from '@/components/select_w/equip'
// import ProductNoSelect from '@/components/ProductNoSelect'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import {
  internalMixerUrl,
  classesListUrl, palletFeedBacksUrl, trainsFeedbacksUrl,
  echartsListUrl
} from '@/api/base_w'
import { mapGetters } from 'vuex'
export default {
  name: 'InternalMixerProduction',
  components: { page, selectEquip, allProductNoSelect },
  data() {
    this.toolbox = {
      feature: {
        dataZoom: {
          show: true
        },
        restore: {}
      }
    }
    this.extend = {
      series: {
        smooth: false
      }
    }
    this.colors = ['#FF40A3', '#B2670A', '#3B3834', '#196D26', '#2E77B4']
    this.chartSettings = {
      labelMap: {
        created_date_date: '时间',
        temperature: '温度',
        power: '功率',
        energy: '能量',
        rpm: '转速',
        pressure: '压力'
      },
      axisSite: {
        right: ['temperature', 'rpm', 'energy', 'pressure']
      }
    }
    return {
      loading: true,
      loadingTable: false,
      tableData: [],
      search_date: [],
      getParams: {
        page: 1,
        equip_no: null,
        product_no: null,
        plan_classes_uid: null,
        st: '',
        et: ''
      },
      normsList: [],
      produceList: [],
      groupList: [],
      dialogVisibleRubber: false,
      tableDataRubber: [],
      tableDataBAT: [],
      dialogVisibleBAT: false,
      glueList: [],
      classesList: [],
      // 24小时，转换为时间戳24*60*60*1000
      fixedTime: 24 * 60 * 60 * 1000,
      palletFeedObj: {},
      palletFeedList: [],
      BATObj: {},
      BATList: [],
      total: 0,
      dialogVisibleGraph: false,
      totalRubber: 0,
      pageRubber: 1,
      chartData: {
        columns: [
          'created_date_date',
          'temperature',
          'power',
          'energy',
          'rpm',
          'pressure'
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
          right: 0,
          feature: {
            saveAsImage: {
              name: '',
              pixelRatio: 2
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.getList()
    // this.getClassesList() // 获取班次列表

    var _setDateCurrent = setDate()
    this.getParams.st = _setDateCurrent + ' 00:00:00'
    this.getParams.et = _setDateCurrent + ' 23:59:59'
    // this.getParams.st = "2020-06-01" + " 00:00:00";
    // this.getParams.et = '2020-06-01' + ' 23:59:59'
    this.search_date = [this.getParams.st, this.getParams.et]
  },
  methods: {
    getList() {
      var _this = this
      internalMixerUrl('get', null, {
        params: _this.getParams
      })
        .then(function(response) {
          _this.tableData = response.results || []

          _this.total = response.count || 0
          _this.loading = false
          _this.loadingTable = false
          // eslint-disable-next-line handle-callback-err
        }).catch((error) => {
          this.loading = false
          this.loadingTable = false
          // this.$message.error("请求错误");
        })
    },
    getClassesList() {
      var _this = this
      // eslint-disable-next-line object-curly-spacing
      classesListUrl('get', null, { params: { class_name: '班次', all: 1 } })
        .then(function(response) {
          _this.classesList = response.results || []
        })
        // eslint-disable-next-line handle-callback-err
        .catch(function(error) { })
    },
    visibleChange(bool) {
      if (bool && this.classesList.length === 0) {
        this.getClassesList()
      }
    },
    clickPrint() {
      //          <el-form-item>
      //     <el-button @click="clickPrint">
      //         下载
      //     </el-button>
      // </el-form-item>
      // <el-form-item>
      //     <el-button @click="clickExcel">
      //         Excel
      //     </el-button>
      // </el-form-item>
    },
    clickExcel() { },
    clickProductNo(row) {
      this.dialogVisibleRubber = true
      this.palletFeedObj = row
      this.pageRubber = 1
      this.getRubberCoding()
    },
    getRubberCoding() {
      var _this = this
      palletFeedBacksUrl('get', null, {
        params: {
          page: _this.pageRubber,
          product_no: _this.palletFeedObj.product_no,
          plan_classes_uid: _this.palletFeedObj.plan_classes_uid,
          equip_no: _this.palletFeedObj.equip_no,
          day_time: _this.palletFeedObj.end_time.split(' ')[0],
          ordering: '-product_time'
        }
      })
        .then(function(response) {
          _this.totalRubber = response.count
          _this.palletFeedList = response.results || []
        })
        // eslint-disable-next-line handle-callback-err
        .catch(function(error) { })
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
      trainsFeedbacksUrl('get', null, {
        params: {
          plan_classes_uid: _this.BATObj.plan_classes_uid,
          equip_no: _this.BATObj.equip_no,
          actual_trains:
            _this.BATObj.begin_trains + ',' + _this.BATObj.end_trains
        }
      })
        .then(function(response) {
          _this.BATList = response.results || []
        })
        // eslint-disable-next-line handle-callback-err
        .catch(function(error) { })
    },
    clickView(row) {
      this.dialogVisibleGraph = true
      this.getEchartsList(row)
    },
    getEchartsList(row) {
      var _this = this
      echartsListUrl('get', null, {
        params: {
          product_no: row.product_no,
          plan_classes_uid: row.plan_classes_uid,
          equip_no: row.equip_no,
          st: row.begin_time,
          et: row.end_time
        }
      })
        .then(function(response) {
          var results = response.results
          // const results = [
          //   {
          //     id: 3,
          //     product_time: '2016-8-6 12:5:1',
          //     temperature: 111,
          //     power: 1000,
          //     rpm: 145,
          //     pressure: 130,
          //     energy: 120

          //   },
          //   {
          //     id: 3,
          //     product_time: '2016-8-6 12:5:2',
          //     temperature: 123,
          //     power: 1112,
          //     rpm: 144,
          //     pressure: 123,
          //     energy: 124
          //   },
          //   {
          //     id: 3,
          //     product_time: '2016-8-6 12:5:3',
          //     temperature: 111,
          //     power: 2112,
          //     rpm: 133,
          //     pressure: 139,
          //     energy: 200
          //   }
          // ]
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
    productBatchingChanged(val) {
      this.getParams.product_no = val ? val.material_no : ''

      this.getParams.page = 1
      this.loadingTable = true
      this.getList()
    },
    changeSearch() {
      this.loadingTable = true
      if (this.search_date) {
        this.getParams.st = this.search_date[0]
        this.getParams.et = this.search_date[1]
      } else {
        delete this.getParams.st
        delete this.getParams.et
      }

      this.getParams.page = 1
      this.getList()
    },
    setEndTime(val) {
      var end_time = new Date(val).getTime()
      var add = end_time + this.fixedTime
      return setDate(add, true)
    },
    opens() {
      this.$nextTick(() => {
        // echarts.init(this.$refs.main).setOption(this.option1);
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getList()
    }
  }
}
// function setRangeSome(_this, results) {
// 设置左右量程相同的刻度值
// const powerArr = []
// const otherArr = []
// results.forEach(D => {
//   powerArr.push(D.power)
//   otherArr.push(D.pressure)
//   otherArr.push(D.temperature)
//   otherArr.push(D.energy)
//   otherArr.push(D.rpm)
// })
// const powerArrMax = Math.ceil(Math.max(...powerArr) / 1000) * 1000
// const otherArrMax = Math.ceil(Math.max(...otherArr) / 100) * 100

//   _this.options.yAxis[0].max = 2500
//   _this.options.yAxis[0].interval = (2500 - 0) / 5
//   _this.options.yAxis[1].max = 200
//   _this.options.yAxis[1].interval = (200 - 0) / 5
// }
</script>

<style scoped>
/* .report-batch-style {
} */
</style>
