<template>
  <div>
    <!-- 停机故障原因选择 列表 -->
    <el-form inline>
      <el-form-item label="故障大类名称">
        <el-input v-model="dataForm.name" />
      </el-form-item>
      <el-form-item label="故障代码">
        <el-input v-model="dataForm.name" />
      </el-form-item>
      <el-form-item label="故障名称">
        <el-input v-model="dataForm.name" />
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      row-key="id"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
        :selectable="()=>{return true}"
      />
      <el-table-column
        prop="date"
        label="故障大类代码"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="故障大类名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="分类代码"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="分类名称"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="dataForm.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import page from '@/components/page'
export default {
  components: { page },
  data() {
    return {
      dataForm: {},
      tableData: [],
      total: 0,
      loading: false
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await equipmentProperty('get', null, { params: this.search })
        // this.tableData = data.results || []
        // this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page, page_size) {
      this.dataForm.page = page
      this.dataForm.page_size = page_size
      this.getList()
    },
    handleSelectionChange() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
