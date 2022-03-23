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
        <el-input v-model="search.name" disabled />
      </el-form-item>
      <el-form-item label="审核人">
        <el-input v-model="search.name" disabled />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['employee_attendance_records','export']"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel模板</el-button>
        <el-upload
          v-permission="[]"
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button v-permission="['employee_attendance_records','import']" type="primary">导入Excel</el-button>
        </el-upload>
        <el-button
          v-permission="['employee_attendance_records','export']"
          type="primary"
          @click="approve('审批')"
        >审批</el-button>
        <el-button
          v-permission="['employee_attendance_records','export']"
          type="primary"
          @click="approve('审核')"
        >审核</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
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
          :label="item"
          width="70"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="attendanceList(scope.row[d.prop+item])"
            >{{ scope.row[d.prop+item] }}</el-link>
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
          <el-input v-model="currentInfo.material_name" disabled />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="currentInfo.material_code" disabled />
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="currentInfo.batch_no" disabled />
        </el-form-item>
        <el-form-item label="经办人">
          <el-input v-model="currentInfo.batch_no" disabled />
        </el-form-item>
      </el-form>
      <el-table
        id="out-table"
        v-loading="loadingAttendance"
        :data="tableDataAttendance"
        border
      >
        <el-table-column
          prop=""
          label="日期"
          min-width="20"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="recordList(scope.row)"
            >{{ scope.row.date }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="quality_status"
          label="机台"
          min-width="20"
        />
        <el-table-column
          prop=""
          label="班次/班组"
          min-width="20"
        />
        <el-table-column
          prop="except_reason"
          label="岗位名称"
          min-width="20"
        />
        <el-table-column
          prop="created_username"
          label="上岗时间"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          label="离岗时间"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          label="计算作业时间(小时)"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          label="承认作业时间(小时)"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          label="状态"
          min-width="20"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisibleList=false"
        >添加</el-button>
        <el-button
          type="primary"
          @click="dialogVisibleList=false"
        >废弃</el-button>
        <el-button
          type="primary"
          @click="dialogVisibleList=false"
        >取消</el-button>
        <el-button
          type="primary"
          @click="dialogVisibleList=false"
        >确认</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="绩效计算 员工出勤打卡 记录明细"
      :visible.sync="loadingRecord"
      width="90%"
    >
      <el-table
        id="out-table"
        v-loading="loadingRecord"
        :data="tableDataRecord"
        border
      >
        <el-table-column
          prop="quality_status"
          label="打卡日期"
          min-width="20"
        />
        <el-table-column
          prop=""
          label="打卡时间"
          min-width="20"
        />
        <el-table-column
          prop="created_username"
          label="机台"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          label="班次/班组"
          min-width="20"
        />
        <el-table-column
          prop="except_reason"
          label="岗位名称"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
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
          @click="dialogVisibleRocord=false"
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
        <el-form-item label="处理结果" prop="result_accept_result">
          <el-radio-group v-model="resultForm.result_accept_result">
            <el-radio label="同意">同意</el-radio>
            <el-radio label="驳回">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理说明">
          <el-input
            v-model="resultForm.result_accept_desc"
            style="width:250px"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleResult=false">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="绩效计算 添加员工出勤工时"
      :visible.sync="dialogVisibleAdd"
      width="500px"
    >
      <el-form ref="createForm" :rules="rules" label-width="150px" :model="dialogForm">
        <el-form-item label="姓名" prop="supplier_code">
          <el-input v-model="dialogForm.supplier_code" disabled style="width:200px" />
        </el-form-item>
        <el-form-item label="身份证" prop="supplier_name">
          <el-input v-model="dialogForm.supplier_name" disabled style="width:200px" />
        </el-form-item>
        <el-form-item label="日期" prop="region">
          <el-date-picker
            v-model="dialogForm.date"
            style="width:200px"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="机台" prop="supplier_type">
          <el-select v-model="dialogForm.supplier_type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.global_name"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班组" prop="supplier_type">
          <el-select v-model="dialogForm.supplier_type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.global_name"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班次" prop="supplier_type">
          <el-select v-model="dialogForm.supplier_type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.global_name"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="supplier_type">
          <el-select v-model="dialogForm.supplier_type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.global_name"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作业时间(小时)" prop="supplier_name">
          <el-input-number v-model="dialogForm.supplier_name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd=false">取 消</el-button>
        <el-button type="primary" :loading="submit" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { employeeattendancerecords, employeeattendancerecordsexport } from '@/api/jqy'
import { setDate } from '@/utils'
export default {
  name: 'StatisticalReportAttendance',
  data() {
    return {
      search: {
        date: setDate(null, null, 'month')
      },
      getParams: {},
      type: '',
      options: [],
      dialogForm: {},
      currentInfo: {},
      resultForm: {},
      tableDataAttendance: [],
      dialogVisibleResult: false,
      tableDataRecord: [],
      dialogVisibleAdd: true,
      loadingRecord: false,
      loadingAttendance: false,
      dialogVisibleList: false,
      dialogVisibleRocord: false,
      machineList: [],
      tableHead1: [],
      rules: {},
      loading: false,
      submit: false,
      tableHead: [],
      tableData: [],
      btnExportLoad: false,
      exportTableShow: false
    }
  },
  created() {
    this.tableHead = getDiffDate(this.search.date + '-01', getCurrentMonthLastDay(setDate()))
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await employeeattendancerecords('get', null, { params: this.search })
        this.tableHead1 = data.group_list || []
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
    approve(val) {
      this.resultForm = { result_accept_result: '同意' }
      this.type = val
      this.dialogVisibleResult = true
    },
    submitFun() {

    },
    async generateFun() {
      try {
        this.submit = true
        // await multiUpdate('post', null, { data: this.creatOrder })
        this.$message.success('操作成功')
        this.submit = false
        this.dialogVisibleResult = false
        this.getList()
      } catch (e) {
        this.submit = false
        this.dialogVisibleResult = true
      }
    },
    async attendanceList(val) {
      console.log(val)
      // this.currentInfo = JSON.parse(JSON.stringify(row))
      try {
        this.loading = true
        // const data = await productInfoDj('get', null, { params: this.search })
        // this.tableData = data.results || []
        this.dialogVisibleList = true
        // this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    recordList() {
      this.dialogVisibleRecord = true
    },
    changeAttendance() {

    },
    changeList() {
      this.tableHead = getDiffDate(this.search.date + '-01', getCurrentMonthLastDay(this.search.date))
      this.getList()
    },
    debounceList() {
      this.$debounce(this, 'getList')
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      formData.append('date', this.search.date)
      employeeattendancerecords('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: response
        })
        this.getList()
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
    }
  }
}
function getDiffDate(start, end) {
  var startTime = getDate(start)
  var endTime = getDate(end)
  var dateArr = []
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var d = startTime.getDate()
    dateArr.push({ label: d + '日', prop: d })
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
        background: #F6ECFF;
    }
}
</style>
