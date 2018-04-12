<template>
  <div class="equalizer">
      <range min="0" max="1" value="0.1" text="volume"/>
      <range min="0" max="1" value="0.1" text="treble"/>
      <range min="0" max="1" value="1.0" text="bass"/>
  </div>
</template>

<script>
  import Range from './Range'
  export default {
    name: 'equalizer',
    components: {
      Range
    },
    data () {
      return {
        query: ''
      }
    },

    methods: {
      search () {
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
