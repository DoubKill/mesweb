<template>
  <div>
    <!-- 机配料包卡片补打 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="search.search_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="细料名称">
        <el-input v-model="search.spare_name" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item label="机型">
        <el-input v-model="search.spare_name" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item label="补打人">
        <el-input v-model="search.spare_name" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="primary"
          @click="showCreateDialog"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="spare_code"
        label="条码"
        min-width="20"
      />
      <el-table-column
        prop="spare_code"
        label="细料名称"
        min-width="20"
      />
      <el-table-column
        prop="spare_code"
        label="机型"
        min-width="20"
      />
      <el-table-column
        label="班次/班组"
        min-width="20"
      >
        <template slot-scope="{row}">
          {{ row.aaa }}
        </template>
      </el-table-column>
      <el-table-column
        prop="spare_code"
        label="配料车次"
        min-width="20"
      />
      <el-table-column
        prop="spare_code"
        label="补打人"
        min-width="20"
      />
      <el-table-column
        prop="spare_code"
        label="打印时间"
        min-width="20"
      />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              type="primary"
              @click="showPrintDialog(scope.row)"
            >打印</el-button>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </el-button-group>
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
      :title="`${dialogForm.id?'编辑':'新建'}机配料包卡片补打 详情`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form ref="createForm" :rules="rules" label-width="100px" :model="dialogForm">
        <el-form-item v-if="dialogForm.id" label="条码">
          <el-input v-model="dialogForm.rule_code" :disabled="true" />
        </el-form-item>
        <el-form-item label="细料名称" prop="rule_code">
          <el-input v-model="dialogForm.rule_code" />
        </el-form-item>
        <el-form-item label="机型" prop="rule_code">
          <el-input v-model="dialogForm.rule_code" />
        </el-form-item>
        <el-form-item label="班次" prop="rule_code">
          <el-input v-model="dialogForm.rule_code" />
        </el-form-item>
        <el-form-item label="班组" prop="rule_code">
          <el-input v-model="dialogForm.rule_code" />
        </el-form-item>
        <el-form-item label="配料车次" prop="rule_code">
          <el-input v-model="dialogForm.rule_code" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
export default {
  name: 'SmallMaterialWeightArtificialCard',
  components: { page },
  data() {
    return {
      search: {},
      total: 0,
      loading: false,
      tableData: [{}],
      dialogVisible: false,
      btnLoading: false,
      rules: {
        rule_code: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      dialogForm: {}
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await equipSpareErp('get', null, { params: this.search })
        // this.tableData = data.results || []
        // this.total = data.count
        // this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    debounceList() {
      this.$debounce(this, 'changeSearch')
    },
    showPrintDialog(row) {

    },
    showEditDialog(row) {
      this.dialogVisible = true
    },
    showCreateDialog() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.createForm.clearValidate()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            //
            this.handleClose(null)
          } catch (e) {
            //
          }
        }
      })
    },
    handleDelete() {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // equipBom('delete', this.selectedTag.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     })

        //     // 删除的时候 可能会出现页面问题
        //     if (this.tableData.length === 1 && this.search.page !== 1) {
        //       this.search.page = this.search.page - 1
        //     }
        //     this.getList()
        //   }).catch(e => {
        //     //
        //   })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input{
  width:250px;
}
</style>
