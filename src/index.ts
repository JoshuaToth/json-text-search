import { Main } from './main'
import { Print } from './utils/printer'

export const main = () => {
  Print('hello world')
  return 1
}

export const run = async () => {
  const recordList = require('../content/files.json')

  const mainSearch = new Main(recordList)
  const searchable = await mainSearch.FileQuestion()
  const field = await mainSearch.FieldQuestion(searchable)
  const searchResults = await mainSearch.SearchQuestion(searchable, field)
  console.log(searchResults)
}

run()
