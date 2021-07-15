<template>
  <div>
    <!-- 料包有效期管理 -->
    <el-form :inline="true">
      <el-form-item label="配方号">
        <el-input
          v-model="search.product_no"
          clearable
          placeholder="配方号"
          @input="debounceListChange"
        />
      </el-form-item>
      <el-form-item label="配方名称">
        <el-input
          v-model="search.product_name"
          clearable
          placeholder="配方名称"
          @input="debounceListChange"
        />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%;margin-top:20px;"
      border
    >
      <el-table-column
        prop="product_no"
        label="配方号"
        min-width="20"
      />
      <el-table-column
        prop="product_name"
        label="配方名称"
        min-width="20"
      />
      <el-table-column
        label="硫磺包有效时长（天）"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-input-number
            v-model="row.package_sulfur_usefullife"
            controls-position="right"
            :min="0"
            :step-strictly="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="细料包有效时长（天）"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-input-number
            v-model="row.package_fine_usefullife"
            controls-position="right"
            :min="0"
            :step="1"
            :step-strictly="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="20"
      >
        <template slot-scope="scoped">
          <el-button :loading="loadingBtn" @click="buttonSubmit(scoped.row,scoped.$index)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { weightingPackageExpire } from '@/api/base_w_four'
export default {
  name: 'SmallMaterialWeightValid',
  data() {
    return {
      search: {},
      tableData: [],
      loading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await weightingPackageExpire('get', null, { params: this.search })
        this.tableData = data
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    debounceListChange() {
      debounce(this, 'getList')
    },
    async buttonSubmit(row, index) {
      try {
        this.loadingBtn = true
        await weightingPackageExpire('post', null, { data: row })
        this.$message.success(row.product_no + '修改成功')
        this.loadingBtn = false
      } catch (e) {
        this.loadingBtn = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .el-input{
        width:auto;
    }
</style>
