<template>
  <v-container>
    <v-card>
      <v-layout justify-center>
        プレビュー
      </v-layout>
      <v-layout justify-center>
        <vue-barcode v-if="!isError" :value="code" :options="options" />
        <p v-else>
          Invalid Value
        </p>
      </v-layout>
      <v-card-text>
        <v-text-field v-model="name" label="名前" />
        <v-text-field v-model="code" label="コード" @input="inputCode" />
        <v-select v-model="format" label="フォーマット" :items="barcodeOpt" @change="changeFormat" />
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="add">
          追加
        </v-btn>
        <v-btn text @click="cancel">
          キャンセル
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-btn
      color="secondary"
      fab
      fixed
      right
      bottom
      @click="barcodeReader"
    >
      <v-icon>mdi-camera</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'AddItem',
  data: () => ({
    isError: false,
    name: '',
    code: '',
    options: { format: 'CODE128' },
    format: 'CODE128',
    barcodeOpt: ['CODE128', 'EAN2', 'EAN5', 'EAN8', 'EAN13', 'UPC', 'CODE39', 'ITF14', 'MSI', 'codabar']
  }),
  head: () => ({
    title: '新規追加'
  }),
  errorCaptured (err, vm, info) {
    console.log('catched by `CHILD errorCaptured`', err.toString())
    this.isError = true
    return false
  },
  mounted () {
    this.items = JSON.parse(localStorage.getItem('items')) || []
    this.code = this.$route.query.code ?? ''
    this.format = this.$route.query.format ?? 'CODE128'
    this.isError = false
  },
  methods: {
    addItem () {
      this.items.push({ name: this.name, code: this.code, format: this.format })
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
      if (this.isError) {
        alert('コードもしくはフォーマットが不正です')
      } else {
        this.addItem()
        this.$router.push('/')
      }
    },
    cancel () {
      this.$router.push('/')
    },
    inputCode () {
      this.isError = false
    },
    changeFormat (event) {
      this.isError = false
      this.options = { format: event }
    },
    barcodeReader () {
      this.$router.push('/barcode-reader')
    }
  }
}
</script>
