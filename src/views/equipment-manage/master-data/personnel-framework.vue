<template>
  <div class="personnel-framework">
    <!-- 人员组织架构 -->
    <el-container style="height:75vh;">
      <el-aside width="400px" class="border-style aside-style">
        <h3>部门管理</h3>
        <el-tree
          ref="tree"
          class="filter-tree"
          :highlight-current="true"
          :data="data"
          default-expand-all
          :props="defaultProps"
          :expand-on-click-node="false"
          node-key="id"
          @node-contextmenu="nodeContextmenu"
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main v-loading="loading" class="border-style">
        <h3>人员</h3>
        <el-form :inline="true" label-width="100px">
          <el-form-item label="部门名称">
            <el-input v-model="formInline.label" disabled clearable />
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="formInline.in_charge_username" disabled clearable />
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          border
        >
          <el-table-column
            prop="id"
            label="序号"
            min-width="20"
          />
          <el-table-column
            prop="username"
            label="名字"
            min-width="20"
          />
        </el-table>
        <page
          :old-page="false"
          :total="total"
          :current-page="formInline.page"
          @currentChange="currentChange"
        />
      </el-main>
    </el-container>

    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="delNodeFun">删除节点</li>
      <li @click="setNodeFun(true)">修改节点</li>
      <li @click="setNodeFun(false)">添加子节点</li>
    </ul>

    <el-dialog
      title="操作信息"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-form ref="dialogForm" :model="dialogForm" :inline="true" label-width="100px" :rules="rules">
        <el-form-item label="部门编号" prop="section_id">
          <el-input v-model="dialogForm.section_id" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="dialogForm.in_charge_user" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
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
import { sectionTree } from '@/api/base_w_four'
import { personnelsUrl } from '@/api/user'
export default {
  name: 'EquipmentMasterDataPersonnelFramework',
  components: { page },
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: false,
      left: '',
      top: '',
      visible: false,
      selectedTag: '',
      selectedTagParent: '',
      formInline: {},
      tableData: [],
      total: 0,
      dialogVisible: false,
      dialogForm: {},
      btnLoading: false,
      userList: [],
      rules: {
        section_id: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    this.getTree()
    this.getUserList(true)
  },
  methods: {
    async getTree() {
      try {
        const data = await sectionTree('get')
        this.data = data.results || []

        if (this.dialogForm.id && (this.formInline.id === this.dialogForm.id)) {
          this.$nextTick(d => {
            this.$refs.tree.setCurrentKey(this.dialogForm.id)
            this.formInline = this.$refs.tree.getCurrentNode()
          })
        } else {
          this.$nextTick(d => {
            this.$refs.tree.setCurrentKey(this.formInline.id)
          })
        }
      } catch (e) {
        //
      }
    },
    handleNodeClick(row) {
      this.closeMenu()
      this.formInline = row
      this.getUserList()
    },
    async getUserList(bool) {
      try {
        let obj = { section_id: this.formInline.id, is_active: 1 }
        if (bool) {
          obj = { all: 1, is_active: 1 }
        }
        this.loading = true
        const data = await personnelsUrl('get', null, { params: obj })
        if (bool) {
          this.userList = data.results || []
        } else {
          this.tableData = data.results || []
          this.total = data.count
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handleClose(done) {
      this.dialogVisible = false
      this.dialogForm = {}
      this.$refs.dialogForm.clearValidate()
      if (done) {
        done()
      }
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getUserList()
    },
    nodeContextmenu(e, tag, node, event) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 40 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY - 200
      this.visible = true
      this.selectedTag = tag
      this.selectedTagParent = node.parent.data
    },
    closeMenu() {
      this.visible = false
    },
    delNodeFun() {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sectionTree('delete', this.selectedTag.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTree()
            if (this.selectedTag.id && (this.formInline.id === this.selectedTag.id)) {
              this.formInline = {}
              this.tableData = []
              this.total = 0
            }
          }).catch(e => {
            this.$message.error('删除失败')
          })
      })
    },
    setNodeFun(bool) {
      this.dialogVisible = true
      if (bool) {
        this.dialogForm = {
          section_id: this.selectedTag.section_id,
          name: this.selectedTag.label,
          in_charge_user: this.selectedTag.in_charge_user_id,
          id: this.selectedTag.id
        }
      } else {
        this.dialogForm = {}
      }
    },
    submitFun() {
      this.$refs.dialogForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            if (!this.dialogForm.id) {
              this.dialogForm.parent_section = this.selectedTag.id || null
            }
            await sectionTree(_api, this.dialogForm.id || null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.getTree()
            this.btnLoading = false
            this.dialogVisible = false
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

<style lang="scss" scoped>
.personnel-framework{

  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-thumb {
      background: #eee
  }
  .el-main{
    padding:0;
  }
  .border-style{
    border:1px solid #eee;
    padding-left:10px;
  }
  .aside-style{
    // padding: 20px;
    margin-right:10px;
  }
  .el-input{
    width:250px;
  }
   .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}

</style>
