<template>
  <div
    v-loading="loading"
    class="roles-manage"
  >
    <el-form :inline="true">
      <el-form-item label="角色">
        <el-input
          v-model="getParams.group_code"
          @input="groupCodeChanged"
        />
      </el-form-item>
      <el-form-item label="角色名">
        <el-input
          v-model="getParams.name"
          @input="nameChanged"
        />
      </el-form-item>
      <el-form-item label="是否使用">
        <el-select
          v-model="getParams.use_flag"
          clearable
          placeholder="请选择"
          @change="nameChanged"
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
        style="float: right"
      >
        <el-button v-if="checkPermission(['groupextension','add'])" @click="showCreateGroupDialog">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loadingTable"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        updated
        upstream
        align="center"
        width="50"
        type="index"
        label="No"
      />
      <el-table-column
        prop="group_code"
        label="角色代码"
      />
      <el-table-column
        prop="name"
        label="角色名称"
      />
      <el-table-column
        prop="section_name"
        label="部门"
      />
      <el-table-column
        prop="use_flag"
        label="使用"
        width="80"
        :formatter="formatter"
      />
      <el-table-column label="创建人">
        <template slot-scope="scope">
          {{ scope.row.created_username?scope.row.created_username:'--' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_date"
        label="创建日期"
      />
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['groupextension','change']"
              size="mini"
              @click="showEditGroupDialog(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-permission="['groupextension','delete']"
              size="mini"
              type="danger"
              plain
              @click="handleGroupDelete(scope.row)"
            >{{ scope.row.use_flag?'停用':'启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="count"
      :current-page="getParams.page"
      @currentChange="changePage"
    />
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogEditGroupVisible"
      :close-on-click-modal="false"
      width="800px"
      :before-close="handleClose"
    >
      <el-form
        ref="groupForm"
        :model="groupForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              :error="groupFormError.group_code"
              label="角色代码"
            >
              <el-input v-model="groupForm.group_code" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门">
              <el-cascader
                v-model="groupForm.section"
                :options="optionsSection"
                :props="{ checkStrictly: true,value:'id' }"
                :disabled="dialogTitle==='编辑角色'"
                @change="changeSection"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              :error="groupFormError.name"
              label="角色名称"
            >
              <el-input v-model="groupForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="菜单筛选"
            >
              <el-input v-model="permission_name" clearable @input="changeList" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item
          :error="groupFormError.use_flag"
          label="是否使用"
        >
          <el-switch v-model="groupForm.use_flag" />
        </el-form-item> -->
        <el-form-item
          label="权限设置"
          size="medium"
        >
          <transferLimit
            ref="Permission"
            :view-section-permission="true"
            :group-id="groupForm.id"
            :section-id="departmentId"
            @changeTransferPermissions="changeTransferPermissions"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditGroupVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditGroup('groupForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { roles } from '@/api/roles-manage'
import { userOperationLog } from '@/api/base_w_two'
import { sectionTree } from '@/api/base_w_four'
import page from '@/components/page'
import transferLimit from '@/components/select_w/transferLimit'
import { checkPermission } from '@/utils/index'
import { commonCode } from '@/api/global-codes-manage'
import Cookies from 'js-cookie'

export default {
  name: 'GroupManage',
  components: { page, transferLimit },
  data() {
    return {
      getParams: {
        page: 1,
        use_flag: null
      },
      tableData: [],
      count: 0,
      group_code: '',
      name: '',
      permission_name: '',
      groupForm: {
        name: '',
        group_code: '',
        use_flag: true
      },
      groupFormError: {
        name: '',
        group_code: '',
        use_flag: ''
      },
      permissions: [],
      dialogEditGroupVisible: false,
      dialogTitle: '新增角色',
      loading: true,
      loadingTable: false,
      optionsUser: [
        {
          value: 1,
          label: 'Y'
        },
        {
          value: 0,
          label: 'N'
        }
      ],
      optionsSection: [],
      is_superuser: Cookies.get('is_superuser'),
      departmentId: '',
      permission_section: JSON.parse(Cookies.get('permission_section'))
    }
  },
  computed: {
  },
  created() {
    this.currentChange()
  },
  mounted() {
    this.getOptionsSection()
  },
  methods: {
    checkPermission,
    currentChange() {
      this.loadingTable = true
      //   this.tableData = []
      roles('get', null, {
        params: this.getParams
      }).then(response => {
        this.loading = false
        this.loadingTable = false
        this.count = response.count || 0
        this.tableData = response.results || []
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.loading = false
        this.loadingTable = false
      })
    },
    async getOptionsSection() {
      try {
        if (this.is_superuser === 'true') {
          const data = await sectionTree('get')
          if (data.results && data.results[0].children.length > 0) {
            this.optionsSection = data.results[0].children
            this.optionsSection = filterMy(this.optionsSection)
            this.optionsSection.forEach(d => {
              delete d.children
            })
          } else {
            this.optionsSection = []
          }
        } else {
          this.optionsSection = this.permission_section
          this.optionsSection.forEach(d => {
            d.label = d.name
          })
        }
      } catch (error) {
        //
      }
    },
    formatter: function(row, column) {
      return row.use_flag ? 'Y' : 'N'
    },
    changePage(page) {
      this.getParams['page'] = page
      this.currentChange()
    },
    groupCodeChanged() {
      this.getParams['page'] = 1
      this.currentChange()
    },
    nameChanged() {
      this.getParams['page'] = 1
      this.currentChange()
    },
    clearGroupForm() {
      this.groupForm = {
        name: '',
        group_code: '',
        use_flag: true,
        section: ''
      }
      this.departmentId = ''
      this.permission_name = ''
    },
    clearGroupFormError() {
      this.groupFormError = {
        name: '',
        group_code: '',
        use_flag: ''
      }
    },
    showCreateGroupDialog() {
      this.permission_name = null
      this.getCode(3)
      this.clearGroupForm()
      this.clearGroupFormError()
      this.dialogTitle = '新增角色'
      this.dialogEditGroupVisible = true
    },
    async getCode(num) {
      try {
        const { results } = await commonCode({ code: num })
        this.groupForm.group_code = results
      } catch (e) {
        //
      }
    },
    handleEditGroup() {
      this.clearGroupFormError()
      if (!this.groupForm.section) {
        this.$message('请选择部门')
        return
      }
      if (!this.groupForm.name) {
        this.$message('请填写角色名称')
        return
      }
      const type = this.groupForm.id ? 'put' : 'post'
      const id = this.groupForm.id ? this.groupForm.id : ''
      const obj = JSON.parse(JSON.stringify(this.groupForm))
      if (obj.section instanceof Array) {
        obj.section = obj.section[0]
      }
      userOperationLog('post', null, { data: { 'operator': Cookies.get('name'), 'menu_name': '角色管理', 'operations': '变更：' + this.groupForm.name + '角色' }})
      roles(type, id, { data: { ...obj }})
        .then(response => {
          this.dialogEditGroupVisible = false
          this.$message.success(this.groupForm.name + this.groupForm.id ? '编辑成功' : '创建成功')
          this.groupForm.id = null
          this.currentChange()
          // eslint-disable-next-line handle-callback-err
        }).catch(error => {

        })
    },
    showEditGroupDialog(group) {
      this.permission_name = null
      this.groupForm = JSON.parse(JSON.stringify(group))
      this.departmentId = this.groupForm.section
      this.clearGroupFormError()
      this.dialogTitle = '编辑角色'
      this.dialogEditGroupVisible = true
    },
    changeList() {
      if (this.permission_name !== '') {
        this.$refs['Permission'].permissionsData = this.$refs['Permission'].permissionsList.filter(d => { return (d.name.indexOf(this.permission_name) !== -1) })
      } else {
        this.$refs['Permission'].permissionsData = this.$refs['Permission'].permissionsList
      }
    },
    handleGroupDelete(group) {
      var boolStr = group.use_flag ? '停用' : '启用'
      const _str = '确定' + boolStr + group.name + (group.use_flag ? '，且解除该角色下所有用户' : '') + ', 是否继续?'
      this.$confirm(_str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        userOperationLog('post', null, { data: { 'operator': Cookies.get('name'), 'menu_name': '角色管理', 'operations': '停用：' + group.name + '角色' }})
        roles('delete', group.id).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          // if (this.tableData.length === 1 && this.getParams.page !== 1) {
          //   this.getParams.page = this.getParams.page - 1
          // }
          this.currentChange()
        })
      })
    },
    changeTransferPermissions(val) {
      this.$set(this.groupForm, 'permissions', val)
    },
    handleClose(done) {
      this.groupForm.id = null
      done()
    },
    changeSection(val) {
      if (!val) {
        return
      }
      this.$set(this.groupForm, 'permissions', [])
      // 获取第二级id
      this.departmentId = val[0]
    }
  }
}
// 去掉最后一个空children
function filterMy(data) {
  const res = []
  data.forEach(D => {
    const tmp = {
      ...D
    }
    if (tmp.children.length > 0) {
      tmp.children = filterMy(tmp.children)
    } else {
      delete tmp.children
    }
    res.push(tmp)
  })
  return res
}
</script>
<style lang="scss">
  .roles-manage{
    .el-input{
      width:auto;
    }
    .el-transfer__buttons{
      padding: 0 15px;
    }
    .el-transfer-panel{
      width: 240px;
    }
    .el-checkbox{
      margin-right: 5px;
    }
  }
</style>
