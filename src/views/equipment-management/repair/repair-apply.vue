<template>
  <div>
    <!-- 设备维修申请页面 -->
    <el-button @click="clickDialog">维修申请</el-button>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        width="40"
        type="index"
      />
      <el-table-column
        prop="date"
        label="工序"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="设备编码"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="设备名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备类型"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="操作人"
        min-width="20"
      />
      <el-table-column
        label="操作"
        min-width="20"
      >
        <template slot-scope="{row}">
          {{ row }}
          <el-button-group>
            <el-button type="primary" size="mini" />
            <el-button type="primary" size="mini" />
            <el-button type="primary" size="mini" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="维修申请"
      :visible.sync="dialogVisible"
      width="600"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="日期" prop="name">
          {{ ruleForm.data }}
        </el-form-item>
        <el-form-item label="设备" prop="a">
          <EquipSelect @equipSelected="equipSelected" />
        </el-form-item>
        <el-form-item label="停机类型" prop="b">
          <shutdownMoldSelect @shutdownMoldChange="shutdownMoldChange" />
          <el-checkbox v-model="ruleForm.checked" style="margin-left:10px">已停机</el-checkbox>
        </el-form-item>
        <el-form-item label="原因" prop="c">
          <el-input
            v-model="ruleForm.textarea"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { setDate } from '@/utils'
import EquipSelect from '@/components/EquipSelect'
import shutdownMoldSelect from '../components/shutdown-mold-select'
export default {
  components: { EquipSelect, shutdownMoldSelect },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      ruleForm: {
        data: setDate('', true)
      },
      rules: {
        a: [
          // { required: true, validator: validatePass3, trigger: 'blur' }
        ],
        b: [
          // { required: true, validator: validatePass3, trigger: 'blur' }
        ],
        c: [
          // { required: true, validator: validatePass3, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose(done) {
      done()
    },
    clickDialog() {
      this.dialogVisible = true
    },
    equipSelected() {},
    shutdownMoldChange() {}
  }
}
</script>

<style>

</style>
