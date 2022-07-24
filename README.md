<div align="center">
  <h1 align="center">Exquisite Text</h1>
  <strong>A collaborative writing game in the browser.</strong>
</div>
<br />

<div align="center">
  <h3>
    <a href="https://exquisite-text-js-hub-1.herokuapp.com/">
      My Heroku Deploy
    </a>
  </h3>
</div>
<br />

## Exquisite Text

Exquisite Corpse is a game invented by surrealist artists in the 1920's. Each player adds to a composition in sequence, by being allowed to see only the end of what the previous person contributed. Here, I implement an online multiplayer version for poetry.


## Tech Stack

- [React](https://reactjs.org/)
- [Socket.io](https://socket.io/)
- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/en/)


## Installation & Start

### Local Development

Clone this repository and make it your current directory.

Install [Node](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/download/) according to their instructions for your operating system. If you're using a Linux-like OS and have Homebrew, you can install PostgreSQL with `brew install postgresql` and then start its service with `brew services start postgresql`.

To set up the PostgreSQL backend, first log in to the default database with `psql postgres`.

Run the following commands from the `postgres` command line to create the default user we will use:

```
CREATE ROLE me WITH CREATEDB LOGIN PASSWORD 'password';
\q
```

Reconnect to `postgres` as the newly created user with `psql -d postgres -U me`, then run the following commands:

```
CREATE DATABASE exquisite;
\c exquisite;
CREATE TABLE poems(
    ID SERIAL PRIMARY KEY,
    title text,
    content text,
    time timestamp
);
\q
```

Install Yarn with `npm install --global yarn` and then run `yarn` to install the frontend node modules.

Open up a new terminal and go to the server directory with `cd ./server`, then run `yarn` again, this time to install the server's node modules.

In the server terminal, run `yarn start`, then in the root terminal run `yarn start`. This should automatically open a new browser tab at [`http://localhost:8080/`](http://localhost:8080/). 

### Heroku Deployment

To deploy Exquisite Text to Heroku, we will roughly follow [this guide](https://devcenter.heroku.com/articles/git).

First, you must be using a Git-enabled command-line. For Windows, we recommend the Git Bash utility in [Git for Windows](https://gitforwindows.org/).

Next, you must make an account with Heroku and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

From the root directory of this repo, log in to your Heroku account with `heroku login`, which will allow you to enter your credentials through the browser. Then run the following commands:

```sh
heroku create -a my-exquisite-text
git push heroku main
```

This will create a new Heroku app named `my-exquisite-text` and build the project in that app.

Soon we will add more docs to explain how to use Heroku Postgres to keep a database of poems.

## License

`exquisite-text` is licensed under the
[GNU General Public License v3.0](https://github.com/mikejseay/exquisite-text/blob/main/LICENSE)

Permissions of this strong copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.


## Contact

mikejseay@gmail.com


## Demonstration

Click the ▶ in the top right corner to see a demonstration. Normally, each window would be on a different player's computer!

![](https://github.com/mikejseay/exquisite-text/blob/main/public/exquisiteDemonstrationSmaller.gif)
