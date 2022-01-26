<template>
  <div>
    <el-dialog
      title="胶料配料标准"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        :model="formInline"
      >
        <el-form-item label="胶料编码">
          <el-input
            v-model="formInline.stage_product_batch_no"
            size="mini"
            :disabled="true"
            placeholder="胶料编码"
          />
        </el-form-item>
        <el-form-item label="胶料名称">
          <el-input
            v-model="formInline.product_name"
            size="mini"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="炼胶机类型">
          <!-- <EquipCategorySelect
            v-model="formInline.dev_type"
            is-mini="mini"
            :is-disabled="true"
            @changeFun="changeDevType"
          /> -->
          {{ formInline.dev_type_name }}
        </el-form-item>
        <el-form-item label="可用机台">
          <el-select v-model="formInline.enable_equip" multiple placeholder="请选择" @change="equipChanged">
            <el-option
              v-for="item in optionsEquip"
              :key="item.equip_no"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
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
        <el-form-item
          v-if="!isView"
          style="float:right;"
        >
          <el-button @click="putNewsaveMaterialClicked">保存</el-button>
          <!-- <el-button @click="addMaterial">新建料包</el-button> -->
        </el-form-item>
        <div style="clear:both" />
      </el-form>

      <div
        v-for="(itemFa,i) in tableDataAll"
        :key="i"
      >
        <h3 v-if="i!==0&&['FM','RE','RFM'].includes(formInline.stage_name)?false:true">{{ i===0?'胶料':i===1?'炭黑':'油料' }}</h3>
        <el-table
          v-if="i!==0&&['FM','RE','RFM'].includes(formInline.stage_name)?false:true"
          :data="itemFa.tableData"
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
          <el-table-column label="原材料">
            <template slot-scope="{row,$index}">
              <el-input
                v-model="row.material_name"
                size="mini"
                :disabled="true"
              >
                <el-button
                  v-if="!isView"
                  slot="append"
                  icon="el-icon-search"
                  @click="pop_up_raw_material($index,i)"
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
          <el-table-column label="投料方式">
            <template slot-scope="{row}">
              <el-select
                v-model="row.type"
                clearable
                placeholder="请选择"
                :disabled="true"
              >
                <el-option
                  v-for="item in [{name:'密炼机投料口',id:1},{name:'炭黑粉料罐',id:2},{name:'油料罐',id:3}]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column v-for="(item) in formInline.enable_equip" :key="item" width="120" :label="item">
            <template slot-scope="{row}">
              <el-select
                v-model="row.master[item]"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item1 in i===0||i==1?['P','C']:['P','O']"
                  :key="item1"
                  :label="item1"
                  :value="item1"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!isView"
            label="操作"
          >
            <template slot-scope="{$index}">
              <el-button
                size="mini"
                @click="del_raw_material_row($index,i)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="!isView&&(i!==0&&['FM','RE','RFM'].includes(formInline.stage_name)?false:true)"
          style="text-align: center"
        >
          <el-button
            size="mini"
            @click="insert_NewPracticalWeightChanged(i)"
          >插入一行</el-button>
        </div>
      </div>
      <ingredientStandard
        ref="ingredientStandardRef"
        :add-table-data="addTableData"
        :is-ingredient-obj="isIngredientObj"
        :form-obj="formObj"
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
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="料包编码"
          prop="oldName"
        >
          {{ formInline.stage_product_batch_no }}-{{ formInline.dev_type_name }}-
          <el-select
            v-model="ruleForm.oldName"
            placeholder="请选择"
            style="width:100px;margin-left:6px"
            @change="changeOldName"
          >
            <el-option
              v-for="item in [{name:'硫磺包',id:1},{name:'细料包',id:2}]"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="分包数量"
          prop="package_cnt"
        >
          <el-input-number
            v-model="ruleForm.package_cnt"
            controls-position="right"
            :min="1"
          />
        </el-form-item>
        <el-form-item
          label="配料方式"
          prop="package_type"
        >
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
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleCloseAdd(false)">取 消</el-button>
        <el-button
          type="primary"
          @click="submitAdd"
        >确 定</el-button>
      </span>
    </el-dialog>
    <materialSelection
      ref="rawMaterialSync"
      :show="dialogRawMaterialSync"
      @handleCloseMaterialSelection="handleCloseMaterialSelection"
      @handleMaterialSelect="handleMaterialSelect"
    />
  </div>
</template>

<script>
// import EquipCategorySelect from '@/components/EquipCategorySelect'
import materialSelection from './materialSelection'
import ingredientStandard from './ingredient-standard'
import { rubber_material_url } from '@/api/rubber_recipe_fun'
import { equipUrl } from '@/api/base_w'
export default {
  components: { ingredientStandard, materialSelection },
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
      },
      listType: '',
      tableDataAll: [
        { tableData: [] },
        { tableData: [] },
        { tableData: [] }
      ],
      faI: null,
      optionsEquip: []
    }
  },
  computed: {
  },
  watch: {
    show(val) {
      this.dialogVisible = val
      if (val) {
        this.formInline = this.formObj

        const arr = this.batchingList.batching_details || []
        const a1 = arr.filter(d => d.type === 1)
        a1.forEach(d => {
          for (const key in d.master) {
            if (Object.hasOwnProperty.call(d.master, key)) {
              const element = d.master[key]
              if (element.indexOf('-H') > -1) {
                d.master[key] = ''
              }
            }
          }
        })
        this.tableDataAll[0].tableData = a1
        const a2 = arr.filter(d => d.type === 2)
        a2.forEach(d => {
          for (const key in d.master) {
            if (Object.hasOwnProperty.call(d.master, key)) {
              const element = d.master[key]
              if (element.indexOf('-H') > -1) {
                d.master[key] = ''
              }
            }
          }
        })
        this.tableDataAll[1].tableData = a2
        const a3 = arr.filter(d => d.type === 3)
        a3.forEach(d => {
          for (const key in d.master) {
            if (Object.hasOwnProperty.call(d.master, key)) {
              const element = d.master[key]
              if (element.indexOf('-H') > -1) {
                d.master[key] = ''
              }
            }
          }
        })
        this.tableDataAll[2].tableData = a3

        this.$nextTick(() => {
          this.addTableData = this.batchingList.weight_cnt_types || []
        })

        this.$set(this.formInline, '_enable_equip', this.formInline.enable_equip)
        this.getOptionsEquip()
      }
    },
    'formInline.enable_equip'(arr) {
      if (arr && arr.length) {
        this.tableDataAll.forEach(d => {
          d.tableData.forEach(D => {
            const arr1 = {}
            arr.forEach(dd => {
              arr1[dd] = D.master ? D.master[dd] : ''
            })
            D.master = arr1
          })
        })
      }
    }
  },
  updated() {
    // console.log(this.batchingList, 'batchingList')
  },
  methods: {
    equipChanged(e) {

    },
    async getOptionsEquip() {
      try {
        const data = await equipUrl('get', { params: { all: 1, category: this.formInline.dev_type }})
        this.optionsEquip = data.results || []
        const arr = []
        this.optionsEquip.forEach(D => {
          arr.push(D.equip_no)
        })
        // if (!this.formInline.enable_equip || !this.formInline.enable_equip.length) {
        //   this.$set(this.formInline, 'enable_equip', arr || [])
        // }
      } catch (e) {
        //
      }
    },
    handleClose(done) {
      this.tableDataAll.forEach(D => {
        D.tableData = []
      })
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
      if (this.$refs.rawMaterialSync) {
        this.$refs.rawMaterialSync.clearVal()
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
            package_type: obj.package_type,
            weigh_type: obj.weigh_type
          }])

          this.handleCloseAdd(false)
        } else {
          return false
        }
      })
    },
    del_raw_material_row(index, faI) {
      this.isIngredientObj = {}
      const a = this.tableDataAll[faI].tableData.splice(index, 1)
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
    insert_NewPracticalWeightChanged(i) {
      const obj = {}
      if (this.tableDataAll[i].tableData.length === 0) {
        this.formInline.enable_equip.forEach(d => {
          obj[d] = 'P'
        })
      }
      this.tableDataAll[i].tableData.push({
        type: i === 0 ? 1 : i === 1 ? 2 : 3,
        master: obj
      })
    },
    changeOldName(val) {
      const arr = [{ name: '硫磺包', id: 1 }, { name: '细料包', id: 2 }]
      const obj = arr.find(d => d.name === val)
      this.ruleForm.weigh_type = obj.id
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
      this.tableDataAll.forEach(dd => {
        dd.tableData.forEach(D => {
          if (D.material) {
            arr1.push(D.material)
          }
        })
      })

      this.currentMaterialList = arr1
    },
    pop_up_raw_material(index, faI) {
      // isIngredient true=> 细料选原材料
      if (index || index === 0) {
        this.currentMaterialIndex = index
        this.faI = faI
        this.isIngredient = false
      } else {
        this.isIngredient = true
      }
      this.listType = faI === 1 ? '炭黑' : faI === 2 ? '油料' : '胶料'
      this.setCurrentMaterialList()

      this.dialogRawMaterialSync = true
    },
    handleCloseMaterialSelection() {
      this.dialogRawMaterialSync = false
    },
    handleMaterialSelect(row) {
      // if ((this.listType === '炭黑' && row.material_type_name !== '炭黑') ||
      // (this.listType === '油料' && row.material_type_name !== '油料')) {
      //   //  ||(this.listType === '胶料' && (row.material_type_name === '油料' || row.material_type_name === '炭黑'))
      //   this.$message.info({
      //     message: '选择类别相同的原料',
      //     type: 'error'
      //   })
      //   return
      // }
      const arr = this.currentMaterialList.filter(D => D === row.id)
      if (arr.length > 0) {
        // this.$message.info({
        //   message: '不能选择相同的原料',
        //   type: 'error'
        // })
        // return
      }
      if (!this.isIngredient) {
        const a = this.tableDataAll[this.faI].tableData[this.currentMaterialIndex]
        this.$set(a, 'material_name', row.material_name)
        this.$set(a, 'material', row.id)
        // this.$set(a, 'sn', this.currentMaterialIndex + 1)
        this.$set(a, 'material_type', row.material_type_name)
        if (!a.type) {
          if (row.material_type_name.indexOf('炭黑') > -1) {
            this.$set(a, 'type', 2)
          } else if (row.material_type_name.indexOf('油料') > -1) {
            this.$set(a, 'type', 3)
          } else {
            this.$set(a, 'type', 1)
          }
        }
      } else {
        this.isIngredientObj = row
      }

      this.dialogRawMaterialSync = false
    },
    addMaterial() {
      if (!this.formInline.dev_type) {
        this.$message.info({
          message: '请选择炼胶机类型'
        })
        return
      }
      this.dialogVisibleAdd = true
    },
    async putNewsaveMaterialClicked() {
      if (!this.formInline.dev_type) {
        this.$message.info({
          message: '炼胶机类型不能为空'
        })
        return
      }
      if (!this.formInline.enable_equip) {
        this.$message.info({
          message: '请选择可用机台'
        })
        return
      }

      const _tableDataAll = JSON.parse(JSON.stringify(this.tableDataAll))
      const arr = []
      try {
        _tableDataAll.forEach(d => {
          d.tableData.forEach((dd, i) => {
            this.formInline.enable_equip.forEach(equip => {
              if (!dd.master[equip] && i === 0) {
                throw Error()
              } else if (i > 0 && !dd.master[equip]) {
                if (d.tableData[i - 1].master[equip].indexOf('-H') > -1) {
                  dd.master[equip] = d.tableData[i - 1].master[equip]
                } else {
                  dd.master[equip] = d.tableData[i - 1].master[equip] + '-H'
                }
              }
            })
            this.$set(dd, 'sn', i + 1)
            arr.push(dd)
          })
        })
      } catch (e) {
        this.$message.info('可用机台的投料方式未填')
        return
      }
      if (arr.length > 0) {
        try {
          arr.forEach(D => {
            if (!D.material || !D.actual_weight || !D.type) {
              throw Error()
            }
          })
        } catch (e) {
          this.$message.info('原材料、实际重量、投料方式不能为空')
          return
        }
      }

      let ingredientList = []
      if (this.$refs.ingredientStandardRef) {
        ingredientList = this.$refs.ingredientStandardRef.tableData
        if (ingredientList.length > 0) {
          try {
            ingredientList.forEach(D => {
              D.forEach((d, i) => {
                if (!d.standard_error) {
                  d.standard_error = ''
                }
                if (!d.material || !d.standard_weight) {
                  this.$message.info('原材料与实际重量不能为空')
                  throw Error()
                }

                this.formInline.enable_equip.forEach(equip => {
                  if (!d.master[equip] && i === 0) {
                    this.$message.info('细料可用机台的投料方式未填')
                    throw Error()
                  } else if (i > 0 && !d.master[equip]) {
                    if (D[i - 1].master[equip].indexOf('-H') > -1) {
                      d.master[equip] = D[i - 1].master[equip]
                    } else {
                      d.master[equip] = D[i - 1].master[equip] + '-H'
                    }
                  }
                })
              })
            })
          } catch (e) {
            console.log(e, 5555555555)
            return
          }
        }
      }

      const parameter = {}
      const ingredientListParams = []
      Object.assign(parameter, this.formInline)
      parameter.batching_details = arr
      ingredientList.forEach(D => {
        if (D.length) {
          ingredientListParams.push({
            name: D[0].name,
            package_cnt: D[0].package_cnt,
            weigh_type: D[0].weigh_type,
            package_type: D[0].package_type,
            weight_details: D,
            id: D[0].weight_cnt_types_id || null
          })
        }
      })
      parameter.weight_cnt_types = ingredientListParams
      if (parameter.stage) {
        delete parameter.stage_product_batch_no
      }
      parameter.batching_detail_ids = this.batching_details_delete || []
      parameter.weight_detail_ids = this.weight_material_delete || []
      parameter.cnt_type_ids = this.weight_cnt_types_delete || []

      if (!parameter._add) {
        parameter.enable_equip = parameter.enable_equip ? parameter.enable_equip : []
        parameter._enable_equip = parameter._enable_equip ? parameter._enable_equip : []
        const addIdArr = parameter.enable_equip.filter((i) => {
          return parameter._enable_equip.indexOf(i) === -1
        }) // 最后添加的数据
        const delIdArr = parameter._enable_equip.filter((i) => {
          return parameter.enable_equip.indexOf(i) === -1
        }) // 最后删除的数据
        parameter.del_batching_equip = delIdArr || []
        parameter.add_batching_equip = addIdArr || []
      }

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
