<template>
  <div>
    <!-- ERP原材料信息 -->
    <el-form :inline="true">
      <el-form-item label="原材料类别">
        <MaterialTypeSelect
          v-model="search.material_type_id"
          :is-material="true"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="原材料编码">
        <materialCodeSelect
          :is-all-obj="true"
          :default-val="search.material_no"
          :obj-params="{exclude_stage:1}"
          @changeSelect="changeMaterialCode"
        />
      </el-form-item>
      <el-form-item label="原材料名称">
        <materialCodeSelect
          :is-all-obj="true"
          :default-val="search.material_name"
          label-name="material_name"
          :obj-params="{exclude_stage:1}"
          @changeSelect="changeMaterialCode"
        />
      </el-form-item>
      <!-- <el-form-item label="原材料简称">
        <el-select
          v-model="search.for_short"
          clearable
          filterable
          @change="changeList"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="物料编码">
        <el-select
          v-model="search.erp_material_no"
          clearable
          filterable
          remote
          reserve-keyword
          :remote-method="remoteMethodNo"
          :loading="loading_erp_material"
          @change="changeList"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.material_no"
            :value="item.material_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料名称">
        <el-select
          v-model="search.erp_material_name"
          clearable
          filterable
          remote
          reserve-keyword
          :remote-method="remoteMethodName"
          :loading="loading_erp_material"
          @change="changeList"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.material_name"
            :value="item.material_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="ERP物料绑定">
        <el-select
          v-model="search.is_binding"
          clearable
          filterable
          @change="changeList"
        >
          <el-option
            v-for="(item,key) in [{name:'Y'},{name:'N'}]"
            :key="key"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button
      v-permission="['material_map','add']"
      style="margin-bottom:8px;float:right"
      type="primary"
      @click="addFun"
    >新增</el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        width="40"
        type="index"
      />
      <el-table-column
        prop="material_type_name"
        label="原材料类型"
        min-width="20"
      />
      <el-table-column
        prop="material_no"
        label="原材料编码"
        min-width="20"
      />
      <el-table-column
        prop="material_name"
        label="原材料名称"
        min-width="20"
      />
      <el-table-column
        prop="for_short"
        label="原材料简称"
        min-width="20"
      />
      <el-table-column
        prop="is_binding"
        label="ERP物料绑定（Y/N)"
        min-width="20"
      />
      <el-table-column
        prop="package_unit_name"
        label="包装单位"
        min-width="20"
      />
      <el-table-column
        prop="use_flag"
        label="是否使用"
        min-width="20"
        :formatter="(row, column) => {
          return row.use_flag?'是':'否'
        }"
      />
      <el-table-column
        prop="created_username"
        label="创建人员"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
        min-width="20"
      />
      <el-table-column
        prop="update_user_name"
        label="更新人员"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="140"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['material_map','change']"
              size="mini"
              @click="editFun(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-permission="['material_map','delete']"
              size="mini"
              type="danger"
              plain
              @click="handleMaterialDelete(scope.row)"
            >{{ scope.row.use_flag ? '停用' : '启用' }}
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
      :title="'ERP原材料'+(objForm.id?'编辑':'新增')"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-form ref="objForm" :model="objForm" :inline="true" :rules="rules">
        <el-form-item label="原材料编码" prop="material_no">
          <el-autocomplete
            v-model="objForm.material_no"
            :fetch-suggestions="querySearchAsyncNo"
            placeholder="请输入原材料编码"
            :disabled="objForm.id?true:false"
            value-key="material_no"
            @select="changeMaterialNo('material_no')"
          />
        </el-form-item>
        <el-form-item label="原材料名称" prop="material_name">
          <el-autocomplete
            v-model="objForm.material_name"
            :fetch-suggestions="querySearchAsyncName"
            placeholder="请输入原材料名称"
            value-key="material_name"
            @select="changeMaterialNo('material_name')"
          />
        </el-form-item>
        <el-form-item label="原材料简称">
          <el-input v-model="objForm.for_short" />
        </el-form-item>
        <el-form-item label="原材料类别" prop="material_type">
          <MaterialTypeSelect
            v-model="objForm.material_type"
            :is-created="true"
            :is-material="true"
            :is-disabled="objForm.id?true:false"
          />
        </el-form-item>
        <el-form-item label="是否使用">
          <el-select
            v-model="objForm.use_flag"
            filterable
          >
            <el-option
              v-for="(item,key) in [{name:'是',label:true},{name:'否',label:false}]"
              :key="key"
              :label="item.name"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="包装单位">
          <el-select
            v-model="objForm.package_unit"
            filterable
          >
            <el-option
              v-for="(item,key1) in optionsUnitList"
              :key="key1"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button
        style="margin-bottom:8px;float:right;"
        type="primary"
        @click="addFun1"
      >新增</el-button>
      <el-table
        ref="multipleTable"
        v-loading="loading2"
        border
        :data="tableData1"
      >
        <el-table-column
          label="选择"
          align="center"
          width="50px"
        >
          <template slot-scope="{row}">
            <el-checkbox v-model="row.use_flag" />
          </template>
        </el-table-column>
        <el-table-column
          label="物料编码"
          align="center"
          prop="material_no"
        />
        <el-table-column
          label="物料名称"
          align="center"
          prop="material_name"
        />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleMaterialDelete1(scope.row,scope.$index)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="searchSubimt">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="ERP物料选择"
      :visible.sync="dialogVisible1"
      width="60%"
      :before-close="handleClose1"
    >
      <el-form :inline="true">
        <el-form-item label="物料编码" prop="type">
          <el-input
            v-model="search1.material_no"
            clearable
            @input="changeDebounce1"
          />
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input
            v-model="search1.material_name"
            clearable
            @input="changeDebounce1"
          />
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable1"
        v-loading="loading1"
        border
        :data="tableData2"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange1"
      >
        <el-table-column
          type="selection"
          width="40"
          :reserve-selection="true"
        />
        <el-table-column
          label="物料编码"
          align="center"
          prop="material_no"
        />
        <el-table-column
          label="物料名称"
          align="center"
          prop="material_name"
        />
      </el-table>
      <page
        :old-page="false"
        :total="total1"
        :current-page="search1.page"
        @currentChange="currentChange1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button type="primary" @click="searchSubimt1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MaterialTypeSelect from '@/components/MaterialTypeSelect'
import Page from '@/components/page'
import { erpMaterials } from '@/api/base_w_four'
import materialCodeSelect from '@/components/materialCodeSelect'
import { zcMaterials, userOperationLog } from '@/api/base_w_two'
import { classesListUrl } from '@/api/base_w'
import { debounce } from '@/utils'
import { materialsUrl } from '@/api/base_w'
import Cookies from 'js-cookie'
let timer
export default {
  name: 'ERPMaterialInfo',
  components: { MaterialTypeSelect, Page, materialCodeSelect },
  data() {
    return {
      search: {},
      tableData: [],
      tableData1: [],
      options: [],
      options1: [],
      dialogVisible: false,
      objForm: {
        use_flag: true,
        material_no: ''
      },
      total: 0,
      total1: 0,
      defalutVal: null,
      rules: {
        material_no: [
          { required: true, message: '请填写原材料编码', trigger: 'blur' }
        ],
        material_name: [
          { required: true, message: '请填写原材料名称', trigger: 'blur' }
        ],
        material_type: [
          { required: true, message: '请选择原材料类别', trigger: 'change' }
        ]
      },
      search1: {},
      dialogVisible1: false,
      tableData2: [],
      optionsUnitList: [],
      handleSelectionList: [],
      loading1: false,
      btnLoading: false,
      loading2: false,
      optionsMaterials: [],
      loading_erp_material: false
    }
  },
  created() {
    this.getMaterials()
    this.getList()
    this.getGlobalCodes()
    // this.getZcMaterialsList(false)
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await erpMaterials('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getZcMaterialsList(bool, objParams = {}) {
      try {
        let obj = { all: 1, is_binding: 'Y' }
        Object.assign(obj, objParams)
        if (bool) {
          obj = this.search1
        }
        this.loading1 = true
        const data = await zcMaterials('get', null, { params: obj })
        this.loading1 = false
        if (bool) {
          this.tableData2 = data.results || []
          this.total1 = data.count
          this.$refs.multipleTable1.clearSelection()
          if (this.tableData1.length > 0) {
            this.tableData1.forEach(row => {
              this.$refs.multipleTable1.toggleRowSelection(row)
            })
          }
          return
        }
        this.options = data.results || []
        this.loading_erp_material = false
      } catch (e) {
        this.loading1 = false
        this.loading_erp_material = false
      }
    },
    async getGlobalCodes() {
      try {
        const data = await classesListUrl('get', null, { params: { class_name: '包装单位' }})
        this.optionsUnitList = data.results || []
      } catch (e) {
        //
      }
    },
    async getMaterials() {
      const data = await materialsUrl('get', null, { params: { all: 1, exclude_stage: 1 }})
      this.optionsMaterials = data.results || []
    },
    querySearchAsyncNo(queryString, cb) {
      var restaurants = this.optionsMaterials
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString, 'material_no')) : restaurants

      cb(results)
    },
    createStateFilter(queryString, val) {
      return (state) => {
        return (state[val].toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
    },
    querySearchAsyncName(queryString, cb) {
      var restaurants = this.optionsMaterials
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString, 'material_name')) : restaurants

      cb(results)
    },
    async changeMaterialNo(material) {
      if (this.objForm.id) {
        return
      }
      const obj = this.optionsMaterials.find(d => d[material] === this.objForm[material])
      this.$set(this.objForm, 'material_name', obj.material_name)
      this.$set(this.objForm, 'material_no', obj.material_no)
      this.$set(this.objForm, 'material_type', obj.material_type)
      this.$set(this.objForm, 'material_type', obj.material_type)
      this.$set(this.objForm, 'package_unit', obj.package_unit)
      this.$set(this.objForm, 'use_flag', obj.use_flag)
      this.$set(this.objForm, 'for_short', obj.for_short)
    },
    remoteMethodName(query) {
      if (query !== '') {
        clearTimeout(timer)
        this.loading_erp_material = true
        timer = setTimeout(() => {
          this.getZcMaterialsList(false, { material_name: query })
        }, 2000)
      } else {
        this.options = []
      }
    },
    remoteMethodNo(query) {
      if (query !== '') {
        clearTimeout(timer)
        this.loading_erp_material = true
        timer = setTimeout(() => {
          this.getZcMaterialsList(false, { material_no: query })
        }, 2000)
      } else {
        this.options = []
      }
    },
    changeList() {
      if (!this.search.is_binding) {
        delete this.search.is_binding
      }
      this.search.page = 1
      this.getList()
    },
    changeMaterialName(val) {
      this.search.material_name = val ? val.material_name : ''
      this.changeList()
    },
    changeMaterialCode(obj) {
      this.$set(this.search, 'material_name', obj ? obj.material_name : '')
      this.$set(this.search, 'material_no', obj ? obj.material_no : '')
      this.changeList()
    },
    materialCodeCurrent(obj) {
      this.$set(this.search, 'material_name', obj ? obj.material_name : '')
      this.$set(this.search, 'material_no', obj ? obj.material_no : '')
      this.changeList()
    },
    async getErpMaterialsInfo(row) {
      try {
        this.loading2 = true
        const data = await erpMaterials('get', row.id)
        this.loading2 = false
        this.tableData1 = data.zc_materials || []
        this.objForm = JSON.parse(JSON.stringify(data))
      } catch (e) {
        this.loading2 = false
      }
    },
    editFun(row) {
      this.dialogVisible = true
      this.getErpMaterialsInfo(row)
    },
    addFun() {
      this.dialogVisible = true
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    currentChange1(page, page_size) {
      this.search1.page = page
      this.search1.page_size = page_size
      this.getZcMaterialsList(true)
    },
    handleSelectionChange(arr) {
      this.handleSelection = arr
    },
    addFun1() {
      this.dialogVisible1 = true
      // if (this.$refs.multipleTable1) {
      //   this.$refs.multipleTable1.clearSelection()
      // }
      this.getZcMaterialsList(true)
    },
    searchSubimt() {
      this.$refs.objForm.validate(async(valid) => {
        if (valid) {
          try {
            if (this.tableData1.length === 0) {
              this.$message.info('请添加物料')
              return
            }
            const arr = []
            this.tableData1.forEach(d => {
              arr.push({ zc_material: d.id, use_flag: d.use_flag })
            })
            this.objForm.erp_material_data = arr
            this.btnLoading = true
            const _api = this.objForm.id ? 'put' : 'post'
            if (this.objForm.id) {
              userOperationLog('post', null, { data: { 'operator': Cookies.get('name'), 'menu_name': 'ERP原材料信息', 'operations': '变更：' + this.objForm.material_name }})
            }
            await erpMaterials(_api, this.objForm.id || null, { data: this.objForm })
            this.$message.success('操作成功')
            this.handleClose(false)
            this.btnLoading = false
            this.getList()
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    },
    changeDebounce1() {
      this.search1.page = 1
      debounce(this, 'getChangeDebounce1')
    },
    getChangeDebounce1() {
      this.getZcMaterialsList(true)
    },
    handleClose(done) {
      this.$refs.multipleTable.clearSelection()
      this.dialogVisible = false
      this.objForm = { use_flag: true }
      this.search1 = {}
      this.$refs.objForm.resetFields()
      this.tableData1 = []
      if (done) {
        done()
      }
    },
    handleClose1(done) {
      if (this.$refs.multipleTable1) {
        this.$refs.multipleTable1.clearSelection()
      }
      this.dialogVisible1 = false
      this.search1 = {}
      if (done) {
        done()
      }
    },
    searchSubimt1() {
      if (this.handleSelectionList.length === 0) {
        this.$message.info('未选择ERP物料选择')
        return
      }
      this.tableData1 = []
      this.handleSelectionList.forEach(d => {
        this.tableData1.push({ material_no: d.material_no, material_name: d.material_name,
          zc_material: d.id, use_flag: true, id: d.id })
      })
      this.dialogVisible1 = false
    },
    handleSelectionChange1(arr) {
      this.handleSelectionList = JSON.parse(JSON.stringify(arr))
    },
    handleMaterialDelete1(row, index) {
      this.$confirm('确定删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData1.splice(index, 1)
      }).catch(() => {

      })
    },
    handleMaterialDelete(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.material_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userOperationLog('post', null, { data: { 'operator': Cookies.get('name'), 'menu_name': 'ERP原材料信息', 'operations': str + '：' + row.material_name }})
        erpMaterials('delete', row.id)
          .then((response) => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          }).catch(function() {
          })
      }).catch(() => {

      })
    },
    getRowKeys(row) {
      return row.id
    }
  }
}
</script>

<style>

</style>
