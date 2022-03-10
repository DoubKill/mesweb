<template>
  <div class="setAttendance">
    <!-- 设置考勤组 -->
    <el-form :inline="true">
      <el-form-item label="考勤组名称">
        <el-input v-model="search.name" clearable placeholder="考勤组名称" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="考勤负责人">
        <el-input v-model="search.name" clearable placeholder="考勤负责人" @input="changeSearch" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['performance_job_ladder', 'add']" type="primary" @click="onSubmit">新建</el-button>
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
        prop="code"
        label="考勤组名称"
        min-width="20"
      />
      <el-table-column
        prop="type"
        label="参与考勤人员"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="考勤类型"
        min-width="20"
      />
      <el-table-column
        prop="coefficient"
        label="考勤时间"
        min-width="20"
      />
      <el-table-column
        prop="post_standard_name"
        label="考勤组负责人"
        min-width="20"
      />
      <el-table-column
        prop="post_coefficient"
        label="上班打卡多久后可打下班卡(分钟)"
        width="220"
      />
      <el-table-column
        prop="post_coefficient"
        label="提前多久可打上班卡(分钟)"
        min-width="20"
      />
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['performance_job_ladder', 'change']"
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['performance_job_ladder', 'delete']"
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
        <el-form-item label="考勤组名称" prop="name">
          <el-input v-model="dialogForm.name" style="width:250px" />
        </el-form-item>
        <el-form-item label="考勤参与人员" prop="repair_standard_name">
          <el-input
            v-model="dialogForm.repair_standard_name"
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
        <el-form-item label="考勤类型" prop="type">
          <el-select v-model="dialogForm.type" placeholder="请选择" style="width:250px">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考勤时间" prop="time">
          <el-time-picker
            v-model="dialogForm.value"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            placeholder="任意时间点"
          />
          -
          <el-time-picker
            v-model="dialogForm.value1"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            placeholder="任意时间点"
          />
        </el-form-item>
        <el-form-item label="考勤负责人" prop="repair_standard_name">
          <el-input
            v-model="dialogForm.repair_standard_name"
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
        <el-form-item label="上班打卡多久后可打下班卡(分钟)" prop="post_coefficient">
          <el-input-number v-model="dialogForm.post_coefficient" :min="0" style="width:250px" />
        </el-form-item>
        <el-form-item label="提前多久可打上班卡(分钟)" prop="post_coefficient">
          <el-input-number v-model="dialogForm.post_coefficient" :min="0" style="width:250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加考勤参与人员"
      :visible.sync="dialogVisiblePerson"
      width="30%"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="部门" prop="type">
          <el-select v-model="department" placeholder="请选择" style="width:250px">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="选择人员" style="" prop="checkList">
          <el-checkbox-group v-model="checkList" v-loading="loadPerson" style="width:400px">
            <template v-for="(item, index) in staffList">
              <el-checkbox :key="index" :label="item" />
            </template>
          </el-checkbox-group>
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
// import { classesListUrl } from '@/api/base_w'
import { performanceJobLadder } from '@/api/jqy'
export default {
  name: 'SetAttendance',
  components: { page },
  data() {
    var validatePass = (rule, value, callback) => {
      if (!this.dialogForm.value) {
        callback(new Error('请选择考勤开始时间'))
      } else if (!this.dialogForm.value1) {
        callback(new Error('请选择考勤结束时间'))
      } else {
        callback()
      }
    }
    return {
      search: {},
      tableData: [],
      total: 0,
      loading: false,
      loadPerson: false,
      department: '',
      options: ['固定时间上下班', '按排班时间上下班', '不固定时间上下班'],
      dialogVisible: false,
      dialogVisiblePerson: false,
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        time: [{ required: true, validator: validatePass, trigger: 'change' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }],
        post_coefficient: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      checkList: [],
      staffList: ['张三', '李四', '张三'],
      dialogForm: { coefficient: ['Wed Mar 09 2022 16:09:05 GMT+0800 (中国标准时间)', 'Wed Mar 09 2022 17:09:05 GMT+0800 (中国标准时间)'] },
      btnLoading: false
    }
  },
  created() {
    console.log(PersonDisplay(['张三', '李四', '王五']))
    this.getList()
    // this.getTypeList()
  },
  methods: {
    con() {
      console.log(time(this.dialogForm.coefficient[0]))
    },
    pickPerson() {
      this.dialogVisiblePerson = true
    },
    async getList() {
      try {
        this.loading = true
        const data = await performanceJobLadder('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    // async getTypeList() {
    //   const obj = { all: 1, class_name: '绩效计算岗位类别' }
    //   const data = await classesListUrl('get', null, { params: obj })
    //   this.options = data.results
    // },
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
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDelete: function(row) {
      this.$confirm('此操作将删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        performanceJobLadder('delete', row.id, {})
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
    generatePerson() {
      this.dialogVisiblePerson = false
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            await performanceJobLadder(_api, this.dialogForm.id || null, { data: this.dialogForm })
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
function time(obj) {
  var h = obj.getHours() < 10 ? '0' + obj.getHours() : obj.getHours()
  var m = obj.getMinutes() < 10 ? '0' + obj.getMinutes() : obj.getMinutes()
  var s = obj.getSeconds() < 10 ? '0' + obj.getSeconds() : obj.getSeconds()
  return h + ':' + m + ':' + s
}
</script>

<style lang="scss">
</style>
