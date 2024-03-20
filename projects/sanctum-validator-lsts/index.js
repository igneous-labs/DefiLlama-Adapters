const { PublicKey } = require("@solana/web3.js");
const { getConnection, decodeAccount } = require("../helper/solana");

const stakePoolAddresses = [
  { symbol: "pwrSOL", pool: "DfiQgSvpW3Dy4gKfhtdHnWGHwFUrE8exvaxqjtMtAVxk" },
  { symbol: "superSOL", pool: "4dZDUL3BFJUFeqS3Y3cwkc84Rs6mgVHRYGt1LJvhooW4" },
  { symbol: "jucySOL", pool: "AZGSr2fUyKkPLMhAW6WUEKEsQiRMAFKf8Fjnt4MFFaGv" },
  { symbol: "bonkSOL", pool: "ArAQfbzsdotoKB5jJcZa3ajQrrPcWr2YQoDAEAiFxJAC" },
  { symbol: "dSOL", pool: "9mhGNSPArRMHpLDMSmxAvuoizBqtBGqYdT8WGuqgxNdn" },
  {
    symbol: "compassSOL",
    pool: "AwDeTcW6BovNYR34Df1TPm4bFwswa4CJY4YPye2LXtPS",
  },
  {
    symbol: "picoSOL",
    pool: "8Dv3hNYcEWEaa4qVx9BTN1Wfvtha1z8cWDUXb7KVACVe",
  },
  { symbol: "clockSOL", pool: "6e2LpgytfG3RqMdYuPr3dnedv6bmHQUk9hH9h2fzVk9o" },
  { symbol: "hubSOL", pool: "ECRqn7gaNASuvTyC5xfCUjehWZCSowMXstZiM5DNweyB" },
  { symbol: "strongSOL", pool: "GZDX5JYXDzCEDL3kybhjN7PSixL4ams3M2G4CvWmMmm5" },
  {
    symbol: "lanternSOL",
    pool: "LW3qEdGWdVrxNgxSXW8vZri7Jifg4HuKEQ1UABLxs3C",
  },
];

async function tvl() {
  // https://github.com/igneous-labs/sanctum-lst-list
  const connection = getConnection();
  // const accounts = await Promise.all(
  //   stakePoolAddresses.map(
  //     async (value) =>
  //       await connection.getAccountInfo(new PublicKey(value.pool))
  //   )
  // );
  // const tvls = accounts.map(
  //   (value) => Number(value.data.readBigUint64LE(258)) / 1e9
  // );
  // const totalTvl = tvls.reduce((acc, curr) => acc + curr, 0);

  const poolInfoAccount = await connection.getAccountInfo(
    new PublicKey("Gb7m4daakbVbrFLR33FKMDVMHAprRZ66CSYt4bpFwUgS")
  );
  const decoded = decodeAccount("sanctumLstStateList", poolInfoAccount);
  console.log(decoded)

  // return {
  //   solana: totalTvl,
  // };
}

module.exports = {
  timetravel: false,
  methodology:
    "Uses the SPL Stake Pool SDK to fetch the total supply of deposited SOL into the various Sanctum-powered stake pools",
  solana: {
    tvl,
  },
};
