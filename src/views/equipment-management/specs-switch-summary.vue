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
        />
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="search.radio">
          <el-radio :label="1">自然日</el-radio>
          <el-radio :label="2">工厂时间</el-radio>
        </el-radio-group>
      </el-form-item>
      <br>
      <el-form-item label="时间跨度:">
        <time-span-select
          :equip_no_props.sync="search.equip_no"
          @changeSearch="timeSpanChanged"
        />
      </el-form-item>
      <el-form-item label="设备编码:">
        <equip-select
          @changeSearch="equipChanged"
        />
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <el-form-item label="总耗时:">
        {{ 111 }}
      </el-form-item>
      <el-form-item label="最小耗时:">
        {{ 222 }}
      </el-form-item>
      <el-form-item label="最大耗时:">
        {{ 333 }}
      </el-form-item>
      <el-form-item label="平均耗时:">
        {{ 444 }}
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
        prop="a"
        label="时间"
      />
      <el-table-column
        prop="aa"
        label="计划号"
      />
      <el-table-column
        prop="b"
        label="设备编码"
      />
      <el-table-column
        prop="c"
        label="切换前胶料编码"
      />
      <el-table-column
        prop="d"
        label="切换后胶料编码"
      />
      <el-table-column
        prop="e"
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
import timeSpanSelect from '@/components/select_w/timeSpan'
export default {
  components: { page, equipSelect, timeSpanSelect },
  data() {
    return {
      total: 0,
      loading: false,
      search: {
        page: 1,
        equip_no: null,
        date: []
      },
      tableData: []
    }
  },
  methods: {
    currentChange(page) {
      this.search.page = page
    },
    productBatchingChanged(val) {

    },
    equipChanged() {},
    timeSpanChanged() {}
  }
}
</script>

<style>

</style>
