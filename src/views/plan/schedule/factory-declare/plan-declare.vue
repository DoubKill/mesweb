<template>
  <div>
    <!-- 各分厂胶料计划申报 -->
    <el-form :inline="true">
      <el-form-item label="分厂">
        <el-select v-model="search.factory" style="width:120px" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in optionsBranch"
            :key="item.id"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申报单号">
        <el-input v-model="search.order_no" style="width:160px" clearable @input="debounceInput" />
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
      <el-form-item label="计划日期">
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
        <el-select v-model="search.status" style="width:100px" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <!-- <el-button type="primary" :loading="btnExportLoad" @click="templateDownload">导出Excel</el-button> -->
        <el-button type="primary" @click="addList">新建</el-button>
      </el-form-item>
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
        min-width="15"
      />
      <el-table-column
        prop="factory_date"
        label="申报日期"
        min-width="25"
      />
      <el-table-column
        prop="order_no"
        label="申报单号"
        min-width="25"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
        min-width="25"
      />
      <el-table-column
        prop="today_demanded"
        label="当日需求(吨)"
        min-width="16"
      />
      <el-table-column
        prop="tomorrow_demanded"
        label="明日需求(吨)"
        min-width="16"
      />
      <el-table-column
        prop="current_stock"
        label="当前库存(吨)"
        min-width="16"
      />
      <el-table-column
        prop="underway_stock"
        label="在途库存(吨)"
        min-width="16"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="15"
      />
      <el-table-column
        prop="created_username"
        label="录入者"
        min-width="15"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
        min-width="25"
      />
      <el-table-column
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button-group v-if="!['单页合计','汇总'].includes(scope.row.factory)">
            <el-button
              size="mini"
              @click="showEditEquipCateDialog(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-if="scope.row.status!=='关闭'"
              size="mini"
              type="danger"
              @click="handleEquipCateDelete(scope.row)"
            >关闭</el-button>
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
      title="分厂胶料计划申报"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form :inline="true">
        <el-form-item label="分厂">
          <el-select v-model="formData.factory" :disabled="!!formData.id" placeholder="请选择">
            <el-option
              v-for="item in optionsBranch"
              :key="item.id"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申报单号">
          <el-input v-model="formData.order_no" disabled />
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData1"
        border
        :show-summary="!formData.id"
      >
        <el-table-column
          v-if="!formData.id"
          :key="1"
          type="index"
          label="序号"
          min-width="20"
        />
        <el-table-column
          :key="2"
          prop="product_no"
          label="胶料编码"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-select v-model="row.product_no" filterable placeholder="请选择">
              <el-option
                v-for="item in optionsProduct"
                :key="item.id"
                :label="item.product_no"
                :value="item.product_no"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          :key="3"
          prop="today_demanded"
          label="当日需求（吨）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model="row.today_demanded"
              controls-position="right"
              :precision="3"
              :step="0.1"
              :min="0"
            />
          </template>
        </el-table-column>
        <el-table-column
          :key="4"
          prop="tomorrow_demanded"
          label="明日需求（吨）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model="row.tomorrow_demanded"
              controls-position="right"
              :precision="3"
              :step="0.1"
              :min="0"
            />
          </template>
        </el-table-column>
        <el-table-column
          :key="5"
          prop="current_stock"
          label="当前库存（吨）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model="row.current_stock"
              controls-position="right"
              :precision="3"
              :step="0.1"
              :min="0"
            />
          </template>
        </el-table-column>
        <el-table-column
          :key="6"
          prop="underway_stock"
          label="在途库存（吨）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model="row.underway_stock"
              controls-position="right"
              :precision="3"
              :step="0.1"
              :min="0"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="!formData.id"
          :key="7"
          width="80"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="delDialog(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!formData.id" style="width:100%;text-align:center;margin-top:15px">
        <el-button
          size="small"
          @click="addCell"
        >插入一行</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { setDate } from '@/utils'
import { globalCodesUrl, productInfosUrl } from '@/api/base_w'
import { schedulingProductDemandedDeclare } from '@/api/base_w_five'
import page from '@/components/page'
export default {
  name: 'SchedulePlanDeclare',
  components: { page },
  data() {
    return {
      search: {},
      tableData: [],
      formData: {},
      loading: false,
      btnLoading: false,
      dateValue: [],
      options: ['未确认', '已确认', '关闭'],
      btnExportLoad: false,
      total: 0,
      dialogVisible: false,
      optionsBranch: [],
      tableData1: [],
      optionsProduct: []
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
        const data = await schedulingProductDemandedDeclare('get', null, { params: this.search })
        this.tableData = data.results || []
        if (this.tableData.length) {
          this.tableData.push({
            factory: '单页合计',
            current_stock: sum(this.tableData, 'current_stock'),
            today_demanded: sum(this.tableData, 'today_demanded'),
            tomorrow_demanded: sum(this.tableData, 'tomorrow_demanded'),
            underway_stock: sum(this.tableData, 'underway_stock')
          }, {
            factory: '汇总',
            current_stock: data.total_current_stock,
            today_demanded: data.total_today_demanded,
            tomorrow_demanded: data.total_tomorrow_demanded,
            underway_stock: data.total_underway_stock
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
    tableRowClassName({ row, rowIndex }) {
      if (row.factory === '单页合计' || row.factory === '汇总') {
        return 'summary-cell-style'
      }
    },
    handleClose(done) {
      this.dialogVisible = false
      this.tableData1 = []
      this.formData = {}
      if (done) {
        done()
      }
    },
    showEditEquipCateDialog(row) {
      this.dialogVisible = true
      this.formData = {
        id: row.id,
        factory: row.factory,
        order_no: 88
      }
      this.tableData1 = [row]
    },
    handleEquipCateDelete(row) {
      this.$confirm('此操作将关闭该计划，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await schedulingProductDemandedDeclare('patch', row.id, { data: { status: '关闭' }})
          this.getList()
        } catch (e) { e }
      }).catch(() => {
      })
    },
    addCell() {
      this.tableData1.push({})
    },
    delDialog(row, index) {
      this.tableData1.splice(index, 1)
    },
    templateDownload() {
    //   this.btnExportLoad = true
    //   const obj = Object.assign({ export: 2 }, this.search)
    //   thStockSummsry('get', null, { params: obj, responseType: 'blob' })
    //     .then(res => {
    //       const link = document.createElement('a')
    //       const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    //       link.style.display = 'none'
    //       link.href = URL.createObjectURL(blob)
    //       link.download = '各分厂胶料计划申报.xlsx' // 下载的文件名
    //       document.body.appendChild(link)
    //       link.click()
    //       document.body.removeChild(link)
    //       this.btnExportLoad = false
    //     }).catch(e => {
    //       this.btnExportLoad = false
    //     })
    },
    addList() {
      this.formData = {
        order_no: 99
      }
      this.dialogVisible = true
    },
    async submitFun() {
      let bool = false
      try {
        this.tableData1.forEach(d => {
          if (!d.product_no || !d.today_demanded || !d.current_stock) {
            bool = true
            throw new Error('胶料编码、当日需求、当前库存必填')
          }
        })
        if (!this.formData.factory) {
          bool = true
          throw new Error('分厂必填')
        }
        let params = null
        if (!this.formData.id) {
          this.tableData1.forEach(d => {
            d.factory = this.formData.factory
            d.order_no = this.formData.order_no
          })
          params = this.tableData1
        } else {
          params = this.tableData1[0]
        }

        this.btnLoading = true
        const _api = this.formData.id ? 'put' : 'post'
        await schedulingProductDemandedDeclare(_api, this.formData.id || null, { data: params })
        this.$message.success('保存成功')
        this.btnLoading = false
        this.handleClose(false)
        this.getList()
      } catch (e) {
        this.btnLoading = false
        if (e.message && bool) {
          bool = false
          this.$message(e.message)
        }
      }
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
