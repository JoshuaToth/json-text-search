import { LINE_BREAK } from './consts'

export enum DataType {
  SCALAR,
  ARRAY,
}

type DataMap = Record<string | number, number[]>
export type Field = { fieldName: string; type: DataType }
export type Entry = Record<string, any>

export class Searchable {
  private name: string
  private records: Entry[] = []
  private fields: Record<string, DataType> = {}
  private data: Record<string, DataMap> = {}

  // Possibly load record first?
  constructor(file: Record<string, any>[], name: string) {
    this.records = file
    this.name = name

    if (!this.records.length) return

    this.records.forEach((record, index) => {
      Object.keys(record).forEach((key) => {
        const isArray = Array.isArray(record[key])
        if (this.fields[key] === undefined) {
          this.fields[key] = isArray ? DataType.ARRAY : DataType.SCALAR
          this.data[key] = {}
        }

        if (!isArray) {
          AddValueIfMissing(key, index, this.data, record[key])
        } else {
          ;(record[key] as any[]).forEach((arrayVal) => {
            const arrayValue = `${key}-${arrayVal}`
            AddValueIfMissing(key, index, this.data, arrayValue)
          })
        }
      })
    })
  }

  public PrintFields() {
    console.log(`Search ${this.name} with`)
    Object.keys(this.fields).forEach((field) => {
      console.log(field)
    })
    console.log(LINE_BREAK)
  }

  public GetField(field: string): Field | null {
    return this.fields[field] !== undefined
      ? { fieldName: field, type: this.fields[field] }
      : null
  }

  public SearchForValue(field: Field, value: string): Entry[] {
    const indexes = this.data[field.fieldName][value]
    return indexes.map((index) => this.records[index])
  }
}

const AddValueIfMissing = (
  key: string,
  index: number,
  data: Record<string, DataMap>,
  value: string
) => {
  if (!data[key][value]) {
    data[key][value] = [index]
  } else {
    data[key][value].push(index)
  }
}
