<template>
  <div
    v-loading="loading"
    class="userInfo"
  >
    <el-form :inline="true">
      <el-form-item label="工号">
        <el-input
          v-model.number="getParams.num"
          @input="numChanged"
        />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input
          v-model="getParams.username"
          @input="numChanged"
        />
      </el-form-item>
      <el-form-item label="是否使用">
        <el-select
          v-model="getParams.is_active"
          clearable
          placeholder="请选择"
          @change="numChanged"
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
        v-if="permissionObj.user.indexOf('add')>-1"
        style="float: right"
      >
        <el-button @click="showCreateUserDialog">新建</el-button>
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
        type="index"
        label="No"
        width="50"
      />
      <el-table-column label="工号" min-width="8">
        <template slot-scope="scope">
          {{ scope.row.num?scope.row.num:'--' }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="10"
        prop="username"
        label="用户名"
      />
      <el-table-column
        min-width="10"
        prop="phone_number"
        label="手机号"
      />
      <el-table-column
        min-width="10"
        prop="section_name"
        label="部门"
      />
      <el-table-column
        min-width="10"
        prop="workshop"
        label="职务"
      />
      <el-table-column
        min-width="10"
        prop="repair_group"
        label="班组"
      />
      <el-table-column
        min-width="10"
        prop="technology"
        label="技术资格"
      />
      <!-- <el-table-column label="组织">
        <template slot-scope="scope">
          {{ scope.row.section?scope.row.section:'--' }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        prop="is_leave"
        label="离职与否"
        width="80"
        :formatter="formatter"
      /> -->
      <el-table-column
        min-width="5"
        prop="use_flag"
        label="使用"
        :formatter="formatter"
      />
      <el-table-column label="创建人" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.created_username?scope.row.created_username:'--' }}
        </template>
      </el-table-column>
      <el-table-column label="创建日期" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.created_date?scope.row.created_date:'--' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="220"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="permissionObj.user.indexOf('change')>-1"
              size="mini"
              @click="showEditUserDialog(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-if="permissionObj.user.indexOf('delete')>-1"
              size="mini"
              type="danger"
              plain
              @click="handleUserDelete(scope.row)"
            >
              {{ scope.row.is_active?'停用':'启用' }}
            </el-button>
            <el-button
              v-if="permissionObj.user.indexOf('del')>-1"
              size="mini"
              type="danger"
              plain
              @click="userDelete(scope.row)"
            >
              删除
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
      :title="userForm.id?'编辑用户':'新增用户'"
      :visible.sync="dialogCreateUserVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="70%"
      style="min-width:900px"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="rules"
        label-width="100px"
        inline
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="userForm.username"
            :disabled="userForm.id ? true:false"
          />
        </el-form-item>
        <el-form-item
          v-if="userForm.id"
          label="修改密码"
          prop="modifypassword"
        >
          <el-input
            v-model="userForm.modifypassword"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          v-if="!userForm.id"
          label="密码"
          prop="password"
        >
          <el-input
            v-model="userForm.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="checkPass"
          :rules="{required: !userForm.id, validator: validatePass2, trigger: 'blur'}"
        >
          <el-input
            v-model="userForm.checkPass"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          v-if="!userForm.id"
          label="工号"
          prop="num"
        >
          <el-input
            v-model.number="userForm.num"
            :error="userFormError.num"
          />
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="phone_number"
        >
          <el-input
            v-model.number="userForm.phone_number"
            :error="userFormError.phone_number"
          />
        </el-form-item>
        <el-form-item
          label="职务"
        >
          <el-input
            v-model="userForm.workshop"
            placeholder="职务"
            :error="userFormError.workshop"
          />
        </el-form-item>
        <el-form-item
          label="班组"
        >
          <el-select v-model="userForm.repair_group" clearable placeholder="请选择">
            <el-option
              v-for="group in teamList"
              :key="group.id"
              :label="group.global_name"
              :value="group.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="技术资格"
        >
          <el-input
            v-model="userForm.technology"
            placeholder="技术资格"
            :error="userFormError.technology"
          />
        </el-form-item>
        <el-form-item
          label="部门"
          :error="userFormError.section"
        >
          <el-cascader
            v-model="userForm.section"
            :options="optionsSection"
            :props="{ checkStrictly: true,value:'id' }"
            clearable
            @change="changeSection"
          />
        </el-form-item>
        <br>
        <el-form-item
          label="角色"
          size="medium"
        >
          <transferRoles
            :default-groups="userForm.group_extensions"
            :groups="group_extensions"
            @changeTransferGroup="changeTransferGroup"
          />
        </el-form-item>
        <!-- <el-form-item
          label="权限"
          size="medium"
          class="permissions-transfer"
        >
          <transferLimit
            :default-permissions="userForm.user_permissions"
            :permissions-arr="permissionsArr"
            @changeTransferPermissions="changeTransferPermissions"
          />
        </el-form-item> -->
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateUserVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnloading"
          @click="handleCreateUser('userForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { personnelsUrl } from '@/api/user'
import { delUser } from '@/api/jqy'
import { sectionTree } from '@/api/base_w_four'
import { globalCodesUrl } from '@/api/base_w'
// import { permissions } from '@/api/permission'
import { roles } from '@/api/roles-manage'
import page from '@/components/page'
import { mapGetters } from 'vuex'
// import transferLimit from '@/components/select_w/transferLimit'
import transferRoles from '@/components/select_w/transferRoles'
export default {
  name: 'UserManage',
  components: { page, transferRoles },
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value && (value.length < 3 || value.length > 16)) {
        callback(new Error('请输入3~16位长度的密码'))
      } else {
        if (this.userForm.checkPass !== '') {
          this.$refs.userForm.validateField('checkPass')
        }
        callback()
      }
    }
    this.validatePass2 = (rule, value, callback) => {
      if (this.userForm.id) {
        if (this.userForm.modifypassword && value !== this.userForm.modifypassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名!'))
      } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/g.test(value)) {
        callback(new Error('用户名格式错误，请输入字母和数字组合'))
      } else if (value.length > 64) {
        callback(new Error('长度小于64个字符!'))
      } else if (value.length < 2) {
        callback(new Error('请输入最少两个字符!'))
      } else {
        callback()
      }
    }
    var validatePass4 = (rule, value, callback) => {
      if (value && (value.length < 3 || value.length > 16)) {
        callback(new Error('请输入3~16位长度的密码'))
      } else {
        callback()
      }
    }
    return {
      isError: false,
      isErrorOldPassword: false,
      titleOldPassword: '',
      titleNewPassword: true,
      btnloading: false,
      getParams: {
        page: 1,
        num: '',
        username: '',
        is_active: null
      },
      currentPage: 1,
      dialogCreateUserVisible: false,
      userForm: {
        username: '',
        password: '',
        checkPass: '',
        num: null,
        group_extensions: []
      },
      tableData: [],
      count: 0,
      rules: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        modifypassword: [
          { validator: validatePass4, trigger: 'blur' }
        ],
        username: [
          { required: true, validator: validatePass3, trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请填写工号', trigger: 'blur' }
        ]
      },
      // permissionsArr: [],
      group_extensions: [],
      loading: true,
      loadingTable: false,
      userFormError: {},
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
      teamList: []
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.loading = true
    if (this.permissionObj.user.indexOf('change') > -1 ||
      this.permissionObj.user.indexOf('add') > -1) {
      roles('get', null, {
        params: { all: 1 }
      }).then(response => {
        const groups = response.results
        groups.forEach(D => {
          D.key = D.id
          D.label = D.name
        })
        this.group_extensions = groups
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
      })
      // permissions('get', null).then(response => {
      //   const permissionsArr = response.results
      //   permissionsArr.forEach(D => {
      //     D.key = D.id
      //     D.label = D.name
      //   })
      //   this.permissionsArr = permissionsArr
      //   // eslint-disable-next-line handle-callback-err
      // }).catch(error => {
      // })
    }
    this.currentChange()
    this.getOptionsSection()
    this.getTeamList()
  },
  methods: {
    changeUsername(e) {
      this.userForm.username = e.target.value
    },
    blurUsername() {
      if (!this.userForm.username) {
        this.isError = true
      } else {
        this.isError = false
      }
    },
    changeOldPassword(e) {
      this.userForm.oldPassword = e.target.value
    },
    async getOptionsSection() {
      try {
        const data = await sectionTree('get')
        if (data.results && data.results[0].children.length > 0) {
          this.optionsSection = data.results[0].children
          this.optionsSection = filterMy(this.optionsSection)
        } else {
          this.optionsSection = []
        }
      } catch (error) {
        //
      }
    },
    async getTeamList() {
      try {
        const data = await globalCodesUrl('get', {
          params: {
            class_name: '班组'
          }
        })
        this.teamList = data.results || []
      } catch (error) {
        //
      }
    },
    changeSection(val) {
      // this.userForm.section = val.slice(-1)[0]
    },
    currentChange() {
      const app = this
      if (!this.loading) {
        this.loadingTable = true
      }
      personnelsUrl('get', null, {
        params: this.getParams
      }).then((response) => {
        this.count = response.count || 0
        app.tableData = response.results || []
        this.loading = false
        this.loadingTable = false
        // eslint-disable-next-line handle-callback-err
      }).catch((error) => {
        this.loading = false
        this.loadingTable = false
      })
    },
    numChanged() {
      this.getParams['page'] = 1
      this.currentChange()
    },
    userNameChanged() { },
    showCreateUserDialog() {
      this.clearUserForm()
      if (this.$refs['userForm']) { this.$refs['userForm'].resetFields() }
      this.dialogCreateUserVisible = true
    },
    clearUserForm() {
      this.userForm = {
        username: '',
        password: '',
        checkPass: '',
        num: null
      }
    },
    showEditUserDialog(row) {
      this.userForm = JSON.parse(JSON.stringify(row))
      this.dialogCreateUserVisible = true
    },
    handleUserDelete(row) {
      var boolStr = row.is_active ? '停用' : '启用'
      var app = this
      this.$confirm('确定' + boolStr + row.username + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        personnelsUrl('delete', row.id)
          .then((response) => {
            app.$message({
              type: 'success',
              message: '操作成功!'
            })
            app.currentChange()
          }).catch(() => {
          })
      }).catch(() => {
      })
    },
    userDelete(row) {
      var app = this
      this.$confirm('确定删除' + row.username + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        delUser('delete', row.id)
          .then((response) => {
            app.$message({
              type: 'success',
              message: '操作成功!'
            })
            app.currentChange()
          }).catch(() => {
          })
      }).catch(() => {
      })
    },
    changePage(page) {
      this.getParams['page'] = page
      this.currentChange()
    },
    handleCreateUser(formName) {
      var app = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // eslint-disable-next-line prefer-const
          let type = app.userForm.id ? 'put' : 'post'
          // eslint-disable-next-line prefer-const
          let paramsId = app.userForm.id ? app.userForm.id : ''
          if (app.userForm.id) {
            if (app.userForm.modifypassword) {
              app.userForm.password = app.userForm.modifypassword
            } else {
              delete app.userForm.password
            }
          }
          if (this.userForm.password === '') {
            delete app.userForm.password
          }
          if (this.userForm.num === '') {
            delete app.userForm.num
          }
          const obj = JSON.parse(JSON.stringify(app.userForm))
          if (obj.section && obj.section.length > 0 && obj.section instanceof Array) {
            obj.section = obj.section.slice(-1)[0]
          } else if (!obj.section || obj.section.length === 0) {
            obj.section = ''
          }
          this.btnloading = true
          personnelsUrl(type, paramsId, { data: obj })
            .then((response) => {
              app.dialogCreateUserVisible = false
              app.$message.success(app.userForm.username + '操作成功')
              app.currentChange()
              this.btnloading = false
            }).catch((e) => {
              this.userFormError = e
              this.btnloading = false
            })
        } else {
          return false
        }
      })
    },
    handleClose(done) {
      this.$refs['userForm'].resetFields()
      this.isError = false
      this.isErrorOldPassword = false
      done()
    },
    formatter: function(row, column) {
      return row.is_active ? 'Y' : 'N'
    },
    changeTransferGroup(val) {
      this.$set(this.userForm, 'group_extensions', val)
    }
    // changeTransferPermissions(val) {
    //   this.$set(this.userForm, 'user_permissions', val)
    // }
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
.userInfo{
  .el-input{
    width:auto;
  }
  .el-transfer__buttons{
      padding: 0 15px;
    }
  // .permissions-transfer{
    .el-transfer-panel{
      width: 240px;
    }
    .el-checkbox{
      margin-right: 5px;
    }
  // }

    .show-enter-active{
       transition:all .9s;
    }
    .show-leave-active{
       transition:all .1s;
    }
    .show-enter,.show-leave{
        margin-top:1px;

    }
     .show-enter-to,.show-leave-to{
        margin-top: 1px;
   }
}
</style>
