/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Participant } from './models/participant';
import { SHIPMENT_STATUS } from './models/shipment-status';
import { TrackableEvent } from './models/trackable-event';
import { exists, iterateOverResults } from './utils/utility-functions';

@Info({title: 'TrackableEventContract', description: 'My Smart Contract' })
export class TrackableEventContract extends Contract {

    @Transaction()
    public async registerPickup(
        ctx: Context,
        id: string,
        trackableEntityID: string,
        performedTime: string,
        participants: string
    ) {
        const data = await ctx.stub.getState(id);
        const previousEvent = exists(data) ? JSON.parse(data.toString()) : false;

        if (previousEvent && previousEvent.name !== SHIPMENT_STATUS.PICKUP) {
            throw new Error(`Unable to initiate flow. The trackable event ${id} has invalid state ${previousEvent.name}`);
        }

        const trackableEvent = await this.createTrackableEvent(
            ctx, id, SHIPMENT_STATUS.PICKUP, trackableEntityID, performedTime, participants
        );

        ctx.stub.setEvent(SHIPMENT_STATUS.PICKUP, trackableEvent);
    }

    @Transaction()
    public async registerInboundTransit(
        ctx: Context,
        id: string,
        trackableEntityID: string,
        performedTime: string,
        participants: string
    ) {
        const validStates = [SHIPMENT_STATUS.IN_TRANSIT, SHIPMENT_STATUS.PICKUP];

        await this.verifyPreviousEventState(ctx, id, SHIPMENT_STATUS.IN_TRANSIT, validStates);
        const trackableEvent = await this.createTrackableEvent(
            ctx, id, SHIPMENT_STATUS.IN_TRANSIT, trackableEntityID, performedTime, participants
        );

        ctx.stub.setEvent(SHIPMENT_STATUS.IN_TRANSIT, trackableEvent);
    }

    @Transaction()
    public async registerArrivalToProcessingCenter(
        ctx: Context,
        id: string,
        trackableEntityID: string,
        performedTime: string,
        participants: string
    ) {
        const validStates = [SHIPMENT_STATUS.IN_TRANSIT, SHIPMENT_STATUS.AT_LOGISTICS_CENTER];

        await this.verifyPreviousEventState(ctx, id, SHIPMENT_STATUS.AT_LOGISTICS_CENTER, validStates);
        const trackableEvent = await this.createTrackableEvent(
            ctx, id, SHIPMENT_STATUS.AT_LOGISTICS_CENTER, trackableEntityID, performedTime, participants
        );

        ctx.stub.setEvent(SHIPMENT_STATUS.AT_LOGISTICS_CENTER, trackableEvent);
    }

    @Transaction()
    public async registerOutboundTransit(
        ctx: Context,
        id: string,
        trackableEntityID: string,
        performedTime: string,
        participants: string
    ) {
        const validStates = [SHIPMENT_STATUS.AT_LOGISTICS_CENTER, SHIPMENT_STATUS.OUT_FOR_DELIVERY];

        await this.verifyPreviousEventState(ctx, id, SHIPMENT_STATUS.OUT_FOR_DELIVERY, validStates);
        const trackableEvent = await this.createTrackableEvent(
            ctx, id, SHIPMENT_STATUS.OUT_FOR_DELIVERY, trackableEntityID, performedTime, participants
        );

        ctx.stub.setEvent(SHIPMENT_STATUS.OUT_FOR_DELIVERY, trackableEvent);
    }

    @Transaction()
    public async registerDelivery(
        ctx: Context,
        id: string,
        trackableEntityID: string,
        performedTime: string,
        participants: string
    ) {
        await this.verifyPreviousEventState(ctx, id, SHIPMENT_STATUS.DELIVERED, [SHIPMENT_STATUS.OUT_FOR_DELIVERY]);
        const trackableEvent = await this.createTrackableEvent(
            ctx, id, SHIPMENT_STATUS.DELIVERED, trackableEntityID, performedTime, participants
        );

        ctx.stub.setEvent(SHIPMENT_STATUS.DELIVERED, trackableEvent);
    }

    @Transaction(false)
    @Returns('any')
    public async getTransaction(ctx: Context, id: string): Promise<any> {
        const data: Uint8Array = await ctx.stub.getState(id);

        if (!exists(data)) {
            throw new Error(`Transaction ${id} does not exist`);
        }

        return JSON.parse(data.toString());
    }

    @Transaction(false)
    @Returns('any')
    public async getEventRecords(ctx: Context, id: string): Promise<any> {
        return iterateOverResults(ctx.stub.getHistoryForKey(id));
    }

    private isValidTrackableEvent = (e: TrackableEvent) => !!e.ID && !!e.name && !!e.performedTime && !!e.trackableEntityID;

    private async createTrackableEvent(
        ctx: Context,
        id: string,
        name: string,
        trackableEntityID: string,
        performedTime: string,
        participants: string,
    ): Promise<Buffer> {
        const data = await ctx.stub.getState(trackableEntityID);
        if (!exists(data)) {
            throw new Error(`The trackable entity ${trackableEntityID} does not exist`);
        }

        this.verifyParticipantData(participants);

        const trackableEvent = new TrackableEvent({
            ID: id,
            name,
            trackableEntityID,
            performedTime,
            participants,
        });

        if (!this.isValidTrackableEvent(trackableEvent)) {
            throw new Error(`Trackable event is missing mandatory fields. ${trackableEvent}`);
        }

        const buffer: Buffer = Buffer.from(JSON.stringify(trackableEvent));
        await ctx.stub.putState(id, buffer);

        return buffer;
    }

    private verifyParticipantData(participants: string): void {
        try {
            const parsedParticipants = JSON.parse(participants) as Participant[];
            if (!Array.isArray(parsedParticipants) || parsedParticipants.length < 0) {
                throw new Error('Event must include participant(s)');
            }

            const isValid = parsedParticipants
                .map((p) => new Participant(p))
                .every((p) => !!p.ID && !!p.role);

            if (!isValid) {
                throw new Error('Participant data has invalid format');
            }
        } catch (e) {
            throw new Error(`Error parsing participants data ${e}`);
        }
    }

    private async verifyPreviousEventState(ctx: Context, id: string, event: string, acceptedStates: string[]) {
        const data = await ctx.stub.getState(id);
        if (!exists(data)) {
            throw new Error(`Unable to record event ${event}. The trackable event ${id} does not exists`);
        }

        const previousEvent = JSON.parse(data.toString());
        if (!acceptedStates.includes(previousEvent.name)) {
            throw new Error(`Unable to record event ${event}. The trackable event ${id} has invalid status ${previousEvent.name}`);
        }
    }
}
