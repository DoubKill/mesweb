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
          <td>{{ oneObj.order_no || '--' }}</td>
        </tr>
        <tr>
          <td>物料编码</td>
          <td>{{ oneObj.material_no|| '--' }}</td>
        </tr>
        <tr>
          <td>lot_no</td>
          <td>{{ oneObj.lot_no|| '--' }}</td>
        </tr>
        <tr>
          <td>目的地</td>
          <td>{{ oneObj.location || '--' }}</td>
        </tr>
      </table>
      <el-table
        :data="tableData"
        border
        style="flex:1;margin-left:20px"
      >
        <el-table-column label="今日出库量" align="center">
          <el-table-column
            prop="material_no"
            label="物料编码"
          />
          <el-table-column
            prop="sum_qty"
            label="数量"
          />
          <!-- <el-table-column
            prop="address"
            label="余量"
          /> -->
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
          prop="order_no"
          label="出库单号"
        />
        <el-table-column
          prop="name"
          label="出库口"
        />
        <el-table-column
          prop="pallet_no"
          label="托盘号"
        />
        <el-table-column
          prop="lot_no"
          label="lot_no"
        />
        <el-table-column
          prop="material_no"
          label="物料编码"
        />
        <el-table-column
          prop="qty"
          label="出库数"
        />
        <el-table-column
          prop="weight"
          label="重量"
        />
        <el-table-column
          prop="quality_status"
          label="状态"
        />
        <el-table-column
          prop="location"
          label="目的地"
        />
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="pageCurrent"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { inventoryNow, inventoryToday, mixGumOutInventoryLog } from '@/api/base_w_two'
import page from '@/components/page'
export default {
  components: { page },
  data() {
    return {
      oneObj: {},
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
      tableData1: [],
      total: 0,
      pageCurrent: 1,
      page_size: 10
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const arr = await Promise.all([
          inventoryNow('get'),
          inventoryToday('get'),
          mixGumOutInventoryLog('get')
        ])
        this.oneObj = arr[0].results || {}
        this.tableData = arr[1].results || []
        this.tableData1 = arr[2].results || []
        this.total = arr[2].count
      } catch (e) {
        //
      }
    },
    async currentChange(page, pageSize) {
      try {
        this.pageCurrent = page
        this.page_size = pageSize
        const data = await mixGumOutInventoryLog('get', null, { params: {
          page: this.pageCurrent,
          page_size: this.page_size
        }})
        this.total = data.count
        this.tableData1 = data.results || []
      } catch (e) {
        //
      }
    }
  }
}
</script>

<style lang="scss" scoped>
   .info-table {
        border-collapse: collapse;
      td,th  {
          padding: 10px 30px;
      }
      th{
          background: #F5F7FA;
          color: #909399;
      }
    }
</style>
