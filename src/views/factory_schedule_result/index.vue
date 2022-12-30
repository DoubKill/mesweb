<template>
  <div v-loading="loading">
    <!-- 工厂排班结果 -->
    <el-form :inline="true">
      <el-form-item
        label="日期"
      >
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="getParamsChanged"
        />
      </el-form-item>
      <el-form-item label="工序">
        <el-select
          v-model="getParams.work_procedure"
          clearable
          placeholder="请选择"
          @change="getParamsChanged"
        >
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.global_name"
            :value="item.id"
          />

        </el-select>
      </el-form-item>
      <el-form-item label="倒班名称">
        <el-input
          v-model="getParams.work_schedule__schedule_name"
          @input="getParamsChanged"
        />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="No"
        width="40"
      />
      <el-table-column
        prop="day_time"
        label="日期"
        width="95px"
      />
      <!-- <el-table-column
        prop="work_schedule"
        label="倒班id"
        width="80"
      /> -->
      <el-table-column
        prop="work_schedule_name"
        label="倒班名"
      />
      <el-table-column
        prop="work_schedule_type"
        label="工序"
      />
      <el-table-column v-for="(item,i) in heardClasses" :key="i" :label="item.global_name">
        <el-table-column
          label="班组"
          width="55px"
        >
          <template v-if="(row.work_schedule_plan.filter(d=>d.classes === item.id))[0]" slot-scope="{row}">
            {{ (row.work_schedule_plan.filter(d=>d.classes === item.id))[0].group_name }}
          </template>
        </el-table-column>
        <el-table-column
          label="开始"
        >
          <template v-if="(row.work_schedule_plan.filter(d=>d.classes === item.id))[0]" slot-scope="{row}">
            {{ (row.work_schedule_plan.filter(d=>d.classes === item.id))[0].start_time }}
          </template>
        </el-table-column>
        <el-table-column
          label="结束"
        >
          <template v-if="(row.work_schedule_plan.filter(d=>d.classes === item.id))[0]" slot-scope="{row}">
            {{ (row.work_schedule_plan.filter(d=>d.classes === item.id))[0].end_time }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <pagination
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { planScheduleUrl, globalCodesUrl } from '@/api/base_w'
import pagination from '@/components/page'
import { setDate } from '@/utils/index'
export default {
  name: 'FactoryScheduleManage',
  components: { pagination },
  data() {
    return {
      tableData: [],
      getParams: {
        page: 1,
        work_schedule__schedule_name: '',
        st: setDate(),
        et: setDate()
      },
      typeList: [],
      total: 0,
      loading: true,
      heardClasses: [],
      dateValue: []
    }
  },
  created() {
    const a = new Date()
    const _year = a.getFullYear()
    const _month = a.getMonth()
    const firstDay = new Date(_year, _month, 1)
    const lastDay = new Date(_year, _month + 1, 0)
    this.getParams.st = setDate(firstDay)
    this.getParams.et = setDate(lastDay)
    this.dateValue = [setDate(firstDay), setDate(lastDay)]

    globalCodesUrl('get', {
      params: {
        class_name: '工序'
      }
    }).then((response) => {
      this.typeList = response.results
      // eslint-disable-next-line handle-callback-err
    }).catch(function(error) {
    })

    globalCodesUrl('get', {
      params: {
        class_name: '班次'
      }
    }).then((response) => {
      this.heardClasses = response.results
      this.getList()
      // eslint-disable-next-line handle-callback-err
    }).catch(function(error) {
    })
  },
  methods: {
    findSchedulePlanByClassesName(work_schedule_plan, name) {
      return work_schedule_plan.find(plan => plan.classes_name === name)
    },
    getList() {
      const app = this
      app.loading = true
      planScheduleUrl('get', null, {
        params: this.getParams
      }).then(function(response) {
        app.total = response.count
        app.tableData = response.results || []
        for (const [row] of app.tableData.entries()) {
          const work_schedule_plan = [null, null, null]
          work_schedule_plan[0] = app.findSchedulePlanByClassesName(row.work_schedule_plan, '早班')
          work_schedule_plan[1] = app.findSchedulePlanByClassesName(row.work_schedule_plan, '中班')
          work_schedule_plan[2] = app.findSchedulePlanByClassesName(row.work_schedule_plan, '夜班')
          row.work_schedule_plan = work_schedule_plan
        }
        app.loading = false
      }).catch(function() {
        app.loading = false
        // this.$message.error(error)
      })
    },
    getParamsChanged() {
      this.getParams.st = this.dateValue ? this.dateValue[0] : ''
      this.getParams.et = this.dateValue ? this.dateValue[1] : ''
      this.getParams.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.getParams.page = page
      this.getParams.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style>

</style>
