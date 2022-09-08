<template>
  <div>
    <!--返回胶/无名胶卡片补打 -->
    <el-form :inline="true">
      <el-form-item label="类别">
        <el-select
          v-model="search.print_type"
          placeholder="请选择"
          clearable
          @change="changeList"
        >
          <el-option
            v-for="item in ['加硫','无硫']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="配方名称">
        <el-input v-model="search.product_no" style="width:250px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="卡片条码">
        <el-input v-model="search.bra_code" style="width:250px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['return_rubber', 'add']" type="primary" @click="dialog(false,'设置')">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="bra_code"
        label="卡片条码"
        min-width="50"
      />
      <el-table-column
        prop="created_date"
        label="工厂日期"
        width="150"
      />
      <el-table-column
        prop="batch_no"
        label="班次/班组"
        width="80"
      >
        <template slot-scope="scope">
          <span> {{ scope.row.batch_class + '/' + scope.row.batch_group }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="print_type"
        label="类别"
        width="50"
      />
      <el-table-column
        prop="product_no"
        label="配方名称"
        min-width="50"
      />
      <el-table-column
        label="车次"
        width="50"
      >
        <template slot-scope="scope">
          <span> {{ scope.row.begin_trains+ '-' + scope.row.end_trains }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="desc"
        label="异常描述"
        min-width="20"
      />
      <el-table-column
        prop="msg"
        label="处理意见"
        min-width="20"
      />
      <el-table-column
        prop="last_updated_date"
        label="打印时间"
        width="150"
      />
      <!-- <el-table-column
        prop="recipe_user"
        label="打印人"
        min-width="20"
      /> -->
      <el-table-column
        prop="print_username"
        label="打印员"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="录入人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
        width="150"
      />
      <el-table-column
        label="操作"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['return_rubber', 'print']"
            type="primary"
            size="mini"
            @click="dialog(scope.row,'预览')"
          >打印
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="count"
      :current-page="search.page"
      @currentChange="changePage"
    />

    <el-dialog
      :title="`准备分厂机台胶片卡片补打`+val"
      :visible.sync="dialogVisibleAdd"
      width="35%"
      :before-close="handleCloseAdd"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
      >
        <el-form-item label="胶料类别" prop="print_type">
          <el-select
            v-model="dialogForm.print_type"
            :disabled="val==='预览'"
            placeholder="请选择"
            @change="changeType"
          >
            <el-option
              v-for="item in ['加硫','无硫']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="配方名称"
          prop="product_no"
        >
          <el-select
            v-model="dialogForm.product_no"
            placeholder="请选择"
            :disabled="val==='预览'"
            filterable
            allow-create
          >
            <el-option
              v-for="item in productNoList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <!-- <el-input v-model="dialogForm.product_no" clearable :disabled="val==='预览'" style="width:300px" /> -->
        </el-form-item>
        <el-form-item
          label="车次"
          prop="trains"
        >
          <el-input-number
            v-model="dialogForm.begin_trains"
            style="width:150px"
            :disabled="val==='预览'"
            controls-position="right"
            :min="1"
            :max="dialogForm.end_trains"
          />
          -
          <el-input-number
            v-model="dialogForm.end_trains"
            style="width:150px"
            :disabled="val==='预览'"
            controls-position="right"
            :min="dialogForm.begin_trains"
          />
        </el-form-item>
        <el-form-item label="异常描述" prop="note">
          <el-input
            v-model="dialogForm.desc"
            :disabled="val==='预览'"
            type="textarea"
            style="width:250px"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="处理意见" prop="note">
          <el-input
            v-model="dialogForm.msg"
            :disabled="val==='预览'"
            type="textarea"
            style="width:250px"
            :rows="3"
          />
        </el-form-item>
        <!-- <el-form-item label="打印人" prop="recipe_user">
          <el-select
            v-model="dialogForm.recipe_user"
            :disabled="val==='预览'"
            placeholder="请选择"
            @visible-change="grtPersonnels"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="打印张数" prop="print_count">
          <el-input-number
            v-model="dialogForm.print_count"
            controls-position="right"
            :min="1"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseAdd(false)">取 消</el-button>
        <el-button type="primary" :loading="submit" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { returnRubber, personnels } from '@/api/jqy'
import { rubberMaterialUrl } from '@/api/base_w'
import page from '@/components/page'
export default {
  name: 'BanburyingMakeUp',
  components: { page },
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.dialogForm.begin_trains === undefined || this.dialogForm.begin_trains === '') {
        callback(new Error('请输入起始车次'))
      } else if (this.dialogForm.end_trains === undefined || this.dialogForm.end_trains === '') {
        callback(new Error('请输入结束车次'))
      } else {
        callback()
      }
    }
    return {
      search: {},
      val: null,
      dialogForm: {
        print_count: 1
      },
      dialogVisibleAdd: false,
      submit: false,
      options: [],
      tableData: [],
      rules: {
        print_type: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        product_no: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        trains: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        recipe_user: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        print_count: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      loading: false,
      productNoList: [],
      count: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await returnRubber('get', null, { params: this.search })
        this.count = data.count
        this.tableData = data.results
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async grtPersonnels(val) {
      if (val) {
        try {
          const data = await personnels('get', null, { params: { all: 1, section_name: '品质技术科' }})
          this.options = data.results
        } catch (e) {
          this.options = []
        }
      }
    },

    async dialog(row, val) {
      this.val = val
      if (val === '设置') {
        if (this.$refs.createForm) {
          this.$refs.createForm.resetFields()
        }
        this.dialogForm = { print_count: 1 }
        this.dialogVisibleAdd = true
      } else {
        this.dialogForm = JSON.parse(JSON.stringify(row))
        this.dialogVisibleAdd = true
      }
    },
    handleCloseAdd(done) {
      this.dialogVisibleAdd = false
      if (this.$refs.createForm) {
        this.$refs.createForm.resetFields()
      }
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            if (this.dialogForm.end_trains - this.dialogForm.begin_trains > 2) {
              this.$message('车次间隔不可大于2')
              return
            }
            const _api = this.dialogForm.id ? 'put' : 'post'
            this.submit = true
            await returnRubber(_api, this.dialogForm.id || null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.handleCloseAdd(null)
            this.changeList()
            this.submit = false
            this.dialogVisibleAdd = false
          } catch (e) {
            this.submit = false
            this.dialogVisibleAdd = true
          }
        } else {
          return false
        }
      })
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
    },
    debounceFun() {
      debounce(this, 'changeList')
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    changeType() {
      this.$set(this.dialogForm, 'product_no', null)
      this.getProductNoList()
    },
    async getProductNoList() {
      try {
        const data = await rubberMaterialUrl('get', null, { params: { exclude_used_type: 6, all: 1, print_type: this.dialogForm.print_type }})
        this.productNoList = data.results
      } catch (e) {
        this.productNoList = []
      }
    },
    changePage(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
