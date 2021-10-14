<template>
  <div class="BOM-manage-style">
    <!-- 设备BOM管理 -->
    <el-container v-if="!isShowList" style="min-height:75vh;">
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
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-contextmenu="nodeContextmenu"
          @node-click="nodeClick"
        />
      </el-aside>
      <el-main class="border-style">
        <h3>设备BOM机台节点 详细信息
          <el-button style="float:right;margin-right:10px" type="primary" @click="onSubmit">保存</el-button>
        </h3>
        <el-form v-loading="loading" :inline="true" label-width="100px">
          <el-form-item label="分厂">
            <el-input v-model="formInline.factoryName" disabled />
          </el-form-item>
          <el-form-item label="设备类型">
            <el-input v-model="formInline.property_type_node" disabled /><br>
            <!-- <equipTypeSelect :default-val="formInline.equip_type" :is-created="true" @equipTypeSelect="equipTypeSelect" /> -->
          </el-form-item><br>
          <el-form-item label="设备机台编号">
            <el-input v-model="formInline.equip_no" disabled />
          </el-form-item>
          <el-form-item label="设备机台名称">
            <el-input v-model="formInline.equip_name" disabled />
          </el-form-item><br>
          <el-form-item label="设备机台状态">
            <el-input v-model="formInline.equip_status" disabled />
          </el-form-item>
          <el-form-item label="设备机台规格">
            <el-input v-model="formInline.equip_type" disabled />
          </el-form-item><br>

          <el-form-item label="设备部位编号">
            <el-input v-model="formInline.part_code" disabled />
          </el-form-item>
          <el-form-item label="设备部位名称">
            <el-input v-model="formInline.part_name" disabled />
          </el-form-item><br>

          <el-form-item label="设备部件编号">
            <el-input v-model="formInline.component_code" disabled />
          </el-form-item>
          <el-form-item label="设备部件名称">
            <el-input v-model="formInline.component_name" disabled />
          </el-form-item>
          <el-form-item label="设备部件规格">
            <el-input v-model="formInline.component_type" disabled />
          </el-form-item>
          <el-form-item label="设备部件状态">
            <el-input v-model="formInline.user" disabled />
            <el-button size="mini" style="margin-left:10px" type="primary" @click="showSpareDialog(formInline.component)">绑定备件</el-button>
          </el-form-item><br>

          <el-form-item label="区域编号">
            <el-input v-model="formInline.equip_area_code" style="width:150px" disabled />
            <el-input v-model="formInline.equip_area_name" disabled>
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="">
            <el-checkbox v-model="formInline.checked" style="margin-left:5px;width:120px">是否巡检</el-checkbox>
          </el-form-item>
          <el-form-item label="巡检标准">
            <el-input v-model="formInline.user" disabled>
              <el-button slot="append" icon="el-icon-search" />
            </el-input><br>
          </el-form-item>
          <el-input
            v-model="formInline.textarea2"
            type="textarea"
            maxlength="30"
            style="width:500px;margin-bottom: 22px;"
            :autosize="{ minRows: 5}"
            resize="none"
            placeholder="巡检描述"
          />
          <br>
          <el-form-item label="">
            <el-checkbox v-model="formInline.checked" style="margin-left:5px;width:120px">是否维修</el-checkbox>
          </el-form-item>
          <el-form-item label="维修标准">
            <el-input v-model="formInline.user" disabled>
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="">
            <el-checkbox v-model="formInline.checked" style="margin-left:5px;width:120px">是否保养</el-checkbox>
          </el-form-item>
          <el-form-item label="保养标准">
            <el-input v-model="formInline.user" disabled>
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="">
            <el-checkbox v-model="formInline.checked" style="margin-left:5px;width:120px">是否润滑</el-checkbox>
          </el-form-item>
          <el-form-item label="润滑标准">
            <el-input v-model="formInline.user" disabled>
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="">
            <el-checkbox v-model="formInline.checked" style="margin-left:5px;width:120px">是否计量标定</el-checkbox>
          </el-form-item>
          <el-form-item label="标定标准">
            <el-input v-model="formInline.user" disabled>
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </el-form-item>
          <!-- <br>
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
          </el-form-item> -->
        </el-form>
      </el-main>
    </el-container>
    <div v-if="isShowList">
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
          <el-button type="primary" @click="showList">树状显示</el-button>
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
      <!-- <li @click="addNodeFun(2)">上方添加节点</li>
      <li @click="addNodeFun(3)">下方添加节点</li> -->
      <li @click="copyNodeFun">复制节点</li>
      <li @click="pasteNodeFun">粘贴子节点</li>
      <!-- <li @click="upperPasteNodeFun">上方粘贴节点</li>
      <li @click="belowPasteNodeFun">下方粘贴节点</li> -->
      <li @click="delNodeFun">删除节点</li>
    </ul>
    <el-dialog
      title="输入节点名信息"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-form ref="dialogFormAdd" :model="dialogFormAdd" :inline="true" label-width="100px" :rules="rules">
        <el-form-item label="部门编号" prop="section_id">
          <el-input v-model="dialogFormAdd.section_id" :disabled="dialogFormAdd.id?true:false" />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="dialogFormAdd.name" />
        </el-form-item>
        <el-form-item label="负责人">
          <!-- <el-select v-model="dialogFormAdd.in_charge_user" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select> -->
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
          <el-input v-model="dialogForm1.equip_part_name" disabled />
        </el-form-item>
        <el-form-item
          label="部件分类"
        >
          <el-input v-model="dialogForm1.equip_component_type_name" disabled />
        </el-form-item>
        <el-form-item
          label="部件代码"
        >
          <el-input v-model="dialogForm1.component_code" disabled />
        </el-form-item>
        <el-form-item
          label="部件名称"
        >
          <el-input v-model="dialogForm1.component_name" disabled />
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
          prop="equip_component_type_name"
          label="备件分类"
          min-width="20"
        />
        <el-table-column
          prop="spare_code"
          label="备件编码"
          min-width="20"
        />
        <el-table-column
          prop="spare_name"
          label="备件名称"
          min-width="20"
        />
        <el-table-column
          prop="supplier_name"
          label="供应商名称"
          min-width="20"
        />
        <el-table-column
          prop="reuse_flag"
          label="是否全新"
          min-width="20"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.reuse_flag===true">是</span>
            <span v-if="scope.row.reuse_flag===false">否</span>
          </template>
        </el-table-column>
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
          <el-input v-model="dialogForm2.equip_component_type" disabled />
        </el-form-item>
        <el-form-item
          label="备件供应商"
        >
          <el-input v-model="dialogForm2.supplier_name" @input="addDialogForm1" />
        </el-form-item>
        <el-form-item
          label="备件物料编码"
        >
          <el-input v-model="dialogForm2.spare_code" @input="addDialogForm1" />
        </el-form-item>
        <el-form-item
          label="备件物料名称"
        >
          <el-input v-model="dialogForm2.spare_name" @input="addDialogForm1" />
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
          prop="equip_component_type_name"
          label="备件分类"
          min-width="20"
        />
        <el-table-column
          prop="spare_code"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="spare_name"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="supplier_name"
          label="供应商名称"
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
        <el-button type="primary" @click="submitFun2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import equipTypeSelect from '../components/equip-type-select'
import { equipPartNew } from '@/api/jqy'
import { equipBom } from '@/api/base_w_four'
import PartsDefineMixin from '../components/parts-define-mixin'
export default {
  name: 'EquipmentMasterDataBOMManage',
  mixins: [PartsDefineMixin],
  // components: { equipTypeSelect },
  data() {
    return {
      data: [],
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'factory_id'
      },
      left: '',
      top: '',
      visible: false,
      selectedTag: '',
      formInline: {},
      loading: false,
      dialogVisible: false,
      dialogForm: {},
      btnLoading: false,
      levelNum: null,
      isShowList: false,
      nodeId: null,
      dialogFormAdd: {},
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
  },
  methods: {
    async getTree() {
      try {
        const data = await equipBom('get', null, { params: { tree: 1 }})
        this.data = data.results || []
      } catch (e) {
        //
      }
    },
    async getInfo() {
      try {
        const data = await equipBom('get', this.nodeId)
        Object.assign(this.formInline, data || {})
        this.formInline = Object.assign({}, this.formInline)
      } catch (e) {
        this.formInline = {}
      }
    },
    async  getEquipPart() {
      try {
        this.loading = true
        const data = await equipPartNew('get', null, { params: this.formInline })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
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
    equipTypeSelect(val) {},
    handleClose(done) {
      this.dialogVisible = false
      this.dialogForm.input = ''
      if (done) {
        done()
      }
    },
    submitFun() {},
    nodeClick(row, node) {
      function a(node) {
        if (node.data.level === 1) {
          return node.data.factory_id
        }
        return a(node.parent)
      }

      this.closeMenu()
      this.nodeId = row.id
      this.$set(this.formInline, 'factoryName', a(node))
      this.getInfo()
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
    showList() {
      this.isShowList = !this.isShowList
    }
  }
}
</script>

<style lang="scss" scoped>
.BOM-manage-style{
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
