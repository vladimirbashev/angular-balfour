import { APP_INITIALIZER } from '@angular/core';

import { mockCustomerOrdersProvider } from './customer-orders/index';
import { mockCustomersProvider } from './customers/index';
import { mockInit, MockInitService } from './init.service';
import { mockOrganizationsProvider } from './organizations/index';
import { mockVendorOrdersProvider } from './vendor-orders/index';

export const mockProviders = [
    mockCustomerOrdersProvider,
    mockOrganizationsProvider,
    mockCustomersProvider,
    mockVendorOrdersProvider,
];
export const mockServices = [
    MockInitService,
    {
        provide: APP_INITIALIZER,
        useFactory: mockInit,
        multi: true,
        deps: [MockInitService]
    },
];

export const mockProvidersAndServices = [
    ...mockProviders,
    ...mockServices
];

//#region exports/providers
export * from './mock-storage';
export * from './storage';
export * from './customer-orders/index';
export * from './organizations/index';
export * from './customers/index';
export * from './vendor-orders/index';
//#endregion
