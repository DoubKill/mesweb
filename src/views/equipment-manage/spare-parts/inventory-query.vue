<template>
  <div class="inventory-query">
    <!-- 备件库存查询 -->
    <el-form :inline="true">
      <el-form-item label="库区">
        <el-input
          v-model="search.warehouse_area"
          style="width:150px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="库位">
        <el-input
          v-model="search.warehouse_location"
          style="width:150px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件分类">
        <el-input
          v-model="search.equip_component_type"
          style="width:150px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件代码">
        <el-input
          v-model="search.spare_code"
          style="width:150px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件名称">
        <el-input
          v-model="search.spare_name"
          style="width:150px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input
          v-model="search.specification"
          style="width:150px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['equip_warehouse_inventory', 'export']"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button
          type="primary"
          @click="changeSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        prop="equip_warehouse_area__area_name"
        label="库区"
        min-width="20"
      />
      <el-table-column
        prop="equip_warehouse_location__location_name"
        label="库位"
        min-width="20"
      />
      <el-table-column
        prop="component_type_name"
        label="备件分类"
        min-width="20"
      />
      <el-table-column
        prop="spare__code"
        label="备件代码"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialog1(scope.row)"
          >{{ scope.row.spare__code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="spare_name"
        label="备件名称"
        min-width="20"
      />
      <el-table-column
        prop="specification"
        label="规格型号"
        min-width="20"
      />
      <el-table-column
        prop="technical_params"
        label="用途"
        min-width="20"
      />
      <el-table-column
        prop="quantity"
        label="在库数量"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogShow(scope.row)"
          >{{ scope.row.quantity }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="unit"
        label="标准单位"
        min-width="20"
      />
      <el-table-column
        prop="lower_stock"
        label="库存下限"
        min-width="20"
      />
      <el-table-column
        prop="upper_stock"
        label="库存上限"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['equip_warehouse_inventory', 'change']"
            type="primary"
            size="mini"
            @click="generateFunEdit(scope.row)"
          >盘库
          </el-button>
          <el-button
            v-permission="['equip_warehouse_inventory', 'move']"
            type="primary"
            size="mini"
            @click="generateFunMove(scope.row)"
          >移库
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="库存变更 详细履历"
      :visible.sync="dialogVisible"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="库区">
          <el-input v-model="currentInfo.equip_warehouse_area__area_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="库位">
          <el-input v-model="currentInfo.equip_warehouse_location__location_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="备件分类">
          <el-input v-model="currentInfo.component_type_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="备件代码">
          <el-input v-model="currentInfo.spare__code" :disabled="true" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="currentInfo.spare_name" :disabled="true" style="width:300px" />
        </el-form-item>
        <el-form-item style="float:right">
          <el-button
            type="primary"
            @click="exportOutTable"
          >导出明细Excel</el-button>
        </el-form-item>
      </el-form>
      <el-table
        id="out-table"
        v-loading="loadingView"
        :data="tableDataView"
        border
      >
        <el-table-column
          prop="now_quantity"
          label="当前库存数量"
          min-width="20"
        />
        <el-table-column
          prop="status"
          label="变更类别"
          min-width="20"
        />
        <el-table-column
          prop="quantity"
          label="数量"
          min-width="20"
        />
        <el-table-column
          prop="created_username"
          label="操作人"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          label="操作时间"
          min-width="20"
        />
        <el-table-column
          prop="revocation_desc"
          label="操作备注"
          min-width="20"
        />
        <el-table-column
          prop="order_id"
          label="入出库单据号"
          min-width="20"
        />
        <el-table-column
          prop="work_order_no"
          label="工单编号"
          min-width="20"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisible=false"
        >返回</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="备件代码定义"
      :visible.sync="dialogVisible1"
      width="900px"
    >
      <el-form
        :inline="true"
        label-width="120px"
      >
        <el-form-item
          label="备件分类"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.equip_component_type_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="关键部位"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.key_parts_flag_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="备件代码"
          style=""
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.spare_code"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="库存下限"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.lower_stock"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="备件名称"
          style=""
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.spare_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="库存上限"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.upper_stock"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="规格型号"
          style=""
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.specification"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="计划价格"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.cost"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="用途"
          style=""
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.technical_params"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="材质"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.texture_material"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="标准单位"
          style=""
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.unit"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="有限期(天)"
          prop="checkList"
        >
          <el-input
            v-model="creatOrder.period_validity"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisible1=false"
        >返回</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="备件盘库操作"
      :visible.sync="dialogEdit"
      width="30%"
    >
      <el-form ref="EditForm" :rules="rules1" label-width="150px" :model="EditForm">
        <el-form-item label="备件代码">
          <el-input v-model="EditForm.spare__code" :disabled="true" style="width:250px" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="EditForm.spare_name" :disabled="true" style="width:250px" />
        </el-form-item>
        <el-form-item label="库区">
          <el-input v-model="EditForm.equip_warehouse_area__area_name" :disabled="true" style="width:250px" />
        </el-form-item>
        <el-form-item label="库位">
          <el-input v-model="EditForm.equip_warehouse_location__location_name" :disabled="true" style="width:250px" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number
            v-model="EditForm.quantity"
            :min="1"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input
            v-model="EditForm.desc"
            type="textarea"
            style="width:250px"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogEdit=false">取消</el-button>
        <el-button type="primary" :loading="loadingBtn1" :disabled="loadingBtn" @click="generateDelete">确定删除</el-button>
        <el-button type="primary" :loading="loadingBtn" :disabled="loadingBtn1" @click="EditOne">确定修改</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="备件移库操作"
      :visible.sync="dialogMove"
      width="30%"
    >
      <el-form ref="MoveForm" :rules="rules" :model="MoveForm" label-width="150px">
        <el-form-item label="备件代码">
          <el-input v-model="MoveForm.spare__code" :disabled="true" style="width:250px" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="MoveForm.spare_name" :disabled="true" style="width:250px" />
        </el-form-item>
        <el-form-item label="当前库区">
          <el-input v-model="MoveForm.equip_warehouse_area__area_name" :disabled="true" style="width:250px" />
        </el-form-item>
        <el-form-item label="当前库位">
          <el-input v-model="MoveForm.equip_warehouse_location__location_name" :disabled="true" style="width:250px" />
        </el-form-item>
        <el-form-item label="目标库区" prop="move_equip_warehouse_area__id">
          <el-select
            v-model="MoveForm.move_equip_warehouse_area__id"
            placeholder="请选择"
            clearable
            @visible-change="getWarehouseArea"
            @change="clear"
          >
            <el-option
              v-for="item in warehouseAreaList"
              :key="item.id"
              :label="item.area_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标库位" prop="move_equip_warehouse_location__id">
          <el-select
            v-model="MoveForm.move_equip_warehouse_location__id"
            placeholder="请选择"
            clearable
            @visible-change="getWarehouseLocation"
            @change="clear1"
          >
            <el-option
              v-for="item in warehouseLocationList"
              :key="item.id"
              :label="item.location_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number
            v-model="MoveForm.quantity"
            :min="1"
            :max="quantity"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="MoveForm.unit" :disabled="true" style="width:250px" />
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input
            v-model="MoveForm.desc"
            type="textarea"
            style="width:250px"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogMove=false">取消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="MoveOne">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { exportExcel } from '@/utils/index'
// import { equipWarehouseStatistical } from '@/api/base_w_five'
import { equipWarehouseInventory, equipSpareErp, equipWarehouseLocation, equipWarehouseArea } from '@/api/jqy'
export default {
  name: 'InventoryQuery',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      tableData: [],
      tableDataView: [],
      total: 0,
      checkList: [],
      warehouseAreaList: [],
      warehouseLocationList: [],
      EditForm: {},
      MoveForm: {},
      dialogEdit: false,
      dialogMove: false,
      loadingView: false,
      quantity: null,
      dialogVisible: false,
      dialogVisible1: false,
      submit: false,
      creatOrder: {},
      currentInfo: {},
      loadingBtn: false,
      loadingBtn1: false,
      btnExportLoad: false,
      rules: {
        move_equip_warehouse_area__id: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        move_equip_warehouse_location__id: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      rules1: {
        quantity: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const obj = {}
        Object.assign(obj, this.search)
        const data = await equipWarehouseInventory('get', null, { params: obj })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getErpInfo() {
      try {
        const data = await equipSpareErp('get', null, { params: { spare_code: this.currentInfo.spare__code }})
        if (data.results.length > 0) {
          this.creatOrder = data.results[0]
        }
      } catch (e) {
        //
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.quantity < row.lower_stock || row.quantity > row.upper_stock) {
        return 'warning-row'
      }
      return ''
    },
    async getWarehouseArea(val) {
      if (val) {
        try {
          const data = await equipWarehouseArea('get', null, { params: { equip_spare: this.MoveForm.equip_spare }})
          this.warehouseAreaList = data.data.results
        } catch (e) {
        // this.loading = false
        }
      }
    },
    clear() {
      if (this.MoveForm.move_equip_warehouse_location__id) {
        this.MoveForm.move_equip_warehouse_location__id = null
        this.MoveForm.move_equip_warehouse_location__location_name = null
      }
      this.MoveForm.move_equip_warehouse_area__area_name = this.warehouseAreaList.filter(d => d.id === this.MoveForm.move_equip_warehouse_area__id)[0].area_name
      console.log(this.MoveForm.move_equip_warehouse_area__area_name)
    },
    clear1() {
      this.MoveForm.move_equip_warehouse_location__location_name = this.warehouseLocationList.filter(d => d.id === this.MoveForm.move_equip_warehouse_location__id)[0].location_name
      console.log(this.MoveForm.move_equip_warehouse_location__location_name)
    },
    async getWarehouseLocation(val) {
      if (val) {
        if (this.MoveForm.move_equip_warehouse_area__id) {
          try {
            const data = await equipWarehouseLocation('get', null, { params: { equip_warehouse_area_id: this.MoveForm.move_equip_warehouse_area__id, all: 1 }})
            this.warehouseLocationList = data
          } catch (e) {
            this.warehouseLocationList = []
          }
        } else {
          this.$message.info('请先选择库区')
          this.warehouseLocationList = []
        }
      }
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    debounceSearch() {
      this.$debounce(this, 'changeSearch')
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = equipWarehouseInventory
      _api('get', null, { params: obj, responseType: 'blob' })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '备件库存.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    exportOutTable() {
      exportExcel('入出库履历明细')
    },
    async dialogShow(row) {
      this.currentInfo = row
      this.dialogVisible = true
      this.getInventoryList()
    },
    async getInventoryList() {
      const row = this.currentInfo
      try {
        const data = await equipWarehouseInventory('get', null, { params: { detail: 1, equip_spare: row.equip_spare, equip_warehouse_location: row.equip_warehouse_location__id }})
        this.tableDataView = data.results || []
        // if (this.tableDataView.length > 0) {
        //   this.tableDataView.push({
        //     plan_id: '合计库存数',
        //     quantity: this.tableDataView
        //   })
        // }
      } catch (e) {
        //
      }
    },
    async generateFunEdit(row) {
      this.EditForm = JSON.parse(JSON.stringify(row))
      this.dialogEdit = true
    },
    async generateFunMove(row) {
      this.MoveForm = JSON.parse(JSON.stringify(row))
      this.quantity = this.MoveForm.quantity
      this.dialogMove = true
    },
    async MoveOne() {
      if (this.MoveForm.quantity === undefined) {
        this.MoveForm.quantity = 1
      }
      if (this.MoveForm.desc === undefined) {
        this.MoveForm.desc = null
      }
      this.MoveForm.handle = '移库'
      this.$refs.MoveForm.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            await equipWarehouseInventory('POST', null, { data: this.MoveForm })
            this.loadingBtn = false
            this.dialogMove = false
            this.$message.success('操作成功')
            this.getList()
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    },
    async EditOne() {
      if (this.EditForm.quantity === undefined) {
        this.EditForm.quantity = 1
      }
      if (this.EditForm.desc === undefined) {
        this.EditForm.desc = null
      }
      this.EditForm.handle = '盘库'
      this.$refs.EditForm.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            await equipWarehouseInventory('POST', null, { data: this.EditForm })
            this.loadingBtn = false
            this.dialogEdit = false
            this.$message.success('操作成功')
            this.getList()
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    },
    async generateDelete() {
      if (this.EditForm.desc === undefined) {
        this.EditForm.desc = null
      }
      try {
        this.EditForm.handle = '删除'
        this.loadingBtn1 = true
        await equipWarehouseInventory('post', null, { data: this.EditForm })
        this.loadingBtn1 = false
        this.dialogEdit = false
        this.$message.success('操作成功')
        this.getList()
      } catch (e) {
        this.loadingBtn1 = false
      }
    },
    dialog1(row) {
      this.currentInfo = row
      this.dialogVisible1 = true
      this.getErpInfo()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.inventory-query{
  .el-table .warning-row {
    background: oldlace;
  }
}

</style>
