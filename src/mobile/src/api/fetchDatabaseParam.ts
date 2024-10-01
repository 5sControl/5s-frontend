import { getAllProductCategories } from './product/productCategories';
import { getAllOperations } from './product/productOperation';
import { getAllProducts } from './product/productType';
import { getAllProductTypeOperations } from './product/productTypeOperation';

export async function fetchDatabaseParam(param: string): Promise<any> {
  switch (param) {
    case 'product':
      return (await getAllProducts(1)).data;
    case 'operation':
      return (await getAllOperations(1)).data;
    case 'productCategories':
      return (await getAllProductCategories()).data;
  }
}
