<template>
  <div class="card-container">
    <!-- 原材料临时快检结果录入卡片 -->
    <table
      border="1"
      bordercolor="black"
      class="info-table"
    >
      <tbody>
        <tr>
          <td colspan="4">安吉炼胶分成质量追踪卡</td>
        </tr>
        <tr>
          <td colspan="4">安吉炼胶分厂</td>
        </tr>
        <tr>
          <td colspan="1">品名</td>
          <td colspan="3">{{ testData.material_no }}</td>
        </tr>
        <tr>
          <td>生产机台</td>
          <td>
            //
          </td>
          <td>生产车次</td>
          <td>
            //
          </td>
        </tr>
        <tr>
          <td colspan="1">批号</td>
          <td colspan="3">{{ testData.dev_type }}</td>
        </tr>
        <tr>
          <td>数量</td>
          <td colspan="3">{{ testData.created_username }}</td>
        </tr>
        <tr>
          <td>重量/kg</td>
          <td>{{ testData.actual_weight }}</td>
          <td>件重/kg</td>
          <td>{{ testData.actual_weight }}</td>
        </tr>
        <tr>
          <td>产地</td>
          <td colspan="3">{{ testData.created_date }}</td>
        </tr>
        <tr>
          <td>收货日期</td>
          <td>--</td>
          <td>入库日期</td>
          <td>--</td>
        </tr>
        <tr>
          <td>品质状况</td>
          <td>--</td>
          <td>处理结果</td>
          <td>--</td>
        </tr>
        <tr>
          <td colspan="4">
            <img
              ref="ImgCode"
              class="barcode"
            >

            <!-- style="max-width:460px;position:absolute;top:50%;left:50%;
              transform:translateX(-50%) translateY(-50%) rotate(-90deg)" -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import jsbarcode from 'jsbarcode'

export default {
  data() {
    return {
      testData: {
      },
      currentId: ''
    }
  },
  methods: {
    async setTestData(id) {
      try {
        // this.currentId = id || this.currentId
        // const obj = await weightingPackageLog('get', this.currentId)
        // this.testData = obj
        jsbarcode(
          '.barcode',
          '8888778', {
            displayValue: true
          }
        )
      } catch (e) {
        //
      }
    },
    updated() {
    },
    classSelected() {}
  }
}

</script>

<style lang="scss">
  .card-container {
    width: 790px;
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
        padding-bottom: 10px;;
      }
    }

  }
</style>
