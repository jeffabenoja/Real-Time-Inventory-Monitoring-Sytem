interface Prediction {
    date: string;
    prediction: number;
  }
  
  interface FinishedProduct {
    id: number;
    description: string;
    price: number;
    cost: number;
    averageCost: number;
  }
  
  interface Component {
    id: number;
    description: string;
    price: number;
    cost: number;
    averageCost: number;
    status: string;
    quantity: number;  // per finished product
    unit: string;
  }
  
  interface Recipe {
    finishedProduct: FinishedProduct;
    components: Component[];
  }
  
  interface AggregatedComponent {
    // Option: change value to string if you want to store the fixed decimal as a string.
    // If you prefer to keep it as a number, then note that numbers don't preserve trailing zeros.
    forecast: number;
    label: string;
    id: number;
  }
  
  type PredictionsInput = { [id: string]: string | Prediction };
  type Recipes = { [id: string]: Recipe };
  type AggregatedComponents = { [component: string]: AggregatedComponent };
  
  // Type guard to check if a value is a Prediction.
  function isPrediction(value: any): value is Prediction {
    return typeof value === 'object' && value !== null && typeof value.prediction === 'number';
  }
  
 export default function calculateComponentTotals(
    predictions: PredictionsInput,
    recipes: Recipes
  ): AggregatedComponents {
    const totalComponents: AggregatedComponents = {};
  
    // Iterate over each prediction key.
    for (const id in predictions) {
      const predValue = predictions[id];
      if (!isPrediction(predValue)) {
        continue;
      }
      const predictedCount = predValue.prediction;
      const recipe = recipes[id];
  
      if (recipe && recipe.components) {
        recipe.components.forEach((component: Component) => {
          const requiredAmount = predictedCount * component.quantity;
          if (totalComponents[component.description]) {
            // Accumulate the required amount.
            // Convert the current value back to a number for calculations.
            const currentTotal = totalComponents[component.description].forecast
            totalComponents[component.description].forecast = +(currentTotal + requiredAmount).toFixed(2);
          } else {
            totalComponents[component.description] = {
              id: component.id,
              forecast: +requiredAmount.toFixed(2), // Convert directly to fixed 2 decimals string.
              label: component.unit,
            };
          }
        });
      }
    }
  
    return totalComponents;
  }