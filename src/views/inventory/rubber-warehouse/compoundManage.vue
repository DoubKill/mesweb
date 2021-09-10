<template>
  <div class="app-container outbound_manage">
    <!-- 混炼胶出库计划 -->
    <el-form :inline="true">
      <el-form-item label="单据号">
        <el-input v-model="search.order_no" size="" clearable placeholder="请输入单据号" @input="changeList" />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="search.product_no" clearable placeholder="请输入物料编码" @input="changeList" />
      </el-form-item>
      <el-form-item label="建单起止时间">
        <el-date-picker
          v-model="dateSearch"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="searchDate"
        />
      </el-form-item>
      <br>
      <el-form-item label="库区">
        <el-select
          v-model="search.warehouse"
          placeholder="请选择库区"
          clearable
          @change="changeList"
        >
          <el-option
            v-for="item in ['终炼胶库','混炼胶库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库口">
        <el-select
          v-model="search.station"
          placeholder="请选择出库口"
          clearable
          @visible-change="getStation"
          @change="changeList"
        >
          <el-option
            v-for="item in stationList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="button-right" type="primary" @click="getList">查询</el-button>
        <el-button class="button-right" type="primary" @click="dialog">新建单据</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="新建混炼胶出库单据"
      :visible.sync="dialogVisibleNo"
      width="20%"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :inline="true"
        :model="creatOrder"
        :rules="rules"
      >
        <el-form-item style="marginLeft:29px" label="库区" prop="warehouse">
          <el-select
            v-model="creatOrder.warehouse"
            placeholder="请选择"
            clearable
            @change="clear"
          >
            <el-option
              v-for="item in ['终炼胶库','混炼胶库']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="marginLeft:15px" label="出库口" prop="station">
          <el-select
            v-model="creatOrder.station"
            placeholder="请选择"
            clearable
            @visible-change="getStation1"
          >
            <el-option
              v-for="item in stationList1"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="胶料编码" prop="product_no">
          <el-select
            v-model="creatOrder.product_no"
            placeholder="请选择胶料编码"
            clearable
            @visible-change="productBatchingChanged"
          >
            <el-option
              v-for="item in batchList"
              :key="item.material_no"
              :label="item.material_name"
              :value="item.material_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="marginLeft:10px" label="订单数量" prop="order_qty">
          <el-input
            v-model="creatOrder.order_qty"
            placeholder="请输入订单数量"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        label="批量出库"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status!==1"
            size="mini"
            type="primary"
            @click="normalOutbound(scope)"
          >批量出库</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="指定出库"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status!==1"
            size="mini"
            type="primary"
            @click="assignOutbound(scope)"
          >指定出库</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="关闭"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status!==1"
            size="mini"
            type="danger"
            @click="deleteList(scope)"
          >关闭</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="warehouse"
        label="库房"
        min-width="20"
      />
      <el-table-column
        prop="station"
        label="出库口"
        min-width="20"
      />
      <el-table-column
        prop="order_no"
        label="单据号"
        min-width="25"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        prop="order_qty"
        label="订单数量"
        min-width="20"
      />
      <el-table-column
        prop="need_qty"
        label="需求数量"
        min-width="20"
      />
      <el-table-column
        prop="work_qty"
        label="工作数量"
        min-width="20"
      />
      <el-table-column
        prop="finished_qty"
        label="完成数量"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="创建人员"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
        min-width="25"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="指定出库"
      :visible.sync="assignOutboundDialogVisible"
      :before-close="handleCloseNormal"
      width="80%"
    >
      <generate-assign-outbound
        ref="assignOutbound"
        :warehouse-name="warehouseName"
        :list="list"
        :warehouse-info="warehouseInfo"
        :show="assignOutboundDialogVisible"
        @getList="getList"
        @visibleMethod="visibleMethodNormal"
      />
    </el-dialog>
    <el-dialog
      title="正常出库"
      :visible.sync="normalOutboundDialogVisible"
      :before-close="handleCloseNormal"
      width="80%"
    >
      <generate-normal-outbound
        ref="normalOutbound"
        :warehouse-name="warehouseName"
        :list="list"
        :warehouse-info="warehouseInfo"
        :show="normalOutboundDialogVisible"
        @getList="getList"
        @visibleMethod="visibleMethodNormal"
      /></el-dialog>
  </div>
</template>

<script>
import GenerateAssignOutbound from '../components-film/generate_assign_outbound'
import GenerateNormalOutbound from '../components-film/generate_normal_outbound'
import { bzMixinInventorySummary, bzFinalInventorySummary } from '@/api/base_w_four'
import { compoundManage } from '@/api/jqy'
import { stationInfo } from '@/api/warehouse'
import page from '@/components/page'

export default {
  name: 'CompoundManage',
  components: { page, GenerateAssignOutbound, GenerateNormalOutbound },
  data() {
    return {
      loading: false,
      submit: false,
      search: {
        page: 1
      },
      creatOrder: {
        product_no: '',
        warehouse: '',
        station: ''
      },
      dateSearch: [],
      stationList: [],
      batchList: [],
      stationList1: [],
      total: 0,
      list: {},
      tableData: [],
      dialogVisibleNo: false,
      assignOutboundDialogVisible: false,
      normalOutboundDialogVisible: false,
      currentIndex: null,
      rowVal: {},
      warehouseName: '',
      // 仓库id
      warehouseInfo: null,
      handleSelection: [],
      rules: {
        product_no: [
          { required: true, message: '请选择胶料编码', trigger: 'blur' }
        ],
        order_qty: [
          { pattern: /^[1-9]\d*$/, message: '只能输入正整数' }
        ],
        warehouse: [
          { required: true, message: '请先选择库区', trigger: 'blur' }
        ],
        station: [
          { required: true, message: '请选择出库口', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    dialog() {
      this.creatOrder.product_no = ''
      this.creatOrder.warehouse = localStorage.getItem('warehouse')
      this.creatOrder.station = localStorage.getItem('station')
      this.dialogVisibleNo = true
    },
    async productBatchingChanged() {
      if (this.creatOrder.warehouse === '') {
        this.batchList = []
        this.$message.info('请先选择库区')
      } else {
        try {
          const _api = this.creatOrder.warehouse === '混炼胶库' ? bzMixinInventorySummary : bzFinalInventorySummary
          const obj = {}
          obj.all = 1
          const data = await _api('get', null, { params: obj })
          this.batchList = data
        } catch (e) { this.batchList = [] }
      }
    },
    async deleteList(scope) {
      try {
        await compoundManage('patch', scope.row.id, { data: { status: '4' }})
        this.$message.success('关闭成功')
        this.getList()
      } catch (e) { this.$message.info('关闭失败') }
    },
    generateFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.submit = true
            await compoundManage('post', null, { data: this.creatOrder })
            this.submit = false
            this.$message.success('新建成功')
            localStorage.setItem('warehouse', this.creatOrder.warehouse)
            localStorage.setItem('station', this.creatOrder.station)
            this.dialogVisibleNo = false
            this.getList()
          } catch (e) { this.submit = false }
        } else {
          this.$message.info('输入必填项')
        }
      })
    },
    async getList() {
      try {
        this.loading = true
        this.tableData = []
        const data = await compoundManage('get', null, { params: this.search })
        this.total = data.count
        this.tableData = data.results
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async getStation() {
      try {
        if (this.search.warehouse) {
          const data1 = await stationInfo({ warehouse_name: this.search.warehouse })
          this.stationList = data1.results
        } else {
          const data1 = await stationInfo({ all: 1 })
          this.stationList = data1
        }
      } catch (error) {
        console.log()
      }
    },
    clear() {
      if (this.creatOrder.station !== '') {
        this.creatOrder.station = ''
      }
      if (this.creatOrder.product_no !== '') {
        this.creatOrder.product_no = ''
      }
    },
    async getStation1() {
      try {
        if (this.creatOrder.warehouse !== '') {
          const data1 = await stationInfo({ warehouse_name: this.creatOrder.warehouse })
          this.stationList1 = data1.results
        } else {
          this.stationList1 = []
          this.$message.info('请先选择库区')
        }
      } catch (error) {
        console.log()
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    handleClose(done) {
      this.dialogVisibleNo = false
      if (done) {
        done()
      }
    },
    handleCloseNormal(done) {
      if (this.$refs.normalOutbound) {
        this.$refs.normalOutbound.creadVal()
      }
      if (this.$refs.assignOutbound) {
        this.$refs.assignOutbound.creadVal()
      }
      done()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    searchDate(arr) {
      this.search.st = arr ? arr[0] : ''
      this.search.et = arr ? arr[1] : ''
      this.getList()
    },
    visibleMethodNormal() {
      this.normalOutboundDialogVisible = false
      this.assignOutboundDialogVisible = false
    },
    normalOutbound(scope) {
      this.list = scope.row
      this.warehouseName = scope.row.warehouse
      this.normalOutboundDialogVisible = true
    },
    assignOutbound(scope) {
      console.log(scope.row)
      this.list = scope.row
      this.warehouseName = scope.row.warehouse
      this.assignOutboundDialogVisible = true
    }
  }
}
</script>
<style lang="scss">
  .outbound_manage{
    .el-dialog{
      min-width: 500px !important;
    }
  }
</style>
