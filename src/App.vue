<template>
  <div id="app" class="container-fluid">
      <soundcloud-player/>
  </div>
</template>

<script>
import soundcloudPlayer from './components/SoundcloudPlayer'
export default {
  name: 'App',
  components: {
    soundcloudPlayer
  }
}
</script>

<style lang="scss">
  @import './static/styles/styles.scss';
  @import './static/styles/bootstrap.custom.scss';
  @import '../node_modules/bootstrap/scss/bootstrap.scss';
  @import '../node_modules/font-awesome/css/font-awesome.min.css';
  @import '../node_modules/vue2-animate/dist/vue2-animate.min.css';
</style>
