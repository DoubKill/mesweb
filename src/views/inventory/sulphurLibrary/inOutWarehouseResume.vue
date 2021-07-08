<template>
  <div class="inOutWarehouseStyle">
    <!-- 硫磺库  出入库履历-->
    <el-form :inline="true">
      <el-form-item label="名称:">
        <el-input v-model="search.name" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="物料编码:">
        <el-input v-model="search.product_no" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="供应商:">
        <el-input v-model="search.provider" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="批号:">
        <el-input v-model="search.lot_no" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="库区:">
        <el-select v-model="search.depot_name" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.depot_name"
            :value="item.depot_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库位:">
        <el-select v-model="search.depot_site_name" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in options1"
            :key="item.id"
            :label="item.depot_site_name"
            :value="item.depot_site_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库时间:">
        <el-date-picker
          v-model="search.enter_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="出库时间:">
        <el-date-picker
          v-model="search.outer_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="search.sulfur_status" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="(item,key) in [{name:'已入库',label:1},{name:'已出库',label:2}]"
            :key="key"
            :label="item.name"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        prop="name"
        label="名称"
        min-width="20"
      />
      <el-table-column
        prop="product_no"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="provider"
        label="供应商"
        min-width="20"
      />
      <el-table-column
        prop="lot_no"
        label="批号"
        min-width="20"
      />
      <el-table-column
        prop="depot_name"
        label="库区"
        min-width="20"
      />
      <el-table-column
        prop="depot_site_name"
        label="库位"
        min-width="20"
      />
      <el-table-column
        prop="enter_time"
        label="入库时间"
        min-width="20"
      />
      <el-table-column
        prop="outer_time"
        label="出库时间"
        min-width="20"
      />
      <el-table-column
        prop="sulfur_status"
        label="状态"
        min-width="20"
        :formatter="(row)=>{
          if(row.sulfur_status===1){
            return '已入库'
          }
          return '已出库'
        }"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { debounce } from '@/utils'
import page from '@/components/page'
import { sulfurResume, sulfurDepot, sulfurDepotSite } from '@/api/base_w_four'
export default {
  name: 'SulphurInOutWarehouseResume',
  components: { page },
  data() {
    return {
      search: {},
      options: [],
      options1: [],
      tableData: [],
      total: 0
    }
  },
  created() {
    this.getDepotList()
    this.getDepotSiteList()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await sulfurResume('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getDepotList() {
      try {
        const data = await sulfurDepot('get', null, { params: { all: 1 }})
        this.options = data.results
      } catch (e) {
        //
      }
    },
    async getDepotSiteList() {
      try {
        const data = await sulfurDepotSite('get', null, { params: { all: 1 }})
        this.options1 = data.results
      } catch (e) {
        //
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    changeDebounce() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeList() {
      this.search.page = 1
      this.search.s_etime = this.search.enter_time ? this.search.enter_time[0] : ''
      this.search.e_etime = this.search.enter_time ? this.search.enter_time[1] : ''
      this.search.s_otime = this.search.outer_time ? this.search.outer_time[0] : ''
      this.search.e_otime = this.search.outer_time ? this.search.outer_time[1] : ''
      this.getList()
    }
  }
}
</script>

<style>
.inOutWarehouseStyle .el-input{
  width:auto;
}
</style>
