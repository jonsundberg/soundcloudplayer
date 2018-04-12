// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.prototype.constants = {
  SOUNDCLOUD_CLIENT_ID: '3a792e628dbaf8054e55f6e134ebe5fa'
}

Vue.prototype.time = {
  millisToReadable (millis) {
    let hhmmss = new Date(millis * 1000).toISOString().substr(11, 8)
    return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
