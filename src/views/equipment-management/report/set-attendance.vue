<template>
  <div class="setAttendance">
    <!-- 设置考勤组 -->
    <el-form :inline="true">
      <el-form-item label="考勤组名称">
        <el-input v-model="search.attendance_group" clearable placeholder="考勤组名称" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="考勤负责人">
        <el-input v-model="search.principal" clearable placeholder="考勤负责人" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="参与考勤人员">
        <el-input v-model="search.attendance_users" clearable placeholder="考勤负责人" @input="changeSearch" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['attendance_group_setup', 'add']" type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="attendance_group"
        label="考勤组名称"
        min-width="20"
      />
      <el-table-column
        prop="group"
        label="关联班组"
        min-width="20"
      />
      <el-table-column
        prop="work_schedule_name"
        label="倒班名称"
        min-width="20"
      />
      <el-table-column
        prop="type"
        label="类别"
        min-width="20"
      />
      <el-table-column
        prop="attendance_users"
        label="参与考勤人员"
        min-width="20"
      />
      <!-- <el-table-column
        prop="attendance_type"
        label="考勤类型"
        min-width="20"
        :formatter="(row)=>{
          let obj = options.find(d=>d.id === row.attendance_type)
          return obj.label
        }"
      /> -->
      <!-- <el-table-column
        label="考勤时间"
        min-width="20"
      >
        <template slot-scope="{row}">
          <span> {{ row.attendance_st }}-{{ row.attendance_et }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="principal"
        label="考勤组负责人"
        min-width="20"
      />
      <el-table-column
        prop="range_time"
        label="上班打卡多久后可打下班卡(分钟)"
        width="220"
      />
      <el-table-column
        prop="lead_time"
        label="提前多久可打上班卡(分钟)"
        min-width="20"
      />
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['attendance_group_setup', 'change']"
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['attendance_group_setup', 'delete']"
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${dialogForm.id?'编辑':'新建'}考勤组`"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="240px"
        :model="dialogForm"
      >
        <el-form-item label="考勤组名称" prop="attendance_group">
          <el-input v-model="dialogForm.attendance_group" style="width:250px" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item label="班组" prop="group">
          <el-select
            v-model="dialogForm.group"
            style="width:250px"
            clearable
            placeholder="请选择"
            @visible-change="getClassGroup"
          >
            <el-option
              v-for="group in groups"
              :key="group.id"
              :label="group.global_name"
              :value="group.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="倒班规则" prop="work_schedule">
          <el-select v-model="dialogForm.work_schedule" placeholder="请选择" style="width:250px">
            <el-option
              v-for="item in workList"
              :key="item.id"
              :label="item.schedule_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-select v-model="dialogForm.type" placeholder="请选择" style="width:250px">
            <el-option
              v-for="item in optionsType"
              :key="item.id"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考勤参与人员" prop="attendance_users">
          <el-input
            v-model="dialogForm.attendance_users"
            :title="dialogForm.attendance_users"
            style="width:250px"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="pickPerson('参与')"
            />
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="考勤类型" prop="attendance_type">
          <el-select v-model="dialogForm.attendance_type" placeholder="请选择" style="width:250px">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="考勤时间" prop="time">
          <el-time-picker
            v-model="dialogForm.attendance_st"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            value-format="HH:mm:ss"
            format="HH:mm:ss"
            placeholder="任意时间点"
          />
          -
          <el-time-picker
            v-model="dialogForm.attendance_et"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            value-format="HH:mm:ss"
            format="HH:mm:ss"
            placeholder="任意时间点"
          />
        </el-form-item> -->
        <el-form-item label="考勤负责人" prop="principal">
          <el-input
            v-model="dialogForm.principal"
            style="width:250px"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="pickPerson('负责')"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="上班打卡多久后可打下班卡(分钟)" prop="range_time">
          <el-input-number v-model="dialogForm.range_time" :min="0" style="width:250px" />
        </el-form-item>
        <el-form-item label="提前多久可打上班卡(分钟)" prop="lead_time">
          <el-input-number v-model="dialogForm.lead_time" :min="0" style="width:250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="pickType==='参与'?'添加考勤参与人员':'添加考勤负责人'"
      :visible.sync="dialogVisiblePerson"
      width="60%"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="部门" prop="type">
          <el-select v-model="department" clearable filterable placeholder="请选择" style="width:250px" @change="getGroupList">
            <el-option
              v-for="item in sectionList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if="pickType!=='参与'" label="名字">
          <el-input v-model="name" clearable placeholder="" style="width:250px" @input="nameSearch" />
        </el-form-item> -->
        <br>
        <el-form-item label="选择人员" style="" prop="checkList">
          <!-- <el-checkbox-group  v-model="checkList" v-loading="loadPerson" style="width:400px"> -->
          <el-transfer
            v-model="checkList"
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入人员名字"
            :titles="['备选人员','已选人员']"
            :data="pickType==='参与'?staffList1:staffList3"
          >
            <div slot-scope="{ option }">
              <el-row>
                <el-col :span="12"><span style="color: #8492a6;width:70px">{{ option.department }}</span></el-col>
                <el-col :span="12"><span style="text-align:left">{{ option.label }}</span></el-col>
              </el-row>
            </div>
          </el-transfer>

          <!-- <template v-for="(item, index) in staffList">
              <el-checkbox :key="index" :label="item.id">{{ item.username }}</el-checkbox>
            </template> -->
          <!-- </el-checkbox-group> -->
          <!-- <el-checkbox-group v-else v-model="checkList" v-loading="loadPerson" style="width:400px">
            <template v-for="(item, index) in staffList">
              <el-checkbox :key="index" :label="item.username" />
            </template>
          </el-checkbox-group> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePerson=false">取 消</el-button>
        <el-button type="primary" @click="generatePerson">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { classesListUrl, workSchedulesUrl, globalCodesUrl } from '@/api/base_w'
import { sectionTree } from '@/api/base_w_four'
import { attendanceGroupSetup, personnels } from '@/api/jqy'
export default {
  name: 'SetAttendance',
  components: { page },
  data() {
    // var validatePass = (rule, value, callback) => {
    //   if (!this.dialogForm.attendance_st) {
    //     callback(new Error('请选择考勤开始时间'))
    //   } else if (!this.dialogForm.attendance_et) {
    //     callback(new Error('请选择考勤结束时间'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      search: {},
      tableData: [],
      staffList1: [],
      staffList2: [],
      staffList3: [],
      total: 0,
      name: '',
      loading: false,
      loadPerson: false,
      department: '',
      pickType: '',
      groups: [],
      sectionList: [],
      optionsType: [],
      options: [{ id: 1, label: '不固定时间上下班' }, { id: 2, label: '按排班时间上下班' }, { id: 3, label: '固定时间上下班' }],
      dialogVisible: false,
      allList: [],
      dialogVisiblePerson: false,
      rules: {
        attendance_group: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }],
        group: [{ required: true, message: '不能为空', trigger: 'change' }],
        attendance_users: [{ required: true, message: '不能为空', trigger: 'blur' }],
        work_schedule: [{ required: true, message: '不能为空', trigger: 'change' }],
        // time: [{ required: true, validator: validatePass, trigger: 'change' }],
        // attendance_type: [{ required: true, message: '不能为空', trigger: 'change' }],
        principal: [{ required: true, message: '不能为空', trigger: 'blur' }],
        range_time: [{ required: true, message: '不能为空', trigger: 'change' }],
        lead_time: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      checkList: [],
      staffList: [],
      workList: [],
      dialogForm: {},
      btnLoading: false
    }
  },
  created() {
    this.getList()
    this.getSection()
    this.getTypeList()
    this.getAllList()
    this.getWorkSchedules()
  },
  methods: {
    async getAllList() {
      const data = await personnels('get', null, { params: { all: 1 }})
      this.allList = data.results
    },
    async getWorkSchedules() {
      try {
        // eslint-disable-next-line object-curly-spacing
        const workSchedulesData = await workSchedulesUrl('get', null,
          { params: { all: 1 }})
        this.workList = workSchedulesData.results
        // eslint-disable-next-line no-empty
      } catch (e) { }
    },
    pickPerson(val) {
      this.pickType = val
      if (this.pickType === '参与') {
        this.checkList = this.dialogForm.users
      } else {
        this.checkList = PickDisplay(this.dialogForm.principal)
      }
      this.department = ''
      this.getGroupList()
      this.dialogVisiblePerson = true
    },
    generatePerson() {
      if (this.pickType === '参与') {
        if (this.checkList.length === 0) {
          this.$message('请选择考勤人员')
          return
        } else {
          this.$set(this.dialogForm, 'users', this.checkList)
          const arr = []
          this.checkList.forEach(d => {
            this.allList.forEach(item => {
              if (item.id === d) {
                arr.push(item.username)
              }
            })
          })
          this.$set(this.dialogForm, 'attendance_users', PersonDisplay(arr))
          this.dialogVisiblePerson = false
        }
      } else {
        if (this.checkList.length === 0) {
          this.$message('请选择考勤负责人')
          return
        } else {
          this.$set(this.dialogForm, 'principal', PersonDisplay(this.checkList))
          this.dialogVisiblePerson = false
        }
      }
    },
    async getTypeList() {
      const obj = { all: 1, class_name: '绩效计算岗位类别' }
      const data = await classesListUrl('get', null, { params: obj })
      this.optionsType = data.results
    },
    nameSearch() {
      if (this.name !== '') {
        this.staffList = this.staffList2.filter(d => { return (d.username.indexOf(this.name) !== -1) })
      } else {
        this.staffList = this.staffList2
      }
    },
    async getGroupList() {
      this.staffList1 = []
      this.staffList3 = []
      var params = {}
      if (this.department === '') {
        params = { all: 1 }
      } else {
        params = { section_name: this.department, all: 1 }
      }
      const data = await personnels('get', null, { params: params })
      this.staffList = data.results
      this.staffList2 = JSON.parse(JSON.stringify(data.results))
      this.staffList.forEach(d => {
        this.staffList1.push({
          key: d.id,
          department: d.section__name,
          label: d.username
        })
        this.staffList3.push({
          key: d.username,
          department: d.section__name,
          label: d.username
        })
      }
      )
    },
    getClassGroup(val) {
      if (val) {
        globalCodesUrl('get', {
          params: {
            class_name: '班组'
          }
        }).then((response) => {
          this.groups = response.results
        }).catch(function() {
        })
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await attendanceGroupSetup('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getSection() {
      const data = await sectionTree('get', null, { params: { all: 1 }})
      this.sectionList = data.results
    },
    changeSearch() {
      this.search.page = 1
      this.$debounce(this, 'getList')
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    async onSubmit() {
      this.dialogForm = { range_time: 60, lead_time: 60, users: [] }
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDelete: function(row) {
      this.$confirm('此操作将删除' + row.attendance_group + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        attendanceGroupSetup('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.createForm.resetFields()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            await attendanceGroupSetup(_api, this.dialogForm.id || null, { data: this.dialogForm })
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
function PersonDisplay(arr) {
  if (arr.length === 0) {
    return
  } else {
    var a = ''
    arr.forEach(d => {
      a += d + ','
    })
    return a.substr(0, a.length - 1)
  }
}
function PickDisplay(string) {
  if (!string) {
    return []
  } else {
    return string.split(',')
  }
}
</script>

<style lang="scss">
.setAttendance{
  .el-transfer-panel__item{
    margin-right:10px
  }
  .el-checkbox:last-of-type{
    margin-right:10px
  }
  .el-transfer-panel{
    width:250px;
    // height:650px
  }
  .el-transfer-panel__body{
    height: 450px;
  }
  .el-transfer-panel__list.is-filterable{
    height:395px;
  }
}
</style>
