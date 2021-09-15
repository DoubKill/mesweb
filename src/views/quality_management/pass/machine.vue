<template>
  <div>
    <!-- 胶料别合格率 -->
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
      <el-form-item label="胶料段">
        <el-select
          v-model="search.c_solved"
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
      <el-form-item label="胶料规格">
        <all-product-no-select :params-obj="paramsObj" :params-obj-must="false" @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
      <el-form-item label="生产机台">
        <selectEquip
          :equip_no_props.sync="search.equip_id"
          @changeSearch="changeSearch"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select />
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
        label="橡胶规格"
        show-overflow-tooltip
      />
      <el-table-column
        prop="created_date"
        label="检查数"
        show-overflow-tooltip
      />
      <el-table-column
        prop="department"
        label="合格量"
        show-overflow-tooltip
      />
      <el-table-column
        prop="status"
        label="门尼不合格"
        show-overflow-tooltip
      />
      <el-table-column
        prop="c_solved"
        label="硬度不合格"
        show-overflow-tooltip
      />
      <el-table-column
        prop="c_solved"
        label="一次合格率"
        show-overflow-tooltip
      />
      <el-table-column
        prop="c_solved"
        label="硫变合格率"
        show-overflow-tooltip
      />
      <el-table-column
        prop="c_solved"
        label="次品合计"
        show-overflow-tooltip
      />
      <el-table-column
        prop="c_solved"
        label="合格率"
        show-overflow-tooltip
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :fullscreen="false"
      width="800px"
      :visible.sync="handleCardDialogVisible"
      title="不合格处置工艺检查科处理"
      center
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
import selectEquip from '@/components/select_w/equip'
import ClassSelect from '@/components/ClassSelect'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import { unqualifiedDealOrders } from '@/api/base_w'
import { dataPoint } from '@/api/jqy'
// import { setDate } from '@/utils'
export default {
  name: 'Machine',
  components: { excel, page, allProductNoSelect, ClassSelect, selectEquip },
  data() {
    return {
      tableData: [],
      formHeadData: [],
      search: {
        page: 1,
        t_solved: 'Y'
      },
      use_flag: true,
      loading: false,
      total: 0,
      options: ['FM', 'N'],
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
        this.tableData = data.results
        this.tableData.forEach(d => {
          if (d.c_agreed === null) {
            d.c_agreed = true
          }
        })
        // data.results.forEach(d => {
        //   this.tableData.push(
        //     Object.assign({}, d, { use_flag: true })
        //   )
        // })
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
    }
  }
}
</script>
