/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { ShipmentContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logger = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('ShipmentContract', () => {

    let contract: ShipmentContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new ShipmentContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"ID":"1001","contentType":"content type","packagingType":"packaging type","transportMode":"transport mode","entityType":"enitity type"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"ID":"1002","contentType":"content type","packagingType":"packaging type","transportMode":"transport mode","entityType":"enitity type"}'));
        ctx.stub.getState.withArgs('TE1003').resolves(Buffer.from('{"ID":"TE1003","name":"shipment3","contentType":"test items","contents":"[]"}'));
        ctx.stub.getState.withArgs('EV1003').resolves(Buffer.from('{"ID":"EV1003","name":"test event","trackableEntityID":"TE1003","performedTime":"2021-03-14"}'));
        ctx.stub.getStateByRange.withArgs('', '').resolves();
    });

    describe('#createShipment', () => {

        it('should create a shipment', async () => {
            await contract.createShipmentUnit(ctx, '1003', 'content type', 'packaging type', 'transport mode', 'enitity type');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"ID":"1003","contentType":"content type","packagingType":"packaging type","transportMode":"transport mode","entityType":"enitity type"}'));
        });

        it('should throw an error for a shipment that already exists', async () => {
            await contract.createShipmentUnit(ctx, '1001', 'content type', 'packaging type', 'transport mode', 'enitity type').should.be.rejectedWith(/The shipment 1001 already exists/);
        });

    });

    describe('#createTrackableEntity', () => {

        it('should create a trackable entity', async () => {
            await contract.createTrackableEntity(ctx, 'TE1001', 'shipment1', 'test items', '[]');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('TE1001', Buffer.from('{"ID":"TE1001","name":"shipment1","contentType":"test items","contents":"[]"}'));
        });

        it('should throw an error for a trackable entity that already exists', async () => {
            await contract.createTrackableEntity(ctx, 'TE1003', 'shipment1', 'test items', '[]').should.be.rejectedWith(/The trackable entity TE1003 already exists/);
        });

    });

    describe('#getTransaction', () => {

        it('should return a shipment', async () => {
            await contract.getTransaction(ctx, '1001').should.eventually.deep.equal({
                ID:'1001',
                contentType:'content type',
                packagingType:'packaging type',
                transportMode:'transport mode',
                entityType:'enitity type'
            });
        });

        it('should throw an error for a shipment that does not exist', async () => {
            await contract.getTransaction(ctx, '1003').should.be.rejectedWith(/The shipment 1003 does not exist/);
        });

    });

});
