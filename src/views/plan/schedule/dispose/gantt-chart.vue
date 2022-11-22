<template>
  <div class="gantt-chart-style">
    <!-- 机台生产计划-甘特图 -->
    <el-form :inline="true">
      <el-form-item label="排程日时">
        <el-date-picker
          v-model="getParams.factory_date"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeListDate"
        />
      </el-form-item>
      <el-form-item label="排程单号">
        <el-select
          v-model="getParams.schedule_no"
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in scheduleNoList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间间隔/min">
        <el-select
          v-model="timeInterval"
          placeholder="请选择"
          style="width:80px"
          @change="changeList"
        >
          <el-option
            v-for="item in [1,5,15,30]"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeList">刷新</el-button>
        <el-button v-permission="['aps_result','import']">
          <a
            :href="`${templateFileUrl}scheduling.xlsx`"
            download="排程导入模板.xlsx"
          >导出Excel模板</a>
        </el-button>
        <el-upload
          v-permission="['aps_result','import']"
          style="margin-left:8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="importScheduling"
          :show-file-list="false"
        >
          <el-button>导入Excel</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- <el-button @click="handleClick">保存</el-button> -->
    <el-tabs v-model="type" type="border-card" @tab-click="handleClickTab">
      <el-tab-pane label="机台" name="1" />
      <el-tab-pane label="胶料" name="2" />
      <div class="new-page">
        <div v-show="tasks.data.length" ref="gantt" class="gantt-container" />
      </div>
      <div v-if="!tasks.data.length" class="noneData">暂无数据</div>
    </el-tabs>

  </div>
</template>

<script>
import gantt from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import { setDate } from '@/utils'
import { scheduleNos, apsGantt, apsPlanImport } from '@/api/base_w_five'
export default {
  name: 'ScheduleGanttChart',
  data() {
    return {
      getParams: { schedule_no: '', factory_date: setDate() },
      scheduleNoList: [],
      tasks: {
        data: [
          // { id: 1, render: 'split', owner: 'z01' },
          // { id: 11, parent: 1, text: 'Task #1', start_date: '2022-01-01 10:30', end_date: '2022-01-01 11:30' },
          // { id: 111, parent: 1, text: 'Task #1', start_date: '2022-01-01 10:50', end_date: '2022-01-01 12:30' },

          // { id: 7, text: 'Task #2', start_date: '2022-01-02 10:50', end_date: '2022-01-02 10:50', owner: 'z02' },
          // { id: 8, text: 'Task #3', start_date: '2022-01-02 11:10', end_date: '2022-01-02 11:30', owner: 'z03' }

          // { id: 1, text: 'Z01-11', owner: 'z01', start_date: '2022-01-01 10:30', end_date: '2022-01-01 11:30' },
          // { id: 2, text: 'Z01 #1', owner: 'z01', start_date: '2022-01-01 10:30', end_date: '2022-01-01 11:30', parent: 1 },
          // { id: 3, text: 'Z01 #1', start_date: '2022-01-01 10:30', end_date: '2022-01-01 11:30', owner: 'z01', parent: 1 }
        ]
      },
      tasksSubmit: {},
      type: '1', // 1机台 2胶料编码
      templateFileUrl: process.env.BASE_URL,
      timeInterval: 15
    }
  },
  created() {
  },
  mounted() {
    // 本地化
    gantt.i18n.setLocale('cn')
    gantt.config.xml_date = '%Y-%m-%d %H:%i' // 格式化时间
    gantt.config.show_links = false // 隐藏线
    gantt.config.duration_unit = 'minute'
    gantt.config.readonly = true // 只读
    gantt.config.open_tree_initially = true

    gantt.templates.task_class = function(start, end, task) {
      if (task.planned_end) {
        return ['has-baseline'].join('class-name')
      }
    }

    gantt.plugins({
      tooltip: true
    })
    gantt.config.scales = [
      { unit: 'day', step: 1, format: '%Y-%m-%d' },
      { unit: 'minute', step: 15, format: '%H:%i' }
    ]
    gantt.templates.tooltip_text = function(start, end, task) {
      return '<b>名称:</b>' + (task.text || '') + '<br/><b>时间:</b>' + (start ? setDate(start, 'gantt') : '') + ' 至 ' + (end ? setDate(end, 'gantt') : '')
    }
    gantt.templates.grid_row_class = function(start, end, task) {
      if (task.$level === 0) {
        return 'nested_task' // 去掉嵌套 加号
      }
      return ''
    }
    // 新增列
    gantt.config.columns = [{
      name: 'owner',
      label: '机台',
      align: 'center',
      width: '*',
      max_width: 200
    }]
    // gantt.config.columns[0].label = '机台'
    // gantt.config.columns[0].name = 'owner'
    // if (gantt.config.columns.length > 3) {
    //   gantt.config.columns.splice(1, gantt.config.columns.length)
    // }
    gantt.createDataProcessor({
      task: {
        create: function(data) {
          console.log(data, '新增任务----------------------')
        },
        update: function(data, id) {
          console.log(data, id, '更新任务----------------------')
        },
        delete: function(id) {
          console.log(id, '删除任务----------------------')
        }
      },
      link: {
        // create: (data) => {
        //   console.log(data, 'link.create----------------------')
        //   console.log(this.tasks)
        // },
        // update: function(data, id) {
        //   console.log(data, 'link.update----------------------')
        // },
        // delete: function(id) {
        //   console.log(id, 'link.delete----------------------')
        // }
      }
    })
    // gantt.attachEvent('onGanttReady', function() {
    //   gantt.config.buttons_left = ['gantt_save_btn', 'gantt_cancel_btn']
    //   gantt.config.buttons_right = ['gantt_delete_btn']
    // })
    // gantt.attachEvent('onLightboxSave', (id, task, is_new) => {
    //   if (button_id === 'complete_button') {
    //     var id = gantt.getState().lightbox
    //     var task = gantt.getTask(id)

    //     gantt.updateTask(id)
    //     gantt.hideLightbox()
    //   }
    //   return true
    // })
    this.changeListDate()
  },
  methods: {
    async getList() {
      try {
        if (this.type === '2') {
          this.getParams.data_type = 'product'
        } else {
          delete this.getParams.data_type
        }
        const data = await apsGantt('get', null, { params: this.getParams })
        this.tasks.data = data || []
        setTimeout(d => {
          gantt.config.scales[1].step = this.timeInterval
          gantt.init(this.$refs.gantt)
          gantt.parse(this.tasks)
        })
      } catch (e) {
        //
      }
    },
    async getSchedule() {
      try {
        const data = await scheduleNos('get', null, { params: { factory_date: this.getParams.factory_date }})
        this.scheduleNoList = data
        this.getParams.schedule_no = data[0] ? data[0] : ''
        this.changeList()
      } catch (e) {
        this.scheduleNoList = []
      }
    },
    handleClick() {
      console.log(this.tasks)
    },
    handleClickTab() {
      if (this.type === '2') {
        gantt.config.columns[0].label = '胶料编码'
      } else {
        gantt.config.columns[0].label = '机台'
      }
      this.changeList()
    },
    clearData() {
      this.tasks.data = []
      gantt.clearAll()
    },
    changeListDate() {
      this.getParams.schedule_no = ''
      this.clearData()
      this.getSchedule()
    },
    changeList() {
      this.clearData()
      if (!this.getParams.factory_date || !this.getParams.schedule_no) {
        this.$message('请选择日期和单号')
        return
      }
      this.getList()
    },
    importScheduling(param) {
      if (!this.getParams.factory_date) {
        this.$message('请选择日期')
        return
      }
      const formData = new FormData()
      formData.append('file', param.file)
      formData.append('factory_date', this.getParams.factory_date)
      apsPlanImport('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: response
        })
        this.getParams.factory_date = setDate()
        this.clearData()
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss">
.gantt-chart-style{
  .gantt-container {
    height: 600px;
  }
  .new-page {
    height: 100%;
    background-color:#FFF;
  }
  .nested_task .gantt_add{
      display: none !important;
  }
  .noneData {
    text-align: center;
    line-height: 50px;
    width: 100%;
  }
}
</style>
