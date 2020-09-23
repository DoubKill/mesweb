<template>
  <div>
    <el-form :inline="true">
      <el-form-item
        style="float: left"
        label="胶料编码"
      >
        <el-input
          v-model="productNo"
          @input="productNoChange"
        />
      </el-form-item>
      <el-form-item
        style="float: left"
        label="胶料名称"
      >
        <el-input
          v-model="productName"
          @input="productNameChange"
        />
      </el-form-item>
      <el-form-item
        v-if="permissionObj.productinfo.indexOf('add')>-1"
        style="float: right"
      >
        <el-button @click="showAddRubberRecipeDialog">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableData"
      border
      style="width: 100%"
      @row-click="handleCurrentChange"
    >
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
      />
      <el-table-column
        prop="product_name"
        label="胶料名称"
      />
      <el-table-column
        prop="created_username"
        label="创建用户"
      />
      <el-table-column
        prop="created_date"
        label="创建日期"
      />
    </el-table>
    <pagination
      :total="total"
      @currentChange="currentChange"
    />

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="新建胶料代码"
      :visible.sync="dialogAddRubberRecipe"
    >
      <el-form
        v-model="rubberRecipeForm"
        :label-width="formLabelWidth"
      >
        <!--
            <el-form-item label="产地">
                <el-select v-model="rubberRecipeForm.factory" placeholder="请选择">
                    <el-option
                            v-for="option in originOptions"
                            :key="option.id"
                            :label="option.global_name"
                            :value="option.id">
                    </el-option>
                </el-select>
            </el-form-item>
            -->
        <el-form-item
          :error="rubberRecipeFormError.product_no"
          label="胶料编码"
          :label-width="formLabelWidth"
        >
          <el-input v-model="rubberRecipeForm.product_no" />
        </el-form-item>
        <!--
            <el-form-item label="版本" :label-width="formLabelWidth">
                <el-input v-model="rubberRecipeForm.versions"></el-input>
            </el-form-item>
            -->
        <el-form-item
          :error="rubberRecipeFormError.product_name"
          label="胶料名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="rubberRecipeForm.product_name" />
        </el-form-item>
        <!--
            <el-form-item label="方案" :label-width="formLabelWidth">
                <el-input v-model="rubberRecipeForm.precept"></el-input>
            </el-form-item>
            -->
        <el-form-item>
          <p style="color: red">{{ rubberRecipeError }}</p>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogAddRubberRecipe = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAddRubberRecipe"
        >生成</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      title="选择原材料"
      :visible.sync="dialogChoiceMaterials"
      @open="dialogChoiceMaterialsOpen"
    >
      <el-row>
        <el-form :inline="true">
          <el-form-item style="float: right">
            <el-button @click="rmClicked">RM</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button @click="selectClicked">选择</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-table
            ref="allMaterialsMultipleTable"
            height="250"
            border
            :data="materials"
            style="width: 100%"
            @selection-change="handleMaterialsSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              label="原材料代码"
              prop="material_no"
            />
            <el-table-column
              label="原材料名称"
              prop="material_name"
            />
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-table
            ref="materialsMultipleTable"
            border
            :data="selectedMaterials"
            style="width: 100%"
            @select="handleSelect"
            @selection-change="handleSelectedMaterialsSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              label="原材料代码"
              prop="material_no"
            />
            <el-table-column
              label="原材料名称"
              prop="material_name"
            />
            <el-table-column label="车次">
              <template slot-scope="scope">
                <el-select
                  v-if="scope.row.id"
                  v-model="scope.row.car_number"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="option in carNumberOptionsNotRm"
                    :key="option.id"
                    :label="option.global_name"
                    :value="option.global_name"
                  />
                </el-select>
                <el-select
                  v-else
                  v-model="scope.row.car_number"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="option in carNumberOptionsRm"
                    :key="option.id"
                    :label="option.global_name"
                    :value="option.global_name"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="胶料配方标准"
      :visible.sync="dialogRubberRecipeStandard"
    >
      <el-form :inline="true">
        <el-form-item style="float: right">
          <el-button
            v-if="currentRow.used_type === 1 || currentRow.used_type === -1"
            @click="newClicked"
          >新建
          </el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            v-if="currentRow.used_type === 1 || currentRow.used_type === -1"
            @click="saveClicked"
          >保存
          </el-button>
        </el-form-item>
      </el-form>
      <table
        class="table table-bordered"
        style="width: 100%; color: #909399; font-size: 14px;"
      >
        <thead>
          <tr>
            <th>S</th>
            <th>No</th>
            <th>段次</th>
            <th>类别</th>
            <th>原材料</th>
            <th>配比</th>
            <th>配比累计</th>
          </tr>
        </thead>
        <tbody style="color: #606266;">
          <tr style="background: rgba(189,198,210,0.73)">
            <td
              colspan="5"
              style="text-align: center"
            >配方结果</td>
            <td style="text-align: center">{{ ratioSum }}</td>
            <td />
          </tr>
          <tr
            v-for="(material, index ) in selectedMaterials"
            :key="index"
          >
            <td />
            <td>{{ index + 1 }}</td>
            <td>{{ material.car_number }}</td>
            <td>{{ material.material_type_name }}</td>
            <td>{{ material.material_name }}</td>
            <td style="text-align: center">
              <el-input-number
                v-if="material.car_number && material.car_number.indexOf('RM') !== 0"
                v-model.number="material.ratio"
                :disabled=" currentRow.used_type !== -1 && currentRow.used_type !== 1"
                :precision="2"
                :step="0.1"
                @change="carNumberChanged"
              />
            </td>
            <td>{{ material.ratio_sum }}</td>
          </tr>
        </tbody>
      </table>
    </el-dialog>

    <el-dialog
      title="复制生成新的胶料标准"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogCopyRubberRecipeStandardVisible"
    >
      <el-form :label-width="formLabelWidth">
        <el-form-item label="来源胶料">
          <el-col :span="6">
            <el-input
              v-model="sourceFactory"
              disabled
            />
          </el-col>
          <el-col
            class="line"
            :span="2"
          >-</el-col>
          <el-col :span="6">
            <el-input
              v-model="sourceProductNo"
              disabled
            />
          </el-col>
          <el-col
            class="line"
            :span="2"
          >-</el-col>
          <el-col :span="6">
            <el-input
              v-model="sourceVersion"
              disabled
            />
          </el-col>
        </el-form-item>
        <el-form-item label="新建胶料">
          <el-col :span="6">
            <el-select
              v-model="newFactory"
              placeholder="请选择"
            >
              <el-option
                v-for="origin in originOptions"
                :key="origin.id"
                :label="origin.global_name"
                :value="origin.id"
              />
            </el-select>
          </el-col>
          <el-col
            class="line"
            :span="2"
          >-</el-col>
          <el-col :span="6">
            <el-input v-model="newProductNo" />
          </el-col>
          <el-col
            class="line"
            :span="2"
          >-</el-col>
          <el-col :span="6">
            <el-input v-model="newVersion" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <p style="color: red">{{ copyError }}</p>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="handleCopyRubberRecipeStandard"
        >复制</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/page'
import { globalCodesUrl, materialsUrl, productInfosUrl, copyProductInfosUrl } from '@/api/base_w'
import commonVal from '@/utils/common'
import { mapGetters } from 'vuex'
export default {
  components: { pagination },
  data: function() {
    return {
      tableData: [],
      getParams: {
        page: 1
      },
      formLabelWidth: commonVal.formLabelWidth,
      dialogAddRubberRecipe: false,
      originOptions: [], // 产地选项
      rubberRecipeForm: {
        // factory: "", // 产地
        product_no: '', // 胶料编码
        // versions: "", // 版本
        product_name: '' // 胶料名称
        // precept: "" // 方案
      },
      rubberRecipeFormError: {
        product_no: '',
        product_name: ''
      },
      materials: [],
      selectedMaterials: [],
      dialogChoiceMaterials: false,
      dialogRubberRecipeStandard: false,
      selectingMaterial: false,
      toggleMaterials: false,
      carNumberOptionsNotRm: [],
      carNumberOptionsRm: [],
      ratioSum: 0,
      rubberRecipeError: '',
      carNumberIdByName: {},
      currentRow: {
        used_type: -1
      },
      materialById: {},
      dialogCopyRubberRecipeStandardVisible: false,

      sourceFactory: '',
      sourceProductNo: '',
      sourceVersion: '',

      newFactory: '',
      newProductNo: '',
      newVersion: '',
      originByName: {},
      copyError: '',
      productNo: '',
      productName: '',
      total: 0
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created: function() {
    this.permissionObj = this.permission
    var app = this
    this.getList()
    globalCodesUrl('get', {
      params: {
        class_name: '产地'
      }
    }).then(function(response) {
      app.originOptions = response.results
      for (var i = 0; i < app.originOptions.length; ++i) {
        app.originByName[
          app.originOptions[i].global_name] = app.originOptions[i]
      }
    }).catch(function() {
    })
    materialsUrl('get', null, {
      params: {
        all: 1
        // page_size: 100000000
      }
    })
      .then(function(response) {
        app.materials = response.results
        for (var i = 0; i < app.materials.length; ++i) {
          app.materialById[app.materials[i].id] = app.materials[i]
        }
      }).catch(function() {
      })
    globalCodesUrl('get', {
      params: {
        class_name: '胶料段次'
      }
    }).then(function(response) {
      for (var i = 0; i < response.results.length; ++i) {
        app.carNumberIdByName[response.results[i].global_name] = response.results[i].id
        if (response.results[i].global_name.startsWith('RM')) {
          app.carNumberOptionsRm.push(response.results[i])
        } else {
          app.carNumberOptionsNotRm.push(response.results[i])
        }
      }
    }).catch(function() {
    })
  },
  methods: {
    getList() {
      const app = this
      productInfosUrl('get', null, {
        params: this.getParams
      }).then(function(response) {
        app.total = response.count
        app.tableData = response.results
      }).catch(function() {
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getList()
    },
    productNoChange() {
      this.getParams['product_no'] = this.productNo
      this.getParams.page = 1
      this.getList()
    },
    productNameChange() {
      this.getParams['product_name'] = this.productName
      this.getParams.page = 1
      this.getList()
    },
    usedTypeFormatter: function(row, column) {
      return this.usedTypeChoice(row.used_type)
    },
    usedTypeChoice: function(usedType) {
      switch (usedType) {
        case 1:
          return '编辑'
        case 2:
          return '通过'
        case 3:
          return '应用'
        case 4:
          return '驳回'
        case 5:
          return '废弃'
      }
    },
    updateFlag(id, pass_flag) {
      var app = this
      productInfosUrl('patch', id, {
        data: pass_flag
      }).then(function(response) {
        app.currentChange(app.currentPage)
      })
    },
    pass: function(row) {
      this.updateFlag(row.id, true)
    },
    reject: function(row) {
      this.updateFlag(row.id, false)
    },
    apply: function(row) {
      this.updateFlag(row.id, true)
    },
    discard: function(row) {
      this.updateFlag(row.id, false)
    },
    showAddRubberRecipeDialog: function() {
      this.rubberRecipeError = ''
      this.rubberRecipeForm = {
        // factory: "", // 产地
        product_no: '', // 胶料编码
        // versions: "", // 版本
        product_name: '' // 胶料名称
        // precept: "" // 方案
      }
      this.dialogAddRubberRecipe = true
      this.currentRow = {
        used_type: -1
      } // 新建和更新标志 -1新建 其他更新
    },
    handleAddRubberRecipe: function() {
      this.rubberRecipeFormError = {
        product_no: '',
        product_name: ''
      }
      var app = this
      productInfosUrl('post', null, {
        data: {
          product_no: app.rubberRecipeForm.product_no,
          product_name: app.rubberRecipeForm.product_name
        }
      }).then(function(response) {
        app.$message.success(app.rubberRecipeForm.product_name + '创建成功')
        app.getParams.page = 1
        app.getList()
        app.dialogAddRubberRecipe = false
      }).catch(function(error) {
        app.rubberRecipeFormError.product_no = error.product_no.join(',')
        app.rubberRecipeFormError.product_name = error.product_name.join(',')
      })

      // this.rubberRecipeError = "";
      // axios.get(ValidateVersionsUrl, {
      //
      //     params: this.rubberRecipeForm
      // }).then(function (response) {
      //
      //     if (response.data.code === 0) {
      //
      //         app.selectedMaterials = [];
      //         app.dialogAddRubberRecipe = false;
      //         app.dialogChoiceMaterials = true
      //
      //     } else {
      //
      //         app.rubberRecipeError = response.data.message
      //     }
      // }).catch(function (error) {
      //
      //     app.rubberRecipeError = error.response.data.join(",");
      // });
    },
    handleMaterialsSelectionChange: function(val) {
      if (this.toggleMaterials) { return }
      this.selectingMaterial = true
      for (var i = 0; i < val.length; ++i) {
        if (this.selectedMaterials.indexOf(val[i]) === -1) {
          this.selectedMaterials.push(val[i])
        }
      }
      for (var j = 0; j < this.selectedMaterials.length; ++j) {
        if (this.selectedMaterials[j].id && val.indexOf(this.selectedMaterials[j]) === -1) {
          this.selectedMaterials.splice(j, 1)
          --j
        }
      }
      var app = this
      setTimeout(function() {
        if (val) {
          val.forEach(row => {
            app.$refs.materialsMultipleTable.toggleRowSelection(row, true)
          })
        }
        app.selectingMaterial = false
      }, 0)
    },
    handleSelectedMaterialsSelectionChange: function(val) {
      if (this.selectingMaterial) { return }
      if (this.toggleMaterials) { return }
      for (var i = 0; i < this.materials.length; ++i) {
        var material = this.materials[i]
        if (val.indexOf(material) === -1) {
          this.$refs.allMaterialsMultipleTable.toggleRowSelection(material, false)
        }
      }
      if (!val.length) {
        for (var j = 0; j < this.selectedMaterials.length; ++j) {
          if (!this.selectedMaterials[j].id) {
            this.selectedMaterials.splice(j, 1)
            --j
          }
        }
      }
    },
    rmClicked: function() {
      var emptyRow = {}
      this.selectedMaterials.push(emptyRow)
      var app = this
      app.$refs.materialsMultipleTable.toggleRowSelection(app.selectedMaterials[app.selectedMaterials.length - 1], true)
    },
    handleSelect: function(selection, row) {
      if (!row.id) {
        this.selectedMaterials.splice(this.selectedMaterials.indexOf(row), 1)
      }
    },
    initRatio() {
      for (var i = 0; i < this.selectedMaterials.length; ++i) {
        if (this.selectedMaterials[i].car_number.indexOf('RM') !== 0 && !this.selectedMaterials[i].ratio) {
          this.$set(this.selectedMaterials[i], 'ratio', 0.0)
        }
        if (!this.selectedMaterials[i].ratio_sum) {
          this.$set(this.selectedMaterials[i], 'ratio_sum', 0.0)
        }
      }
    },
    selectClicked: function() {
      if (!this.selectedMaterials.length) { return }
      for (var i = 0; i < this.selectedMaterials.length; ++i) {
        if (!this.selectedMaterials[i].car_number) {
          this.$alert('请选择所有原材料车次', '警告', {
            confirmButtonText: '确定'
          })
          return
        }
      }
      this.initRatio()
      this.carNumberChanged()
      this.dialogChoiceMaterials = false
      this.dialogRubberRecipeStandard = true
    },
    newClicked: function() {
      this.dialogRubberRecipeStandard = false
      this.dialogChoiceMaterials = true
    },
    saveClicked: function() {
      var rubberRatioSum = 0.0
      for (var i = 0; i < this.selectedMaterials.length; ++i) {
        if (this.selectedMaterials[i].material_type_name && (
          this.selectedMaterials[i].material_type_name === '天然胶' ||
          this.selectedMaterials[i].material_type_name === '合成胶')) {
          rubberRatioSum += this.selectedMaterials[i].ratio
        }
      }
      if (rubberRatioSum !== 100.0) {
        this.$alert('天然胶加合成胶总配比必须为100', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        var app = this
        var productrecipe_set = []
        for (i = 0; i < this.selectedMaterials.length; ++i) {
          var productrecipe = {

            stage: app.carNumberIdByName[app.selectedMaterials[i].car_number],
            sn: i,
            ratio: app.selectedMaterials[i].ratio
          }
          if (this.selectedMaterials[i].id) {
            productrecipe.material = this.selectedMaterials[i].id
          }
          productrecipe_set.push(productrecipe)
        }
        if (this.currentRow.used_type !== -1) {
          productInfosUrl('put', this.currentRow.id, {
            data: { productrecipe_set }
          }).then(function(response) {
            app.dialogRubberRecipeStandard = false
            app.$message(app.currentRow.product_name + '修改成功')
            app.currentChange(app.currentPage)
          }).catch(function() {
          })
        } else {
          productInfosUrl('post', null, {
            data: {
              product_no: app.rubberRecipeForm.product_no,
              product_name: app.rubberRecipeForm.product_name,
              // versions: app.rubberRecipeForm.versions,
              // precept: app.rubberRecipeForm.precept,
              // factory: app.rubberRecipeForm.factory,
              productrecipe_set: productrecipe_set
            }
          }).then(function(response) {
            app.dialogRubberRecipeStandard = false
            app.$message(app.rubberRecipeForm.product_name + '创建成功')
            app.currentChange(app.currentPage)
          }).catch(function() {
          })
        }
      }
    },
    afterGetData: function() {
      this.currentRow = {
        used_type: -1
      }
    },
    carNumberChanged: function() {
      for (var i = 0; i < this.selectedMaterials.length; ++i) {
        if (!this.selectedMaterials[i - 1]) { // 第一项
          this.selectedMaterials[i].ratio_sum = this.selectedMaterials[i].ratio
        } else if (this.selectedMaterials[i].ratio) { // 非rm
          this.selectedMaterials[i].ratio_sum =
            this.selectedMaterials[i].ratio + this.selectedMaterials[i - 1].ratio_sum
        } else { // rm
          this.selectedMaterials[i].ratio_sum = this.selectedMaterials[i - 1].ratio_sum
        }
        this.selectedMaterials[i].ratio_sum = Number(this.selectedMaterials[i].ratio_sum.toFixed(2))
      }
      this.ratioSum = this.selectedMaterials[this.selectedMaterials.length - 1].ratio_sum
    },
    handleCurrentChange: function(val) {
      this.currentRow = val
    },
    showRubberRecipeStandardDialog: function() {
      var app = this
      productInfosUrl('get', this.currentRow.id)
        .then(function(response) {
          app.selectedMaterials = []
          for (var i = 0; i < response.productrecipe_set.length; ++i) {
            if (!response.productrecipe_set[i].material) {
              app.selectedMaterials.push({

                car_number: response.productrecipe_set[i].stage_name
              })
              continue
            }
            var material_ = app.materialById[response.productrecipe_set[i].material]
            material_.car_number = response.productrecipe_set[i].stage_name
            material_.ratio = Number(response.productrecipe_set[i].ratio)
            app.selectedMaterials.push(material_)
          }
          if (app.selectedMaterials.length) {
            app.initRatio()
            app.carNumberChanged()
            app.dialogRubberRecipeStandard = true
          }
        }).catch(function() {
        })
    },
    dialogChoiceMaterialsOpen() {
      if (this.selectedMaterials.length) {
        var app = this
        this.toggleMaterials = true
        setTimeout(function() {
          for (var i = 0; i < app.selectedMaterials.length; ++i) {
            app.$refs.materialsMultipleTable.toggleRowSelection(app.selectedMaterials[i], true)
            for (var j = 0; j < app.materials.length; ++j) {
              if (app.selectedMaterials[i].id && app.materials[j].id === app.selectedMaterials[i].id) {
                app.$refs.allMaterialsMultipleTable.toggleRowSelection(app.materials[j], true)
                break
              }
            }
          }
          app.toggleMaterials = false
        }, 0)
      }
    },
    copyRecipeClicked: function() {
      var productStandardNo = this.currentRow.product_standard_no.split('-')
      this.sourceFactory = this.currentRow.factory
      this.sourceProductNo = productStandardNo[1]
      this.sourceVersion = productStandardNo[2]
      this.newFactory = this.originByName[this.sourceFactory].id
      this.newProductNo = this.sourceProductNo
      var versionNumber = Number(this.sourceVersion)
      if (!isNaN(versionNumber)) {
        this.newVersion = versionNumber + 1
      } else { this.newVersion = this.sourceVersion }
      this.dialogCopyRubberRecipeStandardVisible = true
    },
    handleCopyRubberRecipeStandard: function() {
      this.copyError = ''
      var app = this
      copyProductInfosUrl('post', {
        data: {
          product_info_id: app.currentRow.id,
          factory: app.newFactory,
          versions: app.newVersion
        }
      }).then(function(response) {
        app.dialogCopyRubberRecipeStandardVisible = false
        app.$message(app.currentRow.product_standard_no + '拷贝成功')
        app.currentChange(app.currentPage)
      }).catch(function(error) {
        app.copyError =
          error.non_field_errors[0]
      })
    }
  }
}
</script>

<style scoped>
.line {
    text-align: center;
 }
</style>
