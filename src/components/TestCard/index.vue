<template>
  <div class="card-container">
    <table
      border="1"
      bordercolor="black"
      style="width: 100%; font-size: 14px; border-collapse:collapse"
    >
    <tbody>
      <tr>
        <td colspan="5">胶料信息卡</td>
      </tr>
      <tr>
        <td colspan="4">C-FM-Jsds</td>
        <td rowspan="14" style="width: 100px"></td>
      </tr>
      <tr>
        <td>工厂日期</td>
        <td></td>
        <td>生产班次</td>
        <td></td>
      </tr>
      <tr>
        <td>生产机台</td>
        <td></td>
        <td>生产车次</td>
        <td></td>
      </tr>
      <tr>
        <td>收皮重量</td>
        <td></td>
        <td>余量</td>
        <td></td>
      </tr>
      <tr>
        <td>生产时间</td>
        <td colspan="3"></td>
      </tr>
      <tr>
        <td>有效时间</td>
        <td colspan="3"></td>
      </tr>
      <tr>
        <td>收皮员</td>
        <td></td>
        <td>备注</td>
        <td></td>
      </tr>
      <tr>
        <td colspan="4">质量信息卡</td>
      </tr>
      <tr>
        <td>检测时间</td>
        <td colspan="3"></td>
      </tr>
      <tr>
        <td>打印时间</td>
        <td colspan="3"></td>
      </tr>
      <tr>
        <td>检测员</td>
        <td></td>
        <td>检测班次</td>
        <td></td>
      </tr>
      <tr>
        <td>检测结果</td>
        <td></td>
        <td>备注</td>
        <td></td>
      </tr>
       <tr>
        <td>处理人</td>
        <td></td>
        <td>处理时间</td>
        <td></td>
      </tr>
      <tr>
        <td>处理意见</td>
        <td colspan="3"></td>
      </tr>
    </tbody>
    
    </table>
  </div>
  <!-- <div class="card-container">
    <el-row>
      <span>胶料信息卡</span>
    </el-row>
    <el-row class="n-b-border">
      <el-col :span="20">
        <el-row>
          <span>{{ testData.product_no }}</span>
        </el-row>
        <el-row>
          <el-col :span="6"><span>生产机台</span></el-col>
          <el-col :span="6"><span>{{ testData.production_equip_no }}</span></el-col>
          <el-col :span="6"><span>生产班次</span></el-col>
          <el-col :span="6"><span />{{ testData.production_class }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><span>生产日期</span></el-col>
          <el-col :span="6"><span>{{ testData.production_factory_date }}</span></el-col>
          <el-col :span="6"><span>生产车次</span></el-col>
          <el-col :span="6"><span>{{ testData.actual_trains }}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><span>设重</span></el-col>
          <el-col :span="6"><span /></el-col>
          <el-col :span="6"><span>实重</span></el-col>
          <el-col :span="6"><span /></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><span>生产时间</span></el-col>
          <el-col :span="18"><span /></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><span>有效时间</span></el-col>
          <el-col :span="18"><span /></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><span>收皮员</span></el-col>
          <el-col :span="6"><span /></el-col>
          <el-col :span="6"><span>备注</span></el-col>
          <el-col :span="6"><span /></el-col>
        </el-row>
        <el-row>
          <span>质量信息卡</span>
        </el-row>
        <el-row>
          <el-col :span="6"><span>检验时间</span></el-col>
          <el-col :span="18"><span /></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><span>打印时间</span></el-col>
          <el-col :span="18"><span /></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><span>检测员</span></el-col>
          <el-col :span="6"><span /></el-col>
          <el-col :span="6"><span>检测班次</span></el-col>
          <el-col :span="6"><span /></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><span>检测结果</span></el-col>
          <el-col :span="6"><span /></el-col>
          <el-col :span="6"><span>备注</span></el-col>
          <el-col :span="6"><span /></el-col>
        </el-row>
        <el-row class="n-b-border">
          <el-table>
            <el-table-column label="车次" align="center" />
            <el-table-column label="门尼" align="center">
              <el-table-column label="检测值" align="center" />
              <el-table-column label="等级" align="center" />
            </el-table-column>
            <el-table-column label="比重" align="center">
              <el-table-column label="检测值" align="center" />
              <el-table-column label="等级" align="center" />
            </el-table-column>
            <el-table-column label="综合级别" align="center" />
          </el-table>
        </el-row>
      </el-col>
      <el-col :span="4" />
    </el-row>
  </div> -->

</template>

<script>
export default {

  data() {
    return {
      testData: {}
    }
  },
  methods: {
    setTestData(data) {
      this.testData = data
      console.log(this.testData)
    }
  }
}
</script>

<style lang="scss">
  .card-container {

    margin: 0 auto;
    text-align: center;

    td {
      min-width: 50px;
      padding-top: 10px;
      padding-bottom: 10px;;
    }
  }
  // .card-container {
  //     max-width: 700px;
  //     margin: 0 auto;
  //     text-align: center;
  //     border: 1px solid black;
  //     color: #909399;
  //   span {
  //    display: inline-block;
  //    height: 20px;
  //    margin: 10px auto;
  //   }
  //   .el-col {
  //     border-right: 1px solid black;
  //   }
  //   .el-row {
  //     border-bottom: 1px solid black;
  //     & > .el-col:last-child {
  //        border-right: none;
  //     }
  //   }

  //   .n-b-border {
  //       border-bottom: none;;
  //   }
  //   // .b-border {
  //   //   border-bottom: 1px solid black;
  //   // }
  //   // .r-border {
  //   //   border-right: 1px solid black;
  //   // }
  // }
</style>
