<template>
  <div>
    <!-- 机台设备生产能力 -->
    <el-form :inline="true">
      <el-form-item label="机台">
        //
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input v-model="search.material_no" clearable @input="debounceInput" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" :disabled="btnExportLoad" @click="templateDownload">导出Excel</el-button>
        <el-button type="primary" @click="addList">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="name"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="平均工作时间(秒)"
        min-width="20"
        sortable
      />
      <el-table-column
        prop="name"
        label="平均间隔时间(秒)"
        min-width="20"
        sortable
      />
      <el-table-column
        prop="name"
        label="平均加胶量(kg)"
        min-width="20"
        sortable
      />
      <el-table-column
        prop="name"
        label="录入者"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="录入时间"
        min-width="20"
      />
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >{{ scope.row.used_flag?'停用':'启用' }}
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
      :title="`${formData.id?'编辑':'新建'}机台设备生产能力`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="150px">
        <el-form-item label="机台" prop="value">
          //
        </el-form-item>
        <el-form-item label="胶料编码" prop="value">
          <el-select v-model="formData.value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平均工作时间(秒）" prop="aaaa">
          <el-input-number v-model="formData.aaaa" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="平均间隔时间(秒）" prop="aaaa">
          <el-input-number v-model="formData.aaaa" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="平均加胶量(kg)" prop="aaaa">
          <el-input-number v-model="formData.aaaa" controls-position="right" :min="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
export default {
  name: 'ScheduleProductionCapacity',
  components: { page },
  data() {
    return {
      search: {},
      optionsBranch: [],
      tableData: [{}],
      formData: {},
      loading: false,
      dateValue: [],
      options: [],
      btnExportLoad: false,
      total: 0,
      dialogVisible: false,
      tableData1: [{}],
      btnLoading: false,
      rules: {
        value: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        aaaa: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getList() {
      this.loading = false
      try {
        this.loading = true
        // const data = await batchChargeLogList('get', null, { params: this.getParams })
        // this.tableData = data.results || []
        // this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    changeDate(arr) {
      this.changeList()
    },
    debounceInput() {
      this.$debounce(this, 'getList')
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    handleClose(done) {
      this.dialogVisible = false
      this.formData = {}
      this.$refs.ruleForm.clearValidate()
      if (done) {
        done()
      }
    },
    showEditDialog(row) {
      this.dialogVisible = true
    },
    handleDelete: function(row) {
      var str = row.used_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteLocation(row.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '操作成功!'
        //     })
        //     this.getTableData()
        //   })
      })
    },
    changeBranch() {},
    templateDownload() {
    //   this.btnExportLoad = true
    //   const obj = Object.assign({ export: 2 }, this.search)
    //   thStockSummsry('get', null, { params: obj, responseType: 'blob' })
    //     .then(res => {
    //       const link = document.createElement('a')
    //       const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    //       link.style.display = 'none'
    //       link.href = URL.createObjectURL(blob)
    //       link.download = '各分厂安全库存及安全系数申报.xlsx' // 下载的文件名
    //       document.body.appendChild(link)
    //       link.click()
    //       document.body.removeChild(link)
    //       this.btnExportLoad = false
    //     }).catch(e => {
    //       this.btnExportLoad = false
    //     })
    },
    addList() {
      this.dialogVisible = true
    },
    Upload(param) {
    //   const formData = new FormData()
    //   formData.append('file', param.file)
    //   equipOrderAssignRuleImportXlsx('post', null, { data: formData }).then(response => {
    //     this.$message({
    //       type: 'success',
    //       message: response
    //     })
    //     this.changeList()
    //   })
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            // const _api = this.formData.id ? 'put' : 'post'
            // await equipComponent(_api, this.dialogForm.id || null, { data: this.dialogForm })
            // this.$message.success('操作成功')
            // this.handleClose(false)
            // this.getList()
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
</script>

<style lang="scss" scoped>

</style>
