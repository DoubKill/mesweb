<template>
  <div>
    <!-- 设备维护计划 -->
    <el-form :inline="true">
      <el-form-item label="设备类型:">
        <equipTypeSelect @equipTypeSelect="equipTypeSelectFun" />
      </el-form-item>
      <el-form-item label="设备编码:">
        <el-input
          v-model="search.equip_no"
          @input="changeList"
        />
      </el-form-item>
      <el-form-item label="设备名称:">
        <el-input
          v-model="search.equip_name"
          @input="changeList"
        />
      </el-form-item>
      <el-form-item label="部位名称:">
        <el-input
          v-model="search.a"
          @input="changeList"
        />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        type="index"
        width="40"
      />
      <el-table-column
        prop="date"
        label="设备类型"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备编码"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备部位"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维护周期"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维护类型"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维护标准"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="下次维护时间"
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
import equipTypeSelect from '../components/equip-type-select'
import page from '@/components/page'
export default {
  components: { equipTypeSelect, page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      tableData: [],
      total: 0
    }
  },
  methods: {
    equipTypeSelectFun(obj) {
      console.log(obj, 'obj')
    },
    changeList() {

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
