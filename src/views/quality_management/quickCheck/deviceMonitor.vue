<template>
  <div>
    <!-- 快检设备监控 -->
    <div v-for="(item,i) in topTableData" :key="i" class="tagBox">
      <el-tag :type="item.status===1?'success':'danger'">{{ item.no }}</el-tag>
      <el-tag type="info" effect="plain">
        {{ item.last_time }}
      </el-tag>
    </div>
    <el-table
      :data="tableData"
      :show-header="false"
      border
      style="margin-top:10px;"
    >
      <el-table-column
        prop="date"
        label="日期"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="姓名"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="地址"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import { productReportEquip } from '@/api/base_w_four'
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
    this.timer = setInterval(() => {
      this.getInfo()
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
