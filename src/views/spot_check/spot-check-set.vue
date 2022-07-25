<template>
  <div class="spot-check-set">
    <!-- 安全装置点检表点检内容定义 -->
    <el-form :inline="true">
      <el-form-item label="点检表名称">
        <el-input v-model="getParams.point_standard_name" clearable @input="changDebounce" />
      </el-form-item>
      <el-form-item label="机台">
        <el-select
          v-model="getParams.equip_no"
          style="width:150px"
          placeholder="请选择"
          clearable
          @change="changSelect"
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
        <el-input v-model="getParams.station" clearable @input="changDebounce" />
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column
        label="点检表编号"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="showDialog(scope.row,true)"
          >{{ scope.row.point_standard_code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="point_standard_name"
        label="点检表名称"
      />
      <el-table-column
        prop="doc_code"
        label="文档编号"
      />
      <el-table-column
        prop="equip_no"
        label="适用机台"
      />
      <el-table-column
        prop="station"
        label="岗位"
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
      :title="`${typeForm.id&&isLook?'查看':typeForm.id?'修改':'新建'}岗位安全装置点检表`"
      width="950px"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="typeForm" :rules="rules" :model="typeForm" label-width="100px" inline>
        <el-form-item label="点检表编号">
          <el-input v-model="typeForm.point_standard_code" style="width:250px" disabled />
        </el-form-item>
        <br>
        <el-form-item label="点检表名称" prop="point_standard_name">
          <el-input v-model="typeForm.point_standard_name" style="width:250px" :disabled="isLook" />
        </el-form-item>
        <el-form-item label="文档编号">
          <el-input v-model="typeForm.doc_code" style="width:250px" :disabled="isLook" />
        </el-form-item>
        <br>
        <el-form-item label="适用机台" prop="equip_no">
          <el-select
            v-model="typeForm.equip_no"
            :disabled="isLook"
            style="width:250px"
            placeholder="请选择"
            clearable
            multiple
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="station">
          <el-input v-model="typeForm.station" :disabled="isLook" style="width:250px" />
        </el-form-item>
        <br>
        <el-form-item label="点检内容">
          <el-button v-if="!isLook" type="primary" @click="addList">添加</el-button>
          <el-table
            :data="tableData1"
            border
            max-height="400"
            style="width: 730px"
          >
            <el-table-column
              prop="date"
              label="作业内容"
              width="320"
            >
              <template slot-scope="{row}">
                <el-input v-model="row.check_content" :disabled="isLook" />
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              label="检查方法"
              width="260"
            >
              <template slot-scope="{row}">
                <el-input v-model="row.check_style" :disabled="isLook" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="149">
              <template slot-scope="scope">
                <el-button
                  :disabled="isLook"
                  size="mini"
                  type="danger"
                  @click="delDialogFun(scope.$index)"
                >删除</el-button>
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
          v-if="!isLook"
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
import { checkPointStandard, checkPointStandardExport } from '@/api/jqy'

export default {
  name: 'SpotCheckSet',
  components: { page },
  data: function() {
    return {
      tableData: [],
      tableData1: [],
      dialogEditVisible: false,
      typeForm: {},
      rules: {
        station: [{ required: true, message: '不能为空', trigger: 'change' }],
        point_standard_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        standard_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip_no: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      getParams: {
        page: 1
      },
      excelParams: {
        export_ids: []
      },
      multipleSelection: [],
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
        const data = await checkPointStandard('get', null, { params: this.getParams })
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
      this.typeForm = { equip_no: [] }
    },
    changSelect() {
      this.getParams.page = 1
      this.getList()
    },
    changDebounce() {
      this.$debounce(this, 'changSelect')
    },
    showDialog(row, val) {
      if (val) {
        this.isLook = true
      } else {
        this.isLook = false
      }
      this.typeForm = JSON.parse(JSON.stringify(row))
      this.typeForm.equip_no = PickDisplay(this.typeForm.equip_no)
      this.tableData1 = this.typeForm.check_details
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
              this.typeForm.check_details = this.tableData1
            }
            const _api = this.typeForm.id ? 'put' : 'post'
            this.tableData1.forEach(d => {
              if (!d.check_content || !d.check_style) {
                throw new Error('点检内容及检查方法必填')
              }
            })
            this.typeForm.equip_no = PersonDisplay(this.typeForm.equip_no)
            this.btnLoading = true
            await checkPointStandard(_api, this.typeForm.id || null, { data: this.typeForm })
            this.btnLoading = false
            this.handleClose(false)
            this.$message.success('操作成功')
            this.getList()
          } catch (e) {
            this.typeForm.equip_no = PickDisplay(this.typeForm.equip_no)
            this.btnLoading = false
            if (e.message) {
              this.$message(e.message)
            }
          }
        }
      })
    },
    handleDelete: function(row) {
      this.$confirm('此操作将删除' + row.point_standard_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkPointStandard('delete', row.id)
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
      this.excelParams.export_ids = []
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
    },
    addList() {
      this.tableData1.push({ sequence: this.tableData1.length + 1 })
    },
    delDialogFun(index) {
      this.tableData1.splice(index, 1)
    },
    templateDownload() {
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(d => {
          this.excelParams.export_ids.push(d.id)
        })
        this.btnExportLoad = true
        this.excelParams.excel_flag = 'export'
        checkPointStandardExport('post', null, { responseType: 'blob', data: this.excelParams }).then(response => {
          const link = document.createElement('a')
          const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '岗位安全装置点检标准及内容.xls' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
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
      checkPointStandardExport('post', null, { data: formData }).then(response => {
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
.spot-check-set{
  .el-dialog{
    margin-top:10vh !important
  }
}
</style>
