<template>
  <div v-loading="loading" class="parameter">
    <!-- 排程参数设定 -->
    <el-form :inline="true">
      <el-form-item>
        <span style="fontSize:20px;fontWeight:bolder">
          自动排程 参数设定
        </span>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['aps_params_setting','change']" type="primary" :loading="submit" @click="save">
          保存
        </el-button>
      </el-form-item>
    </el-form>
    <el-form
      ref="createForm"
      :rules="rules"
      style="paddingLeft:200px;paddingRight:200px"
      :inline="true"
      :model="typeForm"
      label-width="220px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="排程方式选择" prop="scheduling_type">
            <el-select
              v-model="typeForm.scheduling_type"
              placeholder="请选择"
            >
              <el-option
                v-for="item in ['传统方式', '优化算法']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="自动排程期间(小时)" prop="scheduling_during_time">
            <el-input-number v-model="typeForm.scheduling_during_time" :min="0" />
          </el-form-item>
          <el-form-item label="前后工序间隔车数(车)" prop="scheduling_interval_trains">
            <el-input-number v-model="typeForm.scheduling_interval_trains" :min="0" />
          </el-form-item>
          <el-form-item label="现场可修改计划数量(车)">
            <el-input-number v-model="typeForm.scheduling_adaptable_trains" :min="0" />
          </el-form-item>
          <el-form-item label="排程参数自动统计时间">
            <el-time-select
              v-model="typeForm.scheduling_auto_time"
              style="width:200px"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
              }"
              placeholder="选择时间"
            />
            <el-button style="marginLeft:10px" type="primary">统计</el-button>
          </el-form-item>

          <el-form-item label="是否考虑物料齐套">
            <el-switch
              v-model="typeForm.use_flag"
              active-text="是"
              inactive-text="否"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="小吨位(<5吨)目标库存天数" prop="small_ton_stock_days">
            <el-input-number v-model="typeForm.small_ton_stock_days" :min="0" precision="1" />
          </el-form-item>
          <el-form-item label="大吨位(>10吨)目标库存天数" prop="big_ton_stock_days">
            <el-input-number v-model="typeForm.big_ton_stock_days" :min="0" precision="1" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="混炼各段之间放置期时间(小时)">
            <el-input-number v-model="typeForm.mixing_place_interval_time" :min="0" />
          </el-form-item>
          <el-form-item label="无S打加S放置期时间(小时)">
            <el-input-number v-model="typeForm.standing_time" :min="0" />
          </el-form-item>
          <el-form-item label="小料包一车包数" prop="pkg_count">
            <el-input-number v-model="typeForm.pkg_count" :min="0" />
          </el-form-item>
          <el-form-item label="小料包有效期(小时)">
            <el-input-number v-model="typeForm.validity" :min="0" />
          </el-form-item>
          <el-form-item label="密炼时间统计范围(秒)">
            <el-input-number v-model="typeForm.mixing_summary_st_time" style="width:150px" :min="0" :max="typeForm.mixing_summary_et_time" />
            ~
            <el-input-number v-model="typeForm.mixing_summary_et_time" style="width:150px" :min="typeForm.mixing_summary_st_time" />
          </el-form-item>
          <el-form-item label="密炼间隔时间统计范围(秒)">
            <el-input-number v-model="typeForm.mixing_interval_st_time" style="width:150px" :min="0" :max="typeForm.mixing_interval_et_time" />
            ~
            <el-input-number v-model="typeForm.mixing_interval_et_time" style="width:150px" :min="typeForm.mixing_interval_st_time" />
          </el-form-item>
          <el-form-item label="中吨位(5-10吨)目标库存天数" prop="middle_ton_stock_days">
            <el-input-number v-model="typeForm.middle_ton_stock_days" :min="0" precision="1" />
          </el-form-item>
          <br>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { schedulingParamsSetting } from '@/api/jqy'
export default {
  name: 'ScheduleParameterSetting',
  data() {
    return {
      submit: false,
      typeForm: {
        scheduling_type: '传统方式',
        scheduling_during_time: 24,
        scheduling_interval_trains: 30,
        scheduling_adaptable_trains: 5,
        min_stock_trains: 1.5,
        scheduling_auto_time: '07:30',
        standing_time: 4,
        pkg_count: 20,
        validity: 4,
        mixing_summary_st_time: 100,
        mixing_summary_et_time: 200,
        mixing_interval_st_time: 10,
        mixing_interval_et_time: 20,
        use_flag: true
      },
      loading: false,
      rules: {
        scheduling_type: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        scheduling_during_time: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        scheduling_interval_trains: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        pkg_count: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        small_ton_stock_days: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        middle_ton_stock_days: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        big_ton_stock_days: [
          { required: true, message: '不能为空', trigger: 'change' }
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
        this.loading = true
        const data = await schedulingParamsSetting('get', null, {})
        if (data.length > 0) {
          this.typeForm = data[0]
          this.loading = false
        } else {
          this.loading = false
        }
      } catch (e) {
        this.loading = false
      }
    },
    save() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          this.$confirm('此操作将保存此时页面参数设定是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submit = true
            schedulingParamsSetting('put', this.typeForm.id, { data: this.typeForm })
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.submit = false
                this.getList()
              })
              .catch(response => {
                this.submit = false
              })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" >
.parameter{
    .el-input-number{
      width: 200px;
    }
}

</style>
