<template>
  <div>
    <!-- 胶料计划库存汇总 -->
    <el-form
      :inline="true"
    >
      <el-form-item label="日期">
        <el-date-picker
          v-model="search.factory_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getList"
        />
      </el-form-item>
      <el-form-item label="规格">
        <el-input
          v-model="search.product_no"
          clearable
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['equip_fault_signal', 'add']" type="primary">自动排程</el-button>
        <el-button v-permission="['equip_fault_signal', 'add']" type="primary" @click="getList">查询</el-button>
        <el-button v-permission="['equip_fault_signal', 'export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-upload
          v-permission="['equip_fault_signal', 'import']"
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button v-permission="['equip_fault_signal', 'add']" type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      border
      :row-class-name="tableRowClassName"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="total"
        label="序号"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.sn!=='合计'">{{ scope.row.sn }}</span>
          <span v-else>{{ scope.row.sn }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="product_no"
        label="规格"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogStock(scope.row)"
          >{{ scope.row.product_no }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="plan_weight"
        label="计划(吨)"
      />
      <el-table-column
        prop="workshop_weight"
        label="车间库存(吨)"
      />
      <el-table-column
        prop="current_stock"
        label="属地库存(吨)"
      />
      <el-table-column
        prop="desc"
        label="备注(加硫不合格待处理)"
        width="200"
      />
      <el-table-column
        prop="target_stock"
        label="目标总库存量(吨)"
      />
      <el-table-column
        prop="available_time"
        label="可用时间(小时)"
      />
      <el-table-column
        prop="demanded_weight"
        label="需生产量(吨)"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogProduction(scope.row)"
          >{{ scope.row.demanded_weight }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!exportTableShow"
        width="200"
        label="操作"
        fixed="right"
      >
        <template
          v-if="scope.$index!==tableData.length-1"
          slot-scope="scope"
        >
          <el-button-group>
            <el-button
              icon="el-icon-caret-top"
              size="mini"
              type="primary"
              @click="moveUp(scope.$index,scope.row,tableData)"
            />
            <el-button
              icon="el-icon-caret-bottom"
              size="mini"
              type="primary"
              @click="moveDown(scope.$index,scope.row,tableData)"
            />
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="editOrder(scope.row)"
            />
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteOrder(scope.row)"
            />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="`${formData.id?'编辑':'插入'}胶料计划库存`"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
      class="dialog-style"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="胶料规格" prop="product_no">
          <el-select
            v-model="formData.product_no"
            style="width:250px"
            filterable
            placeholder="请选择"
            @visible-change="visibleChange"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.product_no"
              :value="item.product_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计划(吨)" prop="plan_weight">
          <el-input-number
            v-model="formData.plan_weight"
            style="width:250px"
            :precision="1"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input
            v-model="formData.desc"
            style="width:250px"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="各分厂计划及库存明细"
      width="90%"
      :visible.sync="dialogVisible1"
      :append-to-body="true"
    >
      <el-table
        v-loading="loading1"
        :row-class-name="tableRowClassName1"
        :data="tableData1"
        border
      >
        <el-table-column
          prop="factory"
          label="分厂"
          min-width="20"
        />
        <el-table-column
          prop="today_demanded"
          label="计划（吨）"
          min-width="20"
        />
        <el-table-column
          prop="current_stock"
          label="库存（吨）"
          min-width="20"
        />
        <el-table-column
          prop="safety_stock"
          label="安全库存（吨）"
          min-width="20"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible1=false">返回</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title=""
      width="90%"
      :visible.sync="dialogVisible2"
      :append-to-body="true"
    >
      <el-form
        :inline="true"
      >
        <el-form-item label="胶料名称">
          <el-input
            v-model="search.product_no"
            @input="changeSearch"
          />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading2"
        :data="tableData2"
        border
      >
        <el-table-column
          prop="reason_name"
          label="胶料名称"
          min-width="20"
        />
        <el-table-column
          prop="factory_date"
          label="需生产重量"
          min-width="20"
        />
        <el-table-column
          prop="machine_no"
          label="机型"
          min-width="20"
        />
        <el-table-column
          prop="production_no"
          label="单车投入kg"
          min-width="20"
        />
        <el-table-column
          prop="lot_no"
          label="单车产出kg"
          min-width="20"
        />
        <el-table-column
          prop="pallet_no"
          label="需生产车次"
          min-width="20"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible2=false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { productInfosUrl } from '@/api/base_w'
import { schedulingProductDemandedDeclare } from '@/api/base_w_five'
import { schedulingProductDeclareSummary, upSequence, downSequence } from '@/api/jqy'
import { setDate, exportExcel } from '@/utils'
export default {
  name: 'ScheduleInventorySummary',
  components: {},
  data() {
    return {
      search: { factory_date: setDate() },
      btnExportLoad: false,
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      exportTableShow: false,
      loadingBtn: false,
      loading: false,
      loading1: false,
      loading2: false,
      formData: {},
      tableData: [],
      tableData1: [],
      tableData2: [],
      options: [],
      rules: {
        product_no: [{ required: true, message: '不能为空', trigger: 'change' }],
        plan_weight: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },

  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await schedulingProductDeclareSummary('get', null, { params: this.search })
        this.tableData = data || []
        if (this.tableData.length > 0) {
          this.tableData.push({
            sn: '合计',
            plan_weight: sum(this.tableData, 'plan_weight'),
            workshop_weight: sum(this.tableData, 'workshop_weight'),
            current_stock: sum(this.tableData, 'current_stock'),
            target_stock: sum(this.tableData, 'target_stock'),
            available_time: sum(this.tableData, 'available_time'),
            demanded_weight: sum(this.tableData, 'demanded_weight')
          })
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
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
    tableRowClassName({ row, rowIndex }) {
      if (row.sn === '合计') {
        return 'summary-cell-style'
      }
    },
    tableRowClassName1({ row, rowIndex }) {
      if (row.factory === '合计') {
        return 'summary-cell-style'
      } else {
        if (row.current_stock > row.safety_stock) {
          return 'warning-row'
        } else if (row.current_stock < row.safety_stock) {
          return 'max-warning-row'
        }
      }
    },
    changeSearch() {
      this.$debounce(this, 'getList')
    },
    deleteOrder: function(row) {
      this.$confirm('此操作将删除' + row.product_no + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        schedulingProductDeclareSummary('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    async dialogStock(row) {
      try {
        this.loading1 = true
        const data = await schedulingProductDemandedDeclare('get', null, { params: { factory_date: this.search.factory_date, product_no: row.product_no, page_size: 10000000 }})
        this.tableData1 = data.results || []
        if (this.tableData1.length > 0) {
          this.tableData1.push({
            factory: '合计',
            today_demanded: sum(this.tableData1, 'today_demanded'),
            current_stock: sum(this.tableData1, 'current_stock'),
            safety_stock: sum(this.tableData1, 'safety_stock')
          })
        }
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
      this.dialogVisible1 = true
    },
    dialogProduction(row) {
      try {
        // this.loading2 = true
        // const data = await testTypes('get', null, { params: { all: 1 }})
        // this.tableData1 = data || []
        if (this.tableData2.length > 0) {
          this.tableData2.push({
            receiving_user: '合计',
            派单时间: sum(this.tableData2, '派单时间')
          })
        }
        this.loading2 = false
      } catch (e) {
        this.loading2 = false
      }

      this.dialogVisible2 = true
    },
    onSubmit() {
      this.formData = {}
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate()
      }
      this.dialogVisible = true
    },
    editOrder(row) {
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate()
      }
      this.formData = {
        id: row.id,
        product_no: row.product_no,
        plan_demand: row.plan_demand,
        desc: row.desc
      }
      this.dialogVisible = true
    },
    handleClose(done) {
      this.formData = {}
      this.$refs.formRef.clearValidate()
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    submitFun() {
      // this.$refs.formRef.validate(async(valid) => {
      //   if (valid) {
      //     try {
      //       this.loadingBtn = true
      //       const _mothod = this.formData.id ? 'put' : 'post'
      //       await weightingPackageSingle(_mothod, this.formData.id || null, { data: this.formData })
      //       this.$message.success('操作成功')
      //       this.handleClose(false)
      //       this.getList()
      //       this.loadingBtn = false
      //     } catch (e) {
      //       this.loadingBtn = false
      //     }
      //   } else {
      //     return false
      //   }
      // })
    },
    async moveUp(index, row, tableData) {
      if (index === 0) {
        this.$message({
          message: '处于顶端，不能继续上移',
          type: 'warning'
        })
      } else {
        await upSequence('post', null, { data: { id: row.id }})
        this.getList()
      }
    },
    async moveDown(index, row, tableData) {
      var that = this
      if (index + 2 === tableData.length) {
        that.$message({
          message: '处于末端，不能继续下移',
          type: 'warning'
        })
      } else {
        await downSequence('post', null, { data: { id: row.id }})
        this.getList()
      }
    },
    async exportTable() {
      await this.$set(this, 'exportTableShow', true)
      await exportExcel('胶料计划库存汇总')
      setTimeout(() => {
        this.exportTableShow = false
      }, 1000)
    },
    Upload(param) {
      // const formData = new FormData()
      // formData.append('file', param.file)
      // equipFaultSignalImport('post', null, { data: formData }).then(response => {
      //   this.$message({
      //     type: 'success',
      //     message: response
      //   })
      //   this.search.page = 1
      //   this.getList()
      // })
    }
  }

}
function sum(arr, params) {
  var s = 0
  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 100) / 100
  return s
}
</script>

<style scope>
  .el-table .warning-row {
    background: #FFFF80;
  }
  .el-table .max-warning-row {
    background: #D9001B;
  }
</style>
