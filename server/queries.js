const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const Pool = require('pg').Pool
const pool = new Pool({
    connectionString: isProduction
        ? process.env.DATABASE_URL
        : connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
});

async function returnPoems() {
    try {
        const res = await pool.query('SELECT * FROM poems ORDER BY id ASC');
        return res.rows;
    } catch (err) {
        return err.stack;
    }
}

async function storePoem(poemObj) {
    try {
        const res = await pool.query('INSERT INTO poems(title, content, time) VALUES($1, $2, to_timestamp($3 / 1000.0)) RETURNING *',
            [poemObj.title, poemObj.content, poemObj.time]);
        console.log(res.rows[0]);
    } catch (err) {
        console.log(err.stack);
    }

}

const getPoems = (request, response) => {
    pool.query('SELECT * FROM poems ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    })
};

const getSocketPoems = () => {
    return new Promise((resolve) => {
        pool.query('SELECT * FROM poems ORDER BY id ASC', (error, results) => {
            if (error) {
                throw error;
            }
            resolve(results.rows);
        });
    });
};

const createPoem = (request, response) => {
    const { title, content, time } = request.body

    pool.query('INSERT INTO poems (title, content, time) VALUES ($1, $2, $3) RETURNING *', [title, content, time], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`Poem added with ID: ${results.rows[0].id}`);
    })
};

const createSocketPoem = (poem) => {
    return new Promise((resolve) => {
        pool.query('INSERT INTO poems (title, content, time) VALUES ($1, $2, $3) RETURNING *', [poem.title, poem.content, poem.time], (error, results) => {
            if (error) {
                throw error;
            }
            resolve(results.rows);
        });
    });
};


module.exports = {
    returnPoems,
    storePoem,
    getPoems,
    createPoem,
    getSocketPoems,
    createSocketPoem,
};


// const getPoemById = (request, response) => {
//     const id = parseInt(request.params.id)
//
//     pool.query('SELECT * FROM poems WHERE id = $1', [id], (error, results) => {
//         if (error) {
//             throw error
//         }
//         response.status(200).json(results.rows)
//     })
// };
