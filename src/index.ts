import { Main } from './main'

export const main = () => {
  console.log('hello world')
  return 1
}

const recordList = require('../content/files.json')

const mainSearch = new Main(recordList)
mainSearch.PrintSearchableFiles()
