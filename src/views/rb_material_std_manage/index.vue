<template>
  <div
    v-loading="loading"
    element-loading-text="加载中..."
  >
    <el-form :inline="true">
      <el-form-item label="状态">
        <el-select
          v-model="RubberState"
          style="width: 150px"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in RubberStateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SITE">
        <el-select
          v-model="RubberSite"
          style="width: 150px"
          clearable
          placeholder="请选择"
          @visible-change="RubberSiteChange"
          @change="changeSearch"
        >
          <el-option
            v-for="item in PopupRubberSITEOptions"
            :key="item.id"
            :label="item.global_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="段次">
        <el-select
          v-model="RubberStage"
          style="width: 150px"
          clearable
          placeholder="请选择"
          @visible-change="RubberStageChange"
          @change="changeSearch"
        >
          <el-option
            v-for="item in RubberStageOptions"
            :key="item.id"
            :label="item.global_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="胶料编码">
        <el-input
          v-model="stage_product_batch_no"
          style="width: 200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-if="permissionObj.productbatching && permissionObj.productbatching.indexOf('add')>-1"
          @click="showAddRubberMaterialDialog"
        >新建</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-if="permissionObj.productbatching && permissionObj.productbatching.indexOf('change')>-1"
          :disabled="currentRow.used_type != 1"
          @click="showPutRubberMaterialDialog"
        >配料</el-button>
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
        align="center"
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        align="center"
        width="160%"
        prop="stage_product_batch_no"
        label="胶料配方编码"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="showGridTable(scope.row.id)">{{ scope.row.stage_product_batch_no }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="product_name"
        label="胶料名称"
      />
      <el-table-column
        align="center"
        prop="site_name"
        label="site"
      />
      <el-table-column
        align="center"
        prop="stage_name"
        label="段次"
      />
      <el-table-column
        align="center"
        width="110%"
        prop="dev_type_name"
        label="炼胶机类型"
      />
      <el-table-column
        align="center"
        prop="batching_weight"
        label="配料重量"
      />
      <el-table-column
        align="center"
        prop="production_time_interval"
        label="炼胶时间"
      />
      <el-table-column
        align="center"
        prop="used_type"
        label="状态"
        :formatter="usedTypeFormatter"
      />
      <el-table-column
        align="center"
        width="148"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.used_type === 5 && permissionObj.productbatching.indexOf('abandon')>-1"
              size="mini"
              @click="status_true(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.used_type === 1 && permissionObj.productbatching.indexOf('submit')>-1"
              size="mini"
              @click="status_true(scope.row)"
            >提交</el-button>
            <el-button
              v-if="scope.row.used_type === 2 && permissionObj.productbatching.indexOf('check')>-1"
              size="mini"
              @click="status_true(scope.row)"
            >校对</el-button>
            <el-button
              v-if="scope.row.used_type === 3 && permissionObj.productbatching.indexOf('use')>-1"
              size="mini"
              @click="status_true(scope.row)"
            >启用</el-button>
            <el-button
              v-if="(scope.row.used_type === 2 && permissionObj.productbatching.indexOf('check')>-1) | (scope.row.used_type === 3 && permissionObj.productbatching.indexOf('use')>-1)"
              size="mini"
              @click="status_false(scope.row)"
            >驳回</el-button>
            <el-button
              v-if="(scope.row.used_type === 5 && permissionObj.productbatching.indexOf('abandon')>-1) | (scope.row.used_type === 4 && permissionObj.productbatching.indexOf('abandon')>-1)"
              size="mini"
              @click="status_false(scope.row)"
            >废弃</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="110%"
        label="发送到上辅机"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.used_type === 4 && permissionObj.productbatching.indexOf('send')>-1"
              size="mini"
              @click="send_auxiliary(scope.row)"
            >发送</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="120%"
        prop="created_username"
        label="创建者"
      />
      <el-table-column
        align="center"
        width="120%"
        prop="submit_username"
        label="提交者"
      />
      <el-table-column
        align="center"
        width="120%"
        prop="check_username"
        label="校对者"
      />
      <el-table-column
        align="center"
        width="120%"
        prop="used_username"
        label="启用者"
      />
      <el-table-column
        align="center"
        width="120%"
        prop="reject_username"
        label="驳回者"
      />
      <el-table-column
        align="center"
        width="120%"
        prop="obsolete_username"
        label="废弃者"
      />
      <el-table-column
        align="center"
        width="160%"
        prop="created_date"
        label="创建时间"
      />

    </el-table>
    <page
      :total="total"
      @currentChange="currentChange"
    />
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="新建胶料配方"
      :visible.sync="dialogAddRubberMaterial"
    >
      <el-form
        ref="rubberMaterialForm"
        :model="rubberMaterialForm"
        :rules="rules"
      >
        <el-form-item>
          <el-radio v-model="normalReceipe" :label="true" @change="receipeTypeChange">常规配方</el-radio>
          <el-radio v-model="normalReceipe" :label="false" @change="receipeTypeChange">特殊配方</el-radio>
        </el-form-item>
        <el-form-item
          label="工厂"
          prop="factory"
        >
          <el-select
            v-model="rubberMaterialForm.factory"
            style="width: 100%"
            size="mini"
            placeholder="请选择"
            :disabled="!normalReceipe"
          >
            <el-option
              v-for="item in RubberSiteOptions"
              :key="item.id"
              :value="item.id"
              :label="item.global_name"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="SITE"
          prop="SITE"
        >
          <el-select
            v-model="rubberMaterialForm.SITE"
            style="width: 100%"
            size="mini"
            placeholder="请选择"
            :disabled="!normalReceipe"
            @change="GenerateRubberMaterialNOChanged"
          >
            <el-option
              v-for="item in PopupRubberSITEOptions"
              :key="item.id"
              :value="item.id"
              :label="item.global_name"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="段次"
          prop="stage"
        >
          <el-select
            v-model="rubberMaterialForm.stage"
            style="width: 100%"
            size="mini"
            placeholder="请选择"
            :disabled="!normalReceipe"
            @change="GenerateRubberMaterialNOChanged"
          >
            <el-option
              v-for="item in RubberStageOptions"
              :key="item.id"
              :value="item.id"
              :label="item.global_name"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="胶料编码"
          prop="rubber_no"
        >
          <el-autocomplete
            v-model="rubberMaterialForm.rubber_no"
            style="width: 100%"
            size="mini"
            value-key="product_no"
            :fetch-suggestions="rubber_no_querySearchAsync"
            placeholder="请输入内容"
            :disabled="!normalReceipe"
            @select="RecipehandleSelect"
            @input="GenerateRubberMaterialNOChanged"
          />
        </el-form-item>

        <el-form-item
          label="版本"
          prop="version"
        >
          <el-input
            v-model="rubberMaterialForm.version"
            style="width: 100%"
            size="mini"
            placeholder="版本"
            :disabled="!normalReceipe"
            @input="GenerateRubberMaterialNOChanged"
          />
        </el-form-item>
        <el-form-item label="方案">
          <el-input
            v-model="rubberMaterialForm.scheme"
            style="width: 100%"
            size="mini"
            placeholder="方案"
            :disabled="!normalReceipe"
          />
        </el-form-item>
        <el-form-item prop="generate_material_no" label="胶料配方编码">
          <el-input
            v-model="rubberMaterialForm.generate_material_no"
            style="width: 100%"
            size="mini"
            :disabled="normalReceipe"
          />
        </el-form-item>
        <el-form-item>
          <!--<el-button @click="dialogAddRubberMaterial = false">取 消</el-button>-->
          <el-button
            type="primary"
            @click="NewAddMaterial('rubberMaterialForm')"
          >配料</el-button>
          <el-button
            type="primary"
            @click="NewhandleAddRubberMaterial('rubberMaterialForm')"
          >生成</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="90%"
      title="胶料配料标准"
      :visible.sync="NewdialogChoiceMaterials"
    >

      <el-form :inline="true">
        <el-form-item style="float: right">
          <el-button @click="NewsaveMaterialClicked">保存</el-button>
        </el-form-item>
      </el-form>

      胶料编码:&nbsp;&nbsp;&nbsp;&nbsp;
      <el-input
        v-model="select_stage_product_batch_no"
        size="mini"
        :disabled="true"
        style="width: 20%"
      />
      胶料名称:
      <el-input
        v-model="select_product_name"
        size="mini"
        :disabled="true"
        style="width: 10%"
      />
      状态:
      <el-input
        v-model="select_status"
        size="mini"
        :disabled="true"
        style="width: 10%"
      />
      <br><br>
      炼胶机类型:
      <el-select
        v-model="select_dev_type"
        size="mini"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in DevTypeOptions"
          :key="item.id"
          :label="item.category_name"
          :value="item.id"
        />
      </el-select>

      配料重量:
      <el-input
        v-model="select_material_weight"
        size="mini"
        :disabled="true"
        style="width: 10%"
      />
      炼胶时间:
      <el-input-number
        v-model.number="select_rm_time_interval"
        :step="1"
        step-strictly
        :min="0"
        size="mini"
        controls-position="right"
      />
      <!-- <el-time-picker
        v-model="select_rm_time_interval"
        size="mini"
        value-format="HH:mm:ss"
        :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
        placeholder="选择时间"
      /> -->

      <br><br>

      <table
        class="table table-bordered"
        border="1"
        bordercolor="#ebeef4"
        style="width: 100%; color: #909399; font-size: 14px; border-collapse:collapse"
      >
        <thead>
          <tr>
            <th style="text-align: center; height: 48px">No</th>
            <th style="text-align: center; height: 48px">类别</th>
            <th style="text-align: center; height: 48px">自动与否</th>
            <th style="text-align: center; height: 48px">原材料</th>
            <td style="text-align: center; height: 48px">实际重量</td>
            <td style="text-align: center; height: 48px">误差</td>
            <td style="text-align: center; height: 48px">操作</td>
          </tr>
        </thead>
        <tbody style="color: #606266;">
          <!--胶料配料标准  第一行 的汇总数据-->
          <tr style="background: rgba(189,198,210,0.73)">
            <td
              colspan="4"
              style="text-align: center; height: 48px"
            >配方结果</td>
            <td style="text-align: center; height: 48px">{{ practicalWeightSum }}</td>
            <td />
            <td />
          </tr>
          <tr
            v-for="(new_material_ele, index) in NewRowMaterial"
            :key="index"
          >
            <!--<td>{{ new_material_ele.sn_ele }}</td>-->
            <td v-show="false">{{ new_material_ele.material }}</td>
            <td style="text-align: center; height: 48px">{{ index + 1 }}
            </td>
            <td style="text-align: center; height: 48px">{{ new_material_ele.material_type }}</td>
            <td style="text-align: center; height: 48px">
              <template>
                <el-radio
                  v-model="new_material_ele.auto_flag_radio"
                  :label="1"
                >自动</el-radio>
                <el-radio
                  v-model="new_material_ele.auto_flag_radio"
                  :label="2"
                >手动</el-radio>
                <el-radio
                  v-model="new_material_ele.auto_flag_radio"
                  :label="0"
                >其他</el-radio>
              </template>
            </td>
            <td style="text-align: center; height: 48px">
              <!-- <div style="margin-top: 12px;"> -->
              <el-input
                v-model="new_material_ele.material_name"
                size="mini"
                style="width: 70%"
                class="input-with-select"
                :disabled="true"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="pop_up_raw_material(new_material_ele, index)"
                />
              </el-input>
              <!-- </div> -->

            </td>
            <td style="text-align: center; height: 48px">
              <el-input-number
                v-model.number="new_material_ele.practical_weight"
                size="mini"
                controls-position="right"
                @change="NewPracticalWeightChanged(new_material_ele)"
              />
            </td>
            <td style="text-align: center; height: 48px">
              <el-input-number
                v-model.number="new_material_ele.standard_error"
                size="mini"
                controls-position="right"
              />
            </td>
            <td style="text-align: center; height: 48px">
              <el-button
                size="mini"
                @click="del_raw_material_row(new_material_ele, index)"
              >删除</el-button>
            </td>
          </tr>

        </tbody>
      </table>
      <el-form>
        <el-form-item style="text-align: center">
          <el-button @click="insert_NewPracticalWeightChanged">插入一行</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="90%"
      title="胶料配料标准"
      :visible.sync="dialogRubberMaterialStandard"
    >

      <el-form :inline="true">
        <el-form-item style="float: right">
          <el-button @click="PutNewsaveMaterialClicked">保存</el-button>
        </el-form-item>
      </el-form>

      胶料编码:&nbsp;&nbsp;&nbsp;&nbsp;
      <el-input
        v-model="put_select_stage_product_batch_no"
        size="mini"
        :disabled="true"
        style="width: 20%"
      />
      胶料名称:
      <el-input
        v-model="put_select_product_name"
        size="mini"
        :disabled="true"
        style="width: 10%"
      />
      状态:
      <el-input
        v-model="put_select_status"
        size="mini"
        :disabled="true"
        style="width: 10%"
      />
      <br><br>
      炼胶机类型:
      <el-select
        v-model="put_select_dev_type"
        size="mini"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in DevTypeOptions"
          :key="item.id"
          :label="item.category_name"
          :value="item.id"
        />
      </el-select>
      配料重量:
      <el-input
        v-model="put_select_material_weight"
        size="mini"
        :disabled="true"
        style="width: 10%"
      />
      炼胶时间:
      <el-input-number
        v-model.number="put_select_rm_time_interval"
        size="mini"
        controls-position="right"
      />

      <br><br>

      <table
        class="table table-bordered"
        border="1"
        bordercolor="#ebeef4"
        style="width: 100%; color: #909399; font-size: 14px; border-collapse:collapse"
      >
        <thead>
          <tr>
            <th style="text-align: center; height: 48px">No</th>
            <th style="text-align: center; height: 48px">类别</th>
            <th style="text-align: center; height: 48px">自动与否</th>
            <th style="text-align: center; height: 48px">原材料</th>
            <td style="text-align: center; height: 48px">实际重量</td>
            <td style="text-align: center; height: 48px">误差</td>
            <td style="text-align: center; height: 48px">操作</td>
          </tr>
        </thead>
        <tbody style="color: #606266;">
          <!--胶料配料标准  第一行 的汇总数据-->
          <tr style="background: rgba(189,198,210,0.73)">
            <td
              colspan="4"
              style="text-align: center; height: 48px"
            >配方结果</td>
            <td style="text-align: center; height: 48px">{{ put_practicalWeightSum }}</td>
            <td />
            <td />
          </tr>
          <tr
            v-for="(new_material_ele, index) in PutProductRecipe"
            :key="index"
          >
            <!--<td>{{ new_material_ele.sn }}</td>-->
            <td v-show="false">{{ new_material_ele.material }}</td>
            <td style="text-align: center; height: 48px">{{ index + 1 }}</td>
            <td style="text-align: center; height: 48px">{{ new_material_ele.material_type }}</td>
            <td style="text-align: center; height: 48px">
              <template>
                <el-radio
                  v-model="new_material_ele.auto_flag"
                  :label="1"
                >自动</el-radio>
                <el-radio
                  v-model="new_material_ele.auto_flag"
                  :label="2"
                >手动</el-radio>
                <el-radio
                  v-model="new_material_ele.auto_flag"
                  :label="0"
                >其他</el-radio>
              </template>
            </td>
            <td style="text-align: center; height: 48px">
              <!-- <div style="margin-top: 12px;"> -->
              <el-input
                v-model="new_material_ele.material_name"
                size="mini"
                style="width: 70%"
                class="input-with-select"
                :disabled="true"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="pop_up_raw_material(new_material_ele, index)"
                />
              </el-input>
              <!-- </div> -->
            </td>
            <td style="text-align: center; height: 48px">
              <el-input-number
                v-model.number="new_material_ele.actual_weight"
                size="mini"
                controls-position="right"
                @change="PutNewPracticalWeightChanged(new_material_ele)"
              />
            </td>
            <td style="text-align: center; height: 48px">
              <el-input-number
                v-model.number="new_material_ele.standard_error"
                size="mini"
                controls-position="right"
              />
            </td>
            <td style="text-align: center; height: 48px">
              <el-button
                size="mini"
                @click="del_mod_raw_material_row(new_material_ele, index)"
              >删除</el-button>
            </td>
          </tr>

        </tbody>
      </table>
      <el-form>
        <el-form-item style="text-align: center; height: 48px">
          <el-button @click="insert_PutNewPracticalWeightChanged">插入一行</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="70%"
      title="原材料选择"
      :visible.sync="dialogRawMaterialSync"
    >

      <el-form :inline="true">
        <el-form-item label="原材料类别">
          <el-select
            v-model="materialType"
            clearable
            placeholder="请选择"
            @change="materialTypeChange"
          >
            <el-option
              v-for="item in materialTypeOptions"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        原材料编号:
        <el-input
          v-model="search_material_no"
          style="width: 20%"
          @input="search_material_no_Change"
        />
        原材料名称:
        <el-input
          v-model="search_material_name"
          style="width: 20%"
          @input="search_material_name_Change"
        />
      </el-form>

      <el-table
        highlight-current-row
        :data="tableRawMaterialData"
        border
        style="width: 100%"
      >
        <el-table-column
          align="center"
          label="S"
          width="30"
        />
        <el-table-column
          align="center"
          prop="material_no"
          label="原材料代码"
        />
        <el-table-column
          align="center"
          prop="material_name"
          label="原材料名称"
        />
        <el-table-column
          align="center"
          prop="material_type_name"
          label="原材料类别"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                @click="handleMaterialSelect(scope.row)"
              >选中
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page.sync="currentPage"
        :page-size="raw_material_pageSize"
        :total="raw_material_tableDataTotal"
        layout="total, prev, pager, next"
        @current-change="raw_material_handleCurrentChange"
      />
    </el-dialog>

    <el-dialog
      width="90%"
      title="胶料配料标准"
      :visible.sync="gridTable"
    >
      胶料编码:&nbsp;&nbsp;&nbsp;&nbsp;
      <el-input
        v-model="put_select_stage_product_batch_no"
        size="mini"
        :disabled="true"
        style="width: 20%"
      />
      胶料名称:
      <el-input
        v-model="put_select_product_name"
        size="mini"
        :disabled="true"
        style="width: 10%"
      />
      状态:
      <el-input
        v-model="put_select_status"
        size="mini"
        :disabled="true"
        style="width: 10%"
      />
      <br><br>
      炼胶机类型:
      <el-select
        v-model="put_select_dev_type"
        size="mini"
        :disabled="true"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in DevTypeOptions"
          :key="item.id"
          :label="item.category_name"
          :value="item.id"
        />
      </el-select>
      配料重量:
      <el-input
        v-model="put_select_material_weight"
        size="mini"
        :disabled="true"
        style="width: 10%"
      />
      炼胶时间:
      <el-input-number
        v-model.number="put_select_rm_time_interval"
        size="mini"
        :disabled="true"
        controls-position="right"
      />

      <br><br>

      <table
        class="table table-bordered"
        border="1"
        bordercolor="#ebeef4"
        style="width: 100%; color: #909399; font-size: 14px; border-collapse:collapse"
      >
        <thead>
          <tr>
            <th style="text-align: center; height: 48px">No</th>
            <th style="text-align: center; height: 48px">类别</th>
            <th style="text-align: center; height: 48px">自动与否</th>
            <th style="text-align: center; height: 48px">原材料</th>
            <td style="text-align: center; height: 48px">实际重量</td>
            <td style="text-align: center; height: 48px">误差</td>
          </tr>
        </thead>
        <tbody style="color: #606266;">
          <!--胶料配料标准  第一行 的汇总数据-->
          <tr style="background: rgba(189,198,210,0.73)">
            <td
              colspan="4"
              style="text-align: center; height: 48px"
            >配方结果</td>
            <td style="text-align: center; height: 48px">{{ put_practicalWeightSum }}</td>
            <td />
            <td />
          </tr>
          <tr
            v-for="(new_material_ele, index) in PutProductRecipe"
            :key="index"
          >
            <!--<td>{{ new_material_ele.sn }}</td>-->
            <td v-show="false">{{ new_material_ele.material }}</td>
            <td style="text-align: center; height: 48px">{{ index + 1 }}</td>
            <td style="text-align: center; height: 48px">{{ new_material_ele.material_type }}</td>
            <td style="text-align: center; height: 48px">
              <template>
                <el-radio
                  v-model="new_material_ele.auto_flag"
                  :label="1"
                  :disabled="true"
                >自动</el-radio>
                <el-radio
                  v-model="new_material_ele.auto_flag"
                  :label="2"
                  :disabled="true"
                >手动</el-radio>
                <el-radio
                  v-model="new_material_ele.auto_flag"
                  :label="0"
                  :disabled="true"
                >其他</el-radio>
              </template>
            </td>
            <td style="text-align: center; height: 48px">
              <!-- <div style="margin-top: 12px;"> -->
              <el-input
                v-model="new_material_ele.material_name"
                size="mini"
                style="width: 70%"
                class="input-with-select"
                :disabled="true"
              />
              <!-- </div> -->
            </td>
            <td style="text-align: center; height: 48px">
              <el-input-number
                v-model.number="new_material_ele.actual_weight"
                size="mini"
                :disabled="true"
                controls-position="right"
              />
            </td>
            <td style="text-align: center; height: 48px">
              <el-input-number
                v-model.number="new_material_ele.standard_error"
                size="mini"
                :disabled="true"
                controls-position="right"
              />
            </td>
          </tr>

        </tbody>
      </table>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { rubber_material_url, send_auxiliary_url, SITE_global_url, stage_global_url, site_url, product_info_url, validate_versions_url, equip_category_url, materials_url, materials_type_url } from '@/api/rubber_recipe_fun'
import { mapGetters } from 'vuex'

export default {
  components: { page },
  data: function() {
    return {
      loading: null,
      tableData: [],
      gridTable: false,
      gridData: [],
      total: 0,
      getParams: {
        page: 1
      },
      getMaterialParams: {},
      currentPage: 1,
      raw_material_pageSize: 10,
      raw_material_tableDataTotal: 0,
      currentRow: {
        used_type: -1
      },
      raw_material_currentRow: {},

      tableRawMaterialData: [],
      RubberState: '',
      RubberStateOptions: [{
        value: 1, label: '编辑'
      }, {
        value: 2, label: '提交'
      }, {
        value: 3, label: '校对'
      }, {
        value: 4, label: '启用'
      }, {
        value: 5, label: '驳回'
      }, {
        value: 6, label: '废弃'
      }],
      RubberSite: '',
      RubberSiteOptions: [],
      RubberStage: '',
      RubberStageOptions: [],
      factory: '',
      PopupRubberSITEOptions: [],
      stage_product_batch_no: '',
      ProductBatchNoOptions: [],
      materialTypeOptions: [],
      stage: '',
      StageOptions: [],
      dev_type_name: '',
      DevTypeOptions: [],
      RawMaterialOptions: [],
      NewRowMaterial: [{
        material_type: null,
        material_name: null,
        auto_flag_radio: 0,
        practical_weight: null,
        standard_error: null
      }
      ],
      PutProductRecipe: [{
        sn: null,
        material_type: null,
        material_name: null,
        actual_weight: null,
        standard_error: null
      }
      ],

      PopupRubberSITE: [],
      DevType: [],
      ProductBatchNo: [],
      Stage: [],
      generate_material_no: '',
      // 反炼与否和时间
      select_rm_flag: false,
      select_rm_time_interval: '',

      select_stage_product_batch_no: null,
      select_product_name: null,
      select_status: null,
      select_dev_type: null,
      select_material_weight: null,
      select_material_volume: null,
      select_rubber_proportion: null,
      auto_flag_radio: 0,
      auto_flag: 0,

      ratioSum: null,
      ratioVolumeSum: null,
      calculateVolumeSum: null,
      calculateWeightSum: null,
      practicalWeightSum: null,
      practicalVolumeSum: null,

      pre_ratioVolume: null,
      pre_calculateVolume: null,
      pre_calculateWeight: null,
      pre_practical_weight: null,
      pre_practicalVolumeSum: null,
      // 配料更新时: 变量
      put_select_stage_product_batch_no: null,
      put_select_product_name: null,
      put_select_status: null,
      put_select_dev_type: null,
      put_select_material_weight: null,
      put_select_material_volume: null,
      put_select_rubber_proportion: null,
      put_select_rm_flag: null,
      put_select_rm_time_interval: null,
      put_discharge_time_material: null,

      put_ratioSum: null,
      put_ratioVolumeSum: null,
      put_calculateVolumeSum: null,
      put_calculateWeightSum: null,
      put_practicalWeightSum: null,
      put_practicalVolumeSum: null,

      selectedPreMaterials: [],
      ProductRecipe: [],
      pre_time_material: '',
      time_material: '',
      // 排出行对应的时间---炼胶时间
      discharge_time_material: '',

      dialogAddRubberMaterial: false,
      dialogRubberMaterialStandard: false,
      dialogChoiceMaterials: false,
      NewdialogChoiceMaterials: false,
      dialogRawMaterialSync: false,
      sn: null,
      material: null,
      material_type: null,
      material_name: null,
      material_type_name: null,

      rubberMaterialForm: {
        factory: '',
        SITE: '',
        stage_product_batch_no: '',
        rubber_no: '',
        version: '',
        stage: '',
        scheme: '',
        dev_type_name: '',
        generate_material_no: ''
      },
      rules: {
        factory: [{ required: true, message: '请选择产地', trigger: 'change' }],
        SITE: [{ required: true, message: '请选择SITE', trigger: 'change' }],
        rubber_no: [{ required: true, message: '请选择胶料编码', trigger: 'change' }],
        stage: [{ required: true, message: '请选择段次', trigger: 'change' }],
        version: [{ required: true, message: '请选择版本', trigger: 'blur' }],
        generate_material_no: [{ required: true, message: '该字段不能为空', trigger: 'blur' }]
      },
      rubberMaterialFormError: {
        factory: '',
        SITE: '',
        rubber_no: '',
        stage: '',
        version: ''
      },
      pop_up_raw_material_type: '',
      pop_up_raw_material_no: '',
      pop_up_raw_material_name: '',
      raw_material_index: null,
      put_raw_material_index: null,
      materialType: null,
      search_material_no: null,
      search_material_name: null,
      select_product_id: null,
      normalReceipe: true
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.rubber_material_list()
  },
  methods: {
    receipeTypeChange() {
      if (!this.normalReceipe) {
        this.$refs['rubberMaterialForm'].resetFields()
      }
      this.rubberMaterialForm.generate_material_no = ''
    },
    async rubber_material_list() {
      try {
        this.loading = true
        const rubber_materialData = await rubber_material_url('get', null, { params: this.getParams })
        this.tableData = rubber_materialData.results
        this.total = rubber_materialData.count
        this.loading = false
        this.currentRow.used_type = -1
        return rubber_materialData
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    async rubber_material_ele(id = null) {
      try {
        const rubber_materialData = await rubber_material_url('get', id, { params: {}})
        return rubber_materialData
      } catch (e) { throw new Error(e) }
    },
    async rubber_material_post(obj) {
      try {
        const rubber_materialData = await rubber_material_url('post', null, obj)
        return rubber_materialData
      } catch (e) { throw new Error(e) }
    },
    async rubber_material_put(id, obj) {
      try {
        const rubber_materialData = await rubber_material_url('put', id, obj)
        return rubber_materialData
      } catch (e) { throw new Error(e) }
    },
    async get_raw_material(val = 1) {
      try {
        this.getMaterialParams['page'] = val
        this.getMaterialParams['use_flag'] = true
        this.getMaterialParams['material_type_id'] = this.materialType ? this.materialType : ''
        this.getMaterialParams['material_no'] = this.search_material_no ? this.search_material_no : ''
        this.getMaterialParams['material_name'] = this.search_material_name ? this.search_material_name : ''
        const MaterialData = await materials_url('get', { params: this.getMaterialParams })
        this.RawMaterialOptions = MaterialData.results
        this.tableRawMaterialData = MaterialData.results
        this.raw_material_tableDataTotal = MaterialData.count
      } catch (e) { throw new Error(e) }
    },
    async site_list() {
      try {
        const site_list = await site_url('get', {
          params: {}
        })
        this.RubberSiteOptions = site_list.results
      } catch (e) { throw new Error(e) }
    },
    async SITE_global_list() {
      try {
        const SITE_global_list = await SITE_global_url('get', {
          params: {}
        })
        if (SITE_global_list.results.length !== 0) {
          this.PopupRubberSITEOptions = SITE_global_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    async stage_global_list() {
      try {
        const stage_global_list = await stage_global_url('get', {
          params: {}
        })
        if (stage_global_list.results.length !== 0) {
          this.RubberStageOptions = stage_global_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    async product_info_list() {
      try {
        const product_info_list = await product_info_url('get', {
          params: { all: 1 }
        })
        this.ProductBatchNoOptions = product_info_list.results
      } catch (e) { throw new Error(e) }
    },
    async equip_category_list() {
      try {
        const equip_category_list = await equip_category_url('get', {
          params: { all: 1, equip_type_name: '密炼设备' }
        })
        this.DevTypeOptions = equip_category_list.results
      } catch (e) { throw new Error(e) }
    },
    async materials_type_list() {
      try {
        const materials_type_list = await materials_type_url('get', {
          params: { all: 1 }
        })
        this.materialTypeOptions = materials_type_list.results
      } catch (e) { throw new Error(e) }
    },
    async validate_versions_list(obj) {
      // try {
      await validate_versions_url('get', obj)
      // } catch (e) { throw new Error(e) }
    },
    RubberSiteChange: function(bool) {
      if (bool) {
        this.SITE_global_list()
      }
    },
    RubberStageChange: function(bool) {
      if (bool) {
        this.stage_global_list()
      }
    },
    async status_recipe_fun(id, obj) {
      try {
        await rubber_material_url('patch', id, obj)
        this.$message('状态切换成功')
        this.rubber_material_list()
      } catch (e) { throw new Error(e) }
    },
    async send_auxiliary_post(obj) {
      // try {
      await send_auxiliary_url('post', obj)
      this.$message('发送至上辅机成功')
      this.rubber_material_list()
      // } catch (e) { throw new Error(e) }
    },
    send_auxiliary: async function(row) {
      send_auxiliary_url('post', {
        params: {
          'product_batching_id': row['id'],
          'product_no': row['stage_product_batch_no']
        }
      }).then(response => {
        this.$message('发送至上辅机成功')
        this.rubber_material_list()
      // eslint-disable-next-line handle-callback-err
      }).catch(error => {

      })
    },
    usedTypeFormatter: function(row, column) {
      return this.usedTypeChoice(row.used_type)
    },
    usedTypeChoice: function(usedType) {
      switch (usedType) {
        case 1:
          return '编辑'
        case 2:
          return '提交'
        case 3:
          return '校对'
        case 4:
          return '启用'
        case 5:
          return '驳回'
        case 6:
          return '废弃'
      }
    },
    status_true: async function(check_row) {
      await this.status_recipe_fun(check_row['id'], { data: { pass_flag: true }})
    },
    status_false: async function(check_row) {
      await this.status_recipe_fun(check_row['id'], { data: { pass_flag: false }})
    },
    rubber_no_querySearchAsync(queryString, cb) {
      var search_rubber_no = this.ProductBatchNoOptions

      var results = queryString ? search_rubber_no.filter(this.rubber_no_createFilter(queryString)) : search_rubber_no

      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    rubber_no_createFilter(queryString) {
      return (search_rubber_no_ele) => {
        return (search_rubber_no_ele.product_no.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    RecipehandleSelect(item) {
      this.rubberMaterialForm['select_product_id'] = item['id']
    },
    showAddRubberMaterialDialog: function() {
      if (this.$refs['rubberMaterialForm']) {
        this.$refs['rubberMaterialForm'].resetFields()
      }
      this.site_list()
      this.SITE_global_list()
      this.stage_global_list()
      this.product_info_list()
      this.rubberMatetialError = ''
      // this.rubberMaterialForm = {
      //   factory: '',
      //   SITE: '',
      //   stage_product_batch_no: '',
      //   stage: '',
      //   dev_type_name: '',
      //   generate_material_no: ''
      // }
      this.dialogAddRubberMaterial = true
      this.currentRow = {
        used_type: -1
      } // 新建和更新标志 -1新建 其他更新
    },
    GenerateRubberMaterialNOChanged() {
      var SITE_name = ''
      var stage_name = ''
      var product_name = ''
      var version = ''
      if (this.rubberMaterialForm.SITE) {
        for (var i = 0; i < this.PopupRubberSITEOptions.length; ++i) {
          if (this.PopupRubberSITEOptions[i]['id'] === this.rubberMaterialForm.SITE) {
            SITE_name = this.PopupRubberSITEOptions[i]['global_name']
          }
        }
      }
      if (this.rubberMaterialForm.stage) {
        for (var j = 0; j < this.RubberStageOptions.length; ++j) {
          if (this.RubberStageOptions[j]['id'] === this.rubberMaterialForm.stage) {
            stage_name = this.RubberStageOptions[j]['global_name']
          }
        }
      }
      if (this.rubberMaterialForm.rubber_no) {
        product_name = this.rubberMaterialForm.rubber_no
      }

      if (this.rubberMaterialForm.version) {
        version = this.rubberMaterialForm.version
      }

      this.rubberMaterialForm.generate_material_no = SITE_name + '-' + stage_name + '-' + product_name + '-' + version
    },
    del_raw_material_row: function(new_material_ele, index) {
      // eslint-disable-next-line no-prototype-builtins
      if (new_material_ele.hasOwnProperty('practical_weight')) {
        this.raw_material_index = index
        this.NewRowMaterial.splice(index, 1)
        var material_weight = 0
        for (var i = 0; i < this.NewRowMaterial.length; ++i) {
          material_weight += this.NewRowMaterial[i]['practical_weight']
        }
        this.select_material_weight = material_weight
        this.practicalWeightSum = material_weight
      }
    },
    del_mod_raw_material_row: function(new_material_ele, index) {
      // eslint-disable-next-line no-prototype-builtins
      if (new_material_ele.hasOwnProperty('actual_weight')) {
        this.PutProductRecipe.splice(index, 1)
        var material_weight = 0
        for (var i = 0; i < this.PutProductRecipe.length; ++i) {
          material_weight += this.PutProductRecipe[i]['actual_weight']
        }
        this.put_select_material_weight = material_weight
        this.put_practicalWeightSum = material_weight
      }
    },
    NewPracticalWeightChanged: function() {
      var material_weight = 0
      for (var i = 0; i < this.NewRowMaterial.length; ++i) {
        material_weight += this.NewRowMaterial[i]['practical_weight']
      }
      this.select_material_weight = material_weight
      this.practicalWeightSum = material_weight
    },
    insert_NewPracticalWeightChanged: function() {
      this.NewRowMaterial.push({
        material_type: '',
        material_name: '',
        auto_flag_radio: 0
        // practical_weight:"",
        // standard_error: ''
      })
    },
    PutNewPracticalWeightChanged: function() {
      var material_weight = 0
      for (var i = 0; i < this.PutProductRecipe.length; ++i) {
        material_weight += this.PutProductRecipe[i]['actual_weight']
      }
      this.put_select_material_weight = material_weight
      this.put_practicalWeightSum = material_weight
    },
    insert_PutNewPracticalWeightChanged: function() {
      this.PutProductRecipe.push({
        sn: '',
        material_type: '',
        auto_flag: 0,
        material_name: ''
        // actual_weight:"",
        // standard_error: ''
      })
    },
    NewsaveMaterialClicked: async function() {
      var app = this
      var batching_details_list = []
      if (app.select_dev_type == null) {
        app.$message({
          message: '炼胶机类型不能为空',
          type: 'error'
        })
        return
      }

      for (var i = 0; i < this.NewRowMaterial.length; ++i) {
        if (app.NewRowMaterial[i].material_name && app.NewRowMaterial[i].practical_weight) {
          // post_ele_material = app.NewRowMaterial[i].material_name;
          // 判断表格中每一行中的下拉框中的数据：是用户所选，还是默认展示
          var now_stage_material = {
            sn: i + 1,
            auto_flag: app.NewRowMaterial[i].auto_flag_radio,
            material: app.NewRowMaterial[i].material,
            actual_weight: app.NewRowMaterial[i].practical_weight,
            standard_error: app.NewRowMaterial[i].standard_error
          }
          batching_details_list.push(now_stage_material)
        } else {
          app.$message({
            message: '原材料与实际重量不能为空',
            type: 'error'
          })
          return
        }
      }
      try {
        await this.rubber_material_post(
          {
            data: {
              'factory': app.rubberMaterialForm['factory'],
              'site': this.normalReceipe ? this.rubberMaterialForm['SITE'] : null,
              'product_info': this.normalReceipe ? this.rubberMaterialForm['select_product_id'] : null,
              'precept': app.rubberMaterialForm['scheme'],
              'stage_product_batch_no': this.normalReceipe ? null : this.rubberMaterialForm['generate_material_no'],
              'stage': this.normalReceipe ? this.rubberMaterialForm['stage'] : null,
              'versions': this.normalReceipe ? this.rubberMaterialForm['version'] : null,
              'dev_type': app.select_dev_type,
              'batching_details': batching_details_list,
              'production_time_interval': app.select_rm_time_interval
            }
          }
        )
        app.NewdialogChoiceMaterials = false
        app.$message(app.rubberMaterialForm['generate_material_no'] + '保存成功')
        this.rubber_material_list()
      } catch (e) { e }
    },

    PutNewsaveMaterialClicked: async function() {
      var app = this
      var batching_details_list = []
      if (app.put_select_dev_type == null) {
        app.$message({
          message: '炼胶机类型不能为空',
          type: 'error'
        })
        return
      }
      // 循环整个表格
      for (var i = 0; i < this.PutProductRecipe.length; ++i) {
        // 只有原材料和实际重量两个必选项都填写时，才能往batching_details_list中push
        if (app.PutProductRecipe[i].material_name && app.PutProductRecipe[i].actual_weight) {
          //   console.log('--------------------------------')
          //   console.log(app.PutProductRecipe[i].auto_flag)
          //   console.log('--------------------------------')
          var now_stage_material = {
            sn: i + 1,
            auto_flag: app.PutProductRecipe[i].auto_flag,
            material: app.PutProductRecipe[i].material,
            actual_weight: app.PutProductRecipe[i].actual_weight,
            standard_error: app.PutProductRecipe[i].standard_error
          }
          batching_details_list.push(now_stage_material)
        } else {
          app.$message({
            message: '原材料与实际重量不能为空',
            type: 'error'
          })
          return
        }
      }

      // console.log('=======================================mod_put')
      // console.log(this.currentRow)
      // console.log('=======================================mod_put')
      try {
        await this.rubber_material_put(
          this.currentRow.id,
          {
            data: {
              'dev_type': app.put_select_dev_type,
              'production_time_interval': app.put_select_rm_time_interval,
              'batching_details': batching_details_list
            }
          }
        )
        app.dialogRubberMaterialStandard = false
        app.$message(app.put_select_stage_product_batch_no + '保存成功')
        this.rubber_material_list()
      } catch (e) { e }
    },
    showPutRubberMaterialDialog: async function() {
      var app = this
      app.equip_category_list()
      app.get_raw_material()
      app.materials_type_list()
      app.dialogRubberMaterialStandard = true
      var rubber_material_result = await this.rubber_material_ele(this.currentRow.id)
      //   console.log('================================mod_get')
      //   console.log(rubber_material_result)
      //   console.log('================================mod_get')
      app.put_select_stage_product_batch_no = rubber_material_result['stage_product_batch_no']
      app.put_select_product_name = rubber_material_result['product_name']
      app.put_select_status = app.usedTypeChoice(rubber_material_result['used_type'])
      app.put_select_dev_type = rubber_material_result['dev_type']
      app.put_select_material_weight = rubber_material_result['batching_weight']
      app.put_select_rm_time_interval = rubber_material_result['production_time_interval']
      app.put_practicalWeightSum = rubber_material_result['batching_weight']
      app.PutProductRecipe = rubber_material_result.batching_details
      app.raw_material_index = null
    },
    showGridTable: async function(id) {
      var app = this
      app.equip_category_list()
      app.get_raw_material()
      app.materials_type_list()
      this.gridTable = true
      var rubber_material_result = await this.rubber_material_ele(id)
      //   console.log('================================mod_get')
      //   console.log(rubber_material_result)
      //   console.log('================================mod_get')
      app.put_select_stage_product_batch_no = rubber_material_result['stage_product_batch_no']
      app.put_select_product_name = rubber_material_result['product_name']
      app.put_select_status = app.usedTypeChoice(rubber_material_result['used_type'])
      app.put_select_dev_type = rubber_material_result['dev_type']
      app.put_select_material_weight = rubber_material_result['batching_weight']
      app.put_select_rm_time_interval = rubber_material_result['production_time_interval']
      app.put_practicalWeightSum = rubber_material_result['batching_weight']
      app.PutProductRecipe = rubber_material_result.batching_details
      app.raw_material_index = null
    },
    pop_up_raw_material: function(new_material_ele, index) {
      // eslint-disable-next-line no-prototype-builtins
      if (new_material_ele.hasOwnProperty('practical_weight')) {
        this.raw_material_index = index
      } else {
        this.put_raw_material_index = index
      }

      this.dialogRawMaterialSync = true
    },
    handleMaterialSelect(row) {
      var app = this

      // console.log('================================================111')
      // console.log(row.id)
      // console.log(app.raw_material_index)
      // console.log(app.NewRowMaterial, 'NewRowMaterial')
      // console.log(app.PutProductRecipe, 'PutProductRecipe')
      // console.log('================================================111')
      if (app.raw_material_index != null) {
        // 胶料配料post
        for (var i = 0; i < app.NewRowMaterial.length; ++i) {
          if (app.NewRowMaterial[i]['material'] === row.id) {
            app.$message({
              message: '不能选择相同的原料',
              type: 'error'
            })
            return
          }
        }
        app.NewRowMaterial[app.raw_material_index].material_name = row.material_name
        app.NewRowMaterial[app.raw_material_index].material = row.id
        app.NewRowMaterial[app.raw_material_index].material_type = row.material_type_name
      } else {
        // 胶料配料put
        for (var j = 0; j < app.PutProductRecipe.length; ++j) {
          if (app.PutProductRecipe[j]['material'] === row.id) {
            app.$message({
              message: '不能选择相同的原料',
              type: 'error'
            })
            return
          }
        }
        app.PutProductRecipe[app.put_raw_material_index].material_name = row.material_name
        app.PutProductRecipe[app.put_raw_material_index].material = row.id
        app.PutProductRecipe[app.put_raw_material_index].material_type = row.material_type_name
      }
      app.dialogRawMaterialSync = false
    },
    async addRubberMaterial() {
      if (this.normalReceipe && this.rubberMaterialForm['select_product_id'] == null) {
        this.$message({
          message: '所选胶料编码不存在',
          type: 'error'
        })
        return
      }
      try {
        // 点击生成之前进行版本验证
        await this.validate_versions_list({
          params: {
            factory: this.normalReceipe ? this.rubberMaterialForm['factory'] : null,
            site: this.normalReceipe ? this.rubberMaterialForm['SITE'] : null,
            product_info: this.normalReceipe ? this.rubberMaterialForm['select_product_id'] : null,
            versions: this.normalReceipe ? this.rubberMaterialForm['version'] : null,
            stage: this.normalReceipe ? this.rubberMaterialForm['stage'] : null,
            stage_product_batch_no: this.normalReceipe ? null : this.rubberMaterialForm['generate_material_no']
          }
        })
        await this.rubber_material_post(
          {
            data: {
              'factory': this.rubberMaterialForm['factory'],
              'site': this.normalReceipe ? this.rubberMaterialForm['SITE'] : null,
              'product_info': this.normalReceipe ? this.rubberMaterialForm['select_product_id'] : null,
              'precept': this.rubberMaterialForm['scheme'],
              'stage_product_batch_no': this.normalReceipe ? null : this.rubberMaterialForm['generate_material_no'],
              'stage': this.normalReceipe ? this.rubberMaterialForm['stage'] : null,
              'versions': this.normalReceipe ? this.rubberMaterialForm['version'] : null
            }
          }
        )
        this.dialogAddRubberMaterial = false
        this.$message(this.rubberMaterialForm['generate_material_no'] + '保存成功')
        this.rubber_material_list()
      } catch (e) {
        // this.$message.error(e.join(','))
      }
    },
    NewhandleAddRubberMaterial(formName) {
      if (!this.normalReceipe) {
        this.$refs[formName].validateField('generate_material_no', error => {
          if (!error) {
            this.addRubberMaterial()
          }
        })
        return
      }
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.addRubberMaterial()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async showChoiceMaterialsDialog() {
      if (this.normalReceipe && this.rubberMaterialForm['select_product_id'] == null) {
        this.$message({
          message: '所选胶料编码不存在',
          type: 'error'
        })
        return
      }
      try {
        // 点击生成之前进行版本验证
        try {
          await this.validate_versions_list({
            params: {
              factory: this.normalReceipe ? this.rubberMaterialForm['factory'] : null,
              site: this.normalReceipe ? this.rubberMaterialForm['SITE'] : null,
              product_info: this.normalReceipe ? this.rubberMaterialForm['select_product_id'] : null,
              versions: this.normalReceipe ? this.rubberMaterialForm['version'] : null,
              stage: this.normalReceipe ? this.rubberMaterialForm['stage'] : null,
              stage_product_batch_no: this.normalReceipe ? null : this.rubberMaterialForm['generate_material_no']
            }
          })
        } catch (e) {
          // this.$message.error(e.join(','))
          return
        }
        this.dialogAddRubberMaterial = false
        // 炼胶机类型接口、原材料接口、原材料类型接口、胶料编码等数据加载
        this.equip_category_list()
        this.get_raw_material()
        this.materials_type_list()
        this.NewdialogChoiceMaterials = true
        this.select_stage_product_batch_no = this.rubberMaterialForm['generate_material_no']
        this.select_product_name = this.rubberMaterialForm['rubber_no']
        this.select_material_weight = null
        this.practicalWeightSum = null
        this.NewRowMaterial = []
      } catch (e) { e }
    },
    NewAddMaterial(formName) {
      if (!this.normalReceipe) {
        this.$refs[formName].validateField('generate_material_no', error => {
          if (!error) {
            this.showChoiceMaterialsDialog()
          }
        })
        return
      }
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.showChoiceMaterialsDialog()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCurrentChange: function(val) {
      this.currentRow = val
    },
    raw_material_handleCurrentChange: function(val) {
      this.raw_material_currentRow = val
      this.get_raw_material(val)
    },

    materialTypeChange: function() {
      this.get_raw_material()
    },
    search_material_no_Change: function() {
      this.get_raw_material()
    },
    search_material_name_Change: function() {
      this.get_raw_material()
    },

    changeSearch() {
      this.getParams['used_type'] = this.RubberState
      this.getParams['site'] = this.RubberSite
      this.getParams['stage_id'] = this.RubberStage
      this.getParams['stage_product_batch_no'] = this.stage_product_batch_no
      this.getParams.page = 1
      this.rubber_material_list()
    },
    currentChange(page) {
      this.currentRow = { used_type: -1 }
      this.getParams.page = page
      this.rubber_material_list()
    }

  }
}

</script>

<style lang="scss" scoped>
</style>

