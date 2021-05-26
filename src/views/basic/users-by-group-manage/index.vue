<template>
  <div style="margin-top: 25px">
    <el-form :inline="true">
      <el-form-item label="角色">
        <el-input v-model="group_code" @input="groupCodeChanged" />
      </el-form-item>
      <el-form-item label="角色名">
        <el-input v-model="name" @input="nameChanged" />
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="12">
        <el-table
          :data="tableData"
          border
          highlight-current-row
          style="width: 100%"
          @current-change="handleGroupsCurrentRowChange"
        >
          <el-table-column
            align="center"
            type="index"
            label="No"
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
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="permissionObj.group_user.indexOf('change')>-1"
                size="mini"
                @click="showAddGroupUsersDialog(scope.row)"
              >编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-form :inline="true" />
        <el-table
          :data="usersByGroup"
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
            prop="username"
            label="用户名"
          />
        </el-table>
      </el-col>
    </el-row>
    <el-dialog :title="addGroupUsersTitle" :visible.sync="dialogAddGroupUsersDialogVisible">
      <el-form>
        <el-form-item label="用户">
          <el-transfer
            v-model="selectedUsers"
            :props="{key: 'id', label: 'username'}"
            :titles="['可用 用户', '选中的 用户']"
            :data="users"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddGroupUsersDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddGroupUsersDialog">确 定</el-button>
      </div>
    </el-dialog>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />
  </div>
</template>

<script>
import { getGroup, getUsersByGroup, putGroupAddUser } from '@/api/users-by-group-manage'
import page from '@/components/page'
import { mapGetters } from 'vuex'
export default {
  name: 'UsersByGroupManage',
  components: { page },
  data: function() {
    return {
      formLabelWidth: 'auto',
      tableData: [],
      groupsCurrentRow: null,
      usersByGroup: [],
      dialogAddGroupUsersDialogVisible: false,
      addGroupUsersTitle: '',
      users: [],
      selectedUsers: [],
      currentPage: 1,
      getParams: {
        page: 1
      },
      total: 0,
      group_code: '',
      name: ''
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
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
    getUsersByGrouplist() {
      getUsersByGroup().then(response => {
        this.users = response.results
      })
    },
    handleGroupsCurrentRowChange: function(row) {
      if (!row) { return }
      var app = this
      this.groupsCurrentRow = row
      getUsersByGroup({ groups: row.id }).then(function(response) {
        app.usersByGroup = response.results
        app.selectedUsers = []
        for (var index in app.usersByGroup) {
          app.selectedUsers.push(app.usersByGroup[index].id)
        }
      }).catch(function(error) {
        this.$message.error(error)
      })
    },
    showAddGroupUsersDialog(row) {
      this.getUsersByGrouplist()
      this.addGroupUsersTitle = '编辑' + row.name + '所属用户'
      this.dialogAddGroupUsersDialogVisible = true
    },
    handleAddGroupUsersDialog() {
      var app = this
      putGroupAddUser({ group_users: app.selectedUsers }, app.groupsCurrentRow.id).then(function(response) {
        app.$message(app.groupsCurrentRow.name + '修改成功')
        app.handleGroupsCurrentRowChange(app.groupsCurrentRow)
        app.dialogAddGroupUsersDialogVisible = false
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
