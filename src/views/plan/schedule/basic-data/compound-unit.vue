<template>
  <div v-loading="loading">
    <!-- 胶料/单位关键字定义 -->
    <el-table
      :data="tableDataKeyword"
      border
      max-height="300px"
    >
      <el-table-column
        prop="keyword_no"
        label="关键字编号"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-input v-if="row.isEdit" v-model="row.keyword_no" />
          <span v-else>{{ row.keyword_no }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="keyword_name"
        label="关键字名称"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-input v-if="row.isEdit" v-model="row.keyword_name" />
          <span v-else>{{ row.keyword_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="product_nos"
        label="指定规格"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-input v-if="row.isEdit" v-model="row.product_nos" />
          <span v-else>{{ row.product_nos }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="note"
        label="备注"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-input v-if="row.isEdit" v-model="row.note" />
          <span v-else>{{ row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="(scope.row.isEdit&&scope.row.id)?true:false"
            type="danger"
            @click="handleKeywordDelete(scope.row)"
          >
            删除
          </el-button>
          <el-button
            v-if="!scope.row.isEdit&&scope.row.id"
            size="mini"
            type="primary"
            @click="handleKeywordEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.isEdit"
            size="mini"
            type="primary"
            @click="handleKeywordSubmit(scope.row)"
          >
            保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="width:100%;text-align:center;margin-top:15px">
      <el-button
        size="small"
        @click="addCell"
      >插入一行</el-button>
    </div>
  </div>
</template>

<script>
import { schedulingPlaceKeyword } from '@/api/base_w_five'

export default {
  name: 'ScheduleCompoundUnit',
  data() {
    return {
      tableDataKeyword: [],
      loading: true
    }
  },
  created() {
    this.getKeywordList()
  },
  methods: {
    async getKeywordList() {
      try {
        this.loading = true
        const data = await schedulingPlaceKeyword('get', null, { params: {}})
        this.tableDataKeyword = data || []
      } catch (e) {
        //
      }
      this.loading = false
    },
    handleKeywordSubmit(row) {
      if (!row.keyword_name || !row.keyword_no || !row.product_nos) {
        this.$message.info('关键字编号、关键字名称、指定规格必填')
        return
      }
      const _api = row.id ? 'put' : 'post'
      schedulingPlaceKeyword(_api, row.id, { data: row })
        .then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$set(row, 'isEdit', false)
          this.getKeywordList()
        }).catch(e => {
        })
    },
    addCell() {
      this.tableDataKeyword.push({ isEdit: true })
    },
    handleKeywordEdit(row) {
      this.$set(row, 'isEdit', true)
    },
    handleKeywordDelete(row) {
      if (!row.id) {
        this.tableDataKeyword.splice(this.tableDataKeyword.length - 1, 1)
        return
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        schedulingPlaceKeyword('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getKeywordList()
          }).catch(e => {
          })
      })
    }
  }
}
</script>

<style>

</style>
