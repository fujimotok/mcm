<template>
  <v-list two-line>
    <v-list-item-group
      v-model="selected"
    >
      <template v-for="(item, index) in items">
        <v-list-item :key="item.name" @click="show(item.id)">
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
import { db } from '../js/db'

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
    db.cards.orderBy('refs').reverse().toArray()
      .then((records) => {
        this.items = this.items.concat(records)
      })
  },
  methods: {
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
