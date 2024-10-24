import { getAllProductCategories } from "../api/product/productCategories";
import { getAllOperations } from "../api/product/productOperation";
import { getAllProducts } from "../api/product/productType";
import { databaseTables } from "../../shared/constants/databaseTables";

export async function fetchDatabaseParam(
  param: string,
  token: string,
  productCategoryId: number
): Promise<any> {
  switch (param) {
    case databaseTables.products.path:
      return (await getAllProducts(productCategoryId, token)).data;
    case databaseTables.operations.path:
      return (await getAllOperations(1, token)).data;
    case databaseTables.productCategories.path:
      return (await getAllProductCategories(token)).data;
  }
}
