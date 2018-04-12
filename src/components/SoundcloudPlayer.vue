  <template>
    <div id="player-app">
      <player :track="currentTrack"/>
      <div class="header">
        <search v-model="query" @click="doQuery"/>
      </div>
      <transition name="fade">
        <div class="row result" v-if="showResult">
          <div v-for="track in tracks" class="col-sm-12 track" @click="setCurrentTrack(track)">
            <div class="row">
              <div class="col-sm-1">
                <img :src="track.artwork_url" >
              </div>
              <div class="col-sm-11">
                <div class="info">
                  <h5>{{track.title}}</h5>
                  <img :src="track.user.avatar_url" class="avatar"> {{track.user.username}}</img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>

  <script>
    import Search from './Search'
    import Player from './Player'

    export default {
      name: 'soundcloudPlayer',
      components: {
        Search,
        Player
      },

      data () {
        return {
          query: '',
          tracks: [],
          showResult:false,
          currentTrack:{
            title: '',
            user: {}
          }
        }
      },

      mounted () {
        this.init()
      },

      methods: {
        init () {
          SC.initialize({
              client_id: this.constants.SOUNDCLOUD_CLIENT_ID
          });
        },

        doQuery (query) {
          const options = {
            limit: 100,
            q:     query
          }
          SC.get('/tracks', options).then((tracks) => {
            this.tracks = tracks;
            this.showResult = true;
          });
        },

        setCurrentTrack (track) {
          this.currentTrack = track
        }
      }
    }
  </script>

  <style lang="scss" scoped>
    #player-app {
      background:rgba(0,0,0,.42);
      min-height: 200px;
      margin-top:15px;
      overflow-y: hidden;
      overflow-x: hidden;
      box-shadow: 0 15px 50px rgba(0,0,0,.25);
      border-radius:8px;
      .header {
        padding: 10px;
      }
      .result {
        height:600px;
        padding:0 20px 0 25px;
        overflow-y: auto;
        .track {
          cursor:pointer;
          background:#FFF;
          padding-left: 0;
          box-shadow: 0 5px 5px rgba(0,0,0,.1);
          margin-bottom: 20px;
          &:hover {
            background:#effcff;
          }
          .info {
            .avatar {
              margin-right: .25em;
              display: inline-block;
              width: 2em;
              height: 2em;
              border-radius: 500rem;
            }
            padding:10px;
            h1 {
              width: 100%;
            }
            p {
              width: 100%;
            }
          }
        }
      }
    }
  </style>
