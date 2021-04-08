import { Injectable } from '@nestjs/common';
import { Contract, ContractEvent } from 'fabric-network';

import { FabricService } from 'src/fabric/fabric.service';

@Injectable()
export class ShipmentContractService {
  private contract: Contract;

  constructor(private fabricSvc: FabricService) {
    this.initContract();
  }

  private async initContract() {
    this.contract = await this.fabricSvc.getContract(
      'tc-37',
      'ShipmentContract',
    );

    this.contract.addContractListener(this.eventListener);
  }

  private async eventListener(event: ContractEvent) {
    const { eventName, payload } = event;
    console.log(eventName);
    console.table(JSON.parse(payload.toString()));
  }

  async createShippingUnit(unit) {
    await this.contract.submitTransaction(
      'createShipmentUnit',
      unit.ID,
      unit.contentType,
      unit.packagingType,
      unit.transportMode,
      unit.entityType,
    );

    return { message: 'success' };
  }

  async createTrackableEntity(entity) {
    const contents = JSON.stringify(entity.contents);
    await this.contract.submitTransaction(
      'createTrackableEntity',
      entity.ID,
      entity.name,
      entity.contentType,
      contents,
    );

    return { message: 'success' };
  }

  async getTransaction(id: string) {
    const result = await this.contract.evaluateTransaction(
      'getTransaction',
      id,
    );

    return JSON.parse(result.toString());
  }
}
