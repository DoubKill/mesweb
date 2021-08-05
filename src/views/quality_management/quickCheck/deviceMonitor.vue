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
      max-height="50vh"
      style="margin:10px 0;"
    >
      <el-table-column
        prop="raw_value"
        min-width="20"
      />
    </el-table>

    <el-tag :type="stateVal?'success':'danger'">数据采集程序通信{{ stateVal?'正常':'不正常' }}</el-tag>
  </div>
</template>

<script>
import { productReportEquip, equipTestData, checkEquip } from '@/api/base_w_four'
export default {
  name: 'DeviceMonitor',
  data() {
    return {
      topTableData: [],
      tableData: [],
      stateVal: false
    }
  },
  created() {
    this.getInfo()
    this.getBottomList()
    this.getCheckEquip()
    this.timer = setInterval(() => {
      this.getInfo()
      this.getBottomList()
      this.getCheckEquip()
    }, 10000)
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
      this.getCheckEquip()
    }, 10000)
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
        const arr = data.filter(d => d.raw_value)
        this.tableData = arr || []
      } catch (e) {
        //
      }
    },
    async getCheckEquip() {
      try {
        const data = await checkEquip('get', null, { params: { all: 1 }})
        this.stateVal = data.status
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
