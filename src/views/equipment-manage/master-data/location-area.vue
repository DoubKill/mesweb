<template>
  <div class="location-area-style">
    <!-- 设备位置区域定义 -->
    <el-container style="height:580px;">
      <el-aside width="400px" class="border-style aside-style">
        <h3>位置区域设定</h3>
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          default-expand-all
          @node-contextmenu="nodeContextmenu"
          @node-click="nodeClick"
        />
      </el-aside>
      <el-main class="border-style">
        <h3>位置区域节点 详细信息</h3>
        <el-form v-loading="loading" :inline="true" label-width="100px">
          <el-form-item label="节点编号">
            <el-input v-model="formInline.user" disabled placeholder="规则名称" />
          </el-form-item>
          <el-form-item label="巡检路线名称">
            <el-input v-model="formInline.user" clearable placeholder="规则名称" />
          </el-form-item>
          <el-form-item label="区域编号">
            <el-input v-model="formInline.user" clearable placeholder="规则名称" />
          </el-form-item>
          <el-form-item label="区域名称">
            <el-input v-model="formInline.user" clearable placeholder="规则名称" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
          <br>
          <el-form-item label="区域备注说明">
            <el-input
              v-model="formInline.textarea2"
              type="textarea"
              maxlength="30"
              style="width:500px"
              :autosize="{ minRows: 10}"
              resize="none"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="addNodeFun(1)">添加子节点</li>
      <li @click="addNodeFun(2)">上方添加节点</li>
      <li @click="addNodeFun(3)">下方添加节点</li>
      <li @click="copyNodeFun">复制节点</li>
      <li @click="pasteNodeFun">粘贴子节点</li>
      <li @click="upperPasteNodeFun">上方粘贴节点</li>
      <li @click="belowPasteNodeFun">下方粘贴节点</li>
      <li @click="delNodeFun">删除节点</li>
    </ul>
    <el-dialog
      title="输入节点名"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-input v-model="dialogForm.input" placeholder="请输入内容" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EquipmentMasterDataLocation',
  data() {
    return {
      data: [{
        id: 1,
        label: '炼胶分厂',
        children: [{
          id: 6,
          label: '密炼车间',
          children: [{
            id: 2,
            label: 'Z01密炼机',
            children: [{
              id: 4,
              label: '密炼机上辅机'
            }, {
              id: 5,
              label: '密炼主机'
            }]
          }, {
            id: 10,
            label: 'Z02密炼机'
          }]
        }]
      }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      left: '',
      top: '',
      visible: false,
      selectedTag: '',
      formInline: {},
      loading: false,
      dialogVisible: false,
      dialogForm: {},
      btnLoading: false
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
  methods: {
    nodeContextmenu(e, tag, node, event) {
      // console.log(e, tag, node, event, 888)
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
    },
    closeMenu() {
      this.visible = false
    },
    handleClose(done) {
      this.dialogVisible = false
      this.dialogForm.input = ''
      if (done) {
        done()
      }
    },
    submitFun() {},
    nodeClick() {
      this.closeMenu()
      this.loading = true
      this.loading = false
    },
    addNodeFun() {
      this.dialogVisible = true
    },
    upperAddNodeFun() {},
    belowAddNodeFun() {},
    copyNodeFun() {},
    pasteNodeFun() {},
    upperPasteNodeFun() {},
    belowPasteNodeFun() {},
    delNodeFun() {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // propertyTypeNode('delete', data.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     })
        //     this.handleClose(false)
        //   }).catch(e => {
        //     this.$message.error('删除失败')
        //   })
      })
    },
    onSubmit() {}
  }
}
</script>

<style lang="scss" scoped>
.location-area-style{
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
