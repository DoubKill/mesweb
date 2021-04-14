<template>
  <div>
    <!-- 车间库存明细 -->
    <el-form :inline="true">
      <el-form-item label="物料类型:">
        <materielTypeSelect
          @changeSelect="changeMaterialType"
        />
      </el-form-item>
      <el-form-item label="物料编码:">
        <materialCodeSelect
          @changeSelect="changeMaterialCode"
        />
      </el-form-item>
      <el-form-item label="切换库存明细:">
        <el-select v-model="switchDetails" placeholder="请选择">
          <el-option
            v-for="item in [{name:'胶片车间库存明细',id:1},{name:'原材料车间库存明细',id:2}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
    >
      <el-table-column label="基础信息">
        <el-table-column
          type="index"
          label="No"
          width="50"
        />
        <el-table-column
          prop="province"
          label="物料类型"
          min-width="20"
        />
        <el-table-column
          prop="province"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="province"
          label="物料名称"
          min-width="20"
        />
      </el-table-column>
      <el-table-column label="立库库存量">
        <el-table-column
          prop="province"
          label="数量"
          min-width="20"
        />
        <el-table-column
          prop="province"
          label="重量"
          min-width="20"
        />
      </el-table-column>
      <el-table-column label="线边库库存量">
        <el-table-column
          prop="province"
          label="数量"
          min-width="20"
        />
        <el-table-column
          prop="province"
          label="重量"
          min-width="20"
        />
      </el-table-column>
      <el-table-column label="总量">
        <el-table-column
          prop="province"
          label="数量"
          min-width="20"
        />
        <el-table-column
          prop="province"
          label="重量"
          min-width="20"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import materielTypeSelect from '@/components/select_w/materielTypeSelect'
import materialCodeSelect from '@/components/materialCodeSelect/index'

export default {
  components: { materielTypeSelect, materialCodeSelect },
  data() {
    return {
      switchDetails: 1,
      tableData: [],
      loading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await spareInventoryLog('get', null, { params: this.search })
        // this.tableData = data.results
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeMaterialType() {},
    changeMaterialCode() {}
  }
}
</script>

<style>

</style>
