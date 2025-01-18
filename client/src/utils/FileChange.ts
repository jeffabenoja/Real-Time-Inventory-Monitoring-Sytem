import Papa from "papaparse";

export const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>
): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: function (result) {
          try {
            // Assert that result.data is an array of objects
            const data = result.data as Record<string, any>[];

            const colArr: string[] = Object.keys(data[0]);
            const valArr: any[] = data.map((dataRow) => Object.values(dataRow));

            // Combine columns and values into a single array of objects
            const combinedData = valArr
              .map((values) => {
                const rowObject: { [key: string]: any } = {};
                colArr.forEach((col, idx) => {
                  rowObject[col] = values[idx];
                });
                return rowObject;
              })
              .filter((row) => {
                return Object.values(row).some(
                  (value) => value !== undefined && value !== ""
                );
              });

            resolve(combinedData);
          } catch (error) {
            reject(error);
          }
        },
        error: function (error) {
          reject(error);
        },
      });
    } else {
      reject(new Error("No file selected"));
    }
  });
};
