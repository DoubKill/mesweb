<template>
  <div class="app-container">
    <h3>静态界面 不要测</h3>
    <el-form :inline="true">
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="productionDate"
          clearable
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="status" placeholder="请选择" clearable>
          <el-option
            v-for="item in [{label: '测试', value: '1'}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
      :data="inferiorQualityList"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="生产日期" prop="production_factory_date" />
      <el-table-column label="机台" prop="production_equip_no" />
      <el-table-column label="班次" prop="production_classe" />
      <el-table-column label="胶料编码" prop="material_no" />
      <el-table-column label="lot追踪号" width="90" prop="lot_no" />
      <el-table-column label="检测结果" prop="test_result" />
      <el-table-column label="等级" prop="level" />
      <el-table-column label="不合格原因" width="100" prop="reason" />
      <el-table-column label="状态" prop="status" />
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="{row, $index}">
          <el-button size="mini" @click="handleDispose">处理</el-button>
          <el-button size="mini">确认</el-button>
          <el-button size="mini" type="danger">驳回</el-button>
        </template>
      </el-table-column>
      <el-table-column label="处理意见" prop="deal_opinion" />
      <el-table-column label="处理结果" prop="deal_result" />
      <el-table-column label="处理人" prop="deal_user" />
      <el-table-column label="确认人" prop="confirm_user" />
    </el-table>

    <el-dialog
      title="处理弹框"
      :visible.sync="dialogDisposeVisible"
    >
      <el-form ref="disposeForm" :model="formData" :rules="rules" label-position="left" label-width="110px">
        <el-form-item label="放行处理">
          <el-input />
        </el-form-item>
        <el-form-item label="不合格处理">
          <el-input />
        </el-form-item>
        <el-form-item label="出库">
          <el-radio />
        </el-form-item>
        <el-form-item label="出库时间选择">
          <el-date-picker
            clearable
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button>新建处理意见</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      getParams: {},
      productionDate: null,
      status: null,
      inferiorQualityList: [
        { production_equip_no: '测试' }
      ],
      dialogDisposeVisible: false,
      formData: {},
      rules: {}
    }
  },
  methods: {
    handleDispose() {
      this.dialogDisposeVisible = true
    }
  }
}
</script>
