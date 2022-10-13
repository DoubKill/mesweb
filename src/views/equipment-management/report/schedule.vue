<template>
  <div class="schedule">
    <!-- 月度配料间排班表 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.target_month"
          type="month"
          :clearable="false"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item
        label="组别"
      >
        <el-select v-model="search.classes" clearable placeholder="请选择" @visible-change="getGroup" @change="getList">
          <el-option
            v-for="item in optionsGroup"
            :key="item.id"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="人员"
      >
        <el-select v-model="search.username" clearable filterable placeholder="请选择" @change="getList">
          <el-option
            v-for="item in personList"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-upload
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button v-permission="['weight_class_plan','import']" :loading="btnExportLoad1" type="primary">导入Excel</el-button>
        </el-upload>
        <el-button v-permission="['weight_class_plan', 'export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-button v-permission="['weight_class_plan', 'add']" type="primary" @click="onSubmit">添加排班人员</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      max-height="650"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        fixed
        align="center"
        prop="classes"
        label="组别"
        min-width="80"
      />
      <el-table-column
        fixed
        align="center"
        prop="username"
        label="姓名"
        min-width="80"
      />
      <el-table-column
        fixed
        align="center"
        label="岗位"
        min-width="130"
      >
        <template slot-scope="scope">
          <el-select v-if="scope.row.isEdit" v-model="scope.row.station" style="width:110px" filterable placeholder="请选择" @visible-change="sectionChange">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
          <span v-else>
            {{ scope.row.station }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(herder,index) in tableHeader"
        :key="Date.now()+index"
        align="center"
        :label="herder"
        min-width="140"
      >
        <template slot-scope="scope">
          <el-select v-if="scope.row.isEdit&&(search.target_month+'-'+(Number(herder.split('/')[1]<10)?'0'+herder.split('/')[1]:herder.split('/')[1]))>=date" v-model="scope.row.weight_class_details[herder]" style="width:110px">
            <el-option
              v-for="item in optionsType"
              :key="item.id"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
          <span v-else>
            {{ scope.row.weight_class_details[herder] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="210"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['weight_class_plan', 'edit']"
            :disabled="scope.row.isEdit"
            type="primary"
            size="mini"
            @click="edit(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['weight_class_plan', 'edit']"
            :disabled="!scope.row.isEdit"
            type="primary"
            size="mini"
            @click="save(scope.row)"
          >保存
          </el-button>
          <el-button
            v-permission="['weight_class_plan', 'delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加排班人员"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
      >
        <el-form-item
          label="组别"
          prop="classes"
        >
          <el-select v-model="dialogForm.classes" placeholder="请选择" @visible-change="getGroup">
            <el-option
              v-for="item in optionsGroup"
              :key="item.id"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="人员"
          prop="user"
        >
          <el-select v-model="dialogForm.user" filterable placeholder="请选择">
            <el-option
              v-for="item in personList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="station">
          <el-select v-model="dialogForm.station" filterable placeholder="请选择" @visible-change="sectionChange">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { classesListUrl } from '@/api/base_w'
// import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
import { weightClassPlan, personnels, performanceJobLadder, weightClassPlanImport } from '@/api/jqy'
export default {
  name: 'Schedule',
  components: {},
  data() {
    return {
      date: setDate(),
      search: { target_month: setDate(null, null, 'month') },
      tableData: [],
      tableDataView: [],
      options: [],
      personList: [],
      optionsGroup: [],
      optionsType: [],
      tableHeader: [],
      loading: false,
      btnExportLoad: false,
      btnExportLoad1: false,
      dialogVisible: false,
      rules: {
        classes: [{ required: true, message: '不能为空', trigger: 'change' }],
        station: [{ required: true, message: '不能为空', trigger: 'change' }],
        user: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      dialogForm: {},
      btnLoading: false
    }
  },
  created() {
    this.tableHeader = getDiffDate(this.search.target_month + '-01', getCurrentMonthLastDay(setDate()))
    this.getList()
    this.getAllList()
    this.getType()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await weightClassPlan('get', null, { params: this.search })
        this.tableData = data || []
        this.tableData.forEach(d => { d.isEdit = false })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.tableHeader = getDiffDate(this.search.target_month + '-01', getCurrentMonthLastDay(this.search.target_month))
      this.getList()
    },
    async onSubmit() {
      this.dialogForm = { target_month: this.search.target_month }
      this.dialogVisible = true
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      weightClassPlan('get', null, { responseType: 'blob', params: obj })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '月度配料间排班表.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
      // setTimeout(d => {
      //   this.btnExportLoad = true
      //   this.tableData.forEach(d => { d.isEdit = false })
      //   setTimeout(d => {
      //     exportExcel('月度配料间排班表', 'disposal-list-components')
      //     this.btnExportLoad = false
      //   }, 1000)
      // }, 100)
    },
    Upload(param) {
      this.btnExportLoad1 = true
      const formData = new FormData()
      formData.append('file', param.file)
      weightClassPlanImport('post', null, { data: formData })
        .then(response => {
          this.$message({
            type: 'success',
            message: response
          })
          this.btnExportLoad1 = false
          this.getList()
        })
        .catch(e => {
          this.btnExportLoad1 = false
        })
    },
    sectionChange(val) {
      if (val) {
        performanceJobLadder('get', null, { params: { all: 1, type: '称量', weight: 1 }}).then((response) => {
          this.options = response.results
        })
      }
    },
    async getAllList() {
      const data = await personnels('get', null, { params: { all: 1, section_name: '生产配料' }})
      this.personList = data.results
    },
    async getGroup(val) {
      if (val) {
        const obj = { all: 1, class_name: '配料间排班组别' }
        const data = await classesListUrl('get', null, { params: obj })
        this.optionsGroup = data.results
      }
    },
    async getType() {
      const obj = { all: 1, class_name: '配料间排班详细分类' }
      const data = await classesListUrl('get', null, { params: obj })
      this.optionsType = data.results
    },

    handleClose(done) {
      this.dialogVisible = false
      this.$refs.createForm.resetFields()
      if (done) {
        done()
      }
    },
    handleDelete(row) {
      this.$confirm('此操作将删除' + row.classes + ' ' + row.username + '是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        weightClassPlan('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    edit(row) {
      this.$set(row, 'isEdit', true)
      this.$forceUpdate()
    },
    async save(row) {
      try {
        await weightClassPlan('put', row.id, { data: row })
        this.$set(row, 'isEdit', false)
        this.$forceUpdate()
        this.$message.success('操作成功')
        // this.getList()
      } catch (e) {
        //
      }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            await weightClassPlan('post', null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.btnLoading = false
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
function getDiffDate(start, end) {
  var startTime = getDate(start)
  var endTime = getDate(end)
  var m = parseInt(start.split('-')[1], 10)
  var dateArr = []
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var d = startTime.getDate()
    dateArr.push(m + '/' + d)
    startTime.setDate(startTime.getDate() + 1)
  }
  return dateArr
}
function getDate(datestr) {
  var temp = datestr.split('-')
  if (temp[1] === '01') {
    temp[0] = parseInt(temp[0], 10) - 1
    temp[1] = '12'
  } else {
    temp[1] = parseInt(temp[1], 10) - 1
  }
  // new Date()的月份入参实际都是当前值-1
  var date = new Date(temp[0], temp[1], temp[2])
  return date
}
function getCurrentMonthLastDay(d) {
  const date = new Date(d)
  let currentMonth = date.getMonth()
  const nextMonth = ++currentMonth
  const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  const oneDay = 1000 * 60 * 60 * 24
  const lastTime = new Date(nextMonthFirstDay - oneDay)
  let month = parseInt(lastTime.getMonth() + 1)
  let day = lastTime.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return date.getFullYear() + '-' + month + '-' + day
}
</script>

<style lang="scss">
.schedule{
  .el-table{
    .cell {
      white-space: pre-line;
    }
    .gutter{
      display: none;
    }
    }
}
</style>

