import { IPoem } from "../src/types";

const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const Pool = require('pg').Pool
const pool = new Pool({
    connectionString: isProduction
        ? process.env.DATABASE_URL
        : connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
});

async function returnPoems(nPoems: number) {
    try {
        const res = await pool.query(
            `SELECT
                *
            FROM
                poems
            ORDER BY
                time
                DESC
            LIMIT ${String(nPoems)}`
        );
        return res.rows;
    } catch ({ stack }) {
        return stack;
    }
}

async function storePoem(poemObj: IPoem) {
    try {
        const res = await pool.query(
          `INSERT INTO poems(title,
                             content,
                             time)
           VALUES ($1,
                   $2,
                   $3)
           RETURNING *`,
          [
              poemObj.title,
              poemObj.content,
              poemObj.time
          ]
        );
        console.log(res.rows[0]);
    } catch ({ stack }) {
        console.log(stack);
    }

}

export {
  returnPoems,
  storePoem,
};
