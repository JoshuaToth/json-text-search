import fs from 'fs'
import {
  COULD_NOT_PARSE_FILE,
  FILE_DOES_NOT_EXIST,
  INVALID_FIELD,
  INVALID_OPTION,
  NOT_ARRAY_RECORDS,
} from './utils/consts'

import { Main } from './main'
import {
  MockFileLocations,
  MockLotRBooks,
  MockMatrixMovies,
} from './_test_utils_/mockRecords'
import Printer, { Print } from './utils/printer'
import ReadLine from 'readline'

jest.mock('readline')
jest.mock('fs')
jest.mock('./utils/printer')

const mockReadFiles = () =>
  (fs.readFileSync = jest
    .fn()
    .mockReturnValueOnce(Buffer.from(JSON.stringify(MockLotRBooks)))
    .mockReturnValueOnce(Buffer.from(JSON.stringify(MockMatrixMovies))))

describe('Main', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    //@ts-ignore
    global.process.exit = jest.fn().mockImplementation((code?: number) => {})
    fs.existsSync = jest.fn().mockReturnValue(true)

    Printer.Print = jest.fn()

    jest.spyOn(global.console, 'log')
  })

  it('can initialize with no files', () => {
    const main = new Main([])
    expect(main).toBeDefined()
    expect(global.process.exit).toHaveBeenCalledTimes(1)
  })

  it('can initialize with mock files', () => {
    mockReadFiles()

    const main = new Main(MockFileLocations)
    expect(main).toBeDefined()
    const message = main.GetSearchableFilesMessage()

    expect(global.process.exit).not.toHaveBeenCalled()

    expect(message).toContain(MockFileLocations[0].name)

    expect(message).toContain(MockFileLocations[1].name)
  })

  it('registers fields to be searched', () => {
    mockReadFiles()

    const main = new Main(MockFileLocations)
    main.PrintSearchableFields()

    expect(Print).toHaveBeenCalledWith(
      expect.stringContaining(MockFileLocations[0].name)
    )

    expect(Print).toHaveBeenCalledWith(
      expect.stringContaining(MockFileLocations[1].name)
    )

    expect(Print).toHaveBeenCalledWith(Object.keys(MockLotRBooks[0])[0])
    expect(Print).toHaveBeenCalledWith(Object.keys(MockLotRBooks[0])[1])
    expect(Print).toHaveBeenCalledWith(Object.keys(MockLotRBooks[0])[2])

    expect(Print).toHaveBeenCalledWith(Object.keys(MockMatrixMovies[0])[0])
    expect(Print).toHaveBeenCalledWith(Object.keys(MockMatrixMovies[0])[1])
    expect(Print).toHaveBeenCalledWith(Object.keys(MockMatrixMovies[0])[2])

    expect(Print).toHaveBeenCalledWith(
      expect.stringContaining(MockFileLocations[1].name)
    )
  })

  it("prints out a bad file if it doesn't exist", () => {
    fs.existsSync = jest.fn().mockReturnValue(false)
    new Main([{ fileName: 'starTrek.json', name: 'Star Trek Files' }])

    expect(Print).toHaveBeenCalledWith(
      expect.stringContaining(FILE_DOES_NOT_EXIST)
    )
  })

  it('prints out a bad file if it is formatted incorrectly', () => {
    fs.readFileSync = jest
      .fn()
      .mockReturnValueOnce(
        Buffer.from(JSON.stringify({ bad: 'wont parse as array' }))
      )

    new Main([{ fileName: 'starTrek.json', name: 'Star Trek Files' }])

    expect(Print).toHaveBeenCalledWith(
      expect.stringContaining(NOT_ARRAY_RECORDS)
    )
  })

  it('prints out a bad file if fails to jsonify it', () => {
    fs.readFileSync = jest
      .fn()
      .mockReturnValueOnce(Buffer.from('lol this isnt even json'))

    new Main([{ fileName: 'starTrek.json', name: 'Star Trek Files' }])

    expect(Print).toHaveBeenCalledWith(
      expect.stringContaining(COULD_NOT_PARSE_FILE)
    )
  })

  it('returns the expected file searchable when a file index is used', async () => {
    mockReadFiles()

    ReadLine.createInterface = jest.fn().mockReturnValue({
      question: (_: any, callback: (arg: string) => void) => callback('1'),
      close: jest.fn(),
    })

    const main = new Main(MockFileLocations)

    const searchable = await main.FileQuestion()

    expect(searchable).toBeDefined()
  })

  it('asks for the correct option if a bad file index is passed in', async () => {
    mockReadFiles()

    ReadLine.createInterface = jest
      .fn()
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) => callback('-1'),
        close: jest.fn(),
      })
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) => callback('f'),
        close: jest.fn(),
      })
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) => callback(''),
        close: jest.fn(),
      })
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) => callback('1'),
        close: jest.fn(),
      })

    const main = new Main(MockFileLocations)

    const searchable = await main.FileQuestion()

    expect(searchable).toBeDefined()
    expect(Print).toHaveBeenCalledWith(INVALID_OPTION)
  })

  it('returns the expected field when a correct fieldName is used', async () => {
    mockReadFiles()

    ReadLine.createInterface = jest
      .fn()
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) => callback('2'),
        close: jest.fn(),
      })
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) =>
          callback(Object.keys(MockMatrixMovies[0])[1]),
        close: jest.fn(),
      })

    const main = new Main(MockFileLocations)

    const searchable = await main.FileQuestion()
    const field = await main.FieldQuestion(searchable)

    expect(field).toBeDefined()
  })

  it('will prompt the user to enter a valid field if an invalid field is entered', async () => {
    mockReadFiles()

    ReadLine.createInterface = jest
      .fn()
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) => callback('2'),
        close: jest.fn(),
      })
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) =>
          callback('boogie nights'),
        close: jest.fn(),
      })
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) =>
          callback(Object.keys(MockMatrixMovies[0])[1]),
        close: jest.fn(),
      })

    const main = new Main(MockFileLocations)

    const searchable = await main.FileQuestion()
    const field = await main.FieldQuestion(searchable)

    expect(field).toBeDefined()
    expect(Print).toHaveBeenCalledWith(INVALID_FIELD)
  })

  it('returns matching records when a valid search term is used', async () => {
    mockReadFiles()

    ReadLine.createInterface = jest
      .fn()
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) => callback('2'),
        close: jest.fn(),
      })
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) =>
          callback(Object.keys(MockMatrixMovies[0])[1]),
        close: jest.fn(),
      })
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) =>
          callback(MockMatrixMovies[0].title),
        close: jest.fn(),
      })

    const main = new Main(MockFileLocations)

    const searchable = await main.FileQuestion()
    const field = await main.FieldQuestion(searchable)
    const searchResults = await main.SearchQuestion(searchable, field)

    expect(searchResults).toHaveLength(1)
    expect(searchResults[0]).toEqual(MockMatrixMovies[0])
  })
})
