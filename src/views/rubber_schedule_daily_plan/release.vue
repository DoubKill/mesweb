<template>
  <!-- <el-dialog
    style="min-width:1200px"
    width="90%"
    :visible.sync="addPlanVisible"
    :before-close="handleClose"
    title="添加计划"
  > -->
  <div
    v-loading="loading"
    class="dialogPlanAdd"
  >
    <div class="leftEquip">
      <!-- <el-checkbox-group v-for="item in equips" :key="item.id" v-model="equipIdForAdd"> -->
      <el-checkbox
        v-model="checkAll"
        :disabled="disabledEquip"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
      <div
        v-for="item in equips"
        :key="item.id"
        style="position:relative"
      >
        <el-checkbox
          v-model="item.checkbox"
          :label="item.id"
          :disabled="disabledEquip"
          @change="changeEquip($event,item)"
          @click.native="clickEquip"
        >
          {{ item.equip_no }}
        </el-checkbox>
      </div>
      <!-- </el-checkbox-group> -->
    </div>
    <div class="rightContent">
      <div>
        日期：
        <el-date-picker
          v-model="day_time"
          style="margin-right: 10px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :clearable="false"
          @change="getPlanSchedules"
        />
        倒班规则：<el-select
          v-model="planScheduleId"
          filterable
          placeholder="倒班规则"
          @change="addOnePlan"
        >
          <el-option
            v-for="planSchedule in planSchedules"
            :key="planSchedule.id"
            :label="planSchedule.work_schedule__schedule_name"
            :value="planSchedule.id"
          />
        </el-select>
      </div>

      <div
        v-loading="addPlanArrLoading"
        element-loading-text="拼命加载中"
        class="setFlex"
      >
        <div
          v-for="(item,index) in addPlanArr"
          :key="index"
          class="addPlanArrBox"
        >
          <div class="tableTop">
            <div class="tableTopLeft">{{ item[0][0]?item[0][0].equipNo:'--' }}</div>
          </div>
          <div
            v-for="(tableItem,i) in item"
            :key="i"
            style="margin-bottom:10px;margin-right:20px"
          >
            <el-table
              :data="tableItem"
              :span-method="objectSpanMethod"
              border
              width="100%"
              :row-class-name="tableRowClassName"
            >
              >
              <el-table-column min-width="90px">
                <template
                  slot="header"
                  slot-scope="scope"
                >
                  <el-button
                    v-if="permissionArr.indexOf('send')>-1"
                    :disabled="releaseDisabled"
                    type="primary"
                    size="mini"
                    class="tableTopright"
                    @click="releasePlan(scope.$index,tableItem,index,i)"
                  >下 达</el-button>
                </template>
                <template slot-scope="scope">
                  <div style="font-weight:700;color:#000 !important">
                    {{ scope.row.classes_name }}
                    <!-- {{ scope.row.start_time }} -- {{ scope.row.end_time }} -->
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                min-width="150px"
                label="胶料编码"
              >
                <template slot-scope="scope">
                  {{ scope.row.product_no?scope.row.product_no:'暂无数据' }}
                </template>
              </el-table-column>
              <el-table-column
                label="车次"
                min-width="80px"
              >
                <template slot-scope="scope">
                  {{ scope.row.plan_trains }}
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                min-width="80"
              >
                <template slot-scope="scope">
                  {{ scope.row.note }}
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                min-width="80"
              >
                <template slot-scope="scope">
                  {{ scope.row.status }}
                </template>
              </el-table-column>
              <el-table-column label="炼胶时间">
                <template slot-scope="scope">
                  {{ Number(scope.row.time) || '' }}
                </template>
              </el-table-column>
            </el-table>
            <div class="total_style">合计：车次-{{ setTrainTotal(tableItem) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </el-dialog> -->
</template>

<script>
import {
  equipUrl,
  rubberMaterialUrl,
  workSchedulesUrl,
  planScheduleUrl,
  productClassesPlanUrl,
  productDayPlanNotice
} from '@/api/base_w'
// import { textData } from './textData'
import { setDate } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    this._notSaved = '未保存'
    this._saved = '已保存'
    this._wait = '等待'
    return {
      equipIdForAdd: null,
      equips: [],
      // equipById: {},
      day_time: '',
      planScheduleId: null,
      planSchedules: [],
      workSchedules: [],
      plansForAdd: [],
      productBatchingById: {},
      addPlanArr: [],
      // 排班列表
      work_schedule_plan: [],
      // 控制机台是否可选
      disabledEquip: true,
      // 胶料数据
      rubberMateriaObj: {},
      loadingSelect: true,
      baseDefaultData: {},
      loading: false,
      addPlanArrLoading: false,
      releaseDisabled: false,
      checkAll: false
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionArr = this.permission.productdayplan
    this.getEquipList()
    this.getWorkSchedules()

    this.day_time = setDate(null, false)
    this.getPlanSchedules()
  },
  methods: {
    setStatus(status) {
      // 可以操作
      return status !== this._notSaved &&
        status !== this._saved && status !== this._wait
    },
    async getInfoFun(row, bool) {
      try {
        this.addPlanArrLoading = true
        const obj = {
          day_time: this.day_time,
          schedule_name: this.planScheduleId,
          equip_no: row.equip_no
        }
        if (bool) {
          delete obj.equip_no
        }
        const data = await productClassesPlanUrl('get', null, { params: obj })
        // const getInfo = textData
        const getInfo = data.results || []
        this.addPlanArrLoading = false

        if (bool) {
          // 总的计划
          return getInfo
        }
        return this.setWorkSchedule(row, getInfo)
      } catch (e) {
        this.addPlanArrLoading = false
        if (bool) {
          // 总的计划
          return []
        }
        return this.setWorkSchedule(row, [])
      }
    },
    setWorkSchedule(row, getInfo) {
      const work_schedule_plan = JSON.parse(JSON.stringify(this.work_schedule_plan))
      const arr = []
      work_schedule_plan.forEach((D, index) => {
        this.$set(arr, index, [])
        if (getInfo.length > 0) {
          getInfo.forEach(data => {
            if (data.work_schedule_plan === D.id) {
              arr[index].push({
                work_schedule_plan: data.work_schedule_plan,
                classes_name: data.classes_name,
                start_time: data.start_time,
                end_time: data.end_time,
                // start_time: this.setstartT(data.start_time),
                // end_time: this.setstartT(data.end_time),
                equip: row.id,
                equipNo: row.equip_no,
                towIndex: index,
                oneIndex: this.addPlanArr.length,
                plan_trains: data.plan_trains,
                product_batching: data.product_batching,
                status: data.status,
                note: data.note,
                time: data.time,
                plan_classes_uid: data.plan_classes_uid,
                unit: '吨',
                weight: data.weight,
                product_no: data.product_no
              })
            }
          })
        }
        if (arr[index].length === 0) {
          const newArr = work_schedule_plan[index]
          arr[index] = [{
            work_schedule_plan: newArr.id,
            classes_name: newArr.classes_name,
            start_time: newArr.start_time,
            end_time: newArr.end_time,
            equip: row.id,
            equipNo: row.equip_no,
            towIndex: index,
            oneIndex: this.addPlanArr.length
          }]
        }
      })
      return arr
    },
    async getEquipList() {
      try {
        // eslint-disable-next-line object-curly-spacing
        const equipData = await equipUrl('get', { params: { all: 1, category_name: '密炼设备' } })
        this.equips = equipData.results
        // eslint-disable-next-line no-empty
      } catch (e) { }
    },
    async getRubberMateria(equip, category) {
      const obj = {
        all: 1,
        used_type: 4
      }
      if (category) {
        Object.assign(obj, { dev_type: category })
      }
      try {
        const rubberMateriaData = await rubberMaterialUrl('get', null, { params: obj })
        if (equip) {
          this.$set(this.rubberMateriaObj, equip, rubberMateriaData.results)
          this.loadingSelect = false
        }
      } catch (e) {
        this.loadingSelect = false
      }
    },
    async getWorkSchedules() {
      try {
        // eslint-disable-next-line object-curly-spacing
        const workSchedulesData = await workSchedulesUrl('get', null, { params: { all: 1 } })
        this.workSchedules = workSchedulesData.results
        // eslint-disable-next-line no-empty
      } catch (e) { }
    },
    async getPlanSchedules() {
      try {
        // 切换日期清空下面列表
        this.clearAddPlanArr()
        this.disabledEquip = true
        this.planSchedules = []
        this.planScheduleId = null

        if (this.day_time) {
          const planSchedulesData = await planScheduleUrl('get', null, {
            params: {
              all: 1,
              day_time: this.day_time
            }
          })
          this.planSchedules = planSchedulesData.results
          this.planScheduleId = this.planSchedules.length > 0 ? this.planSchedules[0].id : ''
          if (this.planScheduleId) {
            this.addOnePlan()
          }
        }
        // eslint-disable-next-line no-empty
      } catch (e) { }
    },
    clearAddPlanArr() {
      if (this.addPlanArr.length > 0) {
        this.addPlanArr = []
        this.checkAll = false
        this.equips.forEach(D => {
          D.checkbox = false
        })
      }
    },
    async changeEquip(val, row) {
      const newAddPlanArr = []
      if (val) {
        let work_schedule = []
        work_schedule = await this.getInfoFun(row)
        this.addPlanArr.push(work_schedule)
      } else {
        const addPlanArr = JSON.parse(JSON.stringify(this.addPlanArr))
        addPlanArr.forEach((data, index) => {
          if (data[0][0].equip !== row.id) {
            newAddPlanArr.push(data)
          }
        })
        row.checkbox = false
        newAddPlanArr.forEach((D, i) => {
          D.forEach(data => {
            data.forEach(childData => {
              childData.oneIndex = i
            })
          })
        })
        this.addPlanArr = newAddPlanArr
      }
    },
    setstartT(time) {
      if (!time) return ''
      return time.split(' ')[1]
    },
    clickEquip() {
      if (this.disabledEquip) {
        this.$message.info('请先选择时间和倒班规则')
      }
    },
    async releasePlan(index, tableItem, oneIndex, towIndex) {
      const newTableItem = this.addPlanArr[oneIndex][towIndex]

      // 控制结束的班次不可下达
      const a = new Date(newTableItem[0].end_time).getTime()
      const b = new Date().getTime()
      if (a <= b) {
        // 小于当前时间 除去当天
        // this.$message.info('不可下达结束班次的计划！')
        // return
      }

      const bool = newTableItem.some(D => (D.status === '已保存' || D.status === '等待'))
      if (!bool) {
        this.$message.info('暂无可下达的计划！')
        return
      }
      try {
        this.releaseDisabled = true
        const data = await productDayPlanNotice('post', null, {
          data: {
            equip: tableItem[index].equip,
            work_schedule_plan: tableItem[index].work_schedule_plan
          }
        })
        this.$message.success(data)
        this.addPlanArr[oneIndex][towIndex].forEach(D => {
          if (D.status === this._saved) {
            D.status = '等待'
          }
        })
        this.releaseDisabled = false
        // eslint-disable-next-line no-empty
      } catch (e) {
        this.releaseDisabled = false
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.addPlanArr[row.oneIndex] || !this.addPlanArr[row.oneIndex][row.towIndex]) return
      const allLength = this.addPlanArr[row.oneIndex][row.towIndex].length
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: allLength,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      switch (row.status) {
        case '等待':
          return 'wait-row'
        case '已保存':
          return 'saved-row'
        case '已下达':
          return 'issued-row'
        case '运行中':
          return 'operation-row'
        case '完成':
          return 'complete-row'
        default:
          return ''
      }
    },
    setTrainTotal(tableItem) {
      let Total = 0
      tableItem.forEach(D => {
        Total += Number(D.plan_trains)
      })
      return Total || 0
    },
    async addOnePlan() {
      // 获取排班
      try {
        // 切换日期清空下面列表
        this.clearAddPlanArr()

        const planSchedule = await planScheduleUrl('get', this.planScheduleId)
        if (!planSchedule || !planSchedule.work_schedule_plan.length) {
          this.$alert(planSchedule.work_schedule_name + '无排班', '错误', {
            confirmButtonText: '确定'
          })
        } else {
          this.work_schedule_plan = planSchedule.work_schedule_plan || []
          this.disabledEquip = false

          if (this.day_time === setDate(null, false)) {
            // 切换的日期等于当前时间默认6号机台
            const arr = this.equips.filter(D => {
              if (Number(D.id) === 6) {
                D.checkbox = true
              }
              return Number(D.id) === 6
            })
            this.changeEquip(true, arr[0])
          }
        }
        // eslint-disable-next-line no-empty
      } catch (e) {
      }
    },
    async handleCheckAllChange(val) {
      let work_schedule = []
      if (val) {
        work_schedule = await this.getInfoFun({}, true)
        this.addPlanArr = []
      }

      this.equips.forEach(D => {
        if (val) {
          let getInfo = []
          D.checkbox = true
          getInfo = work_schedule.filter(data => data.equip === D.id)
          const setWorkSchedule = this.setWorkSchedule(D, getInfo)
          this.addPlanArr.push(setWorkSchedule)
        } else {
          D.checkbox = false
          this.addPlanArr = []
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .dialogPlanAdd{
    display: flex;
    min-width: 800px;
    .el-input-number__decrease,
    .el-input-number__increase{
      display: none;
    }
    .el-input-number--small{
      width:50px;
    }
    .el-button+.el-button{
      margin-left: 0px;
    }
    .el-input-number--small .el-input__inner{
      padding-left: 0;
      padding-right: 0;
    }
    .leftEquip{
      margin-top:70px;
      margin-right:20px;
      .el-checkbox{
        display: block;
        padding: 0 0 10px 0;
      }
    }
    .rightContent{
      flex:1
    }
    .tableTop{
      display: flex;
      align-items: center;
          border: 1px solid #EBEEF5;
          border-bottom: none;
          margin-top:30px;
          margin-right:20px;
      .tableTopLeft{
        flex:1;
        text-align: center;
        line-height: 40px;
        background: #0bbd0b;
        color:#fff;
      }
    }
    .addPlanArrBox{
      width:48%;
      .el-table td, .el-table th{
        padding: 5px 0;
      }
    }
    .setFlex{
      display: flex;
      flex-wrap:wrap;
      min-height: 100px;
    }
    .total_style{
      width:100%;
      background-color: #F5F7FA;
      color: #606266;
      padding: 5px 0;
      font-size: 14px;
      padding-left:12px;
      line-height:23px;
      border: 1px solid #EBEEF5;
    }
    .wait-row{
       color: rgb(209, 206, 37) !important;
    }
    .saved-row{
       color: rgb(236,128,141) !important;
    }
    .issued-row{
       color: rgb(2 ,167 ,240) !important;
    }
    .operation-row{
       color: rgb(83, 131, 11) !important;
    }
    .complete-row{
       color: rgb(132,0,255) !important;
    }
  }
</style>
