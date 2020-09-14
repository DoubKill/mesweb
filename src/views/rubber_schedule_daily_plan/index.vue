/* eslint-disable indent */
<template>
  <div>
    <el-form :inline="true">

      <el-form-item label="日期">
        <el-date-picker
          v-model="plan_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="queryDataChange"
        />
      </el-form-item>
      <el-form-item label="机台">
        <el-select
          v-model="equip_no"
          filterable
          clearable
          placeholder="请选择"
          @change="queryDataChange"
        >
          <el-option
            v-for="equip in equips"
            :key="equip.id"
            :label="equip.equip_no"
            :value="equip.equip_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="胶料">
        <el-select
          v-model="stage_product_batch_no"
          filterable
          clearable
          placeholder="请选择"
          @change="queryDataChange"
        >
          <el-option
            v-for="(no, index) in stage_product_batch_nos"
            :key="index"
            :label="no"
            :value="no"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="showAddPlansDialog">
          新建
        </el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          :disabled="!currentRow"
          @click="deletePlan"
        >
          删除
        </el-button>
      </el-form-item>
      <!--
        <el-form-item style="float: right">
            <el-button @click="dialogCopyVisible = true">
                复制
            </el-button>
        </el-form-item>
        -->
      <!--
        <el-form-item style="float: right">
            <el-checkbox-button v-model="changePlanVisible">
                修改
            </el-checkbox-button>
        </el-form-item>
        -->
    </el-form>

    <el-table
      highlight-current-row
      :data="tableData"
      border
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        type="index"
        label="No"
        width="50"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
      />
      <el-table-column
        width="150"
        prop="product_no"
        label="胶料配方编码"
      />
      <el-table-column
        prop="batching_weight"
        label="配料重量（吨）"
      />
      <el-table-column
        prop="production_time_interval"
        label="炼胶时间（分钟）"
      />
      <el-table-column label="当前库存（吨）" />
      <el-table-column label="早班计划">
        <el-table-column
          prop="pdp_product_classes_plan[0].sn"
          label="顺序"
        />
        <el-table-column
          prop="pdp_product_classes_plan[0].plan_trains"
          label="车次"
        />
        <el-table-column
          prop="pdp_product_classes_plan[0].weight"
          label="重量"
        />
        <el-table-column
          prop="pdp_product_classes_plan[0].time"
          label="时间"
        />
      </el-table-column>
      <el-table-column label="中班计划">
        <el-table-column
          prop="pdp_product_classes_plan[1].sn"
          label="顺序"
        />
        <el-table-column
          prop="pdp_product_classes_plan[1].plan_trains"
          label="车次"
        />
        <el-table-column
          prop="pdp_product_classes_plan[1].weight"
          label="重量"
        />
        <el-table-column
          prop="pdp_product_classes_plan[1].time"
          label="时间"
        />
      </el-table-column>
      <el-table-column label="夜班计划">
        <el-table-column
          prop="pdp_product_classes_plan[2].sn"
          label="顺序"
        />
        <el-table-column
          prop="pdp_product_classes_plan[2].plan_trains"
          label="车次"
        />
        <el-table-column
          prop="pdp_product_classes_plan[2].weight"
          label="重量"
        />
        <el-table-column
          prop="pdp_product_classes_plan[2].time"
          label="时间"
        />
      </el-table-column>
      <el-table-column label="发送到上辅机">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="sendToAu(scope.row)"
          >发送
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      @currentChange="currentChange"
    />

    <el-card v-if="changePlanVisible">
      <div>
        修改计划
        <el-button
          style="float: right; margin-bottom: 20px"
          @click="changePlan"
        >
          确定
        </el-button>
      </div>
      <div style="overflow-x: auto;clear: both; text-align: center">
        <table
          data-toggle="table"
          class="table table-bordered"
          style="color: #909399; font-size: 14px;"
        >
          <thead>
            <tr>
              <th colspan="4">早班计划</th>
              <th colspan="4">中班计划</th>
              <th colspan="4">夜班计划</th>
            </tr>
            <tr>
              <div
                v-for="_ in 3"
                :key="_"
              >
                <th>顺序</th>
                <th>车次</th>
                <th>重量(吨)</th>
                <th>时间</th>
              </div>
            </tr>
          </thead>
          <tbody>
            <div
              v-for="(plan, index) in rubberDailyPlanChangeForm.pdp_product_classes_plan"
              :key="index"
            >
              <td>
                <el-input-number
                  v-model="plan.sn"
                  :min="0"
                />
              </td>
              <td>
                <el-input-number
                  v-model="plan.plan_trains"
                  :min="0"
                  @change="planTrainsChangeForUpdate(index)"
                />
              </td>
              <td>
                {{ plan.weight }}
              </td>
              <td>
                {{ plan.time }}
              </td>
            </div>
          </tbody>
        </table>
      </div>
    </el-card>

    <el-dialog
      width="90%"
      :visible.sync="addPlanVisible"
      title="添加胶料日生产计划"
    >
      <div style="margin-bottom: 15px">
        <el-select
          v-model="equipIdForAdd"
          filterable
          placeholder="请选择机台"
          style="margin-right: 10px"
        >
          <el-option
            v-for="equip in equips"
            :key="equip.id"
            :label="equip.equip_no"
            :value="equip.id"
          />
        </el-select>
        <el-date-picker
          v-model="day_time"
          style="margin-right: 10px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getPlanSchedules"
        />
        <el-select
          v-model="planScheduleId"
          filterable
          placeholder="倒班规则"
        >
          <el-option
            v-for="planSchedule in planSchedules"
            :key="planSchedule.id"
            :label="planSchedule.work_schedule__schedule_name"
            :value="planSchedule.id"
          />
        </el-select>

        <el-button
          style="float: right"
          @click="batchSave"
        >保存</el-button>
        <el-button @click="addOnePlan">添加</el-button>
      </div>
      <el-table
        :span-method="arraySpanMethod"
        :data="plansForAdd"
        border
      >
        <el-table-column
          fixed
          prop="equip_.equip_no"
          label="机台"
          width="150"
        />
        <el-table-column
          label="胶料配方编码"
          width="180"
        >
          <template
            v-if="!scope.row.sum"
            slot-scope="scope"
          >
            <el-select
              v-model="scope.row.product_batching"
              @change="productBatchingChanged(scope.row)"
            >
              <el-option
                v-for="productBatching in scope.row.productBatchings"
                :key="productBatching.id"
                :label="productBatching.stage_product_batch_no"
                :value="productBatching.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="batching_weight"
          label="配料重量（吨）"
        />
        <el-table-column
          prop="production_time_interval"
          label="炼胶时间（分钟）"
        />
        <el-table-column label="当前库存（吨）" />
        <el-table-column label="早班计划">
          <el-table-column
            label="顺序"
            width="210"
          >
            <template
              v-if="!scope.row.sum && scope.row.pdp_product_classes_plan[0].enable"
              slot-scope="scope"
            >
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[0].sn"
                :min="0"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="车次"
            width="210"
          >
            <template
              v-if="scope.row.pdp_product_classes_plan[0].enable"
              slot-scope="scope"
            >
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[0].plan_trains"
                :disabled="scope.row.sum"
                :min="0"
                @change="planTrainsChanged(scope.row, 0)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="pdp_product_classes_plan[0].weight"
            label="重量"
          />
          <el-table-column
            prop="pdp_product_classes_plan[0].time"
            label="时间"
          />
        </el-table-column>
        <el-table-column label="中班计划">
          <el-table-column
            label="顺序"
            width="210"
          >
            <template
              v-if="!scope.row.sum && scope.row.pdp_product_classes_plan[1].enable"
              slot-scope="scope"
            >
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[1].sn"
                :min="0"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="车次"
            width="210"
          >
            <template
              v-if="scope.row.pdp_product_classes_plan[1].enable"
              slot-scope="scope"
            >
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[1].plan_trains"
                :disabled="scope.row.sum"
                :min="0"
                @change="planTrainsChanged(scope.row, 1)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="pdp_product_classes_plan[1].weight"
            label="重量"
          />
          <el-table-column
            prop="pdp_product_classes_plan[1].time"
            label="时间"
          />
        </el-table-column>
        <el-table-column label="晚班计划">
          <el-table-column
            label="顺序"
            width="210"
          >
            <template
              v-if="!scope.row.sum && scope.row.pdp_product_classes_plan[2].enable"
              slot-scope="scope"
            >
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[2].sn"
                :min="0"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="车次"
            width="210"
          >
            <template
              v-if="scope.row.pdp_product_classes_plan[2].enable"
              slot-scope="scope"
            >
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[2].plan_trains"
                :disabled="scope.row.sum"
                :min="0"
                @change="planTrainsChanged(scope.row, 2)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="pdp_product_classes_plan[2].weight"
            label="重量"
          />
          <el-table-column
            prop="pdp_product_classes_plan[2].time"
            label="时间"
          />
        </el-table-column>
        <el-table-column label="操作">
          <template
            v-if="!scope.row.sum"
            slot-scope="scope"
          >
            <el-button
              type="danger"
              @click="deleteOnePlan(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogCopyVisible"
      title="复制胶料日生产计划"
    >
      <el-form>
        <el-form-item label="来源日期">
          <el-date-picker
            v-model="src_date"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="新建日期">
          <el-date-picker
            v-model="dst_date"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCopyVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="copyPlan"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  equipUrl, workSchedulesUrl, planScheduleUrl,
  productDayPlansUrl,
  productDayPlansCopyUrl,
  rubberMaterialUrl,
  productDayPlanManyCreateUrl,
  productDayPlanNoticeUrl
} from '@/api/base_w'
import pagination from '@/components/page'
export default {
  components: { pagination },
  data: function() {
    return {
      //   tableDataUrl: ProductDayPlansUrl,
      plan_date: dayjs().format('YYYY-MM-DD'),
      equips: [],
      equipById: {},
      equip_no: '',
      stage_product_batch_no: '',
      stage_product_batch_nos: [],
      rubberDailyPlanChangeForm: {
        equip: null,
        product_batching: null,
        pdp_product_classes_plan: [
          {
            sn: null,
            plan_trains: null,
            time: '00:00:00',
            weight: ''
          }, {
            sn: null,
            plan_trains: null,
            time: '00:00:00',
            weight: ''
          }, {
            sn: null,
            plan_trains: null,
            time: '00:00:00',
            weight: ''
          }
        ]
      },
      rubberDailyPlanForm: {
        equip: null,
        product_batching: null,
        pdp_product_classes_plan: [
          {
            sn: null,
            plan_trains: null,
            time: '00:00:00',
            weight: '',
            unit: '吨'
          }, {
            sn: null,
            plan_trains: null,
            time: '00:00:00',
            weight: '',
            unit: '吨'
          }, {
            sn: null,
            plan_trains: null,
            time: '00:00:00',
            weight: '',
            unit: '吨'
          }
        ]
      },
      batching_weight: '',
      batching_time_interval: '',
      batching_weight_for_update: '',
      batching_time_interval_for_update: '',
      // productBatchings: [],
      productBatchingById: {},
      addPlanVisible: false,
      changePlanVisible: false,
      currentRow: null,
      dialogCopyVisible: false,
      src_date: null,
      dst_date: null,
      plansForAdd: [],
      statisticData: [],
      equipIdForAdd: null,
      planScheduleId: null,
      planSchedules: [],
      plan_date_for_create: dayjs().format('YYYY-MM-DD'),
      workSchedules: [],
      day_time: '',
      selectDateArr: [],
      tableData: [],
      getParams: {
        page: 1
      },
      total: 0
    }
  },
  created: function() {
    this.selectDateArr = ['2020-8-5 11:20:00', '2020-8-7 11:20:00', '2020-8-15  11:20:00']
    this.selectDateArr = this.setTimeStamp(this.selectDateArr)
    var app = this
    this.getList()
    equipUrl('get', {
      params: {
        all: 1
      }
    }).then(function(response) {
      app.equips = response.results
      app.equips.forEach(function(equip) {
        app.equipById[equip.id] = equip
      })
    }).catch(function() {
    })
    workSchedulesUrl('get', null, {
      params: {
        all: 1
      }
    }).then(function(response) {
      app.workSchedules = response.results
    }).catch(function() {
    })
  },
  methods: {
    getList() {
      this.beforeGetData()
      const app = this
      productDayPlansUrl('get', null, {
        params: this.getParams
      }).then(function(response) {
        app.total = response.count
        app.tableData = response.results
      }).catch(function() {
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getList()
    },
    getPlanSchedules() {
      var app = this
      planScheduleUrl('get', null, {
        params: {
          all: 1,
          day_time: app.day_time
        }
      }).then(function(response) {
        app.planSchedules = response.results
        app.planScheduleId = null
      }).catch(function() {
      })
    },
    queryDataChange: function() {
      this.getParams.page = 1
      this.getList()
    },
    beforeGetData: function() {
      this.getParams['plan_date'] = this.plan_date
      this.getParams['equip_no'] = this.equip_no
      this.getParams['product_no'] = this.stage_product_batch_no
    },
    planTrainsChangeForUpdate: function(index) {
      this.rubberDailyPlanChangeForm
        .pdp_product_classes_plan[index].weight =
        this.batching_weight_for_update * this.rubberDailyPlanChangeForm
          .pdp_product_classes_plan[index].plan_trains
      var time = this.batching_time_interval_for_update.split(':')
      var second = Number(time[2]) + Number(time[1]) * 60 + Number(time[0]) * 60 * 60
      second = this.rubberDailyPlanChangeForm
        .pdp_product_classes_plan[index].plan_trains * second
      var date = new Date(null)
      date.setSeconds(second)
      this.rubberDailyPlanChangeForm.pdp_product_classes_plan[index].time =
        date.toISOString().substr(11, 8)
    },
    planTrainsChange: function(index) {
      this.rubberDailyPlanForm
        .pdp_product_classes_plan[index].weight =
        this.batching_weight * this.rubberDailyPlanForm
          .pdp_product_classes_plan[index].plan_trains
      var time = this.batching_time_interval.split(':')
      var second = Number(time[2]) + Number(time[1]) * 60 + Number(time[0]) * 60 * 60
      second = this.rubberDailyPlanForm
        .pdp_product_classes_plan[index].plan_trains * second
      var date = new Date(null)
      date.setSeconds(second)
      this.rubberDailyPlanForm.pdp_product_classes_plan[index].time =
        date.toISOString().substr(11, 8)
    },
    changePlan: function() {
      if (!this.currentRow) {
        this.$alert('请选择修改行', '修改计划', {
          confirmButtonText: '确定'
        })
        return
      }
      var app = this
      this.rubberDailyPlanChangeForm['plan_date'] = this.plan_date
      productDayPlansUrl('put', this.currentRow.id,
        { data: app.rubberDailyPlanChangeForm })
        .then(function(response) {
          app.$message('创建成功')
          app.getList()
        }).catch(function() {
          //   var text = ''
          //   for (var key in error) {
          //     text += error[key] + '\n'
          //   }
          //   app.$message(text)
        })
    },
    getPlanText: function(index) {
      switch (index) {
        case 0:
          return '早班计划'
        case 1:
          return '中班计划'
        case 2:
          return '晚班计划'
      }
    },
    productBatchingChange: function() {
      this.batching_weight = this.productBatchingById[this.rubberDailyPlanForm.product_batching].batching_weight
      this.batching_time_interval = this.productBatchingById[this.rubberDailyPlanForm.product_batching].batching_time_interval

      for (var i = 0; i < 3; ++i) { this.planTrainsChange(i) }
    },
    handleCurrentChange(val) {
      this.currentRow = val
      if (!val) { return }
      this.rubberDailyPlanChangeForm.equip = this.currentRow.equip
      this.rubberDailyPlanChangeForm.product_batching =
        this.currentRow.product_batching
      this.batching_weight_for_update = this.currentRow.batching_weight
      this.batching_time_interval_for_update = this.currentRow.batching_time_interval
      for (var i = 0; i < this.currentRow.pdp_product_classes_plan.length; ++i) {
        for (var key in this.currentRow.pdp_product_classes_plan[i]) {
          this.rubberDailyPlanChangeForm.pdp_product_classes_plan[i][key] =
            this.currentRow.pdp_product_classes_plan[i][key]
        }
      }
    },
    deletePlan: function() {
      var app = this
      this.$confirm('此操作将永久删除' + this.currentRow.product_no + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productDayPlansUrl('delete', app.currentRow.id)
          .then(function(response) {
            app.$message({
              type: 'success',
              message: '删除成功!'
            })
            app.getList()
          }).catch(function() {
          })
      }).catch(() => {

      })
    },
    copyPlan: function() {
      var app = this
      productDayPlansCopyUrl('post', null, {
        data: {
          src_date: app.src_date,
          dst_date: app.dst_date
        }
      }
      ).then(function(response) {
        app.$message({
          type: 'success',
          message: '复制成功!'
        })
        app.getList()
        app.dialogCopyVisible = false
      }).catch(function() {
      })
    },
    deleteOnePlan(plan) {
      this.plansForAdd.splice(this.plansForAdd.indexOf(plan), 1)
      var plans = this.plansForAdd.filter(plan_ => {
        return plan_.equip === plan.equip
      })
      if (plans.length === 1 && plans[0].sum) {
        this.plansForAdd.splice(this.plansForAdd.indexOf(plans[0]), 1)
      }
      this.statistic()
    },
    async addOnePlan() {
      if (!this.equipIdForAdd) {
        return
      }
      const res = await planScheduleUrl('get', this.planScheduleId)
      const planSchedule = res
      var workSchedule = this.workSchedules.find(workSchedule => {
        return workSchedule.id === planSchedule.work_schedule
      })
      if (!planSchedule.work_schedule_plan.length) {
        this.$alert(planSchedule.work_schedule_name + '无排班', '错误', {
          confirmButtonText: '确定'
        })
        return
      }
      var classesdetail_set_ = workSchedule.classesdetail_set
      var pdp_product_classes_plan = []
      for (var i = 0; i < 3; i++) {
        var enable = !!planSchedule.work_schedule_plan[i]
        pdp_product_classes_plan.push({
          plan_trains: 0,
          sn: 0,
          unit: '吨',
          time: enable ? 0 : '',
          weight: enable ? 0 : '',
          classes: classesdetail_set_[i].classes,
          enable
        })
      }
      var plan =
      {
        equip_: this.equipById[this.equipIdForAdd],
        equip: this.equipIdForAdd,
        plan_schedule: this.planScheduleId,
        pdp_product_classes_plan
      }
      var app = this
      rubberMaterialUrl('get', null, {
        params: {
          all: 1,
          used_type: 4,
          dev_type: app.equipById[app.equipIdForAdd].category
        }
      }).then(function(response) {
        app.$set(plan, 'productBatchings', response.results)
        response.results.forEach(function(batching) {
          //
          app.productBatchingById[batching.id] = batching
        })
      })

      if (this.equipFirstIndexInPlansForAdd() === -1) {
        this.plansForAdd.push(plan)
        var planForSum = JSON.parse(JSON.stringify(plan))
        planForSum['sum'] = true
        planForSum['equip_'].equip_no = '小计'
        this.plansForAdd.push(planForSum)
      } else {
        var lastIndex = this.equipLastIndexInPlansForAdd()
        this.plansForAdd.splice(lastIndex, 0, plan)
      }
    },
    equipLastIndexInPlansForAdd() {
      for (var i = 0; i < this.plansForAdd.length; i++) {
        if (this.plansForAdd[i].equip_.id === this.equipIdForAdd) {
          var last = true
          for (var j = i + 1; j < this.plansForAdd.length; j++) {
            if (this.plansForAdd[j] === this.equipIdForAdd) { last = false }
          }
          if (last) { return i }
        }
      }
      return -1
    },
    equipFirstIndexInPlansForAdd() {
      for (var i = 0; i < this.plansForAdd.length; i++) {
        if (this.plansForAdd[i].equip_.id === this.equipIdForAdd) { return i }
      }
      return -1
    },
    productBatchingChanged(planForAdd) {
      planForAdd['batching_weight'] = this.productBatchingById[planForAdd.product_batching].batching_weight
      planForAdd['production_time_interval'] = this.productBatchingById[planForAdd.product_batching].production_time_interval
      for (var i = 0; i < 3; i++) {
        this.planTrainsChanged(planForAdd, i, false)
      }
      this.statistic()
    },
    planTrainsChanged(planForAdd, columnIndex, sum = true) {
      if (!planForAdd['pdp_product_classes_plan'][columnIndex].enable) { return }

      planForAdd['pdp_product_classes_plan'][columnIndex]['time'] =
        (planForAdd['production_time_interval'] *
          planForAdd['pdp_product_classes_plan'][columnIndex]['plan_trains']).toFixed(2)

      planForAdd['pdp_product_classes_plan'][columnIndex]['weight'] =
        (planForAdd['batching_weight'] *
          planForAdd['pdp_product_classes_plan'][columnIndex]['plan_trains']).toFixed(2)
      if (sum) { this.statistic() }
    },
    async statistic() {
      var plansByEquip = {}
      var planSumByEquipId = {}
      this.plansForAdd.forEach(function(plan) {
        if (!plan.sum) {
          if (!plansByEquip[plan.equip]) {
            plansByEquip[plan.equip] = []
          }
          plansByEquip[plan.equip].push(plan)
        } else {
          planSumByEquipId[plan.equip] = plan
        }
      })
      for (var equipId in plansByEquip) {
        var plans = plansByEquip[equipId]
        var batching_weight = 0
        var production_time_interval = 0
        var pdp_product_classes_plan = []
        for (var j = 0; j < 3; j++) {
          pdp_product_classes_plan.push({
            plan_trains: 0,
            weight: 0,
            time: 0
          })
        }
        var app = this
        for (var k = 0; k < plans.length; k++) {
          var plan = plans[k]
          const res = await planScheduleUrl('get', plan.plan_schedule)
          const planSchedule = res
          batching_weight += Number(plan.batching_weight)
          production_time_interval += Number(plan.production_time_interval)
          for (var i = 0; i < 3; i++) {
            var class_plan = plan.pdp_product_classes_plan[i]
            pdp_product_classes_plan[i].plan_trains += Number(class_plan.plan_trains)
            pdp_product_classes_plan[i].weight += Number(class_plan.weight)
            pdp_product_classes_plan[i].time += Number(class_plan.time)
            var workSchedulePlanTimeSpan =
              dayjs(planSchedule.work_schedule_plan[i].end_time).diff(
                dayjs(planSchedule.work_schedule_plan[i].start_time), 'minute')
            if (pdp_product_classes_plan[i].time > workSchedulePlanTimeSpan) {
              app.$alert('机台' + plan.equip_.equip_no +
                planSchedule.work_schedule_plan[i].classes_name +
                '计划时间大于排班时间' + '(计划时间' + pdp_product_classes_plan[i].time + '分钟' +
                ' 排班时间' + workSchedulePlanTimeSpan + '分钟' +
                ')', '警告', {
                confirmButtonText: '确定'
              })
            }
          }
        }
        // for (i = 0; i < 3; i++) {
        //
        //     pdp_product_classes_plan[i].weight = pdp_product_classes_plan[i].weight.toFixed(2);
        //     pdp_product_classes_plan[i].time = pdp_product_classes_plan[i].time.toFixed(2);
        // }

        batching_weight = batching_weight.toFixed(3)
        production_time_interval = production_time_interval.toFixed(2)
        // eslint-disable-next-line no-unused-vars
        var equip = this.equipById[equipId]
        planSumByEquipId[equipId].batching_weight = batching_weight
        planSumByEquipId[equipId].production_time_interval = production_time_interval
        planSumByEquipId[equipId].pdp_product_classes_plan = pdp_product_classes_plan
      }
    },
    batchSave() {
      var app = this
      var plansForAdd_ = []
      this.plansForAdd.forEach(function(plan) {
        if (!plan.sum) {
          var plan_ = JSON.parse(JSON.stringify(plan))
          plan_.pdp_product_classes_plan = []
          for (var i = 0; i < plan.pdp_product_classes_plan.length; i++) {
            if (plan.pdp_product_classes_plan[i].enable) {
              plan_.pdp_product_classes_plan.push(plan.pdp_product_classes_plan[i])
            }
          }
          plansForAdd_.push(plan_)
        }
      })
      if (!plansForAdd_.length) { return }

      productDayPlanManyCreateUrl('post', null, { data: plansForAdd_ })
        .then(function(response) {
          app.addPlanVisible = false
          app.$message('创建成功')
          app.getList()
        }).catch(function(error) {
          error.forEach(function(err) {
            if (err['pdp_product_classes_plan']) {
              for (var i = 0; i < err['pdp_product_classes_plan'].length; i++) {
                if (err['pdp_product_classes_plan'][i].weight) {
                  app.$alert(err['pdp_product_classes_plan'][i].weight.join(','), '错误', {
                    confirmButtonText: '确定'
                  })
                }
              }
            }
            if (err['product_batching']) {
              app.$alert('胶料配方编码是必填项。', '错误', {
                confirmButtonText: '确定'
              })
            }
          })
        })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    },
    sendToAu(plan) {
      var app = this
      productDayPlanNoticeUrl('post', plan.id).then(function(response) {
        app.$message('发送成功')
      }).catch(function() {
      })
      console.log(plan)
    },
    showAddPlansDialog() {
      this.plansForAdd = []
      this.addPlanVisible = true
    },
    setTimeStamp() {
      const arr = []
      this.selectDateArr.forEach((D, index) => {
        const startD = D.split(' ')[0]
        arr[index] = (new Date(startD.replace(/-/g, '/'))).getTime()
      })
      return arr
    },
    _setDateModel(date, bool) {
      const currentDate = this.setDate(date, bool)
      const currentStamp = (new Date(currentDate.replace(/-/g, '/'))).getTime()
      const boolVal = this.selectDateArr.findIndex(D => D === currentStamp)
      return boolVal > -1
    },
    setDate(_data, bool) {
      const date = _data ? new Date(_data) : new Date()
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      if (bool) {
        return formatObj.y + '-' + formatObj.m + '-' + formatObj.d + ' ' +
          formatObj.h + ':' + formatObj.i + ':' + formatObj.s
      } else {
        return formatObj.y + '-' + formatObj.m + '-' + formatObj.d
      }
    }
  }

}
</script>

<style>

</style>
