<template>
  <!-- 机台目标值设定 -->
  <div>
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-select v-model="time" placeholder="请选择" @change="getList">
          <el-option
            v-for="item in dayList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="exportTable">导出Excel</el-button>
        <el-button
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
        width="80%"
        :data="tableData"
        :row-class-name="tableRowClassName"
        border
      >
        <el-table-column
          prop="equip_no"
          label="机台"
          min-width="20"
        />
        <el-table-column
          prop="value"
          label="机台目标值(车）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <div v-if="!exportTableShow">
              <span v-if="row.equip_no==='合计'||time!==dayList.slice(-1)[0]">{{ row.value }}</span>
              <el-input-number v-else v-model="row.value" :min="0" @change="changeTotal" />
            </div>
            <span v-else>{{ row.value }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { exportExcel } from '@/utils/index'
import { machineTargetValue } from '@/api/jqy'
export default {
  name: 'MachineValueSetting',
  data() {
    return {
      time: null,
      dayList: [],
      exportTableShow: false,
      tableData: [],
      loading: false,
      btnLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await machineTargetValue('get', null, { params: { time: this.time }})
        this.tableData = data.results || []
        this.dayList = data.date
        if (this.time === null) {
          this.time = this.dayList.slice(-1)[0]
        }
        if (this.tableData.length > 0) {
          this.tableData.push({
            equip_no: '合计',
            value: sum(this.tableData, 'value')
          })
        }
      } catch (e) {
        //
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
      this.tableData[index - 1].value = sum(obj, 'value')
    },
    async submitFun() {
      try {
        if (this.time !== this.dayList.slice(-1)[0]) {
          this.$message.info('不是最新数据，无需进行保存操作')
          return
        }
        this.tableData.forEach(d => {
          if (!d.value) {
            throw new Error('每行数据必填')
          }
        })
        this.btnLoading = true
        await machineTargetValue('post', null, { data: truncate(this.tableData) })
        this.$message.success('保存成功')
        this.getList()
        this.time = this.dayList.slice(-1)[0]
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
        if (e.message) {
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
    width: 50%;
    margin-left: 25%;
   .el-input{
      width:200px;
    }
  }
</style>
