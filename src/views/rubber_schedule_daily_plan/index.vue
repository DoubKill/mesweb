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
    class="dialogPlanAddIndex"
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
        <span
          v-if="item.checkbox"
          style="position:absolute;top:0;left:0;width:100%;height:100%;background:transparent;z-index:5"
          @click="changeEquip(false,item)"
        />
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
          @focus="focusDatePicker"
        />
        倒班规则：<el-select
          v-model="planScheduleId"
          filterable
          placeholder="倒班规则"
          @change="addOnePlan"
          @focus="focusDatePicker"
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
            <el-button
              v-if="permissionArr.indexOf('add')>-1"
              class="tableTopright"
              @click="singleSavePlan(index,item)"
            >保 存</el-button>
          </div>
          <div
            v-for="(tableItem,i) in item"
            :key="i"
            style="margin-bottom:10px;margin-right:20px"
          >
            <el-table
              :key="i"
              :data="tableItem"
              :span-method="objectSpanMethod"
              border
              width="100%"
              :row-class-name="tableRowClassName"
            >
              >
              <el-table-column min-width="60px">
                <template slot-scope="scope">
                  <div style="font-weight:700;color:#000 !important">
                    {{ scope.row.classes_name }}
                    <!-- {{ scope.row.start_time }} -- {{ scope.row.end_time }} -->
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column
                label="顺序"
                width="60px"
              >
                <template slot-scope="scope">
                  {{ scope.$index+1 }}
                </template>
              </el-table-column> -->
              <el-table-column
                min-width="180px"
                label="胶料编码"
              >
                <template slot-scope="scope">
                  <span v-if="Number(scope.row.batching_type) === _batching_type_one">{{ scope.row.product_no }}</span>
                  <el-select
                    v-else
                    v-model="scope.row.product_batching"
                    :loading="loadingSelect"
                    :disabled="setStatus(scope.row.status,scope.row,false)"
                    @change="productBatchingChanged($event,scope.row,rubberMateriaObj[scope.row.equip],tableItem,scope.$index)"
                  >
                    <el-option
                      v-for="productBatching in rubberMateriaObj[scope.row.equip]"
                      :key="productBatching.id"
                      :label="productBatching.stage_product_batch_no"
                      :value="productBatching.id"
                      :disabled="productBatching.disabled"
                    >
                      <span style="float: left">{{ productBatching.stage_product_batch_no }}</span>
                      <span
                        v-if="productBatching.disabled"
                        style="float: right;color: #8492a6; font-size: 13px;margin-left:50px"
                      >已废弃</span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="车次"
                min-width="80px"
              >
                <template slot-scope="scope">
                  <el-input-number
                    v-model.number="scope.row.plan_trains"
                    :precision="0"
                    size="small"
                    :min="0"
                    :disabled="setStatus(scope.row.status,scope.row,false)"
                    @change="planTrainsChangedWh(scope.row,scope.$index,tableItem)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                min-width="80"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.note"
                    :disabled="setStatus(scope.row.status,scope.row,false)"
                    placeholder="请输入内容"
                  />
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
                  {{ Number(scope.row.time) || '0' }}
                </template>
              </el-table-column>
              <el-table-column
                width="80px"
                label="操作"
                fixed="right"
              >
                <template
                  v-if="scope.$index!==tableItem.length-1"
                  slot-scope="scope"
                >
                  <el-button
                    size="mini"
                    type="danger"
                    :disabled="setStatus(scope.row.status,scope.row,true)"
                    @click="handleGroupDelete(scope.$index,tableItem,scope.row)"
                  >删除
                  </el-button>
                  <br>
                  <!-- <el-button
                    style="margin-top:5px"
                    size="mini"
                    type="primary"
                    :disabled="setDisabledFun(scope.$index,scope.row,tableItem,true)"
                    @click="moveUp(scope.$index,scope.row,tableItem)"
                  >上移
                  </el-button> -->
                  <!-- <el-button
                    style="margin-top:5px"
                    size="mini"
                    :disabled="setDisabledFun(scope.$index,scope.row,tableItem,false)"
                    @click="moveDown(scope.$index,scope.row,tableItem)"
                  >下移
                  </el-button> -->
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
  productClassesPlanPanycreateUrl
} from '@/api/base_w'
// import { textData } from './textData'
import { setDate } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    this._notSaved = '未保存'
    this._saved = '已保存'
    this._wait = '等待'
    // 1表示机台  2表示机型(mes)
    this._batching_type_one = 1
    this._batching_type_tow = 2
    return {
      equipIdForAdd: null,
      equips: [],
      // equipById: {},
      day_time: setDate(),
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
  },
  methods: {
    setStatus(status, row, bool) {
      // 控制结束的班次不可下达
      const a = new Date(row.end_time).getTime()
      const b = new Date().getTime()
      if (a <= b) {
        // 小于当前时间 除去当天
        return true
      }
      if (Number(row.batching_type) === this._batching_type_one) {
        return true
      }
      // 可以操作
      const c = bool ? true : status !== this._wait
      return status !== this._notSaved &&
        status !== this._saved && c
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
                // start_time: this.setstartT(data.start_time),
                // end_time: this.setstartT(data.end_time),
                start_time: data.start_time,
                end_time: data.end_time,
                equip: row.id,
                equipNo: row.equip_no,
                towIndex: index,
                oneIndex: this.addPlanArr.length,
                plan_trains: data.plan_trains,
                product_batching: data.product_batching,
                product_no: data.product_no,
                batching_type: data.batching_type,
                status: data.status,
                note: data.note,
                time: data.time,
                plan_classes_uid: data.plan_classes_uid,
                unit: '吨',
                weight: data.weight
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
            oneIndex: this.addPlanArr.length,
            plan_trains: 0,
            product_batching: '',
            product_no: '',
            batching_type: this._batching_type_tow,
            status: this._notSaved,
            note: '',
            time: '',
            plan_classes_uid: setPlanClassesUid(index + 1, row.equip_no),
            unit: '吨',
            weight: 0
          }]
        } else {
          const arrData = arr[index][0]
          arr[index].push({
            work_schedule_plan: arrData.work_schedule_plan,
            classes_name: arrData.classes_name,
            start_time: arrData.start_time,
            end_time: arrData.end_time,
            plan_trains: 0,
            product_batching: '',
            product_no: '',
            batching_type: this._batching_type_tow,
            status: this._notSaved,
            note: '',
            time: '',
            unit: '吨',
            towIndex: index,
            plan_classes_uid: setPlanClassesUid(index + 1, row.equip_no),
            oneIndex: this.addPlanArr.length,
            equip: row.id,
            equipNo: row.equip_no,
            weight: 0
          })
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
    async getRubberMateria(equip, category, work_schedule) {
      const obj = {
        all: 1
        // used_type: 4
      }
      if (category) {
        Object.assign(obj, { dev_type: category })
      }
      try {
        const rubberMateriaData = await rubberMaterialUrl('get', null, { params: obj })
        if (equip) {
          const arr = rubberMateriaData.results
          const filterArr = arr.filter(D => D.used_type === 6 || D.used_type === 4)
          const newArr = []

          filterArr.forEach((D, i) => {
            if (D.used_type === 6) {
              D['disabled'] = true
              newArr.push(D)
            } else {
              newArr.unshift(D)
            }
          })
          this.$set(this.rubberMateriaObj, equip, newArr)
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
        }
        // eslint-disable-next-line no-empty
      } catch (e) { }
    },
    clearAddPlanArr() {
      if (this.addPlanArr.length > 0) {
        this.checkAll = false
        this.addPlanArr = []
        this.equips.forEach(D => {
          D.checkbox = false
        })
      }
    },
    focusDatePicker() {
      if (this.addPlanArr.length === []) {
        return
      }
      const addPlanArr = JSON.parse(JSON.stringify(this.addPlanArr))
      const arrSave = []
      addPlanArr.forEach((data, index) => {
        data.forEach(D => {
          D.forEach(dataChild => {
            if (!dataChild.product_batching) return
            arrSave.push(dataChild)
          })
        })
      })
      try {
        arrSave.forEach(saveD => {
          if (saveD.status === this._notSaved) {
            this.$message({
              message: saveD.equipNo + '机台未保存,切换会消失',
              offset: 50,
              type: 'warning'
            })
            throw new Error('停止')
          }
        })
        // eslint-disable-next-line no-empty
      } catch (e) { }
    },
    batchSaveAll() {
      // 保存全部
    },
    async changeEquip(val, row) {
      const newAddPlanArr = []
      if (val) {
        let work_schedule = []
        work_schedule = await this.getInfoFun(row)
        this.visibleChange(row.id, row.category, work_schedule)
        this.addPlanArr.push(work_schedule)
      } else {
        const addPlanArr = JSON.parse(JSON.stringify(this.addPlanArr))
        const arrSave = []
        addPlanArr.forEach((data, index) => {
          if (data[0][0].equip === row.id) {
            addPlanArr[index].forEach(dataChild => {
              dataChild.forEach(D => {
                if (!D.product_batching) return
                arrSave.push(D)
              })
            })
          } else {
            newAddPlanArr.push(data)
          }
        })
        let boolSave = true
        arrSave.forEach(saveD => {
          if (saveD.status === this._notSaved) {
            boolSave = false
            return
          }
        })
        if (!boolSave) {
          this.$confirm(
            row.equip_no + '机台未保存，是否继续操作？',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            this.addPlanArr = addPlanArr.filter(D => D[0][0].equip !== row.id)
            row.checkbox = false
          })
          return
        }
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
    async singleSavePlan(index, item) {
      // 控制结束的班次不可下达
      const day_time = this.day_time + ' 23:59:59'
      const a = new Date(day_time).getTime()
      const b = new Date().getTime()
      if (a <= b) {
        // 小于当前时间 除去当天
        this.$message.info('操作不了当前班次之前的计划')
        return true
      }
      try {
        const addPlanArr = JSON.parse(JSON.stringify(this.addPlanArr[index]))
        let addPlanObj = []
        let boolStr = false

        addPlanArr.forEach(data => {
          data.forEach((child, i) => {
            if (!child.product_batching) {
              return
            } else {
              if (child.product_batching && !child.plan_trains) {
                boolStr = child.equipNo + child.classes_name + '第' + (i + 1) + '条'
                this.$message({
                  message: boolStr + ' ' + '车次必填',
                  offset: 50,
                  type: 'warning'
                })
                throw new Error('停止')
              }
            }
            child.sn = i + 1
            addPlanObj.push(child)
          })
        })
        if (boolStr) {
          return
        } else if (addPlanObj.length === 0) {
          addPlanObj = {
            equip: item[0][0].equip,
            work_schedule_plan: item[0][0].work_schedule_plan
          }
        }
        // console.log(JSON.stringify(addPlanObj), 7777)
        // return
        this.loading = true
        const data = await productClassesPlanPanycreateUrl('post', null, { data: addPlanObj })
        this.loading = false
        this.$message.success(data)

        // console.log(this.addPlanArr, 8888)
        // 保存成功后把新建未保存的 全部换成新建已经保存
        this.addPlanArr.forEach(D => {
          D.forEach(data => {
            data.forEach(childData => {
              if (childData.product_batching && childData.status === this._notSaved) {
                childData.status = this._saved
              }
            })
          })
        })

        // eslint-disable-next-line no-empty
      } catch (e) {
        this.loading = false
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
    visibleChange(equip, category, work_schedule) {
      if (this.rubberMateriaObj[equip]) return
      this.loadingSelect = true
      this.getRubberMateria(equip, category, work_schedule)
    },
    productBatchingChanged(val, planForAdd, arr, tableItem, currentIndex) {
      let obj = []
      obj = (arr.filter(D => D.id === val))[0]
      const plan_trains = Number(planForAdd.plan_trains) || 1
      const batching_weight = Number(obj.batching_weight)
      const production_time_interval = Number(obj.production_time_interval)

      planForAdd['weight'] = (batching_weight * 1000) * plan_trains / 1000
      planForAdd['unit'] = '吨'
      planForAdd['time'] = (production_time_interval * 1000) * plan_trains / 1000
      if (planForAdd['weight'] > 100000) {
        this.$message('车次过大')
        this.$nextTick(() => {
          planForAdd.plan_trains = 1
        })
        planForAdd['weight'] = (batching_weight * 1000) * 1 / 1000
        planForAdd['time'] = (production_time_interval * 1000) * 1 / 1000
      }

      if (tableItem.length - 1 === currentIndex && planForAdd.product_batching) {
        // 处于最后一行
        const baseData = JSON.parse(JSON.stringify(planForAdd))
        baseData.product_batching = ''
        baseData.time = 0
        baseData.weight = 0
        baseData.note = ''
        baseData.status = this._notSaved
        baseData.plan_trains = 0
        baseData.plan_classes_uid = setPlanClassesUid(currentIndex + 2, planForAdd.equipNo)
        tableItem.push(baseData)
      }
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
        }
        // eslint-disable-next-line no-empty
      } catch (e) {
      }
    },
    planTrainsChangedWh(row, index, tableItem) {
      if (!row.batching_weight) {
        const obj = this.rubberMateriaObj[row.equip].filter(D =>
          D.id === row.product_batching
        )
        row.batching_weight = obj[0] ? obj[0].batching_weight : 0
        row.production_time_interval = obj[0] ? obj[0].production_time_interval : 0
      }

      const plan_trains = Number(row.plan_trains)
      const batching_weight = Number(row.batching_weight)
      const production_time_interval = Number(row.production_time_interval || 0)
      row['time'] = (production_time_interval * 1000) * plan_trains / 1000
      row['weight'] = (batching_weight * 1000) * plan_trains / 1000
      if (row['weight'] > 100000) {
        this.$message('车次过大')
        this.$nextTick(() => {
          tableItem[index].plan_trains = 1
        })
        row['weight'] = (batching_weight * 1000) * 1 / 1000
        row['time'] = (production_time_interval * 1000) * 1 / 1000
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
          this.visibleChange(D.id, D.category)
          this.addPlanArr.push(setWorkSchedule)
        } else {
          D.checkbox = false
          this.addPlanArr = []
        }
      })
    },
    handleGroupDelete(index, tableItem, row) {
      if (tableItem.length === 1) {
        this.$message.warning('最少保留一行')
        return
      }
      this.$confirm(
        '是否删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        tableItem.splice(index, 1)
      })
    },
    moveUp(index, row, tableItem) {
      if (index === 0) {
        this.$message({
          message: '处于顶端，不能继续上移',
          type: 'warning'
        })
      } else {
        const upDate = tableItem[index - 1]
        tableItem.splice(index - 1, 1)
        tableItem.splice(index, 0, upDate)
      }
    },
    moveDown(index, row, tableItem) {
      var that = this
      if (index + 1 === tableItem.length) {
        that.$message({
          message: '处于末端，不能继续下移',
          type: 'warning'
        })
      } else {
        const downDate = tableItem[index + 1]
        tableItem.splice(index + 1, 1)
        tableItem.splice(index, 0, downDate)
      }
    },
    setDisabledFun(index, row, tableItem, bool) {
      const notSaved = this._notSaved
      const wait = this._wait
      const saved = this._saved
      if (row.status === notSaved || row.status === wait || row.status === saved) {
        if (index === tableItem.length - 2 && bool) {
          return false
        }
        if (index === tableItem.length - 1) {
          return true
        }
        if (tableItem[index - 1]) {
          // 上一个
          if (tableItem[index - 1].status !== notSaved && tableItem[index - 1].status !== wait && tableItem[index - 1].status !== saved) {
            return true
          }
          if (!tableItem[index - 1].product_batching) {
            // 上一个没有选择胶料不让移动
            return true
          }
        }
        if (tableItem[index + 1]) {
          // 下一个
          if (tableItem[index + 1].status !== notSaved && tableItem[index + 1].status !== wait && tableItem[index + 1].status !== saved) {
            return true
          }
          if (!tableItem[index + 1].product_batching) {
            // 下一个没有选择胶料不让移动
            return true
          }
        }
        return false
      } else {
        return true
      }
    },
    setTrainTotal(tableItem) {
      let Total = 0
      tableItem.forEach(D => {
        Total += Number(D.plan_trains)
      })
      return Total
    }
  }
}

function setPlanClassesUid(index, equip_no) {
  return setDate(null, false, 'continuation') + zeroFilling(index) + equip_no
}
function zeroFilling(n) {
  n = Number(n)
  if (n > 99) {
    return 1
  }
  return n < 10 ? '0' + n : n
}
</script>
<style lang="scss">
  .dialogPlanAddIndex{
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
        color:#fff;
        line-height: 40px;
        background: #0bbd0b;
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
