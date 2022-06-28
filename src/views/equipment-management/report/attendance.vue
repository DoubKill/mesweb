<template>
  <div class="statisticalReportAttendance">
    <!-- 员工出勤记录表 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.date"
          type="month"
          :clearable="false"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="changeList"
        />
      </el-form-item>
      <!-- <el-form-item label="姓名">
        <el-input v-model="search.name" clearable placeholder="请输入" @change="debounceList" />
      </el-form-item> -->
      <el-form-item label="审批人">
        <el-input v-model="approve_user" disabled />
      </el-form-item>
      <el-form-item label="审核人">
        <el-input v-model="audit_user" disabled />
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="approveState" disabled />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['employee_attendance_records','add']"
          type="primary"
          @click="addStatus('外面')"
        >添加考勤数据</el-button>
        <el-button
          v-permission="['employee_attendance_records','export']"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable1"
        >导出Excel</el-button>
        <el-button
          v-permission="['employee_attendance_records','export']"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel模板</el-button>
        <el-upload
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button v-permission="['employee_attendance_records','import']" :loading="btnExportLoad1" type="primary">导入Excel</el-button>
        </el-upload>
        <el-button
          v-permission="['employee_attendance_records','addall']"
          type="primary"
          :loading="btnLoad"
          @click="approve1('整体提交')"
        >整体提交</el-button>
        <el-button
          v-permission="['employee_attendance_records','examine']"
          type="primary"
          @click="approve('审批')"
        >审批</el-button>
        <el-button
          v-permission="['employee_attendance_records','audit']"
          type="primary"
          @click="approve('审核')"
        >审核</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      max-height="700"
      :data="tableData"
      :span-method="objectSpanMethod"
      border
    >
      <el-table-column width="120px">
        <template
          slot="header"
        >
          <div class="header-style">
            <div style="width:100%;text-align:right;margin:8px 0 20px 0">时间</div>
            <span>机台</span>
            <div class="header-style-line three-line" />
          </div>
        </template>
        <template
          slot-scope="{row}"
        >
          <span>{{ row.equip }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="section"
        align="center"
        label="岗位"
        width="90"
      />
      <el-table-column
        v-for="(d,index) in tableHead"
        :key="Date.now()+index"
        align="center"
        :label="d.label"
        min-width="50"
      >
        <el-table-column
          v-for="(item,i) in tableHead1[index]"
          :key="i"
          align="center"
          :prop="d.prop+item"
          :label="item"
          width="70"
        >
          <template slot-scope="scope">
            <div>
              <el-link
                v-for="(item1,index1) in scope.row[d.prop+item]"
                :key="index1"
                :style="{color:item1.color}"
                type="primary"
                @click="attendanceList(item1.name,item,d.day,scope.row,i,tableHead1[index].length,item1.color)"
              >
                {{ item1.name }}{{ scope.row[d.prop+item].length -1>index1 ? ',' : '' }}
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <el-dialog
      title="绩效计算 员工出勤工时统计"
      :visible.sync="dialogVisibleList"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="月份">
          <el-date-picker
            v-model="getParams.date"
            type="month"
            :clearable="false"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月"
            @change="changeAttendance"
          />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="getParams.name" disabled />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="currentInfo.id_card_num" disabled />
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="currentInfo.station" disabled />
        </el-form-item>
        <el-form-item label="经办人">
          <el-input v-model="currentInfo.principal" disabled />
        </el-form-item>
      </el-form>
      <el-table
        id="out-table"
        v-loading="loadingAttendance"
        :data="tableDataAttendance"
        highlight-current-row
        border
        max-height="550px"
        @current-change="handleSelectionChange"
      >
        <el-table-column
          label="日期"
          min-width="20"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="recordList(scope.row)"
            >{{ scope.row.factory_date }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="equip"
          label="机台"
          min-width="20"
        />
        <el-table-column
          label="班次/班组"
          min-width="20"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.classes }}/{{ scope.row.group }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="section"
          label="岗位名称"
          min-width="20"
        />
        <el-table-column
          prop="begin_date"
          label="上岗时间"
          min-width="20"
        />
        <el-table-column
          prop="end_date"
          label="离岗时间"
          min-width="20"
        />
        <el-table-column
          prop="work_time"
          label="计算作业时间(小时)"
          min-width="20"
        />
        <el-table-column
          width="200"
          prop="actual_time"
          label="承认作业时间(小时)"
          min-width="20"
        >
          <template
            slot-scope="{row}"
          >
            <el-input-number v-model="row.actual_time" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column
          prop="is_use"
          label="状态"
          min-width="20"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-permission="['employee_attendance_records','reject']"
          type="primary"
          @click="editStatus('审核驳回')"
        >审核驳回</el-button>
        <el-button
          v-permission="['employee_attendance_records','add']"
          type="primary"
          @click="addStatus('里面')"
        >添加</el-button>
        <el-button
          v-permission="['employee_attendance_records','abandon']"
          type="primary"
          @click="editStatus('废弃')"
        >废弃</el-button>
        <el-button
          type="primary"
          @click="dialogVisibleList=false"
        >取消</el-button>
        <el-button
          v-permission="['employee_attendance_records','affirm']"
          :disabled="color==='#51A651'"
          type="primary"
          @click="editStatus('确认')"
        >确认</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="绩效计算 员工出勤打卡 记录明细"
      :visible.sync="dialogVisibleRecord"
      width="90%"
    >
      <el-table
        id="out-table"
        v-loading="loadingRecord"
        max-height="600px"
        :data="tableDataRecord"
        border
      >
        <el-table-column
          prop="date"
          label="打卡日期"
          min-width="20"
        />
        <el-table-column
          prop="date_time"
          label="打卡时间"
          min-width="20"
        />
        <el-table-column
          prop="equip"
          label="机台"
          min-width="20"
        />
        <el-table-column
          label="班次/班组"
          min-width="20"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.classes }}/{{ scope.row.group }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="section"
          label="岗位名称"
          min-width="20"
        />
        <el-table-column
          prop="work_type"
          label="打卡类别"
          min-width="20"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisibleRecord=false"
        >返回</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'考勤结果处理 --'+type"
      :visible.sync="dialogVisibleResult"
      width="30%"
    >
      <el-form
        :model="resultForm"
        label-width="150px"
      >
        <el-form-item label="处理结果" prop="result">
          <el-radio-group v-model="resultForm.result">
            <el-radio :label="true">同意</el-radio>
            <el-radio :label="false">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理说明">
          <el-input
            v-model="resultForm.result_desc"
            style="width:250px"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleResult=false">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="绩效计算 添加员工出勤工时"
      :visible.sync="dialogVisibleAdd"
      width="500px"
    >
      <el-form ref="dialogForm" :rules="rules" label-width="150px" :model="dialogForm">
        <el-form-item label="姓名" prop="username">
          <el-select v-model="dialogForm.username" :disabled="addType==='里面'?true:false" placeholder="请选择" style="width:200px" @change="changeIdCard">
            <el-option
              v-for="item in allList"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="身份证" prop="id_card_num">
          <el-input v-model="dialogForm.id_card_num" disabled style="width:200px" />
        </el-form-item>
        <el-form-item label="日期" prop="factory_date">
          <el-date-picker
            v-model="dialogForm.factory_date"
            :disabled="addType==='里面'?true:false"
            style="width:200px"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="机台" prop="equip">
          <el-select v-model="dialogForm.equip" :disabled="addType==='里面'?true:false" placeholder="请选择" @visible-change="equipChange">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班组" prop="group">
          <el-select v-model="dialogForm.group" :disabled="addType==='里面'?true:false" placeholder="请选择" @visible-change="getClassGroup">
            <el-option
              v-for="item in options1"
              :key="item.global_name"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班次" prop="classes">
          <class-select
            :is-disabled="addType==='里面'?true:false"
            :value-default="dialogForm.classes"
            :is-clearable="false"
            @classSelected="classChanged"
          />
        </el-form-item>
        <el-form-item label="岗位" prop="section">
          <el-select v-model="dialogForm.section" placeholder="请选择" @visible-change="sectionChange">
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作业时间(小时)" prop="actual_time">
          <el-input-number v-model="dialogForm.actual_time" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd=false">取 消</el-button>
        <el-button type="primary" :loading="submit" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { globalCodesUrl } from '@/api/base_w'
import { personnels } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
import { currentFactoryDate } from '@/api/base_w_three'
import classSelect from '@/components/ClassSelect'
import { getEquip } from '@/api/banburying-performance-manage'
import { attendanceResultAudit, performanceJobLadder, employeeattendancerecords, employeeattendancerecordsexport, attendanceTimeStatistics, attendanceClockDetail } from '@/api/jqy'
import { setDate } from '@/utils'
export default {
  name: 'StatisticalReportAttendance',
  components: { classSelect },
  data() {
    return {
      search: {
        date: setDate(null, null, 'month')
      },
      getParams: {
        date: setDate(null, null, 'month')
      },
      color: '',
      type: '',
      options: [],
      options1: [],
      options2: [],
      dialogForm: {},
      currentInfo: {},
      approve_user: null,
      audit_user: null,
      approveState: null,
      btnLoad: false,
      resultForm: {},
      tableDataAttendance: [],
      dialogVisibleResult: false,
      tableDataRecord: [],
      dialogVisibleAdd: false,
      loadingRecord: false,
      loadingAttendance: false,
      dialogVisibleList: false,
      dialogVisibleRecord: false,
      machineList: [],
      tableHead1: [],
      rules: {
        factory_date: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        equip: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        classes: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        group: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        section: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        work_time: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      loading: false,
      addType: null,
      submit: false,
      date: '',
      equip: '',
      group: '',
      classes: '',
      allList: [],
      multipleSelection: [],
      tableHead: [],
      tableData: [],
      btnExportLoad: false,
      btnExportLoad1: false,
      exportTableShow: false
    }
  },
  created() {
    this.tableHead = getDiffDate(this.search.date + '-01', getCurrentMonthLastDay(setDate()))
    this.getList()
    this.getAllList()
  },
  methods: {
    equipChange(val) {
      if (val) {
        const obj = { all: 1, category_name: '密炼设备' }
        getEquip(obj).then(response => {
          this.options = response.results
        })
      }
    },
    getClassGroup(val) {
      if (val) {
        globalCodesUrl('get', { params: { class_name: '班组' }}).then((response) => {
          this.options1 = response.results
        }).catch(function() {
        })
      }
    },
    async getClasses(val, val1) {
      try {
        const data = await currentFactoryDate('get', null, { params: { select_date: val, group: val1 }})
        this.dialogForm.classes = data.classes
      } catch (e) {
        //
      }
    },
    async getAllList() {
      const data = await personnels('get', null, { params: { all: 1, attendance: 1 }})
      this.allList = data.results
    },
    sectionChange(val) {
      if (val) {
        performanceJobLadder('get', null, { params: { all: 1 }}).then((response) => {
          this.options2 = response.results
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    classChanged(val) {
      this.$set(this.dialogForm, 'classes', val)
    },
    addStatus(val) {
      this.dialogVisibleAdd = true
      this.addType = val
      if (val === '里面') {
        if (this.$refs.dialogForm) {
          this.$refs.dialogForm.clearValidate()
        }
        this.dialogForm = {
          factory_date: this.date,
          equip: this.equip,
          group: this.group,
          username: this.getParams.name,
          is_use: '添加',
          id_card_num: this.currentInfo.id_card_num
        }
        this.getClasses(this.date, this.group)
      } else {
        this.dialogForm = {
          factory_date: setDate(),
          equip: null,
          group: null,
          classes: null,
          username: '',
          is_use: '添加',
          id_card_num: ''
        }
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await employeeattendancerecords('get', null, { params: this.search })
        this.tableHead1 = data.group_list || []
        this.approve_user = data.approve_user
        this.audit_user = data.audit_user
        this.approveState = (this.approve_user !== null ? '已审批' : '未审批')
        this.tableData = data.results || []
        this.spanArr = []
        this.pos = null
        for (var i = 0; i < this.tableData.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1)
            this.pos = 0
          } else {
            if (this.tableData[i].equip === this.tableData[i - 1].equip) {
              // 如果a相等就累加，并且push 0  这里是根据一样的a匹配
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
            } else {
              // 不相等push 1
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async editStatus(val) {
      if (val === '废弃') {
        if (this.multipleSelection.id) {
          try {
            await attendanceTimeStatistics('put', this.multipleSelection.id, { data: { is_use: val }})
            this.$message.success('操作成功')
            this.attendanceList()
          } catch (e) {
          //
          }
        } else {
          this.$message('请先选中一条数据')
        }
      } else if (val === '确认') {
        try {
          var arr = JSON.parse(JSON.stringify(this.tableDataAttendance))
          arr.forEach(d => {
            d.is_use = '确认'
          })
          await attendanceTimeStatistics('post', null, { data: { confirm_list: arr }})
          this.$message.success('操作成功')
          this.color = '#51A651'
          this.attendanceList()
          this.getList()
        } catch (e) {
          //
        }
      } else {
        try {
          var arr1 = JSON.parse(JSON.stringify(this.tableDataAttendance))
          arr1.forEach(d => {
            d.is_use = '驳回'
          })
          await attendanceTimeStatistics('post', null, { data: { reject_list: arr1 }})
          this.$message.success('操作成功')
          this.attendanceList()
          this.getList()
        } catch (e) {
          //
        }
      }
    },
    approve(val) {
      this.resultForm = { result: true }
      this.type = val
      this.dialogVisibleResult = true
    },
    async approve1() {
      try {
        this.btnLoad = true
        await attendanceResultAudit('post', null, { data: { overall: 1 }})
        this.$message.success('操作成功')
        this.btnLoad = false
        this.getList()
      } catch (e) {
        this.btnLoad = false
      }
    },
    async submitFun() {
      if (this.type === '审批') {
        this.resultForm.approve = 1
        delete this.resultForm.audit
      } else {
        this.resultForm.audit = 1
        delete this.resultForm.approve
      }
      try {
        this.resultForm.date = this.search.date
        this.submit = true
        await attendanceResultAudit('post', null, { data: this.resultForm })
        this.$message.success('操作成功')
        this.submit = false
        this.dialogVisibleResult = false
        this.getList()
      } catch (e) {
        this.submit = false
      }
    },
    async generateFun() {
      this.$refs.dialogForm.validate(async(valid) => {
        if (valid) {
          try {
            this.submit = true
            await attendanceTimeStatistics('post', null, { data: { report_list: [this.dialogForm] }})
            this.$message.success('操作成功')
            this.submit = false
            this.dialogVisibleAdd = false
            this.attendanceList()
            this.getList()
          } catch (e) {
            this.submit = false
          }
        } else {
          return false
        }
      })
    },
    changeIdCard() {
      if (this.allList.find(d => this.dialogForm.username === d.username)) {
        this.dialogForm.id_card_num = this.allList.find(d => this.dialogForm.username === d.username).id_card_num
      } else {
        this.dialogForm.id_card_num = ''
      }
    },
    async attendanceList(val, group, day, row, classes, length, color) {
      if (val) {
        this.color = color
        this.group = group
        this.date = this.search.date + '-' + day
        this.equip = row.equip
        if (length > 2) {
          this.classes = (classes === 0 ? '早班' : classes === 1 ? '中班' : '夜班')
        } else {
          this.classes = (classes === 0 ? '早班' : '夜班')
        }
        this.getParams.date = this.search.date
        this.getParams.name = val.split('(')[0]
        this.currentInfo.station = '生产部'
        this.dialogVisibleList = true
      }
      try {
        this.loadingAttendance = true
        const data = await attendanceTimeStatistics('get', null, { params: this.getParams })
        this.currentInfo.id_card_num = data.id_card_num
        this.currentInfo.principal = data.principal
        this.tableDataAttendance = data.results || []
        this.loadingAttendance = false
      } catch (e) {
        this.loadingAttendance = false
      }
    },
    async recordList(row) {
      try {
        this.dialogVisibleRecord = true
        this.loadingRecord = true
        const data = await attendanceClockDetail('get', null, { params: { name: this.getParams.name, date: row.factory_date }})
        this.tableDataRecord = data || []
        this.loadingRecord = false
      } catch (e) {
        this.loadingRecord = false
      }
    },
    changeAttendance() {
      this.attendanceList()
    },
    changeList() {
      this.tableHead = getDiffDate(this.search.date + '-01', getCurrentMonthLastDay(this.search.date))
      this.getList()
    },
    debounceList() {
      this.$debounce(this, 'getList')
    },
    Upload(param) {
      this.btnExportLoad1 = true
      const formData = new FormData()
      formData.append('file', param.file)
      formData.append('date', this.search.date)
      employeeattendancerecords('post', null, { data: formData })
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0].includes(columnIndex) && this.spanArr) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = {
        date: this.search.date
      }
      employeeattendancerecordsexport(obj).then(response => {
        const link = document.createElement('a')
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.download = '员工出勤记录表' + setDate() + '.xlsx'// 下载的文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.btnExportLoad = false
      })
        .catch(e => {
          this.btnExportLoad = false
        })
    },
    exportTable1() {
      exportExcel('员工出勤记录表')
    }
  }
}
function getDiffDate(start, end) {
  var startTime = getDate(start)
  var endTime = getDate(end)
  var dateArr = []
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var d = startTime.getDate()
    var e = d < 10 ? '0' + d : d
    dateArr.push({ label: d + '日', prop: d, day: e })
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
.statisticalReportAttendance{
    .el-table th{
        padding:0;
    }
    .header-style{
        position: relative;
    }
    .header-style-line{
        height: 1px;
        background:  #e4e6e9;
    }
    .three-line{
        transform-origin:left center;
        transform:rotate(31.5deg);
        width:140px;
        position: absolute;
        top:-8px;
        left:-6px;
    }
    .el-table .wl-row{
        background: #f6ecff;
    }
}

</style>
