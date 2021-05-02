import { Main } from './main'
import { Print } from './utils/printer'

export const main = () => {
  Print('hello world')
  return 1
}

const recordList = require('../content/files.json')

const mainSearch = new Main(recordList)
mainSearch.GetSearchableFilesMessage()
