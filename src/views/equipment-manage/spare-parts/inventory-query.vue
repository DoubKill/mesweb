<template>
  <div class="inventory-query">
    <!-- 备件库存查询 -->
    <el-form :inline="true">
      <el-form-item label="备件分类">
        <el-input
          v-model="search.equip_component_type"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件代码">
        <el-input
          v-model="search.spare_code"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件名称">
        <el-input
          v-model="search.spare_name"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input
          v-model="search.specification"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
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
        label="技术参数"
        min-width="20"
      />
      <el-table-column
        prop="all_qty"
        label="总数量"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogShow(scope.row,1)"
          >{{ scope.row.all_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="use_qty"
        label="可用数量"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogShow(scope.row,2)"
          >{{ scope.row.use_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="lock_qty"
        label="锁定数量"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogShow(scope.row,3)"
          >{{ scope.row.lock_qty }}</el-link>
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
      <!-- <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="dialog(scope.row)"
          >编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
          >删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="备件分类">
          <el-input v-model="currentInfo.component_type_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="currentInfo.spare_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="currentInfo.specification" :disabled="true" />
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        v-loading="loadingView"
        :data="tableDataView"
        border
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40"
          :reserve-selection="true"
        />
        <el-table-column
          prop="spare_code"
          label="备件条码"
          min-width="20"
        />
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
          prop="one_piece"
          label="单件"
          min-width="20"
        />
        <el-table-column
          prop="lock"
          label="状态"
          min-width="20"
          :formatter="D=>{
            return D.lock?'已锁定':'未锁定'
          }"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :disabled="loadingBtn"
          @click="generateFun('del')"
        >删除</el-button>
        <el-button
          type="primary"
          :disabled="loadingBtn"
          @click="generateFun('lock')"
        >锁定</el-button>
        <el-button
          type="primary"
          :disabled="loadingBtn"
          @click="generateFun('unlock')"
        >解锁</el-button>
        <el-button
          type="primary"
          :disabled="loadingBtn"
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
          label="技术参数"
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
  </div>
</template>

<script>
import page from '@/components/page'
import { equipWarehouseInventory, equipSpareErp } from '@/api/jqy'
export default {
  name: 'InventoryQuery',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      multipleSelection: [],
      tableData: [],
      tableDataView: [],
      total: 0,
      checkList: [],
      loadingView: false,
      dialogVisible: false,
      dialogVisible1: false,
      submit: false,
      creatOrder: {},
      currentInfo: {},
      num: null,
      loadingBtn: false,
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
      if (row.upper_stock !== null && row.lower_stock !== null) {
        if (row.all_qty < row.lower_stock || row.all_qty > row.upper_stock) {
          return 'warning-row'
        }
      }
      return ''
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
    async dialogShow(row, num) {
      this.num = num
      this.currentInfo = row
      this.dialogVisible = true
      this.multipleSelection = []
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection()
      }
      this.getInventoryList()
    },
    async getInventoryList() {
      const row = this.currentInfo
      try {
        let obj = {
          all_qty: 1,
          equip_spare: row.equip_spare
        }
        if (this.num === 2) {
          obj = {
            equip_spare: row.equip_spare,
            use_qty: 1
          }
        } else if (this.num === 3) {
          obj = {
            equip_spare: row.equip_spare,
            lock_qty: 1
          }
        }

        const data = await equipWarehouseInventory('get', null, { params: obj })
        this.tableDataView = data || []
      } catch (e) {
        //
      }
    },
    async generateFun(status) {
      if (this.multipleSelection.length === 0) {
        this.$message('请选择备件')
        return
      }
      const arr = []
      this.multipleSelection.forEach(d => {
        arr.push(d.id)
      })
      try {
        this.loadingBtn = true
        await equipWarehouseInventory('post', null, { data: { status: status, id: arr }})
        this.$message.success('操作成功')
        this.getInventoryList()
        this.getList()
        this.loadingBtn = false
        this.multipleSelection = []
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection()
        }
      } catch (e) {
        this.loadingBtn = false
      }
    },
    dialog1(row) {
      this.currentInfo = row
      this.dialogVisible1 = true
      this.getErpInfo()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
