<template>
  <div>
    <!-- 炭黑粉料罐物料规格汇总 -->
    <el-table
      :data="tableData"
      border
      :span-method="arraySpanMethod"
    >
      <el-table-column
        :label="`炭黑分布图`"
        align="center"
      >
        <el-table-column
          prop="date"
          label=""
          min-width="20"
        />
        <el-table-column
          prop="tank_no"
          label="料罐"
          min-width="20"
        />
        <el-table-column
          v-for="item in equip_nos"
          :key="item"
          :label="item"
          min-width="20"
        >
          <template slot-scope="{row}">
            {{ row[item] }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { matTankStatus } from '@/api/base_w_five'
export default {
  name: 'ScheduleMaterialSpecification',
  data() {
    return {
      tableData: [],
      equip_nos: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await matTankStatus('get', null, { params: {}})
        this.tableData = data.data || []
        if (this.tableData.length) {
          this.tableData[0].date = '炭黑罐'
          this.tableData[6].date = '粉料罐'
        }
        this.equip_nos = data.equip_nos || []
      } catch (e) {
        //
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      const _spanArr = [6, 0, 0, 0, 0, 0, 3, 0, 0, 1]
      if ([0].includes(columnIndex) && _spanArr) {
        const _row = _spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
