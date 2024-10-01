import { useCookies } from 'react-cookie';
import { getAllProductCategories } from './product/productCategories';
import { getAllOperations } from './product/productOperation';
import { getAllProducts } from './product/productType';
import { getAllProductTypeOperations } from './product/productTypeOperation';
import { databaseTables } from '../../shared/constants/databaseTables';


export async function fetchDatabaseParam(param: string, token: string): Promise<any> {
  switch (param) {
    case databaseTables.products.singularName:
      return (await getAllProducts(1)).data;
    case databaseTables.operations.singularName:
      return (await getAllOperations(1, token)).data;
    case databaseTables.productCategories.singularName:
      return (await getAllProductCategories(token)).data;
  }
}
