import { Participant } from './event-participant';
/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class TrackableEvent {

    @Property()
    public ID: string;

    @Property()
    public name: string;

    @Property()
    public trackableEntityID: string;

    @Property()
    public performedTime: string;

    @Property()
    public participants: string;

    constructor(args: Partial<TrackableEvent> = {}) {
        this.ID = args.ID;
        this.name = args.name;
        this.trackableEntityID = args.trackableEntityID;
        this.performedTime = args.performedTime;
        this.participants = args.participants;
    }

}
