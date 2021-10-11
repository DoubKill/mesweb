<template>
  <div class="BOM-manage-style">
    <!-- 设备BOM管理 -->
    <el-container style="height:75vh;">
      <el-aside width="400px" class="border-style aside-style">
        <h3>位置区域设定
          <el-button style="float:right;margin-right:10px" size="mini" type="primary" @click="showList">列表显示</el-button>
        </h3>
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
        <h3>设备BOM机台节点 详细信息</h3>
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
    <div>
      <h3>设备BOM列表</h3>
      <el-form :inline="true" class="search-form-style">
        <el-form-item label="公司">
          <el-select v-model="formInline.region" clearable placeholder="备件分类">
            <el-option
              v-for="item in ['浙江','大连']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分厂">
          <el-select v-model="formInline.region" clearable placeholder="备件分类">
            <el-option
              v-for="item in ['浙江','大连']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="formInline.region" clearable placeholder="备件分类">
            <el-option
              v-for="item in ['浙江','大连']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备机台">
          <el-select v-model="formInline.region" clearable placeholder="备件分类">
            <el-option
              v-for="item in ['浙江','大连']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备部位:">
          <el-input v-model="formInline.property_no" @input="changeList" />
        </el-form-item>
        <el-form-item label="设备部件:">
          <el-input v-model="formInline.property_no" @input="changeList" />
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="onSubmit">树状显示</el-button>
          <el-button type="primary" @click="onSubmit">导入Excel</el-button>
          <el-button type="primary" @click="onSubmit">导入Excel</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="currentRow"
        :data="tableData"
        border
      >
        <el-table-column
          prop="depot_name"
          label="节点编号"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="分厂"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="区域"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="设备类型"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="设备机台编号"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="设备机台名称"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="设备机台规格"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="设备机台状态"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="设备部位编号"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="设备部位"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="设备部件编号"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="设备部件"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="设备备件规格"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="设备备件状态"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="备件绑定信息"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="区域编号"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="区域名称"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="保养标准"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="维修标准"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="点检标准"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="润滑标准"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="计量标定标准"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="录入者"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="录入时间"
          min-width="20"
        />
      </el-table>
    </div>
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
  name: 'EquipmentMasterDataBOMManage',
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
      tableData: [],
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
    changeList() {},
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
    onSubmit() {},
    showList() {}
  }
}
</script>

<style lang="scss" scoped>
.BOM-manage-style{
  .search-form-style{
    .el-input{
      // width:140px;
    }
  }
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
