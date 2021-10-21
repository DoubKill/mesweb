<template>
  <div>
    <!-- 作业项目标准定义 -->
    <el-form :inline="true">
      <el-form-item label="作业类型">
        <el-select
          v-model="getParams.work_type"
          placeholder="请选择"
          clearable
          :disabled="isDialog"
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
      <el-form-item label="作业项目">
        <el-input v-model="getParams.standard_name" clearable @input="changDebounce" />
      </el-form-item>
      <el-form-item v-if="!isDialog" style="float:right">
        <el-button :loading="btnExportLoad" type="primary" style="margin-right:8px" @click="templateDownload">导出Excel</el-button>
        <el-upload
          style="margin-right:8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button
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
      @current-change="handleCurrentChange"
    >
      <el-table-column
        prop="work_type"
        label="作业类型"
      />
      <el-table-column
        prop="standard_code"
        label="标准编号"
      />
      <el-table-column
        prop="standard_name"
        label="作业项目标准名称"
      />
      <el-table-column
        prop="work_details_column"
        label="作业详细内容"
      />
      <el-table-column
        prop="check_standard_desc_column"
        label="判断标准"
      />
      <el-table-column
        prop="check_standard_type_column"
        label="类型"
      />
      <el-table-column
        prop="created_username"
        label="录入人"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
      />
      <el-table-column v-if="!isDialog" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['spare_type', 'change']"
              size="mini"
              @click="showDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['spare_type', 'delete']"
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >{{ scope.row.use_flag?'停用':'启用' }}
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
      :title="`${typeForm.id?'修改':'新建'}作业项目标准`"
      width="80%"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="typeForm" :rules="rules" :model="typeForm" label-width="100px">
        <el-form-item label="作业类型" prop="work_type">
          <el-select
            v-model="typeForm.work_type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['巡检','保养','维修','润滑','标定']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标准编号" prop="standard_code">
          <el-input v-model="typeForm.standard_code" style="width:250px" :disabled="typeForm.id?true:false" />
        </el-form-item>
        <el-form-item label="标准名称" prop="standard_name">
          <el-input v-model="typeForm.standard_name" style="width:250px" />
        </el-form-item>
        <el-form-item label="作业详情内容">
          <el-button type="primary" style="float:right;margin-bottom:6px" @click="addList">添加</el-button>
          <el-table
            :data="tableData1"
            border
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              type="index"
            />
            <el-table-column
              prop="date"
              label="作业内容"
            >
              <template slot-scope="{row}">
                <el-input v-model="row.content" />
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              label="类型"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.check_standard_type" placeholder="请选择" @change="standardType(row)">
                  <el-option
                    v-for="item in ['有无','数值范围','正常异常','完成未完成','合格不合格']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              label="判断标准/步骤说明"
            >
              <template slot-scope="{row}">
                <div v-if="row.check_standard_type==='有无'">
                  <el-switch
                    v-model="row.check_standard_desc"
                    active-value="无"
                    inactive-value="有"
                    active-text="无"
                    inactive-text="有"
                  />
                </div>
                <div v-if="row.check_standard_type==='正常异常'">
                  <el-switch
                    v-model="row.check_standard_desc"
                    active-value="正常"
                    inactive-value="异常"
                    active-text="正常"
                    inactive-text="异常"
                  />
                </div>
                <div v-if="row.check_standard_type==='完成未完成'">
                  <el-switch
                    v-model="row.check_standard_desc"
                    active-value="完成"
                    inactive-value="未完成"
                    active-text="完成"
                    inactive-text="未完成"
                  />
                </div>
                <div v-if="row.check_standard_type==='合格不合格'">
                  <el-switch
                    v-model="row.check_standard_desc"
                    active-value="合格"
                    inactive-value="不合格"
                    active-text="合格"
                    inactive-text="不合格"
                  />
                </div>
                <div v-if="row.check_standard_type==='数值范围'">
                  {{ row.check_standard_desc_a }}
                  {{ row.check_standard_desc_b }}
                  <el-input-number v-model="row.check_standard_desc_a" style="width:120px" controls-position="right" :min="0" :max="row.check_standard_desc_b" />
                  -
                  <el-input-number v-model="row.check_standard_desc_b" style="width:120px" controls-position="right" :min="row.check_standard_desc_a" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
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
// import { errorRepeat } from '@/utils'

export default {
  name: 'ProjectDefinition',
  components: { page },
  props: {
    isDialog: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    workType: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      tableData: [],
      tableData1: [],
      dialogEditVisible: false,
      typeName: '',
      typeForm: {},
      rules: {
        work_type: [{ required: true, message: '不能为空', trigger: 'change' }],
        standard_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        standard_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      getParams: {
        page: 1,
        no: '',
        name: ''
      },
      currentPage: 1,
      total: 1,
      loading: false,
      btnLoading: false,
      btnExportLoad: false,
      currentObj: {}
    }
  },
  watch: {
    show(bool) {
      if (bool) {
        this.getParams.work_type = this.workType
        this.getList()
      }
    }
  },
  created() {
    if (this.isDialog) {
      this.getParams.work_type = this.workType
    }
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipJobItemStandard('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.tableData.forEach((d, i) => {
          d.work_details.forEach(D => {
            if (D.check_standard_type === '数值范围') {
              D.check_standard_desc_a = D.check_standard_desc.split('-')[0]
              D.check_standard_desc_b = D.check_standard_desc.split('-')[1]
            }
          })
        })
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
    },
    changSelect() {
      this.getParams.page = 1
      this.getList()
    },
    changDebounce() {
      this.$debounce(this, 'changSelect')
    },
    standardType(row) {
      if (row.check_standard_type !== '数值范围') {
        delete row.check_standard_desc_a
        delete row.check_standard_desc_b
      }
      if (row.check_standard_type === '有无') {
        this.$set(row, 'check_standard_desc', '无')
      }
      if (row.check_standard_type === '数值范围') {
        this.$set(row, 'check_standard_desc', '')
      }
      if (row.check_standard_type === '正常异常') {
        this.$set(row, 'check_standard_desc', '正常')
      }
      if (row.check_standard_type === '完成未完成') {
        this.$set(row, 'check_standard_desc', '完成')
      }
      if (row.check_standard_type === '合格不合格') {
        this.$set(row, 'check_standard_desc', '合格')
      }
    },
    showDialog(row) {
      this.typeForm = JSON.parse(JSON.stringify(row))
      this.tableData1 = this.typeForm.work_details
      this.dialogEditVisible = true
    },
    handleCurrentChange(obj) {
      this.currentObj = obj
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
            if (this.typeForm.work_details.length > 0) {
              this.typeForm.work_details.forEach((d, i) => {
                d.sequence = i + 1
                if (d.check_standard_type === '数值范围') {
                  if ((!d.check_standard_desc_a && d.check_standard_desc_a !== 0) || !d.check_standard_desc_b) {
                    throw new Error('数值范围请填写完毕')
                  }
                  d.check_standard_desc = d.check_standard_desc_a + '-' + d.check_standard_desc_b
                }
              })
            }
            this.tableData1.forEach(d => {
              if (!d.content || !d.check_standard_desc || !d.check_standard_type) {
                throw new Error('每行数据必填')
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
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.standard_name + ', 是否继续?', '提示', {
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
      this.$refs.singleTable.setCurrentRow(this.currentObj)
    },
    addList() {
      this.tableData1.push({ sequence: this.tableData1.length + 1 })
    },
    delDialogFun(index) {
      this.tableData1.splice(index, 1)
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
          message: '导入成功!'
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
