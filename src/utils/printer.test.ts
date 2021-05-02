import { Print } from './printer'

describe('Printer', () => {
  it('calls console.log on print', () => {
    jest.spyOn(global.console, 'log')
    Print('foo')

    expect(console.log).toHaveBeenCalledWith('foo')
  })
})
