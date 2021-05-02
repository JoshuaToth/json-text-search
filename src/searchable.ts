import { EMPTY_STRING, LINE_BREAK } from './utils/consts'
import { Print } from './utils/printer'

export enum DataType {
  SCALAR,
  ARRAY,
}

type DataMap = Record<string | number, number[]>
export type Field = { fieldName: string; type: DataType }
export type Entry = Record<string, any>

export class Searchable {
  public readonly name: string
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
            const arrayValue = CreateArrayValue(key, arrayVal)
            AddValueIfMissing(key, index, this.data, arrayValue)
          })
        }
      })
    })
  }

  public PrintFields() {
    Print(`Search ${this.name} with`)
    Object.keys(this.fields).forEach((field) => {
      Print(field)
    })
    Print(LINE_BREAK)
  }

  public GetField(field: string): Field | null {
    return this.fields[field] !== undefined
      ? { fieldName: field, type: this.fields[field] }
      : null
  }

  public SearchForValue(field: Field, value: string): Entry[] {
    let searchValueKey =
      field.type === DataType.SCALAR
        ? value
        : CreateArrayValue(field.fieldName, value)
    searchValueKey = replaceEmptyValue(searchValueKey)
    const indexes = this.data[field.fieldName][searchValueKey] ?? []
    return indexes.map((index) => this.records[index])
  }
}

const AddValueIfMissing = (
  key: string,
  index: number,
  data: Record<string, DataMap>,
  value: string
) => {
  const nonEmptyValue = replaceEmptyValue(value)
  if (!data[key][nonEmptyValue]) {
    data[key][nonEmptyValue] = [index]
  } else {
    data[key][nonEmptyValue].push(index)
  }
}

const CreateArrayValue = (key: string, value: any) => `${key}-${value}`
const replaceEmptyValue = (value: any) => (value === '' ? EMPTY_STRING : value)
