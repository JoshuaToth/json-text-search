import FileSearcher from './file-searcher'
import { Print } from './utils/printer'
import ReadLine from 'readline'
import { INVALID_OPTION } from './utils/consts'
import { ExitIfQuit } from './utils/exit'

export const Run = async () => {
  console.clear()
  const recordList = require('../content/files.json')
  Print('File Searcher starting')
  const fileSearcher = new FileSearcher(recordList)
  while (true) {
    Print(`

Welcome to Zendesk Search
Type 'quit' to exit at any time, enter your choice and press 'Enter' to continue
    `)
    const option = await ActionQuestion()

    Print('\n\n')

    if (option === 1) {
      await searchLoop(fileSearcher)
    } else if (option === 2) {
      fileSearcher.PrintSearchableFields()
    } else {
      ExitIfQuit('quit')
      return
    }
  }
}

const ActionQuestion = async (): Promise<number> => {
  let selectedOption: number = -1
  let exit = false
  while (selectedOption < 0 && !exit) {
    const rl = ReadLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    selectedOption = await new Promise((res) =>
      rl.question(
        `
        Select search options:
        * Press 1 to search Zendesk
        * Press 2 to view a list of searchable fields
        * Type 'quit' to exit
`,
        (answer) => {
          if (answer === 'quit') {
            exit = true
            res(-1)
          } else {
            const option = parseInt(answer)
            if (option !== 1 && option !== 2) {
              Print(INVALID_OPTION)
              res(-1)
            } else {
              res(option)
            }
          }
        }
      )
    )

    rl.close()
  }
  return selectedOption
}

const searchLoop = async (fileSearcher: FileSearcher) => {
  const searchable = await fileSearcher.FileQuestion()
  const field = await fileSearcher.FieldQuestion(searchable)
  const searchResults = await fileSearcher.SearchQuestion(searchable, field)
  Print(searchResults)
  // TODO: human readable search results, if any
}
