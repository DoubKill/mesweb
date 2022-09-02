<template>
  <div
    v-loading="loading"
    class="transferLimit"
  >
    <h3 v-if="!sectionId && !groupId" style="color:red">请选择部门</h3>
    <el-table
      v-if="permissionsData.length>0"
      :data="permissionsData"
      style="width: 100%"
      border
      row-key="id"
    >
      <el-table-column
        prop="name"
        label="菜单"
        width="180"
      />
      <el-table-column label="权限">
        <template slot="header" slot-scope="scope">
          权限
          <el-checkbox
            v-model="checkAll"
            style="margin-left:20px"
            @change="checkAllChange"
          >全选</el-checkbox>
          <span v-if="false">{{ scope }}</span>
        </template>
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checkAll"
            @change="handleCheckAllChange($event,scope.row,scope.row.permissions)"
          >全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group
            v-model="scope.row.checkedCities"
            @change="handleCheckedCitiesChange($event,scope.row)"
          >
            <el-checkbox
              v-for="itemData in scope.row.permissions"
              :key="itemData.id"
              :label="itemData.id"
            >{{ itemData.name }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { permissions } from '@/api/permission'
export default {
  props: {
    defaultPermissions: {
      type: Array,
      default: () => {
        return []
      }
    },
    groupId: {
      type: Number,
      default: 0
    },
    menu: {
      type: [Number, String],
      default: ''
    },
    sectionId: {
      type: [Number, String],
      default: ''
    },
    viewSectionPermission: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      permissionsData: [],
      loading: false,
      checkAll: false,
      permissionsDataAll: []
    }
  },
  computed: {
  },
  watch: {
    groupId() {
      this.permissionsData.forEach(data => { // 查看角色
        data.permissions.forEach(D => {
          D.checkedCities = []
        })
        data.checkAll = false
      })
      this.getPermissions()
    },
    sectionId() {
      this.permissionsData.forEach(data => {
        data.permissions.forEach(D => {
          D.checkedCities = []
        })
        data.checkAll = false
      })
      if (!this.groupId) {
        this.getPermissions()
      }
    },
    menu(val) {
      if (val) {
        this.permissionsData = this.permissionsDataAll.filter(item => {
          return item.name.toLowerCase()
            .indexOf(val.toLowerCase()) > -1
        })
      } else {
        this.permissionsData = this.permissionsDataAll
      }
    }
  },
  mounted() {
    this.getPermissions()
  },
  methods: {
    getPermissions() {
      this.permissionsData = []
      if (!this.sectionId && !this.groupId) {
        return
      }
      this.loading = true
      let obj = {}
      if (this.sectionId) {
        obj.section_id = this.sectionId
      } else {
        delete obj.section_id
      }
      if (this.viewSectionPermission) {
        obj.view_section_permission = 1
      } else {
        delete obj.view_section_permission
      }
      if (this.groupId) {
        obj = { group_id: this.groupId }
      }

      permissions('get', null, { params: obj }).then(response => {
        const permissionsArr = response.result || []
        this.permissionsData = permissionsArr
        this.permissionsList = permissionsArr
        if (this.defaultPermissions && this.defaultPermissions.length) {
          // 设置默认值
          this.permissionsData.forEach(d => {
            if (d.permissions) {
              d.permissions.forEach(dd => {
                this.defaultPermissions.forEach(D => {
                  if (dd.id === D) {
                    dd.has_permission = true
                  }
                })
              })
            }
          })
        }

        this.permissionsData.forEach(data => {
          const arr = []
          data.permissions.forEach(D => {
            if (D.has_permission) {
              arr.push(D.id)
            }
          })
          if (data.permissions.length === arr.length) {
            this.$set(data, 'checkAll', true)
          } else {
            this.$set(data, 'checkAll', false)
          }
          this.$set(data, 'checkedCities', arr)
        })

        this.permissionsDataAll = this.permissionsData
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCheckAllChange(val, row, permissionsList) {
      const arr = []
      permissionsList.forEach(D => {
        arr.push(D.id)
      })
      if (val) {
        row.checkedCities = arr
      } else {
        row.checkedCities = []
      }
      this.setPermissionsData()
    },
    handleCheckedCitiesChange(data, row) {
      const checkedCount = data.length
      row.checkAll = checkedCount === row.permissions.length
      this.setPermissionsData()
    },
    setPermissionsData(permissionsData) {
      const arr = []
      this.permissionsList.forEach(Data => {
        arr.push(...Data.checkedCities)
      })
      this.$emit('changeTransferPermissions', arr)
    },
    checkAllChange(bool) {
      this.permissionsData.forEach(data => {
        const arr = []
        data.permissions.forEach(D => {
          D.has_permission = bool
          if (D.has_permission) {
            arr.push(D.id)
          }
        })
        if (data.permissions.length === arr.length) {
          this.$set(data, 'checkAll', true)
        } else {
          this.$set(data, 'checkAll', false)
        }
        this.$set(data, 'checkedCities', arr)
      })

      this.setPermissionsData()
    }
  }
}
</script>

<style lang="scss" scoped>
.transferLimit{
  height: 500px;
  overflow-y: scroll;
}
</style>
