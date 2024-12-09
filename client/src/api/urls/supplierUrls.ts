const API = "/api"

// Supplier API
export const SUPPLIER_POST = `${API}/v1/supplier`
export const SUPPLIER_LIST = `${API}/v1/supplierList`
export const SUPPLIER = (supplierCode: String) =>
  `${API}/v1/supplier?code=${supplierCode}`
