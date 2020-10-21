<template>
  <div class="card-container">
    <el-row>
      <span>胶料信息卡</span>
    </el-row>
    <el-row class="n-b-border">
      <el-col :span="20">
        <el-row>
          <span />
        </el-row>
        <el-row>
          <el-col :span="6"><span>生产机台</span></el-col>
          <el-col :span="6"><span /></el-col>
          <el-col :span="6"><span>生产班次</span></el-col>
          <el-col :span="6"><span /></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><span>生产日期</span></el-col>
          <el-col :span="6"><span /></el-col>
          <el-col :span="6"><span>生产车次</span></el-col>
          <el-col :span="6"><span /></el-col>
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
          <el-table
            style="width:100%"
            fit
          >
            <el-table-column label="车次" />
            <el-table-column label="门尼">
              <el-table-column label="检测值" />
              <el-table-column label="等级" />
            </el-table-column>
            <el-table-column label="比重">
              <el-table-column label="检测值" />
              <el-table-column label="等级" />
            </el-table-column>
            <el-table-column label="综合级别" />
          </el-table>
        </el-row>
      </el-col>
      <el-col :span="4" />
    </el-row>
  </div>

</template>

<script>
export default {

}
</script>

<style lang="scss">
  .card-container {
      margin: 0 auto;
      text-align: center;
      border: 1px solid black;
    span {
     display: inline-block;
    }
    .el-col {
      border-right: 1px solid black;
    }
    .el-row {
      border-bottom: 1px solid black;
      & > .el-col:last-child {
         border-right: none;
      }
    }

    .n-b-border {
        border-bottom: none;;
    }
    // .b-border {
    //   border-bottom: 1px solid black;
    // }
    // .r-border {
    //   border-right: 1px solid black;
    // }
  }
</style>
