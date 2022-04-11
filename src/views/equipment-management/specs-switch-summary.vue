<template>
  <div v-loading="loading">
    <!-- 规格切换时间汇总 -->
    <el-form :inline="true">
      <el-form-item label="时间:">
        <el-date-picker
          v-model="search.st"
          type="date"
          placeholder="日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <!-- <el-form-item>
        <el-radio-group v-model="search.radio">
          <el-radio :label="1">自然日</el-radio>
          <el-radio :label="2">工厂时间</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <br> -->
      <!-- <el-form-item label="时间跨度:">
        <time-span-select
          :equip_no_props.sync="search.equip_no"
          @changeSearch="timeSpanChanged"
        />
      </el-form-item> -->
      <el-form-item label="设备编码:">
        <equip-select
          :equip_no_props.sync="search.equip_no"
          :is-created="true"
          @changeSearch="equipChanged"
        />
      </el-form-item>
      <el-form-item label="时间单位:">
        <el-select v-model="timeUnit" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <el-form-item
        :label="'总耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.sum_time }}</span>
        <span v-else>{{ allData.sum_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'最小耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.min_time }}</span>
        <span v-else>{{ allData.min_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'最大耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.max_time }}</span>
        <span v-else>{{ allData.max_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'平均耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.avg_time }}</span>
        <span v-else>{{ allData.avg_time |setTimeMin }}</span>
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
        prop="time"
        label="时间"
      />
      <el-table-column
        prop="equip_no"
        label="设备编码"
      />
      <el-table-column
        prop="plan_classes_uid_age"
        label="切换前计划号"
      />
      <el-table-column
        prop="plan_classes_uid_later"
        label="切换后计划号"
      />
      <el-table-column
        prop="cut_ago_product_no"
        label="切换前胶料编码"
      />
      <el-table-column
        prop="cut_later_product_no"
        label="切换后胶料编码"
      />
      <el-table-column
        :label="'耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <template slot-scope="{row}">
          <span v-if="timeUnit==='秒'">{{ row.time_consuming }}</span>
          <span v-else>{{ row.time_consuming |setTimeMin }}</span>
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
import { cutTimeCollect } from '@/api/base_w'
// import timeSpanSelect from '@/components/select_w/timeSpan'
import { setDate } from '@/utils/index'
export default {
  name: 'SpecsSwitchSummary',
  components: { page, equipSelect },
  data() {
    return {
      total: 0,
      loading: false,
      search: {
        page: 1,
        equip_no: '',
        st: setDate(),
        date: []
      },
      allData: {},
      tableData: [],
      options: ['秒', '分钟'],
      timeUnit: '秒'
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await cutTimeCollect('get', null, { params: this.search })
        this.total = data.count
        this.allData = data.results.pop() || {}
        this.tableData = data.results || []
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    changeDate(date) {
      this.getList()
      this.search.page = 1
    },
    equipChanged(val) {
      this.search.equip_no = val
      this.getList()
      this.search.page = 1
    }
  }
}
</script>

<style>

</style>
