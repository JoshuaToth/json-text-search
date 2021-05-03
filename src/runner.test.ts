import Printer from './utils/printer'
import { Run } from './runner'
import ReadLine from 'readline'
import FileSearcher from './file-searcher'

jest.mock('readline')
jest.mock('./utils/printer')
jest.mock('fs')
jest.mock('./file-searcher')

const GetSearchableFilesMessage = jest.fn()
const PrintSearchableFields = jest.fn()
const FileQuestion = jest.fn()
const FieldQuestion = jest.fn()
const SearchQuestion = jest.fn()

describe('Runner', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    //@ts-ignore
    global.process.exit = jest.fn().mockImplementation((code?: number) => {})

    Printer.Print = jest.fn()
    ;(FileSearcher as jest.Mock<FileSearcher>).mockImplementation(
      () =>
        ({
          GetSearchableFilesMessage,
          PrintSearchableFields,
          FileQuestion,
          FieldQuestion,
          SearchQuestion,
          searchables: [],
        } as any)
    )
  })

  it('runs correctly with mocks', async () => {
    ReadLine.createInterface = jest
      .fn()
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) => callback('2'),
        close: jest.fn(),
      })
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) => callback('foo'),
        close: jest.fn(),
      })
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) => callback('1'),
        close: jest.fn(),
      })
      .mockReturnValueOnce({
        question: (_: any, callback: (arg: string) => void) => callback('quit'),
        close: jest.fn(),
      })
    await Run()
    expect(PrintSearchableFields).toHaveBeenCalledTimes(1)
    expect(FileQuestion).toHaveBeenCalledTimes(1)
    expect(FieldQuestion).toHaveBeenCalledTimes(1)
    expect(SearchQuestion).toHaveBeenCalledTimes(1)
  })
})
