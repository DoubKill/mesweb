<template>
  <div>
    <!--细料胶块放行处理 -->
    <el-form :inline="true">
      <el-form-item label="机台">
        <equip-select
          style="width:150px"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="计划编号">
        <el-input v-model="search.material_name" style="width:150px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="配方编号">
        <el-input v-model="search.material_no" style="width:150px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="search.material_name" style="width:150px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="物料条码">
        <el-input v-model="search.batch_no" style="width:150px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.quality_status"
          style="width:150px"
          clearable
          placeholder="请选择"
          filterable
          @change="changeList"
        >
          <el-option
            v-for="item in [{label:'未处理',value:1},{label:'已处理',value:3}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submit" @click="feed('可投料')">可投料</el-button>
        <el-button type="primary" :loading="submitNo" @click="feed('不可投料')">不可投料</el-button>
        <!-- <el-button type="primary">导出Excel</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
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
        prop="material_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="zc_material_code"
        label="计划编号"
        min-width="20"
      />
      <el-table-column
        prop="batch_no"
        label="配方编号"
        min-width="20"
      />
      <el-table-column
        prop="quality_status"
        label="配方可投入标准"
        min-width="20"
      />
      <el-table-column
        prop="pdm_no"
        label="配方投入物料名称"
        min-width="20"
      />
      <el-table-column
        prop="unit"
        label="实际投入物料"
        min-width="20"
      />
      <el-table-column
        prop="quantity"
        label="实际投入物料名称"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="实际投入物料条码"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="处理人"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="处理时间"
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
import EquipSelect from '@/components/EquipSelect'
import { debounce } from '@/utils'
import page from '@/components/page'
import { wmsStorageSummary } from '@/api/jqy'
export default {
  name: 'BanburyingSubstitutes',
  components: { page, EquipSelect },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      total: 0,
      submit: false,
      submitNo: false,
      multipleSelection: [],
      tableData: [],
      loading: false
    }
  },
  created() {
    // this.getList()
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
    feed(val) {

    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    debounceFun() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeList() {
      this.search.page = 1
      this.getList()
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
