<template>
  <div>
    <!-- 原材料条码追朔 -->
    lot_no：
    <el-input
      v-model="barCodeSearch"
      style="width:200px;margin-right:20px"
      placeholder="请输入内容"
      @input="barCodeInput"
    />
    流程：<el-select v-model="value" placeholder="流程" @change="clickFun">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      />
    </el-select>
    <el-timeline v-if="activities" style="margin-top:18px;">
      <el-timeline-item
        v-for="(activity, key) in options"
        :key="key"
        :timestamp="activities[activity.label]?activities[activity.label][0]&&activities[activity.label][0].created_date?
          setDate(activities[activity.label][0].created_date):'':''"
        placement="top"
        size="large"
        :color="value === activity.value?'#0bbd87':''"
      >
        <div
          :id="activity.value"
          :ref="activity.value"
          style="width:35px;display: inline-block;"
        >
          {{ activities[activity.label]?activities[activity.label][0]&&activities[activity.label][0].batch_classes
            ?activities[activity.label][0].batch_classes:'--':'--' }}
        </div>
        <span style="margin-left:10px;display: inline-block;" @click="activity._show = !activity._show">{{ activity.value }}</span>
        <i v-if="activity._show" class="el-icon-arrow-down" style="vertical-align: middle;margin-left:10px;" @click="activity._show = !activity._show" />
        <i v-if="!activity._show" class="el-icon-arrow-up" style="vertical-align: middle;margin-left:10px" @click="activity._show = !activity._show" />
        <table
          v-if="activity._show"
          border="1"
          bordercolor="#72716d"
          class="info-table"
        >
          <thead>
            <tr v-if="activity.label === 'material_in'">
              <td>条码</td>
              <td>物料编码</td>
              <td>物料名称</td>
              <td>仓库信息</td>
              <td>库存信息</td>
              <td>库位信息</td>
              <td>操作员</td>
              <td>供应商</td>
              <td>供应商批次</td>
            </tr>
            <tr v-if="activity.label === 'product_info'">
              <td>配方编码</td>
              <td>创建时间</td>
              <td>审核时间</td>
              <td>启用时间</td>
              <td>下发时间</td>
              <td>审核人</td>
              <td>驳回人</td>
              <td>启用人</td>
              <td>废弃人</td>
            </tr>
            <tr v-if="activity.label === 'product_details'">
              <td>配方编码</td>
              <td>物料编码</td>
              <td>重量(kg)</td>
            </tr>
            <tr v-if="activity.label === 'plan_info'">
              <td>计划编号</td>
              <td>胶料编码</td>
              <td>设备编码</td>
              <td>车次</td>
              <td>创建时间</td>
              <td>下发时间</td>
              <td>开始生产时间</td>
              <td>结束生产时间</td>
            </tr>
            <tr v-if="activity.label === 'batch_plan'">
              <td>小料计划编码</td>
              <td>配料设备</td>
              <td>创建时间</td>
              <td>下发时间</td>
              <td>开始生产时间</td>
              <td>结束生产时间</td>
            </tr>
            <tr v-if="activity.label === 'material_out'">
              <td>条码</td>
              <td>物料编码</td>
              <td>物料名称</td>
              <td>仓库信息</td>
              <td>库存信息</td>
              <td>库位信息</td>
              <td>托盘号</td>
              <td>操作员</td>
              <td>供应商</td>
              <td>供应商批次</td>
            </tr>
            <tr v-if="activity.label === 'weight_load'">
              <td>条码</td>
              <td>物料编码</td>
              <td>配料设备</td>
              <td>罐料信息</td>
              <td>称量投入时间</td>
              <td>操作员</td>
            </tr>
            <tr v-if="activity.label === 'weight_package'">
              <td>条码</td>
              <td>物料编码</td>
              <td>配料设备</td>
              <td>料包产出时间</td>
              <td>操作员</td>
            </tr>
            <tr v-if="activity.label === 'material_load'">
              <td>条码</td>
              <td>物料编码</td>
              <td>生产机台</td>
              <td>密炼投入时间</td>
              <td>操作员</td>
            </tr>
            <tr v-if="activity.label === 'pallet_feed'">
              <td>lot_no</td>
              <td>胶料编码</td>
              <td>车次</td>
              <td>收皮产出时间</td>
              <td>车次报表</td>
            </tr>
            <tr v-if="activity.label === 'product_in'">
              <td>lot_no</td>
              <td>胶料编码</td>
              <td>托盘号</td>
              <td>入库时间</td>
              <td>质量状况</td>
            </tr>
            <tr v-if="activity.label === 'dispatch_log'">
              <td>发货单号</td>
              <td>胶料编码</td>
              <td>托盘号</td>
              <td>发货时间</td>
              <td>目的地</td>
            </tr>
          </thead>
          <tbody v-for="(itemVal,index) in activities[activity.label]" :key="index">
            <tr v-if="activity.label === 'material_in'">
              <!-- <td>{{}}</td> -->
            </tr>
            <tr v-if="activity.label === 'product_info'">
              <td>{{ itemVal.stage_product_batch_no }}</td>
              <td>{{ setDate(itemVal.created_date) }}</td>
              <td>{{ setDate(itemVal.check_time) }}</td>
              <td>{{ setDate(itemVal.used_time) }}</td>
              <td>--</td>
              <td>{{ itemVal.check_user }}</td>
              <td>{{ itemVal.reject_user }}</td>
              <td>{{ itemVal.used_user }}</td>
              <td>{{ itemVal.obsolete_user }}</td>
            </tr>
            <tr v-if="activity.label === 'product_details'">
              <td>{{ itemVal.product_batching__stage_product_batch_no }}</td>
              <td>{{ itemVal.material__material_no }}</td>
              <td>{{ itemVal.actual_weight }}</td>
            </tr>
            <tr v-if="activity.label === 'plan_info'">
              <td>{{ itemVal.plan_classes_uid }}</td>
              <td>{{ itemVal.product_batching__stage_product_batch_no }}</td>
              <td>{{ itemVal.equip__equip_no }}</td>
              <td>{{ itemVal.plan_trains }}</td>
              <td>{{ setDate(itemVal.created_date) }}</td>
              <td>{{ setDate(itemVal.last_updated_date) }}</td>
              <td>--</td>
              <td>--</td>
            </tr>
            <tr v-if="activity.label === 'batch_plan'">
              <td>{{ itemVal.plan_batching_uid }}</td>
              <td>{{ itemVal.weigh_cnt_type__product_batching__equip__equip_no ||'--' }}</td>
              <td>{{ setDate(itemVal.created_date) }}</td>
              <td>{{ setDate(itemVal.last_updated_date) }}</td>
              <td>--</td>
              <td>--</td>
            </tr>
            <tr v-if="activity.label === 'material_out'">
              <!-- <td>{{}}</td> -->
            </tr>
            <tr v-if="activity.label === 'weight_load'">
              <td>{{ itemVal.bra_code }}</td>
              <td>{{ itemVal.material_no }}</td>
              <td>{{ itemVal.equip_no }}</td>
              <td>{{ itemVal.tank_no || '--' }}</td>
              <td>{{ setDate(itemVal.created_date) }}</td>
              <td>{{ itemVal.batch_group }}</td>
              <!-- batch_classes 班次 -->
            </tr>
            <tr v-if="activity.label === 'weight_package'">
              <td>{{ itemVal.bra_code }}</td>
              <td>{{ itemVal.material_no }}</td>
              <td>{{ itemVal.equip_no }}</td>
              <td>{{ setDate(itemVal.created_date) }}</td>
              <td>{{ itemVal.batch_group }}</td>
            </tr>
            <tr v-if="activity.label === 'material_load'">
              <td>{{ itemVal.bra_code }}</td>
              <td>{{ itemVal.material_no }}</td>
              <td>{{ itemVal.feed_log__equip_no }}</td>
              <td>{{ setDate(itemVal.weight_time) }}</td>
              <td>{{ itemVal.feed_log__batch_group }}</td>
            </tr>
            <tr v-if="activity.label === 'pallet_feed'">
              <td>{{ itemVal.lot_no }}</td>
              <td>{{ itemVal.product_no }}</td>
              <td>{{ itemVal.begin_trains }}-{{ itemVal.end_trains }}</td>
              <td>{{ setDate(itemVal.product_time) }}</td>
              <td style="cursor: pointer;">
                <el-button size="mini" @click="trainReport(itemVal)">查看</el-button>
              </td>
            </tr>
            <tr v-if="activity.label === 'product_in'">
              <td>{{ itemVal.lot_no }}</td>
              <td>{{ itemVal.material_no }}</td>
              <td>{{ itemVal.pallet_no }}</td>
              <td>{{ setDate(itemVal.start_time) }}</td>
              <td style="cursor: pointer;">
                <el-button size="mini" @click="productInView(itemVal)">查看</el-button>
              </td>
            </tr>
            <tr v-if="activity.label === 'dispatch_log'">
              <td>{{ itemVal.order_no }}</td>
              <td>{{ itemVal.material_no }}</td>
              <td>{{ itemVal.pallet_no }}</td>
              <td>{{ setDate(itemVal.order_created_time) }}</td>
              <td>{{ itemVal.dispatch_location }}</td>
            </tr>
          </tbody>
        </table>
      </el-timeline-item>
    </el-timeline>

    <el-dialog
      title="车次报表"
      :visible.sync="dialogVisible"
      width="90%"
    >
      <el-table
        :data="tableData1"
        border
      >
        <el-table-column
          prop="equip_no"
          label="机台"
          min-width="10"
        />
        <el-table-column
          prop="product_no"
          label="配方编号"
          min-width="10"
        />
        <el-table-column
          prop="plan_classes_uid"
          label="计划编号"
          min-width="10"
        />
        <el-table-column
          prop="begin_time"
          min-width="10"
          sortable
          label="开始时间"
        />
        <el-table-column
          prop="end_time"
          label="结束时间"
          sortable
          min-width="10"
        />
        <el-table-column
          prop="plan_trains"
          label="设定车次"
          min-width="10"
        />
        <el-table-column
          prop="actual_trains"
          label="实际车次"
          min-width="10"
        />
        <el-table-column
          :prop="editionNo === 'v1'?'production_details.控制方式':'control_mode'"
          label="本/远控"
          min-width="10"
        />
        <el-table-column
          :prop="editionNo === 'v1'?'production_details.作业方式':'operating_type'"
          label="手/自动"
          min-width="10"
        />
        <el-table-column
          :prop="editionNo === 'v1'?'production_details.总重量':'actual_weight'"
          label="总重量(kg)"
          min-width="10"
        />
        <el-table-column
          :prop="editionNo === 'v1'?'production_details.排胶时间':'evacuation_time'"
          label="排胶时间(s)"
          min-width="10"
        />
        <el-table-column
          :prop="editionNo === 'v1'?'production_details.排胶温度':'evacuation_temperature'"
          label="排胶温度(c°)"
        />
        <el-table-column
          :prop="editionNo === 'v1'?'production_details.排胶能量':'evacuation_energy'"
          label="排胶能量(J)"
          min-width="10"
        />
        <el-table-column
          :prop="editionNo === 'v1'?'production_details.员工代号':'operation_user'"
          label="操作人"
          min-width="10"
        />
        <el-table-column
          :prop="editionNo === 'v1'?'production_details.存盘时间':'product_time'"
          label="存盘时间(s)"
          width="100"
          min-width="10"
        />
        <el-table-column
          :prop="editionNo === 'v1'?'production_details.密炼时间':'mixer_time'"
          label="密炼时间(s)"
          width="100"
          min-width="10"
        />
        <el-table-column
          :prop="editionNo === 'v1'?'production_details.间隔时间':'interval_time'"
          label="间隔时间(s)"
          min-width="10"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      width="900px"
      :visible.sync="testCardDialogVisible"
    >
      <test-card ref="testCard" />
    </el-dialog>
  </div>
</template>

<script>
import { ProductTrace, barcodePreview } from '@/api/base_w_three'
import { debounce, setDate } from '@/utils'
import { trainsFeedbacksApiview } from '@/api/base_w'
import { mapGetters } from 'vuex'
import testCard from '../components/productInCard'
export default {
  components: { testCard },
  data() {
    return {
      value: '',
      barCodeSearch: 'KTP005', // 2021031911250102
      activities: {}, // pallet_feed: [{}]
      options: [
        { label: 'material_in', value: '入库', _show: true },
        { label: 'product_info', value: '配方创建', _show: true },
        { label: 'product_details', value: '配方配料详情', _show: true },
        { label: 'plan_info', value: '胶料计划', _show: true },
        { label: 'batch_plan', value: '小料计划', _show: true },
        { label: 'material_out', value: '原材料出库', _show: true },
        { label: 'weight_load', value: '小料称量投入', _show: true },
        { label: 'weight_package', value: '料包产出', _show: true },
        { label: 'material_load', value: '密炼投入', _show: true },
        { label: 'pallet_feed', value: '收皮反馈', _show: true },
        { label: 'product_in', value: '收皮入库', _show: true },
        { label: 'dispatch_log', value: '胶片发货', _show: true }
      ],
      headList: {
        material_in: []
      },
      dialogVisible: false,
      tableData1: [],
      loadingTrain: false,
      testCardDialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['editionNo'])
  },
  created() {
    this.getList()
  },
  methods: {
    setDate,
    async getList() {
      this.loading = true
      try {
        const data = await ProductTrace('get', null, { params: { lot_no: this.barCodeSearch }})
        if (data.product_in[0]) {
          data.product_in[0].created_date = data.product_in[0] ? data.product_in[0].start_time : ''
        }
        if (data.material_load[0]) {
          data.material_load[0].created_date = data.material_load[0].weight_time || ''
          data.material_load[0].batch_classes = data.material_load[0].feed_log__batch_classes || ''
        }
        if (data.pallet_feed[0]) {
          data.pallet_feed[0].batch_classes = data.pallet_feed[0].classes || ''
        }
        if (data.plan_info[0]) {
          data.plan_info[0].batch_classes = data.plan_info[0].work_schedule_plan__classes__global_name || ''
        }
        if (data.product_info[0]) {
          data.product_info[0].batch_classes = data.product_info[0].classes_name || ''
        }
        if (data.batch_plan[0]) {
          data.batch_plan[0].batch_classes = data.batch_plan[0].work_schedule_plan__classes__global_name || ''
        }
        if (data.product_in[0]) {
          data.product_in[0].batch_classes = data.product_in[0].classes_name || ''
        }
        if (data.dispatch_log[0]) {
          data.dispatch_log[0].batch_classes = data.dispatch_log[0].classes_name || ''
        }
        if (data.product_details[0]) {
          data.product_details[0].batch_classes = data.product_info[0].classes_name || ''
          data.product_details[0].created_date = data.product_info[0].created_date || ''
        }
        this.activities = data
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    productInView(row) {
      this.getCardInfo(row.lot_no)
      this.testCardDialogVisible = true
    },
    async getCardInfo(lot_no) {
      try {
        const data = await barcodePreview('get', null, { params: { lot_no: lot_no }})
        this.$nextTick(() => {
          this.$refs['testCard'].setTestData(data)
        })
      } catch (e) {
        //
      }
    },
    trainReport(row) {
      this.dialogVisible = true
      // this.getTrainReport()
    },
    async getTrainReport() {
      try {
        this.loadingTrain = true
        const data = await trainsFeedbacksApiview('get', null, { params: this.getParams })
        this.loadingTrain = false
        const obj = this.tableData1.pop()
        this.tableData1 = data.results || []
        this.$store.commit('user/SET_EDITION', obj.version)
      } catch (e) {
        this.loadingTrain = false
      }
    },
    clickFun(val) {
      try {
        this.$nextTick(() => {
          setTimeout(() => {
            const targetbox = document.getElementById(val)
            const target = targetbox.getBoundingClientRect().top - 50
            document.documentElement.scrollTop = target
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    barCodeInput() {
      debounce(this, 'getList')
    }
  }
}
</script>

<style lang="scss" scoped>
.info-table{
    margin-top:5px;
    border-collapse: collapse;
    td{
        width: 150px;
        text-align: center;
        color: #72716d;
        padding:4px 0;
        word-break : break-all;
    }
}
</style>
