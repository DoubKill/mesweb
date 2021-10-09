<template>
  <div>
    <!-- 出入库履历查询 -->
    <el-form :inline="true">
      <el-form-item label="起止时间">
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
      <el-form-item label="出库/入库">
        <el-select
          v-model="search.feeding"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['出库','入库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出入库单号">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="备件条码">
        <el-input
          v-model="search.equip1"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="备件代码">
        <el-select
          v-model="search.feedi"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in ['减速机','电机']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备件分类">
        <el-input
          v-model="search.equip1"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="备件名称">
        <el-input
          v-model="search.equip1"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input
          v-model="search.equip1"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">导出Excel</el-button>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        prop="date"
        label="出库/入库"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="出入库单号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="备件条码"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="备件名称"
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
        label="数量"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="单位"
        min-width="20"
      />
      <el-table-column
        prop="date"
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
        label="操作人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="操作时间"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import page from '@/components/page'
export default {
  name: 'HistoryQuery',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      dateValue: [],
      tableData: [{ date: '1' }],
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeDate() {

    },
    getList() {

    },
    changeSearch() {
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

<style>

</style>
