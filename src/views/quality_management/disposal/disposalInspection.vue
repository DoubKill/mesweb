<template>
  <div>
    <!-- 工艺检查科处理 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="searchDate"
        />
      </el-form-item>
      <el-form-item label="发生部门">
        <el-select
          v-model="search.department"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="不合格状态">
        <el-select
          v-model="search.status"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in options1"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处置单号">
        <el-input v-model="search.unqualified_deal_order_uid" clearable @input="changeSearch" />
      </el-form-item>
      <el-form-item label="是否已处理">
        <el-select
          v-model="search.c_solved"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in options2"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="unqualified_deal_order_uid"
        label="处置单号"
        show-overflow-tooltip
      />
      <el-table-column
        prop="created_date"
        label="处置时间"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ (row.created_date).split(' ')[0] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="department"
        label="发生部门"
        show-overflow-tooltip
      />
      <el-table-column
        prop="status"
        label="不合格状态"
        show-overflow-tooltip
      />
      <el-table-column
        prop="c_solved"
        label="是否已处理"
        show-overflow-tooltip
      />
      <el-table-column
        prop="use_flag"
        label="处理类型"
        min-width="50"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.use_flag"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="同意"
            inactive-text="不同意"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="40"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="creatExcel(scope)"
          >不合格处理
          </el-button>
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
      :fullscreen="true"
      :visible.sync="handleCardDialogVisible"
    >
      <excel
        ref="handleCard"
        :order-row="orderRow"
        :form-head-data="formHeadData"
        :edit-type="3"
        :show="handleCardDialogVisible"
        @cancelFun="cancelFun"
        @preserveFun="preserveFun"
      />
    </el-dialog>
  </div>
</template>

<script>
import excel from '.././disposal-list-components/excelNew'
import page from '@/components/page'
import { unqualifiedDealOrders } from '@/api/base_w'
import { dataPoint } from '@/api/jqy'
// import { setDate } from '@/utils'
export default {
  name: 'DisposalInspection',
  components: { excel, page },
  data() {
    return {
      tableData: [],
      formHeadData: [],
      search: {
        page: 1
      },
      use_flag: true,
      loading: false,
      total: 0,
      options: ['准备分厂', '加硫车间', '混炼车间', '硫磺车间', '细料车间'],
      options1: ['来料', '半成品', '成品', '库存'],
      options2: ['Y', 'N'],
      handleCardDialogVisible: false,
      orderRow: {},
      editType: null,
      dateValue: []
    }
  },
  created() {
    // this.search.st = setDate()
    // this.search.et = setDate()
    this.getDataPoint()
    this.getList()
  },
  methods: {
    submitFun() {
      this.handleCardDialogVisible = false
      this.getList()
    },
    async getDataPoint() {
      try {
        const data = await dataPoint('get')
        this.formHeadData = data || []
      } catch (e) {
        this.formHeadData = []
      }
    },
    async getList() {
      try {
        this.loading = true
        this.tableData = []
        const data = await unqualifiedDealOrders('get', null, { params: this.search })
        this.total = data.count
        data.results.forEach(d => {
          this.tableData.push(
            Object.assign({}, d, { use_flag: true })
          )
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    searchDate(arr) {
      this.search.st = arr ? arr[0] : ''
      this.search.et = arr ? arr[1] : ''
      this.getList()
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    creatExcel(scope) {
      // if (scope.row.c_solved === 'Y') {
      //   this.$message.info('已处理不合格处置单不能重复处理')
      // } else {
      this.orderRow.id = scope.row.id
      this.handleCardDialogVisible = true
      if (scope.row.use_flag === true) {
        this.orderRow.c_deal_suggestion = '同意'
      } else {
        this.orderRow.c_deal_suggestion = '不同意'
      }
      // }
    },
    cancelFun() {
      this.handleCardDialogVisible = false
    },
    async preserveFun(obj) {
      try {
        const paramsData = {
          c_deal_suggestion: obj.c_deal_suggestion,
          c_deal_date: obj.c_deal_date,
          c_deal_user: obj.c_deal_user,
          desc: obj.desc
        }
        await unqualifiedDealOrders('patch', obj.id, { data: paramsData })
        this.$message.success('处理成功！！！！')
        this.handleCardDialogVisible = false
        this.getList()
      } catch (e) {
        //
      }
    }
  }
}
</script>
