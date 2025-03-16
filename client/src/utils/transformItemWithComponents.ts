// Define interfaces for the fetched data
interface RawMaterial {
  id: number;
  code: string;
  description: string;
  category: string;
  brand: string;
  unit: string;
  reorderPoint: number;
  price: number;
  cost: number;
  averageCost: number;
  status: string;
}

interface Component {
  rawMaterial: RawMaterial;
  quantity: number;
}

interface FinishProduct {
  id: number;
  code: string;
  description: string;
  category: string;
  brand: string;
  unit: string;
  reorderPoint: number;
  price: number;
  cost: number;
  averageCost: number;
  status: string;
}

export interface FetchedItem {
  finishProduct: FinishProduct;
  components: Component[];
  status: string;
}

// Define an interface for the transformed item
export interface TransformedItem {
  finishedProduct: {
    id: number;
    description: string;
    price: number;
    cost: number;
    averageCost: number;
  };
  components: {
    id: number;
    description: string;
    price: number;
    cost: number;
    averageCost: number;
    status: string;
  }[];
}

export default function transformItemWithComponents(
  item: FetchedItem
): TransformedItem | null {
  if (!item || !item.finishProduct || !item.components) return null;

  const transformedFinishProduct = {
    id: item.finishProduct.id,
    description: item.finishProduct.description,
    price: item.finishProduct.price,
    cost: item.finishProduct.cost,
    averageCost: item.finishProduct.averageCost,
  };

  const transformedComponents = item.components.map((component) => ({
    id: component.rawMaterial.id,
    description: component.rawMaterial.description,
    price: component.rawMaterial.price,
    cost: component.rawMaterial.cost,
    averageCost: component.rawMaterial.averageCost,
    status: component.rawMaterial.status,
  }));

  return {
    finishedProduct: transformedFinishProduct,
    components: transformedComponents,
  };
}
