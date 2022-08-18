<template>
  <div class="scorching-style">
    <!-- 焦烧时间录入及查询 -->
    <el-form :inline="true">
      <el-form-item label="配方类别">
        <el-select v-model="search.recipe_type" clearable @change="changeSearch">
          <el-option
            v-for="item in optionsType"
            :key="item.id"
            :label="item.global_no"
            :value="item.global_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="规格"
      >
        <el-select v-model="search.product_no" filterable placeholder="请选择" clearable @visible-change="getProductList" @change="changeSearch">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.material_no"
            :value="item.material_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="月份">
        <el-date-picker
          v-model="value"
          value-format="yyyy-MM"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select
          @classSelected="classSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['scorch_time', 'export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-button v-permission="['scorch_time', 'add']" type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
      :header-cell-style="rowClass"
    >
      <el-table-column v-if="!btnExportLoad" fixed="right" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button
            v-permission="['scorch_time', 'change']"
            type="primary"
            size="mini"
            @click="showEditDialog(scope.row)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        :fixed="!btnExportLoad"
        align="center"
        prop="recipe_type"
        label="配方类别"
        min-width="80"
      />
      <el-table-column
        :fixed="!btnExportLoad"
        align="center"
        prop="product_no"
        label="规格"
        min-width="80"
      />
      <el-table-column
        v-for="(herder,index) in tableHeader"
        :key="index"
        align="center"
        :label="herder"
        min-width="140"
      >
        <el-table-column v-for="(item1,d) in getLength(tableData, herder)" :key="d" :label="item1.toString()" min-width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row[herder]">
              {{ scope.row[herder][item1-1]?scope.row[herder][item1-1].test_time+'min\n'+scope.row[herder][item1-1].equip_no +'@'+ scope.row[herder][item1-1].test_method_name +'/'+ scope.row[herder][item1-1].classes:null }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>

    </el-table>
    <el-dialog
      title="新建焦烧检测结果"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
      >
        <el-form-item label="配方类别" prop="recipe_type">
          <el-select v-model="dialogForm.recipe_type">
            <el-option
              v-for="item in optionsType"
              :key="item.id"
              :label="item.global_no"
              :value="item.global_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="规格"
          prop="product_no"
        >
          <el-select v-model="dialogForm.product_no" filterable placeholder="请选择" clearable @visible-change="getProductList">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.material_no"
              :value="item.material_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="机台" prop="equip_no">
          <equip-select
            equip-type="密炼设备"
            :is-create="true"
            :default-val="dialogForm.equip_no"
            @equipSelected="equipSelected"
          />
        </el-form-item>
        <el-form-item label="日期" prop="input_date">
          <el-date-picker
            v-model="dialogForm.input_date"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="班次" prop="classes">
          <class-select
            :value-default="dialogForm.classes"
            :is-clearable="false"
            @classSelected="classChanged"
          />
        </el-form-item>
        <el-form-item label="检测方法" prop="test_method_name">
          <el-select v-model="dialogForm.test_method_name">
            <el-option
              v-for="item in optionsTestMethod"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="检测结果（分钟）"
          prop="test_time"
        >
          <el-input-number v-model="dialogForm.test_time" style="width:200px" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑焦烧检测结果"
      :visible.sync="dialogVisibleEdit"
      width="80%"
    >
      <el-form :inline="true">
        <el-form-item label="配方类别">
          <el-input v-model="searchView.recipe_type" disabled />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="searchView.product_no" disabled />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd"
            type="date"
            @change="changeDateEdit"
          />
        </el-form-item>
        <el-button
          type="primary"
          @click="dialogVisibleEdit=false"
        >返回
        </el-button>
      </el-form>
      <el-table
        v-loading="loadingView"
        highlight-current-row
        max-height="600"
        :data="tableDataView"
        border
      >
        <el-table-column
          prop="input_date"
          label="日期"
          min-width="20"
        />
        <el-table-column
          label="机台"
          min-width="20"
        >
          <template slot-scope="scope">
            <equip-select
              equip-type="密炼设备"
              :is-create="true"
              :default-val="scope.row.equip_no"
              @equipSelected="equipSelectedEdit($event,scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="班次"
          min-width="20"
        >
          <template slot-scope="scope">
            <class-select
              :value-default="scope.row.classes"
              :is-clearable="false"
              @classSelected="classChangedEdit($event,scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="检测方法"
          min-width="20"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.test_method_name">
              <el-option
                v-for="item in optionsTestMethod"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="检测分钟"
          min-width="20"
        >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.test_time" style="width:200px" controls-position="right" :min="0" />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['scorch_time', 'change']"
              type="primary"
              size="mini"
              @click="save(scope.row)"
            >保存
            </el-button>
            <el-button
              v-permission="['scorch_time', 'delete']"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer" />
    </el-dialog>
  </div>
</template>

<script>
import { batchingMaterials, testSubTypes, classesListUrl } from '@/api/base_w'
import { exportExcel } from '@/utils/index'
import EquipSelect from '@/components/EquipSelect'
import { debounce } from '@/utils'
import classSelect from '@/components/ClassSelect'
import { scorchTime } from '@/api/jqy'
export default {
  name: 'EquipmentMasterDataLocation',
  components: { EquipSelect, classSelect },
  data() {
    return {
      search: { combine_flag: 1 },
      searchView: {},
      date: '',
      tableData: [],
      tableDataView: [],
      value: [],
      options: [],
      optionsType: [],
      tableHeader: [],
      optionsTestMethod: [],
      loading: false,
      loadingView: false,
      btnExportLoad: false,
      dialogVisible: false,
      dialogVisibleEdit: false,
      rules: {
        recipe_type: [{ required: true, message: '不能为空', trigger: 'change' }],
        product_no: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_no: [{ required: true, message: '不能为空', trigger: 'change' }],
        input_date: [{ required: true, message: '不能为空', trigger: 'change' }],
        classes: [{ required: true, message: '不能为空', trigger: 'change' }],
        test_method_name: [{ required: true, message: '不能为空', trigger: 'change' }],
        test_time: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      dialogForm: {},
      btnLoading: false
    }
  },
  created() {
    this.getList()
    this.getType()
    this.getTestMethod()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await scorchTime('get', null, { params: this.search })
        this.tableData = data.data || []
        this.tableHeader = data.dates
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeDate() {
      if (this.value) {
        this.search.st = this.value[0] + '-01'
        this.search.et = getLastDay(this.value[1].split('-')[0], this.value[1].split('-')[1])
      } else {
        delete this.search.st
        delete this.search.et
      }
      this.getList()
    },
    changeDateEdit() {
      if (this.date) {
        this.searchView.st = this.date
        this.searchView.et = this.date
      } else {
        delete this.searchView.st
        delete this.searchView.et
      }
      this.showEditDialog()
    },
    debounceList() {
      debounce(this, 'changeSearch')
    },
    async onSubmit() {
      this.dialogForm = { }
      this.dialogVisible = true
    },
    exportTable() {
      setTimeout(d => {
        this.btnExportLoad = true
        setTimeout(d => {
          exportExcel('焦烧时间查询')
          this.btnExportLoad = false
        }, 1000)
      }, 100)
    },
    rowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1) {
        return {
          display: 'none'
        }
      }
    },
    async getType() {
      const obj = { all: 1, class_name: '配方类别' }
      const data = await classesListUrl('get', null, { params: obj })
      this.optionsType = data.results
    },
    async getProductList(val) {
      if (val) {
        try {
          const data = await batchingMaterials('get', null, { params: { all: 1, stage: 'FM,RFM,RE' }})
          this.options = data || []
        } catch (e) {
        //
        }
      }
    },
    async getTestMethod() {
      try {
        const data = await testSubTypes('get', null, { params: { all: 1 }})
        this.optionsTestMethod = data.results || []
      } catch (e) {
        //
      }
    },
    async showEditDialog(row) {
      if (row) {
        this.date = ''
        this.searchView = { recipe_type: row.recipe_type, product_no: row.product_no }
      }
      try {
        this.dialogVisibleEdit = true
        this.loadingView = true
        const data = await scorchTime('get', null, { params: this.searchView })
        this.tableDataView = data || []
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
    },
    classSearch(val) {
      this.search.classes = val
      this.getList()
    },
    classChangedEdit(val, row) {
      this.$set(row, 'classes', val)
    },
    classChanged(val) {
      this.$set(this.dialogForm, 'classes', val)
    },
    equipSelected(obj) {
      this.$set(this.dialogForm, 'equip_no', obj ? obj.equip_no : '')
    },
    equipSelectedEdit(obj, row) {
      this.$set(row, 'equip_no', obj ? obj.equip_no : '')
    },
    changeSearch() {
      this.getList()
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.createForm.resetFields()
      if (done) {
        done()
      }
    },
    getLength(arr, date) {
      var a = arr
      var max = 0
      for (var i = 0; i < a.length; i++) {
        if (a[i][date]) {
          if (max < a[i][date].length) {
            max = a[i][date].length
            var b = i
          }
        }
      }
      return a[b][date].length
    },
    handleDelete(row) {
      this.$confirm('此操作将删除此检测结果是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        scorchTime('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
            this.showEditDialog()
          })
      })
    },
    async save(row) {
      try {
        await scorchTime('put', row.id, { data: row })
        this.$message.success('操作成功')
        this.getList()
      } catch (e) {
        // this.btnLoading = false
      }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            await scorchTime('post', null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.btnLoading = false
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
function getLastDay(year, month) {
  var new_year = year // 取当前的年份
  var new_month = month// 取下一个月的第一天，方便计算（最后一天不固定）
  if (month > 12) {
    new_month -= 12 // 月份减
    new_year++ // 年份增
  }
  var new_date = new Date(new_year, new_month, 1) // 取当年当月中的第一天
  return year + '-' + month + '-' + (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate()// 获取当月最后一天日期
}
</script>

<style lang="scss">
.scorching-style{
  .el-input{
    width:200px;
  }
  .el-table{
    .cell {
      white-space: pre-line;
    }
    .gutter{
      display: none;
    }
    }
}
</style>

