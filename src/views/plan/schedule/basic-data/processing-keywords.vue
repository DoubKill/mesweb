<template>
  <div v-loading="loading">
    <!-- 处理关键字定义 -->
    <el-table
      :data="tableDataDispose"
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
            v-permission="['aps_opera_keyword','delete']"
            size="mini"
            :disabled="(scope.row.isEdit&&scope.row.id)?true:false"
            type="danger"
            @click="handleDisposeDelete(scope.row)"
          >
            删除
          </el-button>
          <div v-permission="['aps_opera_keyword','change']" style="display:inline-block">
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
    <div style="width:100%;text-align:center;margin-top:15px">
      <el-button
        v-permission="['aps_opera_keyword','add']"
        size="small"
        @click="addCellDispose"
      >插入一行</el-button>
    </div>
  </div>
</template>

<script>
import { operaKeyword } from '@/api/base_w_five'

export default {
  name: 'ScheduleProcessingKeywords',
  data() {
    return {
      tableDataDispose: [],
      loading: false
    }
  },
  created() {
    this.getDisposeList()
  },
  methods: {
    async getDisposeList() {
      try {
        this.loading = true
        const data = await operaKeyword('get', null, { params: {}})
        this.tableDataDispose = data || []
      } catch (e) {
        //
      }
      this.loading = false
    },
    handleDisposeDelete(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        operaKeyword('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDisposeList()
          }).catch(e => {
          })
      })
    },
    handleDisposeEdit(row) {
      this.$set(row, 'isEdit', true)
    },
    addCellDispose() {
      this.tableDataDispose.push({ isEdit: true })
    },
    handleDisposeSubmit(row) {
      if (!row.keyword_name || !row.keyword_no) {
        this.$message.info('关键字编号、关键字名称必填')
        return
      }
      const _api = row.id ? 'put' : 'post'
      operaKeyword(_api, row.id, { data: row })
        .then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$set(row, 'isEdit', false)
          this.getDisposeList()
        }).catch(e => {
        })
    }
  }
}
</script>

<style>

</style>
