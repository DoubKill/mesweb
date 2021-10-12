<template>
  <div>
    <!-- ERP备件物料信息 -->
    <el-form :inline="true">
      <el-form-item label="备件分类:">
        <el-select v-model="search.equip_component_type" clearable placeholder="备件分类" @change="changeSearch">
          <el-option
            v-for="item in options"
            :key="item.equip_component_type__component_type_name"
            :label="item.equip_component_type__component_type_name"
            :value="item.equip_component_type__component_type_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备件名称:">
        <el-input v-model="search.spare_name" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item label="规格型号:">
        <el-input v-model="search.specification" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="search.use_flag" clearable placeholder="是否启用" @change="changeSearch">
          <el-option
            v-for="item in [{label:'Y',value:1},{label:'N',value:0}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商名称:">
        <el-input v-model="search.supplier_name" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="onSubmit">导入Excel</el-button>
        <el-button type="primary" @click="onSubmit">导出Excel</el-button>
        <el-button type="primary" @click="onSubmit">同步ERP</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="spare_code"
        label="备件代码"
        min-width="20"
      />
      <el-table-column
        prop="spare_name"
        label="备件名称"
        min-width="20"
      />
      <el-table-column
        prop="equip_component_type_name"
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
        prop="key_parts_flag"
        label="关键部件"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.key_parts_flag===true">是</span>
          <span v-if="scope.row.key_parts_flag===false">否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cost"
        label="计划价格"
        min-width="20"
      />
      <el-table-column
        prop="texture_material"
        label="材质"
        min-width="20"
      />
      <el-table-column
        prop="supplier_name"
        label="供应商名称"
        min-width="20"
      />
      <el-table-column
        prop="use_flag"
        label="是否启用"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.use_flag===true">Y</span>
          <span v-if="scope.row.use_flag===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_username"
        label="操作者"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="同步时间"
        width="160"
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
import { equipSpareErp } from '@/api/jqy'
import { debounce } from '@/utils'
export default {
  name: 'EquipmentMasterDataERPMaterial',
  components: { page },
  data() {
    return {
      search: {},
      loading: false,
      tableData: [],
      total: 0,
      options: []
    }
  },
  created() {
    this.getList()
    this.getList1()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipSpareErp('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getList1() {
      try {
        const data = await equipSpareErp('get', null, { params: { all: 0 }})
        this.options = data.result || []
      } catch (e) {
        //
      }
    },
    debounceList() {
      debounce(this, 'changeSearch')
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    onSubmit() {}
  }
}
</script>

<style lang="scss" scoped>

</style>
