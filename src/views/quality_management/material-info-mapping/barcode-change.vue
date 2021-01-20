<template>
  <div>
    <!-- 条码变更和打印 -->
    <el-form :inline="true">
      <el-form-item label="物料类型">
        <materielTypeSelect :params-type="false" @changSelect="changMaterielType" />
      </el-form-item>
      <el-form-item>
        <el-button style="float:right" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleDelete(scope.row)"
          >重新生成条形码
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="条形码"
      />
      <el-table-column
        prop="address"
        label="批次号"
      />
      <el-table-column
        prop="address"
        label="物料类型"
      />
      <el-table-column
        prop="address"
        label="物料编码"
      />
    </el-table>

    <el-dialog
      :title="currentObj.id?'重新生产':'新建'"
      :visible.sync="dialogVisible"
      width="600"
      :before-close="handleClose"
    >
      <el-form
        ref="currentObj"
        :model="currentObj"
        label-width="120px"
      >
        <el-form-item label="物料类型">
          <materielTypeSelect
            :params-type="false"
            :is-disabled="currentObj.id?true:false"
            :default-val="currentObj.materielType"
            @changSelect="changMaterielTypeDialoge"
          />
        </el-form-item>
        <el-form-item label="物料编码">
          <materialCodeSelect
            :is-all-obj="true"
            :is-disabled="currentObj.id?true:false"
            :is-created="true"
            :default-val="currentObj.material_no"
            @changeSelect="changeMaterialCodeDialoge"
          />
        </el-form-item>
        <el-form-item label="批次号">
          <el-input v-model="currentObj.a" />
        </el-form-item>
        <el-form-item label="条形码">
          <img class="barcode">
          <el-button size="mini" type="primary">更新二维码</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <img class="barcode"> -->
  </div>
</template>

<script>
import materielTypeSelect from '@/components/select_w/materielTypeSelect'
import materialCodeSelect from '@/components/materialCodeSelect'
import jsbarcode from 'jsbarcode'
export default {
  components: { materielTypeSelect, materialCodeSelect },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      currentObj: {}
    }
  },
  mounted() {
    // jsbarcode(
    //   '.barcode',
    //   '66666', {
    //     displayValue: true
    //   }
    // )
  },
  methods: {
    changMaterielType() {},
    add() {
      this.dialogVisible = true
      this.$nextTick(D => {
        jsbarcode(
          '.barcode',
          '66666', {
            displayValue: true
          }
        )
      })
    },
    handleClose(done) {},
    changMaterielTypeDialoge(val) {
      this.currentObj.materielType = val
    },
    changeMaterialCodeDialoge(val) {
      console.log(val)
      this.currentObj.materiel_no = val
    }
  }
}
</script>

<style>

</style>
