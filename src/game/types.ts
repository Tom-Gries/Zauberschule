export type FoodKind =
  | 'apple'
  | 'cheese'
  | 'carrot'
  | 'fish'
  | 'berries'
  | 'donut'
  | 'broccoli'
  | 'strawberry'
  | 'mushroom'
  | 'sweet'
export type Food = {
  id: number
  kind: FoodKind
  value: number
  isGold: boolean
}
export type Operation = 'addition' | 'subtraction'
export type Problem =
  | { kind: 'pair'; operation: Operation; target: number }
  | {
      kind: 'single'
      operation: Operation
      fixed: number
      target: number
      missing: 'left' | 'right'
    }
export const foodKinds: FoodKind[] = [
  'apple',
  'cheese',
  'carrot',
  'fish',
  'berries',
  'donut',
  'broccoli',
  'strawberry',
  'mushroom',
  'sweet',
]
export const foodEmoji: Record<FoodKind, string> = {
  apple: '🍎',
  cheese: '🧀',
  carrot: '🥕',
  fish: '🐟',
  berries: '🍇',
  donut: '🍩',
  broccoli: '🥦',
  strawberry: '🍓',
  mushroom: '🍄',
  sweet: '🍬',
}
export const foodName: Record<FoodKind, string> = {
  apple: 'Apfel',
  cheese: 'Käse',
  carrot: 'Karotte',
  fish: 'Fisch',
  berries: 'Beeren',
  donut: 'Donut',
  broccoli: 'Brokkoli',
  strawberry: 'Erdbeere',
  mushroom: 'Zauberpilz',
  sweet: 'Bonbon',
}
