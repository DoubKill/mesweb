<template>
  <div
    v-loading="loading"
    class="newIndex"
    element-loading-text="加载中..."
  >
    <!-- 胶料配方标准管理 -->
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
      <el-form-item label="SITE">
        <SITESelect
          v-model="search.site"
          @returnBack="changeSearch"
        />
      </el-form-item>
      <el-form-item label="段次">
        <StageIdSelect
          v-model="search.stage_id"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="生产机型">
        <equip-category-select
          v-model="search.dev_type"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input
          v-model="search.stage_product_batch_no"
          style="width: 200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="发送上辅机情况">
        <el-select
          v-model="search.filter_type"
          style="width: 120px"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in [{name:'部分发送',label:1},{name:'未设定机台',label:2}]"
            :key="item.name"
            :label="item.name"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="配方类别">
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
      </el-form-item>
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
          v-if="checkPermission(['productbatching','add'])"
          @click="newRubberClicked"
        >新建</el-button>
        <el-button
          v-if="checkPermission(['productbatching','change'])"
          :disabled="![1,4].includes(currentRow.used_type)"
          @click="showPutRubberMaterialDialog"
        >配料</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-if="checkPermission(['productbatching','add'])"
          :disabled="!currentRow.id"
          @click="copyClicked"
        >复制</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-if="checkPermission(['productbatching','change'])"
          type="primary"
          @click="replacementDialog"
        >原材料替换</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-if="checkPermission(['productbatching','change'])"
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
      :row-class-name="tableRowClassName"
      @row-click="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      />
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
            @click="showGridTable(scope.row.id)"
          >{{ scope.row.stage_product_batch_no }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        min-width="10"
        prop="product_name"
        label="胶料名称"
      />
      <el-table-column
        align="center"
        prop="site_name"
        label="site"
        width="40px"
      />
      <el-table-column
        align="center"
        prop="stage_name"
        label="段次"
        width="45px"
      />
      <el-table-column
        min-width="10"
        prop="dev_type_name"
        label="炼胶机类型"
      />
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
              v-if="scope.row.used_type === 5 && permissionObj.productbatching.indexOf('abandon')>-1"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.used_type === 1 && checkPermission(['productbatching','submit'])"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >提交</el-button>
            <el-button
              v-if="scope.row.used_type === 2 && checkPermission(['productbatching','check'])"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >校对</el-button>
            <el-button
              v-if="[3,7].includes(scope.row.used_type) && checkPermission(['productbatching','use'])"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >启用</el-button>
            <el-button
              v-if="(scope.row.used_type === 2 && checkPermission(['productbatching','check'])) |
                (scope.row.used_type === 3 && checkPermission(['productbatching','use']))"
              size="mini"
              @click="status_recipe_fun(scope.row.id,false)"
            >驳回</el-button>
            <el-button
              v-if="checkPermission(['productbatching','abandon'])&&
                [5,4,7].includes(scope.row.used_type)"
              size="mini"
              @click="status_recipe_fun(scope.row.id,false,'废弃')"
            >废弃</el-button>
            <el-button
              v-if="checkPermission(['productbatching','stop'])&&
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
        label="发送到上辅机"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.used_type === 4 && checkPermission(['productbatching','send'])"
              :disabled="!scope.row.enable_equip.length"
              size="mini"
              title="请配置可用机台"
              @click="send_auxiliary(scope.row)"
            >发送</el-button>
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
              v-if="scope.row.used_type === 4 && checkPermission(['productbatching','sendXl'])"
              title="请配置可用机台"
              type="primary"
              size="mini"
              :disabled="!scope.row.enable_equip.length"
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
        min-width="10"
        prop="created_date"
        label="创建时间"
      />
      <el-table-column
        min-width="10"
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
    <createdRubberMaterial
      ref="createdRubberMaterialRef"
      :show="dialogAddRubberMaterial"
      :material-form="materialForm"
      :is-view="isView"
      :is-copy="isCopy"
      @handleCloseMaterial="handleCloseMaterial"
      @refreshList="refreshList"
    />

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
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkPermission } from '@/utils'
import commonVal from '@/utils/common'
import { getToken } from '@/utils/auth'
import { rubber_material_url, send_auxiliary_url, xlRecipeNotice, replaceRecipeOne } from '@/api/rubber_recipe_fun'
import StageIdSelect from '@/components/StageSelect/StageIdSelect'
import SITESelect from './components/SITESelect'
import createdRubberMaterial from './components/createdRubberMaterial'
import page from '@/components/page'
import EquipCategorySelect from '@/components/EquipCategorySelect'
import { globalCodesUrl, materialsUrl } from '@/api/base_w'

export default {
  name: 'RbMaterialStdManage',
  components: { page, StageIdSelect, createdRubberMaterial, SITESelect, EquipCategorySelect },
  data() {
    return {
      loading: false,
      search: {},
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
      dialogPage: 1
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
  },
  methods: {
    checkPermission,
    refreshList() {
      this.rubber_material_list()
    },
    changeSearch() {
      this.search.page = 1
      this.rubber_material_list()
    },
    newRubberClicked() {
      this.materialForm = {
        factory: '',
        site: '',
        SITE_name: '',
        stage_name: '',
        stage: '',
        product_info: '',
        product_name: '',
        versions: '',
        precept: '',
        stage_product_batch_no: '',
        production_time_interval: ''
      }
      this.isCopy = false
      this.dialogAddRubberMaterial = true
    },
    copyClicked() {
      // this.materialForm = {
      //   factory: this.currentRow.factory,
      //   site: this.currentRow.site,
      //   SITE_name: this.currentRow.site_name,
      //   stage_name: this.currentRow.stage_name,
      //   stage: this.currentRow.stage,
      //   product_info: this.currentRow.product_info,
      //   product_name: this.currentRow.product_name,
      //   versions: this.currentRow.versions,
      //   precept: this.currentRow.precept,
      //   stage_product_batch_no: this.currentRow.stage_product_batch_no,
      //   id: this.currentRow.id,
      //   dev_type: this.currentRow.dev_type,
      //   dev_type_name: this.currentRow.dev_type_name,
      //   production_time_interval: this.currentRow.production_time_interval || '',
      //   enable_equip: this.currentRow.enable_equip || [],
      //   new_recipe_id: this.currentRow.new_recipe_id || 0,
      //   send_success_equip: this.currentRow.send_success_equip || []
      // }
      this.materialForm = JSON.parse(JSON.stringify(this.currentRow))
      this.dialogAddRubberMaterial = true
      this.isCopy = true
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
      const _api = rubber_material_url
      _api('get', null, { params: obj, responseType: 'blob' })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = `原材料"${this.search.wms_material_name}"使用配方列表.xlsx` // 下载的文件名
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
      if (this.$refs.createdRubberMaterialRef) {
        this.isView = false
        this.isCopy = false
        this.$refs.createdRubberMaterialRef.objParames._clone = false
        this.$refs.createdRubberMaterialRef.directBatching(this.currentRow.id, false)
      }
    },
    showGridTable(id) {
      if (this.$refs.createdRubberMaterialRef) {
        this.isView = true
        this.isCopy = false
        this.$refs.createdRubberMaterialRef.directBatching(id, false)
      }
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
            await rubber_material_url('patch', id, { data: { pass_flag: bool, used_or_abandon: val === '停用' ? 1 : 0 }})
            this.$message.success('状态切换成功')
            this.rubber_material_list()
          } catch (e) { throw new Error(e) }
        })
        return
      }
      try {
        await rubber_material_url('patch', id, { data: { pass_flag: bool }})
        this.$message.success('状态切换成功')
        this.rubber_material_list()
      } catch (e) { throw new Error(e) }
    },
    async rubber_material_list() {
      try {
        this.loading = true
        this.search.exclude_used_type = 6
        if (this.search.used_type === 6) {
          delete this.search.exclude_used_type
        }
        const data = await rubber_material_url('get', null, { params: this.search })
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
    async send_auxiliary(row) {
      try {
        this.$confirm('是否将该配方下传给群控系统？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let data = await send_auxiliary_url('post', {
            params: {
              'product_batching_id': row.id,
              'product_no': row.stage_product_batch_no
            }
          })
          if (data.notice_flag) {
            this.$confirm('群控系统已有同名配方，继续下传会覆盖群控系统的同名配方，是否继续下传？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              data = await send_auxiliary_url('post', {
                params: {
                  'product_batching_id': row.id,
                  'product_no': row.stage_product_batch_no,
                  notice_flag: true
                }
              })
              this.$message.success(data.send_recipe_msg)
              this.rubber_material_list()
              const url = data.auxiliary_url + '#/recipe/list'

              window.open(url + '?AAA=' + getToken() +
                '&batch_no=' + row.stage_product_batch_no)
            })
            return
          }

          this.$message.success(data.send_recipe_msg)
          this.rubber_material_list()
          const url = data.auxiliary_url + '#/recipe/list'

          window.open(url + '?AAA=' + getToken() +
            '&batch_no=' + row.stage_product_batch_no)
        })
      } catch (e) {
        //
      }
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
        let _i = 0
        this.loadingSendWeight = true
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
    handleCloseMaterial() {
      this.dialogAddRubberMaterial = false
      this.materialForm = {}
      this.isView = false
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
    tableRowClassName({ row, rowIndex }) {
      if (row.used_type === 4 && (row.send_success_equip.length !== row.enable_equip.length)) {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
 .newIndex{

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
