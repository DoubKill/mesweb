<template>
  <div>
    <!-- 出勤记录表操作履历查询 -->
    <el-form :inline="true">
      <el-form-item label="考勤日期">
        <el-date-picker
          v-model="searchForm.record_date"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="操作类型">
        <el-input v-model="searchForm.opera_type" clearable @input="debounceList" />
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="searchForm.opera_user" clearable @input="debounceList" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="opera_user"
        label="操作人"
        min-width="20"
      />
      <el-table-column
        prop="opera_type"
        label="操作类型"
        min-width="20"
      />
      <el-table-column
        prop="opera_time"
        label="操作时间"
        min-width="20"
      />
      <el-table-column
        prop="record_date"
        label="考勤数据日期"
        min-width="20"
      />
    </el-table>
    <page
      :total="total"
      :old-page="false"
      :current-page="searchForm.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import page from '@/components/page'
import { employeeattendancerecordsLogs } from '@/api/jqy'
import { debounce } from '@/utils/'
export default {
  name: 'AttendanceQuery',
  components: { page },
  data() {
    return {
      searchForm: {},
      loading: false,
      tableData: [],
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeSearch() {
      this.searchForm.page = 1
      this.getList()
    },
    async getList() {
      try {
        this.loading = true
        const data = await employeeattendancerecordsLogs('get', null, { params: this.searchForm })
        this.tableData = data.results || []
        this.loading = false
        this.total = data.count
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page, pageSize) {
      this.searchForm.page = page
      this.searchForm.page_size = pageSize
      this.getList()
    },
    debounceList() {
      this.searchForm.page = 1
      debounce(this, 'getList')
    }
  }
}
</script>
