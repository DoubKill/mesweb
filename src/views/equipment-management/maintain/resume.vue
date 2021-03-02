<template>
  <div>
    <!-- 设备维护履历 -->
    <el-form :inline="true">
      <el-form-item label="日期:">
        <el-date-picker
          v-model="search.b"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeList"
        />
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
      <el-form-item label="单号:">
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
        label="日期"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="单号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备编码"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备部位"
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
        label="维护标准"
        min-width="20"
      >
        <template slot-scope="{row}">
          {{ row }}
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="维护人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维护开始时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维护结束时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维护时间"
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
export default {
  components: { page },
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
