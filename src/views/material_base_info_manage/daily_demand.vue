<template>
  <div>
    <!-- 料包日需求及耗时统计 -->
    <el-form :inline="true">
      <el-form-item label="类型">
        <el-select
          v-model="search.product_type"
          filterable
          placeholder="请选择"
          @change="getList"
        >
          <el-option
            v-for="item in [{id:1,name:'常规机台规格'},{id:2,name:'彩胶(190E)规格'}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="search.factory_date"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择工厂日期"
          @change="getList"
        />
      </el-form-item>
      <el-form-item label="胶料规格">
        <el-select
          v-model="search.product_no"
          filterable
          clearable
          placeholder="请选择"
          @visible-change="visibleChange"
          @change="getList"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.product_no"
            :value="item.product_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['daily_weight_package', 'add']" type="primary" @click="add">新增</el-button>
        <el-button v-permission="['daily_weight_package','export']" type="primary" :disabled="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-button v-permission="['daily_weight_package','import']">
          <a :href="`${templateFileUrl}daily-demand.xlsx`" download="单配日需求导入模板.xlsx">导出Excel模板</a>
        </el-button>
        <el-upload
          v-permission="['daily_weight_package','import']"
          style="margin-left:8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button>导入Excel</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div id="out-table" v-loading="loading">
      <el-table :data="tableData" size="mini" style="width: 100%" border show-summary>
        <el-table-column prop="product_no" label="规格" min-width="20" />
        <el-table-column prop="mixin_dev_type" label="计划(吨)" min-width="20" />
        <el-table-column prop="xl_split_qty" label="细料分包" min-width="20" />
        <el-table-column prop="xl_plan_qty" label="细料计划包数" min-width="20" />
        <el-table-column prop="xl_dp_qty" label="单配需求包数" min-width="20" />
        <!-- <el-table-column prop="" label="单配总耗时" min-width="20" /> -->
        <el-table-column label="单配耗时及单配明细">
          <el-table-column prop="mixin_chemical_kind" label="化工种数" min-width="20" />
          <el-table-column prop="hl_materials" label="合练/母胶" min-width="30" />
          <el-table-column prop="hl_time_consume" label="耗时" min-width="20" />
          <el-table-column prop="mixin_materials" label="混炼1/2段" min-width="30" />
          <el-table-column prop="mixin_time_consume" label="耗时" min-width="20" />
        </el-table-column>
        <el-table-column prop="aw_qty" label="AW" min-width="20" />
        <el-table-column prop="AW总数" label="AW总数" min-width="20" />
        <el-table-column prop="final_devoted_weight" label="加硫单车重量" min-width="20" />
        <el-table-column prop="final_dev_type" label="机型" min-width="20" />
        <el-table-column prop="lh_split_qty" label="硫磺分包" min-width="20" />
        <el-table-column prop="lh_plan_qty" label="硫磺计划包数" min-width="20" />
        <el-table-column prop="lh_dp_qty" label="单配需求包数" min-width="20" />
        <!-- <el-table-column prop="date" label="单配总耗时" min-width="20" /> -->
        <el-table-column label="单配耗时及单配明细">
          <el-table-column prop="final_chemical_kind" label="化工种数" min-width="20" />
          <el-table-column prop="final_mate" label="加硫单配" min-width="30" />
          <el-table-column prop="final_time_consume" label="耗时" min-width="20" />
        </el-table-column>
        <el-table-column v-if="!btnExportLoad" label="操作" width="140">
          <template slot-scope="scope">
            <el-button v-permission="['daily_weight_package','change']" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button v-permission="['daily_weight_package', 'delete']" size="mini" type="danger" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table :data="tableData1" style="width: 40%;margin-top:10px;" border :span-method="objectSpanMethod">
        <el-table-column prop="date" label="" min-width="20" />
        <el-table-column prop="date" label="日需求" min-width="20" />
        <el-table-column prop="date" label="机配" min-width="20" />
        <el-table-column prop="date" label="手工" min-width="20" />
      </el-table>
      <h3>硫磺不包含2分厂</h3> -->
    </div>

    <el-dialog
      :title="currentRow.id?'编辑':'新增'"
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="currentRow" :rules="rules" label-width="200px">
        <el-form-item label="工厂日期" prop="factory_date">
          <el-date-picker
            v-model="currentRow.factory_date"
            :disabled="!!currentRow.id"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择工厂日期"
          />
        </el-form-item>
        <el-form-item label="胶料规格" prop="product_no">
          <el-select
            v-model="currentRow.product_no"
            :disabled="!!currentRow.id"
            filterable
            placeholder="请选择"
            @visible-change="visibleChange"
            @change="searchDialogData"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.product_no"
              :value="item.product_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计划吨数" prop="plan_weight">
          <el-input-number v-model="currentRow.plan_weight" controls-position="right" :min="0" @change="searchDialogData" />
        </el-form-item>
        <el-form-item label="混炼机型" prop="mixin_dev_type">
          <el-select
            v-model="currentRow.mixin_dev_type"
            :disabled="!!currentRow.id"
            clearable
            placeholder="请选择"
            filterable
            @change="searchDialogData"
          >
            <el-option
              v-for="item in equipsCategories"
              :key="item.category_name"
              :label="item.category_name"
              :value="item.category_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="终炼机型" prop="final_dev_type">
          <el-select
            v-model="currentRow.final_dev_type"
            :disabled="!!currentRow.id"
            clearable
            placeholder="请选择"
            filterable
            @change="searchDialogData"
          >
            <el-option
              v-for="item in equipsCategories"
              :key="item.category_name"
              :label="item.category_name"
              :value="item.category_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="混炼单车重量" prop="mixin_weight">
          <el-input v-model="currentRow.mixin_weight" placeholder="" disabled />
        </el-form-item>
        <el-form-item label="加硫单车重量" prop="final_devoted_weight">
          <el-input v-model="currentRow.final_devoted_weight" placeholder="" disabled />
        </el-form-item>
        <el-form-item label="合练单配耗时(分)">
          <el-input-number v-model="currentRow.hl_time_consume" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="混炼单配耗时(分)">
          <el-input-number v-model="currentRow.mixin_time_consume" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="终炼单配耗时(分)">
          <el-input-number v-model="currentRow.final_time_consume" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(null)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setDate, exportExcel } from '@/utils'
import { productInfosUrl, weightPackageDailyTimeConsumer, findRecipe, findRecipeImportXlsx } from '@/api/base_w'
import { equip_category_url } from '@/api/rubber_recipe_fun'
export default {
  name: 'DailyDemand',
  data() {
    return {
      tableData: [],
      tableData1: [
        { date: 1111 },
        { date: 1111 },
        { date: 1111 },
        { date: 1111 },
        { date: 1111 },
        { date: 1111 }
      ],
      loading: false,
      search: { product_type: 1, factory_date: setDate() },
      btnExportLoad: false,
      currentRow: { factory_date: setDate() },
      dialogVisible: false,
      loadingBtn: false,
      options: [],
      equipsCategories: [],
      rules: {
        factory_date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        product_no: [
          { required: true, message: '请选择胶料', trigger: 'change' }
        ],
        plan_weight: [
          { required: true, message: '请输入计划吨数', trigger: 'blur' }
        ],
        mixin_dev_type: [
          { required: true, message: '请选择混炼机型', trigger: 'change' }
        ],
        final_dev_type: [
          { required: true, message: '请选择终练机型', trigger: 'change' }
        ],
        mixin_weight: [
          { required: true, message: '未找到该胶料启用状态终炼配方数据', trigger: 'change' }
        ],
        final_devoted_weight: [
          { required: true, message: '未找到该胶料启用状态终炼配方数据', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.templateFileUrl = process.env.BASE_URL
    this.getEquipsCategories()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const _api = weightPackageDailyTimeConsumer
        const data = await _api('get', null, { params: this.search })
        this.tableData = data || []
        this.tableData.forEach(d => {
          const aw_qty = d.aw_qty ? d.aw_qty : 0
          const xl_plan_qty = d.xl_plan_qty ? d.xl_plan_qty : 0
          d.AW总数 = Math.round((aw_qty * xl_plan_qty) * 100) / 100
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getEquipsCategories() {
      const response = await equip_category_url('get', {
        params: {
          all: 1,
          equip_type_name: '密炼设备'
        }
      })
      this.equipsCategories = response.results
    },
    async visibleChange(val) {
      if (val) {
        try {
          const data = await productInfosUrl('get', null, { params: { all: 1 }})
          this.options = data.results || []
        } catch (e) {
        //
        }
      }
    },
    async searchDialogData() {
      try {
        if (!this.currentRow.plan_weight || !this.currentRow.product_no ||
        !this.currentRow.mixin_dev_type || !this.currentRow.final_dev_type || this.currentRow.id) {
          return
        }
        const data = await findRecipe('get', null, { params: this.currentRow })
        const obj = Object.assign({}, this.currentRow, data)
        this.currentRow = obj
      } catch (e) {
        this.$set(this.currentRow, 'mixin_weight', '')
        this.$set(this.currentRow, 'final_devoted_weight', '')
      }
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            const _mothod = this.currentRow.id ? 'put' : 'post'
            const _api = weightPackageDailyTimeConsumer
            await _api(_mothod, this.currentRow.id || null, { data: this.currentRow })
            this.$message.success('操作成功')
            this.handleClose(false)
            this.getList()
            this.loadingBtn = false
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    },
    handleClose(done) {
      setTimeout(() => {
        this.currentRow = { factory_date: setDate() }
        this.$refs.ruleForm.resetFields()
      }, 300)
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    handleDelete: function(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        weightPackageDailyTimeConsumer('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }).catch(e => {
            this.$message.error('删除失败')
          })
      })
    },
    add() {
      this.dialogVisible = true
    },
    showEditDialog(obj) {
      this.currentRow = JSON.parse(JSON.stringify(obj))
      this.dialogVisible = true
    },
    exportTable() {
      this.btnExportLoad = true
      const tds = document.querySelectorAll('.el-table__footer-wrapper td')
      for (let index = 0; index < 6; index++) {
        tds[index].setAttribute('rowspan', '1')
      }
      for (let index = 10; index < 17; index++) {
        tds[index].setAttribute('rowspan', '1')
      }
      setTimeout(d => {
        exportExcel('料包日需求及耗时统计')
        this.btnExportLoad = false
      })
    },
    Upload(param) {
      if (!this.search.factory_date) {
        this.$message('请选择工厂日期')
        return
      }
      const formData = new FormData()
      formData.append('file', param.file)
      formData.append('factory_date', this.search.factory_date)
      findRecipeImportXlsx('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: response
        })
        this.getList()
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (columnIndex === 3) {
        if (rowIndex === 4) {
          return {
            rowspan: 2,
            colspan: 1
          }
        }
        if (rowIndex === 5) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-autocomplete,.el-input,.el-select,.el-input-number{
  width:250px;
}
</style>
