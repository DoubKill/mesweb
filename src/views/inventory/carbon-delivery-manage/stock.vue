<template>
  <div>
    <!-- 炭黑库  库存管理 -->
    <el-form :inline="true">
      <el-form-item label="物料编码">
        <el-input v-model="search.material_no" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="search.material_name" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="物料组名称">
        <el-select
          v-model="search.material_group_name"
          clearable
          placeholder="请选择"
          filterable
          @change="changeList"
        >
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="巷道名称">
        <el-select
          v-model="search.tunnel_name"
          filterable
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in options1"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="name"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="code"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="zc_material_code"
        label="中策物料编码"
        min-width="20"
      />
      <el-table-column
        prop="batch_no"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="unit"
        label="单位"
        min-width="10"
      />
      <el-table-column
        prop="pdm"
        label="PDM"
        min-width="15"
      />
      <el-table-column
        prop="group_name"
        label="物料组"
        min-width="20"
      />
      <el-table-column
        prop="tunnel_name"
        label="巷道"
        min-width="20"
      />
      <el-table-column
        prop="quantity"
        label="可用数量"
        min-width="15"
      />
      <el-table-column
        prop="weight"
        label="重量"
        min-width="15"
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
import { debounce } from '@/utils'
import page from '@/components/page'
import { thInventory, thMaterialGroups, thTunnels } from '@/api/base_w_four'
export default {
  name: 'DeliveryStock',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      total: 0,
      options: [],
      options1: [],
      tableData: [],
      loading: false
    }
  },
  created() {
    this.getMaterialGroupList()
    this.getTunnelList()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await thInventory('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getMaterialGroupList() {
      try {
        const data = await thMaterialGroups('get')
        this.options = data
      } catch (e) {
        //
      }
    },
    async getTunnelList() {
      try {
        const data = await thTunnels('get')
        this.options1 = data
      } catch (e) {
        //
      }
    },
    debounceFun() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeList() {
      this.search.page = 1
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

<style lang="scss" scoped>

</style>
