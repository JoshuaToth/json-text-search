import { readFileSync, existsSync } from 'fs'
import { Searchable } from './searchable'
import {
  ATTEMPTING_TO_LOAD,
  COULD_NOT_PARSE_FILE,
  FILE_DOES_NOT_EXIST,
  NOT_ARRAY_RECORDS,
} from './consts'

export class Main {
  private searchables: Searchable[] = []

  constructor(files: { fileName: string; name: string }[]) {
    console.log(`Loading search files`)
    files.forEach((file) => {
      const fileName = `./content/${file.fileName}`
      console.log(`${ATTEMPTING_TO_LOAD} ${fileName}`)

      if (!existsSync(fileName)) {
        console.log(`${FILE_DOES_NOT_EXIST} ${fileName}`)
        return
      }

      try {
        const recordBuffer = readFileSync(fileName)
        const records = JSON.parse(recordBuffer.toString())
        if (!Array.isArray(records)) {
          console.log(`${NOT_ARRAY_RECORDS} ${fileName}`)
          return
        }

        this.searchables.push(new Searchable(records, file.name))
      } catch {
        console.log(`${COULD_NOT_PARSE_FILE} ${fileName}`)
        return
      }
    })

    console.log(`Search files loaded`)
  }
}
