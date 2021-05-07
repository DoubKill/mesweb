<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="原材料类别">
        <el-select
          v-model="materialType"
          clearable
          placeholder="请选择"
          @change="materialTypeChange"
        >
          <el-option
            v-for="item in materialTypeOptions"
            :key="item.id"
            :label="item.global_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原材料名称">
        <el-input
          v-model="getParams.material_name"
          @input="getParam"
        />
      </el-form-item>
      <el-form-item label="原材料编码">
        <el-input
          v-model="getParams.material_no"
          @input="getParam"
        />
      </el-form-item>
      <el-form-item label="是否使用">
        <el-select
          v-model="getParams.use_flag"
          clearable
          placeholder="请选择"
          @change="getParam"
        >
          <el-option
            v-for="item in optionsUser"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="permissionObj.material.indexOf('add')>-1"
        style="float: right;"
      >
        <el-button @click="showAddMaterialDialog">新建</el-button>
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
        width="50"
      />
      <el-table-column
        prop="material_no"
        label="原材料编码"
      />
      <el-table-column
        prop="material_name"
        label="原材料名称"
      />
      <el-table-column
        prop="for_short"
        label="原材料简称"
      />
      <el-table-column
        prop="material_type_name"
        label="原材料类别"
        width="95px"
      />
      <!-- <el-table-column
        prop="density"
        label="比重"
        width="100"
      /> -->
      <el-table-column
        prop="package_unit_name"
        label="包装单位"
        width="60px"
      />
      <el-table-column
        width="50"
        align="center"
        :formatter="formatter"
        prop="used_flag"
        label="使用与否"
      />
      <el-table-column
        prop="created_user_name"
        label="创建人员"
        width="100px"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
        width="160px"
      />
      <el-table-column
        prop="update_user_name"
        label="更新人员"
        width="100px"
      />
      <!--
        <el-table-column
                prop="last_updated_date"
                label="更新时间">
        </el-table-column>
        -->
      <el-table-column
        label="操作"
        width="140"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="permissionObj.material.indexOf('change')>-1"
              size="mini"
              @click="showEditMaterialDialog(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-if="permissionObj.material.indexOf('delete')>-1"
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
    <pagination
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="添加原材料基本信息"
      :visible.sync="dialogAddMaterialBaseInfoVisible"
    >
      <el-form
        ref="materialBaseInfoForm"
        :rules="rules"
        :model="materialBaseInfoForm"
      >
        <el-form-item
          :error="materialBaseInfoFormError.material_no"
          label="原材料编码"
          prop="material_no"
        >
          <el-input v-model="materialBaseInfoForm.material_no" />
        </el-form-item>
        <el-form-item
          :error="materialBaseInfoFormError.material_name"
          label="原材料名称"
          prop="material_name"
        >
          <el-input v-model="materialBaseInfoForm.material_name" />
        </el-form-item>
        <el-form-item
          :error="materialBaseInfoFormError.for_short"
          label="原材料简称"
        >
          <el-input v-model="materialBaseInfoForm.for_short" />
        </el-form-item>
        <!--
            <el-form-item :error="materialBaseInfoFormError.density" label="比重">
                <el-input v-model="materialBaseInfoForm.density"></el-input>
            </el-form-item>
            -->
        <!-- <el-form-item
          :error="materialBaseInfoFormError.use_flag"
          label="是否启用"
        >
          <el-switch v-model="materialBaseInfoForm.use_flag" />
        </el-form-item> -->
        <el-form-item
          :error="materialBaseInfoFormError.material_type"
          label="原材料类别"
          prop="material_type"
        >
          <el-select
            v-model="materialBaseInfoForm.material_type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in materialTypeOptions"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :error="materialBaseInfoFormError.package_unit"
          label="包装单位"
        >
          <el-select
            v-model="materialBaseInfoForm.package_unit"
            placeholder="请选择"
          >
            <el-option
              v-for="item in packingUnitOptions"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogAddMaterialBaseInfoVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAddMaterialBaseInfo"
        >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="编辑原材料基本信息"
      :visible.sync="dialogEditMaterialBaseInfoVisible"
    >
      <el-form
        ref="materialBaseInfoEditForm"
        :rules="rules"
        :model="materialBaseInfoForm"
      >
        <el-form-item
          :error="materialBaseInfoFormError.material_no"
          label="原材料编码"
          prop="material_no"
        >
          <el-input v-model="materialBaseInfoForm.material_no" :disabled="true" />
        </el-form-item>
        <el-form-item
          :error="materialBaseInfoFormError.material_name"
          label="原材料名称"
          prop="material_name"
        >
          <el-input v-model="materialBaseInfoForm.material_name" />
        </el-form-item>
        <el-form-item
          :error="materialBaseInfoFormError.for_short"
          label="原材料简称"
        >
          <el-input v-model="materialBaseInfoForm.for_short" />
        </el-form-item>
        <!-- <el-form-item
          :error="materialBaseInfoFormError.density"
          label="比重"
        >
          <el-input v-model="materialBaseInfoForm.density" />
        </el-form-item> -->
        <!-- <el-form-item
          :error="materialBaseInfoFormError.use_flag"
          label="是否启用"
        >
          <el-switch v-model="materialBaseInfoForm.use_flag" />
        </el-form-item> -->
        <el-form-item
          :error="materialBaseInfoFormError.material_type"
          label="原材料类别"
          prop="material_type"
        >
          <el-select
            v-model="materialBaseInfoForm.material_type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in materialTypeOptions"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :error="materialBaseInfoFormError.package_unit"
          label="包装单位"
        >
          <el-select
            v-model="materialBaseInfoForm.package_unit"
            placeholder="请选择"
          >
            <el-option
              v-for="item in packingUnitOptions"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditMaterialBaseInfoVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditMaterialBaseInfo"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonVal from '@/utils/common'
import { globalCodesUrl, materialsUrl } from '@/api/base_w'
import pagination from '@/components/page'
import { mapGetters } from 'vuex'
export default {
  components: { pagination },
  data: function() {
    return {
      tableData: [],
      optionsUser: [
        {
          value: true,
          label: 'Y'
        },
        {
          value: false,
          label: 'N'
        }
      ],
      formLabelWidth: commonVal.formLabelWidth,
      materialType: '',
      materialTypeOptions: [],
      dialogAddMaterialBaseInfoVisible: false,
      dialogEditMaterialBaseInfoVisible: false,
      packingUnitOptions: [],
      materialBaseInfoForm: {

        material_no: '',
        material_name: '',
        for_short: '',
        // density: null,
        use_flag: true,
        material_type: null,
        package_unit: null
      },
      materialBaseInfoFormError: {

        material_no: '', //
        material_name: '', //
        for_short: '',
        // density: "",
        use_flag: '',
        material_type: '', //
        package_unit: ''
      },
      rules: {
        material_no: [
          { required: true, message: '请输入原材料编码', trigger: 'blur' }
        ],
        material_name: [
          { required: true, message: '请输入原材料名称', trigger: 'blur' }
        ],
        material_type: [
          { required: true, message: '请选择原材料类型', trigger: 'change' }
        ]
      },
      getParams: {
        page: 1,
        use_flag:	'',
        material_no:	'',
        material_name: ''
      },
      total: 0
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created: function() {
    this.permissionObj = this.permission
    var app = this
    this.getList()
    globalCodesUrl('get', {
      params: {
        class_name: '原材料类别',
        all: 1
      }
    }).then(function(response) {
      app.materialTypeOptions = response.results
    }).catch(function() {
    })
    globalCodesUrl('get', {
      params: {
        class_name: '包装单位'
      }
    }).then(function(response) {
      app.packingUnitOptions = response.results
    }).catch(function() {
    })
  },
  methods: {
    getList() {
      this.beforeGetData()
      const app = this
      app.loading = true
      materialsUrl('get', null, {
        params: app.getParams
      }).then(function(response) {
        app.total = response.count
        app.tableData = response.results || []
        app.loading = false
      }).catch(function() {
        app.loading = false
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getList()
    },
    formatter: function(row, column) {
      return row.use_flag ? 'Y' : 'N'
    },
    beforeGetData() {
      this.getParams['material_type_id'] = this.materialType
    },
    materialTypeChange: function() {
      this.getParams.page = 1
      this.getList()
    },
    getParam: function() {
      this.getParams.page = 1
      this.getList()
    },
    showAddMaterialDialog: function() {
      this.clearMaterialBaseInfoForm()
      this.dialogAddMaterialBaseInfoVisible = true
    },
    clearMaterialBaseInfoForm() {
      this.materialBaseInfoForm = {
        material_no: '',
        material_name: '',
        for_short: '',
        // density: null,
        use_flag: true,
        material_type: null,
        package_unit: null
      }
    },
    clearMaterialBaseInfoFormError() {
      this.materialBaseInfoFormError = {
        material_no: '',
        material_name: '',
        for_short: '',
        // density: "",
        use_flag: '',
        material_type: '',
        package_unit: ''
      }
    },
    handleAddMaterialBaseInfo: function() {
      this.clearMaterialBaseInfoFormError()
      var app = this
      this.$refs['materialBaseInfoForm'].validate(valid => {
        if (valid) {
          materialsUrl('post', null, { data: app.materialBaseInfoForm })
            .then(function(response) {
              app.dialogAddMaterialBaseInfoVisible = false
              app.$message.success(app.materialBaseInfoForm.material_name + '创建成功')
              // app.getParams.page = 1
              app.getList()
            }).catch(function(error) {
              for (const key in app.materialBaseInfoFormError) {
                if (error[key]) { app.materialBaseInfoFormError[key] = error[key].join(',') }
              }
            })
        } else {
          return false
        }
      })
    },
    showEditMaterialDialog(row) {
      this.clearMaterialBaseInfoFormError()
      this.materialBaseInfoForm = Object.assign({}, row)
      this.dialogEditMaterialBaseInfoVisible = true
    },
    handleMaterialDelete(row) {
      var app = this
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.material_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        materialsUrl('delete', row.id)
          .then(function(response) {
            app.$message({
              type: 'success',
              message: '操作成功!'
            })
            app.getList()
          }).catch(function() {
          })
      }).catch(() => {

      })
    },
    handleEditMaterialBaseInfo() {
      this.clearMaterialBaseInfoFormError()
      var app = this
      this.$refs['materialBaseInfoEditForm'].validate(valid => {
        if (valid) {
          materialsUrl('put', app.materialBaseInfoForm.id, { data: app.materialBaseInfoForm })
            .then(function(response) {
              app.dialogEditMaterialBaseInfoVisible = false
              app.$message.success(app.materialBaseInfoForm.material_name + '修改成功')
              app.getParams.page = 1
              app.getList()
            }).catch(function(error) {
              for (const key in app.materialBaseInfoFormError) {
                if (error[key]) { app.materialBaseInfoFormError[key] = error[key].join(',') }
              }
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>

</style>
