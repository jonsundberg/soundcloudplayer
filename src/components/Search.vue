  <template>
    <form v-on:submit.prevent="onSubmit">
      <div class="form-inline">
        <div class="input-group">
          <input class="form-control" type="text" v-model="query" placeholder="Search soundcloud">
          <span class="input-group-btn">
            <button type="button" v-on:click="search()" class="btn">
              <i class="fa fa-search"></i>
            </button>
          </span>
        </div>
      </div>
    </form>
  </template>

  <script>
    export default {
      name: 'search',
      data () {
        return {
          query: ''
        }
      },

      methods: {
        search () {
          this.$emit('click',this.query)
        }
      }
    }
  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped lang="scss">
    .input-group {
      input {
        background:rgba(0,0,0,.42);
        border: none;
        color: #fff;
        outline: 0;
      }
      .btn {
        background:rgba(0,0,0,.52);
        border-radius: 0;
      }
    }
  </style>
