<template>
  <div>
    <!-- 出库看板 -->
    <div style="display:flex">
      <table
        border="1"
        bordercolor="#EBEEF5"
        class="info-table"
      >
        <tr style="text-align:center">
          <th colspan="2">当前出库信息</th>
        </tr>
        <tr>
          <td>出库单号</td>
          <td>胶料信息卡</td>
        </tr>
        <tr>
          <td>物料编码</td>
          <td>胶料信息卡</td>
        </tr>
        <tr>
          <td>lot_no</td>
          <td>胶料信息卡</td>
        </tr>
        <tr>
          <td>目的地</td>
          <td>胶料信息卡</td>
        </tr>
      </table>
      <el-table
        :data="tableData"
        border
        width="100%"
        style="flex:1;margin-left:20px"
      >
        <el-table-column label="今日出库量" align="center">
          <el-table-column
            prop="date"
            label="物料编码"
          />
          <el-table-column
            prop="name"
            label="数量"
          />
          <el-table-column
            prop="address"
            label="余量"
          />
        </el-table-column>
      </el-table>
    </div>

    <el-table
      :data="tableData1"
      border
      style="width: 100%;margin-top:20px"
    >
      <el-table-column label="出库履历信息" align="center">
        <el-table-column
          type="index"
          width="50"
          label="No"
        />
        <el-table-column
          prop="date"
          label="出库单号"
        />
        <el-table-column
          prop="name"
          label="出库口"
        />
        <el-table-column
          prop="address"
          label="托盘号"
        />
        <el-table-column
          prop="date"
          label="lot_no"
        />
        <el-table-column
          prop="name"
          label="物料编码"
        />
        <el-table-column
          prop="address"
          label="出库数"
        />
        <el-table-column
          prop="date"
          label="重量"
        />
        <el-table-column
          prop="name"
          label="状态"
        />
        <el-table-column
          prop="address"
          label="目的地"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }],
      tableData1: []
    }
  }
}
</script>

<style lang="scss" scoped>
   .info-table {
        border-collapse: collapse;
      td,th  {
          padding: 10px 10px;
      }
      th{
          background: #F5F7FA;
          color: #909399;
      }
    }
</style>
