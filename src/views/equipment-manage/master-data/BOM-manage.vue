<template>
  <div class="BOM-manage-style">
    <!-- 设备BOM管理 -->
    <el-container v-if="!isShowList" style="min-height:75vh;">
      <el-aside width="400px" class="border-style aside-style">
        <h3>位置区域设定
          <!-- <el-button style="float:right;margin-right:10px" size="mini" type="primary" @click="showList">列表显示</el-button> -->
        </h3>
        <el-tree
          ref="tree"
          v-loading="loadingTree"
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
          <el-button style="float:right;margin-right:10px" type="primary" :loading="infoBtnLoading" @click="onSubmit">保存</el-button>
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
            <el-button
              size="mini"
              style="margin-left:10px"
              type="primary"
              :disabled="!formInline.component"
              @click="showSpareDialog({id:formInline.component,equip_part_name:formInline.part_name,
                                       component_code:formInline.component_code,equip_component_type_name:formInline.component_type,component_name:formInline.component_name})"
            >绑定备件</el-button>
          </el-form-item><br>
          <!-- <el-form-item label="设备部件状态">
            <el-input v-model="formInline.user" disabled />
          </el-form-item><br> -->

          <el-form-item label="区域编号">
            <el-input v-model="formInline.equip_area_code" style="width:150px" disabled />
            <el-input v-model="formInline.equip_area_name" disabled>
              <el-button slot="append" :disabled="!formInline.equip_no" icon="el-icon-search" @click="showLocation(false)" />
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
          <el-select v-model="companyName" placeholder="备件分类" @change="getTreeList">
            <el-option
              v-for="item in ['中策橡胶(安吉)有限公司']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分厂">
          <el-input v-model="search.factory_id" clearable @input="getDebounceFactory" />
        </el-form-item>
        <el-form-item label="设备类型">
          <equipTypeSelect @equipTypeSelect="equipTypeSelectList" />
        </el-form-item>
        <el-form-item label="设备机台">
          <equipSelect :equip-type="''" :equip_no_props.sync="search.equip_no" :is-obj="true" @changeSearch="equipChangedList" />
        </el-form-item>
        <el-form-item label="设备部位:">
          <el-input v-model="search.part_name" clearable @input="getDebounceTreeList" />
        </el-form-item>
        <el-form-item label="设备部件:">
          <el-input v-model="search.component_name" clearable @input="getDebounceTreeList" />
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="showList">树状显示</el-button>
          <!-- <el-button type="primary" @click="onSubmit">导入Excel</el-button>
          <el-button type="primary" @click="onSubmit">导入Excel</el-button> -->
        </el-form-item>
      </el-form>
      <el-table
        ref="currentRow"
        :data="tableData"
        border
      >
        <el-table-column
          prop="factory_id"
          label="分厂"
          min-width="20"
        />
        <el-table-column
          prop="property_type_node"
          label="设备类型"
          min-width="20"
        />
        <el-table-column
          prop="equip_no"
          label="设备机台编号"
          min-width="20"
        />
        <el-table-column
          prop="equip_name"
          label="设备机台名称"
          min-width="20"
        />
        <el-table-column
          prop="equip_type"
          label="设备机台规格"
          min-width="20"
        />
        <el-table-column
          prop="equip_status"
          label="设备机台状态"
          min-width="20"
        />
        <el-table-column
          prop="part_code"
          label="设备部位编号"
          min-width="20"
        />
        <el-table-column
          prop="part_name"
          label="设备部位"
          min-width="20"
        />
        <el-table-column
          prop="component_code"
          label="设备部件编号"
          min-width="20"
        />
        <el-table-column
          prop="component_name"
          label="设备部件"
          min-width="20"
        />
        <!-- <el-table-column
          prop="depot_name"
          label="设备备件规格"
          min-width="20"
        /> -->
        <el-table-column
          prop="part_status"
          label="设备备件状态"
          min-width="20"
        />
        <!-- ///// -->
        <el-table-column
          prop="depot_name"
          label="备件绑定信息"
          min-width="20"
        />
        <el-table-column
          prop="equip_area_code"
          label="区域编号"
          min-width="20"
        >
          <template slot-scope="{row}">
            <i style="font-size:20px" class="el-icon-zoom-in" @click="showLocation(true,row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="equip_area_name"
          label="区域名称"
          min-width="20"
        />
        <el-table-column
          prop="depot_name"
          label="保养标准"
          min-width="20"
        >
          <!-- <template slot-scope="{row}">
            <i style="font-size:20px" class="el-icon-zoom-in" />
          </template> -->
        </el-table-column>
        <el-table-column
          prop="depot_name"
          label="维修标准"
          min-width="20"
        >
          <!-- <template slot-scope="{row}">
            <i style="font-size:20px" class="el-icon-zoom-in" />
          </template> -->
        </el-table-column>
        <el-table-column
          prop="depot_name"
          label="点检标准"
          min-width="20"
        >
          <!-- <template slot-scope="{row}">
            <i style="font-size:20px" class="el-icon-zoom-in" />
          </template> -->
        </el-table-column>
        <el-table-column
          prop="depot_name"
          label="润滑标准"
          min-width="20"
        >
          <!-- <template slot-scope="{row}">
            <i style="font-size:20px" class="el-icon-zoom-in" />
          </template> -->
        </el-table-column>
        <el-table-column
          prop="depot_name"
          label="计量标定标准"
          min-width="20"
        >
          <!-- <template slot-scope="{row}">
            <i style="font-size:20px" class="el-icon-zoom-in" />
          </template> -->
        </el-table-column>
        <el-table-column
          prop="created_username"
          label="录入者"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
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
      title="加入子节点信息"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-form ref="dialogFormAdd" :model="dialogFormAdd" :inline="true" label-width="100px" :rules="rules">
        <el-form-item v-if="!selectedTag.level" label="分厂名称" prop="factory_id">
          <el-input v-model="dialogFormAdd.factory_id" />
        </el-form-item>
        <el-form-item v-if="selectedTag.level===1" label="设备类型" prop="factory_id">
          <equipTypeSelect ref="equipTypeSelect" :default-val="dialogFormAdd.equip_property_type_id" :is-created="true" @equipTypeSelect="equipTypeSelect" />
        </el-form-item>
        <el-form-item v-if="selectedTag.level===2" label="机台编号" prop="factory_id">
          <equipSelect :equip-type="selectedTag.factory_id" :equip_no_props.sync="equip_no" :is-obj="true" @changeSearch="equipChanged" />
        </el-form-item>
        <el-form-item v-if="selectedTag.level===2" label="机台名称">
          <el-input v-model="dialogFormAdd.factory_id" disabled />
        </el-form-item>
        <el-form-item v-if="selectedTag.level===3" label="部位编号" prop="factory_id">
          <el-input v-model="partNum" disabled>
            <el-button slot="append" icon="el-icon-search" @click="dialogVisiblePart =true" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="selectedTag.level===3" label="部位名称">
          <el-input v-model="dialogFormAdd.factory_id" disabled />
        </el-form-item>
        <el-form-item v-if="selectedTag.level===4" label="部件编号" prop="factory_id">
          <el-input v-model="partCNum" disabled>
            <el-button slot="append" icon="el-icon-search" @click="dialogVisiblePartsc =true" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="selectedTag.level===4" label="部件名称">
          <el-input v-model="dialogFormAdd.factory_id" disabled />
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
    <el-dialog
      :title="`区域编号选择`"
      :visible.sync="dialogVisibleLocation"
      width="90%"
      :before-close="handleCloseLocation"
    >
      <locationArea ref="locationAreaRef" :area-name="currentObj.equip_area_name" :area-code="currentObj.equip_area_code" :is-dialog-view="isDialogView" :is-dialog="true" :show-dialog="dialogVisibleLocation" />
      <span v-if="!isDialogView" slot="footer" class="dialog-footer">
        <el-button @click="handleCloseLocation(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoadingLocation" @click="submitFunLocation">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`设备BOM节点-部位选择`"
      :visible.sync="dialogVisiblePart"
      width="90%"
    >
      <regionList ref="regionList" :equip-type="selectedTag.equip_category_id" :is-multiple="dialogVisiblePart" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePart = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoadingPart" @click="submitFunPart">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`设备BOM节点-部件选择`"
      :visible.sync="dialogVisiblePartsc"
      width="90%"
    >
      <partsDefine ref="partList" :equip-type="{category_no:selectedTag.equip_category_id,equip_part_name:selectedTag.equip_part_id}" :is-multiple="dialogVisiblePartsc" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePartsc=false">取 消</el-button>
        <el-button type="primary" :loading="btnLoadingPartsc" @click="submitFunPartsc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import equipTypeSelect from '../components/equip-type-select'
import page from '@/components/page'
import { equipPartNew, equipComponent } from '@/api/jqy'
import { equipBom } from '@/api/base_w_four'
import PartsDefineMixin from '../components/parts-define-mixin'
import locationArea from './location-area.vue'
import equipSelect from '@/components/select_w/equip.vue'
import regionList from './region'
import partsDefine from './parts-define'
export default {
  name: 'EquipmentMasterDataBOMManage',
  components: { page, locationArea, equipTypeSelect, equipSelect, regionList, partsDefine },
  mixins: [PartsDefineMixin],
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
      search: {},
      rules: {
        factory_id: [{ required: true, message: '不能为空', trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!this.dialogFormAdd.factory_id && !value) {
              callback(new Error('不能为空'))
            } else {
              callback()
            }
          } }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      dialogVisibleLocation: false,
      btnLoadingLocation: false,
      loadingTree: false,
      infoBtnLoading: false,
      equip_no: '',
      partNum: '',
      partCNum: '',
      dialogVisiblePart: false,
      btnLoadingPart: false,
      dialogVisiblePartsc: false,
      btnLoadingPartsc: false,
      pasteData: null,
      faData: '',
      companyName: '中策橡胶(安吉)有限公司',
      isDialogView: false,
      currentObj: {}
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
    this.getTreeList()
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
    async getTreeList() {
      try {
        const data = await equipBom('get', null, { params: this.search })
        this.tableData = data || []
      } catch (e) {
        //
      }
    },
    equipTypeSelectList(obj) {
      delete this.search.level
      this.search.property_type_node = obj ? obj.global_name : ''
      this.getTreeList()
    },
    equipChangedList(obj) {
      delete this.search.level
      this.search.equip_name = obj ? obj.equip_name : ''
      this.getTreeList()
    },
    getDebounceFactory() {
      this.search.level = 1
      this.$debounce(this, 'getTreeList')
    },
    getDebounceTreeList() {
      this.$debounce(this, 'getTreeList')
    },
    async getInfo() {
      try {
        this.loadingTree = true
        const data = await equipBom('get', this.nodeId)
        Object.assign(this.formInline, data || {})
        this.formInline = Object.assign({}, this.formInline)
        this.loadingTree = false
      } catch (e) {
        this.formInline = {}
        this.loadingTree = false
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
    equipTypeSelect(row) {
      this.dialogFormAdd.factory_id = row ? row.global_name : ''
      this.dialogFormAdd.curr_label_obj_id = row ? row.id : ''
    },
    equipChanged(obj) {
      this.dialogFormAdd.factory_id = obj ? obj.equip_name : ''
      this.dialogFormAdd.curr_label_obj_id = obj ? obj.id : ''
      this.dialogFormAdd.equip_category_id = obj ? obj.category : ''
      this.equip_no = obj ? obj.equip_no : ''
    },
    showLocation(bool, row) {
      if (bool) {
        if (!row.equip_area_name) {
          this.$message('暂无可查询区域')
          return
        }
        this.currentObj = row
        this.isDialogView = true
      } else {
        this.isDialogView = false
      }
      this.dialogVisibleLocation = true
    },
    handleCloseLocation(done) {
      this.dialogVisibleLocation = false
      if (done) {
        done()
      }
    },
    async submitFunLocation() {
      if (this.$refs.locationAreaRef) {
        if (!this.$refs.locationAreaRef.handleData) {
          this.$message.info('请单击选择区域编号')
          return
        }
        this.handleCloseLocation(false)
        const a = this.$refs.locationAreaRef.handleData
        this.formInline.equip_area_define = a.id
        this.formInline.equip_area_code = a.area_code
        this.formInline.equip_area_name = a.area_name
      }
    },
    submitFunPart() {
      if (this.$refs.regionList) {
        if (!this.$refs.regionList.multipleSelection) {
          this.$message.info('请单击选择部位')
          return
        }
        this.dialogVisiblePart = false
        const a = this.$refs.regionList.multipleSelection
        this.dialogFormAdd.curr_label_obj_id = a.id
        this.partNum = a.part_code
        this.dialogFormAdd.factory_id = a.part_name
      }
    },
    submitFunPartsc() {
      if (this.$refs.partList) {
        if (!this.$refs.partList.multipleSelection1) {
          this.$message.info('请单击选择部件')
          return
        }
        this.dialogVisiblePartsc = false
        const a = this.$refs.partList.multipleSelection1
        this.dialogFormAdd.curr_label_obj_id = a.id
        this.partCNum = a.component_code
        this.dialogFormAdd.factory_id = a.component_name
      }
    },
    changeList() {},
    nodeContextmenu(e, tag, node, event) {
      // console.log(node, 888)
      const a = document.documentElement.scrollTop || document.body.scrollTop
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

      this.top = e.clientY + a - 150
      this.visible = true
      this.selectedTag = tag
      this.faData = node.parent ? node.parent.data : ''
    },
    closeMenu() {
      this.visible = false
    },
    handleClose(done) {
      this.dialogVisible = false
      this.dialogFormAdd = {}
      if (this.$refs.equipTypeSelect) {
        this.$refs.equipTypeSelect.className = undefined
      }
      this.$refs.dialogFormAdd.clearValidate()
      // this.equip_no = ''
      // this.partNum = ''
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.dialogFormAdd.validate(async(valid) => {
        if (valid) {
          try {
            if (this.dialogFormAdd.level === 3 && (this.pasteData.equip_category_id !== this.dialogFormAdd.equip_category_id)) {
              this.$message('机台的机型不一致，不能粘贴')
              return
            }

            this.dialogFormAdd.level = this.selectedTag.level + 1
            this.dialogFormAdd.parent_flag = this.selectedTag.id
            this.dialogFormAdd.handle = !!this.dialogFormAdd.id

            this.treePost()
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    },
    async treePost() {
      try {
        this.btnLoading = true
        await equipBom('post', null, { data: this.dialogFormAdd })
        this.btnLoading = false
        this.$message.success('操作成功')
        this.handleClose(null)
        this.getTree()
      } catch (e) {
        this.btnLoading = false
      }
    },
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
      if (this.selectedTag.level !== 5) {
        this.equip_no = ''
        this.partNum = ''
        this.partCNum = ''
        this.dialogVisible = true
      } else {
        this.$message('不能再添加子节点')
      }
    },
    upperAddNodeFun() {},
    belowAddNodeFun() {},
    copyNodeFun() {
      this.$message.success('复制成功')
      this.equip_no = this.selectedTag.equip_info_name
      this.partNum = this.selectedTag.equip_part_code
      this.partCNum = this.selectedTag.equip_component_code
      const a = this.selectedTag.level === 2 ? this.selectedTag.equip_property_type_id
        : this.selectedTag.level === 3 ? this.selectedTag.equip_info_id
          : this.selectedTag.level === 4 ? this.selectedTag.equip_part_id
            : this.selectedTag.level === 5 ? this.selectedTag.equip_component_id : ''
      this.pasteData = {
        factory_id: this.selectedTag.factory_id,
        id: this.selectedTag.id,
        level: this.selectedTag.level,
        parent_flag: this.faData ? this.faData.id : '',
        current_flag_id: this.selectedTag.id,
        curr_label_obj_id: a,
        children: this.selectedTag.children,
        faName: this.faData.factory_id,
        // 设备类型id
        equip_property_type_id: this.selectedTag.equip_property_type_id,
        // 机型id
        equip_category_id: this.selectedTag.equip_category_id,
        // 部位id
        equip_part_id: this.selectedTag.equip_part_id,
        equip_component_id: this.selectedTag.equip_component_id
      }
    },
    async pasteNodeFun() {
      if (!this.pasteData) {
        this.$message('暂无可粘贴数据')
        return
      }
      if (this.selectedTag.level + 1 !== this.pasteData.level) {
        this.$message('只能同级粘贴')
        return
      }
      this.dialogFormAdd = JSON.parse(JSON.stringify(this.pasteData))

      if (this.dialogFormAdd.level === 2 && (this.selectedTag.factory_id === this.dialogFormAdd.faName)) {
        this.$message('不能粘贴设备类型')
        return
      }
      if (this.dialogFormAdd.level === 3) {
        if (this.dialogFormAdd.equip_property_type_id !== this.selectedTag.equip_property_type_id) {
          this.$message('该设备类型，没有此机台')
          return
        }
      }
      console.log(this.dialogFormAdd, 3333)
      console.log(this.selectedTag, 4444)
      if (this.dialogFormAdd.level === 4 && (this.selectedTag.equip_category_id !== this.dialogFormAdd.equip_category_id)) {
        this.$message('机台的机型不一致，不能粘贴')
        return
      }
      if (this.dialogFormAdd.level === 5) {
        try {
          const { results } = await equipComponent('get', null, { params: { all: 1, equip_part: this.selectedTag.equip_part_id }})
          let arr1 = []
          if (results.length > 0) {
            arr1 = results.filter(d => d.id === this.dialogFormAdd.equip_component_id)
          }
          if (results.length === 0 || arr1.length === 0) {
            this.$message('该部位没有此部件，不可复制')
            return
          }
        } catch (e) {
          return
        }
      }
      this.dialogVisible = true
    },
    upperPasteNodeFun() {},
    belowPasteNodeFun() {},
    delNodeFun() {
      if (this.selectedTag.id === 1) {
        this.$message('公司不能删除')
        return
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipBom('delete', this.selectedTag.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTree()
          }).catch(e => {
            //
          })
      })
    },
    async onSubmit() {
      try {
        if (!this.formInline.id) {
          this.$message('暂无可保存内容')
          return
        }
        this.infoBtnLoading = true
        await equipBom('put', this.formInline.id, { data: this.formInline })
        this.$message.success('保存成功')
        this.infoBtnLoading = false
      } catch (e) {
        this.infoBtnLoading = false
      }
    },
    showList() {
      this.isShowList = !this.isShowList
    }
  }
}
</script>

<style lang="scss" scoped>
.BOM-manage-style{
  .el-icon-zoom-in{
    cursor: pointer;
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
  .el-container{
    // position: relative;
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
