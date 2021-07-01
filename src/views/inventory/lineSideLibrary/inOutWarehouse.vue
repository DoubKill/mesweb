<template>
  <div>
    <!-- 出入库管理 -->
    <el-form :inline="true">
      <el-form-item label="胶料编码:">
        <all-product-no-select @productBatchingChanged="productBatchingChanged" />
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
        <el-input v-model="search.bbb" placeholder="生产班组" @input="debounceFun" />
      </el-form-item>
      <el-form-item label="工厂日期:">
        <el-date-picker
          v-model="search.production_factory_date"
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
                prop="date"
                label="车次"
                min-width="20"
              />
              <el-table-column label="门尼">
                <el-table-column label="ML(1+4)">
                  <el-table-column
                    prop="name"
                    label="姓名"
                    min-width="20"
                  />
                </el-table-column>
                <el-table-column label="ML(1+4)1">
                  <el-table-column
                    prop="name"
                    label="姓名"
                    min-width="20"
                  />
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop="date"
                label="综合判级"
                min-width="20"
              />
              <el-table-column
                prop="date"
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
            {{ row.classes }}
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
          prop="id"
          min-width="20"
        />
        <el-table-column
          label="操作"
          prop="id"
          width="100px"
        >
          <template slot-scope="{row}">
            <el-button
              type="primary"
              @click="deliveryFun(row)"
            >出库</el-button>
            <el-button
              type="primary"
              @click="warehousingFun(row)"
            >入库</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="入库时间"
          prop="id"
          min-width="20"
        />
        <el-table-column
          label="库区"
          width="210px"
        >
          <template slot-scope="{row}">
            <el-select v-model="row.b" placeholder="请选择" @change="changeDepot(row)">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.depot_name"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="库位"
          width="210px"
        >
          <template slot-scope="{row}">
            <el-select v-model="row.a" placeholder="请选择">
              <el-option
                v-for="item in row.b?options1.filter(d=>d.depot === row.b):[]"
                :key="item.id"
                :label="item.depot_site_name"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
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
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import classSelect from '@/components/ClassSelect'
import selectEquip from '@/components/select_w/equip'
import { debounce } from '@/utils'
import { depotPallet } from '@/api/base_w_four'
import page from '@/components/page'
import { depot, depotSite } from '@/api/base_w_four'
export default {
  name: 'LineSideInOutWarehouse',
  components: { page, selectEquip, allProductNoSelect, classSelect },
  data() {
    return {
      search: {},
      loading: false,
      tableData: [{ a: 2 }, { a: 2 }],
      options: [],
      options1: [],
      total: 0,
      testData: {
        test: {},
        mtr_list: {
          7: [
            { add_subtract: '',
              data_point_name: '比重值',
              max_test_times: 1,
              result: '合格',
              status: '1:一等品',
              test_indicator_name: '比重',
              value: 7 }
          ],
          table_head: [{ '比重': [' "比重值"'] }, { '流变': ['TC10', 'TC50', 'TC90', 'MH'] }],
          // 第一个头部
          sub_head: ['比重值', 'TC10', 'TC50', 'TC90', 'MH'],
          // 车次
          rows: ['7', '8']
        }
      }
    }
  },
  created() {
    this.getList()
    this.getDepotList()
    this.getDepotSiteList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await depotPallet('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
      } catch (e) {
        //
      }
      this.loading = false
    },
    async getDepotList() {
      try {
        const data = await depot('get', null, { params: { all: 1 }})
        this.options = data.results
      } catch (e) {
        //
      }
    },
    async getDepotSiteList() {
      try {
        const data = await depotSite('get', null, { params: { all: 1 }})
        this.options1 = data.results
      } catch (e) {
        //
      }
    },
    changeDepot(row) {
      this.$set(row, 'a', null)
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.material_no : ''
      this.search.page = 1
      this.getList()
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    classChanged() {
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
    descriptionFun(row, expanded) {
      row.tableData = [
        { date: 11 },
        { date: 11 },
        { date: 11 },
        { date: 11 }
      ]
    },
    deliveryFun() {
      this.$confirm('是否确定出库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // propertyTypeNode('delete', data.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '出库成功!'
        //     })
        //     this.getList()
        //   }).catch(e => {
        //     this.$message.error('出库失败')
        //   })
      })
    },
    warehousingFun(row) {
      if (!row.a || !row.b) {
        this.$message.info('请输入库位或库区')
        return
      }
      this.$confirm('是否确定入库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // propertyTypeNode('delete', data.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '入库成功!'
        //     })
        //     this.getList()
        //   }).catch(e => {
        //     this.$message.error('入库失败')
        //   })
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label === '综合结果') {
        return {
          rowspan: 999999,
          colspan: 1
        }
      }
    },
    setGraph(result) {
      if (result === 'pass') {
        return '⚪'
      } else if (result === '不合格') {
        return '∆'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">

</style>
