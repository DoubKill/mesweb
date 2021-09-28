<template>
  <div>
    <!-- 执行设备维修工单 -->
    <el-form :inline="true">
      <el-form-item label="计划维修时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="计划名称">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          equip-type="密炼设备"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="工单编号">
        <el-input
          v-model="search.equip1"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.feedi"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in options3"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重要程度">
        <el-select
          v-model="search.feed"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options4"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修标准">
        <el-input
          v-model="search.equip"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.feeding"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options2"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修人">
        <el-input
          v-model="search.person"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="是否需要外协">
        <el-select
          v-model="search.f"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['Y','N']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要物料">
        <el-select
          v-model="search.fe"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['Y','N']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询本人待处理工单</el-button>
        <el-button type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="操作"
        width="130"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="primary"
              size="mini"
              @click="showEditDialog(scope.row)"
            >开始</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="dialog(scope.row)"
            >处理
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="计划/报修编号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="计划/报修名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="工单编号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="部位名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修标准/故障原因"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="故障详情描述"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修记录"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="计划维修日期"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备条件"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="重要程度"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修开始时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修结束时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="是否需要物料"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="是否需要外协"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="指派人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="指派时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="接单人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="接单时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="报修人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="报修时间"
        min-width="20"
      />
    </el-table>
    <el-dialog
      title="处理维修工单"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :inline="true" label-width="150px">
        <el-form-item label="计划/报修名称" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            style="width:250px"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="工单编号" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="机台" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="维修标准/故障原因" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="故障详情描述" prop="note">
          <el-input
            v-model="creatOrder.note"
            type="textarea"
            style="width:250px"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="适用维修标准">
          <el-input
            v-model="creatOrder.material_name"
            style="width:250px"
            :disabled="true"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="维修记录" prop="note1">
          <el-input
            v-model="creatOrder.note1"
            style="width:250px"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            ref="elUploadImg"
            action=""
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="onChangeImg"
            :on-exceed="onExceed"
            :limit="1"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleImg" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="物料申请">
          <el-radio-group v-model="creatOrder.radio">
            <el-radio :label="1">否</el-radio>
            <el-radio :label="2">是</el-radio>
          </el-radio-group>
          <span v-if="creatOrder.radio===1||creatOrder.radio===''" style="marginLeft:30px">未申请</span>
          <span v-if="creatOrder.radio===2" style="marginLeft:30px">已申请</span>
          <el-button type="primary" :disabled="creatOrder.radio===2" style="marginLeft:30px">申请物料</el-button>
        </el-form-item>
        <el-form-item label="维修结论">
          <el-radio-group v-model="creatOrder.radio1" style="marginTop:15px">
            <el-radio label="1">完成</el-radio>
            <el-radio label="2">未完成</el-radio>
            <br>
            <br>
            <el-radio label="3" style="marginTop:15px">等待物料</el-radio>
            <el-radio label="4" style="marginTop:15px">等待外协维修</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import page from '@/components/page'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'ExecuteEquipment',
  components: { EquipSelect, page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      dateValue: [],
      tableData: [],
      total: 0,
      options1: ['巡检', '生产', '其他'],
      options2: ['已做成', '已接单', '等待物料', '等待外协维修', '已完成', '已关闭'],
      options3: ['停机', '不停机'],
      options4: ['高', '中', '低'],
      multipleSelection: [],
      dialogImageUrl: '',
      dialogVisible: false,
      submit: false,
      dialogVisibleImg: false,
      creatOrder: { radio: '' }
    }
  },
  methods: {
    generateFun(obj) {
      this.dialogVisible = true
      console.log(obj, 'obj')
    },
    changeDate() {

    },
    getList() {

    },
    changeSearch() {
      this.getList()
    },
    onExceed() {
      this.$message.info('最多上传一张图片')
    },
    onChangeImg(file, fileList) {
      const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.raw.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpeg、jpg 、png格式!')
        fileList.pop()
        return
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        fileList.pop()
        return
      }
      this.$set(this.creatOrder, 'image', file.raw)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleImg = true
    },
    equipSelected(obj) {
      this.creatOrder.equip_no = obj || null
      console.log(this.creatOrder.equip_no)
    },
    dialog() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style>

</style>
