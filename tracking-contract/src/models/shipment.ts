/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class ShippingUnit {

    @Property()
    public ID: string;

    @Property()
    public contentType: string;

    @Property()
    public packagingType: string;

    @Property()
    public transportMode: string;

    @Property()
    public entityType: string;

    constructor(args: Partial<ShippingUnit> = {}) {
        this.ID = args.ID;
        this.contentType = args.contentType;
        this.packagingType = args.packagingType;
        this.transportMode = args.transportMode;
        this.entityType = args.entityType;
    }

}
