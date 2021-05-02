import { FileSearcher } from './file-searcher'
import { Print } from './utils/printer'

export const main = () => {
  Print('hello world')
  return 1
}

export const run = async () => {
  const recordList = require('../content/files.json')

  const fileSearcherSearch = new FileSearcher(recordList)
  const searchable = await fileSearcherSearch.FileQuestion()
  const field = await fileSearcherSearch.FieldQuestion(searchable)
  const searchResults = await fileSearcherSearch.SearchQuestion(
    searchable,
    field
  )
  console.log(searchResults)
}

run()
