<template>
  <div class="unqualified-card-container">
    <div ref="PDFBtn" style="text-align:right;margin-bottom:10px">
      <el-button
        v-if="orderNum&&!editType"
        v-permission="['unqualified_order','export']"
        @click="exportPDF"
      >另存为PDF</el-button>
      <!-- <el-button
        v-if="orderNum&&!editType"
        @click="exportExcel"
      >下载表格</el-button> -->
      <el-button v-else :loading="loadingBtn" @click="submitFun">保存</el-button>
    </div>
    <div id="out-table">
      <table
        border="1"
        bordercolor="black"
        class="info-table out-table"
      >
        <!-- <thead> -->
        <!-- </thead> -->
        <tr>
          <th :colspan="5+headDataLength">
            <div style="position:relative">
              <div class="logo-style">
                <img style="width:100%;height:100%" src="@/assets/logo.png" alt="">
              </div>
              <div style="flex:1;text-align:center;font-size: 1.5em;line-height:45px">中策(安吉)不合格品处置单</div>
            </div>
          </th>
        </tr>
        <tr v-if="orderNum">
          <td :colspan="5+headDataLength" style="text-align:right;padding-right:15px">
            <div>质检编码：{{ formObj.unqualified_deal_order_uid }}</div>
          </td>
        </tr>
        <tr>
          <td :colspan="2" style="text-align:left;padding-left:25px;">发生部门：
          </td>
          <td :colspan="2">
            <span v-if="orderNum">{{ formObj.deal_department }}</span>
            <div v-else class="deal_department">
              <el-radio v-model="formObj.deal_department" label="准备分厂">准备分厂</el-radio>
              <el-radio v-model="formObj.deal_department" label="加硫车间">加硫车间</el-radio>
              <el-radio v-model="formObj.deal_department" label="混炼车间">混炼车间</el-radio>
              <el-radio v-model="formObj.deal_department" label="硫磺车间">硫磺车间</el-radio>
              <el-radio v-model="formObj.deal_department" label="细料车间">细料车间</el-radio>
            </div></td>
          <td>胶料筹备组 炼胶</td>
          <td :colspan="headDataLength" style="width:125px">日期：{{ orderNum&&formObj.created_date?(formObj.created_date).split(' ')[0]: formObj.currentDate }}</td>
        </tr>
        <tr style="text-align:left;">
          <td :colspan="5+headDataLength" style="padding-left:25px">不合格品状态：
            <span v-if="orderNum">
              <span
                v-for="(item,i) in stateList"
                :key="i"
              >
                <span v-if="item === formObj.status">☑</span>
                <span v-else>☐</span>
                {{ item }}
              </span>
            </span>
            <span v-else>
              <el-radio
                v-for="(item,i) in stateList"
                :key="i"
                v-model="formObj.status"
                :label="item"
              >
                {{ item }}
              </el-radio>
            </span>
          </td>
        </tr>
        <tr style="text-align:left;">
          <td :colspan="5+headDataLength" style="padding-left:25px">
            <span style="display:inline-block;width:170px">不合格品信息(发生部门)：</span>
            <span v-if="orderNum" v-html="formObj.department" />
            <el-input
              v-else
              v-model="formObj.department"
              style="width:70%"
              placeholder="请输入内容"
            />
          </td>
        </tr>
        <tr style="text-align:left;">
          <td :colspan="5+headDataLength" style="padding-left:25px">
            <span style="display:inline-block;width:170px">不合格品处理方式：</span>
            <span v-if="orderNum" v-html="formObj.deal_method" />
            <el-select
              v-else
              v-model="formObj.deal_method"
              filterable
              allow-create
              default-first-option
              clearable
              placeholder="请选择"
              @visible-change="visibleChange"
            >
              <el-option
                v-for="(item,i) in optionsDisposal"
                :key="i"
                :label="item"
                :value="item"
              />
            </el-select>
            <!-- <el-input
              v-else
              v-model="formObj.department"
              style="width:70%"
              placeholder="请输入内容"
            /> -->
          </td>
        </tr>
        <!-- </table>
      <table
        border="1"
        bordercolor="black"
        class="info-table"
        style="border-top-color: #fff;"
      > -->
        <tbody>
          <tr>
            <th rowspan="2">序号</th>
            <th rowspan="2">生产日期/班次</th>
            <th rowspan="2">生产机台</th>
            <th rowspan="2">胶料编码</th>
            <th rowspan="2">车次</th>
            <th :colspan="headDataLength">不合格项</th>
          </tr>

          <tr>
            <th v-for="(subHead, index) in headData" :key="index">{{ subHead }}</th>
          </tr>
          <tr v-for="(itemVal,i) in listData" :key="i">
            <td>{{ Number(i) + 1 }}</td>
            <td>{{ itemVal.date }}/{{ itemVal.classes }}</td>
            <td>{{ itemVal.equip_no }}</td>
            <td>{{ itemVal.product_no }}</td>
            <td>{{ setTrains(itemVal.actual_trains) }}</td>
            <td
              v-for="(headDataItem,headDataI) in headData"
              :key="headDataI"
            >
              <div v-if="itemVal.indicator_data[headDataItem]">
                <span
                  v-if="getArrMin(itemVal.indicator_data[headDataItem]) ===
                    getArrMax(itemVal.indicator_data[headDataItem])"
                >
                  {{ getArrMin(itemVal.indicator_data[headDataItem]) }}
                </span>
                <span v-else>
                  {{ getArrMin(itemVal.indicator_data[headDataItem]) }}-
                  {{ getArrMax(itemVal.indicator_data[headDataItem]) }}
                </span>
              </div>
            </td>
          </tr>
          <tr style="text-align:right">
            <td :colspan="5+headDataLength">
              经办人：
              {{ orderNum?formObj.created_username:name }}
              <span style="margin:0 100px">日期：{{ orderNum&&formObj.created_date?(formObj.created_date).split(' ')[0]: formObj.currentDate }}</span>
            </td>
          </tr>
          <tr style="text-align:left;">
            <td :colspan="5+headDataLength" style="padding-left:25px">
              <div>不合格品情况(包括产品生产过程、原因及程度)：</div>
              <!-- <el-input
                v-if="!orderNum||editType === 1"
                v-model="formObj.reason"
                type="textarea"
                :rows="5"
                resize="none"
                style="margin-top:10px;width:97%"
                placeholder="请输入内容"
                @change="editOne($event,'deal_user','deal_date')"
              />
              <div v-else class="deal_suggestion" v-html="formObj.reason" /> -->
            </td>
          </tr>
          <tr style="text-align:left;">
            <td :colspan="5+headDataLength" style="padding-left:25px">
              <el-input
                v-if="!orderNum||editType === 1"
                v-model="formObj.reason"
                type="textarea"
                :rows="5"
                resize="none"
                style="margin-top:10px;width:97%"
                placeholder="请输入内容"
                @change="editOne($event,'deal_user','deal_date')"
              />
              <div v-else class="deal_suggestion" v-html="formObj.reason" />
            </td>
          </tr>
          <tr style="text-align:right">
            <td :colspan="5+headDataLength">
              经办人：{{ formObj.deal_user }}
              <span style="margin:0 100px">日期：{{ formObj.deal_date }}</span>
            </td>
          </tr>
          <tr style="text-align:left;">
            <td :colspan="5+headDataLength" style="padding-left:25px">
              <div>处理意见(品质技术部工艺技术科)：</div>
              <!-- <el-input
                v-if="!orderNum||editType === 2"
                v-model="formObj.t_deal_suggestion"
                type="textarea"
                :rows="5"
                resize="none"
                style="margin-top:10px;width:97%"
                placeholder="请输入内容"
                @change="editOne($event,'t_deal_user','t_deal_date')"
              />
              <div v-else class="deal_suggestion" v-html="formObj.t_deal_suggestion" /> -->
            </td>
          </tr>
          <tr style="text-align:left;">
            <td :colspan="5+headDataLength" style="padding-left:25px">
              <el-input
                v-if="!orderNum||editType === 2"
                v-model="formObj.t_deal_suggestion"
                type="textarea"
                :rows="5"
                resize="none"
                style="margin-top:10px;width:97%"
                placeholder="请输入内容"
                @change="editOne($event,'t_deal_user','t_deal_date')"
              />
              <div v-else class="deal_suggestion" v-html="formObj.t_deal_suggestion" />
            </td>
          </tr>
          <tr style="text-align:right">
            <td :colspan="5+headDataLength">
              经办人：{{ formObj.t_deal_user }}
              <span style="margin:0 100px">日期：{{ formObj.t_deal_date }}</span>
            </td>
          </tr>
          <tr style="text-align:left;">
            <td :colspan="5+headDataLength" style="padding-left:25px">
              <div>处理意见(品质技术部工艺检查科)：</div>
              <!-- <el-input
                v-if="!orderNum||editType === 3"
                v-model="formObj.c_deal_suggestion"
                type="textarea"
                :rows="5"
                resize="none"
                style="margin-top:10px;width:97%"
                placeholder="请输入内容"
                @change="editOne($event,'c_deal_user','c_deal_date')"
              />
              <div v-else class="deal_suggestion" v-html="formObj.c_deal_suggestion" /> -->
            </td>
          </tr>
          <tr style="text-align:left;">
            <td :colspan="5+headDataLength" style="padding-left:25px">
              <el-input
                v-if="!orderNum||editType === 3"
                v-model="formObj.c_deal_suggestion"
                type="textarea"
                :rows="5"
                resize="none"
                style="margin-top:10px;width:97%"
                placeholder="请输入内容"
                @change="editOne($event,'c_deal_user','c_deal_date')"
              />
              <div v-else class="deal_suggestion" v-html="formObj.c_deal_suggestion" />
            </td>
          </tr>
          <tr style="text-align:right">
            <td :colspan="5+headDataLength">
              经办人：{{ formObj.c_deal_user }}
              <span style="margin:0 100px">日期：{{ formObj.c_deal_date }}</span>
            </td>
          </tr>
          <tr style="text-align:left;">
            <td :colspan="5+headDataLength" style="padding-left:25px">
              <div>备注：</div>
              <el-input
                v-if="!orderNum"
                v-model="formObj.desc"
                type="textarea"
                :rows="5"
                resize="none"
                style="margin-top:10px;width:97%"
                placeholder="请输入内容"
              />
              <div v-else class="deal_suggestion" v-html="formObj.desc" />
              <div style="margin-top:10px" />
            </td>
          </tr>
        <!-- <tr style="text-align:left;">
          <td :colspan="5+headData.length" style="padding-left:25px">
            <div style="text-align:left;margin-top:4px">
              品质技术部分责人：{{ formObj.a }}
              <span style="margin:0 80px">处置部门负责人：{{ formObj.a }}</span>
              <span>处置人员：{{ formObj.a }}</span>
            </div>
          </td>
        </tr> -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { unqualifiedDealOrders, dealMathodHistory } from '@/api/base_w'
import { setDate, exportExcel } from '@/utils'
import { mapGetters } from 'vuex'
import funMixin from './mixin'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
export default {
  mixins: [funMixin],
  props: {
    orderRow: {
      type: Object,
      default() {
        return {}
      }
    },
    listDataProps: {
      type: Array,
      default() {
        return []
      }
    },
    formHeadData: {
      type: Array,
      default() {
        return []
      }
    },
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 编辑类型  1原因编辑 2技术处理 3检查处理
    editType: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      formObj: {
        status: '来料',
        currentDate: setDate()
      },
      stateList: ['来料', '半成品', '成品', '库存'],
      headData: this.formHeadData,
      orderNum: null,
      loadingBtn: false,
      listData: this.listDataProps,
      aaa: '',
      optionsDisposal: []
    }
  },
  computed: {
    ...mapGetters(['name']),
    headDataLength() {
      return this.headData.length || 1
    }
  },
  watch: {
    show(val) {
      if (val) {
        // 打开
        this.orderNum = this.orderRow.id || null
        this.listData = this.listDataProps || []
        this.headData = this.formHeadData || []
        if (this.orderNum) {
          this.getInfo()
        }
      }
    }
  },
  created() {
    this.orderNum = this.orderRow.id || null
    if (this.orderNum) {
      this.getInfo()
    }
  },
  methods: {
    async getInfo() {
      try {
        const data = await unqualifiedDealOrders('get', this.orderNum)
        this.formObj = data
        this.formObj.reason = this.editType === 1 ? this.changeInputBack(this.formObj.reason) : this.formObj.reason
        this.formObj.t_deal_suggestion = this.editType === 2 ? this.changeInputBack(this.formObj.t_deal_suggestion) : this.formObj.t_deal_suggestion
        this.formObj.c_deal_suggestion = this.editType === 3 ? this.changeInputBack(this.formObj.c_deal_suggestion) : this.formObj.c_deal_suggestion

        this.headData = data.form_head_data
        this.listData = data.deal_details
      } catch (e) {
        //
      }
    },
    async submitFun() {
      try {
        let newtFormObj = {}
        let _api = ''
        let _id = null
        if (!this.orderNum) {
          newtFormObj = JSON.parse(JSON.stringify(this.formObj))
          let arr = []
          this.listData.forEach(D => {
            arr = arr.concat(D.order_ids)
          })
          this.$set(newtFormObj, 'order_ids', arr)
          _api = 'post'
          _id = null
          newtFormObj.desc = this.changeInput(newtFormObj.desc)
        } else {
          _id = this.formObj.id
          newtFormObj = {
            t_deal_suggestion: this.formObj.t_deal_suggestion,
            c_deal_suggestion: this.formObj.c_deal_suggestion,
            reason: this.formObj.reason,
            deal_user: this.formObj.deal_user,
            deal_date: this.formObj.deal_date,
            t_deal_user: this.formObj.t_deal_user,
            t_deal_date: this.formObj.t_deal_date,
            c_deal_user: this.formObj.c_deal_user,
            c_deal_date: this.formObj.c_deal_date
          }
          _api = 'put'
        }
        newtFormObj.reason = this.changeInput(newtFormObj.reason)
        newtFormObj.t_deal_suggestion = this.changeInput(newtFormObj.t_deal_suggestion)
        newtFormObj.c_deal_suggestion = this.changeInput(newtFormObj.c_deal_suggestion)
        // console.log(newtFormObj, 'newtFormObj')
        // return
        this.loadingBtn = true
        await unqualifiedDealOrders(_api, _id, { data: newtFormObj })
        this.$message({
          message: this.orderNum ? '创建成功' : '可在不合格处置单管理内查看，创建成功',
          type: 'success',
          duration: 5000
        })
        this.$emit('submitFun', newtFormObj)
        this.formObj = {
          status: '来料',
          currentDate: setDate()
        }
        this.loadingBtn = false
      } catch (e) {
        this.loadingBtn = false
      }
    },
    changeInput(val) {
      if (!val) return null
      return (val).replace(/\r\n/g, '<br>').replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;')
    },
    changeInputBack(val) {
      if (!val) return ''
      return (val).replace(/<br>/g, '\r\n').replace(/<br>/g, '\n').replace(/&nbsp;/g, '\s')
    },
    editOne(val, paramsName, dateDate) {
      this.$set(this.formObj, paramsName, this.name)
      this.$set(this.formObj, dateDate, setDate())
    },
    editTwo() {
      this.formObj.name = this.name
      this.formObj.currentDate = setDate()
    },
    editThree() {
      this.formObj.name = this.name
      this.formObj.currentDate = setDate()
    },
    visibleChange(bool) {
      if (bool) {
        this.getOptionsDisposal()
      }
    },
    async getOptionsDisposal() {
      try {
        const data = await dealMathodHistory()
        this.optionsDisposal = data
      } catch (e) {
        //
      }
    },
    async exportPDF() {
      this.$refs.PDFBtn.style.display = 'none'
      document.getElementsByClassName('el-dialog__headerbtn')[0].style.display = 'none'
      window.print()
      this.$refs.PDFBtn.style.display = 'block'
      document.getElementsByClassName('el-dialog__headerbtn')[0].style.display = 'block'
    },
    exportExcel() {
      exportExcel('不合格品处置单', 'disposal-list-components')
    }
  }
}
</script>

<style lang="scss">
 .unqualified-card-container {
    width: 600px;
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
    table {
      width: 100%;
      border-collapse: collapse
    }
    .logo-style{
      width:100px;
      height:45px;
      position: absolute;
      left: 10px;
    }
    .deal_department{
      .el-radio{
             margin-right: 0px;
      }
    }

   .info-table {
      td,th {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .deal_suggestion{
      margin:15px 0;
    }
  }
</style>
