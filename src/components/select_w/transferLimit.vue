<template>
  <div
    v-loading="loading"
    class="transferLimit"
  >
    <el-table
      v-if="permissionsData.length>0"
      :data="permissionsData"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="菜单"
        width="180"
      />
      <el-table-column label="权限">
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
    }
  },
  data() {
    return {
      permissionsData: [],
      loading: true
    }
  },
  computed: {
  },
  watch: {
    groupId() {
      this.permissionsData.forEach(data => {
        data.permissions.forEach(D => {
          D.checkedCities = []
        })
        data.checkAll = false
      })
      this.getPermissions()
    }
  },
  mounted() {
    this.getPermissions()
  },
  methods: {
    getPermissions() {
      this.loading = true
      let obj = {}
      if (this.groupId) {
        // eslint-disable-next-line object-curly-spacing
        obj = { params: { group_id: this.groupId } }
      }
      permissions('get', null, obj).then(response => {
        const permissionsArr = response.result || []
        this.permissionsData = permissionsArr
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
      this.permissionsData.forEach(Data => {
        arr.push(...Data.checkedCities)
      })
      this.$emit('changeTransferPermissions', arr)
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
