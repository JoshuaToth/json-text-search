import { ReadLine } from 'readline'
import { Print } from './printer'

export const ExitIfQuit = (answer: string, rl?: ReadLine) => {
  if (answer === 'quit') {
    Print('Shutting down')
    rl?.close()
    process.exit(0)
  }
}

export default {
  ExitIfQuit,
}
