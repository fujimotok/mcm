import Dexie from 'dexie'

export const db = new Dexie('mcm')
db.version(1).stores({
  cards: '++id, name, code, format, url, refs'
})
