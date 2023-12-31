import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'
import request from '@/utils/request-zc'
import requestTH from '@/utils/request-zc-th'

const getDefaultState = () => {
  return {
    token: '',
    name: '',
    avatar: '',
    permission: '',
    editionNo: ''
  }
}

const state = () => {
  return {
    token: getToken(),
    name: Cookies.get('name'),
    userId: Cookies.get('userId'),
    avatar: '',
    permission: localStorage.getItem('permission'),
    editionNo: Cookies.get('editionNo') || 'v1'
  }
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
    Cookies.set('name', name)
  },
  SET_USER_ID: (state, id) => {
    state.userId = id
    Cookies.set('userId', id)
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
    localStorage.setItem('permission', permission)
  },
  SET_EDITION: (state, name) => {
    state.editionNo = name
    Cookies.set('editionNo', name)
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        // 登录中策
        Cookies.set('zc-url', response.wms_url)
        Cookies.set('zc-th-url', response.th_url)
        const loginId = process.env.NODE_ENV === 'production'
          ? window.location.host === '10.10.120.40:9009' ? 'guozi' : 'mes' : 'guozi'
        // const loginId = 'mes'
        request({
          url: '/user/Login',
          method: 'POST',
          data: { loginId: loginId,
            password: '123456' }}
        ).then(data => {
          const userId = data.datas.userId
          Cookies.set('zc-userId', userId)
        }).catch((e) => {
          console.log(e, 'zc登录失败')
        })
        requestTH({
          url: '/user/Login',
          method: 'POST',
          data: { loginId: 'admin',
            password: '123456' }}
        ).then(data => {
          const userId = data.datas.userId
          Cookies.set('zc-th-userId', userId)
        }).catch((e) => {
          console.log(e, 'zc登录失败')
        })
        commit('SET_TOKEN', response.token)
        commit('SET_NAME', response.username)
        commit('SET_USER_ID', response.id)
        commit('SET_PERMISSION', JSON.stringify(response.permissions))
        // 登录获取token,存到全局中
        setToken(response.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      // let data = response
      // console.log(data, 'response')

      // if (!data) {
      //   return reject('Verification failed, please Login again.')
      // }
      // roles must be a non-empty array登录权限
      //  if (!roles || roles.length <= 0) {
      //   reject('getInfo: roles must be a non-null array!')
      // }

      // // 其他列表按钮的权限写这里，获取权限存起来
      // let data = {
      //   roles: ['admin'],
      //   name: 'name-admin', avatar: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2310890073,3469009192&fm=26&gp=0.jpg'
      // }

      // commit('SET_ROLES', JSON.stringify(data.results))
      // commit('SET_AVATAR', data.avatar)
      // resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, rootState, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      removeToken() // must remove  token  first
      resetRouter()
      rootState.permission.addRoutes = []
      commit('RESET_STATE', '')
      commit('SET_PERMISSION', '')
      commit('SET_NAME', '')
      localStorage.clear()

      Cookies.remove('zc-userId')
      Cookies.remove('editionNo')
      Cookies.remove('userId')
      Cookies.remove('name')
      Cookies.remove('zc-url')

      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  }

  // remove token
  // resetToken({ commit }) {
  // return new Promise(resolve => {
  //   removeToken() // must remove  token  first
  //   commit('RESET_STATE','')
  //   resolve()
  // })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

