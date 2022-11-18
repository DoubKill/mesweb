<template>
  <!-- 机台目标值设定 -->
  <div>
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="monthValue"
          type="month"
          value-format="yyyy-MM"
          format="yyyy-MM"
          placeholder="选择月"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['machine_target_value','export']" type="primary" @click="exportTable">导出Excel</el-button>
        <el-button
          v-permission="['machine_target_value','save']"
          type="primary"
          style="margin-bottom:10px;float:right"
          :loading="btnLoading"
          @click="submitFun"
        >保存
        </el-button>
      </el-form-item>
    </el-form>
    <div class="machineValueSetting">
      <el-table
        id="out-table"
        v-loading="loading"
        :data="tableData"
        :row-class-name="tableRowClassName"
        border
      >
        <el-table-column
          prop="equip_no"
          label="机台"
          min-width="20"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.equip_no==='合计'">{{ scope.row.equip_no }}</span>
            <el-link
              v-else
              type="primary"
              @click="dialogResult(scope.row)"
            >{{ scope.row.equip_no }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="target_weight"
          label="机台目标值(车)"
          min-width="20"
        >
          <template slot-scope="{row}">
            <div v-if="!exportTableShow">
              <span v-if="row.equip_no==='合计'">{{ row.target_weight }}</span>
              <el-input-number v-else v-model="row.target_weight" :min="0" @change="changeTotal" />
            </div>
            <span v-else>{{ row.target_weight }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="max_weight"
          label="最高值(车)"
          min-width="20"
        >
          <template slot-scope="{row}">
            <div v-if="!exportTableShow">
              <span v-if="row.equip_no==='合计'">{{ row.max_weight }}</span>
              <el-input-number v-else v-model="row.max_weight" :min="0" />
            </div>
            <span v-else>{{ row.max_weight }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="历史设定值"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-table
        v-loading="loadingDialog"
        max-height="600"
        :data="tableDataDialog"
        border
      >
        <el-table-column
          prop="equip_no"
          align="center"
          label="机台"
          min-width="90"
        />
        <el-table-column
          prop="day"
          align="center"
          label="日期"
          min-width="90"
        >
          <template slot-scope="{row}">
            <span>{{ row.day }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="classes"
          align="center"
          label="班次"
          min-width="90"
        />
        <el-table-column
          prop="target_weight"
          align="center"
          label="目标值(车)"
          min-width="90"
        />
        <el-table-column
          prop="max_weight"
          align="center"
          label="最高值(车)"
          min-width="90"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { exportExcel, setDate } from '@/utils/index'
import { machineTargetValue } from '@/api/jqy'
export default {
  name: 'MachineValueSetting',
  data() {
    return {
      time: null,
      dayList: [],
      exportTableShow: false,
      loadingDialog: false,
      dialogVisible: false,
      tableDataDialog: [],
      tableData: [],
      loading: false,
      btnLoading: false,
      monthValue: setDate(null, null, 'month')
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await machineTargetValue('get', null, { params: { target_month: this.monthValue }})
        this.tableData = data.results || []
        if (this.tableData.length > 0) {
          this.tableData.push({
            equip_no: '合计',
            target_weight: sum(this.tableData, 'target_weight')
          })
        }
      } catch (e) {
        //
      }
    },
    async dialogResult(row) {
      try {
        this.dialogVisible = true
        this.loadingDialog = true
        const data = await machineTargetValue('get', null, { params: { target_month: this.monthValue, equip_no: row.equip_no }})
        this.loadingDialog = false
        this.tableDataDialog = data.results
        this.tableDataDialog.forEach(d => {
          if (d.day < 10) {
            d.day = this.monthValue + '-0' + d.day
          } else {
            d.day = this.monthValue + '-' + d.day
          }
        })
      } catch (e) {
        this.loadingDialog = false
      }
    },
    async exportTable() {
      await this.$set(this, 'exportTableShow', true)
      await exportExcel('机台目标值设定')
      setTimeout(() => {
        this.exportTableShow = false
      }, 1000)
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.equip_no === '合计') {
        return 'summary-cell-style'
      }
    },
    changeTotal() {
      const index = this.tableData.length
      const obj = []
      this.tableData.forEach((item, i) => {
        if (i < index - 1) {
          obj.push(item)
        }
      })
      this.tableData[index - 1].target_weight = sum(obj, 'target_weight')
    },
    async submitFun() {
      try {
        // if (this.time !== this.dayList.slice(-1)[0]) {
        //   this.$message.info('不是最新数据，无需进行保存操作')
        //   return
        // }
        this.tableData.forEach(d => {
          if (!d.target_weight) {
            throw new Error('每行数据必填')
          }
        })

        const _obj = {
          target_month: this.monthValue,
          data: truncate(this.tableData)
        }
        this.btnLoading = true
        await machineTargetValue('post', null, { data: _obj })
        this.$message.success('保存成功')
        this.getList()
        // this.time = this.dayList.slice(-1)[0]
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
        if (e.message === '每行数据必填') {
          this.$message(e.message)
        }
      }
    }
  }
}
function sum(arr, params) {
  var s = 0
  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 100) / 100
  return s
}
function truncate(arr) {
  var newArr = arr.concat() // 合并数组生成新数组
  newArr.pop()
  return newArr
}
</script>

<style lang="scss" scoped>
  .machineValueSetting{
    width: 60%;
   .el-input{
      width:200px;
    }
  }
</style>
