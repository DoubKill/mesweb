<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :title="rubberMaterialForm.id ? '复制胶料配方' : '新建胶料配方'"
      :visible.sync="dialogAddRubberMaterial"
      :before-close="handleCloseMaterial"
    >
      <el-form
        ref="rubberMaterialForm"
        v-loading="loading"
        :model="rubberMaterialForm"
        :rules="rules"
        :inline="true"
      >
        <el-form-item prop="normalReceipe">
          <el-radio v-model="normalReceipe" :label="true" :disabled="rubberMaterialForm.id?true:false" @change="receipeTypeChange">常规配方</el-radio>
          <el-radio v-model="normalReceipe" :label="false" :disabled="rubberMaterialForm.id?true:false" @change="receipeTypeChange">特殊配方</el-radio>
        </el-form-item>
        <el-form-item
          label="工厂"
          prop="factory"
        >
          <el-select
            v-model="rubberMaterialForm.factory"
            size="mini"
            placeholder="请选择"
            :disabled="!normalReceipe"
          >
            <el-option
              v-for="item in factoryList"
              :key="item.id"
              :value="item.id"
              :label="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="SITE"
          prop="site"
        >
          <SITESelect
            v-model="rubberMaterialForm.site"
            :is-disabled="!normalReceipe"
            @changeFun="SITESelectChange"
          />
        </el-form-item>

        <el-form-item
          label="段次"
          prop="stage"
        >
          <StageIdSelect
            v-model="rubberMaterialForm.stage"
            :is-disabled="!normalReceipe"
            @changeFun="changeFunStage"
          />
        </el-form-item>

        <el-form-item
          label="胶料编码"
          prop="product_info"
        >
          <el-select
            v-model="rubberMaterialForm.product_info"
            :filterable="true"
            size="mini"
            placeholder="请选择"
            :disabled="!normalReceipe"
            @input="generateRubberMaterialNOChanged"
          >
            <el-option
              v-for="item in productBatchNoOptions"
              :key="item.id"
              :value="item.id"
              :label="item.product_name"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="版本"
          prop="versions"
        >
          <el-input
            v-model="rubberMaterialForm.versions"
            size="mini"
            placeholder="版本"
            :disabled="!normalReceipe"
            @input="generateRubberMaterialNOChanged"
          />

        </el-form-item>
        <el-form-item label="方案" prop="precept">
          <el-input
            v-model="rubberMaterialForm.precept"
            size="mini"
            placeholder="方案"
            :disabled="!normalReceipe"
          />
        </el-form-item>
        <el-form-item
          prop="stage_product_batch_no"
          label="胶料配方编码"
        >
          <el-input
            v-model="rubberMaterialForm.stage_product_batch_no"
            :disabled="normalReceipe"
            size="mini"
          />
        </el-form-item>
        <br>
        <el-form-item>
          <el-button
            type="primary"
            @click="NewAddMaterial('rubberMaterialForm',true)"
          >配料</el-button>
          <el-button
            type="primary"
            :loading="btnLoading"
            @click="NewAddMaterial('rubberMaterialForm',false)"
          >生成</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <ingredient
      ref="ingredientRef"
      :form-obj="objParames"
      :show="showIngredient"
      :batching-list="batchingList"
      :is-view="isView"
      @handleCloseIngredient="handleCloseIngredient"
      @changeList="changeList"
    />
  </div>
</template>

<script>
import { site_url, product_info_url, validate_versions_url, rubber_material_url } from '@/api/rubber_recipe_fun'
import StageIdSelect from '@/components/StageSelect/StageIdSelect'
import SITESelect from './SITESelect'
import ingredient from './ingredient'

export default {
  components: { StageIdSelect, SITESelect, ingredient },
  props: {
    materialForm: {
      type: Object,
      default() {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogAddRubberMaterial: this.show,
      rubberMaterialForm: {
        factory: '',
        site: '',
        stage: '',
        product_info: '',
        versions: '',
        precept: '',
        stage_product_batch_no: ''
      },
      rules: {
        factory: [{ required: true, message: '请选择产地', trigger: 'blur' }],
        site: [{ required: true, message: '请选择SITE', trigger: 'blur' }],
        product_info: [{ required: true, message: '请选择胶料编码', trigger: 'blur' }],
        stage: [{ required: true, message: '请选择段次', trigger: 'blur' }],
        versions: [{ required: true, message: '请选择版本', trigger: 'blur' }],
        stage_product_batch_no: [{ required: true, message: '该字段不能为空', trigger: 'blur' }]
      },
      normalReceipe: true,
      factoryList: [],
      productBatchNoOptions: [],
      loading: true,
      btnLoading: false,
      showIngredient: false,
      objParames: {},
      batchingList: {}
    }
  },
  watch: {
    async show(val) {
      this.dialogAddRubberMaterial = val
      if (val) {
        if (JSON.stringify(this.materialForm) !== '{}') {
          this.rubberMaterialForm = this.materialForm
          if (this.materialForm.id) {
            this.normalReceipe = !!this.materialForm.stage
          } else {
            this.normalReceipe = true
          }
        }
        try {
          await this.product_info_list()
          await this.getFactoryList()
          this.loading = false
        } catch (e) {
          this.loading = false
        }
      }
    }
  },
  methods: {
    handleCloseMaterial(done) {
      this.$emit('handleCloseMaterial')
      this.dialogAddRubberMaterial = false
      this.receipeTypeChange()
      if (done) {
        done()
      }
    },
    receipeTypeChange() {
      this.rubberMaterialForm.stage_product_batch_no = ''
      this.rubberMaterialForm.id = ''
      if (this.$refs['rubberMaterialForm']) {
        this.$refs['rubberMaterialForm'].clearValidate()
      }
    },
    async product_info_list() {
      try {
        const data = await product_info_url('get', {
          params: { all: 1 }
        })
        this.productBatchNoOptions = data.results
      } catch (e) { throw new Error(e) }
    },
    async getFactoryList() {
      try {
        const data = await site_url('get')
        this.factoryList = data.results || []
        this.loading = false
      } catch (e) { throw new Error(e) }
    },
    NewAddMaterial(formName, bool) {
      console.log(this.rubberMaterialForm, 77777)
      if (!this.normalReceipe) {
        this.$refs[formName].validateField('stage_product_batch_no', error => {
          if (!error) {
            this.showChoiceMaterialsDialog(bool)
          }
        })
        return
      }
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.showChoiceMaterialsDialog(bool)
        } else {
          return false
        }
      })
    },
    async showChoiceMaterialsDialog(bool) {
      try {
        const objParames = JSON.parse(JSON.stringify(this.rubberMaterialForm))
        let a = {}
        if (this.normalReceipe) {
          a = { factory: this.rubberMaterialForm.factory,
            site: this.rubberMaterialForm.site,
            product_info: this.rubberMaterialForm.product_info,
            versions: this.rubberMaterialForm.versions,
            stage: this.rubberMaterialForm.stage }
        } else {
          a = { stage_product_batch_no: objParames.stage_product_batch_no }
        }

        // 点击生成之前进行版本验证
        await validate_versions_url('get', {
          params: a })
        if (!bool) {
          // 直接生成
          this.btnLoading = true
          await rubber_material_url('post', null, { data: objParames })
          this.$message.success('生成成功')
          this.$emit('refreshList')
          this.btnLoading = false
        } else {
          // // 配料
          this.objParames = objParames
          if (objParames.id) {
            // 获取详情 复制
            this.directBatching(objParames.id, true)
          } else {
            // 新增
            this.objParames._add = true
            this.showIngredient = true
          }
        }
        this.handleCloseMaterial()
      } catch (e) {
        this.btnLoading = false
        return
      }
    },
    async directBatching(id, _post) {
      try {
        const data = await rubber_material_url('get', id)
        if (!_post) {
          this.objParames = {
            factory: data.factory,
            site: data.site,
            SITE_name: data.site_name,
            material_type: data.stage_name || '',
            stage: data.stage,
            product_info: data.product_info,
            product_name: data.product_name,
            versions: data.versions,
            precept: data.precept,
            stage_product_batch_no: data.stage_product_batch_no,
            id: data.id,
            dev_type: data.dev_type || '',
            dev_type_name: data.dev_type_name || '',
            production_time_interval: data.production_time_interval || ''
          }
        }
        this.objParames._add = _post

        const weight_cnt_types = JSON.parse(JSON.stringify(data.weight_cnt_types))
        const arr = []
        weight_cnt_types.forEach(D => {
          D.weight_details.forEach(d => {
            d.name = D.name
            d.package_cnt = D.package_cnt
            d.package_type = D.package_type
            d.product_batching = D.product_batching
            d.weigh_type = D.weigh_type
            d.weight_cnt_types_id = D.id
          })
          arr.push(D.weight_details)
        })
        this.batchingList = {
          batching_details: data.batching_details,
          weight_cnt_types: arr
        }
        this.showIngredient = true
      } catch (e) { throw new Error(e) }
    },
    SITESelectChange(obj) {
      this.rubberMaterialForm.SITE_name = obj ? obj.global_name : ''
      this.generateRubberMaterialNOChanged()
    },
    changeFunStage(obj) {
      this.rubberMaterialForm.stage_name = obj ? obj.global_name : ''
      this.generateRubberMaterialNOChanged()
    },
    generateRubberMaterialNOChanged() {
      let productBatch
      if (this.rubberMaterialForm.product_info) {
        productBatch = this.productBatchNoOptions.filter(option =>
          option.id === this.rubberMaterialForm.product_info
        )
        if (productBatch[0]) {
          this.rubberMaterialForm.product_name = productBatch[0].product_name
        }
      }
      const SITE_name = this.rubberMaterialForm.SITE_name || ''
      const stage_name = this.rubberMaterialForm.stage_name || ''
      const product_name = this.rubberMaterialForm.product_name || ''

      this.rubberMaterialForm.stage_product_batch_no =
        SITE_name + '-' + stage_name + '-' +
        product_name + '-' + this.rubberMaterialForm.versions || ''
    },
    handleCloseIngredient() {
      this.showIngredient = false
    },
    changeList() {
      this.$emit('refreshList')
    }
  }
}
</script>

<style>

</style>
