/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { EVENT } from './models/events';
import { ShippingUnit } from './models/shipment';
import { TrackableEntity } from './models/trackable-entity';
import { exists, iterateOverResults } from './utils/utility-functions';

@Info({title: 'ShipmentContract', description: 'Shipment tracking smart contract' })
export class ShipmentContract extends Contract {

    @Transaction()
    public async createShipmentUnit(
        ctx: Context,
        id: string,
        contentType: string,
        packagingType: string,
        transportMode: string,
        entityType: string,
    ): Promise<void> {
        const data = await ctx.stub.getState(id);
        if (exists(data)) {
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
        const data = await ctx.stub.getState(id);
        if (exists(data)) {
            throw new Error(`The trackable entity ${id} already exists`);
        }

        await this.verifyRegisteredContent(ctx, contents);

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

    @Transaction(false)
    @Returns('any')
    public async getTransaction(ctx: Context, id: string): Promise<any> {
        const data = await ctx.stub.getState(id);

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

    @Transaction(false)
    @Returns('any')
    public async getAllEntityEvents(ctx: Context, id: string): Promise<any> {
        const query = { selector: { trackableEntityID: id } };
        return iterateOverResults(ctx.stub.getQueryResult(JSON.stringify(query)));
    }

    private isValidShipment = (s: ShippingUnit) => s.ID && s.contentType && s.entityType && s.packagingType && s.transportMode;

    private async verifyRegisteredContent(ctx: Context, contents: string) {
        const unregisteredError = new Error(`Entity contains unregistered content units ${contents}`);

        const items = JSON.parse(contents) as string[];
        if (!Array.isArray(items) || items.length < 0) {
            throw new Error('Contents can not be empty');
        }

        try {
            const shipments = await Promise.all(items.map((id) => ctx.stub.getState(id)));
            if (!shipments.every(exists)) {
                throw unregisteredError;
            }

            const isValid = shipments
                .map((s) => new ShippingUnit(JSON.parse(s.toString())))
                .every(this.isValidShipment);

            if (!isValid) {
                throw unregisteredError;
            }
        } catch (e) {
            throw new Error(`Entity contains unregistered content units ${contents}. ${e}`);
        }
    }
}
