<template>
  <div class="parts-define">
    <!-- 设备部件定义 -->
    <el-form :inline="true" class="search-form-style">
      <el-form-item label="所属主设备种类">
        <el-select v-model="formInline.region" clearable placeholder="所属主设备种类">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属设备部位">
        <el-select v-model="formInline.region" clearable placeholder="所属设备部位">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部件分类">
        <el-select v-model="formInline.region" clearable placeholder="部件分类">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部件名称">
        <el-input v-model="formInline.user" clearable placeholder="部件名称" />
      </el-form-item>
      <el-form-item label="是否已绑定备件">
        <el-select v-model="formInline.region" clearable>
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="formInline.region" clearable placeholder="是否启用">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="onSubmit">导出Excel</el-button>
        <el-button type="primary" @click="onSubmit">导入Excel</el-button>
        <el-button type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="date"
        label="所属主设备种类"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="所属设备部位"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="部件分类"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="部件代码"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="部件名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="是否已绑定备件(Y/N)"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="是否启用"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="录入者"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="录入时间"
        min-width="20"
      />
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showSpareDialog(scope.row)"
          >绑定备件</el-button>
          <el-button
            size="mini"
            @click="showEditDialog(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="handleDelete(scope.row)"
          >{{ scope.row.used_flag?'停用':'启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="formInline.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${dialogForm.id?'编辑':'新建'}设备部件定义`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
      >
        <el-form-item
          label="所属主设备种类"
          prop="name"
        >
          <el-select v-model="dialogForm.value" placeholder="请选择">
            <el-option
              v-for="item in []"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属主设备部位"
          prop="name"
        >
          <el-select v-model="dialogForm.value" placeholder="请选择">
            <el-option
              v-for="item in []"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="部件分类"
          prop="name"
        >
          <el-select v-model="dialogForm.value" placeholder="请选择">
            <el-option
              v-for="item in []"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="部件代码"
          prop="name"
        >
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item
          label="部件名称"
          prop="name"
        >
          <el-input v-model="dialogForm.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="`绑定设备部件与备件的对应关系`"
      :visible.sync="dialogVisible1"
      width="90%"
      :before-close="handleClose1"
    >
      <el-form inline>
        <el-form-item
          label="所属设备部位"
        >
          <el-input v-model="dialogForm1.name" disabled />
        </el-form-item>
        <el-form-item
          label="部件分类"
        >
          <el-input v-model="dialogForm1.name" disabled />
        </el-form-item>
        <el-form-item
          label="部件代码"
        >
          <el-input v-model="dialogForm1.name" disabled />
        </el-form-item>
        <el-form-item
          label="部件名称"
        >
          <el-input v-model="dialogForm1.name" disabled />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="addDialogForm1"
          >添加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading1"
        :data="tableData1"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="date"
          label="备件分类"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="备件编码"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="备件名称"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="经销商名称"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="是否全新"
          min-width="20"
        />
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="delSpareDialog(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading1" @click="submitFun1">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="`备件物料选择`"
      :visible.sync="dialogVisible2"
      width="90%"
      :before-close="handleClose2"
    >
      <el-form inline>
        <el-form-item
          label="备件分类"
        >
          <el-input v-model="dialogForm2.name" />
        </el-form-item>
        <el-form-item
          label="备件经销商"
        >
          <el-input v-model="dialogForm2.name" />
        </el-form-item>
        <el-form-item
          label="备件物料编码"
        >
          <el-input v-model="dialogForm2.name" />
        </el-form-item>
        <el-form-item
          label="备件物料名称"
        >
          <el-input v-model="dialogForm2.name" />
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="tableData2"
        style="width: 100%"
        row-key="id"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
          :selectable="()=>{return true}"
        />
        <el-table-column
          prop="date"
          label="备件分类"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="经销商名称"
          min-width="20"
        />
      </el-table>
      <page
        :old-page="false"
        :total="total2"
        :current-page="dialogForm2.page"
        @currentChange="currentChange2"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose2(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading2" @click="submitFun2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
export default {
  name: 'EquipmentMasterDataPartsDefine',
  components: { page },
  data() {
    return {
      formInline: {},
      loading: false,
      tableData: [{}],
      dialogVisible: false,
      total: 0,
      dialogForm: {},
      btnLoading: false,
      dialogForm1: {},
      dialogVisible1: false,
      loading1: false,
      btnLoading1: false,
      tableData1: [{}],
      dialogVisible2: false,
      dialogForm2: {},
      tableData2: [{}],
      total2: 0,
      btnLoading2: false,
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    // this.$debounce(this, 'getList')
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await testIndicators('get', null, { all: 1 })
        // this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getList()
    },
    currentChange2(page, pageSize) {
      this.dialogForm2.page = page
      this.dialogForm2.page_size = pageSize
    },
    onSubmit() {

    },
    showSpareDialog() {
      this.dialogVisible1 = true
    },
    addDialogForm1() {
      this.dialogVisible2 = true
      // this.$refs.multipleTable.toggleRowSelection(row)
    },
    submitFun1() {},
    submitFun2() {},
    handleSelectionChange() {},
    delSpareDialog(row) {
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteLocation(row.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '操作成功!'
        //     })
        //     this.getList()
        //   })
      })
    },
    showEditDialog() {
      this.dialogVisible = true
    },
    handleDelete: function(row) {
      var str = row.used_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteLocation(row.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '操作成功!'
        //     })
        //     this.getList()
        //   })
      })
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.createForm.resetFields()
      if (done) {
        done()
      }
    },
    handleClose1(done) {
      this.dialogVisible1 = false
      if (done) {
        done()
      }
    },
    handleClose2(done) {
      this.dialogVisible2 = false
      this.$refs.multipleTable.clearSelection()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            // const _api = this.bindingForm.id ? 'put' : 'post'
            // await equipPart(_api, this.bindingForm.id || null, { data: this.bindingForm })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.btnLoading = false
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.parts-define{
  .search-form-style{
    .el-input{
      width:140px;
    }
  }
  .el-dialog__wrapper .el-input{
    width:230px;
  }
  .el-input-number .el-input{
    width:auto;
  }
}
</style>
