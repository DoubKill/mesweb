<template>
  <div class="statisticalReportAttendance">
    <!-- 员工出勤记录表 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.date"
          style="width:120px"
          type="month"
          :clearable="false"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item
        label="类别"
      >
        <el-select v-model="search.clock_type" style="width:120px" placeholder="请选择" @change="getList">
          <el-option
            v-for="item in optionsType"
            :key="item.id"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="姓名">
        <el-input v-model="search.name" clearable placeholder="请输入" @change="debounceList" />
      </el-form-item> -->
      <el-form-item label="审批人">
        <el-input v-model="approve_user" style="width:140px" disabled />
      </el-form-item>
      <el-form-item label="审核人">
        <el-input v-model="audit_user" style="width:140px" disabled />
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="approveState" style="width:140px" disabled />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['employee_attendance_records','add']"
          :disabled="approveState==='已审批'||approveState==='已审核'"
          type="primary"
          @click="addStatus('外面')"
        >添加考勤数据</el-button>
        <el-button
          v-permission="['employee_attendance_records','export']"
          type="primary"
          :disabled="!isDownload"
          :loading="isExport"
          @click="exportTable1"
        >导出Excel</el-button>
        <!-- <el-button
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
        </el-upload> -->
        <el-button
          v-permission="['employee_attendance_records','addall']"
          type="primary"
          :loading="btnLoad"
          @click="approveCheck()"
        >班次提交</el-button>
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
      max-height="600"
      :data="tableData"
      :span-method="objectSpanMethod"
      border
    >
      <el-table-column :fixed="!isExport" width="120px">
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
        :fixed="!isExport"
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
    <el-alert
      style="color:black"
      title="表格字体颜色说明:蓝色:有考勤数据,班长还未确认;红色:考勤班长已确认,但是被审批驳回;黑色:考勤班长班次提交"
      type="success"
    />

    <el-dialog
      title="绩效计算 员工出勤工时统计"
      :visible.sync="dialogVisibleList"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="月份">
          <el-date-picker
            v-model="getParams.date"
            :disabled="!isShow"
            type="month"
            :clearable="false"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月"
            @change="changeAttendance"
          />
        </el-form-item>
        <!-- <el-form-item label="日期">
          <el-input v-model="date" disabled />
        </el-form-item> -->
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
        <el-form-item label="">
          <el-checkbox v-model="isShow" @change="showList">显示该员工当月所有考勤数据</el-checkbox>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingAttendance"
        :data="tableDataAttendance"
        highlight-current-row
        border
        max-height="550px"
        @current-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
        />
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
          width="150"
        />
        <el-table-column
          prop="end_date"
          label="离岗时间"
          width="150"
        />
        <el-table-column
          prop="is_check"
          label="适用排班时间"
          width="120"
        >
          <template
            slot-scope="{row}"
          >
            <el-checkbox v-model="row.is_check" @change="checkTime(row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="begin_date"
          label="承认上岗时间"
          width="230"
        >
          <template
            slot-scope="{row}"
          >
            <el-date-picker
              v-model="row.actual_begin_date"
              :disabled="isShow||row.is_check"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:220px"
              type="datetime"
              :clearable="false"
              @blur="changeStartTime(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="end_date"
          label="承认离岗时间"
          width="230"
        >
          <template
            slot-scope="{row}"
          >
            <el-date-picker
              v-model="row.actual_end_date"
              :disabled="isShow||row.is_check"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:220px"
              type="datetime"
              :clearable="false"
              @blur="changeEndTime(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="work_time"
          label="计算作业时间(小时)"
          width="150"
        />
        <el-table-column
          width="150"
          prop="actual_time"
          label="承认作业时间(小时)"
        />
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
          :disabled="color==='#DA1F27'||color==='#1010FF'||isShow"
          type="primary"
          @click="editStatus('审批驳回')"
        >审批驳回</el-button>
        <el-button
          v-permission="['employee_attendance_records','add']"
          :disabled="color==='#51A651'||color==='#141414'||isShow||approveState==='已审批'||approveState==='已审核'"
          type="primary"
          @click="addStatus('里面')"
        >添加</el-button>
        <el-button
          v-permission="['employee_attendance_records','abandon']"
          :disabled="color==='#51A651'||color==='#141414'||isShow"
          type="primary"
          @click="editStatus('废弃')"
        >废弃</el-button>
        <el-button
          type="primary"
          @click="dialogVisibleList=false"
        >取消</el-button>
        <el-button
          v-permission="['employee_attendance_records','affirm']"
          :disabled="color==='#51A651'||color==='#141414'||isShow"
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
      width="50%"
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
        <el-form-item label="处理履历">
          <el-table
            v-loading="loadingApprove"
            max-height="600px"
            :data="tableDataApprove"
            border
          >
            <el-table-column
              prop="date"
              label="日期"
              min-width="20"
            />
            <el-table-column
              prop="opera_user"
              label="操作人"
              min-width="20"
            />
            <el-table-column
              prop="opera_type"
              label="处理类别"
              min-width="20"
            />
            <el-table-column
              prop="opera_result"
              label="处理结果"
              min-width="20"
            />
            <el-table-column
              prop="result_desc"
              label="处理说明"
              min-width="40"
            />
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="approveState==='已审核'||(type==='审批'&&approveState==='已审批')" @click="dialogVisibleResult=false">关 闭</el-button>
        <el-button v-if="approveState==='确认中'||approveState===''||(type==='审核'&&approveState==='已审批')" @click="dialogVisibleResult=false">取 消</el-button>
        <el-button v-if="approveState==='确认中'||approveState===''||(type==='审核'&&approveState==='已审批')" :loading="submit" type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="绩效计算 添加员工出勤工时"
      :visible.sync="dialogVisibleAdd"
      width="500px"
    >
      <el-form ref="dialogForm" :rules="rules" label-width="150px" :model="dialogForm">
        <el-form-item label="姓名" prop="username">
          <el-select v-model="dialogForm.username" filterable :disabled="addType==='里面'?true:false" placeholder="请选择" style="width:200px" @change="changeIdCard">
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
            :clearable="false"
            :picker-options="pickerOptions"
            :disabled="addType==='里面'?true:false"
            style="width:200px"
            type="date"
            value-format="yyyy-MM-dd"
            @change="getGroup(dialogForm.factory_date)"
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
          <el-select v-model="dialogForm.group" :disabled="addType==='里面'?true:false" placeholder="请选择" @change="pickClasses">
            <el-option
              v-for="item in groupList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班次" prop="classes">
          <class-select
            :is-disabled="true"
            :value-default="dialogForm.classes"
            :is-clearable="false"
            @classSelected="classChanged"
          />
        </el-form-item>
        <el-form-item label="岗位" prop="section">
          <el-select v-model="dialogForm.section" :disabled="addType==='里面'?true:false" placeholder="请选择" @visible-change="sectionChange">
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上岗时间" prop="actual_begin_date">
          <el-date-picker
            v-model="dialogForm.actual_begin_date"
            style="width:200px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :clearable="false"
            @blur="addStartTime"
          />
        </el-form-item>
        <el-form-item label="离岗时间" prop="actual_end_date">
          <el-date-picker
            v-model="dialogForm.actual_end_date"
            style="width:200px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :clearable="false"
            @blur="addEndTime"
          />
        </el-form-item>
        <el-form-item label="作业时间(小时)" prop="actual_time">
          <el-input-number v-model="dialogForm.actual_time" disabled />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd=false">取 消</el-button>
        <el-button type="primary" :loading="submit" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="班次提交考勤数据"
      :visible.sync="dialogVisibleCheck"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="日期">
          <el-date-picker
            v-model="searchCheck.date"
            type="date"
            :clearable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="getCheckList"
          />
        </el-form-item>
        <el-form-item label="班次" prop="classes">
          <class-select
            :value-default="searchCheck.classes"
            :is-clearable="true"
            @classSelected="classCheckList"
          />
        </el-form-item>
        <el-form-item label="机台">
          <el-select v-model="searchCheck1.equip" clearable multiple placeholder="请选择" @change="getCheckEquip" @visible-change="equipChange">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位">
          <el-select v-model="searchCheck1.section" clearable multiple placeholder="请选择" @change="getCheckSection" @visible-change="sectionChange">
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班组">
          <el-select v-model="searchCheck.group" clearable placeholder="请选择" @change="getCheckList">
            <el-option
              v-for="item in groupList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        v-loading="loadingCheck"
        :data="tableDataCheck"
        highlight-current-row
        border
        max-height="550px"
        row-key="index"
        @selection-change="handleSelectionChangeCheck"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
        />
        <el-table-column
          type="selection"
          width="40"
          :selectable="select"
          :reserve-selection="true"
        />
        <el-table-column
          prop="username"
          label="姓名"
          width="70"
        />
        <el-table-column
          prop="group"
          label="班组"
          width="70"
        />
        <el-table-column
          prop="equip"
          label="机台"
          width="70"
        />
        <el-table-column
          prop="section"
          label="岗位名称"
          width="80"
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
          prop="is_check"
          label="适用排班时间"
          width="100"
        >
          <template
            slot-scope="{row}"
          >
            <el-checkbox v-model="row.is_check" @change="checkTime(row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="begin_date"
          label="承认上岗时间"
          width="230"
        >
          <template
            slot-scope="{row}"
          >
            <el-date-picker
              v-model="row.actual_begin_date"
              :disabled="row.is_check"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:220px"
              type="datetime"
              :clearable="false"
              @blur="changeStartTime(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="end_date"
          label="承认离岗时间"
          width="230"
        >
          <template
            slot-scope="{row}"
          >
            <el-date-picker
              v-model="row.actual_end_date"
              :disabled="row.is_check"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:220px"
              type="datetime"
              :clearable="false"
              @blur="changeEndTime(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="work_time"
          label="计算作业时间(小时)"
          width="150"
        />
        <el-table-column
          width="150"
          prop="actual_time"
          label="承认作业时间(小时)"
        />
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
          v-permission="['employee_attendance_records','add']"
          :disabled="approveState==='已审批'||approveState==='已审核'"
          type="primary"
          @click="addStatus('外面')"
        >添加</el-button>
        <el-button
          v-permission="['employee_attendance_records','abandon']"
          type="primary"
          @click="editStatusCheck('废弃')"
        >废弃</el-button>
        <el-button
          type="primary"
          @click="dialogVisibleCheck=false"
        >取消</el-button>
        <el-button
          v-permission="['employee_attendance_records','affirm']"
          type="primary"
          @click="editStatusCheck('确认')"
        >确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { globalCodesUrl, classesListUrl } from '@/api/base_w'
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
        clock_type: '密炼',
        date: setDate(null, null, 'month')
      },
      getParams: {
        date: setDate(null, null, 'month')
      },
      color: '',
      type: '',
      options: [],
      multipleSelectionCheck: [],
      options1: [],
      options2: [],
      dialogForm: {},
      currentInfo: {},
      approve_user: null,
      audit_user: null,
      approveState: null,
      btnLoad: false,
      resultForm: {},
      isShow: false,
      optionsType: [],
      loadingApprove: false,
      tableDataApprove: [],
      tableDataAttendance: [],
      dialogVisibleResult: false,
      tableDataRecord: [],
      dialogVisibleAdd: false,
      loadingRecord: false,
      loadingCheck: false,
      loadingAttendance: false,
      dialogVisibleList: false,
      dialogVisibleRecord: false,
      machineList: [],
      tableHead1: [],
      pickerOptions: {
        disabledDate(time) {
          // 选择今天以及今天之前的日期
          return time.getTime() > Date.now()
        }
      },
      rules: {
        username: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
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
        actual_begin_date: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        actual_end_date: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        work_time: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      loading: false,
      addType: null,
      submit: false,
      tableTop: [],
      time_interval: [],
      isDownload: true,
      dialogVisibleCheck: false,
      tableDataCheck: [],
      searchCheck: {},
      searchCheck1: {},
      section: '',
      date: '',
      equip: '',
      group: '',
      classes: '',
      allList: [],
      isExport: false,
      groupList: [],
      optionsGroup: [],
      allowTime: {},
      multipleSelection: {},
      tableHead: [],
      tableData: [],
      btnExportLoad: false,
      btnExportLoad1: false,
      exportTableShow: false
    }
  },
  created() {
    this.tableHead = getDiffDate(this.search.date + '-01', getCurrentMonthLastDay(setDate()))
    // this.getClassGroup(true)
    this.getList()
    this.getTypeList()
    this.getAllList()
  },
  methods: {
    equipChange(val) {
      if (val) {
        const obj = { all: 1, equip_no: this.search.clock_type === '密炼' ? 'Z' : this.search.clock_type === '细料称量' ? 'F' : 'S' }
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
    async getGroup(val) {
      if (this.dialogForm.username) {
        this.dialogForm.classes = null
        this.dialogForm.group = null
        this.dialogForm.actual_begin_date = null
        this.dialogForm.actual_end_date = null
        this.dialogForm.actual_time = null
        const obj = { class_name: '班组', factory_date: val, clock_type: this.search.clock_type, name: this.dialogForm.username }
        const data = await classesListUrl('get', null, { params: obj })
        if (data.results.length > 0) {
          this.optionsGroup = data.results
          this.getAllowTime(val, this.dialogForm.username)
        } else {
          this.optionsGroup = []
          this.$message.info('当天没有排班记录')
        }
      } else {
        this.$message('请先选择姓名')
      }
    },
    async getClasses(val, val1) {
      try {
        const data = await currentFactoryDate('get', null, { params: { select_date: val, group: val1 }})
        this.classes = data.classes
        this.$set(this.dialogForm, 'classes', data.classes)
      } catch (e) {
        //
      }
    },
    getCheckEquip() {
      this.searchCheck.equip = this.searchCheck1.equip.join(',')
      this.getCheckList()
    },
    getCheckSection() {
      this.searchCheck.section = this.searchCheck1.section.join(',')
      this.getCheckList()
    },
    async getAllList() {
      const data = await personnels('get', null, { params: { all: 1, attendance: 1 }})
      this.allList = data.results
    },
    async getAllowTime(date, name, row, type) {
      const data = await attendanceTimeStatistics('get', null, { params: { name: name, work_time: date, clock_type: this.search.clock_type }})
      this.allowTime = data
      if (type === 1) {
        this.time_interval = this.allowTime[row.classes]
        if (Date.parse(new Date(row.actual_begin_date)) > Date.parse(new Date(this.time_interval[1])) ||
      Date.parse(new Date(row.actual_begin_date)) < Date.parse(new Date(this.time_interval[0]))) {
          this.$message('承认上岗时间不在可选范围内，可选范围为：' + this.time_interval.join('-'))
          row.actual_begin_date = null
          row.actual_time = null
          return
        }
        if (Date.parse(new Date(row.actual_begin_date)) >= Date.parse(new Date(row.actual_end_date))) {
          this.$message('请选择正确的承认离岗时间,离岗时间不得在上岗时间之前')
          row.actual_end_date = null
          row.actual_time = null
        } else {
          row.actual_time = getHour(row.actual_begin_date, row.actual_end_date)
        }
      } else if (type === 2) {
        if (!row.actual_begin_date) {
          this.$message('请先选择承认上岗时间')
          row.actual_end_date = null
          row.actual_time = null
          return
        }
        this.time_interval = this.allowTime[row.classes]
        if (Date.parse(new Date(row.actual_end_date)) > Date.parse(new Date(this.time_interval[1])) ||
      Date.parse(new Date(row.actual_end_date)) < Date.parse(new Date(this.time_interval[0]))) {
          this.$message('承认离岗时间不在可选范围内，可选范围为：' + this.time_interval.join('-'))
          row.actual_end_date = null
          row.actual_time = null
          return
        }
        if (Date.parse(new Date(row.actual_begin_date)) >= Date.parse(new Date(row.actual_end_date))) {
          this.$message('请选择正确的承认离岗时间,离岗时间不得在上岗时间之前')
          row.actual_end_date = null
          row.actual_time = null
        } else {
          row.actual_time = getHour(row.actual_begin_date, row.actual_end_date)
        }
      }
    },
    sectionChange(val) {
      if (val) {
        performanceJobLadder('get', null, { params: { all: 1, weight: 1, type: this.search.clock_type }}).then((response) => {
          this.options2 = response.results
        })
      }
    },
    async getTypeList() {
      const obj = { all: 1, class_name: '绩效计算岗位类别' }
      const data = await classesListUrl('get', null, { params: obj })
      this.optionsType = data.results
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionChangeCheck(val) {
      this.multipleSelectionCheck = val
    },
    classChanged(val) {
      this.$set(this.dialogForm, 'classes', val)
    },
    classCheckList(val) {
      this.$set(this.searchCheck, 'classes', val)
      this.getCheckList()
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
          section: this.section,
          classes: this.classes,
          username: this.getParams.name,
          actual_begin_date: null,
          actual_end_date: null,
          actual_time: null,
          is_use: '添加',
          id_card_num: this.currentInfo.id_card_num
        }
      } else {
        if (this.$refs.dialogForm) {
          this.$refs.dialogForm.resetFields()
        }
        this.dialogForm = {
          factory_date: setDate(),
          equip: null,
          group: null,
          classes: null,
          username: '',
          is_use: '添加',
          actual_begin_date: null,
          actual_end_date: null,
          actual_time: null,
          id_card_num: ''
        }
        // this.getGroup(this.dialogForm.factory_date)
      }
    },
    pickClasses() {
      if (this.optionsGroup.find(d => d.group__global_name === this.dialogForm.group)) {
        this.$set(this.dialogForm, 'classes', this.optionsGroup.find(d => d.group__global_name === this.dialogForm.group).classes__global_name)
        this.dialogForm.actual_begin_date = null
        this.dialogForm.actual_end_date = null
        this.dialogForm.actual_time = null
      } else {
        this.$message('当天排班没有此班组')
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await employeeattendancerecords('get', null, { params: this.search })
        this.isDownload = data.export_flag
        this.tableHead1 = data.group_list || []
        this.approve_user = data.approve_user
        this.audit_user = data.audit_user
        this.approveState = (data.state === 0 ? '' : data.state === 1 ? '确认中' : data.state === 2 ? '已审批' : '已审核')
        this.tableData = data.results || []
        this.groupList = data.user_groups
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
    addStartTime() {
      if (!this.dialogForm.classes) {
        this.$message('请先选择班组')
        this.dialogForm.actual_begin_date = null
        this.dialogForm.actual_time = null
        return
      }
      this.time_interval = this.allowTime[this.dialogForm.classes]
      if (Date.parse(new Date(this.dialogForm.actual_begin_date)) > Date.parse(new Date(this.time_interval[1])) ||
      Date.parse(new Date(this.dialogForm.actual_begin_date)) < Date.parse(new Date(this.time_interval[0]))) {
        this.$message('上岗时间不在可选范围内，可选范围为：' + this.time_interval.join('-'))
        this.dialogForm.actual_begin_date = null
        this.dialogForm.actual_time = null
        return
      } else {
        this.dialogForm.begin_date = this.dialogForm.actual_begin_date
      }
      if (Date.parse(new Date(this.dialogForm.actual_begin_date)) >= Date.parse(new Date(this.dialogForm.actual_end_date))) {
        this.$message('请选择正确的离岗时间,离岗时间不得在上岗时间之前')
        this.dialogForm.actual_end_date = null
        this.dialogForm.actual_time = null
      } else {
        this.dialogForm.end_date = this.dialogForm.actual_end_date
        this.$set(this.dialogForm, 'actual_time', getHour(this.dialogForm.actual_begin_date, this.dialogForm.actual_end_date))
        this.dialogForm.work_time = this.dialogForm.actual_time
      }
    },
    addEndTime() {
      if (!this.dialogForm.actual_begin_date) {
        this.$message('请先选择上岗时间')
        this.dialogForm.actual_end_date = null
        this.dialogForm.actual_time = null
        return
      }
      if (Date.parse(new Date(this.dialogForm.actual_end_date)) > Date.parse(new Date(this.time_interval[1])) ||
      Date.parse(new Date(this.dialogForm.actual_end_date)) < Date.parse(new Date(this.time_interval[0]))) {
        this.$message('离岗时间不在可选范围内，可选范围为：' + this.time_interval.join('-'))
        this.dialogForm.actual_end_date = null
        this.dialogForm.actual_time = null
        return
      }
      if (Date.parse(new Date(this.dialogForm.actual_begin_date)) >= Date.parse(new Date(this.dialogForm.actual_end_date))) {
        this.$message('请选择正确的离岗时间,离岗时间不得在上岗时间之前')
        this.dialogForm.actual_end_date = null
        this.dialogForm.actual_time = null
      } else {
        this.dialogForm.end_date = this.dialogForm.actual_end_date
        this.$set(this.dialogForm, 'actual_time', getHour(this.dialogForm.actual_begin_date, this.dialogForm.actual_end_date))
        this.dialogForm.work_time = this.dialogForm.actual_time
      }
    },
    async checkTime(row) {
      if (row.is_check) {
        const data = await attendanceTimeStatistics('get', null, { params: { name: row.name, work_time: row.factory_date, clock_type: this.search.clock_type }})
        this.allowTime = data
        this.$set(row, 'actual_begin_date', this.allowTime[row.classes][0])
        this.$set(row, 'actual_end_date', this.allowTime[row.classes][1])
        this.$set(row, 'actual_time', getHour(row.actual_begin_date, row.actual_end_date))
      }
    },
    changeStartTime(row) {
      this.getAllowTime(row.factory_date, row.username, row, 1)
      // this.time_interval = this.allowTime[row.classes]
      // if (Date.parse(new Date(row.actual_begin_date)) > Date.parse(new Date(this.time_interval[1])) ||
      // Date.parse(new Date(row.actual_begin_date)) < Date.parse(new Date(this.time_interval[0]))) {
      //   this.$message('承认上岗时间不在可选范围内，可选范围为：' + this.time_interval.join('-'))
      //   row.actual_begin_date = null
      //   row.actual_time = null
      //   return
      // }
      // if (Date.parse(new Date(row.actual_begin_date)) >= Date.parse(new Date(row.actual_end_date))) {
      //   this.$message('请选择正确的承认离岗时间,离岗时间不得在上岗时间之前')
      //   row.actual_end_date = null
      //   row.actual_time = null
      // } else {
      //   row.actual_time = getHour(row.actual_begin_date, row.actual_end_date)
      // }
    },
    changeEndTime(row) {
      this.getAllowTime(row.factory_date, row.username, row, 2)
      // if (!row.actual_begin_date) {
      //   this.$message('请先选择承认上岗时间')
      //   row.actual_end_date = null
      //   row.actual_time = null
      //   return
      // }
      // this.time_interval = this.allowTime[row.classes]
      // if (Date.parse(new Date(row.actual_end_date)) > Date.parse(new Date(this.time_interval[1])) ||
      // Date.parse(new Date(row.actual_end_date)) < Date.parse(new Date(this.time_interval[0]))) {
      //   this.$message('承认离岗时间不在可选范围内，可选范围为：' + this.time_interval.join('-'))
      //   row.actual_end_date = null
      //   row.actual_time = null
      //   return
      // }
      // if (Date.parse(new Date(row.actual_begin_date)) >= Date.parse(new Date(row.actual_end_date))) {
      //   this.$message('请选择正确的承认离岗时间,离岗时间不得在上岗时间之前')
      //   row.actual_end_date = null
      //   row.actual_time = null
      // } else {
      //   row.actual_time = getHour(row.actual_begin_date, row.actual_end_date)
      // }
    },
    async editStatus(val) {
      if (val === '废弃') {
        if (this.multipleSelection.id) {
          try {
            await attendanceTimeStatistics('put', this.multipleSelection.id, { data: { is_use: val }})
            this.$message.success('操作成功')
            this.attendanceList()
            this.getList()
          } catch (e) {
          //
          }
        } else {
          this.$message('请先选中一条数据')
        }
      } else if (val === '确认') {
        try {
          var arr = JSON.parse(JSON.stringify(this.tableDataAttendance))
          if (arr.some(d => !d.actual_begin_date || !d.actual_end_date)) {
            this.$message('承认上岗时间和承认离岗时间必填')
            return
          }
          arr.forEach(d => {
            d.is_use = '确认'
          })
          await attendanceTimeStatistics('post', null, { data: { confirm_list: arr, clock_type: this.search.clock_type }})
          this.$message.success('操作成功')
          this.color = '#141414'
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
          await attendanceTimeStatistics('post', null, { data: { reject_list: arr1, clock_type: this.search.clock_type }})
          this.$message.success('操作成功')
          this.color = '#DA1F27'
          this.attendanceList()
          this.getList()
        } catch (e) {
          //
        }
      }
    },
    async editStatusCheck(val) {
      if (this.multipleSelectionCheck.length > 0) {
        var arr = JSON.parse(JSON.stringify(this.multipleSelectionCheck))
        if (val === '废弃') {
          try {
            arr.forEach(d => {
              d.is_use = '废弃'
            })
            await attendanceTimeStatistics('post', null, { data: { abandon_list: arr, clock_type: this.search.clock_type }})
            this.$message.success('操作成功')
            this.getCheckList()
            this.getList()
          } catch (e) {
            //
          }
        } else if (val === '确认') {
          try {
            if (arr.some(d => !d.actual_begin_date || !d.actual_end_date)) {
              this.$message('承认上岗时间和承认离岗时间必填')
              return
            }
            arr.forEach(d => {
              d.is_use = '确认'
            })
            await attendanceTimeStatistics('post', null, { data: { confirm_list: arr, clock_type: this.search.clock_type }})
            this.$message.success('操作成功')
            this.getCheckList()
            this.getList()
          } catch (e) {
          //
          }
        }
      } else {
        this.$message('请选择数据')
      }
    },
    async approve(val) {
      try {
        this.resultForm = { result: true }
        this.type = val
        this.dialogVisibleResult = true
        this.loadingApprove = true
        const data = await attendanceResultAudit('get', null, { params: { clock_type: this.search.clock_type, date: this.search.date }})
        this.tableDataApprove = data.results
        this.loadingApprove = false
      } catch (e) {
        this.loadingApprove = false
      }
    },
    showList() {
      if (this.isShow) {
        this.tableDataAttendance = this.tableTop
      } else {
        if (this.search.clock_type === '密炼') {
          this.tableDataAttendance = this.tableTop.filter(d =>
            d.factory_date === this.date &&
          d.equip === this.equip &&
          d.classes === this.classes &&
          d.group === this.group &&
          d.section === this.section
          )
        } else {
          this.tableDataAttendance = this.tableTop.filter(d =>
            d.factory_date === this.date &&
          d.equip === this.equip &&
          d.group === this.group &&
          d.section === this.section
          )
        }
      }
    },
    async getCheckList() {
      try {
        this.searchCheck.clock_type = this.search.clock_type
        this.loadingCheck = true
        const data = await attendanceTimeStatistics('get', null, { params: this.searchCheck })
        this.tableDataCheck = data.results
        this.getAllowTime(this.searchCheck.date)
        this.$refs.multipleTable.clearSelection()
        this.loadingCheck = false
      } catch (e) {
        this.loadingCheck = false
      }
    },
    async approveCheck() {
      this.dialogVisibleCheck = true
      this.searchCheck = {
        classes_handle: 1,
        date: setDate()
      }
      const data = await currentFactoryDate('get', null, { params: { select_date: setDate() }})
      this.$set(this.searchCheck, 'classes', data.classes)
      this.getCheckList()
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
        this.resultForm.clock_type = this.search.clock_type
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
      this.dialogForm.clock_type = this.search.clock_type
      this.dialogForm.standard_begin_date = this.time_interval[0]
      this.dialogForm.standard_end_date = this.time_interval[1]
      this.dialogForm.calculate_begin_date = this.dialogForm.actual_begin_date
      this.dialogForm.calculate_end_date = this.dialogForm.actual_end_date
      this.$refs.dialogForm.validate(async(valid) => {
        if (valid) {
          try {
            this.submit = true
            await attendanceTimeStatistics('post', null, { data: { report_list: [this.dialogForm] }})
            this.$message.success('操作成功')
            this.submit = false
            this.dialogVisibleAdd = false
            if (this.addType === '里面') {
              this.attendanceList()
            }
            if (this.dialogVisibleCheck) {
              this.getCheckList()
            }
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
      this.getGroup(this.dialogForm.factory_date)
      if (this.allList.find(d => this.dialogForm.username === d.username)) {
        this.dialogForm.id_card_num = this.allList.find(d => this.dialogForm.username === d.username).id_card_num
      } else {
        this.dialogForm.id_card_num = ''
      }
    },
    async attendanceList(val, group, day, row, classes, length, color) {
      if (val) {
        this.isShow = false
        this.color = color
        this.section = row.section
        this.group = group
        this.date = this.search.date + '-' + day
        this.equip = row.equip
        this.getAllowTime(this.date, val.split('(')[0])
        const data = await currentFactoryDate('get', null, { params: { select_date: this.date, group: this.group }})
        this.classes = data.classes
        this.$set(this.dialogForm, 'classes', data.classes)
        this.getParams.date = this.search.date
        this.getParams.name = val.split('(')[0]
        this.getParams.clock_type = this.search.clock_type
        this.currentInfo.station = '生产部'
        this.dialogVisibleList = true
      }
      try {
        this.loadingAttendance = true
        const data = await attendanceTimeStatistics('get', null, { params: this.getParams })
        this.currentInfo.id_card_num = data.id_card_num
        this.currentInfo.principal = data.principal
        this.tableTop = data.results
        this.showList()
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
    select(row, index) {
      if (row.record_status === '#141414') { // 判断条件
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
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
      setTimeout(d => {
        this.isExport = true
        setTimeout(d => {
          exportExcel('员工出勤记录表', 'disposal-list-components')
          this.isExport = false
        }, 1000)
      }, 100)
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
function getHour(s1, s2) {
  s1 = new Date(s1.replace(/-/g, '/'))
  s2 = new Date(s2.replace(/-/g, '/'))
  var ms = Math.abs(s1.getTime() - s2.getTime())
  var hour = Number((ms / 1000 / 60 / 60).toFixed(2))
  return hour
}
</script>

<style lang="scss">
.statisticalReportAttendance{
    .el-table th{
        padding:0;
    }
    .el-table .cell{
    text-overflow:clip;
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
