<template>
  <div v-loading="loading" class="unqualified-card-container">
    <div ref="PDFBtn" style="text-align:right;margin-bottom:10px">
      <el-button
        v-if="!isEdit&&editType!==2"
        v-permission="['unqualified_order','export']"
        @click="exportPDF"
      >另存为PDF</el-button>
      <el-button
        v-if="!isEdit&&editType!==2"
        @click="exportExcel"
      >下载表格</el-button>
    </div>
    <div id="out-table">
      <table
        border="1"
        bordercolor="black"
        style="width:100%;border-collapse: collapse;"
        class="info-table"
      >
        <tr>
          <th :colspan="5+headDataLength">
            <div style="position:relative">
              <div style="width:100px;height:45px;position: absolute;left: 10px;">
                <img style="width:100%;height:100%" src="@/assets/logo.png" alt="">
              </div>
              <div style="flex:1;text-align:center;font-size: 1.5em;line-height:45px">中策(安吉)不合格品处置单</div>
            </div>
          </th>
        </tr>
        <tr>
          <td :colspan="headDataLength" style="text-align:left;padding-left:15px">
            <div>单据编号：{{ formObj.unqualified_deal_order_uid }}</div>
          </td>
          <td :colspan="5" style="text-align:right;padding-right:15px">
            <div>质J05-034</div>
          </td>
        </tr>
        <tr>
          <td :colspan="2" style="text-align:left;padding-left:25px;">发生部门：
          </td>
          <td :colspan="3">
            <span>{{ formObj.department }}</span>
            <!-- <div v-else class="deal_department"> -->
            <!-- <el-radio v-model="formObj.deal_department" label="准备分厂">准备分厂</el-radio> -->
            <!-- <el-radio v-model="formObj.deal_department" label="加硫车间">加硫车间</el-radio>
              <el-radio v-model="formObj.deal_department" label="混炼车间">混炼车间</el-radio>
              <el-radio v-model="formObj.deal_department" label="硫磺车间">硫磺车间</el-radio>
              <el-radio v-model="formObj.deal_department" label="细料车间">细料车间</el-radio> -->
            <!-- </div> -->
          </td>
          <!-- <td>胶料筹备组 炼胶</td> -->
          <td :colspan="headDataLength" style="width:125px">日期：{{ orderNum&&formObj.created_date?(formObj.created_date).split(' ')[0]: formObj.currentDate }}</td>
        </tr>
        <tr style="text-align:left;">
          <td :colspan="5+headDataLength" style="padding-left:25px">不合格品状态：
            <span v-if="isEdit&&editType === 1">
              <el-radio
                v-for="(item,i) in stateList"
                :key="i"
                v-model="formObj.status"
                :label="item"
              >
                {{ item }}
              </el-radio>
            </span>
            <span v-else>
              <span
                v-for="(item,i) in stateList"
                :key="i"
              >
                <span v-if="item === formObj.status">☑</span>
                <span v-else>☐</span>
                {{ item }}
              </span>
            </span>
          </td>
        </tr>
        <tr style="text-align:left;">
          <td :colspan="5+headDataLength" style="padding-left:25px">
            <span style="display:inline-block;width:170px">不合格品信息(发生部门)：</span>
            <el-input
              v-if="isEdit&&editType === 1"
              v-model="formObj.deal_department"
              style="width:70%"
              placeholder="请输入内容"
            />
            <span v-else v-html="formObj.deal_department" />
          </td>
        </tr>
        <!-- <tr style="text-align:left;">
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
          </td>
        </tr> -->
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
            <td>{{ itemVal.factory_date }}/{{ itemVal.classes }}</td>
            <td>{{ itemVal.equip_no }}</td>
            <td>{{ itemVal.product_no }}</td>
            <td>{{ itemVal.train?itemVal.train:itemVal.trains }}</td>
            <td
              v-for="(headDataItem,headDataI) in headData"
              :key="headDataI"
            >
              <div v-if="itemVal.test_data.filter(d=>d.data_point_name === headDataItem).length>0">
                <span
                  v-if="itemVal.test_data.filter(d=>d.data_point_name === headDataItem)[0].max_value ===
                    itemVal.test_data.filter(d=>d.data_point_name === headDataItem)[0].min_value"
                >
                  {{ itemVal.test_data.filter(d=>d.data_point_name === headDataItem)[0].min_value }}
                </span>
                <span v-else>
                  {{ itemVal.test_data.filter(d=>d.data_point_name === headDataItem)[0].min_value }}-
                  {{ itemVal.test_data.filter(d=>d.data_point_name === headDataItem)[0].max_value }}
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
            </td>
          </tr>
          <tr style="text-align:left;">
            <td rowspan="4" :colspan="5+headDataLength" style="padding-left:25px">
              <el-input
                v-if="isEdit&&editType === 1"
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
          <tr />
          <tr />
          <tr />
          <!-- <tr style="text-align:right">
            <td :colspan="5+headDataLength">
              经办人：{{ formObj.deal_user }}
              <span style="margin:0 100px">日期：{{ formObj.deal_date }}</span>
            </td>
          </tr> -->
          <tr v-if="editType !== 1" style="text-align:left;">
            <td :colspan="5+headDataLength" style="padding-left:25px">
              <div>处理意见(品质技术部工艺技术科)：</div>
            </td>
          </tr>
          <tr v-if="editType !== 1" style="text-align:left;">
            <td rowspan="4" :colspan="5+headDataLength" style="padding-left:25px">
              <!-- <el-input
                v-if="isEdit&&editType === 2"
                v-model="formObj.t_deal_suggestion"
                type="textarea"
                :rows="5"
                resize="none"
                style="margin-top:10px;width:97%"
                placeholder="请输入内容"
                @change="editOne($event,'t_deal_user','t_deal_date')"
              /> -->
              <div class="deal_suggestion" v-html="formObj.t_deal_suggestion" />
            </td>
          </tr>
          <tr v-if="![1].includes(editType)" />
          <tr v-if="![1].includes(editType)" />
          <tr v-if="![1].includes(editType)" />
          <tr v-if="editType !== 1" style="text-align:right">
            <td :colspan="5+headDataLength">
              经办人：{{ formObj.t_deal_user }}
              <span style="margin:0 100px">日期：{{ formObj.t_deal_date }}</span>
            </td>
          </tr>
          <tr v-if="![1,2].includes(editType)" style="text-align:left;">
            <td :colspan="5+headDataLength" style="padding-left:25px">
              <div>处理意见(品质技术部工艺检查科)：</div>
            </td>
          </tr>
          <tr v-if="![1,2].includes(editType)" style="text-align:left;">
            <td rowspan="4" :colspan="5+headDataLength" style="padding-left:25px">
              <!-- <el-input
                v-if="isEdit&&editType === 3"
                v-model="formObj.c_deal_suggestion"
                type="textarea"
                :rows="5"
                resize="none"
                style="margin-top:10px;width:97%"
                placeholder="请输入内容"
                @change="editOne($event,'c_deal_user','c_deal_date')"
              /> -->
              <div>
                <div v-if="!formObj.c_deal_suggestion" style="height:80px" />
                <div v-else class="deal_suggestion" v-html="formObj.c_deal_suggestion" />
              </div>
            </td>
          </tr>
          <tr v-if="![1,2].includes(editType)" />
          <tr v-if="![1,2].includes(editType)" />
          <tr v-if="![1,2].includes(editType)" />
          <tr v-if="![1,2].includes(editType)" style="text-align:right">
            <td :colspan="5+headDataLength">
              经办人：{{ formObj.c_deal_user }}
              <span style="margin:0 100px">日期：{{ formObj.c_deal_date }}</span>
            </td>
          </tr>
          <tr v-if="![1,2].includes(editType)" style="text-align:left;">
            <td :colspan="5+headDataLength" style="padding-left:25px">
              <div>备注：</div>
            </td>
          </tr>
          <tr v-if="![1,2].includes(editType)" style="text-align:left;">
            <td rowspan="4" :colspan="5+headDataLength" style="padding-left:25px">
              <el-input
                v-if="isEdit&&editType === 3"
                v-model="formObj.desc"
                type="textarea"
                :rows="5"
                resize="none"
                style="margin-top:10px;width:97%"
                placeholder="请输入内容"
              />
              <div v-else>
                <div v-if="!formObj.desc" style="height:80px" />
                <div v-else class="deal_suggestion" v-html="formObj.desc" />
              </div>
            </td>
          </tr>
          <tr v-if="![1,2].includes(editType)" />
          <tr v-if="![1,2].includes(editType)" />
          <tr v-if="![1,2].includes(editType)" />
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
    <div style="text-align:right;margin-top:10px;">
      <!-- <el-button v-if="isEdit" type="primary" :loading="loadingBtn" @click="exportExcelFrame">导出Excel</el-button> -->
      <el-button v-if="isEdit" type="primary" :loading="loadingBtn" @click="preserveFun">提交</el-button>
      <el-button v-if="isEdit" type="primary" :loading="loadingBtn" @click="cancelFun">返回</el-button>
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
    // 编辑类型  1不合格处置单发起 2不合格处置工艺技术科处理 3处理意见(检查科)
    editType: {
      type: Number,
      default() {
        return null
      }
    },
    isEdit: { // 是不是编辑 编辑true
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      formObj: {
        status: '来料',
        currentDate: setDate()
      },
      stateList: ['半成品', '来料'],
      headData: this.formHeadData,
      orderNum: null,
      loadingBtn: false,
      listData: this.listDataProps,
      aaa: '',
      optionsDisposal: [],
      loading: false
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
        this.formObj = this.orderRow || {}

        this.listData = this.listDataProps || []
        this.headData = this.formHeadData || []
        if (this.orderNum) {
          this.getInfo()
        } else {
          this.setName()
        }
      }
    }
  },
  created() {
    this.orderNum = this.orderRow.id || null
    if (this.orderNum) {
      this.getInfo()
    } else {
      this.formObj = this.orderRow || {}
      this.setName()
    }
  },
  methods: {
    async getInfo() {
      try {
        this.loading = true
        const data = await unqualifiedDealOrders('get', this.orderNum)
        this.formObj = data
        if (this.editType === 2) {
          data.deal_details = this.listDataProps
        }
        this.loading = false
        this.setName()
        if (this.orderRow.t_deal_suggestion && this.isEdit) {
          this.formObj.t_deal_suggestion = this.orderRow.t_deal_suggestion
        }
        if (this.orderRow.c_deal_suggestion && this.isEdit) {
          this.formObj.c_deal_suggestion = this.orderRow.c_deal_suggestion
        }
        if (!this.isEdit) {
          this.formObj.reason = this.editType === 1 ? this.changeInputBack(this.formObj.reason) : this.formObj.reason
          this.formObj.t_deal_suggestion = this.editType === 2 ? this.changeInputBack(this.formObj.t_deal_suggestion) : this.formObj.t_deal_suggestion
          this.formObj.c_deal_suggestion = this.editType === 3 ? this.changeInputBack(this.formObj.c_deal_suggestion) : this.formObj.c_deal_suggestion
        }

        data.deal_details.forEach(d => {
          d.train = ''
          d.trains.forEach((D, i) => {
            d.train += D.train + (d.trains.length > 1 && d.trains.length - 1 > i ? ',' : '')
          })
        })

        this.listData = data.deal_details
      } catch (e) {
        this.listData = []
        this.formObj = {}
        this.loading = false
      }
    },
    setName() {
      if (this.isEdit && this.editType === 1) {
        this.formObj.created_username = this.name
        this.formObj.created_date = setDate()
      }
      if (this.isEdit && this.editType === 2) {
        this.formObj.t_deal_user = this.name
        this.formObj.t_deal_date = setDate()
      } else if (this.isEdit && this.editType === 3) {
        this.formObj.c_deal_user = this.name
        this.formObj.c_deal_date = setDate()
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
      return (val).replace(/\r|\n/g, '<br>').replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;')
    },
    changeInputBack(val) {
      if (!val) return ''
      return (val).replace(/<br>/g, '\r').replace(/<br>/g, '\n').replace(/&nbsp;/g, '\s')
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
      var iframe = ''
      if (!iframe) {
        var el = document.getElementById('out-table')
        iframe = document.createElement('IFRAME')
        var doc = null
        iframe.setAttribute('id', 'print-iframe')
        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
        document.body.appendChild(iframe)
        doc = iframe.contentWindow.document
        doc.write('<style media="print">@page {size: auto;margin: 20px;} table{font-size:14px}' + '</style>') // 解决出现页眉页脚和路径的问题

        doc.write('<div style="width:100%">' + el.innerHTML + '</div>')
        doc.close()
        iframe.contentWindow.focus()
      }
      setTimeout(function() { iframe.contentWindow.print() }, 50) // 解决第一次样式不生效的问题
      if (navigator.userAgent.indexOf('MSIE') > 0) {
        document.body.removeChild(iframe)
      }
      // this.$refs.PDFBtn.style.display = 'none'
      // document.getElementsByClassName('el-dialog__headerbtn')[0].style.display = 'none'
      // window.print()
      // this.$refs.PDFBtn.style.display = 'block'
      // document.getElementsByClassName('el-dialog__headerbtn')[0].style.display = 'block'
    },
    exportExcelFrame() {
      this.$emit('exportExcelFrame')
    },
    preserveFun() {
      const newtFormObj = JSON.parse(JSON.stringify(this.formObj))
      newtFormObj.reason = this.changeInput(newtFormObj.reason)
      newtFormObj.t_deal_suggestion = this.changeInput(newtFormObj.t_deal_suggestion)
      newtFormObj.c_deal_suggestion = this.changeInput(newtFormObj.c_deal_suggestion)
      this.$emit('preserveFun', newtFormObj)
    },
    cancelFun() {
      this.$emit('cancelFun')
    },
    exportExcel() {
      var myDate = new Date()
      var year = myDate.getFullYear() // 获取当前年
      var mon = myDate.getMonth() + 1 // 获取当前月
      if (mon < 10) {
        mon = '0' + mon
      }
      var date = myDate.getDate() // 获取当前日
      if (date < 10) {
        date = '0' + date
      }
      var hours = myDate.getHours() // 获取当前小时
      if (hours < 10) {
        hours = '0' + hours
      }
      var minutes = myDate.getMinutes() // 获取当前分钟
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      var seconds = myDate.getSeconds() // 获取当前秒
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      var now = year + '' + mon + '' + date + '' + hours + '' + minutes + '' + seconds
      const xlsxName = '不合格品处置单_' + now
      exportExcel(xlsxName, 'disposal-list-components')
    }
  }
}

</script>

<style lang="scss">
 .unqualified-card-container {
    // width: 800px;
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
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
      padding:15px 0;
    }
  }
</style>
