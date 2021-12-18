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
          v-model="search.production_no"
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
        prop="name"
        label="机台"
      />
      <el-table-column
        prop="name"
        label="胶料名称"
      />
      <el-table-column
        prop="name"
        label="单车投入kg"
      />
      <el-table-column
        prop="name"
        label="单车产出kg"
      />
      <el-table-column
        prop="name"
        label="放置期(小时)"
      />
    </el-table>
  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'ScheduleWeightStatistics',
  components: { EquipSelect },
  data() {
    return {
      search: {},
      category_name: '',
      loading: false,
      tableData: []
    }
  },

  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        // this.loading = true
        // const data = await testTypes('get', null, { params: { all: 1 }})
        // this.tableData = data || []
        // this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    equipSelected(obj) {
      this.search.equip_no = obj.equip_no
      this.category_name = obj.category__category_name
      this.getList()
    },
    changeSearch() {
      this.$debounce(this, 'getList')
    }
  }

}
</script>

<style scoped lang='scss'>
</style>
