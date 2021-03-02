<template>
  <div class="card-container">
    <table
      border="1"
      bordercolor="black"
      class="info-table"
    >
      <tbody>
        <tr>
          <td colspan="5">胶料信息卡</td>
        </tr>
        <tr>
          <td colspan="4">{{ testData.product_no }}</td>
          <td rowspan="14" style="transform:rotate(-90deg); width: 150px; max-width: 150px;">
            <img class="barcode" style="margin-left: -120px">
          </td>
        </tr>
        <tr>
          <td>工厂日期</td>
          <td>{{ testData.day_time }}</td>
          <td>生产班次</td>
          <td>{{ testData.classes_group }}</td>
        </tr>
        <tr>
          <td>生产机台</td>
          <td>{{ testData.equip_no }}</td>
          <td>生产车次</td>
          <td>{{ testData.actual_trains }}</td>
        </tr>
        <tr>
          <td>收皮重量</td>
          <td>{{ testData.actual_weight }}</td>
          <td>余量</td>
          <td>{{ testData.residual_weight }}</td>
        </tr>
        <tr>
          <td>生产时间</td>
          <td colspan="3">{{ testData.production_factory_date }}</td>
        </tr>
        <tr>
          <td>有效时间</td>
          <td colspan="3">{{ testData.valid_time }}</td>
        </tr>
        <tr>
          <td>收皮员</td>
          <td>{{ testData.operation_user }}</td>
          <td>托盘号</td>
          <td>{{ testData.test ? testData.test.pallet_no : '' }}</td>
        </tr>
        <tr>
          <td colspan="4">质量信息卡</td>
        </tr>
        <tr>
          <td>检测时间</td>
          <td colspan="3">{{ testData.test ? testData.test.test_factory_date : '' }}</td>
        </tr>
        <tr>
          <td>打印时间</td>
          <td colspan="3">{{ testData.print_time }}</td>
        </tr>
        <tr>
          <td>检测员</td>
          <td>{{ testData.test ? testData.test.test_user : '' }}</td>
          <td>检测班次</td>
          <td>{{ testData.test ? testData.test.test_class : '' }}</td>
        </tr>
        <tr>
          <td>检测结果</td>
          <td>{{ testData.deal_result }}</td>
          <td>备注</td>
          <td>{{ testData.test ? testData.test.test_note : '' }}</td>
        </tr>
        <tr>
          <td>处理人</td>
          <td>{{ testData.deal_user }}</td>
          <td>处理时间</td>
          <td>{{ testData.deal_time }}</td>
        </tr>
        <tr>
          <td>处理意见</td>
          <td colspan="3">{{ testData.deal_suggestion }}</td>
        </tr>
      </tbody>
    </table>
    <table
      border="2"
      bordercolor="black"
    >
      <tr>
        <th style="width:100px" rowspan="2">车次</th>
        <th v-for="(value, key) in testData.mtr_list.table_head" :key="key" :colspan="value.length" style="min-width: 80px; max-width: 80px">{{ key }}</th>
        <th style="width:100px" rowspan="2">综合判级</th>
      </tr>
      <tr>
        <th v-for="(subHead, index) in testData.mtr_list.sub_head" :key="index">{{ subHead }}</th>
      </tr>
      <tr v-for="row in testData.mtr_list.rows" :key="row">
        <td>{{ row }}</td>
        <td v-for="(item, index) in testData.mtr_list[row]" :key="index">
          {{ index !== testData.mtr_list[row].length - 1 ? item.value : '' }}
          {{
            index !== testData.mtr_list[row].length - 1 ? item.add_subtract : item.status
          }}
        </td>
      </tr>
    </table>
    <img class="barcode">
  </div>
</template>

<script>
import jsbarcode from 'jsbarcode'

export default {

  data() {
    return {
      testData: {
        test: {},
        mtr_list: {
          table_head: [],
          sub_head: [],
          rows: []
        }
      }
    }
  },
  methods: {
    setTestData(data) {
      this.testData = data
      jsbarcode(
        '.barcode',
        this.testData.lot_no, {
          displayValue: true
        }
      )
      this.testData.mtr_list.rows = []
      for (const key in this.testData.mtr_list) {
        if (key !== 'table_head' && key !== 'rows' && key !== 'sub_head') {
          this.testData.mtr_list.rows.push(key)
          const dataPointItems = []
          for (const head in this.testData.mtr_list.table_head) {
            this.testData.mtr_list.table_head[head].forEach(subHead => {
              const dataPointItem =
              this.testData.mtr_list[key].find(item => {
                return item.test_indicator_name === head && item.data_point_name === subHead
              })
              dataPointItems.push(dataPointItem || {})
            })
          }
          let max_test_times = 0
          let maxTestTimesItem = null
          for (let i = 0; i < dataPointItems.length; i++) {
            if (dataPointItems[i].max_test_times > max_test_times) {
              max_test_times = dataPointItems[i].max_test_times
              maxTestTimesItem = dataPointItems[i]
            }
          }
          if (maxTestTimesItem) {
            dataPointItems.push(maxTestTimesItem)
          }
          this.testData.mtr_list[key] = dataPointItems
        }
      }
      this.testData.mtr_list.sub_head = []
      for (const key in this.testData.mtr_list.table_head) {
        this.testData.mtr_list.sub_head = this.testData.mtr_list.sub_head.concat(
          this.testData.mtr_list.table_head[key])
      }
    }
  }
}
</script>

<style lang="scss">
  .card-container {
    width: 600px;
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
    table {
      width: 100%;
      border-collapse: collapse
    }

   .info-table {
      td {
        min-width: 100px;
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
  }
</style>
