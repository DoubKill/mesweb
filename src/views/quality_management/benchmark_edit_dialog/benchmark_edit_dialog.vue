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
        <div style="margin-bottom:5px;line-height:19px">
          提示：请每个数据点最少一个合格检测结果、等级不能重复、
          <br>
          每一排上下限请给个连续区间范围(比如：第一排1-10;第二排11-100;第三排101-200,以此类推)
          <br>
          请单行保存
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          border
        >
          <el-table-column
            label="数据点名称"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.data_point"
                placeholder="请选择"
                @change="changeMonitor(scope.$index)"
              >
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
                  @change="changeMonitor(scope.$index)"
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
                  @change="changeMonitor(scope.$index)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="等级"
          >
            <template slot-scope="scope">
              <grade-manage-select
                :created-is="true"
                :default-val="scope.row.level"
                @changSelect="changSelectLevel($event,scope.row,scope.$index)"
              />
              <span v-if="false">{{ scope.row }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="检测结果"
          >
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.result" placeholder="请输入检测结果" /> -->
              {{ scope.row.result }}
            </template>
          </el-table-column>
          <el-table-column
            label="更新人"
          >
            <template slot-scope="scope">
              {{ scope.row.last_updated_username || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            label="更新时间"
          >
            <template slot-scope="scope">
              {{ scope.row.last_updated_date || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="small" :disabled="disabledSubmit" @click="submitClick(scope.row)">保存</el-button>
                <el-button size="small" type="primary" @click="viewClick(scope.row)">查看履历</el-button>
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
    <el-dialog
      title="履历记录"
      :visible.sync="dialogVisible1"
      width="80%"
    >
      <el-table
        :data="tableData1"
        style="width: 100%"
        border
      >
        <el-table-column
          label="数据点名称"
          prop="data_point_name"
        />
        <el-table-column
          label="上限"
          prop="upper_limit"
        />
        <el-table-column
          label="下限"
          prop="lower_limit"
        />
        <el-table-column
          label="等级"
          prop="level"
        />
        <el-table-column
          label="检测结果"
          prop="result"
        />
        <el-table-column
          label="更新人"
        >
          <template slot-scope="scope">
            {{ scope.row.created_username || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="created_date"
        />
      </el-table>
      <page
        :old-page="false"
        :total="total"
        :current-page="page"
        @currentChange="currentChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import { matDataPointIndicators, matDataPointIndicatorsHistory } from '@/api/base_w'
import gradeManageSelect from '@/components/select_w/gradeManageSelect'
import { deepClone } from '@/utils/index'
import page from '@/components/page'

export default {
  components: { gradeManageSelect, page },
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
      changeRow: {},
      dialogVisible: false,
      loading: true,
      disabledSubmit: false,
      tableData: [],
      dataPointList: [],
      dialogVisible1: false,
      tableData1: [],
      currentRowDialog: {},
      total: 0,
      page: 1,
      page_size: 10
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
    changeMonitor(index) {
      this.changeRow.bool = true
      this.changeRow.index = index
    },
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
        row.material_test_method = this.objEdit.id
        this.titleInfo(row.level, '请输入等级')
        this.titleInfo(row.result, '请输入结果')
        this.titleInfo(row.upper_limit, '请输入上限')
        this.titleInfo(row.lower_limit, '请输入下限')
        this.titleInfo(row.data_point, '请输入数据点')

        this.setRange(row)

        this.changeRow.bool = false
        this.disabledSubmit = true
        const _api = row.id ? 'put' : 'post'
        const id = row.id || null
        await matDataPointIndicators(_api, id, { data: row })
        this.disabledSubmit = false
        this.$message.success('保存成功')
        this.getInfo()
      } catch (e) {
        this.disabledSubmit = false
      }
    },
    viewClick(row) {
      this.currentRowDialog = row
      this.dialogVisible1 = true
      this.page = 1
      this.page_size = 10
      this.getResume()
    },
    async getResume() {
      try {
        const data = await matDataPointIndicatorsHistory('get', null, { params: {
          product_no: this.objEdit.material_no,
          data_point_id: this.currentRowDialog.data_point,
          level: this.currentRowDialog.level,
          page: this.page,
          page_size: this.page_size,
          test_method_id: this.objEdit.test_method
        }})
        this.tableData1 = data.results
        this.total = data.count
      } catch (e) {
        this.tableData1 = []
      }
    },
    currentChange(page, page_size) {
      this.page = page
      this.page_size = page_size
      this.getResume()
    },
    setRange(row) {
      let arr = deepClone(this.tableData)
      arr = arr.filter(D => D.data_point === row.data_point)
      arr.sort(sortLimit)
      let i = null
      arr.forEach((D, index) => {
        if (D.id === row.id) {
          i = index
        }
      })
      if (i - 1 > -1) {
        const previousObj = arr[i - 1]
        if (previousObj.upper_limit >= row.lower_limit) {
          this.$message.info('当前行上下限范围重叠!')
          throw new Error('error')
        }
      }
      if (i + 2 <= arr.length) {
        // 最小的
        const nextObj = arr[i + 1]
        if (nextObj.lower_limit <= row.upper_limit) {
          this.$message.info('当前行上下限范围重叠!')
          throw new Error('error')
        }
      }
    },
    titleInfo(val, error) {
      if (!val && val !== 0) {
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
      if (this.changeRow.bool) {
        this.$message({
          message: (this.changeRow.index + 1) + '行数据未保存，保存会刷新页面',
          type: 'info',
          offset: 150
        })
      }
    },
    keepTwo(val) {
      // 不四舍五入
      return Math.floor(val * 100) / 100
    },
    changSelectLevel(val, row, index) {
      this.$set(row, 'result', val.deal_result)
      this.$set(row, 'level', val.id)
      this.changeMonitor(index)
    }
  }
}
// function keepTwo(val) {
//   // 不四舍五入
//   return Math.floor(val * 100) / 100
// }
function sortLimit(a, b) {
  return a.lower_limit - b.lower_limit
}
</script>

<style lang="scss">
    .aaaaa{
        .el-input-number{
                width: 100%;
        }
    }
</style>
