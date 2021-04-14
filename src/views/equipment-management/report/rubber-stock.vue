<template>
  <div>
    <!-- 胶料库存明细 -->
    <el-form :inline="true">
      <el-form-item label="胶种编码:">
        <el-select v-model="search.no" filterable placeholder="请选择" @change="visibleChange">
          <el-option
            v-for="item in options"
            :key="item.product_no"
            :label="item.product_name"
            :value="item.product_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="段次表头过滤:">
        <stage-select v-model="stageVal" :is-multiple="true" width-select="400px" />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        type="index"
        width="50"
      />
      <el-table-column
        prop="date"
        label="胶种类"
        min-width="10"
      />
      <el-table-column label="立库各段位库存">
        <el-table-column
          prop="name"
          label="HMB"
          min-width="10"
        />
      </el-table-column>
      <el-table-column label="车间各段位库存">
        <el-table-column
          prop="name"
          label="HMB"
          min-width="10"
        />
      </el-table-column>
      <el-table-column
        prop="date"
        label="不合格(加硫)"
        min-width="10"
      />
      <el-table-column label="核算">
        <el-table-column
          prop="name"
          label="加硫(吨)"
          min-width="10"
        />
        <el-table-column
          prop="name"
          label="无硫(吨)"
          min-width="10"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { productStationStatics } from '@/api/base_w_three'
import { productInfosUrl } from '@/api/base_w'
import StageSelect from '@/components/StageSelect'
export default {
  components: { StageSelect },
  data() {
    return {
      search: {},
      stageVal: '',
      options: [],
      tableData: [],
      allTableData: []
    }
  },
  created() {
    this.getGlue()
  },
  methods: {
    async getGlue() {
      try {
        const app = this
        productInfosUrl('get', null, {
          params: { all: 1 }
        }).then(function(response) {
          app.options = response.results
        }).catch(function() {
        })
        // const data = await productStationStatics('get', null, { params: { name: '胶种' }})
        // this.tableData = data.results
      } catch (e) {
        //
      }
    },
    productBatchingChanged(val) {
    //   this.search.product_no = val ? val.material_no : ''
    //   this.getList()
    //   this.search.page = 1
    },
    visibleChange() {

    }
  }
}
</script>

<style>

</style>
