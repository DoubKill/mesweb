<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="机型名称">
        <el-input
          v-model="category_name"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="设备类型">
        <el-input
          v-model="equip_type_name"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="permissionObj.equipcategoryattribute && permissionObj.equipcategoryattribute.indexOf('add')>-1"
          @click="showCreateEquipCateDialog"
        >新建</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="No"
        width="40px"
      />
      <el-table-column
        align="center"
        prop="category_no"
        label="机型编号"
      />
      <el-table-column
        align="center"
        prop="category_name"
        label="机型名称"
      />
      <el-table-column
        align="center"
        width="100"
        prop="volume"
        label="容积"
      />
      <el-table-column
        align="center"
        prop="equip_type_name"
        label="设备类型"
      />
      <el-table-column
        align="center"
        width="50"
        prop="equip_process_no"
        label="工序代码"
      />
      <el-table-column
        align="center"
        prop="equip_process_name"
        label="工序名称"
      />
      <el-table-column
        align="center"
        :formatter="formatter"
        width="50"
        prop="used_flag"
        label="使用与否"
      />
      <el-table-column
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="permissionObj.equipcategoryattribute && permissionObj.equipcategoryattribute.indexOf('change')>-1"
              size="mini"
              @click="showEditEquipCateDialog(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-if="permissionObj.equipcategoryattribute && permissionObj.equipcategoryattribute.indexOf('delete')>-1"
              size="mini"
              type="danger"
              plain
              @click="handleEquipCateDelete(scope.row)"
            >{{ scope.row.use_flag ? '停用' : '启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="添加设备种类"
      :visible.sync="dialogCreateEquipCateVisible"
    >
      <el-form
        ref="AddEquipCateForm"
        :model="AddEquipCateForm"
        :rules="add_equipcate_rules"
      >
        <el-form-item
          label="机型编号"
          prop="category_no"
        >
          <el-input v-model="AddEquipCateForm.category_no" />
        </el-form-item>
        <el-form-item
          label="机型名称"
          prop="category_name"
        >
          <el-input v-model="AddEquipCateForm.category_name" />
        </el-form-item>

        <el-form-item
          label="容积"
          prop="volume"
        >
          <el-input v-model="AddEquipCateForm.volume" />
        </el-form-item>

        <el-form-item
          label="设备类型"
          prop="equip_type"
        >
          <el-select
            v-model="AddEquipCateForm.equip_type"
            style="width: 100%"
            placeholder="请选择"
            @visible-change="shiftsEquipCateChange"
          >
            <el-option
              v-for="item in EquipCateOptions"
              :key="item.id"
              :value="item.id"
              :label="item.global_name"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="工序"
          prop="process"
        >
          <el-select
            v-model="AddEquipCateForm.process"
            style="width: 100%"
            placeholder="请选择"
            @visible-change="shiftsEquipCateProcessChange"
          >
            <el-option
              v-for="item in EquipCateProcessOptions"
              :key="item.id"
              :value="item.id"
              :label="item.global_name"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateEquipCateVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreateEquipCate('AddEquipCateForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑设备种类"
      :visible.sync="dialogEditEquipCateVisible"
    >
      <el-form
        ref="ModifyEquipCateForm"
        :model="ModifyEquipCateForm"
        :rules="modify_equipcate_rules"
      >

        <el-form-item
          label="机型编号"
          prop="category_no"
        >
          <el-input
            v-model="ModifyEquipCateForm.category_no"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          label="机型名称"
          prop="category_name"
        >
          <el-input v-model="ModifyEquipCateForm.category_name" />
        </el-form-item>

        <el-form-item
          label="容积"
          prop="volume"
        >
          <el-input v-model="ModifyEquipCateForm.volume" />
        </el-form-item>

        <el-form-item
          label="设备类型"
          prop="equip_type"
        >
          <el-select
            v-model="ModifyEquipCateForm.equip_type"
            style="width: 100%"
            placeholder="请选择"
            @visible-change="shiftsEquipCateChange"
          >
            <el-option
              v-for="item in EquipCateOptions"
              :key="item.id"
              :value="item.id"
              :label="item.global_name"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="工序"
          prop="process"
        >
          <el-select
            v-model="ModifyEquipCateForm.process"
            style="width: 100%"
            placeholder="请选择"
            @visible-change="shiftsEquipCateProcessChange"
          >
            <el-option
              v-for="item in EquipCateProcessOptions"
              :key="item.id"
              :value="item.id"
              :label="item.global_name"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditEquipCateVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditEquipCate('ModifyEquipCateForm')"
        >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import page from '@/components/page'
import { category_manage_url, equip_type_url, process_global_url } from '@/api/equip_fun'
import { mapGetters } from 'vuex'

export default {
  name: 'CategoryManage',
  components: { page },
  data: function() {
    return {
      tableData: [],

      EquipCate: [],
      EquipCateOptions: [],
      equip_type: '',
      category_name: null,
      equip_type_name: null,
      EquipCateProcess: [],
      EquipCateProcessOptions: [],
      process: '',
      getParams: {
        page: 1
      },
      AddEquipCateForm: {
        category_no: '',
        category_name: '',
        volume: '',
        equip_type: '',
        process: ''
      },
      total: 0,
      ModifyEquipCateForm: {
        category_no: '',
        category_name: '',
        volume: '',
        equip_type: '',
        process: ''
      },
      EquipCateFormError: {
        category_no: '',
        category_name: '',
        volume: '',
        equip_type: '',
        process: ''
      },
      add_equipcate_rules: {
        category_no: [{ required: true, message: '请输入机型编号', trigger: 'blur' }],
        category_name: [{ required: true, message: '请输入机型名称', trigger: 'blur' }],
        volume: [{ required: true, message: '请输入容积', trigger: 'blur' }],
        equip_type: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        process: [{ required: true, message: '请选择工序', trigger: 'change' }]
      },
      modify_equipcate_rules: {
        category_no: [{ required: true, message: '请输入机型编号', trigger: 'blur' }],
        category_name: [{ required: true, message: '请输入机型名称', trigger: 'blur' }],
        volume: [{ required: true, message: '请输入容积', trigger: 'blur' }],
        equip_type: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        process: [{ required: true, message: '请选择工序', trigger: 'change' }]
      },
      dialogCreateEquipCateVisible: false,
      dialogEditEquipCateVisible: false
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.category_manage_list()
  },
  methods: {
    formatter: function(row, column) {
      return row.use_flag ? 'Y' : 'N'
    },
    async category_manage_list() {
      try {
        const category_manageData = await category_manage_url('get', null, { params: this.getParams })
        this.tableData = category_manageData.results
        this.total = category_manageData.count
      } catch (e) { throw new Error(e) }
    },
    async category_manage_delete(id) {
      try {
        await category_manage_url('delete', id, {
        })
      } catch (e) { throw new Error(e) }
    },
    async category_manage_modify(id, obj) {
      try {
        await category_manage_url('put', id, obj)
      } catch (e) { throw new Error(e) }
    },
    async equip_type_list() {
      try {
        const equip_type_list = await equip_type_url('get', {
          params: {}
        })
        if (equip_type_list.results.length !== 0) {
          this.EquipCateOptions = equip_type_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    async process_global_list() {
      try {
        const process_global_list = await process_global_url('get', {
          params: {}
        })
        if (process_global_list.results.length !== 0) {
          this.EquipCateProcessOptions = process_global_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    async category_manage_post(obj) {
      try {
        const category_manageData = await category_manage_url('post', null, obj)
        return category_manageData
      } catch (e) { throw new Error(e) }
    },
    shiftsEquipCateChange: function(bool) {
      if (bool) {
        this.equip_type_list()
      }
    },
    shiftsEquipCateProcessChange: function(bool) {
      if (bool) {
        this.process_global_list()
      }
    },
    clearEquipCateForm: function() {
      this.AddEquipCateForm = {
        category_no: '',
        category_name: '',
        volume: '',
        equip_type: '',
        process: ''
      }
    },
    clearEquipCateFormError: function() {
      this.EuqipCateFormError = {
        category_no: '',
        category_name: '',
        volume: '',
        equip_type: '',
        process: ''
      }
    },
    showCreateEquipCateDialog: function() {
      this.clearEquipCateForm()
      this.clearEquipCateFormError()
      this.dialogCreateEquipCateVisible = true
    },
    handleCreateEquipCate: function(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.clearEquipCateFormError()
          try {
            await this.category_manage_post(
              {
                data: {
                  'category_name': this.AddEquipCateForm['category_name'],
                  'category_no': this.AddEquipCateForm['category_no'],
                  'equip_type': this.AddEquipCateForm['equip_type'],
                  'process': this.AddEquipCateForm['process'],
                  'volume': this.AddEquipCateForm['volume']
                }
              }
            )
            this.dialogCreateEquipCateVisible = false
            this.category_manage_list()
          } catch (e) { e }
        } else {
          return false
        }
      })
    },
    handleEditEquipCate: function(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          try {
            await this.category_manage_modify(
              this.ModifyEquipCateForm.id,
              {
                data: {
                  'category_name': this.ModifyEquipCateForm['category_name'],
                  'category_no': this.ModifyEquipCateForm['category_no'],
                  'equip_type': this.ModifyEquipCateForm['equip_type'],
                  'process': this.ModifyEquipCateForm['process'],
                  'volume': this.ModifyEquipCateForm['volume']
                }
              }
            )
            this.dialogEditEquipCateVisible = false
            this.category_manage_list()
          } catch (e) { e }
        } else {
          return false
        }
      })
    },
    handleEquipCateDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.category_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        try {
          category_manage_url('delete', row.id, {
          }).then(response => {
            this.category_manage_list()
          })
        } catch (e) { e }
      }).catch(() => {
      })
    },
    showEditEquipCateDialog: function(row) {
      this.clearEquipCateForm()
      this.clearEquipCateFormError()
      this.equip_type_list()
      this.process_global_list()
      this.ModifyEquipCateForm = Object.assign({}, row)
      this.dialogEditEquipCateVisible = true
    },
    changeSearch() {
      this.getParams['category_name'] = this.category_name
      this.getParams['equip_type_name'] = this.equip_type_name
      this.getParams.page = 1
      this.category_manage_list()
    },
    currentChange(page) {
      this.getParams.page = page
      this.category_manage_list()
    }

  }
}

</script>

<style lang="scss" scoped>
</style>
