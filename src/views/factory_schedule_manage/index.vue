<template>
  <div>
    <el-row>
      <el-col :span="14">
        <el-card shadow="never">
          <el-calendar
            v-model="calendarValue"
            :v-loading="trueCalendar"
          >
            <template
              slot="dateCell"
              slot-scope="{date, data}"
            >
              <p
                class="[data.isSelected||_setDateModel(date,false)?'is-selected':'']"
                :style="{color:_setDateModel(date,false)?'#67C23A':data.isSelected?'#409EFF':''}"
              >
                {{ data.day.split('-').slice(1).join('-') }} {{ _setDateModel(date,false) ? '✔️' : '' }}
              </p>
            </template>
          </el-calendar>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never">
          <el-form :label-width="formLabelWidth">
            <el-form-item>
              <el-button
                style="float: right"
                @click="generateScheduling"
              >生成</el-button>
            </el-form-item>
            <el-form-item
              label="开始时间"
              :label-width="formLabelWidth"
            >
              <el-date-picker
                v-model="startTime"
                style="width: 100%"
                type="date"
                placeholder="选择日期"
                @change="shiftsTimeChange"
              />
            </el-form-item>
            <el-form-item
              label="倒班时间"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="workScheduleIndex"
                style="width: 100%"
                placeholder="请选择"
                @change="shiftsTimeChange"
              >
                <el-option
                  v-for="item in workScheduleOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.schedule_name"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="倒班周期"
              :label-width="formLabelWidth"
            >
              <el-input-number
                v-model.number="changeShiftsPeriod"
                :min="1"
              />
            </el-form-item>
          </el-form>
          <el-table
            :data="classData"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="180"
            />
            <el-table-column
              prop="start_time"
              label="开始"
              width="180"
            />
            <el-table-column
              prop="end_time"
              label="结束"
              width="180"
            />
            <el-table-column
              prop="classes_name"
              label="班次"
              width="180"
            />
            <el-table-column label="班组">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.group"
                  size="mini"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="group in groups"
                    :key="group.id"
                    :label="group.global_name"
                    :value="group.id"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-form>
        <el-form-item>
          <el-button
            style="float: right"
            @click="savePlanSchedules"
          >保存</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="scheduleData"
        style="width: 100%"
      >
        <el-table-column
          prop="production_time"
          label="生产日期"
        />
        <el-table-column
          prop="day_of_the_week"
          label="星期"
        />
        <!-- <template v-for="class_ in classes">
              <th>班组</th>
              <th>休息</th>
              <th>开始</th>
              <th>结束</th>
            </template> -->
        <!-- v-for="(schedule,index) in scheduleData"
            :key="index" -->
        <el-table-column
          v-for="(class_,index) in classes"
          :key="index"
          :label="class_.global_name"
        >
          <el-table-column label="班组">
            <template slot-scope="scope">
              {{ scope.row.group_infos[index] ? scope.row.group_infos[index].group_name : '' }}
            </template>
          </el-table-column>
          <el-table-column label="休息">
            <template slot-scope="scope">
              <el-select v-if="scope.row.group_infos[index]" v-model="scope.row.group_infos[index].is_rest">
                <el-option
                  v-for="item in [{label: '否', value: false}, {label: '是', value: true}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="开始">
            <template slot-scope="scope">
              {{ scope.row.group_infos[index] ? scope.row.group_infos[index].start_time : '' }}
            </template>
          </el-table-column>
          <el-table-column label="结束">
            <template slot-scope="scope">
              {{ scope.row.group_infos[index] ? scope.row.group_infos[index].end_time : '' }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { setDate } from '@/utils/index'
import commonVal from '@/utils/common'
import {
  globalCodesUrl, workSchedulesUrl, planSchedulesUrl,
  planScheduleUrl
} from '@/api/base_w'
export default {
  data() {
    return {
      formLabelWidth: commonVal.formLabelWidth,
      startTime: Date.now(),
      workSchedules: [],
      workScheduleOptions: [],
      workScheduleIndex: null,
      classData: [],
      groups: [],
      groupById: {},
      groupIds: [],

      changeShiftsPeriods: [],
      changeShiftsPeriod: null,
      scheduleData: [],
      classes: [],
      fullscreenLoading: false,
      classesByIndex: {},
      selectDateArr: [],
      calendarValue: '',
      trueCalendar: false
    }
  },
  watch: {
    calendarValue(value) {
      const dateValue = new Date(value)
      const Year = dateValue.getFullYear()
      const Month = dateValue.getMonth() + 1
      if (this.planSchedule.month && this.planSchedule.month !== Month) {
        // 切换月份时
        this.planSchedule = {
          all: 1,
          month: Month,
          year: Year
        }
        this.getFactoryScheduling()
        return
      }
    }
  },
  created: function() {
    this.planSchedule = {
      all: 1,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }
    this.getFactoryScheduling()
    var app = this
    globalCodesUrl('get', {
      params: {
        class_name: '倒班周期'
      }
    }).then(function(response) {
      app.changeShiftsPeriods = response.results
    }).catch(function() {
    })
    globalCodesUrl('get', {
      params: {
        class_name: '班组'
      }
    }).then(function(response) {
      app.groups = response.results
      for (var i = 0; i < app.groups.length; ++i) {
        app.groupById[app.groups[i].id] = app.groups[i].global_name
      }
    }).catch(function() {
    })
    globalCodesUrl('get', {
      params: {
        class_name: '班次'
      }
    }).then(function(response) {
      app.classes = response.results
    }).catch(function() {
    })
    // eslint-disable-next-line object-curly-spacing
    workSchedulesUrl('get', null, { params: { all: 1 } })
      .then(function(response) {
        app.workSchedules = response.results
        for (var i = 0; i < app.workSchedules.length; ++i) {
          app.workSchedules[i]['group'] = ''
          var label = app.workSchedules[i].classesdetail_set.length + '班次'
          for (var j = 0; j < app.workSchedules[i].classesdetail_set.length; ++j) {
            label += '[' + (j + 1) + ']' +
              '-' +
              app.workSchedules[i].classesdetail_set[j].start_time +
              '/' +
              app.workSchedules[i].classesdetail_set[j].end_time
          }
          app.workScheduleOptions.push({
            value: i,
            label,
            schedule_name: app.workSchedules[i].schedule_name
          })
        }
      }).catch(function() {
      })
  },
  methods: {
    setTimeStamp() {
      var arr = []
      arr = JSON.parse(JSON.stringify(this.selectDateArr))
      this.selectDateArr.forEach((D, index) => {
        // const startD = D.split(' ')[0]
        // eslint-disable-next-line no-prototype-builtins
        if (D.hasOwnProperty('day_time') && D.day_time) {
          // eslint-disable-next-line no-prototype-builtins
          var startD = D.hasOwnProperty('day_time') ? D.day_time : ''
          arr[index].day_time = (new Date(startD.replace(/-/g, '/'))).getTime()
        } else {
          arr[index].day_time = ''
        }
      })
      return arr
    },
    _setDateModel(date, bool) {
      const currentDate = setDate(date, bool)
      const currentStamp = (new Date(currentDate.replace(/-/g, '/'))).getTime()
      const boolVal = this.selectDateArr.findIndex(D => D.day_time === currentStamp)
      return boolVal > -1
    },
    dayOfWeek(day) {
      switch (day) {
        case 0:
          return '天'
        case 1:
          return '一'
        case 2:
          return '二'
        case 3:
          return '三'
        case 4:
          return '四'
        case 5:
          return '五'
        case 6:
          return '六'
      }
    },
    generateScheduling() {
      var date = dayjs(this.startTime)
      var workSchedule = this.workSchedules[this.workScheduleIndex]
      var shiftsPeriod = Number(this.changeShiftsPeriod)

      this.scheduleData = []
      // if (!workSchedule) {
      //   return
      // }
      for (var i = 0; i < workSchedule.period * shiftsPeriod; i++) {
        var day = date.get('day')
        var date_str = date.format('YYYY-MM-DD')
        var row = {

          production_time: date_str,
          day_of_the_week: '星期' + this.dayOfWeek(day),
          group_infos: [null, null, null]
        }
        var classes = this.classesByIndex[i % workSchedule.period]
        console.log(classes, 'classes')
        for (var j = 0; j < classes.length; j++) {
          var class_ = JSON.parse(JSON.stringify(classes[j]))
          this.$set(class_, 'is_rest', false)
          if (class_.group) {
            class_.group_name = this.groupById[class_.group]
          } else {
            this.$alert('必须选择所有班组', '错误', {
              confirmButtonText: '确定'
            })
            this.scheduleData = []
            return
          }

          let index = 0
          switch (class_.classes_name) {
            case '早班':
              index = 0
              break
            case '中班':
              index = 1
              break
            case '晚班':
              index = 2
          }
          row.group_infos[index] = class_
        }
        this.scheduleData.push(row)
        date = date.add(1, 'day')
      }
    },
    shiftsTimeChange() {
      this.classesByIndex = {}
      var date = dayjs(this.startTime)
      var workSchedule = this.workSchedules[this.workScheduleIndex]
      var classDate_ = []
      for (var i = 0; i < workSchedule.period; i++) {
        var date_str = date.format('YYYY-MM-DD')
        this.classesByIndex[i] = []
        for (var k = 0; k < workSchedule.classesdetail_set.length; k++) {
          var classesdetail = workSchedule.classesdetail_set[k]
          classesdetail.date = date_str
          var classesdetail_ = JSON.parse(JSON.stringify(classesdetail))
          classDate_.push(classesdetail_)
          this.classesByIndex[i].push(classesdetail_)
        }
        date = date.add(1, 'day')
      }
      this.classData = classDate_
    },
    savePlanSchedules() {
      var planSchedules = []
      var workSchedule = this.workSchedules[this.workScheduleIndex]
      for (var i = 0; i < this.scheduleData.length; i++) {
        var oneSchedule = this.scheduleData[i]
        var work_schedule_plan = []
        for (var j = 0; j < oneSchedule.group_infos.length; j++) {
          var group_info = oneSchedule.group_infos[j]
          work_schedule_plan.push({

            classes: group_info.classes,
            rest_flag: group_info.is_rest,
            group: group_info.group
          })
        }
        planSchedules.push({
          day_time: oneSchedule.production_time,
          work_schedule: workSchedule.id,
          work_schedule_plan
        })
      }
      var app = this
      planSchedulesUrl('post', null, { data: planSchedules })
        .then(function(response) {
          app.$message.success('排班创建成功')
        }).catch(function() {
          app.$alert('当前日期已存在此倒班', '错误', {
            confirmButtonText: '确定'
          })
        })
    },
    getFactoryScheduling() {
      this.trueCalendar = true
      var app = this
      var obj = {}
      Object.assign(obj, this.planSchedule)
      planScheduleUrl('get', null, {
        params: obj
      }).then(function(response) {
        app.selectDateArr = response.results
        app.selectDateArr = app.setTimeStamp(app.selectDateArr)
        app.trueCalendar = false
      }).catch(function() {
        app.trueCalendar = false
      })
    }
  }
}
</script>

<style>

</style>
