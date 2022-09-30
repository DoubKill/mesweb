<template>
  <div class="temperature-set">
    <!-- 除尘袋滤器温度标准 -->
    <el-form :inline="true">
      <el-form-item label="具体位置">
        <el-input v-model="getParams.location" clearable @input="changDebounce" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="getParams.station_name" clearable @input="changDebounce" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['check_temperature_standard', 'excel']" :loading="btnExportLoad" type="primary" style="margin-right:8px" @click="templateDownload">导出Excel</el-button>
        <el-upload
          v-permission="['check_temperature_standard', 'excel']"
          style="margin-right:8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button
          v-permission="['check_temperature_standard', 'add']"
          type="primary"
          @click="onSubmit"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
      highlight-current-row
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
        prop="sn"
        label="序号"
      />
      <el-table-column
        prop="location"
        label="具体位置"
      />
      <el-table-column
        prop="station_name"
        label="名称"
      />
      <el-table-column
        prop="temperature_limit"
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
              v-permission="['check_temperature_standard', 'change']"
              size="mini"
              @click="showDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['check_temperature_standard', 'delete']"
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
          <el-input v-model="typeForm.sn" style="width:250px" disabled />
        </el-form-item>
        <el-form-item label="具体位置" prop="location">
          <el-input v-model="typeForm.location" style="width:250px" />
        </el-form-item>
        <el-form-item label="名称" prop="station_name">
          <el-input v-model="typeForm.station_name" style="width:250px" />
        </el-form-item>
        <el-form-item label="温度上限" prop="temperature_limit">
          <el-input-number v-model="typeForm.temperature_limit" controls-position="right" style="width:250px" :min="0" />
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
import { checkTemperatureStandard, checkTemperatureStandardExport } from '@/api/jqy'

export default {
  name: 'TemperatureSet',
  components: { page },
  data: function() {
    return {
      tableData: [],
      dialogEditVisible: false,
      typeForm: {},
      rules: {
        location: [{ required: true, message: '不能为空', trigger: 'blur' }],
        station_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        temperature_limit: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      getParams: {
        page: 1
      },
      excelParams: {
        export_ids: []
      },
      multipleSelection: [],
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
        const data = await checkTemperatureStandard('get', null, { params: this.getParams })
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
      this.dialogEditVisible = true
    },
    handleEdit: function() {
      this.$refs.typeForm.validate(async(valid) => {
        if (valid) {
          try {
            if (!this.typeForm.id) {
              this.typeForm.work_details = this.tableData1
            }
            const _api = this.typeForm.id ? 'put' : 'post'
            this.btnLoading = true
            await checkTemperatureStandard(_api, this.typeForm.id || null, { data: this.typeForm })
            this.btnLoading = false
            this.handleClose(false)
            this.$message.success('操作成功')
            this.getList()
          } catch (e) {
            this.btnLoading = false
            if (e.message) {
              this.$message(e.message)
            }
          }
        }
      })
    },
    handleDelete: function(row) {
      this.$confirm('此操作将删除' + row.station_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkTemperatureStandard('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
    },
    templateDownload() {
      if (this.multipleSelection.length > 0) {
        this.excelParams.export_ids = []
        this.multipleSelection.forEach(d => {
          this.excelParams.export_ids.push(d.id)
        })
        this.btnExportLoad = true
        this.excelParams.excel_flag = 'export'
        checkTemperatureStandardExport('post', null, { responseType: 'blob', data: this.excelParams }).then(response => {
          const link = document.createElement('a')
          const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '除尘袋滤器温度标准定义.xls' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.$refs.multipleTable.clearSelection()
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
      } else {
        this.$message.info('请选择导出数据')
      }
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      formData.append('excel_flag', 'import')
      checkTemperatureStandardExport('post', null, { data: formData }).then(response => {
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
