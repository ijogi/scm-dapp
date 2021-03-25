/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class TrackableEntity {

    @Property()
    public ID: string;

    @Property()
    public name: string;

    @Property()
    public contentType: string;

    @Property()
    public contents: string;

    constructor(args: Partial<TrackableEntity> = {}) {
        this.ID = args.ID;
        this.name = args.name;
        this.contentType = args.contentType;
        this.contents = args.contents;
    }

}
