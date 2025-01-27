export interface ItemType {
  code: string
  description: string
  category: "Raw Mats" | "Finished Goods" | ""
  brand: string
  unit: string
  reorderPoint?: number
  price?: number
  cost?: number
  status?: "ACTIVE" | "INACTIVE"
}

export interface ComponentsMaterials {
  rawMaterial: ItemType
  quantity?: string
}

export interface ProductWithComponents {
  finishProduct: ItemType
  components: ComponentsMaterials[]
}
