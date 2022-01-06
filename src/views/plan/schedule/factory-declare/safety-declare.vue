<template>
  <div>
    <!-- 各分厂安全库存及安全系数申报 -->
    <el-form :inline="true">
      <el-form-item label="分厂">
        <el-select v-model="search.factory" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in optionsBranch"
            :key="item.id"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-select v-model="search.product_no" clearable style="width:160px" filterable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in optionsProduct"
            :key="item.id"
            :label="item.product_no"
            :value="item.product_no"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item style="float:right">
        <el-button type="primary" :disabled="btnExportLoad" @click="templateDownload">导出Excel</el-button>
        <el-upload
          style="display:inline-block;margin:0 6px"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button type="primary" @click="addList">新建</el-button>
      </el-form-item> -->
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        prop="factory"
        label="分厂"
        min-width="20"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        prop="safety_stock"
        label="安全库存（吨）"
        min-width="20"
      />
      <el-table-column
        prop="safety_factor"
        label="安全系数"
        min-width="20"
      />
      <el-table-column
        prop="daily_usage"
        label="日均用量（吨）"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="录入者"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
        min-width="20"
      />
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button-group v-if="!['单页合计','汇总'].includes(scope.row.factory)">
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
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
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${formData.id?'编辑':'新建'}分厂 安全库存及安全系数`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="150px">
        <el-form-item label="分厂" prop="factory">
          <el-select v-model="formData.factory" placeholder="请选择">
            <el-option
              v-for="item in optionsBranch"
              :key="item.id"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="胶料编码" prop="product_no">
          <el-select v-model="formData.product_no" filterable placeholder="请选择">
            <el-option
              v-for="item in optionsProduct"
              :key="item.id"
              :label="item.product_no"
              :value="item.product_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="安全库存（吨）" prop="safety_stock">
          <el-input-number v-model="formData.safety_stock" controls-position="right" :min="1" :precision="3" :step="0.1" />
        </el-form-item>
        <el-form-item label="安全库存系数" prop="safety_factor">
          <el-input-number v-model="formData.safety_factor" controls-position="right" :min="1" :step="0.1" />
        </el-form-item>
        <el-form-item label="日均用量（吨）" prop="daily_usage">
          <el-input-number v-model="formData.daily_usage" controls-position="right" :min="1" :precision="3" :step="0.1" />
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
import { schedulingProductSafetyParams } from '@/api/base_w_five'
import { globalCodesUrl, productInfosUrl } from '@/api/base_w'
import page from '@/components/page'
export default {
  name: 'ScheduleSafetyDeclare',
  components: { page },
  data() {
    return {
      search: {},
      optionsBranch: [],
      tableData: [],
      formData: {},
      loading: false,
      dateValue: [],
      options: [],
      btnExportLoad: false,
      total: 0,
      dialogVisible: false,
      tableData1: [{}],
      optionsProduct: [],
      btnLoading: false,
      rules: {
        factory: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        product_no: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        safety_stock: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        safety_factor: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        daily_usage: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getFactory()
    this.getProduct()
  },
  methods: {
    async getList() {
      this.loading = false
      try {
        this.loading = true
        const data = await schedulingProductSafetyParams('get', null, { params: this.search })
        this.tableData = data.results || []
        if (this.tableData.length) {
          this.tableData.push({
            factory: '单页合计',
            safety_stock: sum(this.tableData, 'safety_stock'),
            daily_usage: sum(this.tableData, 'daily_usage')
          }, {
            factory: '汇总',
            safety_stock: data.total_safety_stock,
            daily_usage: data.total_daily_usage
          })
        }
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getFactory() {
      try {
        const data = await globalCodesUrl('get', { params: { class_name: '分厂' }})
        this.optionsBranch = data.results || []
      } catch (e) {
        //
      }
    },
    async getProduct() {
      try {
        const data = await productInfosUrl('get', null, { params: { all: 1 }})
        this.optionsProduct = data.results || []
      } catch (e) {
        //
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
      setTimeout(d => {
        this.$refs.ruleForm.clearValidate()
      }, 300)
      if (done) {
        done()
      }
    },
    showEditDialog(row) {
      this.dialogVisible = true
      this.formData = JSON.parse(JSON.stringify(row))
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        schedulingProductSafetyParams('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
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
    tableRowClassName({ row, rowIndex }) {
      if (row.factory === '单页合计' || row.factory === '汇总') {
        return 'summary-cell-style'
      }
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.formData.id ? 'put' : 'post'
            await schedulingProductSafetyParams(_api, this.formData.id || null, { data: this.formData })
            this.$message.success('操作成功')
            this.handleClose(false)
            this.getList()
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
function sum(arr, params) {
  var s = 0
  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 1000) / 1000
  return s
}
</script>

<style lang="scss" scoped>

</style>
