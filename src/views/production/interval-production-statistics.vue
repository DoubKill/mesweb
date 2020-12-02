<template>
  <div>
    <!-- 区间产量统计（车数） -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="search.date"
          :clearable="false"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="时间区间">
        <el-select
          v-model="search.a"
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in timeInterval"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班次">
        <el-select
          v-model="search.b"
          placeholder="请选择"
          multiple
          @change="changeClasses"
        >
          <el-option
            v-for="item in classesList"
            :key="item"
            :label="item"
            :value="item"
            :disabled="disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班次">
        <el-button @click="searchFun">查询</el-button>
      </el-form-item>
      <el-button style="float:right" @click="viewChartsFun">显示图表</el-button>
    </el-form>
  </div>
</template>

<script>
import { setDate } from '@/utils/index'
export default {
  data() {
    return {
      search: {
        a: 2,
        date: setDate()
      },
      timeInterval: [1, 2, 4, 8],
      classesList: ['早班', '中班', '夜班', '整日'],
      disabled: false
    }
  },
  methods: {
    changeSearch() {},
    changeClasses(val) {
      const a = val.find(D => D === '整日')
      if (a) {
        this.disabled = true
        this.search.b = ['整日']
      } else {
        this.disabled = false
      }
    },
    searchFun() {},
    viewChartsFun() {}
  }
}
</script>

<style>

</style>
