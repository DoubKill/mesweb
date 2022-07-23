<template>
  <div>
    <!-- 操作履历 -->
    <el-form :inline="true">
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日时"
          end-placeholder="结束日时"
          :default-time="['08:00:00', '08:00:00']"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="界面名称">
        <el-input v-model="search.menu_name" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="操作员姓名">
        <el-input v-model="search.operator" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['user_operation_log','export']" type="primary" :loading="btnExportLoad" @click="templateDownload">导出Excel</el-button>
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
        label="日时"
        min-width="10"
      />
      <el-table-column
        prop="menu_name"
        label="界面名称"
        min-width="20"
      />
      <el-table-column
        prop="operations"
        label="操作内容（按钮名称：操作对象+操作信息)"
        min-width="40"
      />
      <el-table-column
        prop="operator"
        label="操作员"
        min-width="10"
      />
      <el-table-column
        prop="create_time"
        label="操作时间"
        min-width="10"
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
import { userOperationLog } from '@/api/base_w_two'
export default {
  name: 'OperationHistory',
  components: { page },
  data() {
    return {
      dateValue: [],
      search: {},
      total: 0,
      loading: false,
      tableData: [],
      btnExportLoad: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await userOperationLog('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count || 0
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    debounceFun() {
      this.$debounce(this, 'changePage')
    },
    changePage() {
      this.search.page = 1
      this.getList()
    },
    changeDate(arr) {
      this.search.st = arr ? arr[0] : ''
      this.search.et = arr ? arr[1] : ''
      this.search.page = 1
      this.getList()
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    templateDownload() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = userOperationLog
      _api('get', null, { responseType: 'blob', params: obj })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '操作履历.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
