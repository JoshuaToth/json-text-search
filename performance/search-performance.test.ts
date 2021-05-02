import { Searchable } from '../src/searchable'
import Chance from 'chance'

const GenerateRecords = (amount = 200): Record<string, any>[] => {
  const chance = new Chance()
  const records = []
  for (let i = 0; i < amount; i++) {
    records.push({
      _id: chance.integer(),
      name: chance.name(),
      pages: chance.integer(),
      description: chance.paragraph(),
      tags: [chance.word(), chance.word(), chance.word()],
    })
  }
  return records
}

describe('Loading Performance', () => {
  it('should be able to initialize with several hundred records', () => {
    const searchable = new Searchable(GenerateRecords(300), 'LOTR books')
    jest.spyOn(global.console, 'log')
    searchable.PrintFields()
    expect(console.log).toHaveBeenCalledWith('Search LOTR books with')
    expect(console.log).toHaveBeenCalledWith('name')
  })

  it('should be able to initialize with several thousand records', () => {
    const searchable = new Searchable(GenerateRecords(5000), 'LOTR books')
    jest.spyOn(global.console, 'log')
    searchable.PrintFields()
    expect(console.log).toHaveBeenCalledWith('Search LOTR books with')
    expect(console.log).toHaveBeenCalledWith('name')
  })

  it('should be able to initialize with several tens of thousands of records', () => {
    const searchable = new Searchable(GenerateRecords(40000), 'LOTR books')
    jest.spyOn(global.console, 'log')
    searchable.PrintFields()
    expect(console.log).toHaveBeenCalledWith('Search LOTR books with')
    expect(console.log).toHaveBeenCalledWith('name')
  })
})

describe('Search Performance', () => {
  it('should have similar search times between 10 and 50000 records for scalar values', () => {
    const smallRecords = GenerateRecords(10)
    const smallSearchable = new Searchable(smallRecords, 'LOTR books')
    const smallField = smallSearchable.GetField('name')

    const smallStartTime = Date.now()

    const smallResults = smallSearchable.SearchForValue(
      smallField,
      smallRecords[3].name
    )

    const smallFinishTime = Date.now()
    const smallTime = smallFinishTime - smallStartTime

    expect(smallResults.length).toBeGreaterThanOrEqual(1)
    expect(smallResults).toContain(smallRecords[3])

    const largeRecords = GenerateRecords(50000)
    const largeSearchable = new Searchable(largeRecords, 'LOTR books')
    const largeField = largeSearchable.GetField('name')

    const largeStartTime = Date.now()

    const largeResults = largeSearchable.SearchForValue(
      largeField,
      largeRecords[3001].name
    )

    const largeFinishTime = Date.now()
    const largeTime = largeFinishTime - largeStartTime

    expect(largeResults.length).toBeGreaterThanOrEqual(1)
    expect(largeResults).toContain(largeRecords[3001])
    expect(largeTime).toEqual(smallTime)
  })

  it('should have similar search times between 10 and 50000 records for array values', () => {
    const smallRecords = GenerateRecords(10)
    const smallSearchable = new Searchable(smallRecords, 'LOTR books')
    const smallField = smallSearchable.GetField('tags')

    const smallStartTime = Date.now()

    const smallResults = smallSearchable.SearchForValue(
      smallField,
      smallRecords[3].tags[2]
    )

    const smallFinishTime = Date.now()
    const smallTime = smallFinishTime - smallStartTime

    expect(smallResults.length).toBeGreaterThanOrEqual(1)
    expect(smallResults).toContain(smallRecords[3])

    const largeRecords = GenerateRecords(50000)
    const largeSearchable = new Searchable(largeRecords, 'LOTR books')
    const largeField = largeSearchable.GetField('tags')

    const largeStartTime = Date.now()

    const largeResults = largeSearchable.SearchForValue(
      largeField,
      largeRecords[3001].tags[2]
    )

    const largeFinishTime = Date.now()
    const largeTime = largeFinishTime - largeStartTime

    expect(largeResults.length).toBeGreaterThanOrEqual(1)
    expect(largeResults).toContain(largeRecords[3001])
    expect(largeTime).toEqual(smallTime)
  })
})
