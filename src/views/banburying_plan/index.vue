<template>
  <div class="banburying_plan_style">
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="search_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeSearch"
        />
      </el-form-item>
      <!-- <el-form-item label="班次">
        <el-input model="" />
      </el-form-item> -->
      <!-- <el-form-item label="机台">
        <el-input v-model="equip_no" @input="changeSearch" />
      </el-form-item> -->
      <el-form-item label="机台">
        <el-select
          v-model="equip_no"
          clearable
          placeholder="请选择"
          @change="changeSearch"
          @visible-change="equipNoVisibleChange"
        >
          <el-option
            v-for="item in equipNoOptions"
            :key="item.equip_no"
            :label="item.equip_no"
            :value="item.equip_no"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-table
      highlight-current-row
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="equip_no"
        label="机台"
        align="center"
      />
      <el-table-column
        prop="sn"
        label="顺序"
        align="center"
      />

      <el-table-column
        align="center"
        label="胶料信息"
      >
        <el-table-column
          align="center"
          prop="product_no"
          label="胶料编码"
        />
        <el-table-column
          align="center"
          prop="stage"
          label="STAGE"
        />
        <el-table-column
          align="center"
          prop="actual_time"
          label="时间"
        />
        <el-table-column
          align="center"
          prop="plan_weight"
          label="重量"
        />
      </el-table-column>

      <el-table-column
        align="center"
        label="数量"
      >
        <el-table-column
          align="center"
          prop="plan_trains"
          label="计划"
        />
        <el-table-column
          align="center"
          prop="actual_trains"
          label="实绩"
        />
      </el-table-column>

      <el-table-column
        align="center"
        label="重量"
      >
        <el-table-column
          align="center"
          prop="plan_weight"
          label="计划"
        />
        <el-table-column
          align="center"
          prop="actual_weight"
          label="实绩"
        />

        <el-table-column
          prop="ach_rate"
          label="达成率"
        >
          <template slot-scope="scope">
            <el-progress
              :text-inside="true"
              :stroke-width="15"
              :percentage="scope.row.ach_rate"
              :color="customColorMethod"
            />
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        align="center"
        label="时间"
      >
        <el-table-column
          align="center"
          prop="plan_time"
          label="计划"
        />
        <el-table-column
          align="center"
          prop="actual_time"
          label="实绩"
        />
      </el-table-column>

      <el-table-column
        align="center"
        label="分析"
      >
        <el-table-column
          align="center"
          prop="start_rate"
          label="启动率"
        />
      </el-table-column>

    </el-table>
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import page from '@/components/page'
import { banbury_plan_url, getEquip } from '@/api/display_static_fun'

export default {
  components: { page },
  data: function() {
    return {
      tableData: [],
      total: 0,
      equipNoOptions: [],
      getParams: {
        page: 1
      },
      search_time: null,
      // classes: null,
      equip_no: null
    }
  },
  created() {
    this.banbury_plan_list()
  },
  methods: {
    equipNoVisibleChange(bool) {
      if (bool) {
        var app = this
        getEquip({ all: 1 }).then(function(response) {
          app.equipNoOptions = response.results
        })
      }
    },
    async banbury_plan_list() {
      try {
        const banbury_planData = await banbury_plan_url('get', { params: this.getParams })
        this.tableData = banbury_planData.data
        console.log(this.tableData)
        this.total = banbury_planData.count
      } catch (e) { throw new Error(e) }
    },
    customColorMethod(percentage) {
      if (percentage < 20) {
        return '#f56c6c'
      } else if (percentage < 40) {
        return '#e6a23c'
      } else if (percentage < 60) {
        return '#6f7ad3'
      } else if (percentage < 80) {
        return '#1989fa'
      } else {
        return '#5cb87a'
      }
    },
    changeSearch() {
      this.getParams['search_time'] = this.search_time
      this.getParams['equip_no'] = this.equip_no
      this.getParams.page = 1
      this.banbury_plan_list()
    },
    currentChange(page) {
      this.getParams.page = page
      this.banbury_plan_list()
    }
  }
}

</script>

<style lang="scss">
.banburying_plan_style{
  .el-progress-bar__innerText{
    color: #000 !important;
  }
}
</style>

