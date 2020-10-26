<template>
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item label="胶料编码:">
        <product-no-select @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loadTable"
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        prop="material_no"
        label="胶料编码"
      />
      <el-table-column
        v-for="(item,i) in headTableData"
        :key="i"
        :label="item.name"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="clickInfo(scope.row,item,scope.row.test_data_detail[item.id])"
          >
            {{ scope.row.test_data_detail[item.id].indicator_exists | setIndicator_exists }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <view-dialog-trial
      :show-data="showData"
      :show="dialogVisible"
      @handleClose="dialogVisible = false"
    />
  </div>
</template>

<script>
import productNoSelect from '@/components/ProductNoSelect'
import viewDialogTrial from '@/components/select_w/viewDialogTrial'
import { materialTestTypes, testIndicators } from '@/api/base_w'
import page from '@/components/page'
export default {
  components: { productNoSelect, page, viewDialogTrial },
  filters: {
    setIndicator_exists(val) {
      return val ? '是' : '否'
    }
  },
  data() {
    return {
      tableData: [],
      loading: true,
      headTableData: [],
      search: {
        material_no: '',
        page: 1
      },
      total: 0,
      dialogVisible: false,
      showData: {},
      loadTable: false
    }
  },
  created() {
    Promise.all([this.getList(), this.getTestTypes()]).then((data) => {
      this.tableData = data[0].results
      this.headTableData = data[1]
      this.loading = false
    }).catch((e) => {
      this.loading = false
    })
  },
  methods: {
    async getList() {
      try {
        this.loadTable = this.loading !== true
        const data = await materialTestTypes('get', null, { params: this.search })
        this.total = data.count || 0
        this.loadTable = false
        return data
      } catch (e) {
        this.loadTable = false
        this.loading = false
      }
    },
    async getTestTypes() {
      try {
        const data = await testIndicators('get')
        return data
      } catch (e) {
        this.loading = false
      }
    },
    async productBatchingChanged(val) {
      this.search.material_no = val ? val.stage_product_batch_no : ''
      const data = await this.getList()
      this.tableData = data.result
    },
    clickInfo(row, val, boolObj) {
      if (!boolObj.indicator_exists) return
      this.dialogVisible = true
      this.showData = {
        material_no: row.material_no,
        type_name: val.name,
        test_type_id: val.id
      }
    },
    async currentChange(page) {
      this.search.page = page
      const { results } = await this.getList()
      this.tableData = results
    }
  }
}
</script>

<style scoped>
.el-link.el-link--primary{
  width: 100%;
  text-align: left;
  display: inline-block;
}
</style>
