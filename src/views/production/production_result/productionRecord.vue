<template>
  <div class="productionRecord-style" :style="{padding:this.$route.query.equip?'20px':''}">
    <!-- 生产记录表 -->
    <el-form :inline="true">
      <el-form-item label="机台">
        <selectEquip
          :equip_no_props.sync="search.equip_no"
          :is-created="true"
          @changeSearch="equipChange"
        />
      </el-form-item>
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="search.day_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :clearable="false"
          @change="getListDay"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="getList"
        >查询</el-button>
        <el-button
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
      <el-form-item style="margin-left:20px;" label="计划总车数">
        {{ planTrainAll }}
      </el-form-item>
      <el-form-item style="margin-left:20px" label="完成总车数">
        {{ completeTrainAll }}
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
      :span-method="arraySpanMethod"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column width="120px">
        <template
          slot="header"
          slot-scope="{row}"
        >
          <span v-if="false">{{ row }}</span>
          <div v-if="!exportTableShow" class="header-style">
            <div style="width:100%;text-align:right;margin:8px 0 20px 0">班次</div>
            <span>项目</span>
            <span style="margin-left:30px">内容</span>
            <div class="header-style-line one-line" />
            <div class="header-style-line three-line" />
          </div>
          <div v-else>信息</div>
        </template>
        <template
          align="center"
        >
          当前计划
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in classOptions"
        :key="item.id"
        min-width="20"
        :label="item.global_name"
        align="center"
        :prop="item.global_name"
      >
        <el-table-column
          label="规格"
          min-width="30"
          align="center"
          :prop="`product_no,${item.global_name}`"
        >
          <template v-if="row[item.global_name]" slot-scope="{row}">
            {{ row[item.global_name].product_no }}
          </template>
        </el-table-column>
        <el-table-column
          label="计划（车）"
          min-width="20"
          align="center"
          :prop="`plan_trains,${item.global_name}`"
        >
          <template v-if="row[item.global_name]" slot-scope="{row}">
            {{ row[item.global_name].plan_trains }}
          </template>
        </el-table-column>
        <el-table-column
          label="完成（车）"
          min-width="20"
          align="center"
          :prop="`actual_trains,${item.global_name}`"
        >
          <template v-if="row[item.global_name]" slot-scope="{row}">
            {{ row[item.global_name].actual_trains }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import selectEquip from '@/components/select_w/equip'
import { class_arrange_url } from '@/api/display_static_fun'
import { exportExcel } from '@/utils'
import { productClassesPlanReal } from '@/api/base_w_four'
import { currentFactoryDate } from '@/api/base_w_three'
export default {
  name: 'BanburyingProductionRecord',
  components: { selectEquip },
  data() {
    return {
      search: {
        day_time: ''
      },
      loading: false,
      classOptions: [],
      tableData: [],
      exportTableShow: false,
      planTrainAll: 0,
      completeTrainAll: 0
    }
  },
  async created() {
    this.search.equip_no = this.$route.query.equip
    this.search.day_time = this.$route.query.day_time

    if (!this.search.day_time) {
      this.getFactoryDate()
    }
    await this.getClasses()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await productClassesPlanReal('get', null, { params: this.search })
        const arr = []
        this.planTrainAll = 0
        this.completeTrainAll = 0
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key]
            element.forEach((d, i) => {
              this.planTrainAll += Number(d.plan_trains)
              this.completeTrainAll += Number(d.actual_trains)
              if (!arr[i]) {
                arr[i] = {
                  [key]: d || {}
                }
              } else {
                arr[i][key] = d || {}
              }
            })
          }
        }
        this.tableData = arr || []
      } catch (e) {
        //
      }
      this.loading = false
    },
    getClasses() {
      class_arrange_url('get', {
        params: {}
      }).then(response => {
        this.classOptions = response.results
      })
    },
    async getFactoryDate() {
      try {
        const data = await currentFactoryDate('get', null, { params: {}})
        this.search.day_time = data.factory_date
      } catch (e) {
        //
      }
    },
    equipChange(val) {
      this.search.equip_no = val
      this.getList()
    },
    getListDay() {
      if (!this.search.day_time) {
        this.$message.info('请选择工厂日期')
        return
      }
      this.getList()
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: this.tableData.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const _property = column.property.split(',')[0]
        const _column = column.property.split(',')[1]
        const values = data.map(item => item[_column] && Number(item[_column][_property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    async exportTable() {
      await this.$set(this, 'exportTableShow', true)
      await exportExcel('生产记录表')
      setTimeout(() => {
        this.exportTableShow = false
      }, 300)
    }
  }
}

</script>

<style lang="scss">
.productionRecord-style{
    .el-table th{
        padding:0;
    }
    .header-style{
        position: relative;
    }
    .header-style-line{
        height: 1px;
        background:  #e4e6e9;
    }
    .one-line{
        transform-origin:left center;
        transform:rotate(20deg);
            width: 130px;
        position: absolute;
        top:-8px;
        left:-6px;
    }
    .three-line{
        transform-origin:left center;
        transform:rotate(48deg);
        width:100px;
        position: absolute;
        top:-8px;
        left:-6px;
    }
}
</style>
