import { connect } from "@planetscale/database";
import assert from "node:assert";

import dotenv from "dotenv";

dotenv.config();

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

const conn = connect(config);

export async function getContracts() {
  try {
    const results = await conn.execute(
      "SELECT * FROM function_latest_cycles;",
      [1],
    );
    const res = results?.rows.map((func) => ({
      id: func.function_id,
      txs_count: Number(func.latest),
    }));
    res.shift();

    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function getNetworkStats() {
  try {
    const contracts_count = (await getContracts()).length;

    const txs_count = Number(
      (await conn.execute(`SELECT COUNT(*) FROM function_transactions;`, [1]))
        ?.rows[0]["count(*)"],
    );

    return { contracts_count, txs_count };
  } catch (error) {
    console.log(error);
  }
}

export async function getAllTransactions(limit, type) {
  try {
    assert.equal(["asc", "desc"].includes(type), true);
    assert.equal(typeof limit === "number" && limit > 0, true);

    if (type === "asc") {
      const res = await conn.execute(
        `SELECT * FROM function_transactions ORDER BY id ASC LIMIT ${limit}`,
        [1],
      );
      return digestTxsRes(res.rows);
    }

    if (type === "desc") {
      const res = await conn.execute(
        `SELECT * FROM function_transactions ORDER BY id DESC LIMIT ${limit}`,
        [1],
      );
      return digestTxsRes(res.rows);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getTransactionsByContract(contract_id) {
  try {
    const results = await conn.execute(
      `SELECT * FROM function_transactions WHERE function_id = '${contract_id}' `,
      [1],
    );
    const res = digestTxsRes(results.rows);
    return res;
  } catch (error) {
    console.log(error);
  }
}

function digestTxsRes(res) {
  for (const tx of res) {
    delete tx.owner;
    delete tx.created_by;
  }
  return res;
}

export const PAST_WEEK_TX_VOLUME = `
SELECT *
FROM function_transactions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);
`;

export async function getWeekTxs() {
  try {
    const results = await conn.execute(
      `
SELECT *
FROM function_transactions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);
`,
      [1],
    );
    const res = digestTxsRes(results.rows);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function getDaysTxs(days) {
  try {
    const results = await conn.execute(
      `
SELECT *
FROM function_transactions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${Number(days)} DAY);
`,
      [1],
    );
    const res = digestTxsRes(results.rows);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function getByPseudoId(id) {
  try {
    const results = await conn.execute(
      `
SELECT *
FROM function_transactions WHERE pseudo_id = '${id}'
`,
      [1],
    );
    const res = digestTxsRes(results.rows);
    return res;
  } catch (error) {
    console.log(error);
  }
}
