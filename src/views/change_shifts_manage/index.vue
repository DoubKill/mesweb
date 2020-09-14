<template>
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item style="float: right">
        <!-- {% if perms.basics.add_workschedule %} -->
        <el-button @click="showDialogCreateChangeShiftsManage">新建</el-button>
        <!-- {% endif %} -->
      </el-form-item>
    </el-form>
    <el-table
      :data="workSchedules"
      style="width: 100%"
    >
      <el-table-column
        prop="schedule_no"
        label="倒班代码"
      />
      <el-table-column
        prop="schedule_name"
        label="倒班名"
      />
      <el-table-column
        prop="period"
        label="周期天数"
      />
      <el-table-column
        v-for="(class_,index) in classes"
        :key="index"
        :label="class_.global_name"
      >
        <el-table-column label="开始">
          <template slot-scope="scope">
            {{ getTimeCell(scope.row,class_.global_no,'start_time') }}
          </template>
        </el-table-column>
        <el-table-column label="结束">
          <template slot-scope="scope">
            {{ getTimeCell(scope.row,class_.global_no,'end_time') }}
          </template>
        </el-table-column>
        <el-table-column label="总时间">
          <template slot-scope="scope">
            {{ getTimeCell(scope.row,class_.global_no,'sum') }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column width="150">
        <template slot-scope="scope">
          <el-button-group>
            <!-- {% if perms.basics.change_workschedule %} -->
            <el-button
              size="mini"
              @click="showEditChangeShiftsManageDialog(scope.row)"
            >编辑
            </el-button>
            <!-- {% endif %} -->
            <!-- {% if perms.basics.delete_workschedule %} -->
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteChangeShiftsManage(scope.row)"
            >删除
            </el-button>
            <!-- {% endif %} -->
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      @currentChange="currentChange"
    />

    <!-- {% if perms.basics.add_workschedule %} -->
    <el-dialog
      title="添加倒班时间"
      :visible.sync="dialogCreateChangeShiftsManageVisible"
    >
      <el-form
        ref="shiftsManageForm"
        :model="changeShiftsManageForm"
        :rules="rules"
      >
        <el-form-item
          :error="changeShiftsManageFormError.schedule_no"
          label="倒班代码"
          :label-width="formLabelWidth"
          prop="schedule_no"
        >
          <el-input v-model="changeShiftsManageForm.schedule_no" />
        </el-form-item>
        <el-form-item
          :error="changeShiftsManageFormError.schedule_name"
          label="倒班名"
          :label-width="formLabelWidth"
          prop="schedule_name"
        >
          <el-input v-model="changeShiftsManageForm.schedule_name" />
        </el-form-item>
        <el-form-item
          :error="changeShiftsManageFormError.description"
          label="描述"
          :label-width="formLabelWidth"
        >
          <el-input v-model="changeShiftsManageForm.description" />
        </el-form-item>

        <el-form-item
          label="周期天数"
          :label-width="formLabelWidth"
        >
          <el-input v-model="changeShiftsManageForm.period" />
        </el-form-item>

        <div
          v-for="(classesdetail, index) in changeShiftsManageForm.classesdetail_set"
          :key="index"
        >
          <el-divider>{{ classesdetail.classes_name }}</el-divider>
          <el-form-item
            label="时间范围"
            :label-width="formLabelWidth"
          >
            <el-time-picker
              v-model="classesdetail.start_time"
              value-format="HH:mm:ss"
              placeholder="开始时间"
            />
            <span>至</span>
            <el-time-picker
              v-model="classesdetail.end_time"
              value-format="HH:mm:ss"
              placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item
            label="描述"
            :label-width="formLabelWidth"
          >
            <el-input v-model="classesdetail.description" />
          </el-form-item>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateChangeShiftsManageVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreateChangeShifts"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- {% endif %} -->

    <!-- {% if perms.basics.change_workschedule %} -->
    <el-dialog
      title="编辑倒班时间"
      :visible.sync="dialogEditChangeShiftsManageVisible"
    >
      <el-form :model="changeShiftsManageForm">
        <el-form-item
          :error="changeShiftsManageFormError.schedule_no"
          label="倒班代码"
          :label-width="formLabelWidth"
        >
          <el-input v-model="changeShiftsManageForm.schedule_no" />
        </el-form-item>
        <el-form-item
          :error="changeShiftsManageFormError.schedule_name"
          label="倒班名"
          :label-width="formLabelWidth"
        >
          <el-input v-model="changeShiftsManageForm.schedule_name" />
        </el-form-item>
        <el-form-item
          :error="changeShiftsManageFormError.description"
          label="描述"
          :label-width="formLabelWidth"
        >
          <el-input v-model="changeShiftsManageForm.description" />
        </el-form-item>
        <el-form-item
          label="周期天数"
          :label-width="formLabelWidth"
        >
          <el-input-number
            v-model.number="changeShiftsManageForm.period"
            :min="1"
            :max="30"
          />
        </el-form-item>
        <div
          v-for="(classesdetail, index) in changeShiftsManageForm.classesdetail_set"
          :key="index"
        >
          <el-divider>{{ classesdetail.classes_name }}</el-divider>
          <el-form-item
            label="时间范围"
            :label-width="formLabelWidth"
          >
            <el-time-picker
              v-model="classesdetail.start_time"
              value-format="HH:mm:ss"
              placeholder="开始时间"
            />
            <span>至</span>
            <el-time-picker
              v-model="classesdetail.end_time"
              value-format="HH:mm:ss"
              placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item
            label="描述"
            :label-width="formLabelWidth"
          >
            <el-input v-model="classesdetail.description" />
          </el-form-item>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditChangeShiftsManageVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditChangeShifts"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- {% endif %} -->
  </div>
</template>

<script>
// import dayjs from 'dayjs'
import { globalCodesUrl, workSchedulesUrl } from '@/api/base_w'
import pagination from '@/components/page'
import commonVal from '@/utils/common'
export default {
  components: { pagination },
  data() {
    return {
      loading: true,
      formLabelWidth: commonVal.formLabelWidth,
      tableData: [],
      total: 0,
      getParams: { page: 1 },
      workSchedules: [],
      dialogCreateChangeShiftsManageVisible: false,
      dialogEditChangeShiftsManageVisible: false,
      changeShiftsManageForm: {

        schedule_no: '',
        schedule_name: '',
        description: '',
        period: 0,
        classesdetail_set: [{
          start_time: null,
          end_time: null,
          description: '',
          classes_name: '',
          classes: null
        }
        ]
      },
      changeShiftsManageFormError: {

        schedule_no: '',
        schedule_name: '',
        description: ''
      },
      classes: [],
      rules: {
        schedule_no: [
          { required: true, message: '请输入倒班代码', trigger: 'blur' }
        ],
        schedule_name: [
          { required: true, message: '请输入倒班名', trigger: 'blur' }
        ]
      }
    }
  },
  created: function() {
    var app = this
    globalCodesUrl('get', {
      params: {
        class_name: '班次'
      }
    }).then(function(response) {
      app.classes = response.results
      // eslint-disable-next-line handle-callback-err
    }).catch(function(error) {
    })
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const app = this
      workSchedulesUrl('get', null, {
        params: this.getParams
      }).then(function(response) {
        app.loading = false
        app.total = response.count
        app.tableData = response.results
        app.afterGetData()
      }).catch(function() {
        app.loading = false
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getList()
    },
    initChangeShiftsManageForm() {
      this.changeShiftsManageForm = {

        schedule_no: '',
        schedule_name: '',
        description: '',
        period: 0,
        classesdetail_set: []
      }
      for (var i = 0; i < this.classes.length; ++i) {
        this.changeShiftsManageForm.classesdetail_set.push({

          start_time: null,
          end_time: null,
          description: '',
          classes_name: this.classes[i].global_name,
          classes: this.classes[i].id
        })
      }
    },
    clearChangeShiftsManageFormError() {
      this.changeShiftsManageFormError = {

        schedule_no: '',
        schedule_name: '',
        description: ''
      }
    },
    afterGetData: function() {
      this.workSchedules = this.tableData
    },
    showDialogCreateChangeShiftsManage() {
      this.initChangeShiftsManageForm()
      this.dialogCreateChangeShiftsManageVisible = true
    },
    handleCreateChangeShifts() {
      var app = this
      const changeShiftsManageForm = JSON.parse(JSON.stringify(this.changeShiftsManageForm))
      this.$refs['shiftsManageForm'].validate(function(valid) {
        if (valid) {
          app.clearChangeShiftsManageFormError()
          for (var i = 0; i < changeShiftsManageForm.classesdetail_set.length; ++i) {
            if (changeShiftsManageForm.classesdetail_set[i].start_time &&
              changeShiftsManageForm.classesdetail_set[i].end_time
              // eslint-disable-next-line no-empty
            ) {
            } else {
              changeShiftsManageForm.classesdetail_set.splice(i, 1)
              --i
            }
          }
          if (changeShiftsManageForm.classesdetail_set.length === 0) {
            // 至少选一个班次
            app.$message('请填写班次')
            return
          }
          workSchedulesUrl('post', null, { data: changeShiftsManageForm })
            .then(function(response) {
              app.dialogCreateChangeShiftsManageVisible = false
              app.$message.success(app.changeShiftsManageForm.schedule_name + '创建成功')
              app.getList()
            }).catch(function(error) {
              app.$message.error(JSON.stringify(error))
              for (var key in app.changeShiftsManageFormError) {
                if (error[key]) { app.changeShiftsManageFormError[key] = error[key].join(',') }
              }
            })
        } else {
          return false
        }
      })
    },
    showEditChangeShiftsManageDialog(workSchedule) {
      this.clearChangeShiftsManageFormError()
      // this.changeShiftsManageForm = Object.assign({}, workSchedule);
      this.changeShiftsManageForm = JSON.parse(JSON.stringify(workSchedule))
      // for (var i = 0; i < this.changeShiftsManageForm.classesdetail_set.length; ++i) {
      //
      //     Vue.set(this.changeShiftsManageForm.classesdetail_set[i], "times", [
      //
      //         this.changeShiftsManageForm.classesdetail_set[i].start_time,
      //         this.changeShiftsManageForm.classesdetail_set[i].end_time]);
      // }
      this.dialogEditChangeShiftsManageVisible = true
    },
    handleEditChangeShifts() {
      this.clearChangeShiftsManageFormError()
      var app = this
      const changeShiftsManageForm = JSON.parse(JSON.stringify(this.changeShiftsManageForm))
      for (var i = 0; i < changeShiftsManageForm.classesdetail_set.length; ++i) {
        if (changeShiftsManageForm.classesdetail_set[i].start_time &&
          changeShiftsManageForm.classesdetail_set[i].end_time
        ) {
          // app.changeShiftsManageForm.classesdetail_set[i]['start_time'] = app.changeShiftsManageForm.classesdetail_set[i].times[0];
          // app.changeShiftsManageForm.classesdetail_set[i]['end_time'] = app.changeShiftsManageForm.classesdetail_set[i].times[1];
        } else {
          changeShiftsManageForm.classesdetail_set.splice(i, 1)
          --i
        }
      }
      // for (var i = 0; i < this.changeShiftsManageForm.classesdetail_set.length; ++i) {
      //
      //     if (this.changeShiftsManageForm.classesdetail_set[i].times) {
      //         this.changeShiftsManageForm.classesdetail_set[i]['start_time'] = this.changeShiftsManageForm.classesdetail_set[i].times[0];
      //         this.changeShiftsManageForm.classesdetail_set[i]['end_time'] = this.changeShiftsManageForm.classesdetail_set[i].times[1];
      //     } else {
      //         this.changeShiftsManageForm.classesdetail_set.splice(i, 1)
      //     }
      // }

      workSchedulesUrl('put', changeShiftsManageForm.id, { data: changeShiftsManageForm })
        .then(function(response) {
          app.dialogEditChangeShiftsManageVisible = false
          app.$message(changeShiftsManageForm.schedule_name + '修改成功')
          app.getList()
        }).catch(function(error) {
          app.$message.error(error.response.data.join(','))
          for (var key in app.changeShiftsManageFormError) {
            if (error.response.data[key]) { app.changeShiftsManageFormError[key] = error.response.data[key].join(',') }
          }
        })
    },
    handleDeleteChangeShiftsManage(workSchedule) {
      var app = this
      this.$confirm('此操作将永久删除' + workSchedule.schedule_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        workSchedulesUrl('delete', workSchedule.id)
          .then(function(response) {
            app.$message({
              type: 'success',
              message: '删除成功!'
            })
            app.getList()
          }).catch(function(error) {
            app.$message.error(error)
          })
      }).catch(() => {
      })
    },
    getCellText(workSchedule, index, key) {
      var class_name = '晚班'
      switch (index) {
        case 0:
          class_name = '早班'
          break
        case 1:
          class_name = '中班'
          break
      }
      var classesdetail = workSchedule.classesdetail_set.find(detail => {
        return detail.classes_name === class_name
      })
      if (classesdetail) {
        return classesdetail[key]
      }
    },
    getTimeCell(row, global_no, params) {
      const obj = row.classesdetail_set.filter(D => Number(D.classes) === Number(global_no))
      return obj[0] ? obj[0][params] : ''
    }
  }
}
</script>

<style scoped>
/* @import '~bootstrap/dist/css/bootstrap.min.css' */
</style>
