import { Injectable } from '@nestjs/common';
import { Contract, ContractEvent } from 'fabric-network';

import { FabricService } from 'src/fabric/fabric.service';

@Injectable()
export class TrackableEventService {
  private contract: Contract;

  constructor(private fabricSvc: FabricService) {
    this.initContract();
  }

  private async initContract() {
    this.contract = await this.fabricSvc.getContract(
      'tracking-contract',
      'TrackableEventContract',
    );

    this.contract.addContractListener(this.eventListener);
  }

  private async eventListener(event: ContractEvent) {
    const { eventName, payload } = event;
    console.log(eventName);
    console.table(JSON.parse(payload.toString()));
  }

  async getTransaction(id: string) {
    const result = await this.contract.evaluateTransaction(
      'getTransaction',
      id,
    );

    return JSON.parse(result.toString());
  }

  async getTransactionHistory(id: string) {
    const result = await this.contract.evaluateTransaction(
      'getEventRecords',
      id,
    );

    return JSON.parse(result.toString());
  }

  async registerPickup(event) {
    await this.contract.submitTransaction(
      'registerPickup',
      event.ID,
      new Date().toUTCString(),
      event.trackableEntityID,
      event.participants,
    );
  }

  async registerInboundTransit(event) {
    await this.contract.submitTransaction(
      'registerInboundTransit',
      event.ID,
      new Date().toUTCString(),
      event.trackableEntityID,
      event.participants,
    );
  }

  async registerArrivalToProcessingCenter(event) {
    await this.contract.submitTransaction(
      'registerArrivalToProcessingCenter',
      event.ID,
      new Date().toUTCString(),
      event.trackableEntityID,
      event.participants,
    );
  }

  async registerOutboundTransit(event) {
    await this.contract.submitTransaction(
      'registerArrivalToProcessingCenter',
      event.ID,
      new Date().toUTCString(),
      event.trackableEntityID,
      event.participants,
    );
  }

  async registerDelivery(event) {
    await this.contract.submitTransaction(
      'registerDelivery',
      event.ID,
      new Date().toUTCString(),
      event.trackableEntityID,
      event.participants,
    );
  }
}
