/**
 * Day 05
 * Instructions: https://adventofcode.com/2022/day/5
 */
import path from 'path'
import { readFileLineByLine } from '../shared/utils'

const INSTRUCTIONS_LINK = 'https://adventofcode.com/2022/day/5'

export async function runPartOne() {
  const exampleInput = `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`
    .split('\n')
    .filter((v) => v)

  const filepath = path.join(__dirname, 'files/2022_day_5_input.txt')
  const lines = (await readFileLineByLine(filepath)).filter((v) => v)

  const { stack: stackExample, operations: operationsExample } =
    getStackAndOperations(exampleInput)
  const { stack, operations } = getStackAndOperations(lines)

  const example = solve(stackExample, operationsExample, true)
  const answer = solve(
    stack.filter((v) => v),
    operations,
    true,
  )

  return [example, answer]
}

export async function runPartTwo() {
  const exampleInput = `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`
    .split('\n')
    .filter((v) => v)

  const filepath = path.join(__dirname, 'files/2022_day_5_input.txt')
  const lines = (await readFileLineByLine(filepath)).filter((v) => v)

  const { stack: stackExample, operations: operationsExample } =
    getStackAndOperations(exampleInput)
  const { stack, operations } = getStackAndOperations(lines)

  const example = solve(stackExample, operationsExample, false)
  const answer = solve(
    stack.filter((v) => v),
    operations,
    false,
  )

  return [example, answer]
}

export async function day5_PartOne_2022() {
  console.info('***************************************************')
  console.info('Advent of Code: Day 5 of 2022 (Part #1)')
  console.info(`Instruction @: ${INSTRUCTIONS_LINK}`)

  const [example, answer] = await runPartOne()

  console.info('Total Example Score:', example)
  console.info('Total Answer Score:', answer)
}

export async function day5_PartTwo_2022() {
  console.info('---------------------------------------------------')
  console.info('Advent of Code: Day 5 of 2022 (Part #2)')
  console.info(`Instruction @: ${INSTRUCTIONS_LINK}`)

  const [example, answer] = await runPartTwo()

  console.info('Total Example Score:', example)
  console.info('Total Answer Score:', answer)
}

function getStackAndOperations(arr: string[]) {
  const { stack, moves } = arr.reduce(
    (memo, current) => {
      if (current.includes('move')) {
        memo.moves.push(current)
        return memo
      }

      if (current.includes('1')) {
        return memo
      }

      const lineChars = current.split('')

      for (let i = 0; i < lineChars.length; i++) {
        const value = lineChars[i]

        if (value && value !== ' ') {
          const cargo = `${lineChars[i]}${lineChars[i + 1]}${lineChars[i + 2]}`
          const stackIndex = Math.floor((i + 3) / 3 - 1)

          if (!memo.stack[stackIndex]) {
            memo.stack[stackIndex] = []
          }

          memo.stack[stackIndex].unshift(cargo)

          i += 2
        }
      }

      return memo
    },
    { stack: [], moves: [] } as {
      stack: string[][]
      moves: string[]
    },
  )

  const operations = moves.reduce((memo, current) => {
    const [amount, from, to] = current
      .split(' ')
      .filter((v) => !isNaN(Number(v)))
      .map((v) => +v)

    memo.push({ amount, from, to })
    return memo
  }, [] as { amount: number; from: number; to: number }[])

  return { stack, operations }
}

function solve(
  stack: string[][],
  operations: { amount: number; from: number; to: number }[],
  reverse = true,
) {
  const currentStack: string[][] = JSON.parse(JSON.stringify(stack))

  for (let i = 0; i < operations.length; i++) {
    const { amount, from, to } = operations[i]

    const itemsToMove = currentStack[from - 1].splice(
      currentStack[from - 1].length - amount,
    )

    reverse
      ? currentStack[to - 1].push(...itemsToMove.reverse())
      : currentStack[to - 1].push(...itemsToMove)
  }

  return currentStack
    .filter((v) => v && v.length)
    .map((v) => `${v.pop()}`)
    .join('')
    .replace(/\[/g, '')
    .replace(/]/g, '')
}
