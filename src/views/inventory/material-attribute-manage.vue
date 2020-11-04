<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="物料类型">
        <el-select />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input />
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="物料类型" align="center" prop="" />
      <el-table-column label="物料编码" align="center" prop="material_code" />
      <el-table-column label="物料名称" align="center" prop="" />
      <el-table-column label="有效期" align="center" prop="" />
      <el-table-column label="安全库存标准" align="center" prop="" />
      <el-table-column label="有效期单位" align="center" prop="" />
      <el-table-column label="条码管理" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showBarCodeManageDialog(scope.row)"
            >管理</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showAttributeEditDialog(scope.row)"
            >编辑</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    /> -->
    <el-dialog
      title="条码管理"
      :visible.sync="barCodeManageDialogVisible"
    >
      <el-form :inline="true">
        <el-form-item style="float: right">
          <el-button
            @click="showBarCodeCreateDialog"
          >新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="barCodeData"
        border
        fit
        style="width: 100%"
      >
        <el-table-column label="No" type="index" align="center" />
        <el-table-column label="物料类型" align="center" prop="" />
        <el-table-column label="物料编码" align="center" prop="material_code" />
        <el-table-column label="物料名称" align="center" prop="" />
        <el-table-column label="条码" align="center" prop="bar_code" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                type="danger"
                @click="handleData(scope.row)"
              >删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="barCodeManageDialogVisible = false">关闭</el-button>
        <!-- <el-button
          type="primary"
          @click="handleCreateGlobalCode"
        >确 定</el-button> -->
      </div>
    </el-dialog>
    <el-dialog
      title="编辑物料属性"
      :visible.sync="attributeEditDialogVisible"
    >
      <el-form label-width="100px">
        <el-form-item
          label="物料类型"
        >
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item
          label="物料编码"
        >
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item
          label="物料名称"
        >
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item
          label="有效期"
        >
          <el-input />
        </el-form-item>
        <el-form-item
          label="安全库存标准"
        >
          <el-input />
        </el-form-item>
        <el-form-item
          label="有效期单位"
        >
          <el-input />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="attributeEditDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleaAttributeEdit"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增物料条码"
      :visible.sync="barCodeCreateDialogVisible"
    >
      <el-form label-width="80px">
        <el-form-item
          label="物料类型"
        >
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item
          label="物料编码"
        >
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item
          label="物料名称"
        >
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item
          label="条码"
        >
          <el-input />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="barCodeCreateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleBarCodeCreate"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import page from '@/components/page'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tableData: [{ 'material_code': 'FM-C102-02' }],
      barCodeData: [{ 'material_code': 'FM-C102-02',
        'bar_code': '123125327647821' }],
      barCodeManageDialogVisible: false,
      barCodeCreateDialogVisible: false,
      attributeEditDialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
  },
  methods: {
    showBarCodeManageDialog(row) {
      this.barCodeManageDialogVisible = true
    },
    showBarCodeCreateDialog(row) {
      this.barCodeCreateDialogVisible = true
    },
    showAttributeEditDialog(row) {
      this.attributeEditDialogVisible = true
    },
    handleData(row) {
      this.$confirm('此操作将永久删除' + row.material_code + '条码：' + row.bar_code + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteDataPoints(row.id)
        // .then(response => {
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   })
        //   this.handleTestTypesCurrentRowChange(this.testTypesCurrentRow)
        // }).catch(error => {
        //   this.$message.error(error)
        // })
      })
    }
  }
}

</script>
