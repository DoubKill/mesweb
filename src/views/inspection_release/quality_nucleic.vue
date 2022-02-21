<template>
  <div>
    <!--原材料库 核酸检测管控 -->
    <el-form :inline="true">
      <el-form-item label="物料名称">
        <el-input v-model="search.material_name" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="search.material_no" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="中策物料编码">
        <el-input v-model="search.zc_material_no" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="批次号">
        <el-input v-model="search.batch_no" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="核酸状态">
        <el-select v-model="search.locked_status" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="(item,i) in ['已解锁','已锁定']"
            :key="i"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-permission="['wms_hs_management', 'add']"
          type="primary"
          @click="showDialog"
        >添加物料</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.locked_status==='已锁定'"
            v-permission="['wms_hs_management','operate']"
            size="mini"
            type="primary"
            :loading="submit&&scope.row.id===loadId"
            :disabled="submit"
            @click="qualified(scope.row,'解锁')"
          >核酸解锁</el-button>
          <el-button
            v-if="scope.row.locked_status==='已解锁'"
            v-permission="['wms_hs_management','operate']"
            size="mini"
            type="danger"
            :loading="submit&&scope.row.id===loadId"
            :disabled="submit"
            @click="qualified(scope.row,'锁定')"
          >核酸锁定</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="material_name"
        label="物料名称"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ scope.row.material_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="material_no"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="zc_material_code"
        label="中策物料编码"
        min-width="20"
      />
      <el-table-column
        prop="batch_no"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="locked_status"
        label="核酸状态"
        width="100"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="原材料库存 详细列表"
      :visible.sync="dialogVisible"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="物料名称">
          <el-input
            v-model="searchView.material_name"
            disabled
          />
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input
            v-model="searchView.e_material_no"
            style="width:400px"
            disabled
          />
        </el-form-item>
        <el-form-item label="中策物料编码">
          <el-input
            v-model="searchView.zc_material_code"
            disabled
          />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        max-height="500"
        border
      >
        <el-table-column
          prop="batch_no"
          label="批次号"
          min-width="20"
        />
        <el-table-column
          prop="quality_status"
          label="品质状态"
          min-width="20"
        />
        <el-table-column
          prop="lot_no"
          label="质检条码"
          min-width="20"
        />
        <el-table-column
          prop="container_no"
          label="托盘号"
          min-width="20"
        />
        <el-table-column
          prop="location"
          label="库位号"
          min-width="20"
        />
        <el-table-column
          prop="in_storage_time"
          label="入库时间"
          min-width="20"
        />
        <el-table-column
          prop="unit"
          label="单位"
          min-width="20"
        />
        <el-table-column
          prop="qty"
          label="库存数量"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="重量/kg"
          min-width="20"
        />
      </el-table>
    </el-dialog>

    <el-dialog
      title="添加物料"
      :visible.sync="dialogVisibleInspection"
      width="90%"
    >
      <inspection
        :show="dialogVisibleInspection"
        @fatherMethod="closeDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import page from '@/components/page'
import inspection from './quality_inspection_release_dialog'
import { wmsNucleinManagement, wmsStorage } from '@/api/jqy'
export default {
  name: 'QualityNucleic',
  components: { page, inspection },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      searchView: {},
      total: 0,
      loadId: '',
      submit: false,
      dialogVisible: false,
      dialogVisibleInspection: false,
      tableDataView: [],
      loadingView: false,
      tableData: [],
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await wmsNucleinManagement('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async DetailedList(row) {
      try {
        this.searchView.material_name = row.material_name
        this.searchView.e_material_no = row.material_no
        this.searchView.zc_material_code = row.zc_material_code
        this.searchView.unit = row.unit
        this.searchView.batch_no = row.batch_no
        this.searchView.quality_status = row.quality_status
        this.searchView.page_size = 1000000
        this.dialogVisible = true
        this.loadingView = true
        const data = await wmsStorage('get', null, { params: this.searchView })
        this.tableDataView = data.results
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
    },
    async qualified(row, val) {
      this.loadId = row.id
      try {
        var message = null
        if (val === '解锁') {
          message = '此操作将解锁（取消）对应批次物料的核酸锁定状态，以便可以根据质检状态出库，是否继续？'
        } else {
          message = '此操作将锁定（设定）对应批次物料的核酸锁定状态，该批次物料将禁止出库直至解锁，是否继续？'
        }
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submit = true
          if (val === '解锁') {
            row.locked_status = '已解锁'
          } else {
            row.locked_status = '已锁定'
          }
          wmsNucleinManagement('put', row.id, { data: row })
            .then(response => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.submit = false
              this.getList()
            })
            .catch(response => {
              this.submit = false
            })
        })
      } catch (e) {
        //
      }
    },
    showDialog() {
      this.dialogVisibleInspection = true
    },
    closeDialog() {
      this.dialogVisibleInspection = false
      this.getList()
    },
    debounceFun() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
