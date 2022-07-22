<template>
  <div class="spot-check-confirm">
    <!-- 安全装置点检表确认及查询 -->
    <el-form :inline="true">
      <el-form-item label="起止日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select
          style="width:100px"
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="点检表名称">
        <el-input v-model="getParams.standard_name" clearable @input="changDebounce" />
      </el-form-item>
      <el-form-item label="机台">
        <el-select
          v-model="getParams.equip_no"
          style="width:150px"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.equip_no"
            :value="item.equip_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位">
        <el-select
          v-model="getParams.work_type"
          style="width:150px"
          placeholder="请选择"
          clearable
          @change="changSelect"
        >
          <el-option
            v-for="item in ['巡检','保养','维修','润滑','标定']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="getParams.work_type"
          style="width:100px"
          placeholder="请选择"
          clearable
          @change="changSelect"
        >
          <el-option
            v-for="item in ['新建','已点检','已确认']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['equip_job_standard', 'export']" :loading="btnExportLoad" type="primary" style="margin-right:8px" @click="templateDownload">导出Excel</el-button>
        <el-button
          v-permission="['equip_job_standard', 'add']"
          type="primary"
          @click="onSubmit"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="singleTable"
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
      highlight-current-row
      row-key="id"
      :reserve-selection="true"
    >
      <el-table-column
        prop="standard_code"
        label="日期"
      />
      <el-table-column
        prop="standard_name"
        label="班次"
      />
      <el-table-column
        prop="standard_code"
        label="点检表编号"
      />
      <el-table-column
        prop="standard_code"
        label="点检表名称"
      />
      <el-table-column
        prop="equip"
        label="机台"
      />
      <el-table-column
        prop="created_username"
        label="岗位"
      />
      <el-table-column
        prop="created_username"
        label="点检结果"
      />
      <el-table-column
        prop="created_username"
        label="是否修复"
      />
      <el-table-column
        prop="created_username"
        label="状态"
      />
      <el-table-column
        prop="created_username"
        label="点检人"
      />
      <el-table-column
        prop="created_date"
        label="点检时间"
      />
      <el-table-column
        prop="created_username"
        label="确认人"
      />
      <el-table-column
        prop="created_date"
        label="确认时间"
      />
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['equip_job_standard', 'change']"
              size="mini"
              @click="showDialog(scope.row)"
            >点检</el-button>
            <el-button
              v-permission="['equip_job_standard', 'delete']"
              size="mini"
              type="success"
              plain
              @click="showDialog(scope.row,true)"
            >确认
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      v-if="!loading"
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`岗位安全装置点检表${typeForm.id&&isLook?'确认':typeForm.id?'点检':'新建'}`"
      width="1150px"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="typeForm" :rules="rules" :model="typeForm" label-width="150px" inline>
        <el-form-item label="点检表编号">
          <el-input v-model="typeForm.standard_name" style="width:250px" disabled />
        </el-form-item>
        <br>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="typeForm.date"
            style="width:250px"
            :disabled="typeForm.id?true:false"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="班次" prop="classes">
          <class-select
            :is-disabled="typeForm.id?true:false"
            style="width:250px"
            @classSelected="classChanged1"
          />
        </el-form-item>
        <br>
        <el-form-item label="适用机台" prop="equip_no">
          <el-select
            v-model="typeForm.equip_no"
            :disabled="typeForm.id?true:false"
            style="width:250px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="standard_name">
          <el-input v-model="typeForm.standard_name" :disabled="typeForm.id?true:false" style="width:250px" />
        </el-form-item>
        <br>
        <el-form-item label="点检内容">
          <el-table
            :data="tableData1"
            border
            max-height="350"
            style="width: 940px"
          >
            <el-table-column
              prop="date"
              label="作业内容"
              width="320"
            />
            <el-table-column
              prop="date"
              label="检查方法"
              width="320"
            />
            <el-table-column
              prop="date"
              label="检查结果"
              width="150"
            >
              <template slot-scope="{row}">
                <el-select
                  v-model="row.content"
                  :disabled="isLook"
                  placeholder=""
                  clearable
                >
                  <el-option
                    v-for="item in ['好','坏']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              label="是否修复"
              width="149"
            >
              <template slot-scope="{row}">
                <el-select
                  v-model="row.content"
                  :disabled="isLook"
                  placeholder=""
                  clearable
                >
                  <el-option
                    v-for="item in ['是','否']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-if="isLook" label="异常确认说明">
          <el-input
            v-model="typeForm.standard_name"
            type="textarea"
            :rows="4"
            style="width:350px"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="handleEdit"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { getEquip } from '@/api/banburying-performance-manage'
import { equipJobItemStandard } from '@/api/base_w_four'
import classSelect from '@/components/ClassSelect'
import { setDate } from '@/utils'

export default {
  name: 'SpotCheckConfirm',
  components: { page, classSelect },
  data: function() {
    return {
      dateValue: [],
      tableData: [],
      tableData1: [],
      dialogEditVisible: false,
      typeForm: {},
      rules: {
        date: [{ required: true, message: '不能为空', trigger: 'blur' }],
        standard_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        classes: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_no: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      getParams: {
        page: 1
      },
      isLook: false,
      currentPage: 1,
      total: 1,
      loading: false,
      options: [],
      btnLoading: false,
      btnExportLoad: false
    }
  },
  created() {
    this.getList()
    this.visibleChange()
  },
  methods: {
    visibleChange() {
      const obj = { all: 1, category_name: '密炼设备' }
      getEquip(obj).then(response => {
        this.options = response.results
      })
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipJobItemStandard('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.total = data.count || 0
        this.loading = false
      } catch (error) {
        this.loading = false
        this.tableData = []
      }
    },
    handleClose(done) {
      this.dialogEditVisible = false
      this.tableData1 = []
      this.typeForm = {}
      setTimeout(d => {
        this.$refs.typeForm.clearValidate()
      })
      if (done) {
        done()
      }
    },
    onSubmit() {
      this.isLook = false
      this.dialogEditVisible = true
      this.typeForm = { date: setDate() }
    },
    changSelect() {
      this.getParams.page = 1
      this.getList()
    },
    changDebounce() {
      this.$debounce(this, 'changSelect')
    },
    changeDate(arr) {
      this.getParams.s_time = arr ? arr[0] : ''
      this.getParams.e_time = arr ? arr[1] : ''
      this.getList()
    },
    classChanged(val) {
      this.getParams.classes = val
      this.getParams.page = 1
      this.getList()
    },
    classChanged1(val) {
      this.$set(this.typeForm, 'classes', val)
    },
    showDialog(row, val) {
      if (val) {
        this.isLook = true
      } else {
        this.isLook = false
      }
      this.typeForm = JSON.parse(JSON.stringify(row))
      this.tableData1 = this.typeForm.work_details
      this.dialogEditVisible = true
    },
    handleEdit: function() {
      this.$refs.typeForm.validate(async(valid) => {
        if (valid) {
          try {
            if (this.tableData1.length === 0) {
              throw new Error('作业详情内容未添加')
            }
            if (!this.typeForm.id) {
              this.typeForm.work_details = this.tableData1
            }
            const _api = this.typeForm.id ? 'put' : 'post'
            this.tableData1.forEach(d => {
              if (!d.content || !d.check_standard_desc || !d.check_standard_type) {
                throw new Error('除单位外每行数据必填')
              }
            })
            this.btnLoading = true
            await equipJobItemStandard(_api, this.typeForm.id || null, { data: this.typeForm })
            this.btnLoading = false
            this.handleClose(false)
            this.$message.success('添加成功')
            this.getList()
          } catch (e) {
            this.btnLoading = false
            this.loading = false
            if (e.message) {
              this.$message(e.message)
            }
          }
        }
      })
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
    },
    templateDownload() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.getParams)
      equipJobItemStandard('get', null, { responseType: 'blob', params: obj }).then(response => {
        const link = document.createElement('a')
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.download = '作业项目标准定义.xls' // 下载的文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.btnExportLoad = false
      }).catch(e => {
        this.btnExportLoad = false
      })
    }
  }
}

</script>
<style lang="scss">
.spot-check-confirm{
  .el-dialog{
    margin-top:10vh !important
  }
}
</style>
