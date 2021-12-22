<template>
  <v-container>
    <v-card>
      <v-layout justify-center>
        <vue-barcode v-if="!isError" :value="code" :options="options" class="ma-6"/>
        <p v-else>
          Invalid Value
        </p>
      </v-layout>
      <v-card-text>
        <v-text-field v-model="name" label="名前" :readonly="isReadOnly" />
        <v-text-field v-model="code" label="コード" :readonly="isReadOnly" @input="inputCode" />
        <v-select v-model="format" label="フォーマット" :items="barcodeOpt" :readonly="isReadOnly" @change="changeFormat" />
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="isReadOnly" text @click="edit">
          編集
        </v-btn>
        <v-btn v-else text @click="update">
          更新
        </v-btn>
        <v-btn text @click="del">
          削除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'ShowItem',
  data: () => ({
    isError: false,
    options: { format: 'CODE128' },
    format: 'CODE128',
    barcodeOpt: ['CODE128', 'EAN2', 'EAN5', 'EAN8', 'EAN13', 'UPC', 'CODE39', 'ITF14', 'MSI', 'codabar'],
    isReadOnly: true,
    name: '',
    code: '',
    items: [],
    index: 0
  }),
  head: () => ({
    title: 'カード情報'
  }),
  beforeMount () {
    this.items = JSON.parse(localStorage.getItem('items')) || []
    this.index = this.$route.query.index
    this.name = this.items[this.index].name
    this.code = this.items[this.index].code
    this.format = this.items[this.index].format
    this.options = { format: this.items[this.index].format }
  },
  errorCaptured (err, vm, info) {
    console.log('catched by `CHILD errorCaptured`', err.toString())
    this.isError = true
    return false
  },
  methods: {
    setItems () {
      localStorage.setItem('items', JSON.stringify(this.items))
    },
    edit () {
      this.isReadOnly = false
    },
    update () {
      if (this.isError) {
        alert('コードもしくはフォーマットが不正です')
      } else {
        this.isReadOnly = true
        this.items[this.index].name = this.name
        this.items[this.index].code = this.code
        this.items[this.index].format = this.format
        this.setItems()
        alert('更新完了')
      }
    },
    del () {
      if (confirm('本当に削除しても良いですか？')) {
        this.items.splice(this.index, 1)
        this.setItems()
        this.$router.push('/')
      }
    },
    inputCode () {
      this.isError = false
    },
    changeFormat (event) {
      this.isError = false
      this.options = { format: event }
    }
  }
}
</script>
