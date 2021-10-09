<template>
  <div>
    <!-- 出入库统计分析 -->
    <el-form :inline="true">
      <el-form-item label="起止日期">
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
      <el-form-item label="物料分类">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      row-key="id"
      border
    >
      <el-table-column
        type="index"
        width="50"
        label="序号"
      />
      <el-table-column
        prop="date"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="备件分类"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="规格型号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="入库数量"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialog(scope.row)"
          >{{ scope.row.date }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="出库数量"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialog(scope.row)"
          >{{ scope.row.date }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="数量单位"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="80%"
    >
      <el-form :inline="true">
        <el-form-item label="备件分类">
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input :disabled="true" />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        border
      >
        <el-table-column
          prop="order_no"
          label="备件条码"
          min-width="20"
        />
        <el-table-column
          prop="sub_no"
          label="库区"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="库位"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="数量"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="入库人"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="入库时间"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="出库人"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="出库时间"
          min-width="20"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
export default {
  name: 'Statistics',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      dateValue: [],
      tableData: [{ date: '1' }],
      tableDataView: [{ date: '1' }],
      total: 0,
      loadingView: false,
      dialogVisible: false
    }
  },
  methods: {
    created() {
      this.getList()
    },
    changeDate() {

    },
    getList() {

    },
    changeSearch() {
      this.getList()
    },
    dialog() {
      this.dialogVisible = true
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style>

</style>
