<template>
  <div>
    <!-- 期间别-生产量汇总 -->
    <el-form :inline="true">
      <el-form-item>
        <el-radio-group v-model="search.type" @change="resetTime">
          <el-radio label="day">日报</el-radio>
          <el-radio label="week">周报</el-radio>
          <el-radio label="month">月报</el-radio>
          <el-radio label="year">年报</el-radio>
        </el-radio-group>
      </el-form-item>
      <br>
      <el-form-item label="机台">
        <selectEquip :equip_no_props.sync="search.equip_no" @changeSearch="getList" />
      </el-form-item>
      <el-form-item v-if="type==='day'" label="日">
        <el-date-picker
          key="1"
          v-model="search.day_time"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :clearable="false"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item v-if="type==='week'" label="周">
        <el-date-picker
          key="2"
          v-model="search.day_time"
          type="week"
          :picker-options="{firstDayOfWeek:1}"
          format="yyyy第WW周"
          value-format="yyyy-MM-dd"
          placeholder="选择周"
          :clearable="false"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item v-if="type==='month'" label="月">
        <el-date-picker
          key="3"
          v-model="search.day_time"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM-dd"
          placeholder="选择月"
          :clearable="false"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item v-if="type==='year'" label="年">
        <el-date-picker
          key="4"
          v-model="search.day_time"
          type="year"
          format="yyyy"
          value-format="yyyy-MM-dd"
          placeholder="选择年"
          :clearable="false"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      show-summary
    >
      <el-table-column
        prop="time"
        label="时间"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="实际产量(吨)"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="理论生产时间(h)"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="有效生产时间(h)"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="有效时间比率%"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="理论单车生产时间(秒)"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="实际单车生产时间(秒)"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="效率%"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import selectEquip from '@/components/select_w/equip'
import { setDate } from '@/utils'
export default {
  name: 'SchedulePeriodType',
  components: { selectEquip },
  data() {
    return {
      btnExportLoad: false,
      search: { day_time: setDate(), type: 'day' },
      loading: false,
      tableData: [],
      type: 'day'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await equipWarehouseRecord('get', null, { params: this.search })
        // this.tableData = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.getList()
    },
    resetTime() {
      this.search.day_time = setDate()
      this.type = this.search.type
      this.getList()
    },
    exportTable() {
    //   this.btnExportLoad = true

    }
  }
}
</script>

<style>

</style>
