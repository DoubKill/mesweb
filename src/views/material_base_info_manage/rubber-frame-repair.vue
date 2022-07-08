<template>
  <div>
    <!-- 胶架维修记录 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.date_time"
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
          v-permission="['performance_summary', 'export']"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button
          v-permission="['performance_summary', 'export']"
          type="primary"
          :loading="btnLoading"
          @click="submitFun"
        >保存</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="name"
        label="项目"
        fixed
      />
      <el-table-column
        prop="总计"
        label="总计"
        fixed
      />
      <el-table-column v-for="(item) in day" :key="item" :label="month+'/'+item" width="120px">
        <template slot-scope="{row,$index}">
          <span v-if="isExport">{{ row[item] }}</span>
          <span v-else-if="row.name.indexOf('人员')>-1">
            <el-select v-model="row[item]" filterable placeholder="请选择" clearable>
              <el-option
                v-for="userItem in optionsUser"
                :key="userItem.id"
                :label="userItem.username"
                :value="userItem.username"
              />
            </el-select>
          </span>
          <span v-else>
            <el-input-number v-model="row[item]" style="width:100px" controls-position="right" @change="handleChange(row,$index)" />
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { setDate, exportExcel } from '@/utils'
import { rubberFrameRepair } from '@/api/base_w_five'
import { personnels } from '@/api/jqy'
export default {
  name: 'RubberFrameRepair',
  data() {
    return {
      search: { date_time: setDate(false, false, 'month') },
      day: '',
      month: '',
      loading: false,
      btnExportLoad: false,
      isExport: false,
      btnLoading: false,
      tableData: [],
      optionsUser: []
    }
  },
  created() {
    this.getList()
    this.getOptionsUser()
  },
  methods: {
    async getList() {
      try {
        if (!this.search.date_time) {
          this.$message('请选择月份')
          return
        }
        const a = new Date(this.search.date_time)
        const y = a.getFullYear()
        const m = a.getMonth() + 1
        this.day = new Date(y, m, 0).getDate()
        this.month = m
        // this.year = y
        this.loading = true
        const data = await rubberFrameRepair('get', null, { params: this.search })
        this.tableData = data.results.details || []
      } catch (e) {
        //
      }
      this.loading = false
    },
    async getOptionsUser() {
      try {
        const data = await personnels('get', null, { params: { all: 1 }})
        this.optionsUser = data.results
      } catch (e) {
        //
      }
    },
    handleChange(row, index) {
      this.tableData[index].总计 = sum(row)
    },
    async submitFun() {
      try {
        const obj = {
          'date_time': this.search.date_time,
          details: this.tableData
        }
        this.btnLoading = true
        await rubberFrameRepair('post', null, { data: obj })
        this.$message.success('保存成功')
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
      }
    },
    async exportTable() {
      this.loading = true
      this.btnExportLoad = true

      setTimeout(d => {
        this.isExport = true
        setTimeout(d => {
          exportExcel('胶架维修记录')
          this.isExport = false
          this.btnExportLoad = false
          this.loading = false
        }, 1000)
      }, 100)
    }
  }
}
function sum(obj) {
  var s = 0
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const element = obj[key]
      if (Number(element) && key !== '总计') {
        s += Number(element)
      }
    }
  }
  s = Math.round(s * 100) / 100
  return s
}
</script>

<style lang="scss" scoped>

</style>
