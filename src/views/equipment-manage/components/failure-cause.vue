<template>
  <div>
    <!-- 停机故障原因选择 列表 -->
    <el-form inline>
      <el-form-item label="故障大类名称">
        <el-input v-model="dataForm.fault_type_name" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="故障代码">
        <el-input v-model="dataForm.fault_code" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="故障名称">
        <el-input v-model="dataForm.fault_name" clearable @input="debounceFun" />
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
        prop="fault_type_code"
        label="故障大类代码"
        min-width="20"
      />
      <el-table-column
        prop="fault_type_name"
        label="故障大类名称"
        min-width="20"
      />
      <el-table-column
        prop="fault_code"
        label="分类代码"
        min-width="20"
      />
      <el-table-column
        prop="fault_name"
        label="分类名称"
        min-width="20"
      />
    </el-table>
    <!-- <page
      :old-page="false"
      :total="total"
      :current-page="dataForm.page"
      @currentChange="currentChange"
    /> -->
  </div>
</template>

<script>
import { equipFaultCodes } from '@/api/base_w_four'
// import page from '@/components/page'
export default {
  // components: { page },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    listCurrent: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dataForm: {},
      tableData: [],
      total: 0,
      loading: false,
      handleSelection: []
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.getList(true)
      } else {
        this.dataForm = {}
        this.$refs.multipleTable.clearSelection()
      }
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    async getList(bool) {
      try {
        this.dataForm.use_flag = true
        this.loading = true
        const data = await equipFaultCodes('get', null, { params: this.dataForm })
        this.tableData = data || []
        // this.tableData = this.tableData.filter(d => d.use_flag)
        if (bool) {
          this.tableData.forEach(d => {
            if (this.listCurrent.findIndex(D => D === d.id) > -1) {
              this.$refs.multipleTable.toggleRowSelection(d)
            }
          })
        }
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
    changeList() {
      this.dataForm.page = 1
      this.getList()
    },
    debounceFun() {
      this.$debounce(this, 'changeList')
    },
    handleSelectionChange(val) {
      this.handleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
