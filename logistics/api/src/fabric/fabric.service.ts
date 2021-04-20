import { Gateway, Wallets, Wallet, Network, Contract } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FabricService {
  private network: Network;

  async openGatewayToChannel(): Promise<Network> {
    // Create a new file system based wallet for managing identities.
    const walletPath: string = path.join(process.cwd(), 'Org2');
    const wallet: Wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Create a new gateway for connecting to our peer node.
    const gateway: Gateway = new Gateway();
    const connectionProfilePath: string = path.resolve(
      __dirname,
      '../..',
      'connection.json',
    );
    const connectionProfile: any = JSON.parse(
      fs.readFileSync(connectionProfilePath, 'utf8'),
    ); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const connectionOptions: any = {
      wallet,
      identity: 'Org2 Admin',
      discovery: { enabled: true, asLocalhost: true },
    };
    await gateway.connect(connectionProfile, connectionOptions);

    // Get the network (channel) our contract is deployed to.
    return await gateway.getNetwork('mychannel');
  }

  async getContract(id: string, name: string): Promise<Contract> {
    if (!this.network) {
      this.network = await this.openGatewayToChannel();
    }
    return this.network.getContract(id, name);
  }
}
