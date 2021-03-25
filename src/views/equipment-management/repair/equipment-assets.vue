<template>
  <div>
    <!-- 设备资产 -->
    <el-form :inline="true">
      <el-form-item label="固定资产:">
        <el-input v-model="search.property_no" placeholder="请输入内容" @input="changeList" />
      </el-form-item>
      <el-form-item label="设备编码:">
        <el-input v-model="search.equip_no" placeholder="请输入内容" @input="changeList" />
      </el-form-item>
      <el-form-item label="类型:">
        <div @click="inputClick(false)">
          <el-input
            v-model="search.property_type"
            style="width:195px"
            placeholder="请选择内容"
            :readonly="true"
          >
            <i slot="suffix" style="font-size:20px" class="el-input__icon el-icon-circle-close" @click.stop="nodeClickFun(null)" />
          </el-input>
        </div>
      </el-form-item>
      <el-form-item style="float:right;">
        <div style="float:right;display:flex">
          <el-button v-permission="['property', 'download']" style="margin-right:8px" @click="templateDownload">模板下载</el-button>
          <el-upload
            style="margin-right:8px"
            action="string"
            accept=".xls, .xlsx"
            :http-request="Upload"
            :show-file-list="false"
          >
            <el-button v-permission="['property', 'import']">导入</el-button>
          </el-upload>
          <el-button v-permission="['property', 'add']" style="margin-right:8px" @click="add">新增</el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column
        label="No"
        type="index"
        width="40"
      />
      <el-table-column
        prop="property_no"
        label="固定资产"
        min-width="8"
      />
      <el-table-column
        prop="src_no"
        label="原编码"
        min-width="8"
      />
      <el-table-column
        prop="financial_no"
        label="财务编码"
        min-width="8"
      />
      <el-table-column
        prop="equip_type"
        label="设备型号"
        min-width="8"
      />
      <el-table-column
        prop="equip_no"
        label="设备编码"
        min-width="8"
      />
      <el-table-column
        prop="equip_name"
        label="设备名称"
        min-width="8"
      />
      <el-table-column
        prop="made_in"
        label="设备制造商"
        min-width="8"
      />
      <el-table-column
        prop="capacity"
        label="产能"
        min-width="8"
      />
      <el-table-column
        prop="price"
        label="价格"
        min-width="8"
      />
      <el-table-column
        prop="status_name"
        label="状态"
        min-width="8"
      />
      <el-table-column
        prop="property_type"
        label="类型"
        min-width="8"
      />
      <el-table-column
        prop="leave_factory_no"
        label="出厂编码"
        min-width="8"
      />
      <el-table-column
        prop="leave_factory_date"
        label="出厂日期"
        min-width="8"
      />
      <el-table-column
        prop="use_date"
        label="使用日期"
        min-width="8"
      />
      <el-table-column
        label="操作"
        width="130"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['property', 'change']"
              size="mini"
              @click="showEditUserDialog(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-permission="['property', 'delete']"
              size="mini"
              type="danger"
              @click="handleUserDelete(scope.row)"
            >
              删除
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
      title="类型"
      :visible.sync="dialogVisibleType"
      width="600"
    >
      <el-button
        v-if="!addBool"
        v-permission="['property_type_node', 'add']"
        type="text"
        size="mini"
        @click="() => append(false)"
      >
        添加最外层
      </el-button>
      <el-tree
        :data="options"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :props="{label:'value'}"
        @node-click="nodeClickFun"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }}</span>

          <span v-if="!addBool" style="display:inline-block;margin-left:50px">
            <el-button
              v-permission="['property_type_node', 'add']"
              type="text"
              size="mini"
              @click="() => append(data)"
            >
              添加
            </el-button>
            <div v-permission="['property_type_node', 'delete']" style="display:inline-block">
              <el-button
                v-if="!data.children||data.children.length===0"
                type="text"
                size="mini"
                @click="() => remove(node, data)"
              >
                删除
              </el-button>
            </div>
          </span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleType = false">取 消</el-button>
        <el-button type="primary" @click="searchSubimtTree">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加节点名"
      :visible.sync="dialogVisibleAdd"
      width="600"
      :before-close="handleClose"
    >
      <el-input
        v-model="currentTreeObj.name"
        @keyup.enter.native="submitAdd"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="submitAddLoading" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="formitem.id?'修改':'新增'"
      :visible.sync="dialogVisibleList"
      width="800px"
      :before-close="handleCloseList"
    >
      <el-form ref="formitem" :model="formitem" :inline="true" label-width="120px" :rules="rules">
        <el-form-item label="固定资产:" prop="property_no">
          <el-input v-model="formitem.property_no" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="原编码:" prop="src_no">
          <el-input v-model="formitem.src_no" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="财务编码:" prop="financial_no">
          <el-input v-model="formitem.financial_no" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="设备型号:" prop="equip_type">
          <el-input v-model="formitem.equip_type " placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="设备编码:" prop="equip_no">
          <el-input v-model="formitem.equip_no" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="设备名称:" prop="equip_name">
          <el-input v-model="formitem.equip_name" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="设备制造商:" prop="made_in">
          <el-input v-model="formitem.made_in" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="产能:" prop="capacity">
          <el-input v-model="formitem.capacity" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="价格:" prop="price">
          <el-input v-model="formitem.price" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="formitem.status" placeholder="请选择">
            <el-option
              v-for="item in [{id:1,name:'使用中'},{id:2,name:'废弃'},{id:3,name:'限制'}]"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型:" prop="property_type_node">
          <div @click="inputClick(true)">
            <el-input
              v-model="formitem.property_type"
              style="width:195px"
              placeholder="请选择内容"
              :readonly="true"
            />
          </div>
        </el-form-item>
        <el-form-item label="出厂编码:" prop="leave_factory_no">
          <el-input v-model="formitem.leave_factory_no" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="出厂日期:" prop="leave_factory_date">
          <el-date-picker
            v-model="formitem.leave_factory_date"
            type="date"
            placeholder="日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="使用日期:" prop="use_date">
          <el-date-picker
            v-model="formitem.use_date"
            type="date"
            placeholder="日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseList(false)">取 消</el-button>
        <el-button type="primary" :loading="submitListLoading" @click="submitAddList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { propertyTypeNode, exportProperty, importProperty, equipmentProperty } from '@/api/base_w_two'
import page from '@/components/page'
export default {
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      formitem: {
        use_date: '',
        status: null,
        leave_factory_date: null,
        property_no: '',
        src_no: '',
        financial_no: '',
        equip_type: '',
        equip_no: '',
        equip_name: ''
      },
      tableData: [],
      loading: false,
      cascaderValue: '',
      dialogVisibleType: false,
      bbbbb: '',
      options: [],
      visible: false,
      dialogVisibleAdd: false,
      currentTreeObj: {},
      currentTreeObjSearch: {},
      submitAddLoading: false,
      total: 0,
      dialogVisibleList: false,
      submitListLoading: false,
      rules: {
        property_no: [
          { required: true, message: '请填写固定资产', trigger: 'blur' }
        ],
        src_no: [
          { required: true, message: '请填写原编码', trigger: 'blur' }
        ],
        financial_no: [
          { required: true, message: '请填写财务编码', trigger: 'blur' }
        ],
        equip_type: [
          { required: true, message: '请填写设备型号', trigger: 'blur' }
        ],
        equip_no: [
          { required: true, message: '请填写设备编码', trigger: 'blur' }
        ],
        equip_name: [
          { required: true, message: '请填写设备名称', trigger: 'blur' }
        ],
        made_in: [
          { required: true, message: '请填写设备制造商', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '请填写产能', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请填写价格', trigger: 'blur' }
        ],
        leave_factory_no: [
          { required: true, message: '请填写出厂编码', trigger: 'blur' }
        ],
        leave_factory_date: [
          { required: true, message: '请选择出厂日期', trigger: 'change' }
        ],
        use_date: [
          { required: true, message: '请选择使用日期', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        property_type_node: [{ required: true, message: '不能为空',
          validator: (rule, value, callback) => {
            if (!this.formitem.property_type_node && !value) {
              callback(new Error('请选择类型'))
            } else {
              callback()
            }
          }, trigger: 'change' }]
      },
      addBool: false
    }
  },
  created() {
    this.getTypeNode()
    this.getList()
  },
  methods: {
    async getTypeNode() {
      try {
        const data = await propertyTypeNode('get')
        this.options = data || []
      } catch (e) {
        //
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipmentProperty('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    inputClick(bool) {
      this.addBool = bool
      this.dialogVisibleType = true
    },
    handleClose(done) {
      this.currentTreeObj = {}
      this.dialogVisibleAdd = false
      if (done) {
        done()
      }
    },
    async submitAdd() {
      try {
        if (!this.currentTreeObj.name) {
          this.$message.info('请输入节点名称')
          return
        }
        this.submitAddLoading = true
        await propertyTypeNode('post', null, { data: this.currentTreeObj })
        this.dialogVisibleAdd = false
        this.handleClose(false)
        this.getTypeNode()
      } catch (e) {
        //
      }
      this.submitAddLoading = false
    },
    append(data) {
      this.dialogVisibleAdd = true
      if (data) {
        this.currentTreeObj.parent = data.id
      }
    },
    remove(node, data) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        propertyTypeNode('delete', data.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.handleClose(false)
            this.getTypeNode()
          }).catch(e => {
            this.$message.error('删除失败')
          })
      })
    },
    nodeClickFun(data, node) {
      // 单击树形图
      this.currentTreeObjSearch = data
      if (!data) {
        this.$set(this.search, 'property_type', '')
        this.changeList()
      }
    },
    handleCloseList(done) {
      this.dialogVisibleList = false
      this.$refs['formitem'].resetFields()
      this.formitem.property_type = null
      this.formitem.property_type_node = null
      if (done) {
        done()
      }
    },
    searchSubimtTree() {
      const data = this.currentTreeObjSearch
      this.dialogVisibleType = false
      if (this.addBool) {
        // 新增选择
        this.formitem.property_type_node = this.currentTreeObjSearch.id
        this.formitem.property_type = this.currentTreeObjSearch.value
        return
      }
      this.$set(this.search, 'property_type', data ? data.value : '')
      this.changeList()
    },
    add() {
      this.dialogVisibleList = true
    },
    showEditUserDialog(row) {
      this.formitem = JSON.parse(JSON.stringify(row))
      this.dialogVisibleList = true
    },
    submitAddList() {
      this.$refs.formitem.validate((valid) => {
        if (valid) {
          const _api = this.formitem.id ? 'patch' : 'post'
          this.submitListLoading = true
          equipmentProperty(_api, this.formitem.id || null, { data: this.formitem }).then(response => {
            this.dialogVisibleList = false
            this.$message.success('创建成功')
            this.getList()
            this.submitListLoading = false
            this.handleCloseList(false)
          }).catch(e => {
            this.submitListLoading = false
          })
        } else {
          return false
        }
      })
    },
    handleUserDelete(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipmentProperty('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.search.page = 1
            this.getList()
          }).catch(e => {
            this.$message.error('删除失败')
          })
      })
    },
    templateDownload() {
      exportProperty('get').then(response => {
        const link = document.createElement('a')
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.download = '设备资产模板.xls' // 下载的文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      importProperty('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        this.search.page = 1
        this.getList()
      })
    }
  }
}
</script>

<style>

</style>
