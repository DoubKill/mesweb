<template>
  <div :class="{'productionFeeding_new':this.$route.query.equip?true:false}" :style="{padding:this.$route.query.equip?'20px':''}">
    <!-- 生产投料配方查询 -->
    <el-form :inline="true">
      <el-form-item label="机台">
        <selectEquip
          :is-created="true"
          :is-obj="true"
          :equip_no_props.sync="searchForm.equip_no"
          @changeSearch="changeEquip"
        />
      </el-form-item>
      <el-form-item label="胶料名称">
        <el-select
          v-model="searchForm.product_no"
          clearable
          placeholder="请选择"
          filterable
          @change="getProductList"
        >
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.stage_product_batch_no"
            :value="item.stage_product_batch_no"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <h3>胶料</h3>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="90"
      />
      <el-table-column
        prop="material__material_name"
        label="胶料名称"
        min-width="40"
      />
      <el-table-column
        prop="actual_weight"
        label="设定值kg"
        min-width="20"
      />
      <el-table-column
        prop="standard_error"
        label="误差值kg"
        min-width="20"
      />
    </el-table>
    <h3>{{ ['FM', 'RFM' ,'RE'].includes(type)?'硫磺':'细料' }}</h3>
    <el-table
      :data="tableData1"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="90"
      />
      <el-table-column
        prop="material__material_name"
        label="胶料名称"
        min-width="40"
      />
      <el-table-column
        prop="actual_weight"
        label="设定值kg"
        min-width="20"
      />
      <el-table-column
        prop="standard_error"
        label="误差值kg"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import selectEquip from '@/components/select_w/equip'
import { formulaPreparation } from '@/api/base_w_five'
import { rubberMaterialUrl } from '@/api/base_w'
export default {
  name: 'ProductionFeeding',
  components: { selectEquip },
  data() {
    return {
      searchForm: {
        product_no: ''
      },
      tableData: [],
      tableData1: [],
      productList: [],
      loading: false,
      type: null
    }
  },
  created() {
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await formulaPreparation('get', null, { params: this.searchForm })
        const arr = data.results.filter(d => d.sn)
        const arr1 = data.results.filter(d => !d.sn)
        this.tableData = arr || []
        this.tableData1 = arr1 || []
        this.loading = false
      } catch (e) { this.loading = false }
    },
    async getProduct(dev_type) {
      try {
        const data = await rubberMaterialUrl('get', null, { params: { dev_type: dev_type, all: 1, exclude_used_type: 6 }})
        this.productList = data.results || []

        this.searchForm.product_no = this.$route.query.product_no || ''
        if (this.$route.query.product_no) {
          this.getProductList()
        }
      } catch (e) {
        //
      }
    },
    changeEquip(val) {
      this.searchForm.equip_no = val.equip_no
      this.searchForm.product_no = ''
      this.getProduct(val.category)
    },
    getProductList(val) {
      if (val) {
        this.type = val.split('-')[1]
      }
      this.getList()
    }
  }
}
</script>

<style lang="scss">
  .productionFeeding_new{
      font-size: 20px;
    .el-form-item__label,.el-button,.el-table,.el-checkbox__label,.el-form-item__content{
      font-size:20px !important;
    }
    .el-input__inner{
       font-size:18px;
    }
    .el-checkbox__inner{
      width:20px;
      height:20px;
    }
  }
</style>
