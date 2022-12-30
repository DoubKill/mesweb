<template>
  <div class="scheduledInventory">
    <!-- 排程无硫库存单 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="search.factory_date"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getList"
        />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-select v-model="search.product_no" clearable allow-create filterable @change="getList">
          <el-option
            v-for="item in optionsProduct"
            :key="item.id"
            :label="item.product_no"
            :value="item.product_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['aps_stock_summary','export']" type="primary" @click="exportTable">导出Excel</el-button>
        <el-button v-permission="['aps_stock_summary','export']" type="primary" @click="addProduce">新增规格</el-button>
        <el-button v-permission="['aps_stock_summary','export']" :loading="btnLoading" type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      max-height="700"
      :data="tableData"
      border
    >
      <el-table-column
        align="center"
        prop="product_no"
        label="规格"
        min-width="20"
      />
      <el-table-column
        align="center"
        prop="HMB"
        label="HMB（kg）"
        min-width="40"
      >
        <el-table-column
          align="center"
          label="库内库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.stock_weight_HMB }}</span>
            <el-input-number v-else v-model="row.stock_weight_HMB" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="现场库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.area_weight_HMB }}</span>
            <el-input-number v-else v-model="row.area_weight_HMB" controls-position="right" :min="0" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="CMB"
        label="CMB（kg）"
        min-width="40"
      >
        <el-table-column
          align="center"
          label="库内库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.stock_weight_CMB }}</span>
            <el-input-number v-else v-model="row.stock_weight_CMB" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="现场库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.area_weight_CMB }}</span>
            <el-input-number v-else v-model="row.area_weight_CMB" controls-position="right" :min="0" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="1MB"
        label="1MB（kg）"
        min-width="40"
      >
        <el-table-column
          align="center"
          label="库内库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.stock_weight_1MB }}</span>
            <el-input-number v-else v-model="row.stock_weight_1MB" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="现场库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.area_weight_1MB }}</span>
            <el-input-number v-else v-model="row.area_weight_1MB" controls-position="right" :min="0" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="2MB"
        label="2MB（kg）"
        min-width="40"
      >
        <el-table-column
          align="center"
          label="库内库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.stock_weight_2MB }}</span>
            <el-input-number v-else v-model="row.stock_weight_2MB" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="现场库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.area_weight_2MB }}</span>
            <el-input-number v-else v-model="row.area_weight_2MB" controls-position="right" :min="0" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="3MB"
        label="3MB（kg）"
        min-width="40"
      >
        <el-table-column
          align="center"
          label="库内库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.stock_weight_3MB }}</span>
            <el-input-number v-else v-model="row.stock_weight_3MB" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="现场库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.area_weight_3MB }}</span>
            <el-input-number v-else v-model="row.area_weight_3MB" controls-position="right" :min="0" />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <el-dialog
      class="dialog"
      title="新建规格"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="createForm" inline="true" label-width="150px" :rules="rules" :model="createForm">
        <el-form-item label="规格" prop="product_no">
          <el-select v-model="createForm.product_no" allow-create filterable placeholder="请选择">
            <el-option
              v-for="item in optionsProduct"
              :key="item.id"
              :label="item.product_no"
              :value="item.product_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="HMB库内库存" prop="stock_weight_HMB">
          <el-input-number v-model="createForm.stock_weight_HMB" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="HMB现场库存" prop="area_weight_HMB">
          <el-input-number v-model="createForm.area_weight_HMB" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="CMB库内库存" prop="stock_weight_CMB">
          <el-input-number v-model="createForm.stock_weight_CMB" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="CMB现场库存" prop="area_weight_CMB">
          <el-input-number v-model="createForm.area_weight_CMB" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="1MB库内库存" prop="stock_weight_1MB">
          <el-input-number v-model="createForm.stock_weight_1MB" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="1MB现场库存" prop="area_weight_1MB">
          <el-input-number v-model="createForm.area_weight_1MB" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="2MB库内库存" prop="stock_weight_2MB">
          <el-input-number v-model="createForm.stock_weight_2MB" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="2MB现场库存" prop="area_weight_2MB">
          <el-input-number v-model="createForm.area_weight_2MB" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="3MB库内库存" prop="stock_weight_3MB">
          <el-input-number v-model="createForm.stock_weight_3MB" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="3MB现场库存" prop="area_weight_3MB">
          <el-input-number v-model="createForm.area_weight_3MB" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="dialog"
      title="导出日期选择"
      :visible.sync="dialogExport"
      width="30%"
    >
      <el-form label-width="150px">
        <el-form-item label="起止日期">
          <el-date-picker
            v-model="dateValue"
            :clearable="false"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changeDate"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogExport=false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitExport">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { productInfosUrl } from '@/api/base_w'
import { schedulingStockSummary, schedulingStockConfirm, schedulingStockSummaryExport } from '@/api/jqy'
import { setDate } from '@/utils'
export default {
  name: 'ScheduledInventory',
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dialogExport: false,
      dateValue: [],
      exportForm: {},
      createForm: {},
      rules: {
        product_no: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        stock_weight_HMB: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        area_weight_HMB: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        stock_weight_CMB: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        area_weight_CMB: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        stock_weight_1MB: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        area_weight_1MB: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        stock_weight_2MB: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        area_weight_2MB: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        stock_weight_3MB: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        area_weight_3MB: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      btnLoading: false,
      tableData: [],
      optionsProduct: [],
      search: { factory_date: setDate() }
    }
  },
  created() {
    this.getList()
    this.getProduct()
  },
  methods: {
    addProduce() {
      if (this.$refs.createForm) {
        this.$refs.createForm.clearValidate()
      }
      this.createForm = {}
      this.dialogVisible = true
    },
    async getProduct() {
      try {
        const data = await productInfosUrl('get', null, { params: { all: 1 }})
        this.optionsProduct = data.results || []
      } catch (e) {
        //
      }
    },
    changeDate() {
      this.exportForm.st = this.dateValue[0]
      this.exportForm.et = this.dateValue[1]
    },
    async getList() {
      try {
        this.loading = true
        const data = await schedulingStockSummary('get', null, { params: this.search })
        this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            const obj = {}
            obj.factory_date = this.search.factory_date
            obj.stock_data = [this.createForm]
            this.btnLoading = true
            await schedulingStockSummary('post', null, { data: obj })
            this.$message.success('新建成功')
            this.btnLoading = false
            this.dialogVisible = false
            this.getList()
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    },
    async save() {
      const obj = {}
      obj.factory_date = this.search.factory_date
      obj.stock_data = this.tableData
      try {
        this.btnLoading = true
        await schedulingStockConfirm('post', null, { data: obj })
        this.$message.success('保存成功')
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
      }
    },
    changeList() {
      this.$debounce(this, 'getList')
    },
    async exportTable() {
      this.dialogExport = true
      this.dateValue = [this.search.factory_date, this.search.factory_date]
      this.exportForm = {
        st: this.search.factory_date,
        et: this.search.factory_date
      }
      // await this.$set(this, 'loading', true)
      // await exportExcel('排程无硫库存单')
      // setTimeout(() => {
      //   this.loading = false
      // }, 1000)
    },
    submitExport() {
      if (getDaysBetween(this.exportForm.st, this.exportForm.et) > 31) {
        this.$message('日期间隔不得大于31天')
        return
      }
      this.btnLoading = true
      const obj = Object.assign({ }, this.exportForm)
      const _api = schedulingStockSummaryExport
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = `排程无硫库存单${setDate('', true)}.xlsx` // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.dialogExport = false
          this.btnLoading = false
        }).catch(e => {
          this.btnLoading = false
        })
    }
  }
}
function getDaysBetween(dateString1, dateString2) {
  var startDate = Date.parse(dateString1)
  var endDate = Date.parse(dateString2)
  if (startDate > endDate) {
    return 0
  }
  if (startDate === endDate) {
    return 1
  }
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
  return days
}
</script>

<style lang="scss">
.scheduledInventory{
  .el-input-number{
    width:130px;
   }
 .dialog{
  .el-input-number{
    width:200px;
    }
  }
}
</style>
