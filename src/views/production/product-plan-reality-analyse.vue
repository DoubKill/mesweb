<template>
  <div class="product-plan-reality-analyse">
    <!-- 产量计划实际分析（车数） -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="getParams.factory_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="时间区间">
        <el-select v-model="getParams.hour_step" placeholder="请选择">
          <el-option
            v-for="item in hourStepOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班次">
        <el-select v-model="getParams.classes" multiple placeholder="请选择">
          <el-option
            v-for="item in classOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="changeSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-for="(value1,index1) in getParams.classes"
      :key="index1"
      :data="tableData[value1]"
      border
      :summary-method="getSummaries"
      :show-summary="true"
      sum-text="合计"
      style="width: 100%"
    >
      <!-- max-height="700" -->
      <el-table-column fixed label="机台" prop="equip_no" width="50" align="center" />
      <el-table-column fixed label="目标产量" prop="plan_train_sum" width="55" align="center" />
      <el-table-column :label="value1" align="center">
        <el-table-column v-for="(value,index) in headers" :key="index" :label="value+'小时'" align="center">
          <el-table-column label="目标" min-width="5" align="center" :prop="value.toString()">
            <template slot-scope="scope">
              {{ scope.row.time_span_train_count[value.toString()][0] }}
            </template>
          </el-table-column>

          <el-table-column label="完成" min-width="5" align="center" :prop="value.toString()">
            <template slot-scope="scope">
              <p
                v-if="scope.row.time_span_train_count"
                :style="getStyle(scope.row.time_span_train_count[value.toString()])"
              >
                {{ scope.row.time_span_train_count[value.toString()][1] }}
              </p>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column fixed="right" label="未达产原因分析" width="160" prop="cause" align="center" />
      <el-table-column fixed="right" label="操作" width="60" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="['production_analyze','change']"
            size="mini"
            @click="showEditDialog(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="编辑原因"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm">
        <el-form-item
          label="机台："
        >
          {{ editForm.equip_no }}
        </el-form-item>
        <el-form-item
          label="时间："
        >
          {{ editForm.factory_date }}
        </el-form-item>
        <el-form-item
          label="班次："
        >
          {{ editForm.classes }}
        </el-form-item>
        <el-form-item
          label-width="55px"
          label="原因："
          prop="cause"
        >
          <el-input
            v-model="editForm.cause"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEdit"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProductionPlanRealityAnalysis, putUpdateCause } from '@/api/product-plan-reality-analyse'
import { setDate } from '@/utils/index'
export default {
  name: 'ProductPlanRealityAnalyse',
  data() {
    return {
      formLabelWidth: 'auto',
      getParams: {
        factory_date: setDate(),
        hour_step: 2,
        classes: ['早班']
      },
      headers: [],
      tableData: {},
      classOptions: ['早班', '夜班'],
      hourStepOptions: [1, 2, 3, 4, 6, 12],
      editForm: {},
      dialogEditVisible: false
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.headers = []
      getProductionPlanRealityAnalysis(this.getParams).then(response => {
        this.tableData = response
        this.headers = response.headers
      })
    },
    changeSearch() {
      this.getTableData()
    },
    showEditDialog(row) {
      this.editForm = {
        'factory_date': row.factory_date,
        'classes': row.classes,
        'equip_no': row.equip_no,
        'cause': row.cause
      }
      this.dialogEditVisible = true
    },
    handleEdit() {
      putUpdateCause(this.editForm)
        .then(response => {
          this.dialogEditVisible = false
          this.$message('修改成功')
          this.getTableData()
        })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        var values = null
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (column.label === '目标') {
          values = data.map(item => Number(item.time_span_train_count[column.property][0]))
        }
        if (column.label === '完成') {
          values = data.map(item => Number(item.time_span_train_count[column.property][1]))
        }
        if (column.label !== '完成' && column.label !== '目标') {
          values = data.map(item => Number(item[column.property]))
        }
        if (column.label === '未达产原因分析') {
          sums[index] = ''
          return
        }
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    getStyle(row) {
      if (row[1] < row[0]) {
        return 'height:100%; margin:0 0 0 0; background-color: #EA1B29; color: #F5F7FA'
      }
    }
  }
}
</script>

<style lang="scss">
.product-plan-reality-analyse {
  .el-table {
      font-size: 12px;
      padding: 0 0 0 0 !important;
    }
  .el-table .cell {
      padding: 0 !important;
      margin:0 0 0 0;
    }
    .el-table .cell p{
      padding: 0 !important;
      margin:0 0 0 0;
    }
}
</style>
