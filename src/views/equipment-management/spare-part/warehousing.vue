<template>
  <div>
    <!-- 备品备件入库管理 -->
    <el-form :inline="true">
      <el-form-item label="物料编码:">
        <materialCodeSelect
          :is-all-obj="true"
          @changeSelect="changeMaterialCode"
        />
      </el-form-item>
      <el-form-item label="物料名称:">
        <materialCodeSelect
          :is-all-obj="true"
          label-name="material_name"
          @changeSelect="changeMaterialName"
        />
      </el-form-item>
      <el-form-item label="库存位:">
        <inventoryPosition @changSelect="changeInventoryPosition" />
      </el-form-item>
      <el-form-item>
        <el-button @click="edit({})">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        prop="date"
        label="物料编码"
      />
      <el-table-column
        prop="name"
        label="物料名称"
      />
      <el-table-column
        prop="address"
        label="库存位"
      />
      <el-table-column
        prop="name"
        label="数量（件）"
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="edit(scope.row)"
            >入库
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="view(scope.row)"
            >查看履历
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="currentRow.id?'入库':'新增'"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="currentRow" :rules="rules" label-width="100px">
        <el-form-item v-if="!currentRow.id" label="仓库">
          <warehouseSelect
            :created-is="true"
            @changSelect="changWarehouse"
          />
        </el-form-item>
        <el-form-item label="物料编码" prop="a">
          <materialCodeSelect
            :is-all-obj="true"
            :default-val="currentRow.a"
            :is-disabled="currentRow.id?true:false"
            @changeSelect="dialogMaterialCode"
          />
        </el-form-item>
        <el-form-item label="物料名称" prop="b">
          <materialCodeSelect
            :is-all-obj="true"
            :default-val="currentRow.b"
            label-name="material_name"
            :is-disabled="currentRow.id?true:false"
            @changeSelect="dialogMaterialName"
          />
        </el-form-item>
        <el-form-item label="库存位">
          <inventoryPosition
            :default-val="currentRow.c"
            :is-disabled="currentRow.id?true:false"
            @changSelect="dialogInventoryPosition"
          />
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <el-input-number
            v-model="currentRow.num"
            controls-position="right"
            :min="1"
            :max="10"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(null)">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import inventoryPosition from '@/components/select_w/inventoryPosition'
import materialCodeSelect from '@/components/materialCodeSelect/index'
import warehouseSelect from '@/components/select_w/warehouseSelect'
import page from '@/components/page'
import { spareInventory } from '@/api/base_w_two'
export default {
  components: { page, inventoryPosition, materialCodeSelect, warehouseSelect },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      tableData: [],
      dialogVisible: false,
      currentRow: {},
      total: 0,
      rules: {
        a: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        b: [
          { required: true, message: '请输入物料名称', trigger: 'change' }
        ],
        num: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await spareInventory('get', null, { params: this.search })
      } catch (e) {
        //
      }
    },
    changeInventoryPosition(obj) {
    },
    changeMaterialCode(obj) {

    },
    changeMaterialName(obj) {},
    edit(row) {
      console.log(row, 'row')
      this.currentRow = row
      this.dialogVisible = true
    },
    view(row) {},
    handleClose(done) {
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //
          this.handleClose(null)
        } else {
          return false
        }
      })
    },
    dialogMaterialCode(obj) {
      this.currentRow.a = obj ? obj.material_no : ''
      this.$set(this.currentRow, 'b', obj ? obj.material_name : '')
    },
    dialogMaterialName(obj) {
      this.$set(this.currentRow, 'b', obj ? obj.material_name : '')
      this.$set(this.currentRow, 'a', obj ? obj.material_no : '')
    },
    changWarehouse(obj) {
      this.currentRow.d = obj ? obj.id : null
    },
    dialogInventoryPosition() {

    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    }
  }
}
</script>

<style>

</style>
