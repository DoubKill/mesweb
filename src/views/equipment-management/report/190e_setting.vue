<template>
  <div>
    <!--  190E机台规格信息维护  -->
    <el-form :inline="true" style="width:60%">
      <el-form-item label="规格">
        <el-select
          v-model="search.specification"
          placeholder="请选择规格"
          filterable
          clearable
          @change="getList"
        >
          <el-option
            v-for="item in optionsProduct"
            :key="item.id"
            :label="item.product_name"
            :value="item.product_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-upload
          v-permission="['equip_190e','import']"
          style="display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      style="width:60%"
      :data="tableData"
      border
      max-height="600px"
    >
      <el-table-column
        prop="keyword_no"
        label="规格"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-select
            v-if="row.isEdit"
            v-model="row.specification"
            placeholder="请选择规格"
            filterable
          >
            <el-option
              v-for="item in optionsProduct"
              :key="item.id"
              :label="item.product_name"
              :value="item.product_name"
            />
          </el-select>
          <span v-else>{{ row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="段数"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-select
            v-if="row.isEdit"
            v-model="row.state"
            placeholder="请选择段数"
            filterable
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
          <span v-else>{{ row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量kg"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-input-number v-if="row.isEdit" v-model="row.weight" controls-position="right" :min="0" />
          <span v-else>{{ row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['equip_190e','delete']"
            size="mini"
            :disabled="(scope.row.isEdit&&scope.row.id)?true:false"
            type="danger"
            @click="handleDisposeDelete(scope.row)"
          >
            删除
          </el-button>
          <div v-permission="['equip_190e','change']" style="display:inline-block">
            <el-button
              v-if="!scope.row.isEdit&&scope.row.id"
              size="mini"
              type="primary"
              @click="handleDisposeEdit(scope.row)"
            >
              编辑
            </el-button>
          </div>
          <el-button
            v-if="scope.row.isEdit"
            size="mini"
            type="primary"
            @click="handleDisposeSubmit(scope.row)"
          >
            保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="width:60%;text-align:center;margin-top:15px">
      <el-button
        v-permission="['equip_190e','add']"
        size="small"
        @click="addCellDispose"
      >插入一行</el-button>
    </div>
  </div>
</template>

<script>
import { classesListUrl, productInfosUrl } from '@/api/base_w'
import { equip190e, equip190eImport } from '@/api/jqy'

export default {
  name: 'SettingE190',
  data() {
    return {
      search: {},
      tableData: [],
      options: [],
      optionsProduct: [],
      loading: false
    }
  },
  created() {
    this.getList()
    this.getProduct()
    this.classesChange()
  },
  methods: {
    async getProduct() {
      try {
        const data = await productInfosUrl('get', null, { params: { all: 1 }})
        this.optionsProduct = data.results || []
      } catch (e) {
        //
      }
    },
    async classesChange() {
      const obj = { all: 1, class_name: '胶料段次' }
      const data = await classesListUrl('get', null, { params: obj })
      this.options = data.results
    },
    async getList() {
      try {
        this.loading = true
        const data = await equip190e('get', null, { params: this.search })
        this.tableData = data.results || []
      } catch (e) {
        //
      }
      this.loading = false
    },
    handleDisposeDelete(row) {
      if (!row.id) {
        this.tableData.splice(this.tableData.length - 1, 1)
        return
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equip190e('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }).catch(e => {
          })
      })
    },
    handleDisposeEdit(row) {
      this.$set(row, 'isEdit', true)
    },
    addCellDispose() {
      this.tableData.push({ isEdit: true })
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      equip190eImport('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: response
        })
        this.getList()
      })
    },
    handleDisposeSubmit(row) {
      if (!row.specification || !row.state || !row.weight) {
        this.$message.info('规格、段数、重量必填')
        return
      }
      const _api = row.id ? 'put' : 'post'
      equip190e(_api, row.id, { data: row })
        .then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$set(row, 'isEdit', false)
          this.getList()
        }).catch(e => {
        })
    }
  }
}
</script>

<style>

</style>
