<template>
  <div>
    <el-dialog
      title="胶料配料标准"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose"
    >
      <el-form :inline="true" :model="formInline">
        <el-form-item label="胶料编码">
          <el-input v-model="formInline.stage_product_batch_no" size="mini" :disabled="true" placeholder="胶料编码" />
        </el-form-item>
        <el-form-item label="胶料名称">
          <el-input
            v-model="formInline.product_name"
            size="mini"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="炼胶机类型">
          <EquipCategorySelect
            v-model="formInline.dev_type"
            is-mini="mini"
            :is-disabled="isView"
            @changeFun="changeDevType"
          />
        </el-form-item>
        <el-form-item label="炼胶时间">
          <el-input-number
            v-model.number="formInline.production_time_interval"
            size="mini"
            :step="1"
            step-strictly
            :min="0"
            :disabled="isView"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item v-if="!isView" style="float:right;">
          <el-button @click="putNewsaveMaterialClicked">保存</el-button>
          <el-button @click="addMaterial">新建料包</el-button>
        </el-form-item>
        <div style="clear:both" />
      </el-form>

      <el-table
        :data="tableData"
        border
        show-summary
      >
        <el-table-column
          label="No"
          type="index"
          width="60"
        />
        <el-table-column
          prop="material_type"
          label="类别"
          width="80"
          column-key="material_type"
        />
        <el-table-column
          label="原材料"
        >
          <template slot-scope="{row,$index}">
            <el-input
              v-model="row.material_name"
              size="mini"
              :disabled="true"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="pop_up_raw_material($index)"
              />
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="实际重量/kg"
          prop="actual_weight"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model.number="row.actual_weight"
              size="mini"
              :min="0"
              controls-position="right"
              :disabled="isView"
            />
            <!-- @change="PutNewPracticalWeightChanged(row)" -->
          </template>
        </el-table-column>
        <el-table-column
          label="误差"
          prop="standard_error"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model.number="row.standard_error"
              size="mini"
              controls-position="right"
              :disabled="isView"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="!isView"
          label="操作"
        >
          <template slot-scope="{$index}">
            <el-button
              size="mini"
              @click="del_raw_material_row($index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!isView" style="text-align: center">
        <el-button size="mini" @click="insert_NewPracticalWeightChanged">插入一行</el-button>
      </div>
      <ingredientStandard
        ref="ingredientStandardRef"
        :add-table-data="addTableData"
        :is-ingredient-obj="isIngredientObj"
        :is-view="isView"
        @pop_up_raw_material="pop_up_raw_material"
        @deleteRow="deleteRow"
        @deleteOneRow="deleteOneRow"
      />

    </el-dialog>
    <el-dialog
      title="新建料包"
      :visible.sync="dialogVisibleAdd"
      width="500px"
      :before-close="handleCloseAdd"
      append-to-body
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="料包编码" prop="oldName">
          {{ formInline.stage_product_batch_no }}-{{ formInline.dev_type_name }}-
          <el-input v-model="ruleForm.oldName" style="width:80px;margin-left:6px" />
        </el-form-item>
        <el-form-item label="分包数量" prop="package_cnt">
          <el-input-number
            v-model="ruleForm.package_cnt"
            controls-position="right"
            :min="1"
          />
        </el-form-item>
        <el-form-item label="配料方式" prop="package_type">
          <el-select
            v-model="ruleForm.package_type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in [{name:'手动',id:2},{name:'自动',id:1}]"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseAdd(false)">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <materialSelection
      :show="dialogRawMaterialSync"
      @handleCloseMaterialSelection="handleCloseMaterialSelection"
      @handleMaterialSelect="handleMaterialSelect"
    />
  </div>
</template>

<script>
import EquipCategorySelect from '@/components/EquipCategorySelect'
import materialSelection from './materialSelection'
import ingredientStandard from './ingredient-standard'
import { rubber_material_url } from '@/api/rubber_recipe_fun'
export default {
  components: { ingredientStandard, EquipCategorySelect, materialSelection },
  props: {
    formObj: {
      type: Object,
      default() {
        return {}
      }
    },
    batchingList: {
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
      dialogVisible: false,
      formInline: {},
      tableData: [],
      dialogRawMaterialSync: false,
      //   记录选过的胶料
      currentMaterialList: [],
      currentMaterialIndex: '',
      dialogVisibleAdd: false,
      ruleForm: {
        oldName: '',
        package_cnt: undefined,
        package_type: 1
      },
      addTableData: [],
      ingredientList: [],
      isIngredient: null,
      isIngredientObj: {},
      batching_details_delete: [],
      weight_material_delete: [],
      weight_cnt_types_delete: [],
      rules: {
        oldName: [
          { required: true, message: '请输入料包编码', trigger: 'bulr' }
        ],
        package_cnt: [
          { required: true, message: '请输入分包', trigger: 'bulr' }
        ],
        package_type: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    show(val) {
      this.dialogVisible = val
      if (val) {
        this.formInline = this.formObj
        this.tableData = this.batchingList.batching_details || []
        this.$nextTick(() => {
          this.addTableData = this.batchingList.weight_cnt_types || []
        })
        console.log(this.addTableData, 'this.addTableData')
      }
    }
  },
  updated() {
  },
  methods: {
    handleClose(done) {
      this.tableData = []
      this.addTableData = []
      this.ruleForm = {
        oldName: '',
        package_cnt: undefined,
        package_type: 1
      }
      this.batching_details_delete = []
      this.weight_material_delete = []
      this.weight_cnt_types_delete = []
      if (this.$refs.ingredientStandardRef) {
        // 清空删除的id
        this.$refs.ingredientStandardRef.weight_cnt_types_delete = []
        this.$refs.ingredientStandardRef.weight_material_delete = []
      }
      this.$emit('handleCloseIngredient')
      if (done) {
        done()
      }
    },
    handleCloseAdd(done) {
      this.dialogVisibleAdd = false
      if (done) {
        done()
      }
    },
    changeDevType(val) {
      this.formInline.dev_type_name = val ? val.category_name : ''
    },
    submitAdd() {
      const obj = JSON.parse(JSON.stringify(this.ruleForm))

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const _name = this.formInline.stage_product_batch_no + '-' +
      (this.formInline.dev_type_name || '') + '-' + obj.oldName
          this.addTableData.push([{
            name: _name,
            package_cnt: obj.package_cnt,
            package_type: obj.package_type
          }])

          this.handleCloseAdd(false)
        } else {
          return false
        }
      })
    },
    del_raw_material_row(index) {
      this.isIngredientObj = {}
      const a = this.tableData.splice(index, 1)
      if (a[0].id) {
        this.batching_details_delete.push(a[0].id)
      }
    },
    deleteRow(val) {
      this.weight_material_delete = val
      this.isIngredientObj = {}
    },
    deleteOneRow(val) {
      this.weight_cnt_types_delete = val
      this.isIngredientObj = {}
    },
    insert_NewPracticalWeightChanged() {
      this.tableData.push({})
    },
    setCurrentMaterialList() {
      if (this.$refs.ingredientStandardRef) {
        this.ingredientList = this.$refs.ingredientStandardRef.tableData
      }
      // 避免选择重复的原料
      this.currentMaterialList = []
      const arr1 = []
      this.ingredientList.forEach(D => {
        D.forEach(d => {
          if (d.material) {
            arr1.push(d.material)
          }
        })
      })
      this.tableData.forEach(D => {
        if (D.material) {
          arr1.push(D.material)
        }
      })
      this.currentMaterialList = arr1
    },
    pop_up_raw_material(index) {
      if (index || index === 0) {
        this.currentMaterialIndex = index
        this.isIngredient = false
      } else {
        this.isIngredient = true
      }
      this.setCurrentMaterialList()

      this.dialogRawMaterialSync = true
    },
    handleCloseMaterialSelection() {
      this.dialogRawMaterialSync = false
    },
    handleMaterialSelect(row) {
      const arr = this.currentMaterialList.filter(D => D === row.id)
      if (arr.length > 0) {
        this.$message.info({
          message: '不能选择相同的原料',
          type: 'error'
        })
        return
      }
      if (!this.isIngredient) {
        this.$set(this.tableData[this.currentMaterialIndex], 'material_name', row.material_name)
        this.$set(this.tableData[this.currentMaterialIndex], 'material', row.id)
        this.$set(this.tableData[this.currentMaterialIndex], 'sn', 0)
        this.$set(this.tableData[this.currentMaterialIndex], 'material_type', row.material_type_name)
      } else {
        this.isIngredientObj = row
      }

      this.dialogRawMaterialSync = false
    },
    addMaterial() {
      this.dialogVisibleAdd = true
    },
    async putNewsaveMaterialClicked() {
      if (!this.formInline.dev_type) {
        this.$message.info({
          message: '炼胶机类型不能为空'
        })
        return
      }
      if (this.tableData.length > 0) {
        try {
          this.tableData.forEach(D => {
            if (!D.material || !D.actual_weight) {
              throw Error()
            }
          })
        } catch (e) {
          this.$message.info('原材料与实际重量不能为空')
          return
        }
      }
      let ingredientList = []
      if (this.$refs.ingredientStandardRef) {
        ingredientList = this.$refs.ingredientStandardRef.tableData

        if (ingredientList.length > 0) {
          try {
            ingredientList.forEach(D => {
              D.forEach(d => {
                if (!d.material || !d.standard_weight) {
                  throw Error()
                }
              })
            })
          } catch (e) {
            this.$message.info('原材料与实际重量不能为空')
            return
          }
        } else {
          this.$message.info('原材料与实际重量不能为空')
          return
        }
      }
      const parameter = {}
      const ingredientListParams = []
      Object.assign(parameter, this.formInline)
      parameter.batching_details = this.tableData
      ingredientList.forEach(D => {
        ingredientListParams.push({
          name: D[0].name,
          package_cnt: D[0].package_cnt,
          package_type: D[0].package_type,
          weight_details: D,
          id: D[0].weight_cnt_types_id || null
        })
      })
      parameter.weight_cnt_types = ingredientListParams
      if (parameter.stage) {
        delete parameter.stage_product_batch_no
      }
      parameter.batching_detail_ids = this.batching_details_delete || []
      parameter.weight_detail_ids = this.weight_material_delete || []
      parameter.cnt_type_ids = this.weight_cnt_types_delete || []
      console.log(parameter, 7777)

      try {
        const _api = parameter._add ? 'post' : 'put'
        const _id = parameter._add ? null : parameter.id
        await rubber_material_url(_api, _id, { data: parameter })
        this.dialogVisible = false
        this.handleClose(false)
        this.$emit('changeList')
      } catch (e) { //
      }
    }
  }
}
</script>

<style>

</style>
