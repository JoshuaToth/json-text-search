import { DataType, Searchable } from './searchable'
import { LINE_BREAK } from './consts'

const DefaultObject = [
  {
    name: 'Fellowship of the Ring',
    pages: 1253,
    authors: ['J. R. R. Tolkien'],
  },
  {
    name: 'The Two Towers',
    pages: 3215,
    authors: ['J. R. R. Tolkien', 'Michael Horton'],
  },
  {
    name: 'Return of the King',
    pages: 1253,
    authors: ['J. R. R. Tolkien'],
  },
]

describe('Searchable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with a basic object', () => {
    const searchable = new Searchable(DefaultObject, 'LOTR books')
    jest.spyOn(global.console, 'log')
    searchable.PrintFields()
    expect(console.log).toHaveBeenCalledWith('Search LOTR books with')
    expect(console.log).toHaveBeenCalledWith('name')
  })

  it('initializes with an empty object', () => {
    const searchable = new Searchable([], 'GOT final book characters')
    jest.spyOn(global.console, 'log')
    searchable.PrintFields()
    expect(console.log).not.toHaveBeenCalledWith('name')
    expect(console.log).toHaveBeenCalledWith(LINE_BREAK)
  })

  it('can retrieve the correct type of field that exists', () => {
    const searchable = new Searchable(DefaultObject, 'LOTR books')

    const stringField = searchable.GetField('name')
    expect(stringField.type).toBe(DataType.SCALAR)

    const numberField = searchable.GetField('pages')
    expect(numberField.type).toBe(DataType.SCALAR)

    const arrayField = searchable.GetField('authors')
    expect(arrayField.type).toBe(DataType.ARRAY)
  })

  it('will return a null datatype for a bad field name', () => {
    const searchable = new Searchable(DefaultObject, 'LOTR books')
    const field = searchable.GetField('movieTitle')
    expect(field).toBeNull()
  })

  it('will return the records for a valid field and value', () => {
    const searchable = new Searchable(DefaultObject, 'LOTR books')
    const field = searchable.GetField('pages')
    const records = searchable.SearchForValue(
      field,
      DefaultObject[0].pages.toString()
    )
    expect(records).toHaveLength(2)
    expect(records[0]).toStrictEqual(DefaultObject[0])
    expect(records[1]).toStrictEqual(DefaultObject[2])
  })

  it('can search for a tag value within a field', () => {
    const searchable = new Searchable(DefaultObject, 'LOTR books')
    const field = searchable.GetField('authors')
    const records = searchable.SearchForValue(
      field,
      DefaultObject[1].authors[1]
    )
    expect(records).toHaveLength(1)
    expect(records[0]).toStrictEqual(DefaultObject[1])
  })
})
