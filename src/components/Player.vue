<template>
  <div id="player">
    <div class="current-track ">
      <div class="cover" :style="{'background-image': 'url(' + track.artwork_url + ')'}"></div>
      <div class="cover-overlay" v-if="track.stream_url">
        <i class="fa fa-pause button" @click="togglePlay()" v-if="playing"></i>
        <i class="fa fa-play button" @click="togglePlay()" v-else></i>
      </div>
      <transition name="fade">
        <div class="info" v-if="playing">
          <p>{{track.title}}</p>
          <img :src="track.user.avatar_url" class="avatar"> {{track.user.username}}</img>
          <div class="duration">
            <p>{{currentTime}}  / {{duration}}</p>
          </div>
          <div class="equalizer">
            <range min="0" max="1"  text="volume" v-model="controls.gain" v-on:change="changeGain()"/>
            <range min="-40" max="40"  text="treble" v-model="controls.high" v-on:change="changeHigh()"/>
            <range min="-10" max="10"  text="bass" v-model="controls.low" v-on:change="changeLow()"/>
          </div>
        </div>
      </transition>
      <div class="slidecontainer">
        <input type="range" min="0" @change="timeTravel(currentTimeMillis)" :max="totalDuration" :value="currentTimeMillis" class="slider">
      </div>
    </div>
  </div>
</template>

<script>
  import Range from './equalizer/Range'
  const audioContext = window.AudioContext ? new AudioContext() : new webkitAudioContext()

  export default {
    name: 'player',
    components: {
      Range
    },
    data () {
      return {
        playing: false,
        currentTime: '00:00',
        currentTimeMillis:0,
        totalDuration: 0,
        rangeActive:false,
        controls: {
          gain: 0.5,
          high: 0,
          low: 0
        },
        nodes : {
          source: undefined,
          gain: undefined,
          treble: undefined,
          low: undefined
        }
      }
    },
    props: {
      track: {
        type: Object,
        default: {
          title: '',
          artwork_url: '',
          user: {}
        }
      }
    },

    computed: {
      duration: function () {
        return this.audio ? this.time.millisToReadable(this.totalDuration) : '00:00'
      }
    },

    watch : {
      track () {
        this.playTrack()
      }
    },

    mounted () {
      this.init()
    },

    beforeDestroy () {
      this.removeEventListeners()
    },

    methods : {
      init ()  {
        this.setupAudio()
      },

      togglePlay () {
        if(this.playing){
          this.audio.pause()
        }
        else {
          this.audio.play()
        }
      },

      stop () {
        if (this.playing) {
          this.audio.pause()
          this.audio.currentTime = 0
        }
      },

      changeGain () {
        this.nodes.gain.gain.value = parseFloat(this.controls.gain);
      },

      changeHigh () {
        this.nodes.high.gain.value = parseFloat(this.controls.high);
      },

      changeLow () {
        this.nodes.low.gain.value = parseFloat(this.controls.low);
      },

      onPlayPause (e) {
        this.playing = e.type !== 'pause'
      },

      onTimeUpdated () {
        this.currentTimeMillis = this.audio.currentTime
        this.currentTime = this.time.millisToReadable(parseInt(this.currentTimeMillis))
      },

      onTrackLoaded () {
        this.totalDuration = this.audio.duration
      },

      setupAudio () {
        this.audio = new Audio();
        this.audio.crossOrigin = "anonymous"
        this.nodes.source = audioContext.createMediaElementSource(this.audio)
        this.nodes.gain = audioContext.createGain()
        this.initFilters()
        this.connectNodes()
        this.addEventListeners()
      },

      initFilters () {
        this.nodes.analyser = audioContext.createAnalyser()
        this.nodes.low = audioContext.createBiquadFilter()
        this.nodes.low.type = "lowshelf"
        this.nodes.low.frequency.value = 200.0
        this.nodes.low.gain.value = 0.0

        this.nodes.mid = audioContext.createBiquadFilter()
        this.nodes.mid.type = "peaking"
        this.nodes.mid.frequency.value = 1000.0
        this.nodes.mid.Q.value = 0.5
        this.nodes.mid.gain.value = 0.0

        this.nodes.high = audioContext.createBiquadFilter()
        this.nodes.high.type = "highshelf"
        this.nodes.high.frequency.value = 3200.0
        this.nodes.high.gain.value = 0.0
      },

      connectNodes () {
        this.nodes.source.connect(this.nodes.analyser)
        this.nodes.analyser.connect(this.nodes.low)
        this.nodes.low.connect(this.nodes.mid)
        this.nodes.mid.connect(this.nodes.high)
        this.nodes.high.connect(this.nodes.gain)
        this.nodes.gain.connect(audioContext.destination)
      },

      addEventListeners () {
        this.audio.addEventListener('timeupdate', this.onTimeUpdated)
        this.audio.addEventListener('loadeddata', this.onTrackLoaded)
        this.audio.addEventListener('pause', this.onPlayPause)
        this.audio.addEventListener('play', this.onPlayPause)
      },

      removeEventListeners () {
        this.audio.removeEventListener('timeupdate', this.onTimeUpdated)
        this.audio.removeEventListener('loadeddata', this.onTrackLoaded)
        this.audio.removeEventListener('pause', this.onPlayPause)
        this.audio.removeEventListener('play', this.onPlayPause)
      },

      playTrack () {
        this.stop();
        this.audio.src = `${this.track.stream_url}?client_id=${this.constants.SOUNDCLOUD_CLIENT_ID}`
        this.audio.play()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#player {
  min-height:140px;
  background:rgba(0,0,0,.42);
  padding:10px;
  .current-track {
    background:rgba(0,0,0,.42);
    height: 100px;
    width: 100%;
    .cover {
      z-index: 1;
      width: 100px;
      height: 100px;
      float: left;
    }
    .cover-overlay {
      z-index: 2;
      width: 100px;
      height: 100px;
      margin-left:-100px;
      background:rgba(0,0,0,.32);
      float: left;
      .button {
        margin:25px 0 0 30px;
        font-size: 50px;
        color: rgba(255,255,255,.62);
        &:hover {
          color:#FFF;
          cursor:pointer;
        }
      }
    }
    .info {
      padding:10px;
      height: 60px;
      margin-left: 100px;
      color:#FFF;
      .duration {
        text-align: right;
        margin-top: -10px;
      }
      .equalizer {
        text-align: right;
        margin-top: -100px;
      }
      .avatar {
        margin-right: .25em;
        display: inline-block;
        width: 2em;
        height: 2em;
        border-radius: 500rem;
      }
    }

    .progress {
      height: 10px;
      color:#FFF;
      width: 100%;
      float: none;
    }
  }
}
</style>
