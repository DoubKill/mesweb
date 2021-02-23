<template>
  <div
    v-loading="loading"
    element-loading-text="加载中..."
  >
    <el-form :inline="true">
      <el-form-item label="机型">
        <equip-category-select
          v-model="getParams.dev_type"
          @change="()=>{
            getParams.page = 1
            rubber_material_list()
          }"
        />
      </el-form-item>
      <el-form-item label="段次">
        <stage-id-select
          v-model="getParams.stage_id"
          @change="stageChange"
        />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input
          v-model="getParams.stage_product_batch_no"
          @input="()=>{
            getParams.page = 1
            rubber_material_list()
          }"
        />
      </el-form-item>
    </el-form>
    <el-table
      ref="singleTable"
      highlight-current-row
      :data="tableData"
      border
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        align="center"
        type="index"
        label="No"
      />
      <el-table-column
        align="center"
        prop="stage_product_batch_no"
        label="胶料配方编码"
      />
      <el-table-column
        align="center"
        prop="product_name"
        label="胶料名称"
      />
      <el-table-column
        align="center"
        prop="site_name"
        label="site"
      />
      <el-table-column
        align="center"
        prop="stage_name"
        label="段次"
      />
      <el-table-column
        align="center"
        prop="dev_type_name"
        label="炼胶机类型"
      />
      <el-table-column
        align="center"
        prop="batching_weight"
        label="配料重量"
      />
      <el-table-column
        align="center"
        prop="production_time_interval"
        label="炼胶时间"
      />
      <el-table-column
        align="center"
        prop="used_type"
        label="状态"
        :formatter="usedTypeFormatter"
      />
      <el-table-column
        align="center"
        prop="created_username"
        label="创建者"
      />
      <el-table-column
        align="center"
        prop="created_date"
        label="创建时间"
      />

    </el-table>
    <page
      :total="total"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import page from '@/components/page'
import StageIdSelect from '@/components/StageSelect/StageIdSelect'
import EquipCategorySelect from '@/components/EquipCategorySelect'
import { rubber_material_url } from '@/api/rubber_recipe_fun'

export default {
  components: { page, StageIdSelect, EquipCategorySelect },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      total: 0,
      getParams: {
        page: 1,
        stage_id: null,
        dev_type: null,
        stage_product_batch_no: '',
        used_type: 4,
        weight_batching: 1
      },
      tableData: [],
      loading: true,
      currentRow: null,
      RubberStateOptions: [{
        value: 1, label: '编辑'
      }, {
        value: 2, label: '提交'
      }, {
        value: 3, label: '校对'
      }, {
        value: 4, label: '启用'
      }, {
        value: 5, label: '驳回'
      }, {
        value: 6, label: '废弃'
      }]
    }
  },
  watch: {
    show(val) {
      if (!val) {
        this.$refs.singleTable.setCurrentRow()
      }
    }
  },
  created() {
    this.rubber_material_list()
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val
      if (val) {
        this.$emit('productBatchingSelect', val)
      }
    },
    stageChange() {
      this.getParams.page = 1
      this.rubber_material_list()
    },
    async rubber_material_list() {
      this.loading = true
      try {
        const response = await rubber_material_url('get', null, { params: this.getParams })
        this.tableData = response.results
        this.total = response.count
      // eslint-disable-next-line no-empty
      } catch (e) {
      }
      this.loading = false
    },
    usedTypeFormatter(row, column) {
      switch (row.used_type) {
        case 1:
          return '编辑'
        case 2:
          return '提交'
        case 3:
          return '校对'
        case 4:
          return '启用'
        case 5:
          return '驳回'
        case 6:
          return '废弃'
      }
    },
    currentChange(page) {
      this.getParams.page = page
      this.rubber_material_list()
    }

  }
}

</script>

<style lang="scss" scoped>
</style>

