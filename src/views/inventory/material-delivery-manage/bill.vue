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
      width="75%"
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
          min-width="16"
        />
        <el-table-column
          prop="quantity"
          label="数量"
          min-width="6"
        />
        <el-table-column
          prop="entranceCode"
          label="站台编码"
          min-width="12"
        />
        <el-table-column
          prop="entranceName"
          label="站台名称"
          min-width="10"
        />
        <el-table-column
          label="状态"
          min-width="8"
          :formatter="(row)=>{
            return taskStateList[row.taskState]
          }"
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
        <el-form-item v-if="isLocation" label="伸位">
          <el-select v-model="formSearch.position" clearable placeholder="请选择" @change="getDialog">
            <el-option
              v-for="(item,i) in [{name:'外伸位',id:'外'},{name:'内伸位',id:'内'}]"
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
            prop="inventory_time"
            label="入库时间"
            min-width="20"
          />
          <el-table-column
            prop="position"
            label="伸位"
            min-width="20"
          />
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="{row,$index}">
              <el-button
                :disabled="row.btnDisabled||btnDisabled"
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
            prop="inventory_time"
            label="入库时间"
            min-width="20"
          />
          <el-table-column
            prop="position"
            label="伸位"
            min-width="20"
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
            label="所在巷道库存总重量/kg"
            min-width="20"
          />
          <el-table-column
            label="出库重量/kg"
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

    <el-dialog
      title="选择内外伸位"
      :visible.sync="dialogVisible2"
      width="60%"
      :before-close="handleClose2"
    >
      <el-form :inline="true">
        <el-form-item label="物料名称">
          {{ positionObj.MaterialName }}
        </el-form-item>
        <el-form-item label="当前库位">
          {{ positionObj.SpaceId }}
        </el-form-item>
        <el-form-item label="伸位">
          {{ positionObj.position }}
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData3"
        border
      >
        <el-table-column
          width="55"
          label="选择"
        >
          <template slot-scope="{row}">
            <el-checkbox v-model="row.checked" :disabled="row.position==='外'" />
          </template>
        </el-table-column>
        <el-table-column
          prop="SpaceId"
          label="库位号"
          min-width="20"
        />
        <el-table-column
          prop="position"
          label="伸位"
          min-width="20"
        />
        <el-table-column
          prop="MaterialName"
          label="物料名称"
          min-width="20"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose2(false)">取 消</el-button>
        <el-button type="primary" @click="submitLocation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request-zc'
import page from '@/components/page'
import { debounce } from '@/utils'
import { wmsStock, wmsWeightStock, wmsEntrance, wmsInstock } from '@/api/base_w_three'
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
      tableData3: [],
      tableData4: [],
      EntranceCode: '',
      isLocation: '',
      tableData5: [{}],
      loading2: false,
      total1: 0,
      optionsEntrance: [],
      btnLoading: false,
      taskStateList: {
        1: '待处理',
        2: '处理中',
        3: '完成',
        4: '已解绑',
        5: '取消',
        6: '异常',
        7: '盘点下架中',
        8: '盘点下架完成',
        9: '盘点上架中',
        10: '盘点下线',
        11: '盘点下线完成',
        12: '强制完成',
        13: '盘点确认无货',
        14: '检测下架',
        15: '检测下架完成',
        16: '检测上架中',
        17: '盘点上架移库中'
      },
      dialogVisible2: false,
      btnDisabled: false,
      positionObj: {}
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
    handleClose2(done) {
      this.dialogVisible2 = false
      if (done) {
        done()
      }
    },
    async setWmsInstock(row, index) {
      try {
        this.btnDisabled = true
        const data = await wmsInstock('get', null, { params: {
          material_no: row.MaterialCode, entrance_name: this.formSearch.entrance_name,
          space_id: row.SpaceId
        }})
        this.btnDisabled = false
        if (data.length > 0) {
          // 内伸位有货 弹弹框
          this.positionObj = row
          this.dialogVisible2 = true
          this.tableData3 = data
          this.tableData3.forEach(d => {
            if (d.position === '外') {
              d.checked = true
            } else {
              this.$set(d, 'checked', false)
            }
          })
        } else {
          this.showDialog(row, index, true)
        }
      } catch (error) {
        this.btnDisabled = false
      }
    },
    showDialog(row, index, bool) {
      if (row.position === '外' && !bool) {
        // 是外伸位
        this.setWmsInstock(row, index)
        return
      }
      this.$set(this.tableData2[index], 'btnDisabled', true)
      row.Quantity = 1
      row.TaskDetailNumber = 'MesD' + new Date().getTime()
      row.SpaceCode = row.SpaceId
      this.tableData4.push(row)
    },
    submitLocation() {
      const _table = []
      const preRow = this.tableData3[0].MaterialCode
      let bool
      this.tableData3.forEach((d, i) => {
        if (d.checked) {
          d.Quantity = 1
          d.TaskDetailNumber = 'MesD' + (new Date().getTime() + i)
          d.SpaceCode = d.SpaceId
          _table.push(d)
        }
        if (d.position === '内' && !d.checked) {
          // 内伸位有货
          bool = '1'
        } if (d.checked && d.MaterialCode !== preRow) {
          // 物料不一样
          bool = '2'
        }
      })
      if (bool === '1' || bool === '2') {
        this.$confirm(bool === '1' ? '建议内伸位也打钩出库,是否继续？' : '内伸位物料与所选择的物料不同，是否确定出库？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitLocationFor(_table)
        })
      } else {
        this.submitLocationFor(_table)
      }
    },
    submitLocationFor(_table) {
      const arr = _table.map(d => d.Sn)
      this.tableData2.forEach((d, i) => {
        const a = arr.indexOf(d.Sn)
        if (a > -1) {
          this.$set(this.tableData2[i], 'btnDisabled', true)
        }
      })
      _table.forEach(d => {
        const _arr = this.tableData4.filter(D => D.Sn === d.Sn)
        if (_arr.length === 0) {
          this.tableData4.push(d)
        }
      })
      this.dialogVisible2 = false
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
        obj = this.optionsEntrance.find(d => d.name && d.name === val)
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
        this.formSearch.entrance_name = data ? this.optionsEntrance[0].name : ''
        this.formSearch.code = data ? this.optionsEntrance[0].code : ''
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
