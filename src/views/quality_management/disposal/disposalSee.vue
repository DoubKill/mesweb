<template>
  <div>
    <!-- 不合格处置单查看 -->
    <el-form :inline="true">
      <el-form-item label="处置日期">
        <el-date-picker
          v-model="search.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="处置意见">
        <el-select
          v-model="search.c_agreed"
          clearable
          placeholder="请选择"
          @change="changeDate"
        >
          <el-option
            v-for="item in [{name:'同意',id:true},{name:'不同意',id:false}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工艺技术科">
        <el-select
          v-model="search.t_solved"
          clearable
          placeholder="请选择"
          @change="changeDate"
        >
          <el-option
            v-for="item in [{name:'已处理',id:'Y'},{name:'未处理',id:'N'}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工艺检查科">
        <el-select
          v-model="search.c_solved"
          clearable
          placeholder="请选择"
          @change="changeDate"
        >
          <el-option
            v-for="item in [{name:'已处理',id:'Y'},{name:'未处理',id:'N'}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="search.factory_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="生产班次">
        <class-select @classSelected="classChanged" />
      </el-form-item>
      <el-form-item label="生产机台">
        <selectEquip :equip_no_props.sync="search.equip_no" @changeSearch="changeDate" />
      </el-form-item>
      <el-form-item label="规格">
        <all-product-no-select @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        label="处置单号"
        show-overflow-tooltip
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link type="primary" @click="clickOrderNum(scope.$index,scope.row)">{{ scope.row.unqualified_deal_order_uid }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_date"
        label="创建时间"
        min-width="14"
      >
        <template slot-scope="{row}">
          {{ (row.created_date).split(' ')[0] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="department"
        label="发生部门"
        min-width="13"
      />
      <el-table-column
        prop="reason"
        label="不合格品情况（生产过程，原因及程度）"
        show-overflow-tooltip
        min-width="20"
      >
        <template slot-scope="{row}">
          {{ changeInputBack(row.reason) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_username"
        label="不合格情况登录人"
        min-width="13"
      />
      <el-table-column
        prop="created_date"
        label="不合格情况登录时间"
        min-width="13"
      />
      <el-table-column
        prop="t_deal_suggestion"
        label="工艺技术科处理意见"
        min-width="20"
      >
        <template slot-scope="{row}">
          {{ changeInputBack(row.t_deal_suggestion) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="t_deal_user"
        label="工艺技术科处理人"
        min-width="13"
      />
      <el-table-column
        prop="t_deal_date"
        label="工艺技术科处理时间"
        min-width="13"
      />
      <el-table-column
        prop="c_deal_suggestion"
        label="工艺检查科处理意见"
        min-width="20"
      >
        <template slot-scope="{row}">
          {{ changeInputBack(row.c_deal_suggestion) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="c_deal_user"
        label="工艺检查科处理人"
        min-width="13"
      />
      <el-table-column
        prop="c_deal_date"
        label="工艺检查科处理时间"
        min-width="13"
      />
    </el-table>

    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      :visible.sync="handleCardDialogVisible"
      :fullscreen="true"
    >
      <excel
        ref="handleCard"
        style="width:800px"
        :order-row="currentRow"
        :form-head-data="formHeadData"
        :edit-type="3"
        :is-edit="false"
        :show="handleCardDialogVisible"
        @submitFun="submitFun"
      />
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { unqualifiedDealOrders } from '@/api/base_w'
import { dataPoint } from '@/api/jqy'
import excel from '../disposal-list-components/excelNew'
import classSelect from '@/components/ClassSelect'
import selectEquip from '@/components/select_w/equip'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
export default {
  name: 'DisposalSee',
  components: { page, excel, classSelect, selectEquip, allProductNoSelect },
  data() {
    return {
      search: {},
      total: 0,
      loading: false,
      tableData: [],
      handleCardDialogVisible: false,
      currentRow: {},
      formHeadData: []
    }
  },
  created() {
    this.getList()
    this.getDataPoint()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await unqualifiedDealOrders('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getDataPoint() {
      try {
        const data = await dataPoint('get')
        this.formHeadData = data || []
      } catch (e) {
        this.formHeadData = []
      }
    },
    changeDate() {
      this.search.st = this.search.date ? this.search.date[0] : ''
      this.search.et = this.search.date ? this.search.date[1] : ''
      this.search.page = 1
      this.getList()
    },
    classChanged(val) {
      this.search.classes = val
      this.search.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    debounceList() {
      this.$debounce(this, 'changeDate')
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.material_no : ''
      this.search.page = 1
      this.getList()
    },
    changeInputBack(val) {
      if (!val) return ''
      return (val).replace(/<br>/g, '\r\n').replace(/<br>/g, '\n').replace(/&nbsp;/g, '\s')
    },
    submitFun() {
      this.handleCardDialogVisible = false
      this.getList()
    },
    clickOrderNum(index, row) {
      this.handleCardDialogVisible = true
      this.currentRow = row
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__header{
  padding:0;
}
</style>
