<template>
  <div>
    <!-- 报修申请弹框 -->
    <el-form
      ref="ruleFormHandle"
      :model="ruleForm"
      label-width="120px"
    >
      <el-form-item label="设备条码">
        <el-input
          v-model="ruleForm.equip_barcode"
          disabled
          style="width:250px"
        /></el-form-item>
      <el-form-item label="设备名称">
        <el-input
          v-model="ruleForm.factory_name"
          disabled
          style="width:250px"
        />
      </el-form-item>
      <el-form-item label="报修部门">
        <el-input
          v-model="ruleForm.plan_department"
          disabled
          style="width:250px"
        />
      </el-form-item>
      <el-form-item label="故障发生时间">
        <el-input
          v-model="ruleForm.fault_datetime"
          disabled
          style="width:250px"
        />
      </el-form-item>
      <el-form-item label="机台">
        <el-input
          v-model="ruleForm.equip_no"
          disabled
          style="width:250px"
        />
      </el-form-item>
      <el-form-item label="设备部位">
        <el-input
          v-model="ruleForm.part_name"
          disabled
          style="width:250px"
        />
        <el-link v-if="ruleForm.equip_condition==='停机'" style="margin-left:10px" type="warning">已停机</el-link>
        <el-link v-if="ruleForm.equip_condition==='不停机'" style="margin-left:10px">不停机</el-link>
      </el-form-item>
      <el-form-item label="故障原因">
        <el-input
          v-model="ruleForm.result_fault_cause_name"
          disabled
          style="width:250px"
        /></el-form-item>
      <el-form-item label="重要程度">
        <el-radio-group v-model="ruleForm.importance_level" disabled>
          <el-radio label="高">高</el-radio>
          <el-radio label="中">中</el-radio>
          <el-radio label="低">低</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="故障描述">
        <el-input
          v-model="ruleForm.result_fault_desc"
          style="width:250px"
          disabled
          type="textarea"
          :rows="3"
        />
      </el-form-item>
      <el-form-item label="上传图片">
        <template v-for="(item, index) in ruleForm.apply_repair_graph_url">
          <el-image
            v-if="ruleForm.apply_repair_graph_url.length>0"
            :key="index"
            style="width: 100px; height: 100px"
            :src="item"
            :preview-src-list="[item]"
          />
        </template>
        <div v-if="ruleForm.apply_repair_graph_url.length===0">
          暂无图片
        </div>
      </el-form-item>
      <el-form-item label="上传视频">
        <template v-for="(item, index) in ruleForm.apply_repair_video_url">
          <video
            v-if="ruleForm.apply_repair_video_url.length>0"
            :key="index"
            style="width:600px;height:300px"
            controls="controls"
            :src="item"
          />
        </template>
        <div v-if="ruleForm.apply_repair_video_url.length===0">
          暂无视频
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    ruleForm: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

