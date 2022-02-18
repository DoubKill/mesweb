<template>
  <div>
    <!--原材料库 质检信息设定 -->
    <el-form :inline="true">
      <el-form-item label="物料名称">
        <el-input v-model="search.material_name" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="search.material_no" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="中策物料编码">
        <el-input v-model="search.zc_material_code" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="批次号">
        <el-input v-model="search.batch_no" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="primary"
          :loading="addLoading"
          @click="addList"
        >添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="material_name"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="material_no"
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
        prop="quality_status"
        label="品质状态"
        min-width="20"
        :formatter="(row)=>{
          let obj = qualityStatus.find(d=>d.id === row.quality_status)
          return obj.name
        }"
      />
      <el-table-column
        prop="pdm_no"
        label="PDM"
        min-width="15"
      />
      <el-table-column
        prop="unit"
        label="单位"
        min-width="10"
      />
      <el-table-column
        prop="quantity"
        label="库存数量"
        min-width="15"
      />
      <el-table-column
        prop="weight"
        label="重量/kg"
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
import { wmsStorageSummary, wmsNucleinManagement } from '@/api/jqy'
export default {
  name: 'QualityInspectionRelease',
  components: { page },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: {
        l_flag: 1,
        page: 1,
        page_size: 10
      },
      total: 0,
      multipleSelection: [],
      tableData: [],
      loading: false,
      addLoading: false,
      qualityStatus: [
        { id: 1, name: '合格' },
        { id: 2, name: '抽检中' },
        { id: 3, name: '不合格' },
        { id: 4, name: '过期' },
        { id: 5, name: '待检品' }
      ]
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await wmsStorageSummary('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    debounceFun() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    async addList() {
      try {
        const obj = []
        this.multipleSelection.forEach(d => {
          obj.push({ material_no: d.material_no,
            material_name: d.material_name,
            zc_material_code: d.zc_material_code,
            batch_no: d.batch_no })
        })
        this.addLoading = true
        await wmsNucleinManagement('post', null, { data: obj })
        this.addLoading = false
        this.$emit('fatherMethod')
      } catch (e) {
        this.addLoading = false
      }
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
