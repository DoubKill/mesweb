<template>
  <div>
    <!-- 原材料 出库单据 -->
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
      <el-button
        v-permission="['material_outbound_record', 'space']"
        type="primary"
        @click="showLocationDialog"
      >指定库位出库</el-button>
      <el-button
        v-permission="['material_outbound_record', 'weight']"
        type="primary"
        @click="showWeightDialog"
      >指定重量出库</el-button>
      <el-button type="primary" @click="getList">刷新</el-button>
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
        min-width="20"
      />
      <el-table-column
        prop="taskNumber"
        label="出库单据号"
        min-width="20"
      />
      <el-table-column
        prop="stockOutTaskType"
        label="单据类型"
        min-width="20"
        :formatter="(row)=>{
          let obj = optionsType.find(d=>d.id === row.stockOutTaskType)
          return obj.name
        }"
      />
      <el-table-column
        prop="createrTime"
        label="创建时间"
        min-width="20"
      />
      <el-table-column
        prop="stockOutTaskState"
        label="状态"
        min-width="20"
        :formatter="(row)=>{
          let obj = options.find(d=>d.id === row.stockOutTaskState)
          return obj.name
        }"
      />
      <el-table-column
        prop="createUserId"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        label="操作"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-button
            size="mini"
            @click="showEditDialog(row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      v-if="!loading"
      :total="total"
      :current-page="search.pageNo"
      @currentChange="currentChange"
    />

    <el-dialog
      title="物料明细"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <el-table
        v-loading="loading1"
        :data="tableData1"
        style="width: 100%"
        border
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column
          prop="materialCode"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="materialName"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="quantity"
          label="数量"
          min-width="10"
        />
        <el-table-column
          prop="entranceCode"
          label="站台编码"
          min-width="20"
        />
        <el-table-column
          prop="entranceName"
          label="站台名称"
          min-width="20"
        />
      </el-table>
    </el-dialog>

    <el-dialog
      :title="isLocation?'添加指定库位出库单据':'添加指定重量出库单据'"
      :visible.sync="dialogVisible1"
      width="80%"
      :before-close="handleClose1"
    >
      <el-form v-if="!loading2" :inline="true">
        <el-form-item label="出库口(必选)">
          <el-select v-model="formSearch.entrance_name" placeholder="请选择" @change="changeEntrance">
            <el-option
              v-for="item in optionsEntrance"
              :key="item.code"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input v-model="formSearch.material_name" clearable placeholder="请输入内容" @input="getDialogDebounce" />
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input v-model="formSearch.material_no" clearable placeholder="请输入内容" @input="getDialogDebounce" />
        </el-form-item>
        <el-form-item v-if="isLocation" label="品质状态">
          <el-select v-model="formSearch.quality_status" clearable placeholder="请选择" @change="getDialog">
            <el-option
              v-for="(item,i) in [{name:'合格',id:1},{name:'不合格',id:3}]"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div v-if="isLocation" :key="1" v-loading="loading2">
        <h3>库位货物列表</h3>
        <el-table
          :data="tableData2"
          style="width: 100%"
          border
          max-height="400px"
        >
          <el-table-column
            prop="MaterialName"
            label="物料名称"
            min-width="20"
          />
          <el-table-column
            prop="MaterialCode"
            label="物料编码"
            min-width="20"
          />
          <el-table-column
            prop="BatchNo"
            label="批次号"
            min-width="20"
          />
          <el-table-column
            prop="StockDetailState"
            label="品质状态"
            min-width="15"
            :formatter="(row)=>{
              let obj = [{name:'合格',id:1},{name:'不合格',id:3}].find(d=>d.id === row.StockDetailState)
              return obj.name
            }"
          />
          <el-table-column
            prop="SpaceId"
            label="库位编号"
            min-width="20"
          />
          <el-table-column
            prop="unit"
            label="单位"
            min-width="20"
          />
          <el-table-column
            prop=""
            label="库位状态"
            min-width="15"
            :formatter="(row)=>{
              return '使用中'
            }"
          />
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="{row,$index}">
              <el-button
                :disabled="row.btnDisabled"
                @click="showDialog(row,$index)"
              >添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <page
          :total="total1"
          :page-size-props="15"
          :current-page="formSearch.page"
          @currentChange="currentChange1"
        />
        <h3>待出库库位货物</h3>
        <el-table
          :data="tableData4"
          style="width: 100%;margin-top:5px"
          border
        >
          <el-table-column
            label="序号"
            type="index"
            min-width="20"
          />
          <el-table-column
            prop="MaterialName"
            label="物料名称"
            min-width="20"
          />
          <el-table-column
            prop="MaterialCode"
            label="物料编码"
            min-width="20"
          />
          <el-table-column
            prop="BatchNo"
            label="批次号"
            min-width="20"
          />
          <el-table-column
            prop="StockDetailState"
            label="品质状态"
            min-width="20"
            :formatter="(row)=>{
              let obj = [{name:'合格',id:1},{name:'不合格',id:3}].find(d=>d.id === row.StockDetailState)
              return obj.name
            }"
          />
          <el-table-column
            prop="SpaceId"
            label="库位编号"
            min-width="20"
          />
          <el-table-column
            prop="unit"
            label="单位"
            min-width="20"
          />
          <el-table-column
            label="库位状态"
            min-width="20"
            :formatter="(row)=>{
              return '使用中'
            }"
          />
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="{row}">
              <el-button
                @click="cancelDialog(row)"
              >取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else :key="2" v-loading="loading2">
        <h3>可添加物料明细</h3>
        <el-table
          :data="tableData5"
          style="width: 100%"
          border
          max-height="400px"
        >
          <el-table-column
            prop="MaterialCode"
            label="物料编码"
            min-width="20"
          />
          <el-table-column
            prop="MaterialName"
            label="物料名称"
            min-width="20"
          />
          <el-table-column
            prop="WeightOfActual"
            label="所在巷道库存总重量"
            min-width="20"
          />
          <el-table-column
            label="出库重量"
            min-width="20"
          >
            <template slot-scope="{row}">
              <el-input-number
                v-model="row.WeightOfActualUnit"
                controls-position="right"
                :max="row.WeightOfActual"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span v-if="!loading2" slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request-zc'
import page from '@/components/page'
import { debounce } from '@/utils'
import { wmsStock, wmsWeightStock, wmsEntrance } from '@/api/base_w_three'
export default {
  name: 'DeliveryBill',
  components: { page },
  data() {
    return {
      loading: false,
      search: {
        pageSize: 10,
        pageNo: 1
      },
      tableData: [],
      total: 0,
      options: [
        { name: '已创建', id: 1 },
        { name: '等待出库', id: 2 },
        { name: '出库中', id: 3 },
        { name: '已出库', id: 4 },
        { name: '异常出库', id: 5 },
        { name: '取消', id: 6 }
      ],
      optionsType: [
        { name: '生产正常出库', id: 1 },
        { name: 'mes指定库位出库', id: 2 },
        { name: 'mes指定重量出库', id: 3 },
        { name: '自主创建', id: 4 }
      ],
      dialogVisible: false,
      loading1: false,
      tableData1: [],
      dialogVisible1: false,
      formSearch: {},
      tableData2: [],
      tableData3: [{}],
      tableData4: [],
      EntranceCode: '',
      isLocation: '',
      tableData5: [{}],
      loading2: false,
      total1: 0,
      optionsEntrance: [],
      btnLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.tableData = []
      request({
        url: '/stockOutTask/FindAllByPaging',
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
    getDebounce() {
      this.search.pageNo = 1
      debounce(this, 'getList')
    },
    getDialogDebounce() {
      if (this.isLocation) {
        this.formSearch.page = 1
        debounce(this, 'getDialogGoods')
      } else {
        debounce(this, 'getWeight')
      }
    },
    getDialog() {
      this.formSearch.page = 1
      this.getDialogGoods()
    },
    changeDate() {
      if (!this.search.State) {
        delete this.search.State
      }
      this.search.pageNo = 1
      this.getList()
    },
    currentChange(page) {
      this.search.pageNo = page
      this.getList()
    },
    showEditDialog(row) {
      this.dialogVisible = true
      this.getDialogList(row.id)
    },
    getDialogList(id) {
      this.loading1 = true
      request({
        url: '/stockOutTask/Find',
        method: 'get',
        params: { id: id }
      }).then(data => {
        this.loading1 = false
        this.tableData1 = data.datas
      }).catch((e) => {
        this.loading1 = false
      })
    },
    async getDialogGoods() {
      try {
        this.loading2 = true
        const data = await wmsStock('get', null, { params: this.formSearch })
        this.tableData2 = data.results
        this.loading2 = false
        this.total1 = data.count
        if (this.tableData4.length > 0) {
          this.tableData2.forEach(d => {
            let arr = []
            arr = this.tableData4.filter(D => D.Sn === d.Sn)
            if (arr.length > 0) {
              d.btnDisabled = true
            } else {
              d.btnDisabled = false
            }
          })
        }
      } catch (error) {
        this.loading2 = false
      }
    },
    handleClose1(done) {
      this.dialogVisible1 = false
      this.tableData4 = []
      this.formSearch = {}
      this.formSearch.entrance_name = this.optionsEntrance[0].name
      this.formSearch.code = this.optionsEntrance[0].code
      this.EntranceCode = ''
      if (done) {
        done()
      }
    },
    showLocationDialog() {
      this.isLocation = true
      this.getEntrance()
      this.dialogVisible1 = true
    },
    showWeightDialog() {
      this.isLocation = false
      this.dialogVisible1 = true
      this.getEntrance()
    },
    async getWeight() {
      try {
        this.tableData5 = []
        this.loading2 = true
        const data = await wmsWeightStock('get', null, { params: this.formSearch })
        this.tableData5 = data.results
        this.loading2 = false
      } catch (error) {
        this.loading2 = false
      }
    },
    showDialog(row, index) {
      this.$set(this.tableData2[index], 'btnDisabled', true)
      row.Quantity = 1
      row.TaskDetailNumber = 'MesD' + new Date().getTime()
      row.SpaceCode = row.SpaceId
      this.tableData4.push(row)
    },
    cancelDialog(row) {
      const arr = this.tableData4.filter(d => d.Sn !== row.Sn)
      this.tableData4 = arr
      this.tableData2.forEach(d => {
        if (d.Sn === row.Sn) {
          this.$set(d, 'btnDisabled', false)
        }
      })
    },
    currentChange1(page) {
      this.formSearch.page = page
      this.getDialogGoods()
    },
    changeEntrance(val) {
      let obj
      if (val) {
        obj = this.optionsEntrance.find(d => d.name === val)
      }
      this.formSearch.code = obj.code || ''
      if (this.isLocation) {
        this.tableData4 = []
        this.formSearch.page = 1
        this.getDialogGoods()
      } else {
        this.getWeight()
      }
    },
    async getEntrance() {
      try {
        this.loading2 = true
        const data = await wmsEntrance('get')
        this.optionsEntrance = data
        this.formSearch.entrance_name = this.optionsEntrance[0].name
        this.formSearch.code = this.optionsEntrance[0].code
        if (this.isLocation) {
          this.getDialogGoods()
        } else {
          this.getWeight()
        }
      } catch (error) {
        //
      }
    },
    submitForm() {
      let obj = {
        TaskNumber: 'Mes' + new Date().getTime(),
        EntranceCode: this.formSearch.code,
        AllocationInventoryDetails: this.tableData4
      }
      if (!this.isLocation) {
        const arr = []
        this.tableData5.forEach(d => {
          if (Number(d.WeightOfActualUnit) > 0) {
            const aaa = JSON.parse(JSON.stringify(d))
            aaa.WeightOfActual = aaa.WeightOfActualUnit
            arr.push(aaa)
          }
        })
        obj = {
          TaskNumber: 'Mes' + new Date().getTime(),
          EntranceCode: this.formSearch.code,
          AllocationInventoryDetails: arr
        }
      }
      if (obj.AllocationInventoryDetails.length === 0) {
        this.$message.info('未添加物料')
        return
      }
      const _api = this.isLocation ? '/MESApi/AllocateSpaceDelivery' : '/MESApi/AllocateWeightDelivery'
      this.btnLoading = true
      request({
        url: _api,
        method: 'post',
        data: obj
      }).then(data => {
        this.$message.success('添加成功')
        this.handleClose1(false)
        this.search.pageNo = 1
        this.btnLoading = false
        this.getList()
      }).catch((e) => {
        this.btnLoading = false
      })
    }
  }
}
</script>

<style>

</style>
