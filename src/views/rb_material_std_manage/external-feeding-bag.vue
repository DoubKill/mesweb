<template>
  <div
    v-loading="loading"
    class="newIndex"
    element-loading-text="加载中..."
  >
    <!-- 外供料包的配方 -->
    <el-form :inline="true">
      <el-form-item label="状态">
        <el-select
          v-model="search.used_type"
          style="width: 120px"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in rubberStateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input
          v-model="search.stage_product_batch_no"
          style="width: 200px"
          clearable
          @input="changeSearch"
        />
      </el-form-item>
      <!-- <el-form-item label="配方类别">
        <el-select
          v-model="search.recipe_type"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.id"
            :label="item.global_no"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="原材料名称">
        <el-select
          v-model="search.wms_material_name"
          clearable
          placeholder="请选择"
          filterable
          @change="changeSearch"
        >
          <el-option
            v-for="item in rawMaterialOptions"
            :key="item.id"
            :label="item.material_name"
            :value="item.material_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-if="checkPermission(['wfproductbatching','add'])"
          @click="newRubberClicked"
        >新建</el-button>
        <el-button
          v-if="checkPermission(['wfproductbatching','change'])"
          :disabled="![1,2,4].includes(currentRow.used_type)"
          @click="showPutRubberMaterialDialog"
        >配料</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-if="checkPermission(['wfproductbatching','add'])"
          :disabled="!currentRow.id"
          @click="copyClicked"
        >复制</el-button>
      </el-form-item>
      <!-- <el-form-item style="float: right">
        <el-button
          v-if="checkPermission(['productbatching','change'])"
          type="primary"
          @click="replacementDialog"
        >原材料替换</el-button>
      </el-form-item> -->
      <el-form-item style="float: right">
        <el-button
          v-if="checkPermission(['wfproductbatching','change'])"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      highlight-current-row
      :data="tableData"
      border
      size="mini"
      row-key="id"
      @row-click="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      /> -->
      <el-table-column
        align="center"
        type="index"
        width="40"
        label="No"
      />
      <el-table-column
        min-width="20"
        prop="stage_product_batch_no"
        label="胶料配方编码"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="showGridTable(scope.row)"
          >{{ scope.row.stage_product_batch_no }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        min-width="10"
        prop="batching_weight"
        label="配料重量"
      />
      <!-- <el-table-column
        min-width="10"
        prop="production_time_interval"
        label="炼胶时间"
      /> -->
      <el-table-column
        prop="used_type"
        label="状态"
        :formatter="usedTypeFormatter"
        width="40px"
      />
      <el-table-column
        align="center"
        width="148"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.used_type === 5 && checkPermission(['wfproductbatching','edit'])"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.used_type === 1 && checkPermission(['wfproductbatching','submit'])"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >提交</el-button>
            <el-button
              v-if="scope.row.used_type === 2 && checkPermission(['wfproductbatching','check'])"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >校对</el-button>
            <el-button
              v-if="[3,7].includes(scope.row.used_type) && checkPermission(['wfproductbatching','use'])"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >启用</el-button>
            <el-button
              v-if="(![5,4,7].includes(scope.row.used_type) && checkPermission(['wfproductbatching','refuse']))"
              size="mini"
              @click="status_recipe_fun(scope.row.id,false)"
            >驳回</el-button>
            <el-button
              v-if="checkPermission(['wfproductbatching','abandon'])&&
                [5,4,7].includes(scope.row.used_type)"
              size="mini"
              @click="status_recipe_fun(scope.row.id,false,'废弃')"
            >废弃</el-button>
            <el-button
              v-if="checkPermission(['wfproductbatching','stop'])&&
                [4].includes(scope.row.used_type)"
              size="mini"
              @click="status_recipe_fun(scope.row.id,false,'停用')"
            >停用</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="70px"
        label="发送到称量系统"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.used_type === 4 && checkPermission(['wfproductbatching','sendXl'])"
              title="请配置可用机台"
              type="primary"
              size="mini"
              @click="send_weighing(scope.row)"
            >发送</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        min-width="10"
        prop="created_username"
        label="创建者"
      />
      <el-table-column
        min-width="10"
        prop="submit_username"
        label="提交者"
      />
      <el-table-column
        min-width="10"
        prop="check_username"
        label="校对者"
      />
      <el-table-column
        min-width="10"
        prop="used_username"
        label="启用者"
      />
      <el-table-column
        min-width="10"
        prop="reject_username"
        label="驳回者"
      />
      <el-table-column
        prop="obsolete_username"
        label="废弃者"
        min-width="10"
      />
      <el-table-column
        min-width="12"
        prop="created_date"
        label="创建时间"
      />
      <el-table-column
        min-width="12"
        prop="last_updated_date"
        label="修改时间"
      />
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      :old-page="false"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${isCopy?'复制':'新建'}外发料包配方`"
      :visible.sync="dialogAddRubberMaterial"
      width="600"
      :before-close="handleCloseMaterial"
      class="add-style"
    >
      <el-form ref="rubberMaterialForm" v-loading="loadingForm" :model="rubberMaterialForm" :rules="rules" label-width="100px">
        <el-form-item
          prop="weigh_type"
        >
          <el-radio v-model="rubberMaterialForm.weigh_type" :label="2">细料包</el-radio>
          <el-radio v-model="rubberMaterialForm.weigh_type" :label="1">硫磺包</el-radio>
        </el-form-item>
        <el-form-item
          label="胶料编码"
          prop="product_info"
        >
          <el-input v-model="rubberMaterialForm.product_info" placeholder="胶料编码" @change="rubberMaterialChanged" />
        </el-form-item>
        <el-form-item label="备注" prop="precept">
          <el-input v-model="rubberMaterialForm.precept" placeholder="备注" @change="rubberMaterialChanged" />
        </el-form-item>
        <el-form-item label="胶料配方编码">
          <el-input
            v-model="rubberMaterialForm.stage_product_batch_no"
            placeholder="胶料配方编码"
            disabled
          />
        </el-form-item>
        <br>
        <el-form-item style="text-align:right">
          <el-button
            type="primary"
            @click="NewAddMaterial('rubberMaterialForm',true)"
          >配料</el-button>
          <el-button
            type="primary"
            :loading="btnLoading"
            @click="NewAddMaterial('rubberMaterialForm',false)"
          >生成</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="`称量配方发送  MES->称量系统`"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="(item,key) in dialogList"
          :key="key"
          :label="item.no"
        >{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button
          type="primary"
          :loading="loadingSendWeight"
          @click="submitSendWeight"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="`原材料替换 配方列表`"
      :visible.sync="dialogVisible1"
      width="70%"
      :before-close="handleClose1"
      class="material-replace"
    >
      <el-form ref="ruleForm" :model="userForm">
        <el-form-item label="配方物料" prop="origin_material">
          <el-input v-model="userForm.origin_material" disabled />
        </el-form-item>
        <el-form-item label="替换物料" prop="replace_material">
          <el-select v-model="userForm.replace_material" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in rawMaterialOptions"
              :key="item.id"
              :label="item.material_name"
              :value="item.material_name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" :loading="loadingBtn" @click="startReplace(false)">开始替换</el-button>
      <el-button type="primary" :disabled="loadingBtn" @click="handleClose1(false)">返回</el-button>
      <el-form style="margin-top:15px;">
        <el-form-item label="替换结果" prop="status">
          <el-select v-model="userForm.status" clearable placeholder="请选择" @change="changeStatus">
            <el-option
              v-for="item in ['成功','失败']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData1"
        border
        size="mini"
        :row-class-name="tableRowClassName1"
      >
        <el-table-column
          prop="product_no"
          min-width="30"
          label="配方编号"
        />
        <el-table-column
          prop="dev_type"
          min-width="20"
          label="机型"
        />
        <el-table-column
          prop="equip_no"
          min-width="20"
          label="机台"
        />
        <el-table-column
          prop="failed_reason"
          min-width="30"
          label="失败原因"
        />
        <el-table-column
          prop="status"
          min-width="20"
          label="状态"
        />
      </el-table>
      <page
        :total="dialogTotal"
        :current-page="dialogPage"
        :old-page="true"
        @currentChange="currentChangeDialog"
      />
      <el-alert
        style="color:black"
        title="表格背景色说明：粉色状态为失败"
        type="success"
      />
    </el-dialog>

    <el-dialog
      title="胶料配料标准"
      :visible.sync="showIngredient"
      width="90%"
      :before-close="handleCloseIngredient"
    >
      <el-form
        v-if="!loadingForm"
        :inline="true"
        :model="rubberMaterialForm"
      >
        <el-form-item label="胶料编码">
          <el-input
            v-model="rubberMaterialForm.product_info"
            :disabled="true"
            placeholder="胶料编码"
          />
        </el-form-item>
        <el-form-item label="胶料配方编码">
          <el-input
            v-model="rubberMaterialForm.stage_product_batch_no"
            :disabled="true"
            placeholder="胶料配方编码"
            style="width:300px"
          />
        </el-form-item>
        <el-form-item>
          <h1 style="margin:0;">
            已下传线体:
            <span v-if="isView&&rubberMaterialForm.send_xl_equip">{{ rubberMaterialForm.send_xl_equip }}</span>
          </h1>
        </el-form-item>
        <el-form-item
          v-if="!isView"
          style="float:right;"
        >
          <el-button @click="putNewsaveMaterialClicked">保存</el-button>
        </el-form-item>
        <div style="clear:both" />
      </el-form>
      <h3 v-if="!loadingForm">{{ Number(rubberMaterialForm.weigh_type)===2?'细料':'硫磺' }}</h3>
      <el-table
        v-loading="loadingForm"
        :data="tableDataIngredient"
        border
        show-summary
      >
        <el-table-column
          label="No"
          type="index"
          width="60"
        />
        <el-table-column
          prop="material_type"
          label="类别"
          width="80"
          column-key="material_type"
        />
        <el-table-column label="原材料">
          <template slot-scope="{row,$index}">
            <el-input
              v-model="row.material_name"
              size="mini"
              :disabled="true"
            >
              <el-button
                v-if="!isView"
                slot="append"
                icon="el-icon-search"
                @click="pop_up_raw_material($index)"
              />
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="实际重量/kg"
          prop="standard_weight"
        >
          <template slot-scope="{row,$index}">
            <el-input-number
              v-model.number="row.standard_weight"
              size="mini"
              :min="0"
              controls-position="right"
              :disabled="isView"
              @change="checkTolerance(row,$index)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="误差"
          prop="standard_error"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model.number="row.standard_error"
              size="mini"
              controls-position="right"
              :disabled="isView"
            />
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="配料"
        >
          <template slot-scope="{row}">
            <el-select
              v-model="row.master"
              clearable
              :disabled="isView"
              placeholder="请选择"
            >
              <el-option
                v-for="item1 in ['S','F']"
                :key="item1"
                :label="item1"
                :value="item1"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!isView"
          label="操作"
        >
          <template slot-scope="{$index}">
            <el-button
              size="mini"
              @click="del_raw_material_row($index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!isView" style="text-align: center">
        <el-button
          size="mini"
          @click="insert_NewPracticalWeightChanged"
        >插入一行</el-button>
      </div>
    </el-dialog>

    <materialSelection
      ref="rawMaterialSync"
      :show="dialogRawMaterialSync"
      @handleCloseMaterialSelection="handleCloseMaterialSelection"
      @handleMaterialSelect="handleMaterialSelect"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkPermission } from '@/utils'
import commonVal from '@/utils/common'
import { setDate } from '@/utils/index'
import { product_info_url, xlRecipeNotice, replaceRecipeOne, wfProductBatching } from '@/api/rubber_recipe_fun'
import page from '@/components/page'
import { globalCodesUrl, materialsUrl } from '@/api/base_w'
import materialSelection from './components/materialSelection'
import { getMaterialTolerance } from '@/api/base_w_five'

export default {
  name: 'ExternalFeedingBag',
  components: { page, materialSelection },
  data() {
    return {
      loading: false,
      search: {
        page: 1, page_size: 10
      },
      currentRow: {},
      rubberStateOptions: commonVal.rubberStateList,
      tableData: [],
      rubberMaterialForm: {},
      dialogAddRubberMaterial: false,
      materialForm: {},
      total: 0,
      // 是否是查看
      isView: false,
      // 是否是复制
      isCopy: false,
      dialogVisible: false,
      checkList: [],
      dialogList: [{ name: 'F1#细料', no: 'F01' }, { name: 'F2#细料', no: 'F02' }, { name: 'F3#细料', no: 'F03' },
        { name: 'S1#硫磺', no: 'S01' }, { name: 'S2#硫磺', no: 'S02' }],
      currentObj: {},
      loadingSendWeight: false,
      categoryOptions: [],
      rawMaterialOptions: [],
      btnExportLoad: false,
      userForm: {},
      loadingBtn: false,
      dialogVisible1: false,
      tableData1: [],
      selectionList: [],
      dialogTotal: 0,
      dialogPage: 1,
      productBatchNoOptions: [],
      rules: {
        product_info: [{ required: true, message: '请选择胶料编码', trigger: 'blur' }],
        weigh_type: [{ required: true, message: '请选择新建类型', trigger: 'change' }],
        precept: [{ required: true, message: '请选择新建类型', trigger: 'blur' }]
      },
      btnLoading: false,
      showIngredient: false,
      formInline: {},
      tableDataIngredient: [],
      dialogRawMaterialSync: false,
      currentMaterialIndex: null,
      loadingForm: false
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.rubber_material_list()
    this.getFormulaType()
    this.getRawMaterial()

    this.product_info_list()
  },
  methods: {
    checkPermission,
    refreshList() {
      this.rubber_material_list()
    },
    changeSearch() {
      this.selectionList = []
      this.$refs.multipleTable.clearSelection()
      this.search.page = 1
      this.rubber_material_list()
    },
    newRubberClicked() {
      this.isCopy = false
      this.rubberMaterialForm = {}
      this.dialogAddRubberMaterial = true
    },
    copyClicked() {
      // this.materialForm = JSON.parse(JSON.stringify(this.currentRow))
      // this.rubberMaterialForm = {}
      this.dialogAddRubberMaterial = true
      // this.isCopy = true
      this.getInfo()
    },
    async getFormulaType() {
      try {
        const data = await globalCodesUrl('get', { params: { class_name: '配方类别' }})
        this.categoryOptions = data.results
      } catch (e) {
        //
      }
    },
    async getRawMaterial() {
      try {
        const data = await materialsUrl('get', null, { params: { all: 1 }})
        this.rawMaterialOptions = data.results
      } catch (e) {
        //
      }
    },
    replacementDialog() {
      if (!this.search.wms_material_name) {
        this.$message('未设定替换用的原材料名称，不能导出相关内容')
        return
      }
      if (this.selectionList.length === 0) {
        this.$message('胶料配方未选择')
        return
      }
      this.userForm.origin_material = this.search.wms_material_name
      this.dialogVisible1 = true
    },
    changeStatus() {
      this.startReplace(true)
    },
    async startReplace(bool) { // bool=>true 是获取列表
      try {
        const type = bool ? 'get' : 'post'
        this.loadingBtn = true
        const arr = []
        this.selectionList.forEach(d => {
          arr.push(d.id)
        })
        const obj = {
          replace_ids: arr.join(','),
          origin_material: this.userForm.origin_material,
          replace_material: this.userForm.replace_material,
          status: this.userForm.status,
          page: this.dialogPage
        }
        const _obj = bool ? { params: obj } : { data: obj }
        const data = await replaceRecipeOne(type, null, _obj)
        if (bool) {
          this.dialogTotal = data.count
          this.tableData1 = data.results
        } else {
          this.startReplace(true)
        }
        this.loadingBtn = false
      } catch (e) {
        this.loadingBtn = false
      }
    },
    handleClose1(done) {
      this.rubber_material_list()
      this.selectionList = []
      this.$refs.multipleTable.clearSelection()
      this.dialogTotal = 0
      this.tableData1 = []
      this.userForm = {}
      this.dialogVisible1 = false
      if (done) {
        done()
      }
    },
    tableRowClassName1({ row, rowIndex }) {
      if (row.status === '失败') {
        return 'red-row'
      }
    },
    currentChangeDialog(page) {
      this.dialogPage = page
      this.startReplace(true)
    },
    exportTable() {
      if (!this.search.wms_material_name) {
        this.$message('未设定替换用的原材料名称，不能导出相关内容')
        return
      }
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1, wms_material_name: this.search.wms_material_name, exclude_used_type: 6 }, {})
      const _api = wfProductBatching
      _api('get', null, { params: obj, responseType: 'blob' })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = `原材料"${this.search.wms_material_name}"使用配方列表${setDate('', true)}.xlsx` // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    handleSelectionChange(arr) {
      this.selectionList = arr
    },
    showPutRubberMaterialDialog() {
      this.showIngredient = true
      this.getInfo()
    },
    async getInfo() {
      try {
        this.loadingForm = true
        const data = await wfProductBatching('get', this.currentRow.id)
        this.loadingForm = false
        const a = data.stage_product_batch_no.split('[')
        const b = a[1].split(']')
        const _modify = (this.currentRow.id && !this.dialogAddRubberMaterial) ? this.currentRow.id : ''
        this.rubberMaterialForm = {
          stage_product_batch_no: data.stage_product_batch_no, weigh_type: data.weigh_type,
          _modify: _modify,
          product_info: a[0],
          precept: b[0],
          send_xl_equip: data.send_xl_equip }
        this.tableDataIngredient = data.weight_cnt_types[0].weight_details
        if (this.tableDataIngredient.length > 0) {
          this.tableDataIngredient.forEach(d => {
            if (d.master.ZWF.indexOf('-H') > -1) {
              d.master = ''
            } else {
              d.master = d.master.ZWF
            }
          })
        }
      } catch (e) {
        this.loadingForm = false
      }
    },
    showGridTable(row) {
      this.currentRow = JSON.parse(JSON.stringify(row))
      this.isView = true
      this.showIngredient = true
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    async status_recipe_fun(id, bool, val) {
      if (val) {
        const str = val === '废弃' ? '废弃的配方将无法再启用,是否确定废弃?' : '此操作将' + val + '该配方,是否继续?'
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try {
            await wfProductBatching('patch', id, { data: { pass_flag: bool, used_or_abandon: val === '停用' ? 1 : 0 }})
            this.$message.success('状态切换成功')
            this.rubber_material_list()
          } catch (e) { throw new Error(e) }
        })
        return
      }
      try {
        await wfProductBatching('patch', id, { data: { pass_flag: bool }})
        this.$message.success('状态切换成功')
        this.rubber_material_list()
      } catch (e) { throw new Error(e) }
    },
    async rubber_material_list() {
      try {
        this.loading = true
        const data = await wfProductBatching('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
        this.currentRow.used_type = -1
        this.currentRow.id = null
        return data
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.rubber_material_list()
    },
    send_weighing(row) {
      this.currentObj = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      this.checkList = []
      if (done) {
        done()
      }
    },
    submitSendWeight() {
      try {
        if (this.checkList.length) {
          this.loadingSendWeight = true
        }
        let _i = 0
        this.checkList.forEach(async d => {
          try {
            const data = await xlRecipeNotice('post', { params: { product_batching_id: this.currentRow.id, product_no: this.currentRow.stage_product_batch_no, xl_equip: d }})
            if (data && data.notice_flag) {
              this.$confirm(`${d}:${data.msg}料罐中不存在，是否下传配方？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async() => {
                const data1 = await xlRecipeNotice('post', { params: { product_batching_id: this.currentRow.id, product_no: this.currentRow.stage_product_batch_no, xl_equip: d, notice_flag: true }})
                _i++
                this.$message.success(data1)
                if (_i === this.checkList.length) {
                  this.handleClose(false)
                  this.loadingSendWeight = false
                }
              }).catch(() => {
                this.loadingSendWeight = false
              })
            } else {
              this.$message.success(data)
              _i++
              if (_i === this.checkList.length) {
                this.handleClose(false)
                this.loadingSendWeight = false
              }
            }
          } catch (e) {
            this.loadingSendWeight = false
            throw new Error(e)
          }
        })
      } catch (e) {
        this.loadingSendWeight = false
        throw new Error(e)
      }
    },
    handleCloseMaterial(done) {
      this.dialogAddRubberMaterial = false
      this.handleCloseIngredient()
      this.isView = false
      setTimeout(s => {
        this.$refs['rubberMaterialForm'].clearValidate()
      }, 300)
      if (done) {
        done()
      }
    },
    usedTypeFormatter: function(row) {
      return this.usedTypeChoice(row.used_type)
    },
    usedTypeChoice: function(usedType) {
      switch (usedType) {
        case 1:
          return '编辑'
        case 2:
          return '提交'
        case 3:
          return '校对'
        case 4:
          return '启用'
        case 5:
          return '驳回'
        case 6:
          return '废弃'
        case 7:
          return '停用'
      }
    },
    async product_info_list() {
      try {
        const data = await product_info_url('get', {
          params: { all: 1 }
        })
        this.productBatchNoOptions = data.results
      } catch (e) { throw new Error(e) }
    },
    rubberMaterialChanged() {
      const aa = this.rubberMaterialForm.product_info ? this.rubberMaterialForm.product_info : ''
      const bb = this.rubberMaterialForm.precept ? this.rubberMaterialForm.precept : ''
      const a = aa + '[' + bb + ']'
      this.$set(this.rubberMaterialForm, 'stage_product_batch_no', a)
    },
    NewAddMaterial(formName, bool) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (bool) {
            this.handleCloseMaterial(false)
            this.showIngredient = true
          } else {
            this.rubberMaterialForm._modify = null
            this.putNewsaveMaterialClicked()
          }
        } else {
          return false
        }
      })
    },
    handleCloseIngredient(done) {
      this.tableDataIngredient = []
      this.formInline = {}
      this.showIngredient = false
      this.isView = false
      if (done) {
        done()
      }
    },
    async putNewsaveMaterialClicked() {
      try {
        const arr = JSON.parse(JSON.stringify(this.tableDataIngredient))
        if (arr.length > 0) {
          try {
            arr.forEach((D, i) => {
              if (!D.material || !D.standard_weight) {
                throw Error('原材料、实际重量')
              }
              if (i === 0 && !D.master) {
                throw Error('请选择投料方式')
              }
              if (Object.prototype.toString.call(arr[i].master) !== '[object Object]') {
                arr[i].master = { ZWF: arr[i].master || '' }
              }
              if (!arr[i].master.ZWF && i > 0) {
                if ((arr[i - 1].master.ZWF).indexOf('-H') > -1) {
                  D.master = arr[i - 1].master
                } else {
                  D.master.ZWF = arr[i - 1].master.ZWF + '-H'
                }
              }
            })
          } catch (e) {
            this.$message.info(e.message)
            return
          }
        }

        const obj = {
          stage_product_batch_no: this.rubberMaterialForm.stage_product_batch_no,
          weigh_type: this.rubberMaterialForm.weigh_type,
          weight_cnt_types: [{
            weight_details: arr || []
          }]
        }
        const _api = this.rubberMaterialForm._modify ? 'put' : 'post'
        await wfProductBatching(_api, this.rubberMaterialForm._modify || '', { data: obj })
        this.dialogAddRubberMaterial = false
        this.handleCloseIngredient(false)
        this.rubber_material_list()
      } catch (e) {
        //
      }
    },
    async checkTolerance(row, index) {
      try {
        const data = await getMaterialTolerance('get', null, {
          params: {
            material_name: row.material_name,
            standard_weight: row.standard_weight,
            only_num: true
          }
        })
        if (data) {
          this.tableDataIngredient[index].standard_error = data
        }
      } catch (e) {
        //
      }
    },
    del_raw_material_row(index, faI) {
      this.tableDataIngredient.splice(index, 1)
    },
    pop_up_raw_material(index) {
      // isIngredient true=> 细料选原材料
      // if (index || index === 0) {
      this.currentMaterialIndex = index
      //   this.faI = faI
      //   this.isIngredient = false
      // } else {
      //   this.isIngredient = true
      // }
      // this.listType = faI === 1 ? '炭黑' : faI === 2 ? '油料' : '胶料'
      // this.setCurrentMaterialList()
      this.dialogRawMaterialSync = true
    },
    insert_NewPracticalWeightChanged(i) {
      let _master = null
      if (this.tableDataIngredient.length === 0) {
        if (Number(this.rubberMaterialForm.weigh_type) === 1) {
          _master = 'S'
        } else {
          _master = 'F'
        }
      }
      this.tableDataIngredient.push({
        type: 1,
        master: _master
      })
    },
    handleCloseMaterialSelection() {
      this.dialogRawMaterialSync = false
    },
    handleMaterialSelect(row) {
      const a = this.tableDataIngredient[this.currentMaterialIndex]
      this.$set(a, 'material_name', row.material_name)
      this.$set(a, 'material', row.id)
      this.$set(a, 'material_type', row.material_type_name)
      this.dialogRawMaterialSync = false
    }
  }
}
</script>

<style lang="scss">
 .newIndex{
    .add-style .el-input{
        width: 250px;
    }
  .el-table__row:hover > td {
    background-color: transparent !important;
  }
  .el-table__body tr.current-row{
     background-color: #e3e7ec !important;
  }
  .el-table__body tr.current-row>td{
    background-color: #e3e7ec !important;
  }
  .warning-row{
    background: #b1ddf0  !important;
  }
  .material-replace .el-input{
    width:250px
  }
  .red-row {
    background: rgb(223, 164, 164);
  }
 }

</style>
