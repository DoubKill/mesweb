<template>
  <div>
    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <div v-loading="loading">
        <el-form :inline="true">
          <el-form-item label="胶料编码:">
            {{ objEdit.material_no }}
          </el-form-item>
          <el-form-item label="检测指标:">
            {{ objEdit.test_indicator_name }}
          </el-form-item>
          <el-form-item label="试验类型:">
            {{ objEdit.test_type_name }}
          </el-form-item>
          <el-form-item label="试验方法:">
            {{ objEdit.test_method_name }}
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          style="width: 100%"
          border
        >
          <el-table-column
            label="数据点名称"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.data_point" placeholder="请选择">
                <el-option
                  v-for="item in objEdit.data_points"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="上限"
          >
            <template slot-scope="scope">
              <div class="aaaaa">
                <el-input-number
                  v-model="scope.row.upper_limit"
                  controls-position="right"
                  :min="scope.row.lower_limit?keepTwo(scope.row.lower_limit +0.01):-Infinity"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="下限"
          >
            <template slot-scope="scope">
              <div class="aaaaa">
                <el-input-number
                  v-model="scope.row.lower_limit"
                  controls-position="right"
                  :max="scope.row.upper_limit?keepTwo(scope.row.upper_limit-0.01):Infinity"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="等级"
          >
            <template slot-scope="scope">
              <div class="aaaaa">
                <el-input-number
                  v-model="scope.row.level"
                  controls-position="right"
                  :min="0"
                  :step="1"
                  step-strictly
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="检测结果"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.result" placeholder="请输入检测结果" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="small" :disabled="disabledSubmit" @click="submitClick(scope.row)">保存</el-button>
                <!-- <el-button size="small" type="danger" @click="clickDelete(scope.$index,scope.row)">删除</el-button> -->
              </el-button-group>
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
    </el-dialog>
  </div>
</template>

<script>
import { matDataPointIndicators } from '@/api/base_w'
export default {
  props: {
    editShow: {
      type: Boolean,
      default: false
    },
    objEdit: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: true,
      disabledSubmit: false,
      tableData: [],
      dataPointList: []
    }
  },
  watch: {
    editShow(val) {
      this.dialogVisible = val
      if (val) {
        this.getInfo()
      }
    }
  },
  methods: {
    handleClose(done) {
      this.tableData = []
      this.$emit('handleCloseEdit')
      done()
    },
    async getInfo() {
      try {
        const data = await matDataPointIndicators('get', null, { params: {
          material_test_method_id: this.objEdit.id
        }})
        this.tableData = data
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async submitClick(row) {
      try {
        // console.log(row, 666)
        row.material_test_method = this.objEdit.id
        this.titleInfo(row.level, '请输入等级')
        this.titleInfo(row.result, '请输入结果')
        this.titleInfo(row.upper_limit, '请输入上限')
        this.titleInfo(row.lower_limit, '请输入下限')
        this.titleInfo(row.data_point, '请输入数据点')
        this.disabledSubmit = true
        const _api = row.id ? 'put' : 'post'
        const id = row.id || null
        await matDataPointIndicators(_api, id, { data: row })
        this.disabledSubmit = false
        this.$message.success('保存成功')
      } catch (e) {
        this.disabledSubmit = false
      }
    },
    titleInfo(val, error) {
      if (!val) {
        this.$message.info(error)
        throw new Error(error)
      }
    },
    async clickDelete(index, row) {
      this.$confirm(
        '是否删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        if (row.id) {
          await matDataPointIndicators('delete', row.id)
        }
        this.$message.success('删除成功')
        this.tableData.splice(index, 1)
      }).catch(() => {
        //
      })
    },
    addCell() {
      this.tableData.push({})
    },
    keepTwo(val) {
      // 不四舍五入
      return Math.floor(val * 100) / 100
    }
  }
}
// function keepTwo(val) {
//   // 不四舍五入
//   return Math.floor(val * 100) / 100
// }
</script>

<style lang="scss">
    .aaaaa{
        .el-input-number{
                width: 100%;
        }
    }
</style>
