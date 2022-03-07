<template>
  <div class="scheduledInventory">
    <!-- 排程无硫库存单 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="search.factory_date"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getList"
        />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input v-model="search.product_no" clearable filterable placeholder="请输入" @change="changeList" />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['aps_stock_summary','export']" type="primary" @click="exportTable">导出Excel</el-button>
        <el-button v-permission="['aps_stock_summary','export']" type="primary" @click="exportTable">保存</el-button>
        <el-button v-permission="['aps_stock_summary','export']" type="primary" @click="exportTable">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        align="center"
        prop="product_no"
        label="规格"
        min-width="20"
      />
      <el-table-column
        align="center"
        prop="HMB"
        label="HMB（kg）"
        min-width="40"
      >
        <el-table-column
          align="center"
          prop="GK400_pt"
          label="库内库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK400_pt }}</span>
            <el-input-number v-else v-model="row.GK400_pt" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="GK400_dj"
          label="现场库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK400_dj }}</span>
            <el-input-number v-else v-model="row.GK400_dj" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="CMB"
        label="CMB（kg）"
        min-width="40"
      >
        <el-table-column
          align="center"
          prop="GK400_pt"
          label="库内库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK400_pt }}</span>
            <el-input-number v-else v-model="row.GK400_pt" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="GK400_dj"
          label="现场库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK400_dj }}</span>
            <el-input-number v-else v-model="row.GK400_dj" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="1MB"
        label="1MB（kg）"
        min-width="40"
      >
        <el-table-column
          align="center"
          prop="GK400_pt"
          label="库内库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK400_pt }}</span>
            <el-input-number v-else v-model="row.GK400_pt" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="GK400_dj"
          label="现场库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK400_dj }}</span>
            <el-input-number v-else v-model="row.GK400_dj" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="2MB"
        label="2MB（kg）"
        min-width="40"
      >
        <el-table-column
          align="center"
          prop="GK400_pt"
          label="库内库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK400_pt }}</span>
            <el-input-number v-else v-model="row.GK400_pt" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="GK400_dj"
          label="现场库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK400_dj }}</span>
            <el-input-number v-else v-model="row.GK400_dj" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="3MB"
        label="3MB（kg）"
        min-width="40"
      >
        <el-table-column
          align="center"
          prop="GK400_pt"
          label="库内库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK400_pt }}</span>
            <el-input-number v-else v-model="row.GK400_pt" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="GK400_dj"
          label="现场库存"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK400_dj }}</span>
            <el-input-number v-else v-model="row.GK400_dj" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { schedulingStockSummary } from '@/api/jqy'
import { setDate, exportExcel } from '@/utils'
export default {
  name: 'ScheduledInventory',
  data() {
    return {
      loading: false,
      tableData: [],
      search: { factory_date: setDate() }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await schedulingStockSummary('get', null, { params: this.search })
        this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.$debounce(this, 'getList')
    },
    async exportTable() {
      await this.$set(this, 'loading', true)
      await exportExcel('排程无硫库存单')
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.scheduledInventory{
        .el-input-number{
            width:120px;
        }
    }
</style>
