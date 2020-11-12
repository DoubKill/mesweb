<template>
  <div v-loading="loading">
    <!-- 密炼时间占比汇总 -->
    <el-form :inline="true">
      <el-form-item label="时间:">
        <el-date-picker
          v-model="search.date"
          :clearable="true"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="search.day_type" @change="changeRadio">
          <el-radio :label="1">自然日</el-radio>
          <el-radio :label="2">工厂时间</el-radio>
        </el-radio-group>
      </el-form-item>
      <br>
      <el-form-item label="时间跨度:">
        <time-span-select
          :default-val="search.dimension"
          :day-type="search.day_type"
          @changeSelect="timeSpanChanged"
        />
      </el-form-item>
      <el-form-item label="设备编码:">
        <equip-select
          :equip_no_props.sync="search.equip_no"
          @changeSearch="equipChanged"
        />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        label="No"
      />
      <el-table-column
        :label="search.dimension === 3?'月份':search.dimension === 1?'班次':'时间'"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
          <span v-if="search.dimension === 1">/{{ scope.row.classes }}</span>
          <!-- <span v-if="search.dimension === 3">{{ setMonth(scope.row.month) }}</span>
          <span v-if="search.dimension === 1&&scope.row.classes">
            {{ (Object.prototype.hasOwnProperty.call(scope.row, 'factory_date')?
              scope.row.factory_date:scope.row.end_time__date)
              + ' / '+ scope.row.classes }}</span>
          <span v-if="search.dimension === 2">
            {{ Object.prototype.hasOwnProperty.call(scope.row, 'factory_date')?
              scope.row.factory_date:scope.row. end_time__date }}
          </span> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="equip_no"
        label="设备编码"
      />
      <el-table-column
        prop="total_trains"
        label="总车数"
      />
      <el-table-column
        label="总耗时/min"
      >
        <template slot-scope="{row}">
          {{ row.total_time |setTimeMin }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="Number(search.day_type) === 2&&search.dimension === 1"
        label="总时间/min"
      >
        <template slot-scope="{row}">
          {{ row.classes_time |setTimeMin }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="Number(search.day_type) === 2&&search.dimension === 1"
        label="利用率"
      >
        <template slot-scope="{row}">
          {{ (setUse(row.total_time,row.classes_time)) }}
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import equipSelect from '@/components/select_w/equip'
import page from '@/components/page'
import timeSpanSelect from '@/components/select_w/timeSpan'
import { equipBanburySummary } from '@/api/base_w'
import myMixin from './aminxPublic'
export default {
  components: { page, equipSelect, timeSpanSelect },
  mixins: [myMixin],
  data() {
    return {
      total: 0,
      loading: false,
      search: {
        page: 1,
        dimension: 1,
        day_type: 2,
        date: []
      },
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipBanburySummary('get', null, { params: this.search })
        this.total = data.count
        this.tableData = data.results
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    changeDate(date) {
      this.search.st = date ? date[0] : ''
      this.search.et = date ? date[1] : ''
      this.getList()
      this.search.page = 1
    },
    changeRadio(val) {
      this.search.day_type = val
      this.getList()
      this.search.page = 1
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    equipChanged(val) {
      this.search.equip_no = val
      this.getList()
      this.search.page = 1
    },
    timeSpanChanged(val) {
      this.search.dimension = val
      this.getList()
      this.search.page = 1
    },
    setMonth(month) {
      if (!month) return
      const data = new Date(month)
      return data.getFullYear() + '/' + (data.getMonth() + 1)
    },
    setUse(total_time, classes_time) {
      if (!total_time || !classes_time) return 0
      const a = parseFloat(total_time / classes_time * 100).toFixed(10)
      const num = (a.substring(0, a.lastIndexOf('.') + 2))
      return num + '%'
    }
  }
}
</script>

<style>

</style>
