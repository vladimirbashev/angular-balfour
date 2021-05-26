import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeScreenComponent } from './screens/home-screen.component';

@NgModule({
    declarations: [HomeScreenComponent],
    imports: [
        HomeRoutingModule,
    ]
})
export class HomeModule {}
