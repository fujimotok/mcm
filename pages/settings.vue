<template>
  <v-container>
    <v-card>
      <v-card-title>
        データインポート/エクスポート
      </v-card-title>
      <v-card-actions>
        <v-file-input v-model="file" label="インポート" accept=".json" class="mr-4" @change="dataImport" />
        <v-btn @click="dataExport">
          エクスポート
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import IDBExportImport from 'indexeddb-export-import'
import { db } from '../js/db'

export default {
  name: 'SettingsPage',
  data () {
    return {
      file: null
    }
  },
  head: () => ({
    title: 'Settings'
  }),
  methods: {
    dataImport () {
      if (window.File && this.file) {
        this.readFileAsync(this.file)
          .then((result) => {
            db.open().then(() => {
              const idbDatabase = db.backendDB() // get native IDBDatabase object from Dexie wrapper

              // export to JSON, clear database, and import from JSON
              IDBExportImport.clearDatabase(idbDatabase, (err) => {
                if (!err) { // cleared data successfully
                  IDBExportImport.importFromJsonString(idbDatabase, result, (err) => {
                    if (!err) {
                      alert('インポート完了')
                      this.$router.push('/')
                    } else {
                      alert('インポートに失敗しました')
                    }
                  })
                }
              })
            })
          })
          .catch((e) => {
            alert(`エラー:${e}`)
          })
      } else {
        alert('お使いのブラウザは対応しておりません')
      }
    },
    dataExport () {
      db.open().then(() => {
        try {
          const idbDatabase = db.backendDB()

          IDBExportImport.exportToJsonString(idbDatabase, function (err, jsonString) {
            if (err) {
              console.error(err)
            } else {
              console.log('Exported as JSON: ' + jsonString)

              const fileName = 'export.json'
              const data = jsonString
              const link = document.createElement('a')

              link.href = 'data:application/json,' + encodeURIComponent(data)
              link.download = fileName
              link.click()
            }
          })
        } catch (error) {
          console.error('' + error)
        }
      })
    },
    // ファイルデータを非同期で読み込みます。
    readFileAsync (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsText(file)
      })
    }
  }
}
</script>
