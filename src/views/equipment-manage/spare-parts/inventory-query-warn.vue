<template>
  <div class="inventory-warn">
    <!-- 备件库存预警 -->
    <el-form :inline="true">
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
      <el-form-item label="库存预警">
        <el-select
          v-model="alarm_type"
          style="width:150px"
          multiple
          placeholder="请选择"
          clearable
          @change="typeSearch"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
        prop="component_type_name"
        label="备件分类"
        width="120"
      />
      <el-table-column
        prop="spare__code"
        label="备件代码"
        min-width="60"
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
        min-width="120"
      />
      <el-table-column
        prop="specification"
        label="规格型号"
        width="90"
      />
      <el-table-column
        prop="technical_params"
        label="用途"
        width="90"
      />
      <el-table-column
        prop="single_price"
        label="单价"
        width="70"
      />
      <el-table-column
        prop="quantity"
        label="在库数量"
        width="70"
      >
        <!-- <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogShow(scope.row)"
          >{{ scope.row.quantity }}</el-link>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="total_price"
        label="总金额"
        width="80"
      />
      <el-table-column
        prop="unit"
        label="标准单位"
        width="80"
      />
      <el-table-column
        prop="lower_stock"
        label="库存下限"
        width="70"
      />
      <el-table-column
        prop="upper_stock"
        label="库存上限"
        width="70"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-alert style="color:black" title="表格背景色说明：正常库存白色，低库存预警橙色，高库存预警黄色。" type="success" />
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
          <el-input v-model="currentInfo.spare_name" :disabled="true" style="width:400px" />
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
        >
          <el-input
            v-model="creatOrder.equip_component_type_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="关键部位"
        >
          <el-input
            v-model="creatOrder.key_parts_flag_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="备件代码"
        >
          <el-input
            v-model="creatOrder.spare_code"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="库存下限"
        >
          <el-input
            v-model="creatOrder.lower_stock"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="备件名称"
        >
          <el-input
            v-model="creatOrder.spare_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="库存上限"
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
        >
          <el-input
            v-model="creatOrder.specification"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="计划价格(元)"
        >
          <el-input
            v-model="creatOrder.cost"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="用途"
        >
          <el-input
            v-model="creatOrder.technical_params"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="材质"
        >
          <el-input
            v-model="creatOrder.texture_material"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="标准单位"
        >
          <el-input
            v-model="creatOrder.unit"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item
          label="有限期(天)"
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

  </div>
</template>

<script>
import page from '@/components/page'
import { exportExcel, setDate } from '@/utils/index'
import { inventoryAlarm, equipSpareErp } from '@/api/jqy'
export default {
  name: 'InventoryQuery',
  components: { page },
  data() {
    return {
      search: {
        alarm_type: '2,3',
        page: 1,
        page_size: 10
      },
      alarm_type: [2, 3],
      tableData: [],
      options: [{ value: 1, label: '正常库存' }, { value: 2, label: '低库存预警' }, { value: 3, label: '高库存预警' }],
      tableDataView: [],
      total: 0,
      loadingView: false,
      quantity: null,
      dialogVisible: false,
      dialogVisible1: false,
      submit: false,
      creatOrder: {},
      currentInfo: {},
      btnExportLoad: false
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
        const data = await inventoryAlarm('get', null, { params: obj })
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
      if (row.quantity < row.lower_stock) {
        return 'warning-row'
      }
      if (row.quantity > row.upper_stock) {
        return 'max-warning-row'
      }
      return ''
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    typeSearch() {
      if (this.alarm_type.length === 0) {
        this.search.alarm_type = null
      } else {
        this.search.alarm_type = this.alarm_type.join(',')
      }
      this.search.page = 1
      this.getList()
    },
    debounceSearch() {
      this.$debounce(this, 'changeSearch')
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = inventoryAlarm
      _api('get', null, { params: obj, responseType: 'blob' })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = `备件库存预警${setDate('', true)}.xlsx` // 下载的文件名
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
    // async dialogShow(row) {
    //   this.currentInfo = row
    //   this.dialogVisible = true
    //   this.getInventoryList()
    // },
    // async getInventoryList() {
    //   const row = this.currentInfo
    //   try {
    //     const data = await inventoryAlarm('get', null, { params: { detail: 1, equip_spare: row.equip_spare, equip_warehouse_location: row.equip_warehouse_location__id }})
    //     this.tableDataView = data.results || []
    //   } catch (e) {
    //     //
    //   }
    // },
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
.inventory-warn{
  .el-table .warning-row {
    background: orange;
  }
  .el-table .max-warning-row {
    background: yellow;
  }
}

</style>
