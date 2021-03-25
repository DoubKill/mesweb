<template>
  <div>
    <!-- 停机类型定义 -->
    <el-button
      v-permission="['equip_down_type', 'add']"
      style="margin-bottom:10px"
      @click="add"
    >新建</el-button>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        width="40"
        type="index"
      />
      <el-table-column
        prop="name"
        label="停机类型"
      />
      <el-table-column
        prop="no"
        label="停机类型编码"
      />
      <el-table-column
        prop="created_username"
        label="创建人"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['equip_down_type', 'delete']"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="searchPage"
      @currentChange="currentChange"
    />

    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="200"
      :before-close="handleClose"
    >
      <el-form
        ref="editForm"
        :rules="rules"
        :model="editForm"
        label-width="120px"
      >
        <el-form-item
          label="停机类型"
          prop="name"
        >
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item
          label="停机类型编码"
          prop="no"
        >
          <el-input v-model="editForm.no" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { equipEownType } from '@/api/base_w_two'
import page from '@/components/page'
export default {
  components: { page },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        no: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      editForm: {
        no: null,
        name: null
      },
      loadingBtn: false,
      total: 0,
      searchPage: 1,
      page_size: 10
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await equipEownType('get', null, { params: {
          page: this.searchPage, page_size: this.page_size
        }})
        this.tableData = data.results || []
        this.total = data.count
      } catch (e) {
        //
      }
    },
    currentChange(page, page_size) {
      this.searchPage = page
      this.page_size = page_size
      this.getList()
    },
    add() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$refs.editForm.clearValidate()
      this.$refs.editForm.resetFields()
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    submitBtn() {
      this.$refs.editForm.validate(async(valid) => {
        if (valid) {
          this.loadingBtn = true
          try {
            await equipEownType('post', null, { data: this.editForm })
            this.handleClose(false)
            this.$message.success('创建成功')
            this.getList()
          } catch (e) {
            //
          }
          this.loadingBtn = false
        }
      })
    },
    handleDelete: function(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipEownType('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }).catch(e => {
            this.$message.error('删除失败')
          })
      })
    }
  }
}
</script>

<style>

</style>
