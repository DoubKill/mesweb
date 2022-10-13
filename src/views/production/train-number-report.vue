<template>
  <div
    v-loading="loading"
    class="report-train-style"
  >
    <!-- 车次报表 -->
    <el-form v-if="!isComponents" :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="search_date"
          type="daterange"
          range-separator="至"
          :clearable="true"
          value-format="yyyy-MM-dd"
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
          :is-created="true"
          :is-clear="true"
          :equip_no_props.sync="getParams.equip_no"
          @changeSearch="changeSearch"
        />
      </el-form-item>
      <el-form-item label="操作人">
        <el-select
          v-model="getParams.operation_user"
          clearable
          placeholder="请选择"
          @change="changeSearch"
          @visible-change="visibleChange"
        >
          <el-option
            v-for="item in operatorList"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班次">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['trains_report', 'export']" type="primary" :disabled="btnExportLoad" @click="exportTableEnergy">导出吨能耗及吨耗时</el-button>
        <el-button v-permission="['trains_report', 'export']" type="primary" :disabled="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <!-- <el-button @click="showRowTable = true">展示详情</el-button> -->

        <!-- <el-button @click="selectRubber">导出批记录</el-button>
        <el-button @click="selectRubber">单页导出</el-button>
        <el-button @click="selectRubber">所有导出</el-button>
        <el-button @click="selectRubber">所有合并</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loadingTable"
      border
      :data="tableData"
      style="width: 100%"
      :height="maxHeightTable"
      :default-sort="{prop: 'begin_time', order: 'ascending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="index"
        label="No"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        width="50px"
      />
      <el-table-column
        prop="factory_date"
        label="工厂日期"
        width="100"
      />
      <el-table-column
        prop="product_no"
        label="配方编号"
        width="130"
      />
      <el-table-column
        prop="classes"
        label="班次"
        width="50px"
      />
      <el-table-column
        prop="plan_classes_uid"
        label="计划编号"
        width="170"
      />
      <el-table-column
        prop="begin_time"
        width="150"
        sortable
        label="开始时间"
      />
      <el-table-column
        prop="end_time"
        label="结束时间"
        sortable
        width="150"
      />
      <el-table-column
        prop="plan_trains"
        label="设定车次"
      />
      <el-table-column
        prop="actual_trains"
        label="实际车次"
      />
      <el-table-column
        :prop="editionNo === 'v1'?'production_details.控制方式':'control_mode'"
        label="本/远控"
      />
      <el-table-column
        :prop="editionNo === 'v1'?'production_details.作业方式':'operating_type'"
        label="手/自动"
      />
      <el-table-column
        prop="ai_value"
        label="AI值"
      />
      <el-table-column
        :prop="editionNo === 'v1'?'production_details.总重量':'actual_weight'"
        label="总重量(kg)"
      />
      <el-table-column
        :prop="editionNo === 'v1'?'production_details.排胶时间':'evacuation_time'"
        label="排胶时间(s)"
      />
      <el-table-column
        :prop="editionNo === 'v1'?'production_details.排胶温度':'evacuation_temperature'"
        label="排胶温度(°c)"
      />
      <el-table-column
        :prop="editionNo === 'v1'?'production_details.排胶能量':'evacuation_energy'"
        label="排胶能量(kW·h)"
      />
      <el-table-column
        :prop="editionNo === 'v1'?'production_details.员工代号':'operation_user'"
        label="操作人"
      />
      <el-table-column
        :prop="editionNo === 'v1'?'production_details.存盘时间':'product_time'"
        label="存盘时间(s)"
        width="150"
      />
      <el-table-column
        :prop="editionNo === 'v1'?'production_details.密炼时间':'mixer_time'"
        label="密炼时间(s)"
        width="100"
      />
      <el-table-column
        :prop="editionNo === 'v1'?'production_details.间隔时间':'interval_time'"
        label="间隔时间(s)"
      />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="clickView(scope.row,scope.row.id,scope.$index)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <div
      v-if="showRowTable"
      style="overflow-x:scroll;margin-top:20px"
    >
      <el-row
        v-loading="loaddingExal"
        style="width:1600px"
      >
        <el-col
          :span="12"
          class="trainContentLeft"
        >
          <div
            style="margin-right:10px"
            class="trainContentLeftBox"
          >
            <el-row class="row-border-bottom">
              <el-col :span="2">
                <div class="grid-content bg-purple">页</div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple">{{ currentIndex + 1 }}</div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">报表</div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content bg-purple-light">打印时间</div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content bg-purple-light bd-right-none">{{ currentTime }}</div>
              </el-col>
            </el-row>
            <div class="train-title">基础信息</div>
            <table
              class="train-one"
              width="100%"
              cellspacing="0"
              border="1"
              cellpadding="1"
              style="border-collapse:collapse"
              frame="hsides"
            >
              <tr class="train-one-tr-banburying">
                <td>计划编号</td>
                <td>{{ rowInfo.plan_classes_uid ||'--' }}</td>
                <td>设定车次</td>
                <td>{{ rowInfo.plan_trains ||'--' }}</td>
                <td class="begin_time_width">开始</td>
                <td>{{ rowInfo.begin_time ||'--' }}</td>
                <td>本/遥控</td>
                <td>{{ (editionNo === 'v1'?rowInfo.production_details.控制方式:rowInfo.control_mode) ||'--' }}</td>
              </tr>
              <tr class="train-one-tr-banburying">
                <td>名称</td>
                <td>{{ rowInfo.product_no ||'--' }}</td>
                <td>完成</td>
                <td>{{ rowInfo.actual_trains ||'--' }}</td>
                <td class="begin_time_width">结束</td>
                <td>{{ rowInfo.end_time ||'--' }}</td>
                <td>状态</td>
                <td>{{ rowInfo.status ||'--' }}</td>
              </tr>
              <tr
                v-if="editionNo === 'v1'"
                class="train-one-tr-banburying"
              >
                <td>排胶温度(°c)</td>
                <td>{{ rowInfo.production_details.排胶温度 ||'--' }}</td>
                <td>排胶能量(kW·h)</td>
                <td>{{ rowInfo.production_details.排胶能量 ||'--' }}</td>
                <td class="begin_time_width">时间(s)</td>
                <td>{{ rowInfo.production_details.排胶时间 ||'--' }}</td>
                <td>总重(kg)</td>
                <td>{{ rowInfo.production_details.总重量 ||'--' }}</td>
              </tr>
              <tr
                v-if="editionNo === 'v2'"
                class="train-one-tr-banburying"
              >
                <td>排胶温度(°c)</td>
                <td>{{ rowInfo.evacuation_temperature ||'--' }}</td>
                <td>排胶能量(kW·h)</td>
                <td>{{ rowInfo.evacuation_energy ||'--' }}</td>
                <td class="begin_time_width">时间(s)</td>
                <td>{{ rowInfo.evacuation_time ||'--' }}</td>
                <td>总重(kg)</td>
                <td>{{ rowInfo.actual_weight ||'--' }}</td>
              </tr>
            </table>

            <div class="train-title">称量信息</div>

            <div class="weighInforStyle">
              <table
                class="train-one"
                width="100%"
                cellspacing="0"
                border="1"
                cellpadding="1"
                style="border-collapse:collapse"
                frame="hsides"
              >
                <tr class="train-one-tr-banburying">
                  <td>No</td>
                  <td>名称</td>
                  <td>设定值(kg)</td>
                  <td>实重(kg)</td>
                  <td>状态</td>
                  <td>种类</td>
                  <td>超差(kg)</td>
                </tr>

                <tr
                  v-for="(item,index) in weighInformationList"
                  :key="index"
                  class="train-one-tr-banburying"
                >
                  <td>{{ index+1 }}</td>
                  <template v-if="editionNo === 'v2'">
                    <td>{{ item.material_name }}</td>
                    <td>
                      {{ Math.round(item.plan_weight/100*100)/100 }}
                    </td>
                    <td>
                      {{ Math.round(item.actual_weight/100*100)/100 }}
                    </td>
                    <td>{{ item.state_balance }}</td>
                    <td>{{ item.material_type }}</td>
                    <td>{{ Math.round((Number(item.plan_weight) - Number(item.actual_weight))/100*100)/100 }}</td>
                  </template>
                  <template v-if="editionNo === 'v1'">
                    <td>{{ item.物料名称 }}</td>
                    <td>
                      {{ Math.round(item.设定重量/100*100)/100 }}
                    </td>
                    <td>
                      {{ Math.round(item.实际重量/100*100)/100 }}
                    </td>
                    <td>{{ item.秤状态 }}</td>
                    <td>{{ item.物料类型 }}</td>
                    <td>{{ Math.round((Number(item.设定重量) - Number(item.实际重量))/100*100)/100 }}</td>
                  </template>
                </tr>
              </table>
            </div>
            <div
              v-if="weighInformationList.length===0"
              class="noneData"
            >暂无数据</div>
            <page
              style="text-align: right;"
              :total="totalWeighing"
              @currentChange="ChangePageWeighing"
            />

            <div class="train-title train-title-border">密炼信息</div>
            <div class="mixerInforStyle">
              <table
                class="train-one"
                width="100%"
                cellspacing="0"
                border="1"
                cellpadding="1"
                style="border-collapse:collapse"
                frame="hsides"
              >
                <tr class="train-one-tr-banburying">
                  <td>No</td>
                  <td>条件名称</td>
                  <td>时间(s)</td>
                  <td>温度(°c)</td>
                  <td>AI值</td>
                  <td>能量(J)</td>
                  <td>动作名称</td>
                  <td>速度(r/min)</td>
                  <td>压力(bar)</td>
                </tr>
                <template v-if="editionNo === 'v1'">
                  <tr
                    v-for="(item,index) in mixerInformationList"
                    :key="index"
                    class="train-one-tr-banburying"
                  >
                    <td>{{ index+1 }}</td>
                    <td>{{ item.条件 }}</td>
                    <td>{{ item.时间 }}</td>
                    <td>{{ item.温度 }}</td>
                    <td>{{ item.功率 }}</td>
                    <td>{{ item.能量 }}</td>
                    <td>{{ item.动作 }}</td>
                    <td>{{ item.转速 }}</td>
                    <td>{{ item.压力 }}</td>
                  </tr>
                </template>
                <template v-if="editionNo === 'v2'">
                  <tr
                    v-for="(item,index) in mixerInformationList"
                    :key="index"
                    class="train-one-tr-banburying"
                  >
                    <td>{{ index+1 }}</td>
                    <td>{{ item.condition }}</td>
                    <td>{{ item.time }}</td>
                    <td>{{ item.temperature }}</td>
                    <td>{{ item.power }}</td>
                    <td>{{ item.energy }}</td>
                    <td>{{ item.action }}</td>
                    <td>{{ item.rpm }}</td>
                    <td>{{ item.pressure }}</td>
                  </tr>
                </template>
              </table>
            </div>
            <div
              v-if="mixerInformationList.length===0"
              class="noneData"
            >暂无数据</div>
            <page
              style="text-align: right;"
              :total="totalMixer"
              @currentChange="ChangePageMixer"
            />

            <div class="train-title train-title-border">报警记录</div>
            <table
              class="train-one"
              width="100%"
              cellspacing="0"
              border="1"
              cellpadding="1"
              style="border-collapse:collapse"
              frame="hsides"
            >
              <tr class="train-one-tr-banburying">
                <td>No</td>
                <td>时间</td>
                <td>报警信息</td>
              </tr>
              <tr
                v-for="(item,index) in alarmRecordList"
                :key="index"
                class="train-one-tr-banburying"
              >
                <td>{{ index+1 }}</td>
                <td>{{ item.product_time }}</td>
                <td>{{ item.content }}</td>
              </tr>
            </table>
            <div
              v-if="alarmRecordList.length===0"
              class="noneData"
            >暂无数据</div>
            <page
              style="text-align: right;"
              :total="totalAlarmRecord"
              @currentChange="ChangePageAlarmRecord"
            />
          </div>
        </el-col>
        <el-col
          :span="12"
          class="trainContentRight"
        >
          <div style="display:flex">
            <div
              v-if="editionNo === 'v1'"
              class="police-record"
            >
              <span>排胶能量(kW·h): {{ rowInfo.production_details.排胶能量 ||'--' }}</span>
              <span>设定: {{ rowInfo.plan_trains ||'--' }}</span>
              <span>时间(s): {{ rowInfo.begin_time || '--' }} 至 {{ rowInfo.end_time|| '--' }}</span>
              <br>
              <span>排胶温度(°c): {{ rowInfo.production_details.排胶温度||'--' }}</span>
              <span>完成: {{ rowInfo.actual_trains || '--' }}</span>
              <span>排胶时间(s): {{ rowInfo.production_details.排胶时间||'--' }}</span>
              <span>名称: {{ rowInfo.product_no ||'--' }}</span>
              <span>总量(kg): {{ rowInfo.production_details.总重量 || '--' }}</span>
            </div>
            <div
              v-if="editionNo === 'v2'"
              class="police-record"
            >
              <span>排胶能量(kW·h): {{ rowInfo.evacuation_energy ||'--' }}</span>
              <span>设定: {{ rowInfo.plan_trains ||'--' }}</span>
              <span>时间(s): {{ rowInfo.begin_time || '--' }} 至 {{ rowInfo.end_time|| '--' }}</span>
              <br>
              <span>排胶温度(°c): {{ rowInfo.evacuation_temperature||'--' }}</span>
              <span>完成: {{ rowInfo.actual_trains || '--' }}</span>
              <span>排胶时间(s): {{ rowInfo.evacuation_time||'--' }}</span>
              <span>名称: {{ rowInfo.product_no ||'--' }}</span>
              <span>总量(kg): {{ rowInfo.actual_weight || '--' }}</span>
            </div>
            <div class="right-button">
              <!-- <el-button>上一步</el-button>
              <el-button>曲线导出</el-button>
              <br />
              <el-button>下一步</el-button>
              <el-button>打印报表</el-button>-->
            </div>
          </div>
          <div>
            <ve-line
              height="700px"
              :data="chartData"
              :after-set-option="afterSetOption"
              :settings="chartSettings"
              :extend="extend"
              :colors="colors"
              :toolbox="toolbox"
            />
            <!-- <button @click="clickChartData">下载</button> -->
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      :title="'工艺曲线_' + rowInfo.equip_no + '-' + rowInfo.product_no + '-' + rowInfo.begin_time"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <ve-line
        :data="chartData"
        :height="clientHeight"
        :after-set-option="afterSetOption"
        :settings="chartSettings"
        :extend="extend"
        :colors="colors"
        :toolbox="toolbox"
      />
    </el-dialog>
  </div>
</template>

<script>
import { setDate } from '@/utils/index'
import {
  trainsFeedbacksApiview,
  weighInformationUrl,
  mixerInformationUrl,
  curveInformationUrl,
  alarmLogList
} from '@/api/base_w'
import { trainsFeedbacksApiviewDown, timeEnergyConsuming } from '@/api/jqy'
import { personnelsUrl } from '@/api/user'
import page from '@/components/page'
import selectEquip from '@/components/select_w/equip'
// import ProductNoSelect from '@/components/ProductNoSelect'
import chartMixin from './chartMixin'
import { mapGetters } from 'vuex'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import classSelect from '@/components/ClassSelect'
export default {
  name: 'TrainNumberReport',
  components: { page, selectEquip, allProductNoSelect, classSelect },
  mixins: [chartMixin],
  props: {
    isComponents: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    currentRowTrain: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currentRowId: '',
      search_date: [],
      getParams: {
        page: 1
      },
      operatorList: [],
      tableData: [],
      loading: false,
      loadingTable: false,
      btnExportLoad: false,
      loaddingExal: true,
      total: 0,
      showRowTable: false,
      rowInfo: {},
      currentIndex: 1,
      alarmRecordList: [],
      weighInformationList: [],
      mixerInformationList: [],
      curveInformationList: [],
      totalWeighing: 0,
      totalMixer: 0,
      totalAlarmRecord: 0,
      // table高度
      maxHeightTable: '',
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['editionNo'])
  },
  watch: {
    show(val) {
      if (val) {
        this.getList()
      }
    }
  },
  created() {
    this.maxHeightTable = (document.body.clientHeight / 1.8) + 'px'
    this.clientHeight = (document.body.clientHeight - 300) + 'px'
    this.currentRowId = ''
    // this.getList()

    if (this.isComponents) {
      this.getParams.plan_classes_uid = this.currentRowTrain.plan_classes_uid
      this.getParams.trains = this.currentRowTrain.begin_trains + ',' + this.currentRowTrain.end_trains
      this.getList()
      return
    }
    this.currentTime = setDate('', true)
    const _setDateCurrent = setDate()
    this.getParams.begin_time = _setDateCurrent + ' 00:00:00'
    this.getParams.end_time = _setDateCurrent + ' 23:59:59'
    this.search_date = [this.getParams.begin_time, this.getParams.end_time]
  },
  methods: {
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.getParams)
      const _api = trainsFeedbacksApiviewDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '车次报表.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    exportTableEnergy() {
      if (!this.search_date) {
        this.$message('请选择日期')
        return
      }
      const obj = { st: this.search_date[0], et: this.search_date[1] }
      if (getDaysBetween(obj.st, obj.et) > 1) {
        this.$message('日期间隔不得大于31天')
        return
      }
      this.btnExportLoad = true
      const _api = timeEnergyConsuming
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '吨能耗及吨耗时.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    async getList() {
      try {
        this.loading = true
        this.showRowTable = false
        this.tableData = []
        const data = await trainsFeedbacksApiview('get', null, { params: this.getParams })
        this.tableData = data.results || []
        const obj = this.tableData.pop()
        // this.tableData = [{
        //   'id': 1,
        //   'created_date': '2020-09-05T20:34:34.661620',
        //   'last_updated_date': '2020-09-05T20:34:34.661620',
        //   'plan_classes_uid': '2020090520340801115A01',
        //   'plan_trains': 1,
        //   'actual_trains': 1,
        //   'equip_no': '115A01',
        //   'product_no': 'C-1MB-J260-01',
        //   'plan_weight': 1,
        //   'actual_weight': 1,
        //   'begin_time': '2020-09-05T20:34:34.654638',
        //   'end_time': '2020-09-05T20:34:34.654638',
        //   'operation_user': '云层跳',
        //   'classes': '早班',
        //   'product_time': null,
        //   'production_details': {
        //     '控制方式': '好累啊',
        //     '作业方式': '去你妈的作业',
        //     '总重量': 1,
        //     '排胶时间': 4,
        //     '排胶温度': 4,
        //     '排胶能量': 4,
        //     '员工代号': '屈妇三',
        //     '存盘时间': '4',
        //     '间隔时间': 4,
        //     '密炼时间': '4'
        //   },
        //   'status': null
        // },
        // {
        //   'id': 3,
        //   'created_date': '2020-09-05T20:36:32.708891',
        //   'last_updated_date': '2020-09-05T20:36:32.708891',
        //   'created_user_id': null,
        //   'plan_classes_uid': '2020090520340801115A01',
        //   'plan_trains': 1,
        //   'actual_trains': 2,
        //   'equip_no': '115A01',
        //   'product_no': 'C-1MB-J260-01',
        //   'plan_weight': 1,
        //   'actual_weight': 2,
        //   'begin_time': '2020-09-05T20:36:32.708891',
        //   'end_time': '2020-09-05T20:36:32.708891',
        //   'operation_user': '施满',
        //   'classes': '早班',
        //   production_details: null,
        //   status: null
        // }]

        this.total = data.count || 0
        this.tableData.forEach((D) => {
          D.begin_time = setDate(D.begin_time, true)
          D.end_time = setDate(D.end_time, true)
        })
        this.loading = false
        this.$store.commit('user/SET_EDITION', obj.version)
      } catch (e) {
        this.loading = false
      }
    },
    visibleChange(bool) {
      if (bool && this.operatorList.length === 0) {
        this.getOperatorList()
      }
    },
    async getOperatorList() {
      try {
        // groups: 91,
        const data = await personnelsUrl('get', null, {
          params: { all: 1 }
        })
        const operators = data.results || []
        // 去重
        var obj = {}
        var newArr = operators.reduce((item, next) => {
          obj[next.username]
            ? ' '
            : (obj[next.username] = true && item.push(next))
          return item
        }, [])
        this.operatorList = newArr
      } catch (e) {
        // console.log(e,88877)
      }
    },
    productBatchingChanged(val) {
      this.getParams.product_no = val ? val.material_no : ''

      this.getParams.page = 1
      this.getList()
    },
    changeSearch() {
      this.loadingTable = false
      this.getParams.begin_time = this.search_date ? this.search_date[0] : ''
      this.getParams.end_time = this.search_date ? this.search_date[1] : ''

      // this.showRowTable = false
      this.getParams.page = 1
      this.getList()
    },
    classChanged(val) {
      this.getParams.classes = val
      this.getParams.page = 1
      this.getList()
    },
    handleSelectionChange() { },
    selectRubber() { },
    clickChartData() {
      createImage(this)
    },
    afterSetOption(chartObj) {
      chartObj.setOption(this.options)
    },
    currentChange(page) {
      this.getParams.page = page
      this.getList()
    },
    async getWeighInformation(id, page) {
      try {
        // eslint-disable-next-line object-curly-spacing
        const data = await weighInformationUrl('get', null, { params: { feed_back_id: id, page: page,
          equip_no: this.getParams.equip_no }})
        // const test = [
        //   {
        //     id: 1,
        //     material_name: 'abshjfh',
        //     plan_weight: 400,
        //     actual_weight: 400.3,
        //     state_balance: 0,
        //     material_type: 'P'
        //   }
        // ]
        // return test
        this.totalWeighing = data.count
        return data.results || []
      } catch (e) {
        //
      }
    },
    async getMixerInformation(id, page) {
      try {
        const data = await mixerInformationUrl('get', null, { params: { feed_back_id: id,
          page: page, equip_no: this.getParams.equip_no }})
        // const test = [
        //   {
        //     sn: 1,
        //     condition_name: '条件',
        //     time: 0,
        //     temperature: 97,
        //     power: 38,
        //     energy: 0,
        //     action_name: '加胶料',
        //     rpm: 34,
        //     pressure: 0
        //   }
        // ]
        // return test
        this.totalMixer = data.count
        return data.results || []
      } catch (e) {
        //
      }
    },
    async getAlarmRecordList(id, page) {
      try {
        const data = await alarmLogList('get', null, { params: { feed_back_id: id,
          page: page }})
        this.totalAlarmRecord = data.count
        return data.results || []
      } catch (e) {
        //
      }
    },
    async getCurveInformation(id) {
      try {
        const data = await curveInformationUrl('get', null, { params: { feed_back_id: id }})
        // const test = [
        //   {
        //     id: 3,
        //     product_time: '2016-8-5 10:8:9',
        //     temperature: 111,
        //     power: 1000,
        //     rpm: 145,
        //     pressure: 130,
        //     energy: 120

        //   },
        //   {
        //     id: 3,
        //     product_time: '2016-8-5 10:8:10',
        //     temperature: 123,
        //     power: 1112,
        //     rpm: 144,
        //     pressure: 123,
        //     energy: 124
        //   },
        //   {
        //     id: 3,
        //     product_time: '2016-8-5 10:8:11',
        //     temperature: 111,
        //     power: 2222,
        //     rpm: 133,
        //     pressure: 139,
        //     energy: 200
        //   }
        // ]
        // test.forEach((element) => {
        //   element.created_date_date = element.product_time.split(' ')[1] ? element.product_time.split(' ')[1] : element.product_time
        // })
        // return test

        data.results.forEach((element) => {
          element.created_date_date = element.product_time.split(' ')[1] ? element.product_time.split(' ')[1] : element.product_time
        })
        return data.results || []
        // eslint-disable-next-line no-empty
      } catch (e) { }
    },
    async clickView(row, id, index) {
      if (this.currentRowId === id) {
        this.showRowTable = !this.showRowTable
        if (!this.showRowTable) {
          return
        }
      }
      this.currentRowId = id
      this.currentIndex = index
      // 整条行详情
      this.rowInfo = JSON.parse(JSON.stringify(row))

      // eslint-disable-next-line no-prototype-builtins
      if (this.editionNo === 'v1' && (!this.rowInfo.hasOwnProperty('production_details') || !this.rowInfo.production_details)) {
        this.rowInfo.production_details = {}
      }

      this.options.toolbox.feature.saveAsImage.name = '工艺曲线_' + this.rowInfo.equip_no + '-' + this.rowInfo.product_no + '-' + this.rowInfo.begin_time
      try {
        const arr = await Promise.all([
          this.getWeighInformation(id, 1),
          this.getMixerInformation(id, 1),
          this.getCurveInformation(id),
          this.getAlarmRecordList(id, 1)
        ])
        this.weighInformationList = arr[0] || []
        this.mixerInformationList = arr[1] || []
        this.curveInformationList = arr[2] || []
        this.alarmRecordList = arr[3] || []
        this.chartData.rows = this.curveInformationList

        this.options.title.text = this.curveInformationList.length > 0 ? this.curveInformationList[0].product_time.split(' ')[0] : '暂无数据'
        this.loaddingExal = false
        this.showRowTable = await true
      } catch (e) {
        this.loaddingExal = false
      }
    },
    async ChangePageWeighing(page) {
      this.weighInformationList = await this.getWeighInformation(this.currentRowId, page)
    },
    async ChangePageMixer(page) {
      this.mixerInformationList = await this.getMixerInformation(this.currentRowId, page)
    },
    async ChangePageAlarmRecord(page) {
      this.alarmRecordList = await this.getAlarmRecordList(this.currentRowId, page)
    },
    handleClose(done) {
      done()
    }
  }
}

function createImage(_this) {
  const canvas = document.getElementsByTagName('canvas')[0]
  if (!canvas.toDataURL) {
    _this.$message.info('请更新浏览器')
    return
  }
  const image = canvas.toDataURL({
    type: 'png',
    pixelRatio: 2
  })
  // 下载
  downloadFile('测试.png', image)
}
function downloadFile(fileName, content) {
  const aLink = document.createElement('a')
  const blob = base64ToBlob(content) // new Blob([content]);

  const evt = document.createEvent('HTMLEvents')
  evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  aLink.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
  ) // 兼容火狐
}
function base64ToBlob(code) {
  const parts = code.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length

  const uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: contentType })
}

function getDaysBetween(dateString1, dateString2) {
  var startDate = Date.parse(dateString1)
  var endDate = Date.parse(dateString2)
  if (startDate > endDate) {
    return 0
  }
  if (startDate === endDate) {
    return 1
  }
  var days = (endDate - startDate) / (31 * 24 * 60 * 60 * 1000)
  return days
}
</script>

<style lang="scss" scoped>
$border-color: #EBEEF5;
$border-weight: 1px;
$scrollbar-width: 4px;
$thumb-color:rgba(0, 0, 0, 0.2);
$track-color: rgba(0, 0, 0, 0.1);
.report-train-style {
  .trainContentLeft {
    // min-width: 350px;
    text-align: center;
    .trainContentLeftBox {
      border: $border-weight solid $border-color;
    }
    .row-border-bottom {
      border-bottom: $border-weight solid $border-color;
    }
  }
  .trainContentRight {
    border: $border-weight solid $border-color;
    padding: 15px;
    // display: flex;
    .police-record {
      flex: 1;
      line-height: 30px;
      margin-bottom: 25px;
      span {
        margin-right: 20px;
      }
    }
    .right-button {
      width: 200px;
      button {
        margin-bottom: 5px;
      }
    }
  }
  .grid-content {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    border-right: $border-weight solid $border-color;

    flex-wrap: wrap;
  }
  .bg-purple {
    font-size: 24px;
    font-weight: 700;
  }
  .bd-right-none {
    border-right: none;
  }
  .train-title {
    line-height: 36px;
  }
  .train-one {
    border-color: $border-color;
    .train-one-tr-banburying {
      td {
        // line-height: 20px;
        padding: 10px;
      }
    }
  }
  .noneData {
    text-align: center;
    line-height: 50px;
    width: 100%;
    border-bottom: 0.5px solid $border-color;
  }
  .begin_time_width {
    width: 60px;
  }
      .mixerInforStyle{
        max-height: 500px;
        overflow-y: scroll;
      }
      .weighInforStyle{
        max-height: 260px;
        overflow-y: scroll;
      }
        .trainContentLeft {
        // min-width: 350px;
         text-align: center;
          *::-webkit-scrollbar {
            width: $scrollbar-width;
          }
          *::-webkit-scrollbar-thumb {
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: $thumb-color;
          }
          *::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 0;
            background: $track-color;
          }

          .trainContentLeftBox {
          border: $border-weight solid $border-color;
          }
          .row-border-bottom {
          border-bottom: $border-weight solid $border-color;
          }
        }
         .grid-content {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          border-right: $border-weight solid $border-color;
          flex-wrap: wrap;
        }
        .bg-purple {
          font-size: 24px;
          font-weight: 700;
        }
         .bd-right-none {
          border-right: none;
        }
        .train-title {
          line-height: 36px;
        }
        .train-title-border{
          border-top: $border-weight solid $border-color;
        }
        .train-one {
          border-color: $border-color;
          .train-one-tr-banburying {
            td {
              // line-height: 20px;
              padding: 10px;
            }
          }
        }
        .noneData {
          text-align: center;
          line-height: 50px;
          width: 100%;
          border-bottom: 0.5px solid $border-color;
        }
        .begin_time_width {
          width: 60px;
        }
         .trainContentRight {
          border: $border-weight solid $border-color;
          padding: 15px;
          // display: flex;
          .police-record {
            flex: 1;
            line-height: 30px;
            margin-bottom: 25px;
            span {
              margin-right: 20px;
            }
          }
          .right-button {
            width: 200px;
            button {
              margin-bottom: 5px;
            }
          }
        }
}
</style>
