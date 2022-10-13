<template>
  <div>
    <!-- 车间库存统计 -->
    <el-form :inline="true">
      <!-- <el-form-item label="物料类型:">
        <stage-select
          v-model="search.material_type"
          :is-allow-create="true"
          @change="stageChange"
        />
      </el-form-item> -->
      <!-- <el-form-item label="物料编码:">
        <el-select v-model="search.material_no" allow-create filterable placeholder="请选择" clearable @visible-change="getProductList" @change="stageChange">
          <el-option
            v-for="item in options"
            :key="item.material_no"
            :label="item.material_no"
            :value="item.material_no"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="切换库存明细:">
        <el-select v-model="switchDetails" placeholder="请选择" @change="changeDetails">
          <el-option
            v-for="item in [{name:'胶片车间库存明细',id:1},{name:'原材料车间库存明细',id:2}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item style="float:right">
        <el-button
          type="primary"
          @click="exportTable"
        >导出表格</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      ref="table"
      v-loading="loading"
      :data="tableData"
      height="550"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column
        prop="product_no"
        label="规格"
        :fixed="!exportLoading"
      />
      <el-table-column label="现场库存" align="center">
        <el-table-column
          v-for="item in heard"
          :key="item"
          :label="item"
        >
          <el-table-column
            :prop="`area_data*${item}*qty`"
            label="车数"
          >
            <template slot-scope="{row}">
              {{ row.area_data[item]?row.area_data[item].qty:'' }}
            </template>
          </el-table-column>
          <el-table-column
            :prop="`area_data*${item}*weight`"
            label="重量"
          >
            <template slot-scope="{row}">
              {{ row.area_data[item]?row.area_data[item].weight:'' }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="立体库库存" align="center">
        <el-table-column
          v-for="item in heard1"
          :key="item"
          :label="item"
        >
          <el-table-column
            v-if="item!=='CMB'"
            :prop="`stock_data*${item}*qty`"
            label="车数"
          >
            <template slot-scope="{row}">
              {{ row.stock_data[item]?row.stock_data[item].qty:'' }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="item!=='HMB'"
            :prop="`stock_data*${item}*weight`"
            label="重量"
          >
            <template slot-scope="{row}">
              {{ row.stock_data[item]?row.stock_data[item].weight:'' }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="allHj">
        <el-table-column
          prop="RMxj"
          label="RM小计"
        />
        <el-table-column
          prop="FMxj"
          label="FM(合格)小计"
        />
        <el-table-column
          prop="FMxjD"
          label="FM(待检测)小计"
        />
        <el-table-column
          prop="FMxjB"
          label="FM(不合格)小计"
        />
        <el-table-column
          prop="RFMxj"
          label="RFM小计"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import materielTypeSelect from '@/components/select_w/materielTypeSelect'
// import materialCodeSelect from '@/components/select_w/materialCodeSelect'
// import StageSelect from '@/components/StageSelect'
import { batchingMaterials } from '@/api/base_w'
import { productDetails } from '@/api/base_w_three'
import { debounce, exportExcel } from '@/utils'

export default {
  name: 'WorkshopStock',
  data() {
    return {
      search: {},
      switchDetails: 1,
      tableData: [],
      options: [],
      heard: ['C/HMB', '1MB', '2MB', '3MB', '4MB', 'RMB', 'FM(合格)',
        'FM(待检测)', 'FM(不合格)', 'RFM'],
      heard1: ['HMB', 'CMB', '1MB', '2MB', '3MB', '4MB', 'RMB',
        'FM(合格)', 'FM(待检测)', 'FM(不合格)', 'RFM'],
      RM小计: ['C/HMB', '1MB', '2MB', '3MB', '4MB', 'RMB',
        'HMB', 'CMB'],
      loading: true,
      allHj: null,
      exportLoading: false
    }
  },
  created() {
    this.getList()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    async getProductList(val) {
      if (val) {
        try {
          const data = await batchingMaterials('get', null, { params: { all: 1 }})
          this.options = data || []
        } catch (e) {
        //
        }
      }
    },
    async getList() {
      try {
        this.tableData = []
        this.loading = true
        const data = await productDetails('get', null, { params: this.search })
        this.tableData = data.results
        this.tableData.forEach((D, index) => {
          let a = 0
          let b = 0
          let c = 0
          let d = 0
          let e = 0
          for (const key in D.area_data) {
            if (Object.hasOwnProperty.call(D.area_data, key)) {
              const element = D.area_data[key]
              if (this.RM小计.indexOf(key) > -1) {
                a += Number(element.weight)
              }
              if (key === 'FM(合格)') {
                b += Number(element.weight)
              }
              if (key === 'FM(待检测)') {
                c += Number(element.weight)
              }
              if (key === 'FM(不合格)') {
                d += Number(element.weight)
              }
              if (key === 'RFM') {
                e += Number(element.weight)
              }
            }
          }
          for (const key in D.stock_data) {
            if (Object.hasOwnProperty.call(D.stock_data, key)) {
              const element = D.stock_data[key]
              if (this.RM小计.indexOf(key) > -1) {
                a += Number(element.weight)
              }
              if (key === 'FM(合格)') {
                b += Number(element.weight)
              }
              if (key === 'FM(待检测)') {
                c += Number(element.weight)
              }
              if (key === 'FM(不合格)') {
                d += Number(element.weight)
              }
              if (key === 'RFM') {
                e += Number(element.weight)
              }
            }
          }
          D.RMxj = Math.round(a * 1000) / 1000 || ''
          D.FMxj = Math.round(b * 1000) / 1000 || ''
          D.FMxjD = Math.round(c * 1000) / 1000 || ''
          D.FMxjB = Math.round(d * 1000) / 1000 || ''
          D.RFMxj = Math.round(e * 1000) / 1000 || ''
          this.allHj += (a + b + c + d + e)
        })
        const all = (Math.round(this.allHj * 1000) / 1000)
        this.allHj = all.toString()
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
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '小计'
          return
        }
        const values = data.map(item => {
          if (!item[column.property]) {
            const a = column.property.split('*')
            if (item[a[0]] && item[a[0]][a[1]] && item[a[0]][a[1]][a[2]]) {
              return item[a[0]][a[1]][a[2]]
            } else {
              return 0
            }
          } else {
            return item[column.property]
          }
        }
        )
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = Math.round(sums[index] * 1000) / 1000
        }
      })
      return sums
    },
    exportTable() {
      this.exportLoading = true
      const tds = document.querySelectorAll('.el-table__footer-wrapper td')
      tds[0].setAttribute('rowspan', '1')
      tds[tds.length - 1].setAttribute('rowspan', '1')
      tds[tds.length - 2].setAttribute('rowspan', '1')
      tds[tds.length - 3].setAttribute('rowspan', '1')
      tds[tds.length - 4].setAttribute('rowspan', '1')
      tds[tds.length - 5].setAttribute('rowspan', '1')
      setTimeout(() => {
        exportExcel('车间库存统计')
        this.exportLoading = false
      }, 300)

      // const obj = Object.assign({ export: 'all' }, this.search)
      // productDetails('get', null, { responseType: 'blob', params: obj })
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '车间库存统计.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
    }
  }
}
</script>

<style>

</style>
