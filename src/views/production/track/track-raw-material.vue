<template>
  <div>
    <!-- 原材料条码追朔 -->
    条形码：
    <el-input v-model="barCodeSearch" style="width:200px;margin-right:20px" placeholder="请输入内容" />
    流程：<el-select v-model="value" placeholder="流程" @change="clickFun">
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <el-timeline style="margin-top:18px;">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.timestamp"
        placement="top"
        size="large"
        :color="value === activity.b?'#0bbd87':''"
      >
        <span :id="activity.b" :ref="activity.b">{{ activity.a }}</span>
        <span style="margin-left:10px;">{{ activity.b }}</span>
        <i v-if="activity._show" class="el-icon-arrow-down" style="vertical-align: middle;margin-left:10px;" @click="activity._show = !activity._show" />
        <i v-if="!activity._show" class="el-icon-arrow-up" style="vertical-align: middle;margin-left:10px" @click="activity._show = !activity._show" />
        <table
          v-if="activity._show"
          border="1"
          bordercolor="#72716d"
          class="info-table"
        >
          <tbody>
            <tr>
              <td v-for="(item,i) in activity.contentList" :key="i">
                {{ item }}
              </td>
            </tr>
          </tbody>
        </table>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      barCodeSearch: '',
      activities: [
        {
          content: '支持自定义尺寸',
          a: '早班',
          b: '收货',
          _show: true,
          timestamp: '2018-04-04 20:46'
        }, {
          contentList: ['个人个人', '默认样式的节点', '个人个人', '默认样式的节点'],
          a: '早班',
          b: '取样', _show: true,
          timestamp: '2018-04-03 20:46'
        },
        {
          content: '支持自定义尺寸',
          a: '早班',
          b: '入库', _show: true,
          timestamp: '2018-04-04 20:46'
        }, {
          contentList: ['个人个人', '默认样式的节点', '个人个人', '默认样式的节点'],
          a: '早班',
          b: '收货', _show: true,
          timestamp: '2018-04-03 20:46'
        },
        {
          content: '支持自定义尺寸',
          a: '早班',
          b: '收货', _show: true,
          timestamp: '2018-04-04 20:46'
        }, {
          contentList: ['个人个人', '默认样式的节点', '个人个人', '默认样式的节点'],
          a: '早班',
          b: '投料', _show: true,
          timestamp: '2018-04-03 20:46'
        },
        {
          content: '支持自定义尺寸',
          a: '早班',
          b: '检测结果', _show: true,
          timestamp: '2018-04-04 20:46'
        }, {
          contentList: ['个人个人', '默认样式的节点', '个人个人', '默认样式的节点'],
          a: '早班',
          b: '出库', _show: true,
          timestamp: '2018-04-03 20:46'
        }
      ],
      options: ['收货', '取样', '入库', '出库', '检测结果', '投料']
    }
  },
  methods: {
    clickFun(val) {
      try {
        const a = this.$refs[val][0]
        a.scrollIntoView(false)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info-table{
    margin-top:5px;
    border-collapse: collapse;
    td{
        width: 150px;
        text-align: center;
        color: #72716d;
        padding:6px 0;
        word-break : break-all;
    }
}
</style>
