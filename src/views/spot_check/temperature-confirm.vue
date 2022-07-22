<template>
  <div class="temperature-confirm">
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
      <el-form-item label="状态">
        <el-select
          v-model="getParams.work_type"
          style="width:100px"
          placeholder="请选择"
          clearable
          @change="changSelect"
        >
          <el-option
            v-for="item in ['新建','已检查','已确认']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['equip_job_standard', 'add']"
          type="primary"
          @click="confirm"
        >批量确认</el-button>
        <el-button v-permission="['equip_job_standard', 'export']" :loading="btnExportLoad" type="primary" @click="templateDownload">导出Excel</el-button>
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
      row-key="id"
      :reserve-selection="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column
        prop="standard_code"
        label="日期"
      />
      <el-table-column
        prop="created_username"
        label="温度是否有超标"
      />
      <el-table-column
        prop="created_username"
        label="状态"
      />
      <el-table-column
        prop="created_username"
        label="录入人"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
      />
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['equip_job_standard', 'change']"
              size="mini"
              @click="showDialog(scope.row)"
            >检查</el-button>
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
      :title="`岗位安全装置点检表${typeForm.id?'检查':'新建'}`"
      width="1150px"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="typeForm" :rules="rules" :model="typeForm" label-width="150px" inline>
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
        <br>
        <el-form-item label="具体位置">
          <el-select
            v-model="typeForm.equip_no"
            style="width:250px"
            placeholder=""
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-select
            v-model="typeForm.equip_no"
            style="width:250px"
            placeholder=""
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="检查内容">
          <el-checkbox v-model="check">只显示超标项目</el-checkbox>
          <el-table
            :data="tableData1"
            border
            max-height="350"
            style="width: 780px"
          >
            <el-table-column
              prop="date"
              label="序号"
              width="80"
            />
            <el-table-column
              prop="date"
              label="具体位置"
              width="150"
            />
            <el-table-column
              prop="date"
              label="名称"
              width="200"
            />
            <el-table-column
              prop="date"
              label="温度上限(℃)"
              width="150"
            />
            <el-table-column
              prop="date"
              label="温度"
              width="199"
            >
              <template slot-scope="{row}">
                <el-input-number v-model="row.classes" style="width:160px" controls-position="right" />
              </template>
            </el-table-column>
          </el-table>
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

    <el-dialog
      title="除尘袋滤器温度检查记录表  确认"
      width="30%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="typeForm1" label-width="150px" inline>
        <el-form-item label="确认备注" prop="classes">
          <el-input
            v-model="typeForm1.classes"
            type="textarea"
            :rows="4"
            controls-position="right"
            style="width:250px"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="handleConfirm"
        >确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { equipJobItemStandard } from '@/api/base_w_four'
import { setDate } from '@/utils'

export default {
  name: 'SpotCheckConfirm',
  components: { page },
  data: function() {
    return {
      dateValue: [],
      tableData: [],
      tableData1: [],
      check: false,
      dialogEditVisible: false,
      dialogVisible: false,
      multipleSelection: [],
      typeForm: {},
      typeForm1: {},
      rules: {
        date: [{ required: true, message: '不能为空', trigger: 'blur' }],
        standard_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        classes: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_no: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      getParams: {
        page: 1
      },
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
  },
  methods: {
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
      this.dialogEditVisible = true
      this.typeForm = { date: setDate() }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    confirm() {
      if (this.multipleSelection.length > 0) {
        this.dialogVisible = true
        this.typeForm1 = {}
      } else {
        this.$message.info('请选择所需确认数据')
        return
      }
    },
    handleConfirm() {
      this.dialogVisible = false
    },
    showDialog(row) {
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
</style>
