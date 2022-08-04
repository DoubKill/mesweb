<template>
  <div class="rubber-frame-repair-total">
    <!-- 胶架维修记录汇总 -->
    <el-form :inline="true">
      <el-form-item label="年份">
        <el-date-picker
          v-model="search.select_date"
          type="year"
          :clearable="false"
          format="yyyy"
          value-format="yyyy"
          placeholder="选择年"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['equip_finishing_rate','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column width="130px">
        <template
          slot="header"
        >
          <div class="header-style">
            <div style="width:100%;text-align:right;margin:8px 0 20px 0">月份</div>
            <span>项目</span>
            <div class="header-style-line three-line" />
          </div>
        </template>
        <template
          slot-scope="{row}"
        >
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="1月"
        label="1月"
        min-width="20"
      />
      <el-table-column
        prop="2月"
        label="2月"
        min-width="20"
      />
      <el-table-column
        prop="3月"
        label="3月"
        min-width="20"
      />
      <el-table-column
        prop="4月"
        label="4月"
        min-width="20"
      />
      <el-table-column
        prop="5月"
        label="5月"
        min-width="20"
      />
      <el-table-column
        prop="6月"
        label="6月"
        min-width="20"
      />
      <el-table-column
        prop="7月"
        label="7月"
        min-width="20"
      />
      <el-table-column
        prop="8月"
        label="8月"
        min-width="20"
      />

      <el-table-column
        prop="9月"
        label="9月"
        min-width="20"
      />
      <el-table-column
        prop="10月"
        label="10月"
        min-width="20"
      />
      <el-table-column
        prop="11月"
        label="11月"
        min-width="20"
      />
      <el-table-column
        prop="12月"
        label="12月"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import { rubberFrameRepairSummary } from '@/api/jqy'
import { exportExcel, setDate } from '@/utils/index'
export default {
  name: 'RubberFrameRepairTotal',
  data() {
    return {
      search: { select_date: '' },
      loading: false,
      tableData: []
    }
  },
  created() {
    this.search.select_date = setDate(null, null, 'year').toString()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await rubberFrameRepairSummary('get', null, { params: this.search })
        this.tableData = data
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    exportTable() {
      exportExcel('胶架维修记录汇总')
    }
  }
}
</script>

<style lang="scss">
.rubber-frame-repair-total{
    .el-table th{
        padding:0;
    }
    .header-style{
        position: relative;
    }
    .header-style-line{
        height: 1px;
        background:  #e4e6e9;
    }
    .three-line{
        transform-origin:left center;
        transform:rotate(29.5deg);
        width:150px;
        position: absolute;
        top:-8px;
        left:-6px;
    }
    .el-table .wl-row{
        background: #f6ecff;
    }
}
</style>
