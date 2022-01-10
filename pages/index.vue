<template>
  <v-list two-line>
    <v-list-item-group
      v-model="selected"
    >
      <template v-for="(item, index) in items">
        <v-list-item :key="item.name" @click="show(index)">
          <template>
            <v-list-item-content>
              <v-list-item-title v-text="item.name" />
              <v-list-item-subtitle
                class="text-caption"
              >
                {{ item.format }} : {{ item.code }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-list-item>
        <v-divider
          :key="index"
        />
      </template>
    </v-list-item-group>
    <v-btn
      color="secondary"
      fab
      fixed
      right
      bottom
      @click="add"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-list>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    selected: [2],
    json: '',
    items: []
  }),
  head: () => ({
    title: 'カード一覧'
  }),
  mounted () {
    this.items = JSON.parse(localStorage.getItem('items')) || []
  },
  methods: {
    addItem () {
      this.items.push('item_' + this.items.length)
      this.setItems()
    },
    deleteAllItems () {
      this.items = []
      this.setItems()
    },
    setItems () {
      localStorage.setItem('items', JSON.stringify(this.items))
    },
    add () {
      localStorage.setItem('code', '')
      localStorage.setItem('format', 'CODE128')
      this.$router.push('/add-item')
    },
    show (index) {
      this.$router.push({ path: '/show-item', query: { index } })
    }
  }
}
</script>
