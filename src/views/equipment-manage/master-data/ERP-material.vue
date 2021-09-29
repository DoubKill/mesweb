<template>
  <div>
    <!-- ERP备件物料信息 -->
    <el-form :inline="true">
      <el-form-item label="备件分类:">
        <el-input v-model="search.property_no" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item label="备件名称:">
        <el-input v-model="search.property_no" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item label="规格型号:">
        <el-input v-model="search.property_no" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="search.region" clearable placeholder="作业类型">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="onSubmit">同步ERP</el-button>
        <el-button type="primary" @click="onSubmit">导入Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="date"
        label="备件代码"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="备件名称"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="备件分类"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="规格型号"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="技术参数"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="标准单位"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="关键部件"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="计划价格"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="材质"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="是否启用"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="操作者"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="同步时间"
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
import { debounce } from '@/utils'
export default {
  name: 'EquipmentMasterDataERPMaterial',
  components: { page },
  data() {
    return {
      search: {},
      loading: false,
      tableData: [],
      total: 0
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await testIndicators('get', null, { all: 1 })
        // this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    debounceList() {
      debounce(this, 'changeList')
    },
    changeList() {
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    onSubmit() {}
  }
}
</script>

<style lang="scss" scoped>

</style>
