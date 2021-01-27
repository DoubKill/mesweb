<template>
  <div class="card-container">
    <table
      border="1"
      bordercolor="black"
      class="info-table"
    >
      <tbody>
        <tr>
          <td colspan="5">炼胶分厂配料流转卡</td>
        </tr>
        <tr>
          <td colspan="1">名称</td>
          <td colspan="3">{{ testData.material_no }}</td>
          <td rowspan="10" style="width:200px;position:relative">
            <img
              ref="ImgCode"
              class="barcode"
              style="max-width:460px;position:absolute;top:50%;left:50%;
              transform:translateX(-50%) translateY(-50%) rotate(-90deg)"
            >
          </td>
        </tr>
        <tr>
          <td>工厂日期</td>
          <td>
            <el-date-picker
              v-model="testData.production_factory_date"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </td>
          <td>班次</td>
          <td>
            <ClassSelect :is-clearable="false" :value-default="testData.production_classes" @classSelected="classSelected" />
          </td>
        </tr>
        <tr>
          <td>生产机型</td>
          <td>{{ testData.dev_type }}</td>
          <td>配料机台</td>
          <td>{{ testData.equip_no }}</td>
        </tr>
        <tr>
          <td>配料员</td>
          <td colspan="3">{{ testData.created_username }}</td>
        </tr>
        <tr>
          <td>单重</td>
          <td>{{ testData.actual_weight }}</td>
          <td>数量</td>
          <td>
            <el-input-number
              v-model="testData.quantity"
              :step="1"
              :min="1"
              step-strictly
              controls-position="right"
            />
          </td>
        </tr>
        <tr>
          <td>打印时间</td>
          <td colspan="3">{{ testData.created_date }}</td>
        </tr>
        <tr>
          <td>有效时间</td>
          <td colspan="3" />
        </tr>
        <tr>
          <td>建议使用时间</td>
          <td colspan="3" />
        </tr>
        <tr>
          <td>胶料编码</td>
          <td colspan="3">{{ testData.product_no }}</td>
        </tr>
        <tr>
          <td>建议使用车次</td>
          <td colspan="3">
            <el-input-number
              v-model="testData.begin_trains"
              :step="1"
              :max="testData.end_trains"
              step-strictly
              controls-position="right"
            />
            --
            <el-input-number
              v-model="testData.end_trains"
              :step="1"
              :min="testData.begin_trains"
              step-strictly
              controls-position="right"
            />
          </td>
        </tr>
        <!-- <tr>
          <td>备注</td>
          <td colspan="3">
            <el-input v-model="testData.a" />
          </td>
        </tr> -->

        <tr>
          <td>序号</td>
          <td colspan="2">物料名称</td>
          <td colspan="2">重量</td>
        </tr>
        <tr v-for="(item,index) in testData.material_details" :key="index">
          <td>序号</td>
          <td colspan="2">{{ item.material__material_no }}</td>
          <td colspan="2">{{ item.standard_weight }}</td>
        </tr>
        <tr>
          <td colspan="3">合计</td>
          <td colspan="2">{{ allDate }}</td>
        </tr>
      </tbody>
    </table>

    <el-button
      type="primary"
      style="float:right;margin:10px -110px 10px 0"
      @click="submitFun"
    >保存</el-button>

  </div>
</template>

<script>
import jsbarcode from 'jsbarcode'
import ClassSelect from '@/components/ClassSelect'
import { weightingPackageLog } from '@/api/base_w_two'

export default {

  components: { ClassSelect },
  data() {
    return {
      testData: {
      },
      allDate: 0,
      currentId: ''
    }
  },
  methods: {
    async setTestData(id) {
      try {
        this.allDate = 0
        this.currentId = id || this.currentId
        const obj = await weightingPackageLog('get', this.currentId)
        this.testData = obj
        this.testData.material_details.forEach(D => {
          this.allDate += D.standard_weight
        })
        this.allDate = Math.round(this.allDate * 100) / 100
        jsbarcode(
          '.barcode',
          this.testData.bra_code, {
            displayValue: true
          }
        )
      } catch (e) {
        //
      }
    },
    updated() {
    },
    classSelected() {},
    async submitFun() {
      try {
        await weightingPackageLog('PATCH', this.currentId,
          { data: this.testData })
        this.$message.success('修改成功')
        this.setTestData()
      } catch (e) {
        //
      }
    }
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
