const { getMultipleAccounts, readBigUInt64LE } = require("../helper/solana");

// SOLS (swSOL): a 1:1 wrapper for SOL. Program so1f7APRw5pJ5iNJrM9g5X9tQgXzk8kMUnXxDNdt99b.
// Account layouts (C packing order) from the program's design doc, igneous-labs/sols docs/v1/DESIGN.md.

const SWSOL_MINT = "swso1x7A8Dy36znxtcstSVLNseeCQzNV3wVAfa5GGLu";
const POOL_ACCOUNT = "CugxVX9C5N1gmGTB4DGLjTcod1jTJtJFXgnkm9ExjyDP"; // PDA([swSOL mint])
const PORTFOLIO_ACCOUNT = "AB4T4B38NDTURmKgCAw6kuPuLnpjMtXnbsgQjL8K5uE7"; // PDA(["y", swSOL mint])

// Pool: mint | admin | manager | rebalancer | rrr_controller (5 x 32 bytes), then rent_exempt_lamports u64
const POOL_RENT_EXEMPT_OFFSET = 160;
// Holding: mint 32 | sol_value_calculator 32 | outstanding u64 | sol_value u64 | deposit_fee u32 |
// holding_flags u8 | ata_bump u8 | padding 2 = 88 bytes
const HOLDING_SIZE = 88;
const HOLDING_SOL_VALUE_OFFSET = 72;

function holdingsSolValueLamports(portfolioData) {
  if (!portfolioData || portfolioData.length % HOLDING_SIZE !== 0)
    throw new Error(`unexpected SOLS portfolio account data length: ${portfolioData?.length}`);
  let total = 0n;
  for (let offset = 0; offset < portfolioData.length; offset += HOLDING_SIZE)
    total += BigInt(readBigUInt64LE(portfolioData, offset + HOLDING_SOL_VALUE_OFFSET));
  return total;
}

async function tvl() {
  const [pool, portfolio] = await getMultipleAccounts([POOL_ACCOUNT, PORTFOLIO_ACCOUNT]);
  if (!pool) throw new Error(`SOLS pool account ${POOL_ACCOUNT} not found`);

  // The pool account doubles as the SOL reserve: liquid SOL minus the lamports set aside for rent
  // exemption, plus the SOL value of every yield-bearing token (LST) the pool holds for staking yield.
  const liquidLamports = BigInt(pool.lamports) - BigInt(readBigUInt64LE(pool.data, POOL_RENT_EXEMPT_OFFSET));
  const backingLamports = liquidLamports + (portfolio ? holdingsSolValueLamports(portfolio.data) : 0n);

  return { solana: Number(backingLamports) / 1e9 };
}

module.exports = {
  timetravel: false,
  methodology:
    "TVL is the SOL backing swSOL: the pool account's own SOL balance (the liquid reserve, net of rent-exempt lamports) plus the SOL value of the pool's yield-bearing holdings, held in the pool's portfolio account. swSOL is a 1:1 wrapper for SOL, so this is the full SOL backing holders' redemption claims (mint supply is always <= the pool's depositor-due SOL).",
  solana: { tvl },
};
