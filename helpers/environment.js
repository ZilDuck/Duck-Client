export function getContractAddress (address) {
  switch (address) {
    case 'ZRC6_CONTRACT': return process.env.zrc6_contract ?? ''
    case 'zrc1_contract': return process.env.zrc1_contract ?? ''
    case 'PROXY_CONTRACT': return process.env.proxy_contract ?? ''
    case 'TOKEN_CONTRACT': return process.env.token_contract ?? ''
    case 'MIGRATOR_CONTRACT': return process.env.migrator_contract ?? ''
    case 'REWARDS_CONTRACT': return process.env.rewards_contract ?? ''
    case 'VOUCHER_CONTRACT': return process.env.voucher_contract ?? ''
    case 'OWNERSHIP_CONTRACT': return process.env.ownership_contract ?? ''
  }
}

export function getRpcUrl (type = '') {
  const network = process.env.current_network
  if (network === 'testnet') {
    return type === 'ws' ? 'wss://dev-ws.zilliqa.com' : 'https://dev-api.zilliqa.com'
  } else {
    return type === 'ws' ? 'wss://api-ws.zilliqa.com' : 'https://api.zilliqa.com'
  }
}

export function getNetworkFromEnv () {
  return process.env.current_network
}
