<template>
  <div>
    <!-- 原材料不合格处理-->
    <el-form :inline="true">
      <el-form-item label="日期：">
        <el-date-picker
          v-model="search.storage_date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="原材料编码：">
        <all-product-no-select :type-parms="2" @productBatchingChanged="changeMaterialCode" />
      </el-form-item>
      <el-form-item label="原材料名称：">
        <all-product-no-select :type-parms="2" label-name="material_name" @productBatchingChanged="changeMaterialName" />
      </el-form-item>

      <el-form-item label="条码：">
        <el-input
          v-model="search.lot_no"
          placeholder="请输入内容"
          @input="changelot_no"
        />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        align="center"
        type="index"
        label="No"
        width="50"
      />
      <el-table-column label="物料信息">
        <el-table-column
          prop="material_test_order_raw.storage_date"
          label="入库时间"
          min-width="10"
        />
        <el-table-column
          prop="material_test_order_raw.material_no"
          label="原材料编码"
          min-width="10"
        />
        <el-table-column
          prop="material_test_order_raw.material_name"
          label="原材料名称"
          min-width="10"
        />
        <el-table-column
          prop="material_test_order_raw.supplier_name"
          label="厂家信息"
          min-width="10"
        />
        <el-table-column
          prop="material_test_order_raw.lot_no"
          label="条码"
          min-width="10"
        />
      </el-table-column>
      <el-table-column
        prop="is_qualified"
        label="等级"
        min-width="10"
      >
        <template slot-scope="{row}">
          {{ row.material_test_order_raw.is_qualified?'等级1':'等级2' }}
        </template>
      </el-table-column>
      <el-table-column
        label="综合判定结果"
        min-width="10"
      >
        <template slot-scope="scope">
          {{ scope.row.material_test_order_raw.is_qualified?'合格':'不合格' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="unqualified_reason"
        label="不合格原因"
        min-width="10"
      />
      <el-table-column
        label="状态"
        min-width="10"
      >
        <template slot-scope="{row}">
          {{ setStatus(row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="10"
      >
        <template slot-scope="{row}">
          <el-button-group>
            <el-button v-if="row.status === 1&&checkPermission(['raw_unqualified_material','deal'])" size="mini" @click="handleFun(row,2)">处理</el-button>
            <el-button v-if="row.status === 2&&checkPermission(['raw_unqualified_material','submit'])" type="primary" size="mini" @click="confirmFun(row,3)">确认</el-button>
            <el-button v-if="row.status === 2&&checkPermission(['raw_unqualified_material','submit'])" type="danger" size="mini" @click="confirmFun(row,4)">驳回</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="release_result"
        label="处理意见"
        min-width="10"
      />
      <el-table-column
        prop="unqualified_result"
        label="处理结果"
        min-width="10"
      />
      <el-table-column
        prop="deal_username"
        label="处理人"
        min-width="10"
      />
      <el-table-column
        prop="confirm_username"
        label="确认人"
        min-width="10"
      />
    </el-table>

    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="处理"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="放行处理" prop="release_result">
          <el-select v-model="ruleForm.release_result" placeholder="请选择">
            <el-option
              v-for="item in ['放行','掺用']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="不合格处理" prop="unqualified_result">
          <el-select v-model="ruleForm.unqualified_result" placeholder="请选择">
            <el-option
              v-for="item in ['停用']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="出库">
          <el-checkbox v-model="ruleForm.is_delivery" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { unqualifiedMaterialDealResult } from '@/api/base_w_three'
import page from '@/components/page'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import { debounce, checkPermission } from '@/utils'
export default {
  components: { page, allProductNoSelect },
  data() {
    return {
      search: {},
      tableData: [],
      qualityValue: '',
      total: 0,
      loading: false,
      dialogVisible: false,
      option: [{ label: true, name: '合格' }, { label: false, name: '不合格' }],
      rules: {
        release_result: [
          { required: true, message: '请选择放行处理', trigger: 'change' }
        ],
        unqualified_result: [
          { required: true, message: '请选择不合格处理', trigger: 'change' }
        ]
      },
      ruleForm: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    async getList() {
      this.loading = true
      try {
        const data = await unqualifiedMaterialDealResult('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count || 0
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    changelot_no() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeMaterialName(val) {
      this.search.material_name = val ? val.material_name : ''
      this.changeList()
    },
    changeMaterialCode(val) {
      this.search.material_no = val ? val.material_no : ''
      this.changeList()
    },
    handleFun(row) {
      this.ruleForm.id = row.id
      this.ruleForm.status = 2
      this.dialogVisible = true
    },
    handleClose(done) {
      done()
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            await unqualifiedMaterialDealResult('patch', this.ruleForm.id || '', { data: this.ruleForm })
            this.$message.success('处理完成')
            this.dialogVisible = false
            this.getList()
          } catch (e) {
            //
          }
        } else {
          return false
        }
      })
    },
    confirmFun(row, status) {
      this.$confirm('是否' + (status === 3 ? '确认?' : '驳回?'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unqualifiedMaterialDealResult('patch', row.id, { data: { status: status }})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          }).catch(e => {
            this.$message.error('操作失败')
          })
      })
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    setStatus(val) {
      switch (val) {
        case 1:
          return '待处理'
        case 2:
          return '待确认'
        case 3:
          return '已处理'
        case 4:
          return '驳回'
      }
    }
  }
}
</script>

<style>

</style>
