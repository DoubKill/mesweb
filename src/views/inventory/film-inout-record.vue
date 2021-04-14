<template>
  <div>
    <!-- 胶片出入库履历  终炼胶和混炼胶 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="searchDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="searchForm.a"
          placeholder="请选择"
          clearable
          @change="changeList"
        >
          <el-option
            v-for="item in ['出库','入库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产机台">
        <equip-select
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="仓库名称">
        <el-select
          v-model="searchForm.b"
          placeholder="请选择"
          clearable
          @change="changeWarehouse"
        >
          <el-option
            v-for="item in ['终炼胶库','混炼胶库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出入库口">
        <stationInfoWarehouse
          :warehouse-name="searchForm.b"
          @changSelect="changSelectStation"
        />
      </el-form-item>
      <el-form-item label="物料编码:">
        <materialCodeSelect
          :is-all-obj="true"
          :is-created="true"
          @changeSelect="changeMaterialCode"
        />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        prop="date"
        label="No"
        min-width="10"
      />
      <el-table-column
        prop="date"
        label="类型"
        min-width="10"
      />
      <el-table-column
        prop="name"
        label="出入库单号"
        min-width="10"
      />
      <el-table-column
        prop="address"
        label="lot_no"
        min-width="10"
      />
      <el-table-column
        prop="date"
        label="托盘号"
        min-width="10"
      />
      <el-table-column
        prop="name"
        label="物料编码"
        min-width="10"
      />
      <el-table-column
        prop="address"
        label="生产日期/班次"
        min-width="10"
      />
      <el-table-column
        prop="date"
        label="生产机台"
        min-width="10"
      />
      <el-table-column
        prop="name"
        label="车次"
        min-width="10"
      />
      <el-table-column
        prop="address"
        label="出入库原因"
        min-width="10"
        show-overflow-tooltip
      />
      <el-table-column
        prop="date"
        label="出入库类型"
        min-width="10"
      />
      <el-table-column
        prop="name"
        label="出入库数"
        min-width="10"
      />
      <el-table-column
        prop="address"
        label="单位"
        min-width="10"
      />
      <el-table-column
        prop="date"
        label="重量"
        min-width="10"
      />
      <el-table-column
        prop="name"
        label="出入库口"
        min-width="10"
      />
      <el-table-column
        prop="name"
        label="库位"
        min-width="10"
      />
      <el-table-column
        prop="address"
        label="目的地"
        min-width="10"
      />
      <el-table-column
        prop="date"
        label="发起人"
        min-width="10"
      />
      <el-table-column
        prop="name"
        label="发起时间"
        min-width="10"
      />
      <el-table-column
        prop="address"
        label="完成时间"
        min-width="10"
      />
    </el-table>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import EquipSelect from '@/components/EquipSelect/index'
import materialCodeSelect from '@/components/materialCodeSelect'
import stationInfoWarehouse from '@/components/select_w/warehouseSelectPosition'

export default {
  components: { EquipSelect, materialCodeSelect, stationInfoWarehouse },
  data() {
    return {
      searchDate: [setDate(), setDate()],
      searchForm: {
        b: ''
      },
      tableData: []
    }
  },
  methods: {
    getList() {},
    changeList() {
      this.getList()
    },
    equipSelected(val) {
      console.log(val)
    },
    changeMaterialCode(obj) {
      console.log(obj, 777)
    },
    changeWarehouse() {},
    changSelectStation() {}
  }
}
</script>

<style>

</style>
