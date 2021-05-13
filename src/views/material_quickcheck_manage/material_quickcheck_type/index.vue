<template>
  <div v-loading="loading">
    <!-- 快检类型管理 -->
    <el-form :inline="true">
      <el-form-item label="比值类型">
        <el-select v-model="search.aaa" placeholder="请选择" @change="ratioTypeFun">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检测类型">
        <el-input v-model="search.aa" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="downloadFun">下载模板</el-button>
        <el-button type="primary" @click="leadingInFun">导入</el-button>
        <el-button type="primary" @click="addFun">添加快检类型</el-button>
      </el-form-item>
    </el-form>

    <el-row v-if="search.aaa === 1">
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
            prop="address"
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
            prop="name"
            label="上限值"
          />
          <el-table-column
            prop="address"
            label="下限值"
          />
          <el-table-column
            prop="address"
            label="级别"
          />
        </el-table>
      </el-col>
    </el-row>

    <el-table
      v-if="search.aaa === 2||search.aaa === 3"
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
        prop="address"
        width="120"
        label="边界值"
      />
      <el-table-column
        prop="address"
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
      v-if="search.aaa === 4"
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

    <el-dialog
      title="添加/编辑检测类型"
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-form ref="formObj" inline :rules="rulesEquip" :model="formData" label-width="80px">
        <el-form-item label="比值类型" prop="bb">
          <el-select v-model="formData.bb" placeholder="请选择" @change="ratioTypeForm">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="bbb">
          <el-select
            v-model="formData.bbb"
            placeholder="请选择"
            filterable
            allow-create
            default-first-option
          >
            <el-option
              v-for="item in optionsUnit"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div style="width:100%;height:0.5px;background:#DCDFE6;margin-bottom:10px" />
        <div v-for="(item,index) in formData.arr" :key="index" class="dialogLevel">
          <el-form-item
            label="级别"
            :prop="'arr.' + index + '.bbbb'"
            :rules="{
              required: true, message: '域名不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="item.bbbb" placeholder="请输入" @input="changeSearch" />
          </el-form-item>
          <el-form-item label="上限值" prop="bbbbb">
            <el-input-number
              v-model="item.upper_limit"
              controls-position="right"
              :min="item.lower_limit?keepTwo(item.lower_limit +0.01):-Infinity"
            />
          </el-form-item>
          <el-form-item label="下限值" prop="bbbbbb">
            <el-input-number
              v-model="item.lower_limit"
              controls-position="right"
              :max="item.upper_limit?keepTwo(item.upper_limit-0.01):Infinity"
            />
          </el-form-item>
          <i v-if="formData.arr.length!==1" title="删除评级标准" class="el-icon-remove-outline dialogIconDEL" />
          <i v-if="index===formData.arr.length-1" title="添加此评级标准" class="el-icon-circle-plus-outline dialogIconAdd" />
        </div>
        <div style="width:100%;height:0.5px;background:#DCDFE6;margin-bottom:10px" />
        <el-form-item label="类型名称" prop="bbbbbbb">
          <el-input v-model="search.bbbbbbb" placeholder="请输入" @input="changeSearch" />
        </el-form-item>
        <el-form-item label="实际名称" prop="bbbbbbb">
          实际名称
        </el-form-item>

        <!-- <= -->
        <el-form-item label="边界值" prop="bbbbbbb">
          <el-input v-model="search.bbbbbbb" placeholder="请输入" @input="changeSearch" />
        </el-form-item>
        <!-- <el-form-item label="实际名称" prop="bbbbbbb">
          '{{ 实际名称 }}'
        </el-form-item> -->

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
export default {
  data() {
    return {
      search: {
        aaa: 2
      },
      options: [{ name: '上下限', id: 1 }, { name: '<=', id: 2 }, { name: '>=', id: 3 }, { name: '外观确认', id: 4 }],
      tableData: [{}],
      tableData1: [],
      loading: false,
      dialogVisible: false,
      formData: { arr: [{}, {}] },
      rulesEquip: {
        bb: [
          { required: true, message: '请选择比值类型', trigger: 'change' }
        ],
        bbb: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        bbbbbbb: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ]
      },
      optionsUnit: []
    }
  },
  created() {

  },
  methods: {
    async getList() {
      try {
        // const data = await material_quantity_url('get', { params: this.getParams })
        this.loading = false
      } catch (e) { this.loading = false }
    },
    changeSearch() {
      debounce(this, 'getList')
    },
    downloadFun() {},
    leadingInFun() {},
    addFun() {},
    ratioTypeFun() {
      this.getList()
    },
    editFun() {
      this.dialogVisible = true
    },
    handleCurrentChange(val) {
      console.log(val, 777)
    },
    handleClose(done) {
      if (done) {
        done()
      }
    },
    ratioTypeForm() {},
    keepTwo(val) {
      // 不四舍五入
      return Math.floor(val * 100) / 100
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
