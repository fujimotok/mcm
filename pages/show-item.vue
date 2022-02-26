<template>
  <v-container>
    <v-card>
      <v-layout justify-center>
        <vue-barcode v-if="!isError" :value="code" :options="options" class="ma-6" @click.native="click" />
        <p v-else>
          Invalid Value
        </p>
      </v-layout>
      <v-card-text>
        <v-text-field v-model="name" label="名前" :readonly="isReadOnly" />
        <v-text-field v-model="code" label="コード" :readonly="isReadOnly" @input="inputCode" />
        <v-select v-model="format" label="フォーマット" :items="barcodeOpt" :readonly="isReadOnly" @change="changeFormat" />
        <div v-if="isReadOnly">
          <div>
            <label style="font-size: 12px; color: #00000099">
              URL
            </label>
          </div>
          <div style="margin: 0px 0px 28px 0px;">
            <a v-if="url" :href="url" target="_blank" style="word-break: break-all;">
              {{ url }}
            </a>
            <p v-else style="word-wrap:break-word;">
              URL is empty
            </p>
          </div>
        </div>
        <v-text-field v-else v-model="url" label="URL" />
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
import { db } from '../js/db'

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
    url: '',
    refs: 0,
    items: []
  }),
  head: () => ({
    title: 'カード情報'
  }),
  beforeMount () {
    db.cards.where('id').equals(Number(this.$route.query.index)).toArray()
      .then((records) => {
        this.isError = false
        this.id = records[0].id
        this.name = records[0].name
        this.code = records[0].code
        this.format = records[0].format
        this.url = records[0].url
        this.options = { format: this.format }
        this.refs = records[0].refs + 1
        db.cards.update(this.id, {
          refs: this.refs
        })
      })
  },
  errorCaptured (err, vm, info) {
    console.log('catched by `CHILD errorCaptured`', err.toString())
    this.isError = true
    return false
  },
  methods: {
    edit () {
      this.isReadOnly = false
    },
    update () {
      if (this.isError) {
        alert('コードもしくはフォーマットが不正です')
      } else {
        this.isReadOnly = true

        db.cards.update(this.id, {
          name: this.name,
          code: this.code,
          format: this.format,
          url: this.url,
          refs: this.refs
        })
        alert('更新完了')
      }
    },
    del () {
      if (confirm('本当に削除しても良いですか？')) {
        db.cards.delete(this.id)
        this.$router.push('/')
      }
    },
    inputCode () {
      this.isError = false
    },
    changeFormat (event) {
      this.isError = false
      this.options = { format: event }
    },
    click () {
      const shareData = {
        title: 'Dummy'
      }
      navigator.share(shareData).then()
    }
  }
}
</script>
