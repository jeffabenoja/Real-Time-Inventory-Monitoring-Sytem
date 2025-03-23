import { useQuery } from "@tanstack/react-query";
import PageTitle from "../../components/common/utils/PageTitle";
import usePageTitle from "../../hooks/usePageTitle";
import {
  getPredictions,
  getThisWeeksPrediction,
} from "../../api/services/prediction";
import { fetchMultipleItemWithComponents } from "../../api/services/item";
import Spinner from "../../components/common/utils/Spinner";
import calculateComponentTotals from "../../utils/calculateComponentTotal";
import { getInventoryByCategory } from "../../api/services/inventory";
import mergeInventoryForecast from "../../utils/mergeInventoryForecast";
import Table from "../../components/common/table/Table";
import PredictionTableColumn from "../../components/common/PredictionTableColumn";

const fields = [
  { key: "name", label: "Item Name", classes: "capitalize" },
  { key: "currentStock", label: "Current Stock", classes: "uppercase" },
  { key: "forecast", label: "Forecast", classes: "uppercase" },
];

export default function Prediction() {
  usePageTitle("AI Stock Forecast");

  const { data: predictions, isFetching: fetchingPredictions } = useQuery({
    queryKey: ["Prediction"],
    queryFn: () => getPredictions(),
    refetchOnWindowFocus: false,
  });

  const { data: thisWeeksPrediction, isFetching: fetchingThisWeeksPrediction } =
    useQuery({
      queryKey: ["Week", "Prediction"],
      queryFn: () => getThisWeeksPrediction(),
      refetchOnWindowFocus: false,
    });

  const { data: inventory, isFetching: fetchingInventory } = useQuery({
    queryKey: ["Raw Mats", "Inventory"],
    queryFn: () => getInventoryByCategory("Raw Mats"),
    refetchOnWindowFocus: false,
  });

  const { data: itemWithComponents, isFetching: fetchingItemWithComponents } =
    useQuery({
      queryKey: ["Item", "Components", predictions],
      queryFn: () => {
        const itemIds = Object.keys(predictions || {});
        return fetchMultipleItemWithComponents(itemIds);
      },
      refetchOnWindowFocus: false,
      enabled: !!predictions,
    });

  let content = <Spinner />;

  let forecastedTotal;
  if (thisWeeksPrediction && itemWithComponents) {
    forecastedTotal = calculateComponentTotals(
      thisWeeksPrediction,
      itemWithComponents
    );
  }

  let mergedResult;
  if (inventory && forecastedTotal && Object.keys(forecastedTotal).length > 0) {
    mergedResult = mergeInventoryForecast(inventory, forecastedTotal);
  }

  const columns = PredictionTableColumn({
    fields,
  });

  if (
    !fetchingPredictions &&
    !fetchingThisWeeksPrediction &&
    !fetchingItemWithComponents &&
    !fetchingInventory &&
    mergedResult
  ) {
    content = (
      <Table
        data={mergedResult}
        columns={columns}
        search={true}
        withImport={false}
        withExport={false}
        add={false}
        view={false}
        apply={true}
      />
    );
  }

  return (
    <>
      <PageTitle>AI Stock Forecast</PageTitle>
      <p>
        Our AI forecast recommends the following raw material quantities for
        next week based on expected sales.
      </p>
      {content}
    </>
  );
}
