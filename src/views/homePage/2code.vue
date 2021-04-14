<template>
  <div>
    <video
      id="video"
      ref="videoRef"
      autoplay
    />

    <el-button @click="startRecognize">扫二维码</el-button>

    <!-- <iframe src="https://qrcodescan.in/" style="width:1000px; height:1000px" /> -->

    <!-- 可拍照可到图库 -->
    <input
      id="file"
      type="file"
      accept="image/*"
      @change="getUrl('file-url')"
    >

    <!-- <input
      type="file"
      accept="video/*"
      capture="camera"
    > -->
    <img id="imgUrl" :src="_url" alt="">

  </div>
</template>

<script>
// import QrcodeDecoder from 'qrcode-decoder'
// import { BrowserQRCodeReader } from '@zxing/library'
import jsQR from 'jsqr'
export default {
  data() {
    return {
    }
  },
  created() {
    this._url = ''
    this._setInterval = null
    this.mediaStreamTrack = null
  },
  beforeCreate() {
  },
  mounted() {
  },
  updated() {
  },
  destroyed() {
    window.clearInterval(this._setInterval)
  },
  methods: {
    async getUrl(type) {
      const elem = document.getElementById('file')
      // const imgUrl = document.getElementById('imgUrl')
      // const qr = new QrcodeDecoder()
      let url = null
      if (type === 'img-url') {
        url = elem.src
      } else if (type === 'file-url' && elem.files.length > 0) {
        url = this.getObjectURL(elem.files[0])
      }
      const imgDom = new Image()
      imgDom.src = url
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      imgDom.onload = () => {
        const w = canvas.width
        const h = canvas.height
        ctx.clearRect(0, 0, w, h)
        ctx.drawImage(imgDom, 0, 0, w, h)
        const imageData = ctx.getImageData(0, 0, w, h)
        const code = jsQR(imageData.data, w, h)
        if (code) {
          alert(code.data + 777)
        } else {
          alert('识别失败' + 666)
        }
      }

      // console.log(imgDom, 8888)
      // const codeReader = new BrowserQRCodeReader()
      // try { // 这个需要img标签，img的url ；或者video标签
      //   const result = await codeReader.decodeFromImage(imgDom)
      //   alert(result + 777)
      // } catch (err) {
      //   alert(err + 666)
      //   console.error(err)
      // }

      // qr.decodeFromImage(url).then((res) => {
      //   //  这个不识别拍照出来的二维码，可不转为画布，直接url或者video标签
      //   console.log(res, 6666)
      //   if (res) {
      //     alert(res.data + 6666)
      //   } else {
      //     alert('识别失败')
      //   }
      // }).catch(error => {
      //   alert(error + 3333)
      //   alert('识别失败')
      // })
    },
    getObjectURL(file) {
      let url = null

      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }

      return url
    },
    stopCapture() {
      if (window.stream) {
        window.stream.getTracks().forEach(track => {
          track.stop()
        })
        window.clearInterval(this._setInterval)
      }
    },
    startRecognize() {
      // window.addEventListener('DOMContentLoaded', function() {
      var video = document.getElementById('video'); var canvas; var context
      try {
        canvas = document.createElement('canvas')
        context = canvas.getContext('2d')
      } catch (e) { alert('not support canvas!'); return }

      // alert(navigator.mediaDevices + '111')
      // alert(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia + '2222')
      // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            alert('getUserMedia is not implemented in this browser')
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      const constraints = { video: { facingMode: { exact: 'environment' }}}
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          window.stream = stream
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in video) {
            video.srcObject = stream
          } else {
            // 防止在新的浏览器里使用它，应为它已经不再支持了
            video.src = window.URL.createObjectURL(stream)
          }
          video.onloadedmetadata = function(e) {
            video.play()
          }
        })
        .catch(function(err) {
          console.log(err)
          alert('摄像头开启错误')
        })
      // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
      // alert(navigator.getUserMedia)

      /** if (navigator.getUserMedia) {
        navigator.getUserMedia(
          { 'video': true },
          function(stream) {
            if (video.mozSrcObject !== undefined) { video.mozSrcObject = stream } else {
              try {
                video.srcObject = stream
              } catch (error) {
                video.src = ((window.URL || window.webkitURL || window.mozURL || window.msURL) && window.URL.createObjectURL(stream)) || stream
              }
              video.play()
            }
          },
          function(error) {
            if (error.PERMISSION_DENIED)console.log('用户拒绝了浏览器请求媒体的权限', error.code)
            if (error.NOT_SUPPORTED_ERROR)console.log('当前浏览器不支持拍照功能', error.code)
            if (error.MANDATORY_UNSATISFIED_ERROR)console.log('指定的媒体类型未接收到媒体流', error.code)
            alert('Video capture error: ' + error)
          }
        )
      } else alert('Native device media streaming (getUserMedia) not supported in this browser')**/

      // const qr = new QrcodeDecoder()
      this._setInterval = setInterval(() => {
        context.drawImage(video, 0, 0, canvas.width = video.videoWidth, canvas.height = video.videoHeight)
        var imageData = context.getImageData(0, 0, video.videoWidth, video.videoHeight)
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        })
        if (code) {
          alert(code.data + 777)
        } else {
          alert('识别失败' + 666)
        }
        // const img = document.getElementById('myImage')
        // img.src = canvas.toDataURL('image/png')
        // $.post('/Home/QRcodeDecode', { 'img': canvas.toDataURL().substr(22) }, function(data, status) {
        //   if (status === 'success' && data !== 'no')location.href = '/Home/Result/' + data
        // }, 'text')
        // console.log(canvas.toDataURL('image/png'))

      // qr.decodeFromCamera(video,
      //   { crossOrigin: 'anonymous' }).then((res) => {
      //   // 打印结果为 解析出来的 二维码地址
      //   alert(res.data + 1122)
      //   this.error = res.data
      // }).catch(err => {
      //   alert(err + 'err')
      // })
      }, 5000)
      // }, false)
    },
    next() { }
  }
}
</script>

<style>
input[node-type=jsbridge]{
    display:none;
}
</style>
