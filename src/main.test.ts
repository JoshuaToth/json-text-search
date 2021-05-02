import fs from 'fs'

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
  })

  it('can initialize with no files', () => {
    const main = new Main([])
    expect(main).toBeDefined()
    expect(global.process.exit).toHaveBeenCalledTimes(1)
  })

  it('can initialize with mock files', () => {
    jest.spyOn(global.console, 'log')

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
    jest.spyOn(global.console, 'log')

    mockReadFiles()

    const main = new Main(MockFileLocations)
    expect(main).toBeDefined()
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
})
