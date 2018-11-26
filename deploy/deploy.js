const nervos = require('./nervos')
const {
  abi,
  bytecode
} = require('./compiled.js')

const transaction = require('./transaction')
const myContract = new nervos.base.Contract(abi);
(async function () {
  const current = await nervos.base.getBlockNumber()
  transaction.validUntilBlock = current + 88
  const txRes = await myContract
    .deploy({
      data: bytecode,
      arguments: []
    })
    .send(transaction)
  const res = await nervos.listeners.listenToTransactionReceipt(txRes.hash)
  const {
    contractAddress
  } = res
  await nervos.base.storeAbi(contractAddress, abi, transaction) // store abi on the chain
  nervos.base.getAbi(contractAddress, 'pending').then(console.log) // get abi from the chain
})()