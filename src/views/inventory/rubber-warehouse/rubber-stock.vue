<template>
  <div>
    <!-- 胶料段次别数量统计 -->
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
        <stage-select v-model="stageVal" :is-multiple="true" :is-default="true" width-select="400px" @change="stageChange" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        type="index"
        width="50"
      />
      <el-table-column
        label="胶种类"
        min-width="10"
      >
        <template slot-scope="{row}">
          <span v-if="false"> {{ row }}</span>
          {{ search.no }}
        </template>
      </el-table-column>
      <el-table-column label="立库各段位库存" header-align="center">
        <el-table-column
          v-for="item in stageVal"
          :key="item.id"
          :label="item+'  (车/吨)'"
          min-width="10"
        >
          <template v-if="row.subject[item]" slot-scope="{row}">
            {{ row.subject[item].qty }}/
            {{ row.subject[item].weight }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="车间各段位库存" header-align="center">
        <el-table-column
          v-for="item in stageVal"
          :key="item.id"
          :label="item+'(车/吨)'"
          min-width="10"
        >
          <template v-if="row.edge[item]" slot-scope="{row}">
            {{ row.edge[item].qty }}/
            {{ row.edge[item].weight }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="error"
        label="不合格(加硫)"
        min-width="10"
      />
      <el-table-column label="核算" header-align="center">
        <el-table-column
          prop="fm_all"
          label="加硫(吨)"
          min-width="10"
        />
        <el-table-column
          prop="ufm_all"
          label="无硫(吨)"
          min-width="10"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { productStationStatics } from '@/api/base_w_three'
import { productInfosUrl } from '@/api/base_w'
import StageSelect from '@/components/StageSelect'
export default {
  name: 'RubberStock',
  components: { StageSelect },
  data() {
    return {
      search: {},
      stageVal: '',
      options: [],
      tableData: [],
      allTableData: [],
      stageList: [],
      loading: true
    }
  },
  created() {
    this.getGlue()
  },
  methods: {
    getGlue() {
      const app = this
      productInfosUrl('get', null, {
        params: { all: 1 }
      }).then(function(response) {
        app.options = response.results
        app.search.no = app.options[0].product_no
        app.getList()
      }).catch(function() {
        this.loading = false
      })
    },
    async getList() {
      try {
        this.loading = true
        const data = await productStationStatics('get', null, { params: { name: this.search.no }})
        this.tableData = [data] || []

        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    productBatchingChanged(val) {
    //   this.search.product_no = val ? val.material_no : ''
    //   this.getList()
    //   this.search.page = 1
    },
    visibleChange() {
      this.getList()
    },
    stageChange() {

    }
  }
}
</script>

<style>

</style>
