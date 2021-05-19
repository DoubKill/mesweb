<template>
  <div v-loading="loading">
    <!-- 快检类型管理 -->
    <el-form :inline="true">
      <el-form-item label="比值类型">
        <el-select v-model="search.compare" placeholder="请选择" @change="ratioTypeFun">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检测类型">
        <el-input v-model="search.name" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="downloadFun">下载模板</el-button>
        <el-upload
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="leadingInFun"
          :show-file-list="false"
        >
          <el-button type="primary">导入</el-button>
        </el-upload>
        <el-button type="primary" @click="addFun">添加快检类型</el-button>
      </el-form-item>
    </el-form>

    <el-row v-if="search.compare === 1" style="clear:both">
      <el-col :span="14">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column
            prop="id"
            label="id"
            width="80"
          />
          <el-table-column
            prop="name"
            label="检测类型"
          />
          <el-table-column
            prop="unit_name"
            width="120"
            label="单位"
          />
          <el-table-column
            label="操作"
            width="120"
          >
            <template slot-scope="{row}">
              <el-button
                size="mini"
                @click="editFun(row)"
              >编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10">
        <el-table
          :data="tableData1"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="upper_limit_value"
            label="上限值"
          />
          <el-table-column
            prop="lower_limiting_value"
            label="下限值"
          />
          <el-table-column
            prop="level"
            label="级别"
          />
        </el-table>
      </el-col>
    </el-row>

    <el-table
      v-if="search.compare === 2||search.compare === 3"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="id"
        label="id"
        width="80"
      />
      <el-table-column
        prop="name"
        label="检测类型"
      />
      <el-table-column
        prop="limit_value"
        width="120"
        label="边界值"
      />
      <el-table-column
        prop="unit_name"
        width="120"
        label="单位"
      />
      <el-table-column
        label="操作"
        width="120"
      >
        <template slot-scope="{row}">
          <el-button
            size="mini"
            @click="editFun(row)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="search.compare === 4"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="id"
        label="id"
        width="100"
      />
      <el-table-column
        prop="name"
        label="检测类型"
      />
      <el-table-column
        label="操作"
        width="140"
      >
        <template slot-scope="{row}">
          <el-button
            size="mini"
            @click="editFun(row)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :old-page="false"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      :title="(formData.id?'编辑':'添加')+'检测类型'"
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-form ref="formObj" inline :rules="rulesEquip" :model="formData" label-width="80px">
        <el-form-item label="比值类型" prop="interval_type">
          <el-select v-if="!formData.id" v-model="formData.interval_type" placeholder="请选择" @change="ratioTypeForm">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span v-else>{{ options.find(d=>d.id === formData.interval_type).name }}</span>
        </el-form-item>
        <el-form-item v-if="![4].includes(formData.interval_type)" label="单位">
          <el-select
            v-model="formData.unitname"
            placeholder="请选择"
            filterable
            allow-create
            default-first-option
          >
            <el-option
              v-for="item in optionsUnit"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <div v-if="[1].includes(formData.interval_type)">
          <div v-for="(item,index) in formData.standards" :key="index" class="dialogLevel">
            <div style="width:100%;height:0.5px;background:#DCDFE6;margin-bottom:10px" />
            <el-form-item
              label="级别"
              :prop="'standards.' + index + '.level'"
              :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }"
            >
              <el-input v-model="item.level" placeholder="请输入" />
            </el-form-item>
            <el-form-item
              label="上限值"
              :prop="'standards.' + index + '.upper_limit_value'"
              :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }"
            >
              <el-input-number
                v-model="item.upper_limit_value"
                controls-position="right"
                :min="item.lower_limiting_value?keepTwo(item.lower_limiting_value +0.01):-Infinity"
              />
            </el-form-item>
            <el-form-item
              label="下限值"
              :prop="'standards.' + index + '.lower_limiting_value'"
              :rules="{
                required: true, trigger: 'blur',
                validator:(rule, value, callback)=>{ validatorFun(value, callback,index,formData.standards)}
              }"
            >
              <el-input-number
                v-model="item.lower_limiting_value"
                controls-position="right"
                :max="item.upper_limit_value!==''?keepTwo(item.upper_limit_value-0.01):Infinity"
              />
            </el-form-item>
            <i v-if="formData.standards.length!==1" title="删除评级标准" class="el-icon-remove-outline dialogIconDEL" @click="delGrade(index)" />
            <i v-if="index===formData.standards.length-1" title="添加此评级标准" class="el-icon-circle-plus-outline dialogIconAdd" @click="addGrade" />
          </div>
          <div style="width:100%;height:0.5px;background:#DCDFE6;margin-bottom:10px" />
        </div>
        <el-form-item label="类型名称" prop="actual_name">
          <el-input v-model="formData.actual_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="[1].includes(formData.interval_type)" label="实际名称">
          {{ formData.actual_name }}
          <span v-if="formData.standards">
            <span v-if="formData.standards.filter(d=>Number(d.level) === 1)[0]">
              {{ formData.standards.filter(d=>Number(d.level) === 1)[0].lower_limiting_value }}
            </span>
            -
            <span v-if="formData.standards.filter(d=>Number(d.level) === 1)[0]">
              {{ formData.standards.filter(d=>Number(d.level) === 1)[0].upper_limit_value }}
            </span>
            {{ formData.unitname }}
          </span>
        </el-form-item>

        <!-- <= -->
        <el-form-item v-if="[2,3].includes(formData.interval_type)" label="实际名称">
          {{ formData.actual_name }}
          {{ options.find(d=>d.id === formData.interval_type).name }}
          {{ formData.limit_value }}
          {{ formData.unitname }}
        </el-form-item>
        <el-form-item v-if="[2,3].includes(formData.interval_type)" label="边界值" prop="limit_value">
          <el-input v-model="formData.limit_value" placeholder="请输入" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import page from '@/components/page'
import { materialExamineType, materialUnit, exportTemplate, importData } from '@/api/base_w_three'
export default {
  components: { page },
  data() {
    return {
      search: {
        compare: 1,
        page: 1
      },
      total: 0,
      options: [{ name: '上下限', id: 1 }, { name: '<=', id: 2 }, { name: '>=', id: 3 }, { name: '外观确认', id: 4 }],
      tableData: [],
      tableData1: [],
      loading: false,
      dialogVisible: false,
      formData: {
        unitname: '',
        actual_name: '',
        limit_value: '',
        interval_type: 1,
        standards: [{
          level: 1,
          upper_limit_value: 0,
          lower_limiting_value: 0
        }] },
      rulesEquip: {
        interval_type: [
          { required: true, message: '请选择比值类型', trigger: 'change' }
        ],
        actual_name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ],
        limit_value: [
          { required: true, message: '请输入边界值', trigger: 'blur' }
        ]
      },
      optionsUnit: [],
      btnLoading: false
    }
  },
  created() {
    this.getList()
    this.getOptionsUnit()
  },
  methods: {
    validatorFun(value, callback, index, standards) {
      if (standards[index].lower_limiting_value === 0 && standards[index].upper_limit_value === 0) {
        callback(new Error('上下限不能都为0'))
        return
      }
      if (value === '') {
        callback(new Error('请输入'))
      } else {
        callback()
      }
    },
    clearVal() {
      this.formData = {
        unitname: '',
        actual_name: '',
        limit_value: '',
        interval_type: 1,
        standards: [{
          level: 1,
          upper_limit_value: 0,
          lower_limiting_value: 0
        }] }
    },
    async getList() {
      try {
        const data = await materialExamineType('get', null, { params: this.search })
        this.loading = false
        this.tableData = data.results
        this.total = data.count
      } catch (e) { this.loading = false }
    },
    async getOptionsUnit() {
      try {
        const data = await materialUnit('get')
        this.optionsUnit = data.results
      } catch (e) {
        //
      }
    },
    changeSearch() {
      debounce(this, 'getList')
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    downloadFun() {
      exportTemplate().then(response => {
        const link = document.createElement('a')
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.download = '快检类型.xls' // 下载的文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    leadingInFun(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      importData(formData).then(response => {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        this.search.page = 1
        this.getList()
      })
    },
    addFun() {
      this.dialogVisible = true
    },
    ratioTypeFun() {
      this.getList()
    },
    editFun(row) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.formData.unitname = this.formData.unit_name
      this.dialogVisible = true
    },
    handleCurrentChange(val) {
      this.tableData1 = val.standards || []
    },
    handleClose(done) {
      this.clearVal()
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    ratioTypeForm() {
      this.formData.unitname = ''
      this.formData.actual_name = ''
      this.formData.limit_value = ''
      this.formData.standards = [{
        level: 1,
        upper_limit_value: 0,
        lower_limiting_value: 0
      }]
    },
    delGrade(i) {
      this.formData.standards.splice(i, 1)
    },
    addGrade() {
      this.formData.standards.push({
        level: '',
        upper_limit_value: 0,
        lower_limiting_value: 0
      })
    },
    keepTwo(val) {
      // 不四舍五入
      return Math.floor(val * 100) / 100
    },
    submitFun() {
      this.$refs.formObj.validate(async(valid) => {
        if (valid) {
          try {
            const obj = JSON.parse(JSON.stringify(this.formData))
            if (obj.interval_type === 1) {
              const a = obj.standards.filter(d => Number(d.level) === 1)[0]
              if (!a) {
                this.$message.info('请添加：级别1 评级标准')
                return
              }
              delete obj.limit_value
              obj.name = obj.actual_name + ' ' + a.lower_limiting_value + '-' + a.upper_limit_value
            }
            if ([2, 3].includes(obj.interval_type)) {
              obj.name = obj.actual_name + ' ' + this.options.find(d => d.id === obj.interval_type).name + obj.limit_value + obj.unitname
              delete obj.standards
            }
            if (obj.interval_type === 4) {
              obj.name = obj.actual_name
              delete obj.standards
              delete obj.limit_value
              delete obj.unitname
            }
            this.btnLoading = true
            const _api = this.formData.id ? 'patch' : 'post'
            await materialExamineType(_api, this.formData.id || '', { data: obj })
            this.handleClose(false)
            this.btnLoading = false
            this.$message.success('操作成功')
            this.getList()
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
</script>

<style scoped lang='scss'>
.dialogLevel{
  position:relative;
  .dialogIconAdd{
    position:absolute;
    font-size:30px;
    bottom:27px;
    margin-left:20px;
    cursor: pointer;
  }
  .dialogIconDEL{
    position:absolute;
    font-size:30px;
    bottom:27px;
    margin-left:60px;
    cursor: pointer;
  }
}

</style>
