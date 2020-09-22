<template>
  <div style="margin-top: 25px">
    <el-form :inline="true">
      <el-form-item label="角色">
        <el-input v-model="group_code" @input="groupCodeChanged" />
      </el-form-item>
      <el-form-item label="角色名">
        <el-input v-model="name" @input="nameChanged" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="showCreateGroupDialog">新建</el-button>
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
        prop="group_code"
        label="角色代码"
      />
      <el-table-column
        prop="name"
        label="角色名称"
      />
      <el-table-column
        prop="use_flag"
        label="使用"
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
              @click="showEditGroupDialog(scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleGroupDelete(scope.row)"
            >{{ scope.row.use_flag ? '停用' : '启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page :total="total" @currentChange="currentChange" />
    <el-dialog title="添加角色" :visible.sync="dialogCreateGroupVisible">
      <el-form ref="groupForm" :model="groupForm" :label-width="formLabelWidth">
        <el-form-item :error="groupFormError.group_code" label="角色代码">
          <el-input v-model="groupForm.group_code" />
        </el-form-item>
        <el-form-item :error="groupFormError.name" label="角色名称">
          <el-input v-model="groupForm.name" />
        </el-form-item>
        <el-form-item :error="groupFormError.use_flag" label="是否使用">
          <el-switch v-model="groupForm.use_flag" />
        </el-form-item>
        <el-form-item label="权限" size="medium">
          <el-transfer
            v-model="groupForm.permissions"
            :titles="['可用 权限', '选中的 权限']"
            :props="{key: 'id', label: 'name'}"
            :data="permissions"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateGroupVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreateGroup('groupForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="dialogEditGroupVisible">
      <el-form ref="groupForm" :model="groupForm" :label-width="formLabelWidth">
        <el-form-item :error="groupFormError.group_code" label="角色代码">
          <el-input v-model="groupForm.group_code" />
        </el-form-item>
        <el-form-item :error="groupFormError.name" label="角色名称">
          <el-input v-model="groupForm.name" />
        </el-form-item>
        <el-form-item :error="groupFormError.use_flag" label="是否使用">
          <el-switch v-model="groupForm.use_flag" />
        </el-form-item>

        <el-form-item label="权限" size="medium">
          <el-transfer
            v-model="groupForm.permissions"
            :titles="['可用 权限', '选中的 权限']"
            :props="{key: 'id', label: 'name'}"
            :data="permissions"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditGroupVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditGroup('groupForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGroup, postGroup, putGroup, deleteGroup, getPermission } from '@/api/group-manage'
import page from '@/components/page'
export default {
  components: { page },
  data: function() {
    return {
      formLabelWidth: 'auto',
      dialogCreateGroupVisible: false,
      tableData: [],
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
      dialogEditGroupVisible: false,
      group_code: '',
      name: '',
      getParams: {
        page: 1
      },
      currentPage: 1,
      total: 0,
      permissions: []
    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    getGroupList() {
      getGroup(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    groupCodeChanged: function() {
      this.getParams.page = 1
      this.beforeGetData()
      this.getGroupList()
    },
    nameChanged: function() {
      this.getParams.page = 1
      this.beforeGetData()
      this.getGroupList()
    },
    beforeGetData() {
      this.getParams['group_code'] = this.group_code
      this.getParams['name'] = this.name
    },
    clearGroupForm: function() {
      this.groupForm = {

        name: '',
        group_code: '',
        use_flag: true
      }
    },
    clearGroupFormError: function() {
      this.groupFormError = {

        name: '',
        group_code: '',
        use_flag: ''
      }
    },
    showCreateGroupDialog: function() {
      this.clearGroupForm()
      this.clearGroupFormError()
      this.dialogCreateGroupVisible = true
      this.getPermissionList()
    },
    handleCreateGroup: function() {
      this.clearGroupFormError()
      var app = this
      postGroup(app.groupForm)
        .then(function(response) {
          app.dialogCreateGroupVisible = false
          app.$message(app.groupForm.name + '创建成功')
          app.currentChange(app.currentPage)
        }).catch(function(error) {
          for (var key in app.groupFormError) {
            if (error[key]) { app.groupFormError[key] = error[key].join(',') }
          }
        })
    },
    showEditGroupDialog: function(row) {
      this.clearGroupForm()
      this.clearGroupFormError()
      this.groupForm = Object.assign({}, row)
      this.dialogEditGroupVisible = true
      this.getPermissionList()
    },
    handleEditGroup: function() {
      const app = this
      putGroup(this.groupForm, this.groupForm.id)
        .then(function(response) {
          app.dialogEditGroupVisible = false
          app.$message(app.groupForm.name + '修改成功')
          app.currentChange(app.currentPage)
        }).catch(function(error) {
          for (var key in app.groupFormError) {
            if (error[key]) { app.groupFormError[key] = error[key].join(',') }
          }
        })
    },
    handleGroupDelete: function(row) {
      var app = this
      this.$confirm('此操作将永久删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(row.id)
          .then(function(response) {
            app.$message({
              type: 'success',
              message: '删除成功!'
            })
            app.currentChange(app.currentPage)
          }).catch(function(error) {
            app.$message.error(error)
          })
      }).catch(() => {

      })
    },
    formatter: function(row, column) {
      return row.use_flag ? 'Y' : 'N'
    },
    getPermissionList() {
      getPermission().then(response => {
        this.permissions = response.results
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getGroupList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
