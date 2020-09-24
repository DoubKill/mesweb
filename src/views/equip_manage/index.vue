<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="工序">
        <el-input v-model.number="process" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="设备名">
        <el-input v-model="equip" @input="changeSearch" />
      </el-form-item>
      <el-form-item>
        <el-button v-if="permissionObj.equip && permissionObj.equip.indexOf('add')>-1" @click="showCreateEquipDialog">新建</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="序"
        width="50"
      />
      <el-table-column align="center" width="50" prop="equip_process_no" label="工序代码" />
      <el-table-column align="center" prop="equip_process_name" label="工序名称" />
      <el-table-column align="center" prop="category_no" label="机型编号" />
      <el-table-column align="center" prop="category_name" label="机型名称" />
      <el-table-column align="center" prop="equip_no" label="设备代码" />
      <el-table-column align="center" width="200%" prop="equip_name" label="设备名称" />
      <el-table-column align="center" prop="equip_type" label="设备类型" />
      <el-table-column align="center" width="50" prop="equip_level_name" label="设备层级" />
      <el-table-column align="center" width="50" prop="count_flag" label="产量计数" :formatter="EquipCountFlagFormatter" />
      <el-table-column align="center" prop="description" label="备注" />
      <el-table-column align="center" width="50" prop="use_flag" label="是否启用" :formatter="EquipUsedFlagFormatter" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="permissionObj.equip && permissionObj.equip.indexOf('change')>-1"
              size="mini"
              @click="showEditEquipDialog(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-if="permissionObj.equip && permissionObj.equip.indexOf('delete')>-1"
              size="mini"
              type="danger"
              @click="handleEquipDelete(scope.row)"
            >{{ scope.row.use_flag ? '停用' : '启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page :total="total" @currentChange="currentChange" />

    <el-dialog title="添加设备基础信息" :visible.sync="dialogCreateEquipVisible">
      <el-form ref="AddEquipForm" :model="AddEquipForm" :rules="add_equip_rules">
        <el-form-item label="设备编号" prop="equip_no">
          <el-input v-model="AddEquipForm.equip_no" />
        </el-form-item>
        <el-form-item label="设备名称" prop="equip_name">
          <el-input v-model="AddEquipForm.equip_name" />
        </el-form-item>

        <el-form-item label="产量计数">
          <el-switch v-model="AddEquipForm.count_flag" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="AddEquipForm.description" />
        </el-form-item>
        <!-- <el-form-item label="是否启用">
          <el-switch v-model="AddEquipForm.use_flag" />
        </el-form-item> -->

        <el-form-item label="设备层级" prop="equip_level">
          <el-select
            v-model="AddEquipForm.equip_level"
            style="width: 100%"
            placeholder="请选择"
            @visible-change="shiftsEquipLevelChange"
          >
            <el-option
              v-for="item in EquipLevelOptions"
              :key="item.id"
              :value="item.id"
              :label="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备种类" prop="category">
          <el-select
            v-model="AddEquipForm.category"
            style="width: 100%"
            placeholder="请选择"
            @visible-change="shiftsEquipCategoryChange"
          >
            <el-option
              v-for="item in EquipCategoryOptions"
              :key="item.id"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateEquipVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreateEquip('AddEquipForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑设备基础信息" :visible.sync="dialogEditEquipVisible">
      <el-form ref="ModifyEquipForm" :model="ModifyEquipForm" :rules="modify_equip_rules">
        <el-form-item label="设备编号" prop="equip_no">
          <el-input v-model="ModifyEquipForm.equip_no" />
        </el-form-item>
        <el-form-item label="设备名称" prop="equip_name">
          <el-input v-model="ModifyEquipForm.equip_name" />
        </el-form-item>

        <el-form-item label="产量计数">
          <el-switch v-model="ModifyEquipForm.count_flag" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="ModifyEquipForm.description" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="ModifyEquipForm.use_flag" />
        </el-form-item>

        <el-form-item label="设备层级" prop="equip_level">
          <el-select
            v-model="ModifyEquipForm.equip_level"
            style="width: 100%"
            placeholder="请选择"
            @visible-change="shiftsEquipLevelChange"
          >
            <el-option
              v-for="item in EquipLevelOptions"
              :key="item.id"
              :value="item.id"
              :label="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备种类" prop="category">
          <el-select
            v-model="ModifyEquipForm.category"
            style="width: 100%"
            placeholder="请选择"
            @visible-change="shiftsEquipCategoryChange"
          >
            <el-option
              v-for="item in EquipCategoryOptions"
              :key="item.id"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditEquipVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditEquip('ModifyEquipForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { equip_manage_url, equip_level_url, equip_category_url } from '@/api/equip_fun'
import { mapGetters } from 'vuex'

export default {
  components: { page },
  computed: {
    ...mapGetters(['permission'])
  },
  data: function() {
    return {
      tableData: [],
      total: 0,
      getParams: {
        page: 1
      },
      process: null,
      equip: null,
      EquipLevel: [],
      EquipLevelOptions: [],
      equip_level: '',

      EquipCategory: [],
      EquipCategoryOptions: [],
      category: '',

      AddEquipForm: {
        equip_no: '',
        equip_name: '',
        count_flag: true,
        use_flag: true,
        description: '',
        equip_level: '',
        category: ''
      },
      ModifyEquipForm: {
        equip_no: '',
        equip_name: '',
        count_flag: true,
        use_flag: true,
        description: '',
        equip_level: '',
        category: ''
      },
      add_equip_rules: {
        equip_no: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        equip_name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        equip_level: [{ required: true, message: '请选择设备层级', trigger: 'change' }],
        category: [{ required: true, message: '请选择设备种类', trigger: 'change' }]
      },
      modify_equip_rules: {
        equip_no: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        equip_name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        equip_level: [{ required: true, message: '请选择设备层级', trigger: 'change' }],
        category: [{ required: true, message: '请选择设备种类', trigger: 'change' }]
      },
      EquipFormError: {
        equip_no: '',
        equip_name: '',
        count_flag: '',
        use_flag: '',
        description: '',
        equip_level: '',
        category: ''
      },
      dialogCreateEquipVisible: false,
      dialogEditEquipVisible: false

    }
  },
  created() {
    this.permissionObj = this.permission
    this.equip_manage_list()
  },
  methods: {
    async equip_manage_list() {
      try {
        const equip_manageData = await equip_manage_url('get', null, { params: this.getParams })
        this.tableData = equip_manageData.results
        this.total = equip_manageData.count
      } catch (e) { throw new Error(e) }
    },
    async equip_manage_post(obj) {
      try {
        const equip_manageData = await equip_manage_url('post', null, obj)
        return equip_manageData
      } catch (e) { throw new Error(e) }
    },
    async equip_manage_delete(id) {
      try {
        await equip_manage_url('delete', id, {
        })
      } catch (e) { throw new Error(e) }
    },
    async equip_manage_modify(id, obj) {
      try {
        await equip_manage_url('put', id, obj)
      } catch (e) { throw new Error(e) }
    },
    async equip_level_list() {
      try {
        const equip_level_list = await equip_level_url('get', {
          params: { }
        })
        if (equip_level_list.results.length !== 0) {
          this.EquipLevelOptions = equip_level_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    async equip_category_list() {
      try {
        const equip_category_list = await equip_category_url('get', {
          params: { }
        })
        if (equip_category_list.results.length !== 0) {
          this.EquipCategory = equip_category_list.results
          for (var i = 0; i < this.EquipCategory.length; ++i) {
            var label = '设备类型: ' + this.EquipCategory[i]['equip_type_name'] + ';  机型名称: ' + this.EquipCategory[i]['category_name'] + ';  机型编号: ' + this.EquipCategory[i]['category_no'] + ';  工序: ' + this.EquipCategory[i]['equip_process_name']
            this.EquipCategoryOptions.push({
              key: this.EquipCategory[i]['id'],
              value: this.EquipCategory[i]['id'],
              label
            })
          }
        }
      } catch (e) { throw new Error(e) }
    },
    shiftsEquipLevelChange: function(bool) {
      if (bool) {
        this.equip_level_list()
      }
    },
    shiftsEquipCategoryChange: function(bool) {
      if (bool) {
        this.equip_category_list()
      }
    },
    processChanged: function() {
    },
    equipChanged: function() {

    },
    clearEquipForm: function() {
      this.EquipForm = {
        equip_no: '',
        equip_name: '',
        count_flag: true,
        use_flag: true,
        description: '',
        equip_level: '',
        category: ''
      }
    },
    clearEquipFormError: function() {
      this.EuqipFormError = {
        equip_no: '',
        equip_name: '',
        count_flag: '',
        use_flag: '',
        description: '',
        equip_level: '',
        category: ''
      }
    },
    showCreateEquipDialog: function() {
      this.clearEquipForm()
      this.clearEquipFormError()
      this.dialogCreateEquipVisible = true
    },
    showEditEquipDialog: function(row) {
      this.clearEquipForm()
      this.clearEquipFormError()
      this.equip_level_list()
      this.equip_category_list()
      this.ModifyEquipForm = Object.assign({}, row)
      this.dialogEditEquipVisible = true
    },
    handleEquipDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.equip_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        try {
          equip_manage_url('delete', row.id, {
          }).then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.equip_manage_list()
          })
        } catch (e) { e }
      }).catch(() => {

      })
    },
    handleCreateEquip(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.clearEquipForm()
          try {
            await this.equip_manage_post(
              { data: {
                'category': this.AddEquipForm['category'],
                'count_flag': this.AddEquipForm['count_flag'],
                'description': this.AddEquipForm['description'],
                'equip_level': this.AddEquipForm['equip_level'],
                'equip_name': this.AddEquipForm['equip_name'],
                'equip_no': this.AddEquipForm['equip_no'],
                'use_flag': this.AddEquipForm['use_flag']
              }}
            )
            this.dialogCreateEquipVisible = false
            this.equip_manage_list()
          } catch (e) { e }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleEditEquip: function(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          try {
            await this.equip_manage_modify(
              this.ModifyEquipForm.id,
              { data: {
                'category': this.ModifyEquipForm['category'],
                'count_flag': this.ModifyEquipForm['count_flag'],
                'description': this.ModifyEquipForm['description'],
                'equip_level': this.ModifyEquipForm['equip_level'],
                'equip_name': this.ModifyEquipForm['equip_name'],
                'equip_no': this.ModifyEquipForm['equip_no'],
                'use_flag': this.ModifyEquipForm['use_flag']
              }}
            )
            this.dialogEditEquipVisible = false
            this.equip_manage_list()
          } catch (e) { e }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    boolFormatter: function(flag) {
      return flag ? 'Y' : 'N'
    },
    EquipCountFlagFormatter: function(row, column) {
      return this.boolFormatter(row.count_flag)
    },
    EquipUsedFlagFormatter: function(row, column) {
      return this.boolFormatter(row.use_flag)
    },
    changeSearch() {
      this.getParams['equip_process'] = this.process
      this.getParams['equip_name'] = this.equip
      this.getParams.page = 1
      this.equip_manage_list()
    },
    currentChange(page) {
      this.getParams.page = page
      this.equip_manage_list()
    }

  }
}

</script>

<style lang="scss" scoped>
</style>

