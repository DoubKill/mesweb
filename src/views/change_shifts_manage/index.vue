<template>
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item
        v-if="permissionObj.workschedule.indexOf('add')>-1"
        style="float: right"
      >
        <el-button @click="showDialogCreateChangeShiftsManage">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="workSchedules"
      style="width: 100%"
    >
      <el-table-column
        prop="schedule_no"
        label="倒班代码"
        width="80px"
      />
      <el-table-column
        prop="schedule_name"
        label="倒班名"
      />
      <el-table-column
        prop="work_procedure_name"
        label="工序"
        width="60px"
      />
      <el-table-column
        prop="period"
        label="周期天数"
        width="60px"
      />
      <el-table-column
        v-for="(class_,index) in classes"
        :key="index"
        :label="class_.global_name"
      >
        <el-table-column label="开始">
          <template slot-scope="scope">
            {{ getTimeCell(scope.row,class_.id,'start_time') }}
          </template>
        </el-table-column>
        <el-table-column label="结束">
          <template slot-scope="scope">
            {{ getTimeCell(scope.row,class_.id,'end_time') }}
          </template>
        </el-table-column>
        <el-table-column label="总时间">
          <template slot-scope="scope">
            {{ getSum(scope.row, class_.id) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        :formatter="formatter"
        prop="used_flag"
        label="使用与否"
        width="60px"
      />
      <el-table-column
        width="150"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="permissionObj.workschedule.indexOf('change')>-1"
              size="mini"
              @click="showEditChangeShiftsManageDialog(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-if="permissionObj.workschedule.indexOf('delete')>-1"
              size="mini"
              type="danger"
              plain
              @click="handleDeleteChangeShiftsManage(scope.row)"
            >{{ scope.row.use_flag ? '停用' : '启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />

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

          prop="schedule_no"
        >
          <el-input v-model="changeShiftsManageForm.schedule_no" />
        </el-form-item>
        <el-form-item
          :error="changeShiftsManageFormError.schedule_name"
          label="倒班名"

          prop="schedule_name"
        >
          <el-input v-model="changeShiftsManageForm.schedule_name" />
        </el-form-item>
        <el-form-item
          :error="changeShiftsManageFormError.description"
          label="描述"
        >
          <el-input v-model="changeShiftsManageForm.description" />
        </el-form-item>

        <el-form-item
          label="周期天数"
        >
          <el-input-number
            v-model="changeShiftsManageForm.period"
            :min="1"
            :max="30"
            @blur="period_change(changeShiftsManageForm, changeShiftsManageForm.period)"
          />
        </el-form-item>

        <el-form-item
          label="工序"

          prop="work_procedure"
        >
          <process-select v-model="changeShiftsManageForm.work_procedure" />
        </el-form-item>

        <div
          v-for="(classesdetail, index) in changeShiftsManageForm.classesdetail_set"
          :key="index"
        >
          <el-divider>{{ classesdetail.classes_name }}</el-divider>
          <el-form-item
            label="时间范围"
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

    <el-dialog
      title="编辑倒班时间"
      :visible.sync="dialogEditChangeShiftsManageVisible"
    >
      <el-form
        ref="shiftsManageEditForm"
        :model="changeShiftsManageForm"
        :rules="rules"
      >
        <el-form-item
          :error="changeShiftsManageFormError.schedule_no"
          label="倒班代码"

          prop="schedule_no"
        >
          <el-input
            v-model="changeShiftsManageForm.schedule_no"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          :error="changeShiftsManageFormError.schedule_name"
          label="倒班名"

          prop="schedule_name"
        >
          <el-input v-model="changeShiftsManageForm.schedule_name" />
        </el-form-item>
        <el-form-item
          :error="changeShiftsManageFormError.description"
          label="描述"
        >
          <el-input v-model="changeShiftsManageForm.description" />
        </el-form-item>
        <el-form-item
          label="周期天数"
        >
          <el-input-number
            v-model.number="changeShiftsManageForm.period"
            :min="1"
            :max="30"
            @blur="period_change(changeShiftsManageForm, changeShiftsManageForm.period)"
          />
        </el-form-item>
        <el-form-item
          label="工序"

          prop="work_procedure"
        >
          <process-select v-model="changeShiftsManageForm.work_procedure" />
        </el-form-item>
        <div
          v-for="(classesdetail, index) in changeShiftsManageForm.classesdetail_set"
          :key="index"
        >
          <el-divider>{{ classesdetail.classes_name }}</el-divider>
          <el-form-item
            label="时间范围"
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
import dayjs from 'dayjs'
import { globalCodesUrl, workSchedulesUrl } from '@/api/base_w'
import pagination from '@/components/page'
import processSelect from '@/components/ProcessSelect'
import commonVal from '@/utils/common'
import { mapGetters } from 'vuex'
export default {
  name: 'EquipBaseInfoManage',
  components: { pagination, processSelect },
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
        work_procedure: null,
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
          { required: true, message: '请输入倒班名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        work_procedure: [
          { required: true, message: '请输选择工序', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created: function() {
    this.permissionObj = this.permission
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
        work_procedure: null,
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
              // eslint-disable-next-line handle-callback-err
            }).catch(function(error) {
              // app.$message.error(JSON.stringify(error))
              // for (var key in app.changeShiftsManageFormError) {
              //   if (error[key]) { app.changeShiftsManageFormError[key] = error[key].join(',') }
              // }
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
      this.$refs['shiftsManageEditForm'].validate(function(valid) {
        if (valid) {
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
              // eslint-disable-next-line handle-callback-err
            }).catch(error => { })
        } else {
          return false
        }
      })
    },
    handleDeleteChangeShiftsManage(workSchedule) {
      var app = this
      var str = workSchedule.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + workSchedule.schedule_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        workSchedulesUrl('delete', workSchedule.id)
          .then(function(response) {
            app.$message({
              type: 'success',
              message: '操作成功!'
            })
            app.getList()
          }).catch(function(error) {
            app.$message.error(error)
          })
      }).catch(() => {
      })
    },
    getCellText(workSchedule, index, key) {
      var class_name = '夜班'
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
    getSum(row, id) {
      const obj = row.classesdetail_set.filter(D => Number(D.classes) === Number(id))
      if (obj[0]) {
        var start_time_set = obj[0].start_time.split(':')
        var end_time_set = obj[0].end_time.split(':')
        var start_time = dayjs()
          .set('hour', start_time_set[0])
          .set('minute', start_time_set[1])
          .set('second', start_time_set[2])
        var end_time = dayjs()
          .set('hour', end_time_set[0])
          .set('minute', end_time_set[1])
          .set('second', end_time_set[2])
        var diff_minute = end_time.diff(start_time, 'minute')
        if (diff_minute < 0) {
          diff_minute = -diff_minute
        }
        return (diff_minute / 60).toFixed(2)
      }
    },
    getTimeCell(row, id, params) {
      const obj = row.classesdetail_set.filter(D => Number(D.classes) === Number(id))
      return obj[0] ? obj[0][params] : ''
    },
    formatter: function(row, column) {
      return row.use_flag ? 'Y' : 'N'
    },
    period_change(row, value) {
      if (!value) {
        row.period = 1
      }
    }
  }
}
</script>

<style scoped>
/* @import '~bootstrap/dist/css/bootstrap.min.css' */
</style>
