<template>
  <div>
    <!-- 出库任务 -->
    <el-form :inline="true">
      <el-form-item label="出库单据号">
        <el-input v-model="search.TaskNumber" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="search.State" clearable placeholder="请选择" @change="changeDate">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="追踪码">
        <el-input v-model="search.TrackingNumber" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="search.MaterialCode" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="巷道">
        <el-select v-model="search.TunnelName" clearable placeholder="请选择" @change="changeDate">
          <el-option
            v-for="item in TunnelNameList"
            :key="item.id"
            :label="item.tunnelName"
            :value="item.tunnelName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库位码">
        <el-input v-model="search.spaceId" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="识别卡ID">
        <el-input v-model="search.ladenToolNumber" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="datetimerange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="id"
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        prop="taskNumber"
        label="出库单据号"
        min-width="20"
      />
      <el-table-column
        prop="taskId"
        label="下架任务号"
        min-width="20"
      />
      <el-table-column
        prop="tunnelId"
        label="巷道编码"
        min-width="10"
      />
      <el-table-column
        prop="trackingNumber"
        label="追踪码"
        min-width="20"
      />
      <el-table-column
        prop="ladenToolNumber"
        label="识别卡ID"
        min-width="20"
      />
      <el-table-column
        prop="spaceId"
        label="库位码"
        min-width="20"
      />
      <el-table-column
        prop="materialName"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="materialCode"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="batchNo"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="createrTime"
        label="创建时间"
        min-width="20"
      />
      <el-table-column
        prop="taskState"
        label="状态"
        min-width="20"
        :formatter="(row)=>{
          let obj = options.find(d=>d.id === row.taskState)
          return obj.name
        }"
      />
      <el-table-column
        prop="createUserId"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        prop="quantity"
        label="数量"
        min-width="10"
      />
      <el-table-column
        prop="weightOfActual"
        label="重量"
        min-width="20"
      />
    </el-table>
    <page
      v-if="!loading"
      :total="total"
      :current-page="search.pageNo"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import request from '@/utils/request-zc'
import page from '@/components/page'
import { debounce } from '@/utils'
export default {
  name: 'DeliveryTask',
  components: { page },
  data() {
    return {
      tableData: [],
      search: {
        pageSize: 10,
        pageNo: 1
      },
      options: [
        { name: '待处理', id: 1 },
        { name: '处理中', id: 2 },
        { name: '完成', id: 3 },
        { name: '已解绑', id: 4 },
        { name: '取消', id: 5 },
        { name: '异常', id: 6 },
        { name: '强制完成', id: 12 }
      ],
      TunnelNameList: [],
      datetimerange: [],
      loading: false,
      total: 0
    }
  },
  created() {
    this.getTunnelNameList()
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.tableData = []
      request({
        url: '/stockOutTask/FindAllDownTaskByPaging',
        method: 'get',
        params: this.search
      }).then(data => {
        this.loading = false
        this.tableData = data.datas
        this.total = data.totalRecord
      }).catch((e) => {
        this.loading = false
      })
    },
    currentChange(page) {
      this.search.pageNo = page
      this.getList()
    },
    changeDate() {
      if (!this.search.State) {
        delete this.search.State
      }
      this.search.StartTime = this.datetimerange ? this.datetimerange[0] : ''
      this.search.EndTime = this.datetimerange ? this.datetimerange[1] : ''
      this.search.pageNo = 1
      this.getList()
    },
    getDebounce() {
      this.search.pageNo = 1
      debounce(this, 'getList')
    },
    getTunnelNameList() {
      request({
        url: '/tunnel/FindAll',
        method: 'get'
      }).then(data => {
        this.TunnelNameList = data.datas || []
      }).catch((e) => {
        console.log(e, 'zc获取失败')
      })
    }
  }
}
</script>

<style>

</style>
