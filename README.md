# SCM DApp
Logistics oriented proof of concept SCM DApp built with Hypeledger Fabric 2.x  using [IBM Blockchain Platform Developer Tools Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=IBMBlockchain.ibm-blockchain-platform) containing following projects.
- `tracking-contract`  - Chaincode project consisting of 2 smart contracts
- `producer/api` NestJS API for Org1
- `logistics/api` NestJS API for Org2
## Running the DApp
Chaincode inside  `tracking-contract` project needs to be packaged using the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=IBMBlockchain.ibm-blockchain-platform) and deployed to a Fabric environment under a channel named **mychannel** containing 2 organizations **Org1** and **Org2**. **Org1** needs to export a wallet from the VS Code extension to `producer/api` and **Org2** to `logistics/api`. Instructions for running API clients can be found at the root of their respective projects.

### Testing Smart Contracts

Smart contracts  in `tracking-contract`  project can be tested separately from the APIs by deploying them using the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=IBMBlockchain.ibm-blockchain-platform). Individual transactions can be tested with default values by setting `transaction_data` folder  as the [transaction directory](https://github.com/IBM-Blockchain/blockchain-vscode-extension/wiki/Common-tasks-and-how-to-complete-them#using-transaction-data-files-to-submit-a-transaction).