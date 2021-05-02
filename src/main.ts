import { readFileSync, existsSync } from 'fs'
import { Searchable } from './searchable'
import {
  ATTEMPTING_TO_LOAD,
  COULD_NOT_PARSE_FILE,
  FILE_DOES_NOT_EXIST,
  NOT_ARRAY_RECORDS,
  NO_FILES_LOADED,
} from './utils/consts'
import { Print } from './utils/printer'

export class Main {
  private searchables: Searchable[] = []

  constructor(files: { fileName: string; name: string }[]) {
    Print(`Loading search files`)

    files.forEach((file) => {
      const fileName = `./content/${file.fileName}`
      Print(`${ATTEMPTING_TO_LOAD} ${fileName}`)

      if (!existsSync(fileName)) {
        Print(`${FILE_DOES_NOT_EXIST} ${fileName}`)
        return
      }

      try {
        const recordBuffer = readFileSync(fileName)
        const records = JSON.parse(recordBuffer.toString())
        if (!Array.isArray(records)) {
          Print(`${NOT_ARRAY_RECORDS} ${fileName}`)
          return
        }

        this.searchables.push(new Searchable(records, file.name))
      } catch {
        Print(`${COULD_NOT_PARSE_FILE} ${fileName}`)
        return
      }
    })

    if (!this.searchables.length) {
      Print(NO_FILES_LOADED)
      process.exit(0)
    }
    Print(`Search files loaded`)
  }

  public PrintSearchableFiles() {
    const msg = this.searchables.reduce((message, searchable, index) => {
      return ` ${message} ${index + 1}) ${searchable.name}`
    }, 'Select')
    Print(msg)
  }

  public PrintSearchableFields() {
    this.searchables.forEach((searchable) => {
      searchable.PrintFields()
    })
  }
}
