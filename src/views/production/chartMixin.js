export default {
  data() {
    this.toolbox = {
      feature: {
        dataZoom: {
          show: true
        },
        restore: {}
      }
    }
    this.extend = {
      series: {
        smooth: false
      }
    }
    this.colors = ['#FF40A3', '#B2670A', '#3B3834', '#196D26', '#2E77B4']
    this.chartSettings = {
      labelMap: {
        'created_date_date': '时间(s)',
        'temperature': '温度(c°)',
        'power': '功率(W)',
        'energy': '能量(J)',
        'rpm': '转速(r/min)',
        'pressure': '压力(bar)'
      },
      axisSite: {
        right: ['temperature', 'rpm', 'energy', 'pressure']
      }
      // yAxisName: ['功率']
    }
    return {
      chartData: {
        columns: [
          'created_date_date',
          'temperature',
          'power',
          'energy',
          'rpm',
          'pressure'
        ],
        rows: []
      },
      options: {
        backgroundColor: '#fff',
        title: {
          show: true,
          text: '主标题',
          textAlign: 'left'
          // left: 'center',
          // align: 'right'
        },
        grid: {
          y: 100
        },
        legend: {
          left: 120
        },
        yAxis: [
          {
            min: 0,
            max: 2500,
            splitNumber: 5,
            interval: (2500 - 0) / 5
          },
          {
            min: 0,
            max: 200,
            splitNumber: 5,
            interval: (200 - 0) / 5
          }
        ],
        toolbox: {
          itemSize: 20,
          itemGap: 30,
          right: 0,
          top: 30,
          feature: {
            // dataView: {show:true},
            saveAsImage: {
              name: '',
              // excludeComponents :['toolbox'],
              pixelRatio: 2
            },
            myTool1: {
              show: true,
              title: '放大查看',
              icon: 'path://M419.61244445 837.17688889c98.53155555 0 191.71555555-33.90577778 266.46755555-96.14222222l269.08444445 269.08444444c7.50933333 7.50933333 17.408 11.264 27.30666666 11.264s19.79733333-3.75466667 27.30666667-11.264c15.13244445-15.13244445 15.13244445-39.59466667 0-54.61333333L740.80711111 686.30755555c136.07822222-163.84 127.43111111-408.12088889-26.05511111-561.6071111-78.848-78.73422222-183.63733333-122.19733333-295.13955555-122.19733334-111.50222222 0-216.29155555 43.46311111-295.13955556 122.19733334-162.70222222 162.70222222-162.70222222 427.46311111 0 590.16533333 78.96177778 78.96177778 183.75111111 122.31111111 295.13955556 122.31111111zM179.2 179.42755555c64.28444445-64.17066667 149.61777778-99.55555555 240.41244445-99.55555555 90.79466667 0 176.24177778 35.38488889 240.41244444 99.55555555 132.55111111 132.55111111 132.55111111 348.38755555 0 480.93866667-64.28444445 64.17066667-149.61777778 99.55555555-240.41244444 99.55555556S243.48444445 724.53688889 179.2 660.36622222C46.64888889 527.70133333 46.64888889 311.97866667 179.2 179.42755555z',
              onclick: () => {
                this.dialogVisible = true
                this.options.toolbox.feature.myTool1.show = false
              }
            }
          }
        }
      }
    }
  }
}
