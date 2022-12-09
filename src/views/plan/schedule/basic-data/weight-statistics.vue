<template>
  <div>
    <!-- 胶料机台配方物料统计-->
    <el-form
      :inline="true"
    >
      <el-form-item label="机台">
        <equip-select
          equip-type="密炼设备"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="机型">
        <el-input
          v-model="category_name"
          disabled
        />
      </el-form-item>
      <el-form-item label="胶料名称">
        <el-input
          v-model="search.product_no"
          clearable
          @input="changeSearch"
        />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="equip_no"
        label="机台"
      />
      <el-table-column
        prop="stage_product_batch_no"
        label="胶料名称"
      />
      <el-table-column
        prop="devoted_weight"
        label="单车投入kg"
      />
      <el-table-column
        prop="batching_weight"
        label="单车产出kg"
      />
      <!-- <el-table-column
        prop="resting_period"
        label="放置期(小时)"
      /> -->
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
import EquipSelect from '@/components/EquipSelect/index'
import page from '@/components/page'
import { recipeMachineWeight } from '@/api/jqy'
export default {
  name: 'ScheduleWeightStatistics',
  components: { page, EquipSelect },
  data() {
    return {
      search: {},
      category_name: '',
      loading: false,
      tableData: [],
      total: 0
    }
  },

  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await recipeMachineWeight('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    equipSelected(obj) {
      this.search.page = 1
      this.search.equip_no = obj ? obj.equip_no : null
      this.category_name = obj ? obj.category__category_name : null
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    changeSearch() {
      this.search.page = 1
      this.$debounce(this, 'getList')
    }
  }

}
</script>

<style scoped lang='scss'>
</style>
