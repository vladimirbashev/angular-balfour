import { NgModule } from '@angular/core';

import { ProductsDataService } from './services/products.data.service';

@NgModule({
    providers: [ProductsDataService]
})
export class ProductsModule { }
