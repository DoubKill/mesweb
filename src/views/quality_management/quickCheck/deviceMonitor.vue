<template>
  <div>
    <!-- 快检设备监控 -->
    <div v-for="(item,i) in topTableData" :key="i" class="tagBox">
      <el-tag :type="item.status===1?'success':'danger'">{{ item.no }}</el-tag>
      <el-tag type="info" effect="plain">
        {{ item.last_time||'--' }}
      </el-tag>
    </div>
    <el-table
      :data="tableData"
      :show-header="false"
      border
      style="margin-top:10px;"
    >
      <el-table-column
        prop="raw_value"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import { productReportEquip, equipTestData } from '@/api/base_w_four'
export default {
  name: 'DeviceMonitor',
  data() {
    return {
      topTableData: [],
      tableData: []
    }
  },
  created() {
    this.getInfo()
    this.getBottomList()
    this.timer = setInterval(() => {
      this.getInfo()
      this.getBottomList()
    }, 20000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  deactivated() {
    clearInterval(this.timer)
  },
  activated() {
    this.timer = setInterval(() => {
      this.getInfo()
      this.getBottomList()
    }, 20000)
  },
  methods: {
    async getInfo() {
      try {
        const data = await productReportEquip('get', null, { params: { all: 1 }})
        this.topTableData = data
      } catch (e) {
        //
      }
    },
    async getBottomList() {
      try {
        const data = await equipTestData('get', null, { params: { all: 1 }})
        this.tableData = data
      } catch (e) {
        //
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .tagBox{
        display: inline-flex;
        margin: 0 20px 10px 0;

    }
</style>
