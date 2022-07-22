<template>
  <div class="temperature-set">
    <!-- 除尘袋滤器记录检查表确认 -->
    <el-form :inline="true">
      <el-form-item label="具体位置">
        <el-input v-model="getParams.standard_name" clearable @input="changDebounce" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="getParams.standard_name" clearable @input="changDebounce" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['equip_job_standard', 'export']" :loading="btnExportLoad" type="primary" style="margin-right:8px" @click="templateDownload">导出Excel</el-button>
        <el-upload
          v-permission="['equip_job_standard', 'import']"
          style="margin-right:8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
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
        label="序号"
      />
      <el-table-column
        prop="standard_name"
        label="具体位置"
      />
      <el-table-column
        prop="standard_code"
        label="名称"
      />
      <el-table-column
        prop="standard_code"
        label="温度上限(℃)"
      />
      <el-table-column
        prop="created_username"
        label="录入人"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['equip_job_standard', 'change']"
              size="mini"
              @click="showDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['equip_job_standard', 'delete']"
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
      v-if="!loading"
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${typeForm.id?'修改':'新建'}除尘袋滤器温度检查记录表`"
      width="500px"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="typeForm" :rules="rules" :model="typeForm" label-width="100px">
        <el-form-item label="序号">
          <el-input v-model="typeForm.standard_name" style="width:250px" disabled />
        </el-form-item>
        <el-form-item label="具体位置" prop="standard_code">
          <el-input v-model="typeForm.standard_code" style="width:250px" />
        </el-form-item>
        <el-form-item label="名称" prop="standard_name">
          <el-input v-model="typeForm.standard_name" style="width:250px" />
        </el-form-item>
        <el-form-item label="温度上限" prop="temperature">
          <el-input-number v-model="typeForm.temperature" controls-position="right" style="width:250px" />
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
import { equipJobItemStandard, equipJobItemStandardImport } from '@/api/base_w_four'

export default {
  name: 'TemperatureSet',
  components: { page },
  data: function() {
    return {
      tableData: [],
      tableData1: [],
      dialogEditVisible: false,
      typeForm: {},
      rules: {
        standard_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        standard_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        temperature: [{ required: true, message: '不能为空', trigger: 'change' }]
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
      this.typeForm = { equip_no: [] }
    },
    changSelect() {
      this.getParams.page = 1
      this.getList()
    },
    changDebounce() {
      this.$debounce(this, 'changSelect')
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
              throw new Error('点检内容未添加')
            }
            if (!this.typeForm.id) {
              this.typeForm.work_details = this.tableData1
            }
            const _api = this.typeForm.id ? 'put' : 'post'
            this.tableData1.forEach(d => {
              if (!d.content || !d.check_standard_desc) {
                throw new Error('点检内容及检查方法必填')
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
    handleDelete: function(row) {
      this.$confirm('此操作将删除' + row.standard_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipJobItemStandard('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
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
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      equipJobItemStandardImport('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: response
        })
        this.getParams.page = 1
        this.getList()
      })
    }
  }
}

</script>
<style lang="scss">
</style>
