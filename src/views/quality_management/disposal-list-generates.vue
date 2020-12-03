<template>
  <div v-loading="loading">
    <!-- 不合格处置单生成界面 -->
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
      <el-form-item label="班次">
        <classSelect @classSelected="classSelectedFun" />
      </el-form-item>
      <el-form-item label="胶料编码">
        <all-product-no-select @productBatchingChanged="productBatchingChanged" />
        <!-- <productNoSelect @productBatchingChanged="productBatchingChanged" /> -->
      </el-form-item>
      <!-- <el-form-item label="处理状态">
        <el-select v-model="search.a" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item> -->
    </el-form>
    <el-button
      v-permission="['unqualified_trains','add']"
      style="float:right;margin-bottom:20px"
      @click="generateFun"
    >生成不合格处理单</el-button>

    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        label="生产日期/班次"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.date }}/{{ scope.row.classes }}
        </template>
      </el-table-column>
      <el-table-column
        prop="equip_no"
        label="生产机台"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
      />
      <el-table-column
        label="车次"
      >
        <template slot-scope="scope">
          {{ setTrains(scope.row.actual_trains) }}
        </template>
      </el-table-column>
      <el-table-column label="不合格项">
        <el-table-column
          v-for="(item,index) in form_head_data"
          :key="index"
          :label="item"
        >
          <template slot-scope="scope">
            <span
              v-if="getArrMin(scope.row.indicator_data[item]) ===
                getArrMax(scope.row.indicator_data[item])"
            >
              {{ getArrMin(scope.row.indicator_data[item]) }}
            </span>
            <span v-else>
              {{ getArrMin(scope.row.indicator_data[item]) }}-
              {{ getArrMax(scope.row.indicator_data[item]) }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!-- <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    /> -->

    <el-dialog
      :fullscreen="true"
      :visible.sync="handleCardDialogVisible"
    >
      <excel
        ref="handleCard"
        :list-data-props="listData"
        :form-head-data="form_head_data"
        :show="handleCardDialogVisible"
        @submitFun="submitFun"
      />
    </el-dialog>
  </div>
</template>

<script>
// import page from '@/components/page'
import classSelect from '@/components/ClassSelect'
// import productNoSelect from '@/components/ProductNoSelect'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import excel from './disposal-list-components/excel'
import { setDate } from '@/utils'
import { unqualifiedTrains } from '@/api/base_w'
import funMixin from './disposal-list-components/mixin'
export default {
  components: { classSelect, allProductNoSelect, excel },
  mixins: [funMixin],
  data() {
    return {
      total: 0,
      search: {
      },
      options: ['已处理', '未处理'],
      tableData: [],
      handleCardDialogVisible: false,
      dateValue: [setDate(), setDate()],
      form_head_data: [],
      loading: false,
      listData: []
    }
  },
  created() {
    this.search.st = setDate()
    this.search.et = setDate()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await unqualifiedTrains('get', null, { params: this.search })
        this.form_head_data = data.form_head_data
        this.tableData = data.ret
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
    classSelectedFun(val) {
      this.search.classes = val
      this.getList()
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.material_no : ''
      this.getList()
    },
    handleSelectionChange(arr) {
      this.listData = arr
    },
    currentChange() {},
    generateFun() {
      if (!this.listData || this.listData.length === 0) {
        return
      }
      this.handleCardDialogVisible = true
    },
    submitFun() {
      this.handleCardDialogVisible = false
      this.getList()
    }
  }
}
</script>

<style>

</style>
