
<template>
  <div>
    <!-- 维修标准弹框 -->
    <el-form :inline="true">
      <el-form-item label="物料编码">
        <el-input v-model="search.spare_code" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="search.spare_name" @input="changeSearch" />
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loadingView"
      :data="tableDataView"
      row-key="id"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column
        prop="spare__code"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="spare_name"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="component_type_name"
        label="备件分类"
        min-width="20"
      />
      <el-table-column
        prop="specification"
        label="规格型号"
        min-width="20"
      />
      <el-table-column
        prop="technical_params"
        label="技术参数"
        min-width="20"
      />
      <el-table-column
        prop="unit"
        label="标准单位"
        min-width="20"
      />
      <el-table-column
        v-if="type==='出库'"
        prop="quantity.all_qty"
        label="库存数量"
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
import { equipWarehouseInventory, equipWarehouseOrder } from '@/api/jqy'
import { debounce } from '@/utils'
export default {
  components: { page },
  props: {
    typeForm: {
      type: Object,
      default() {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: null
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      total: 0,
      loadingView: false,
      tableDataView: [],
      search: {},
      multipleSelection: []
    }
  },
  watch: {
    show(val) {
      if (val) {
        if (this.type === '入库') {
          this.search = {
            page: 1,
            page_size: 10,
            status: '入库'
          }
        }
        this.dialogSelect()
      }
    }
  },
  created() {
    if (this.type === '入库') {
      console.log(this.type)
      this.search = {
        page: 1,
        page_size: 10,
        status: '入库'
      }
    }
    this.dialogSelect()
  },
  methods: {
    async dialogSelect() {
      try {
        this.loadingView = true
        const data = await (this.type === '出库' ? equipWarehouseInventory('get', null, { params: this.search }) : equipWarehouseOrder('get', null, { params: this.search }))
        this.total = data.count
        this.tableDataView = data.results || []
        let data1 = []
        console.log(this.list)
        for (const i in this.list) {
          data1 = data1.concat(this.list[i].id)
        }
        this.tableDataView.forEach(row => {
          if (data1.indexOf(row.id) >= 0) {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          }
        })
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
      this.dialogVisibleSelect = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.dialogSelect()
    },
    changeSearch() {
      this.search.page = 1
      debounce(this, 'dialogSelect')
    }
  }

}
</script>

<style lang="scss" scoped>

</style>

