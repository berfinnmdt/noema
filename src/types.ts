export type ExploreKind = 'fikir' | 'metin' | 'sanat' | 'egzersiz'

export type ExploreCategory =
  | 'felsefe'
  | 'sanat'
  | 'teknoloji'
  | 'doga'
  | 'toplum'
  | 'ilim'

export type CardSize = 'md' | 'wide' | 'narrow' | 'full'

export interface ExploreItem {
  id: string
  kind: ExploreKind
  category: ExploreCategory
  title: string
  excerpt: string
  body: string
  author: string
  tags: string[]
  size: CardSize
}

export interface Note {
  id: string
  title: string
  body: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type IdeaMode = 'fikir' | 'soru' | 'egzersiz'
