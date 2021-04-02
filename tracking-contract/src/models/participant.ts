/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Participant {

    @Property()
    public ID: string;

    @Property()
    public role: string;

    constructor(args: Partial<Participant> = {}) {
        this.ID = args.ID;
        this.role = args.role;
    }

}
