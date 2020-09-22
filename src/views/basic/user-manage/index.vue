<template>
  <div style="margin-top: 25px">
    <el-form :inline="true">
      <el-form-item label="工号">
        <el-input v-model.number="num" @input="numChanged" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="username" @input="userNameChanged" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="showCreateUserDialog">新建</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button disabled="">导入</el-button>
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
        label="序"
        width="50"
      />
      <el-table-column
        prop="num"
        label="工号"
      />
      <el-table-column
        prop="username"
        label="用户名"
      />3
      <el-table-column
        prop="section"
        label="组织"
      />
      <el-table-column
        prop="is_leave"
        label="离职与否"
        width="80"
        :formatter="formatter"
      />
      <el-table-column
        prop="created_username"
        label="创建人"
      />
      <el-table-column
        prop="created_date"
        label="创建日期"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditUserDialog(scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleUserDelete(scope.row)"
            >
              {{ scope.row.is_active?'停用':'启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加用户" :visible.sync="dialogCreateUserVisible">
      <el-form ref="userForm" :model="userForm" :rules="rules" :label-width="formLabelWidth">
        <el-form-item :error="userFormError.username" label="用户名">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item :error="userFormError.password" label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="userForm.checkPass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item :error="userFormError.num" label="工号">
          <el-input v-model.number="userForm.num" />
        </el-form-item>
        <el-form-item label="角色" size="medium">
          <el-transfer
            v-model="userForm.groups"
            :titles="['可用 角色', '选中的 角色']"
            :props="{key: 'id', label: 'name'}"
            :data="groups"
          />
        </el-form-item>
        <el-form-item label="权限" size="medium">
          <el-transfer
            v-model="userForm.user_permissions"
            :titles="['可用 用户权限', '选中的 用户权限']"
            :props="{key: 'id', label: 'name'}"
            :data="permissions"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreateUser('userForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="dialogEditUserVisible">
      <el-form ref="userForm" :model="userForm" :rules="rules" :label-width="formLabelWidth">
        <el-form-item :error="userFormError.username" label="用户名">
          <el-input v-model="userForm.username" disabled />
        </el-form-item>
        <el-form-item :error="userFormError.num" label="工号">
          <el-input v-model.number="userForm.num" disabled />
        </el-form-item>
        <el-form-item label="角色" size="medium">
          <el-transfer
            v-model="userForm.groups"
            :titles="['可用 角色', '选中的 角色']"
            :props="{key: 'id', label: 'name'}"
            :data="groups"
          />
        </el-form-item>
        <el-form-item label="权限" size="medium">
          <el-transfer
            v-model="userForm.user_permissions"
            :titles="['可用 用户权限', '选中的 用户权限']"
            :props="{key: 'id', label: 'name'}"
            :data="permissions"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditUser('userForm')">确 定</el-button>
      </div>
    </el-dialog>
    <page :total="total" @currentChange="currentChange" />
  </div>
</template>

<script>
import { getPersonnels, postPersonnels, putPersonnels, deletePersonnels, getPermission, getGroup } from '@/api/user-manage'
import page from '@/components/page'
export default {
  components: { page },
  data: function() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.userForm.checkPass !== '') {
          this.$refs.userForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formLabelWidth: 'auto',
      num: null,
      username: '',
      dialogCreateUserVisible: false,
      dialogEditUserVisible: false,
      tableData: [],
      userForm: {
        username: '',
        password: '',
        checkPass: '',
        num: null,
        user_permissions: [],
        groups: []
      },
      groups: [],
      userFormError: {
        username: '',
        password: '',
        num: ''
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      getParams: {
        page: 1
      },
      currentPage: 1,
      total: 0,
      permissions: []
    }
  },
  created() {
    this.getPersonnelsList()
  },
  methods: {
    getPersonnelsList() {
      getPersonnels(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    numChanged() {
      this.getParams.page = 1
      this.beforeGetData()
      this.getPersonnelsList()
    },
    userNameChanged() {
      this.getParams.page = 1
      this.beforeGetData()
      this.getPersonnelsList()
    },
    beforeGetData() {
      this.getParams['username'] = this.username
      this.getParams['num'] = this.num
    },
    clearUserForm() {
      this.userForm = {

        username: '',
        password: '',
        checkPass: '',
        num: null
      }
    },

    clearUserFormError() {
      this.userFormError = {

        username: '',
        password: '',
        num: ''
      }
    },

    showCreateUserDialog() {
      this.clearUserForm()
      this.clearUserFormError()
      if (this.$refs['userForm']) { this.$refs['userForm'].resetFields() }
      this.dialogCreateUserVisible = true
      this.getPermissionList()
      this.getGroupList()
    },

    handleCreateUser(formName) {
      this.clearUserFormError()
      var app = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          postPersonnels(app.userForm)
            .then(function(response) {
              app.dialogCreateUserVisible = false
              app.$message(app.userForm.username + '创建成功')
              app.currentChange(app.currentPage)
            }).catch(function(error) {
              app.$message(error.response.data.join(','))
              for (const key in app.userFormError) {
                if (error[key]) { app.userFormError[key] = error[key].join(',') }
              }
            })
        } else {
          return false
        }
      })
    },

    showEditUserDialog(row) {
      this.userForm = {

        username: '',
        num: null,
        user_permissions: [],
        groups: []
      }
      this.clearUserFormError()
      this.userForm.id = row.id
      this.userForm.username = row.username
      this.userForm.num = row.num
      this.userForm.user_permissions = row.user_permissions
      this.userForm.groups = row.groups
      this.dialogEditUserVisible = true
      this.getPermissionList()
      this.getGroupList()
    },

    handleEditUser(formName) {
      this.clearUserFormError()
      var app = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putPersonnels(app.userForm, app.userForm.id)
            .then(function(response) {
              app.dialogEditUserVisible = false
              app.$message(app.userForm.username + '修改成功')
              app.currentChange(app.currentPage)
            }).catch(function(error) {
              for (const key in app.userFormError) {
                if (error[key]) { app.userFormError[key] = error[key].join(',') }
              }
            })
        } else {
          return false
        }
      })
    },

    handleUserDelete: function(row) {
      var boolStr = row.is_active ? '停用' : '启用'
      var app = this
      this.$confirm('确定' + boolStr + row.username + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePersonnels(row.id)
          .then(function(response) {
            app.$message({
              type: 'success',
              message: '操作成功!'
            })
            app.currentChange(app.currentPage)
          }).catch(function(error) {
            app.$message.error(error)
          })
      }).catch(() => {

      })
    },

    formatter(row, column) {
      return row.is_leave ? 'Y' : 'N'
    },
    getGroupList() {
      getGroup().then(response => {
        this.groups = response.results
      })
    },
    getPermissionList() {
      getPermission().then(response => {
        this.permissions = response.results
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getPersonnelsList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
