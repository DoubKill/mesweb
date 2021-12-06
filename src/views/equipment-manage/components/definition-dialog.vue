<template>
  <div>
    <!-- 维修标准弹框 -->
    <el-form
      ref="createForm"
      :inline="true"
      :model="typeForm"
      label-width="150px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="标准编号">
            <el-input v-model="typeForm.standard_code" disabled />
          </el-form-item>
          <el-form-item label="标准名称">
            <el-input v-model="typeForm.standard_name" disabled />
          </el-form-item>
          <el-form-item label="设备种类">
            <el-input v-model="typeForm.equip_type_name" disabled />
          </el-form-item>
          <el-form-item label="部位名称">
            <el-input v-model="typeForm.equip_part_name" disabled />
          </el-form-item>
          <el-form-item label="部件名称">
            <el-input v-model="typeForm.equip_component_name" disabled />
          </el-form-item>
          <el-form-item label="设备条件">
            <el-select
              v-model="typeForm.equip_condition"
              disabled
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in ['停机', '不停机']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="重要程度">
            <el-select
              v-model="typeForm.important_level"
              disabled
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in ['高', '中', '低']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障原因">
            <el-input v-model="typeForm.equip_fault_name" disabled />
          </el-form-item>
          <el-form-item label="作业项目">
            <el-input v-model="typeForm.equip_job_item_standard_name" disabled />
          </el-form-item>
          <el-form-item label="维修详细信息">
            <el-input
              v-model="typeForm.equip_job_item_standard_detail"
              disabled
              style="width:230px"
              type="textarea"
              :rows="4"
            />
          </el-form-item></el-col>
        <el-col :span="8">
          <el-form-item label="所需人数">
            <el-input-number v-model="typeForm.cycle_person_num" placeholder="请输入内容" controls-position="right" disabled />
          </el-form-item>
          <el-form-item label="作业时间">
            <el-input-number v-model="typeForm.operation_time" placeholder="请输入内容" controls-position="right" disabled />
          </el-form-item>
          <el-form-item label="作业时间单位">
            <el-select
              v-model="typeForm.operation_time_unit"
              disabled
              clearable
            >
              <el-option
                v-for="item in ['日','小时','分钟','秒','车次']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="钉钉提醒发送">
            <el-checkbox v-model="typeForm.remind_flag1" label="包干人" disabled />
            <el-checkbox v-model="typeForm.remind_flag2" label="上级" disabled />
            <el-checkbox v-model="typeForm.remind_flag3" label="上上级" disabled />
          </el-form-item>
        </el-col>
        <!-- <el-form-item label="所需物料">
          <el-table
            :data="typeForm.spare_list"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="equip_spare_erp__spare_code"
              label="物料编码"
            />
            <el-table-column
              prop="equip_spare_erp__spare_name"
              label="物料名称"
            />
            <el-table-column
              prop="equip_spare_erp__specification"
              label="规格"
            />
            <el-table-column
              prop="equip_spare_erp__technical_params"
              label="用途"
            />
            <el-table-column
              prop="quantity"
              label="数量"
              width="140px"
            />
            <el-table-column
              prop="equip_spare_erp__unit"
              label="单位"
            />
          </el-table>
        </el-form-item> -->
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    typeForm: {
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

