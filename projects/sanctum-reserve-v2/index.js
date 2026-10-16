const { PublicKey } = require("@solana/web3.js");
const { getConnection, decodeAccount } = require("../helper/solana");

// Reserve v2 pool state PDA: [b"state"] of the controller program
// un27kVAKYscfzvrkNeYkNZ74tW9o4txuArAweftjakw (the reserve-v2 deployment of inf-ctl).
const POOL_STATE = "9zMRqtjkTvUm4kVtz2MrPiJnr9spUmYsr8Uqis7y3Brv";
const CONTROLLER_PROGRAM = "un27kVAKYscfzvrkNeYkNZ74tW9o4txuArAweftjakw";

async function tvl() {
  const connection = getConnection();
  const poolState = await connection.getAccountInfo(new PublicKey(POOL_STATE));
  if (!poolState) throw new Error(`reserve v2 pool state ${POOL_STATE} not found`);
  if (poolState.owner.toBase58() !== CONTROLLER_PROGRAM)
    throw new Error(`reserve v2 pool state owner is ${poolState.owner.toBase58()}, expected ${CONTROLLER_PROGRAM}`);
  // total_sol_value: u64 LE at offset 0, same account layout as the Infinity pool state
  const { totalSolValue } = decodeAccount("sanctumInfinity", poolState);
  return {
    solana: Number(totalSolValue) / 1e9,
  };
}

module.exports = {
  timetravel: false,
  methodology:
    "TVL is the SOL value of everything the Reserve v2 pool holds — its wSOL reserve plus the reserves of every accepted LST — read from the pool state account's onchain total_sol_value.",
  solana: { tvl },
};
