<template>
  <div class="productionRecord-style">
    <!-- 生产记录表 -->
    <el-form :inline="true">
      <el-form-item label="机台">
        <selectEquip
          :equip_no_props.sync="search.equip_no"
          @changeSearch="getList"
        />
      </el-form-item>
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="search.day_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :clearable="false"
          @change="getList"
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
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
      :span-method="arraySpanMethod"
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
      >
        <el-table-column
          label="规格"
          min-width="30"
          align="center"
        >
          <template v-if="row[item.global_name]" slot-scope="{row}">
            {{ row[item.global_name].product_no }}
          </template>
        </el-table-column>
        <el-table-column
          label="计划（车）"
          min-width="20"
          align="center"
        >
          <template v-if="row[item.global_name]" slot-scope="{row}">
            {{ row[item.global_name].plan_trains }}
          </template>
        </el-table-column>
        <el-table-column
          label="完成（车）"
          min-width="20"
          align="center"
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
import { setDate, exportExcel } from '@/utils'
import { productClassesPlanReal } from '@/api/base_w_four'
export default {
  name: 'BanburyingProductionRecord',
  components: { selectEquip },
  data() {
    return {
      search: {
        day_time: setDate()
      },
      loading: false,
      classOptions: [],
      tableData: [],
      exportTableShow: false
    }
  },
  async created() {
    await this.getClasses()
    await this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await productClassesPlanReal('get', null, { params: this.search })
        const arr = []
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key]
            element.forEach((d, i) => {
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
