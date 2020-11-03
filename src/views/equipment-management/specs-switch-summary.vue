<template>
  <div v-loading="loading">
    <!-- 规格切换时间汇总 -->
    <el-form :inline="true">
      <el-form-item label="时间:">
        <el-date-picker
          v-model="search.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
          @changeSearch="equipChanged"
        />
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <el-form-item label="总耗时:">
        {{ allData.sum_time }}
      </el-form-item>
      <el-form-item label="最小耗时:">
        {{ allData.min_time }}
      </el-form-item>
      <el-form-item label="最大耗时:">
        {{ allData.max_time }}
      </el-form-item>
      <el-form-item label="平均耗时:">
        {{ allData.avg_time }}
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
        prop="plan_classes_uid"
        label="计划号"
      />
      <el-table-column
        prop="equip_no"
        label="设备编码"
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
        prop="time_consuming"
        label="耗时"
      />
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
export default {
  components: { page, equipSelect },
  data() {
    return {
      total: 0,
      loading: false,
      search: {
        page: 1,
        equip_no: null,
        date: []
      },
      allData: {},
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
      this.search.st = date ? date[0] : ''
      this.search.et = date ? date[1] : ''
      this.getList()
      this.search.page = 1
    },
    equipChanged(val) {
      this.search.equip_no = val
      this.getList()
      this.search.page = 1
    }
    // timeSpanChanged() {}
  }
}
</script>

<style>

</style>
