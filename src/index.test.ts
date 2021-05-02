import { main } from './index'

describe('smoke test hello world', () => {
  it('main returns 1', () => {
    const result = main()
    expect(result).toBe(1)
  })
})
