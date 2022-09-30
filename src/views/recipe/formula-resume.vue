<template>
  <div>
    <!-- MES配方变更履历 -->
    <el-form :inline="true">
      <el-form-item label="胶料名称">
        <el-input v-model="getParams.product_name" @change="changeList" />
      </el-form-item>
      <el-form-item label="机型">
        <equip-category-select
          v-model="getParams.dev_type"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="修改时间范围">
        <el-date-picker
          v-model="datePicker"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="配方状态">
        <el-select v-model="getParams.aaa" multiple placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="date"
        label="胶料名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="机型"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="创建时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="修改人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="变更履历"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="变更1"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import EquipCategorySelect from '@/components/EquipCategorySelect'
import page from '@/components/page'
export default {
  name: 'FormulaResume',
  components: { EquipCategorySelect, page },
  data() {
    return {
      getParams: {},
      datePicker: [],
      options: [
        { name: '启用' },
        { name: '停用' },
        { name: '废弃' }
      ],
      tableData: [],
      total: 0,
      loading: false
    }
  },
  methods: {
    async getList() {
      try {
        // this.loading = true
        // const data = await performanceJobLadder('get', null, { params: this.search })
        // this.tableData = data.results || []
        // this.total = data.count
        // this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.getParams.page = 1
      this.getList()
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
    }
  }
}
</script>

<style>

</style>
