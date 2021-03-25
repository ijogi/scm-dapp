/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Iterators } from 'fabric-shim-api';
import { EVENT } from './models/events';
import { ShippingUnit } from './models/shipment';
import { SHIPMENT_STATUS } from './models/shipment-status';
import { TrackableEntity } from './models/trackable-entity';
import { TrackableEvent } from './models/trackable-event';

type Iterator = (Promise<Iterators.StateQueryIterator> & AsyncIterable<Iterators.KV>) | (Promise<Iterators.HistoryQueryIterator> & AsyncIterable<Iterators.KeyModification>);

@Info({title: 'ShipmentContract', description: 'Shipment tracking smart contract' })
export class ShipmentContract extends Contract {

    private async iterateOverResults(iterator: Iterator) {
        const allResults = [];
        for await (const res of iterator) {
            try {
                allResults.push(allResults.push(res.value.toString()));
            } catch (err) {
                console.error(err);
            }
        }

        return allResults;
    }

    private async createTrackableEvent(
        ctx: Context,
        id: string,
        name: string,
        trackableEntityID: string,
        performedTime: string,
        participants: string,
    ): Promise<void> {
        const exists = await this.entityExists(ctx, trackableEntityID);
        if (!exists) {
            throw new Error(`The trackable entity ${trackableEntityID} does not exist`);
        }

        const trackableEvent = new TrackableEvent({
            ID: id,
            name,
            trackableEntityID,
            performedTime,
            participants,
        });

        const buffer: Buffer = Buffer.from(JSON.stringify(trackableEvent));
        await ctx.stub.putState(id, buffer);
    }

    private exists = (data: Uint8Array) => (!!data && data.length > 0);

    private async verifyPreviousEventState(ctx: Context, id: string, event: string, acceptedStates: string[]) {
        const data = await ctx.stub.getState(id);
        if (!this.exists(data)) {
            throw new Error(`Unable to record event ${event}. The trackable event ${id} does not exists`);
        }

        const previousEvent = JSON.parse(data.toString());
        if (!acceptedStates.includes(previousEvent.name)) {
            throw new Error(`Unable to record event ${event}. The trackable event ${id} has invalid status ${previousEvent.name}`);
        }
    }

    @Transaction(false)
    @Returns('boolean')
    public async entityExists(ctx: Context, id: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(id);
        return this.exists(data);
    }

    @Transaction()
    public async createShipmentUnit(
        ctx: Context,
        id: string,
        contentType: string,
        packagingType: string,
        transportMode: string,
        entityType: string,
    ): Promise<void> {
        const exists: boolean = await this.entityExists(ctx, id);
        if (exists) {
            throw new Error(`The shipment ${id} already exists`);
        }

        const shipment = new ShippingUnit({
            ID: id,
            contentType,
            packagingType,
            transportMode,
            entityType,
        });

        const buffer: Buffer = Buffer.from(JSON.stringify(shipment));
        await ctx.stub.putState(id, buffer);
        ctx.stub.setEvent(EVENT.SHIPPING_UNIT, buffer);
    }

    @Transaction()
    public async createTrackableEntity(
        ctx: Context,
        id: string,
        name: string,
        contentType: string,
        contents: string
    ): Promise<void> {
        const exists: boolean = await this.entityExists(ctx, id);
        if (exists) {
            throw new Error(`The trackable entity ${id} already exists`);
        }

        const trackableEntity = new TrackableEntity({
            ID: id,
            name,
            contentType,
            contents,
        });

        const buffer: Buffer = Buffer.from(JSON.stringify(trackableEntity));
        await ctx.stub.putState(id, buffer);
        ctx.stub.setEvent(EVENT.TRACKABLE_ENTITY, buffer);
    }

    @Transaction()
    public async registerPickup(
        ctx: Context,
        id: string,
        trackableEntityID: string,
        performedTime: string,
        participants: string
    ) {
        const exists = await this.entityExists(ctx, id);
        if (exists) {
            throw new Error(`Unable to initiate flow. The trackable event ${id} already exists`);
        }
        await this.createTrackableEvent(ctx, id, SHIPMENT_STATUS.PICKUP, trackableEntityID, performedTime, participants);
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
        await this.createTrackableEvent(ctx, id, SHIPMENT_STATUS.IN_TRANSIT, trackableEntityID, performedTime, participants);
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
        await this.createTrackableEvent(ctx, id, SHIPMENT_STATUS.AT_LOGISTICS_CENTER, trackableEntityID, performedTime, participants);
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
        await this.createTrackableEvent(ctx, id, SHIPMENT_STATUS.OUT_FOR_DELIVERY, trackableEntityID, performedTime, participants);
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
        await this.createTrackableEvent(ctx, id, SHIPMENT_STATUS.DELIVERED, trackableEntityID, performedTime, participants);
    }

    @Transaction(false)
    @Returns('any')
    public async readTransaction(ctx: Context, id: string): Promise<any> {
        const data: Uint8Array = await ctx.stub.getState(id);

        if (!this.exists(data)) {
            throw new Error(`The shipment ${id} does not exist`);
        }

        return JSON.parse(data.toString());
    }

    @Transaction(false)
    @Returns('any')
    public async getTrackableEventHistory(ctx: Context, id: string): Promise<any> {
        return this.iterateOverResults(ctx.stub.getHistoryForKey(id));
    }

    @Transaction(false)
    @Returns('any')
    public async getAllEntityEvents(ctx: Context, id: string): Promise<any> {
        const query = { selector: { trackableEntityID: id } };
        return this.iterateOverResults(ctx.stub.getQueryResult(JSON.stringify(query)));
    }
}
