<template>
  <div>
    <!-- 胶片库出库任务 -->
    <el-form inline>
      <el-form-item label="库房">
        <el-select
          v-model="search.warehouse"
          placeholder="请选择库房"
          @change="changeList"
        >
          <el-option
            v-for="item in ['终炼胶库','混炼胶库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码">
        <el-select v-model="search.product_no" allow-create filterable placeholder="请选择" clearable @visible-change="getProductList" @change="changeList">
          <el-option
            v-for="item in options1"
            :key="item.material_no"
            :label="item.material_no"
            :value="item.material_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库口">
        <el-select
          v-model="search.station"
          placeholder="请选择出库口"
          clearable
          @visible-change="getStation"
          @change="changeList"
        >
          <el-option
            v-for="item in stationList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="巷道">
        <el-select
          v-model="search.tunnel"
          placeholder="请选择巷道"
          clearable
          @visible-change="getStation"
          @change="changeList"
        >
          <el-option
            v-for="item in 4"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="cancelOrderNo(selectionData)">取消任务</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      border
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
        :selectable="(row)=>{return row.status===2}"
      />
      <el-table-column
        prop="warehouse"
        label="库房"
        width="80"
      />
      <el-table-column
        prop="station"
        label="出库口"
        min-width="20"
      />
      <el-table-column
        prop="order_no"
        label="出库任务号"
        min-width="20"
      />
      <el-table-column
        prop="material_no"
        label="物料编码"
        width="140"
      >
        <template slot-scope="{row}">{{ row.product_no }}</template>
      </el-table-column>
      <el-table-column
        prop="quality_status"
        label="品质状态"
        width="70"
      />
      <el-table-column
        prop="lot_no"
        label="Lot_No"
        min-width="25"
      />
      <el-table-column
        prop="pallet_no"
        label="托盘号"
        min-width="15"
      />
      <el-table-column
        prop="memo"
        label="车次"
        min-width="15"
      />
      <el-table-column
        prop="location"
        label="库位编号"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="任务创建人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="任务创建时间"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="70"
        :formatter="(row)=>{
          let obj = optionsState1.find(d=>d.id === row.status)
          return obj.name
        }"
      />
      <el-table-column
        label="操作"
        width="120"
      >
        <template slot-scope="{row}">
          <el-button :disabled="row.status!==2" type="primary" @click="cancelOrderNo([row])">取消任务</el-button>
        </template>
      </el-table-column>
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
import page from '@/components/page'
import { outboundDeliveryOrderDetails } from '@/api/base_w'
import { cancelTask } from '@/api/jqy'
import { batchingMaterials } from '@/api/base_w'
import { stationInfo } from '@/api/warehouse'
export default {
  name: 'FilmIssueTask',
  components: { page },
  data() {
    return {
      search: {
        status: 2,
        warehouse: '终炼胶库'
      },
      total: 0,
      loading: false,
      tableData: [],
      selectionData: [],
      optionsState1: [
        { name: '新建', id: 1 },
        { name: '执行中', id: 2 },
        { name: '已出库', id: 3 },
        { name: '取消', id: 4 },
        { name: '失败', id: 5 }
      ],
      options1: [],
      stationList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const _api = outboundDeliveryOrderDetails
        const data = await _api('get', null, { params: this.search })
        this.total = data.count
        this.tableData = data.results
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async getProductList(val) {
      if (val) {
        try {
          const data = await batchingMaterials('get', null, { params: { all: 1 }})
          this.options1 = data || []
        } catch (e) {
        //
        }
      }
    },
    async getStation(val) {
      if (val === true) {
        try {
          if (this.search.warehouse !== '' && this.search.warehouse !== null) {
            const data1 = await stationInfo({ warehouse_name: this.search.warehouse })
            this.stationList = data1.results
          } else {
            this.stationList = []
            this.$message.info('请先选择库房')
          }
        } catch (error) {
          this.stationList = []
        }
      }
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    handleSelectionChange(arr) {
      this.selectionData = arr
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    cancelOrderNo(arr) {
      try {
        if (!arr.length) {
          this.$message('请选择单据')
          return
        }
        this.$confirm('确定取消, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const _arr = []
          arr.forEach(d => {
            _arr.push(d.id)
          })
          await cancelTask('post', null, { data: { warehouse_name: this.search.warehouse, 'task_ids': _arr }})
          this.$message.success('取消成功')
          if (this.$refs.multipleTable) {
            this.$refs.multipleTable.clearSelection()
          }
          this.getList()
        }).catch(() => {
        })
      } catch (e) {
        //
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
