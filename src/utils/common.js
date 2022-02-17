// 公用数据
export default {
  formLabelWidth: '120px',
  normalOutboundSwitch: true,
  statusList: [
    { id: 1, name: '完成' },
    { id: 2, name: '执行中' },
    { id: 3, name: '失败' },
    { id: 4, name: '新建' },
    { id: 5, name: '关闭' }
  ],
  rubberStateList: [
    {
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
    }, {
      value: 7, label: '停用'
    }
  ],
  echartColor: ['#FC7213', '#73c0de', '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
  workTypeList: ['巡检', '保养', '润滑', '标定', '维修']
}
