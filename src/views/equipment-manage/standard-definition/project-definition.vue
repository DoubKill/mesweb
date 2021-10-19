<template>
  <div>
    <!-- 作业项目标准定义 -->
    <el-form :inline="true">
      <el-form-item label="作业类型">
        <el-select
          v-model="getParams.work_type"
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
      <el-form-item label="作业项目">
        <el-input v-model="getParams.standard_name" clearable @input="changDebounce" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" style="margin-right:8px" @click="templateDownload">导出Excel</el-button>
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
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
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
      <el-table-column label="操作">
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
              prop="sequence"
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
              label="判断标准/步骤说明"
            >
              <template slot-scope="{row}">
                <el-input v-model="row.check_standard_desc" />
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              label="类型"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.check_standard_type" placeholder="请选择">
                  <el-option
                    v-for="item in ['有无','数值','正常异常','完成未完成']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
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
import { equipJobItemStandard } from '@/api/base_w_four'
// import { errorRepeat } from '@/utils'

export default {
  name: 'ProjectDefinition',
  components: { page },
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
      loading: 0,
      btnLoading: false
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
        this.tableData = data.results
        this.total = data.count
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
    showDialog(row) {
      this.typeForm = JSON.parse(JSON.stringify(row))
      this.tableData1 = this.typeForm.work_details
      this.dialogEditVisible = true
    },
    handleEdit: function() {
      this.$refs.typeForm.validate(async(valid) => {
        if (valid) {
          try {
            console.log(this.typeForm, 3333)
            if (this.tableData1.length === 0) {
              throw new Error('作业详情内容未添加')
            }
            this.tableData1.forEach(d => {
              if (!d.content || !d.check_standard_desc || !d.check_standard_type) {
                throw new Error('每行数据必填')
              }
            })
            if (!this.typeForm.id) {
              this.typeForm.work_details = this.tableData1
            }
            this.btnLoading = true
            const _api = this.typeForm.id ? 'put' : 'post'
            await equipJobItemStandard(_api, this.typeForm.id || null, { data: this.typeForm })
            this.handleClose(false)
            this.$message.success('添加成功')
            this.getList()
            this.btnLoading = false
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
    },
    addList() {
      this.tableData1.push({ sequence: this.tableData1.length + 1 })
    },
    delDialogFun(index) {
      this.tableData1.splice(index, 1)
    },
    templateDownload() {
    //   exportProperty('get').then(response => {
    //     const link = document.createElement('a')
    //     const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
    //     link.style.display = 'none'
    //     link.href = URL.createObjectURL(blob)
    //     link.download = '设备资产模板.xls' // 下载的文件名
    //     document.body.appendChild(link)
    //     link.click()
    //     document.body.removeChild(link)
    //   })
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
    //   importProperty('post', null, { data: formData }).then(response => {
    //     this.$message({
    //       type: 'success',
    //       message: '导入成功!'
    //     })
    //     this.search.page = 1
    //     this.getList()
    //   })
    }
  }
}
</script>
<style lang="scss">
</style>
