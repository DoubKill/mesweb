<template>
  <div>
    <!-- 设备部件定义 -->
    <el-form :inline="true" class="search-form-style">
      <el-form-item label="所属主设备种类">
        <el-select v-model="formInline.region" style="width:150px" clearable placeholder="所属主设备种类">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属设备部位">
        <el-select v-model="formInline.region" style="width:150px" clearable placeholder="所属设备部位">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部件分类">
        <el-select v-model="formInline.region" style="width:150px" clearable placeholder="部件分类">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部件名称">
        <el-input v-model="formInline.user" style="width:150px" clearable placeholder="部件名称" />
      </el-form-item>
      <el-form-item label="是否已绑定备件">
        <el-select v-model="formInline.region" style="width:150px" clearable>
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="formInline.region" style="width:150px" clearable placeholder="是否启用">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="onSubmit">导出Excel</el-button>
        <el-button type="primary" @click="onSubmit">导入Excel</el-button>
        <el-button type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="date"
        label="所属主设备种类"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="所属设备部位"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="部件分类"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="部件代码"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="部件名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="是否已绑定备件(Y/N)"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="是否启用"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="录入者"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="录入时间"
        min-width="20"
      />
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showEditDialog(scope.row)"
          >绑定备件</el-button>
          <el-button
            size="mini"
            @click="showEditDialog(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="handleDelete(scope.row)"
          >{{ scope.row.used_flag?'停用':'启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="formInline.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${dialogForm.id?'编辑':'新建'}设备部件定义`"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
      >
        <el-form-item
          label="信号编号"
          prop="name"
        >
          <el-select v-model="dialogForm.value" placeholder="请选择">
            <el-option
              v-for="item in []"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
export default {
  name: 'EquipmentMasterDataPartsDefine',
  components: { page },
  data() {
    return {
      formInline: {},
      loading: false,
      tableData: [{}],
      dialogVisible: false,
      total: 0,
      dialogForm: {},
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await testIndicators('get', null, { all: 1 })
        // this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getList()
    },
    onSubmit() {

    },
    showEditDialog() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.createForm.resetFields()
      if (done) {
        done()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
