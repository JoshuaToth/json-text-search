import { readFileSync, existsSync } from 'fs'
import { Entry, Field, Searchable } from './searchable'
import {
  ATTEMPTING_TO_LOAD,
  COULD_NOT_PARSE_FILE,
  FILE_DOES_NOT_EXIST,
  INVALID_FIELD,
  INVALID_OPTION,
  NOT_ARRAY_RECORDS,
  NO_FILES_LOADED,
} from './utils/consts'
import { Print } from './utils/printer'
import ReadLine from 'readline'

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

  public GetSearchableFilesMessage(): string {
    return this.searchables.reduce((message, searchable, index) => {
      return ` ${message} ${index + 1}) ${searchable.name}`
    }, 'Select')
  }

  public PrintSearchableFields() {
    this.searchables.forEach((searchable) => {
      searchable.PrintFields()
    })
  }

  public async FileQuestion(): Promise<Searchable> {
    let selectedOption: number = -1
    while (selectedOption < 0) {
      const rl = ReadLine.createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      selectedOption = await new Promise((res) =>
        rl.question(this.GetSearchableFilesMessage(), (answer) => {
          const option = parseInt(answer) - 1
          if (
            Number.isNaN(option) ||
            option < 0 ||
            option >= this.searchables.length
          ) {
            Print(INVALID_OPTION)
            res(-1)
          } else {
            res(option)
          }
        })
      )
    }
    return this.searchables[selectedOption]
  }

  public async FieldQuestion(file: Searchable): Promise<Field> {
    let selectedField = null
    while (selectedField === null) {
      const rl = ReadLine.createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      selectedField = await new Promise<Field | null>((res) =>
        rl.question('Enter search term', (answer) => {
          res(file.GetField(answer))
        })
      )
      if (selectedField === null) {
        Print(INVALID_FIELD)
      } else {
        return selectedField
      }
    }
  }

  public async SearchQuestion(
    file: Searchable,
    field: Field
  ): Promise<Entry[]> {
    const rl = ReadLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return await new Promise<Entry[]>((res) =>
      rl.question('Enter search value', (answer) => {
        res(file.SearchForValue(field, answer))
      })
    )
  }
}
