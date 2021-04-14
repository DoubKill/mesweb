<template>
  <div>
    <u-table
      id="out-table"
      style="height:auto"
      :data="testOrders"
      fixed-columns-roll
      border
      fit
      row-id="id"
      max-height="600"
      size="mini"
      :tree-config="{
        children: 'children',
        expandAll: false,
        lazy: true,
        hasChildren: 'hasChildren'}"
      :data-changes-scroll-top="false"
    >
      <u-table-column label="生产信息" align="center">
        <u-table-column
          label="工厂日期"
          min-width="90px"
          prop="production_factory_date"
          align="center"
          :tree-node="true"
        >
          <template v-if="row.production_factory_date" slot-scope="{row}">
            {{ (row.production_factory_date).split(' ')[0] }}
          </template>
        </u-table-column>
        <u-table-column label="生产班次/班组" prop="class_group" min-width="75px" />
        <u-table-column align="center" label="生产机台" min-width="50px" prop="production_equip_no" />
        <u-table-column label="胶料编码" min-width="105px" align="center" prop="product_no" />
        <u-table-column label="车次" align="center" min-width="35px" prop="actual_trains" />
        <u-table-column label="检测状态" min-width="35px" prop="test_status" align="center">
          <template slot-scope="{ row }">
            <div :class="row.test_status === '复检' ? 'test_type_name_style': ''">
              {{ row.test_status }}
            </div>
          </template>
        </u-table-column>
      </u-table-column>
      <u-table-column v-for="header in testTypeList.filter(type => type.show)" :key="header.test_type_name" align="center" :label="header.test_type_name">
        <u-table-column v-for="subHeader in header.data_indicator_detail.filter(item => item.show)" :key="header.test_type_name + subHeader.detail" min-width="55px" :label="subHeader.detail" align="center">
          <template slot-scope="{ row }">
            <div :class="getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'level')!==1&&getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'level')!==''?'test_type_name_style':''">
              {{ getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'value') }}
            </div>
          </template>
        </u-table-column>
        <u-table-column v-if="header.test_type_name === '门尼' || header.test_type_name === '流变'" label="检测机台" min-width="50px" align="center">
          <template slot-scope="{row}">
            {{ getDataPoint(header.test_type_name, 'maxLevelItem', row.order_results, 'machine_name') }}
          </template>
        </u-table-column>
        <u-table-column min-width="50px" label="标准" align="center">
          <template slot-scope="{row}">
            {{ getDataPoint(header.test_type_name, 'maxLevelItem', row.order_results, 'upper_lower') }}
          </template>
        </u-table-column>
        <u-table-column min-width="35px" label="等级" align="center">
          <template slot-scope="{row}">
            {{ getDataPoint(header.test_type_name, 'maxLevelItem', row.order_results, 'level') }}
          </template>
        </u-table-column>
      </u-table-column>
      <u-table-column label="综合等级" min-width="35px" prop="level" align="center" />
      <u-table-column label="综合检测结果" min-width="60px" prop="mes_result" align="center" />
    </u-table>
  </div>
</template>

<script>
export default {
  props: {
    testOrders: {
      type: Array,
      default() {
        return []
      }
    },
    testTypeList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    getDataPoint(testType, dataPoint, data, key) {
      const result = data[testType] ? (data[testType][dataPoint] ? data[testType][dataPoint] : null) : null
      return result ? result[key] : ''
    }
  }
}
</script>

<style>

</style>
