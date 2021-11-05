<template>
  <div>
    <!-- 备件出入库履历查询 -->
    <el-form :inline="true">
      <el-form-item label="起止时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="出库/入库">
        <el-select
          v-model="search.status"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in [{name:'出库',id:2},{name:'入库',id:1}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出入库单号">
        <el-input
          v-model="search.order_id"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件条码">
        <el-input
          v-model="search.spare__code"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件代码">
        <el-input
          v-model="search.spare_code"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件分类">
        <el-input
          v-model="search.equip_component_type"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件名称">
        <el-input
          v-model="search.spare_name"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input
          v-model="search.specification"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">导出Excel</el-button>
        <el-button type="primary" @click="changeSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="date"
        label="出库/入库"
        min-width="20"
        :formatter="(row)=>{
          return row.status===1?'入库':'出库'
        }"
      />
      <el-table-column
        prop="order_id"
        label="出入库单号"
        min-width="20"
      />
      <el-table-column
        prop="spare__code"
        label="备件条码"
        min-width="20"
      />
      <el-table-column
        prop="spare_name"
        label="备件名称"
        min-width="20"
      />
      <el-table-column
        prop="component_type_name"
        label="备件分类"
        min-width="20"
      />
      <el-table-column
        prop="specification"
        label="规格型号"
        min-width="20"
      />
      <el-table-column
        prop="quantity"
        label="数量"
        min-width="20"
      />
      <el-table-column
        prop="unit"
        label="单位"
        min-width="20"
      />
      <el-table-column
        prop="area_name"
        label="库区"
        min-width="20"
      />
      <el-table-column
        prop="location_name"
        label="库位"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="操作人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
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
import { equipWarehouseRecord } from '@/api/base_w_five'
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
      tableData: [],
      total: 0,
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.search.page = 1
      this.getList()
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    debounceSearch() {
      this.$debounce(this, 'changeSearch')
    },
    async getList() {
      try {
        this.loading = true
        const obj = {}
        Object.assign(obj, this.search)
        const data = await equipWarehouseRecord('get', null, { params: obj })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
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
