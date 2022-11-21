
<template>
  <div v-loading="loading">
    <!-- 胶架进出登记表 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.target_month"
          type="month"
          :clearable="false"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['rubber_log', 'export']"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button
          v-permission="['rubber_log', 'add']"
          type="primary"
          :loading="btnLoading"
          @click="submitFun"
        >保存</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      max-height="650"
      :data="tableData"
      :span-method="arraySpanMethod"
      border
    >
      <el-table-column
        prop="day"
        align="center"
        width="120"
        label="胶架进出"
        :fixed="!isExport"
      >
        <!-- <template slot="header">
          <span>胶架进出</span>
          <i v-if="tableheader.length===0&&tableheaderAdd.length===0" class="el-icon-circle-plus-outline" size="30" @click="addTableheader()" />
        </template> -->
        <!-- <template slot-scope="{row}">
          <span>{{ row.day }}</span>
        </template> -->
      </el-table-column>
      <el-table-column
        v-for="(item,index) in tableheader"
        :key="index+Date.now()"
        align="center"
        :label="item"
      >
        <template slot="header">
          <span> {{ item }}</span>
          <i v-if="index===tableheader.length-1&&tableheaderAdd.length===0" class="el-icon-circle-plus-outline" size="30" @click="addTableheader()" />
        </template>
        <el-table-column align="center" label="进">
          <el-table-column align="center" label="大" min-width="120">
            <template slot-scope="{row}">
              <span v-if="row.day=='结余(大)'||row.day=='结余(小)'">{{ row[item] }}</span>
              <el-input-number v-if="row.day!=='结余(大)'&&row.day!=='结余(小)'&&item!=='总计'&&!isExport&&row.day!=='合计'" v-model="row[item+'-进-大']" style="width:100px" controls-position="right" :min="0" />
              <span v-if="row.day!=='结余(大)'&&row.day!=='结余(小)'&&(item=='总计'||isExport||row.day==='合计')">{{ row[item+'-进-大'] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="小" min-width="120">
            <template slot-scope="{row}">
              <el-input-number v-if="item!=='总计'&&!isExport&&row.day!=='合计'" v-model="row[item+'-进-小']" style="width:100px" controls-position="right" :min="0" />
              <span v-if="item=='总计'||isExport||row.day==='合计'">{{ row[item+'-进-小'] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="出">
          <el-table-column align="center" label="大" min-width="120">
            <template slot-scope="{row}">
              <span v-if="row.day=='结余(大)'||row.day=='结余(小)'">{{ row[item] }}</span>
              <el-input-number v-if="row.day!=='结余(大)'&&row.day!=='结余(小)'&&item!=='总计'&&!isExport&&row.day!=='合计'" v-model="row[item+'-出-大']" style="width:100px" controls-position="right" :min="0" />
              <span v-if="row.day!=='结余(大)'&&row.day!=='结余(小)'&&(item=='总计'||isExport||row.day==='合计')">{{ row[item+'-出-大'] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="小" min-width="120">
            <template slot-scope="{row}">
              <el-input-number v-if="item!=='总计'&&!isExport&&row.day!=='合计'" v-model="row[item+'-出-小']" style="width:100px" controls-position="right" :min="0" />
              <span v-if="item=='总计'||isExport||row.day==='合计'">{{ row[item+'-出-小'] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column
        v-for="(item,index) in tableheaderAdd"
        :key="index"
        align="center"
      >
        <template slot="header">
          <el-input v-model="tableheaderAdd[index]" style="width:120px" @input="changeDom()" />
          <i v-if="index===tableheaderAdd.length-1" class="el-icon-circle-plus-outline" size="30" @click="addTableheader()" />
        </template>
        <el-table-column align="center" label="进">
          <el-table-column align="center" label="大" min-width="120">
            <template slot-scope="{row}">
              <span v-if="row.day=='结余(大)'||row.day=='结余(小)'">{{ row[item] }}</span>
              <el-input-number v-if="row.day!=='结余(大)'&&row.day!=='结余(小)'&&item!=='总计'&&!isExport&&row.day!=='合计'" v-model="row[item+'-进-大']" :disabled="item===''" style="width:100px" controls-position="right" :min="0" />
              <span v-if="row.day!=='结余(大)'&&row.day!=='结余(小)'&&(item=='总计'||isExport||row.day==='合计')">{{ row[item+'-进-大'] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="小" min-width="120">
            <template slot-scope="{row}">
              <el-input-number v-if="item!=='总计'&&!isExport&&row.day!=='合计'" v-model="row[item+'-进-小']" :disabled="item===''" style="width:100px" controls-position="right" :min="0" />
              <span v-if="item=='总计'||isExport||row.day==='合计'">{{ row[item+'-进-小'] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="出">
          <el-table-column align="center" label="大" min-width="120">
            <template slot-scope="{row}">
              <span v-if="row.day=='结余(大)'||row.day=='结余(小)'">{{ row[item] }}</span>
              <el-input-number v-if="row.day!=='结余(大)'&&row.day!=='结余(小)'&&item!=='总计'&&!isExport&&row.day!=='合计'" v-model="row[item+'-出-大']" :disabled="item===''" style="width:100px" controls-position="right" :min="0" />
              <span v-if="row.day!=='结余(大)'&&row.day!=='结余(小)'&&(item=='总计'||isExport||row.day==='合计')">{{ row[item+'-出-大'] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="小" min-width="120">
            <template slot-scope="{row}">
              <el-input-number v-if="item!=='总计'&&!isExport&&row.day!=='合计'" v-model="row[item+'-出-小']" :disabled="item===''" style="width:100px" controls-position="right" :min="0" />
              <span v-if="item=='总计'||isExport||row.day==='合计'">{{ row[item+'-出-小'] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { setDate, exportExcel } from '@/utils'
import { rubberLog } from '@/api/jqy'
export default {
  name: 'RubberAccessRepair',
  data() {
    return {
      search: { target_month: setDate(false, false, 'month') },
      data: '',
      loading: false,
      tableheader: [],
      tableheaderAdd: [],
      btnExportLoad: false,
      isExport: false,
      btnLoading: false,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeDom() {
      this.$nextTick(() => this.$forceUpdate())
    },
    async getList() {
      try {
        this.tableheaderAdd = []
        this.loading = true
        this.tableData = []
        const data = await rubberLog('get', null, { params: this.search })
        this.tableheader = data.title
        this.tableheader.unshift('总计')
        this.tableData = data.results || []
        this.tableData.forEach(d => {
          if (d.day === 32) {
            d.day = '合计'
          }
          if (d.day === 33) {
            d.day = '结余(大)'
          }
          if (d.day === 34) {
            d.day = '结余(小)'
          }
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async submitFun() {
      const isLike = Array.from(new Set(this.tableheaderAdd)).length < this.tableheaderAdd.length
      const newA = new Set(this.tableheader)
      const newB = new Set(this.tableheaderAdd)
      const intersectionSet = new Set([...newA].filter(x => newB.has(x)))
      const arr = Array.from(intersectionSet)
      if (arr.length === 0 && !isLike) {
        try {
          const obj = {
            'target_month': this.search.target_month,
            details: this.tableData
          }
          this.btnLoading = true
          await rubberLog('post', null, { data: obj })
          this.$message.success('保存成功')
          this.btnLoading = false
          this.getList()
        } catch (e) {
          this.btnLoading = false
        }
      } else {
        this.$message.info('有相同表头数据,请检查')
        return
      }
    },
    addTableheader() {
      this.tableheaderAdd.push('')
      this.$nextTick(() => this.$forceUpdate())
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      const length1 = this.tableheader.concat(this.tableheaderAdd).length
      const length = this.tableData.length
      if (rowIndex === length - 1 || rowIndex === length - 2) {
        if (columnIndex <= (4 * length1)) {
          if ((columnIndex - 1) % 4 === 0) {
            return {
              rowspan: 1,
              colspan: 4
            }
          } else if (columnIndex === 0) {
            return {
              rowspan: 1,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    async exportTable() {
      this.btnExportLoad = true
      this.loading = true
      setTimeout(d => {
        this.isExport = true
        setTimeout(d => {
          exportExcel('胶架进出登记表')
          this.isExport = false
          this.btnExportLoad = false
          this.loading = false
        }, 1000)
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
