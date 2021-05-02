import fs from 'fs'
import {
  COULD_NOT_PARSE_FILE,
  FILE_DOES_NOT_EXIST,
  NOT_ARRAY_RECORDS,
} from './consts'

jest.mock('fs')

import { Main } from './main'
import {
  MockFileLocations,
  MockLotRBooks,
  MockMatrixMovies,
} from './_test_utils_/mockRecords'

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
    main.PrintSearchableFiles()

    expect(global.process.exit).not.toHaveBeenCalled()

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(MockFileLocations[0].name)
    )

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(MockFileLocations[1].name)
    )
  })

  it('registers fields to be searched', () => {
    mockReadFiles()

    const main = new Main(MockFileLocations)
    main.PrintSearchableFields()

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(MockFileLocations[0].name)
    )

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(MockFileLocations[1].name)
    )

    expect(console.log).toHaveBeenCalledWith(Object.keys(MockLotRBooks[0])[0])
    expect(console.log).toHaveBeenCalledWith(Object.keys(MockLotRBooks[0])[1])
    expect(console.log).toHaveBeenCalledWith(Object.keys(MockLotRBooks[0])[2])

    expect(console.log).toHaveBeenCalledWith(
      Object.keys(MockMatrixMovies[0])[0]
    )
    expect(console.log).toHaveBeenCalledWith(
      Object.keys(MockMatrixMovies[0])[1]
    )
    expect(console.log).toHaveBeenCalledWith(
      Object.keys(MockMatrixMovies[0])[2]
    )

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(MockFileLocations[1].name)
    )
  })

  it("prints out a bad file if it doesn't exist", () => {
    fs.existsSync = jest.fn().mockReturnValue(false)
    new Main([{ fileName: 'starTrek.json', name: 'Star Trek Files' }])

    expect(console.log).toHaveBeenCalledWith(
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

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(NOT_ARRAY_RECORDS)
    )
  })

  it('prints out a bad file if fails to jsonify it', () => {
    fs.readFileSync = jest
      .fn()
      .mockReturnValueOnce(Buffer.from('lol this isnt even json'))

    new Main([{ fileName: 'starTrek.json', name: 'Star Trek Files' }])

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(COULD_NOT_PARSE_FILE)
    )
  })
})
