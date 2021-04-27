<template>
  <div>
    <!-- 车间库存明细 -->
    <el-form :inline="true">
      <el-form-item label="物料类型:">
        <stage-select
          v-model="search.material_type"
          @change="stageChange"
        />
        <!-- <materielTypeSelect
          :obj-all="true"
          :params-type="false"
          @changSelect="changeMaterialType"
        /> -->
      </el-form-item>
      <el-form-item label="物料编码:">
        <el-input v-model="search.material_no" @input="changeMaterialCode" />
        <!-- <materialCodeSelect
          :is-all-obj="true"
          :is-clearable="true"
          :default-val="search.material_no"
          @changSelect="changeMaterialCode"
        /> -->
      </el-form-item>
      <el-form-item label="切换库存明细:">
        <el-select v-model="switchDetails" placeholder="请选择" @change="changeDetails">
          <el-option
            v-for="item in [{name:'胶片车间库存明细',id:1},{name:'原材料车间库存明细',id:2}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
    >
      <el-table-column label="基础信息">
        <el-table-column
          type="index"
          label="No"
          width="50"
        />
        <el-table-column
          prop="material_type"
          label="物料类型"
          min-width="20"
        />
        <el-table-column
          prop="material_no"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="material_name"
          label="物料名称"
          min-width="20"
        />
      </el-table-column>
      <el-table-column label="立库库存量">
        <el-table-column
          prop="qty"
          label="数量"
          min-width="20"
        />
        <el-table-column
          prop="weight"
          label="重量/kg"
          min-width="20"
        />
      </el-table-column>
      <el-table-column label="线边库库存量">
        <el-table-column
          prop="other_qty"
          label="数量"
          min-width="20"
        />
        <el-table-column
          prop="other_weight"
          label="重量/kg"
          min-width="20"
        />
      </el-table-column>
      <el-table-column label="总量">
        <el-table-column
          prop="all_qty"
          label="数量"
          min-width="20"
        />
        <el-table-column
          prop="all_weight"
          label="重量/kg"
          min-width="20"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import materielTypeSelect from '@/components/select_w/materielTypeSelect'
// import materialCodeSelect from '@/components/select_w/materialCodeSelect'
import StageSelect from '@/components/StageSelect'
import { productDetails } from '@/api/base_w_three'
import { debounce } from '@/utils'

export default {
  components: { StageSelect },
  data() {
    return {
      search: {},
      switchDetails: 1,
      tableData: [],
      loading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.tableData = []
        this.loading = true
        const data = await productDetails('get', null, { params: this.search })
        this.tableData = data.results
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeMaterialCode(val) {
      debounce(this, 'getList')

      // console.log(val, 666)
      // this.search.material_no = val ? val.material_no : ''
      // this.getList()
    },
    stageChange() {
      this.getList()
    },
    changeDetails() {
      this.search = {}
      this.tableData = []
      if (this.switchDetails !== 1) {
        //
      } else {
        this.getList()
      }
    }
  }
}
</script>

<style>

</style>
