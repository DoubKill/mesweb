<template>
  <div>
    <!-- 不合格处置单 -->
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
      <el-form-item label="原因编辑">
        <el-select
          v-model="search.reason"
          clearable
          placeholder="请选择"
          @change="reasonChange"
        >
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.bool"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="技术处理">
        <el-select
          v-model="search.t_deal_suggestion"
          clearable
          placeholder="请选择"
          @change="reasonChange"
        >
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.bool"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检查处理">
        <el-select
          v-model="search.c_deal_suggestion"
          clearable
          placeholder="请选择"
          @change="reasonChange"
        >
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.bool"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        label="处置单号"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-link type="primary" @click="clickOrderNum(scope.$index,scope.row)">{{ scope.row.unqualified_deal_order_uid }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_date"
        label="创建时间"
      >
        <template slot-scope="{row}">
          {{ (row.created_date).split(' ')[0] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="department"
        label="发生部门"
      />
      <!-- <el-table-column
        prop="c"
        label="相关胶料"
        show-overflow-tooltip
      /> -->
      <el-table-column
        prop="reason"
        label="不合格原因"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ changeInputBack(row.reason) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="t_deal_suggestion"
        label="技术不合格原因"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ changeInputBack(row.t_deal_suggestion) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="c_deal_suggestion"
        label="检查不合格原因"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ changeInputBack(row.c_deal_suggestion) }}
        </template>
      </el-table-column>
      <el-table-column
        label="原因编辑"
      >
        <template slot-scope="scope">
          <el-button v-permission="['unqualified_order','reason']" size="small" @click="editReason(scope.$index,scope.row,1)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="技术处理"
      >
        <template slot-scope="scope">
          <el-button v-permission="['unqualified_order','tech']" size="small" @click="editReason(scope.$index,scope.row,2)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="检查处理"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['unqualified_order','check']"
            size="small"
            @click="editReason(scope.$index,scope.row,3)"
          >编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="deal_user"
        label="原因编辑人"
      />
      <el-table-column
        prop="t_deal_user"
        label="技术处理人"
      />
      <el-table-column
        prop="c_deal_user"
        label="检查处理人"
      />
      <el-table-column
        prop="deal_date"
        label="原因编辑时间"
      />
      <el-table-column
        prop="t_deal_date"
        label="技术处理时间"
      />
      <el-table-column
        prop="c_deal_date"
        label="检查处理时间"
      />
    </el-table>
    <page
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
        :order-row="currentRow"
        :edit-type="editType"
        :show="handleCardDialogVisible"
        @submitFun="submitFun"
      />
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import excel from './disposal-list-components/excel'
import { unqualifiedDealOrders } from '@/api/base_w'
import { setDate } from '@/utils'
export default {
  components: { excel, page },
  data() {
    return {
      tableData: [
      ],
      search: {
        value: [],
        page: 1
      },
      total: 0,
      options: [{ name: '已处理', bool: false }, { name: '未处理', bool: true }],
      handleCardDialogVisible: false,
      currentRow: {},
      editType: null,
      dateValue: [setDate(), setDate()]
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
        const data = await unqualifiedDealOrders('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
      } catch (e) {
        //
      }
    },
    changeInputBack(val) {
      if (!val) return ''
      return (val).replace(/<br>/g, '\r\n').replace(/<br>/g, '\n').replace(/&nbsp;/g, '\s')
    },
    editReason(index, row, num) {
      this.handleCardDialogVisible = true
      this.currentRow = row
      this.editType = num
    },
    clickOrderNum(index, row) {
      this.handleCardDialogVisible = true
      this.currentRow = row
      this.editType = null
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    searchDate(arr) {
      this.search.st = arr ? arr[0] : ''
      this.search.et = arr ? arr[1] : ''
      this.search.page = 1
      this.getList()
    },
    submitFun() {
      this.handleCardDialogVisible = false
      this.getList()
    },
    reasonChange() {
      this.search.page = 1
      this.getList()
    }
  }
}
</script>

<style>

</style>
