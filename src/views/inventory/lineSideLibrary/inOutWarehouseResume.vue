<template>
  <div>
    <!--线边库 出入库履历 -->
    <el-form :inline="true">
      <el-form-item label="胶料编码:">
        <el-select
          v-model="search.product_no"
          clearable
          filterable
          placeholder="请选择"
          @visible-change="getProductList"
          @change="changeSearch"
        >
          <el-option
            v-for="(item,key) in productList"
            :key="key"
            :label="item.pallet_data__product_no"
            :value="item.pallet_data__product_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产机台:">
        <selectEquip
          :equip_no_props.sync="search.equip_no"
          @changeSearch="changeSearch"
        />
      </el-form-item>
      <el-form-item label="生产班次:">
        <class-select @classSelected="classChanged" />
      </el-form-item>
      <el-form-item label="生产班组:">
        <el-input v-model="search.group" placeholder="生产班组" @input="debounceFun" />
      </el-form-item>
      <el-form-item label="工厂日期:">
        <el-date-picker
          v-model="search.factory_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeSearch"
        />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
      @expand-change="descriptionFun"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <div style="padding:10px;">
            <el-table
              :data="row.tableData"
              :span-method="arraySpanMethod"
              border
            >
              <el-table-column
                prop="trains"
                label="车次"
                min-width="20"
              />
              <el-table-column
                v-for="(item,i) in row.table_head"
                :key="i"
                :label="i"
              >
                <el-table-column
                  v-for="(itemChild,iChild) in item"
                  :key="iChild"
                  :label="itemChild"
                  min-width="20"
                >
                  <template slot-scope="scopeChild">
                    {{ scopeChild.row.test_data[i][itemChild] }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop="status"
                label="综合判级"
                min-width="20"
              />
              <el-table-column
                prop="test_result"
                label="综合结果"
                min-width="20"
              />
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="生产信息">
        <el-table-column
          label="工厂日期"
          prop="factory_date"
          min-width="20"
        />
        <el-table-column
          label="生产班次/班组"
          prop="id"
          min-width="20"
        >
          <template slot-scope="{row}">
            {{ row.classes }}/{{ row.group }}
          </template>
        </el-table-column>
        <el-table-column
          label="生产机台"
          prop="equip_no"
          min-width="20"
        />
        <el-table-column
          label="胶料编码"
          prop="product_no"
          min-width="20"
        />
        <el-table-column
          label="车次"
          prop="begin_trains"
          min-width="20"
        >
          <template slot-scope="{row}">
            {{ row.begin_trains }} - {{ row.end_trains }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="线边库信息">
        <el-table-column
          label="状态"
          prop="pallet_status"
          min-width="20"
          :formatter="(row)=>{
            if(!row.pallet_status){
              return '待入库'
            }
            if(row.pallet_status === 1){
              return '已入库'
            }
            return '已出库'
          }"
        />
        <el-table-column
          label="入库时间"
          prop="enter_time"
          min-width="20"
        />
        <el-table-column
          label="出库时间"
          prop="outer_time"
          min-width="20"
        />
        <el-table-column
          label="库区"
          prop="depot_name"
          min-width="20"
        />
        <el-table-column
          label="库位"
          min-width="20"
          prop="depot_site_name"
        />
      </el-table-column>
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
// import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import classSelect from '@/components/ClassSelect'
import selectEquip from '@/components/select_w/equip'
import { debounce } from '@/utils'
import { depotResume, palletTestResult } from '@/api/base_w_four'
import page from '@/components/page'
export default {
  name: 'LineSideInOutWarehouseResume',
  components: { page, selectEquip, classSelect },
  data() {
    return {
      search: {},
      loading: false,
      tableData: [],
      total: 0,
      productList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await depotResume('get', null, { params: this.search })
        this.tableData = data.results
        this.tableData.forEach(d => {
          this.$set(d, 'tableData', [])
          this.$set(d, 'table_head', [])
        })
        this.total = data.count
      } catch (e) {
        //
      }
      this.loading = false
    },
    async getProductList() {
      try {
        const data = await depotResume('get', null, { params: { all: 1 }})
        this.productList = data.results
      } catch (e) {
        //
      }
    },
    changeDepot(row) {
      this.$set(row, 'depot_site', null)
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    classChanged(val) {
      this.search.classes = val
      this.search.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    debounceFun() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeList() {},
    async descriptionFun(row, expanded) {
      let bool = false
      if (expanded.length > 0) {
        expanded.forEach(d => {
          if (d.id === row.id) {
            bool = true
            return
          }
        })
      } else {
        bool = false
      }
      if (!bool) {
        return
      }
      let _index = null
      this.tableData.forEach((d, i) => {
        if (d.id === row.id) {
          _index = i
        }
      })
      try {
        // row.lot_no = '339443b2-a8c0-11eb-86a0-a4bb6dc64b4f'
        const data = await palletTestResult('get', null, { params: { lot_no: row.lot_no }})
        data.results.forEach(d => { d.test_result = data.test_result })
        this.tableData[_index].table_head = data.table_head
        this.tableData[_index].tableData = data.results
      } catch (e) {
        //
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label === '综合结果') {
        return {
          rowspan: 999999,
          colspan: 1
        }
      }
    }
  }
}
</script>

<style lang="scss">

</style>
