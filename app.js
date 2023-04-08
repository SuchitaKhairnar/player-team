const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at  http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
  }

  //Get Players
  app.get("/players/", async (request, response) => {
    const getCricketTeamQuery = `
      select * from cricket_team order by player_id;
      `;
    const playerTeamArray = await db.all(getCricketTeamQuery);
    response.send(playerTeamArray);
  });

  app.get("/players/:playerId/", async (request, response) => {
    const { playerId } = request.params;
    const addPlayersQuery = `
        select * from cricket_team where player_id = ${playerId}
        `;
    const dbResponse = await db.get(addPlayersQuery);
    response.send(dbResponse);
  });

  // Add Player
  app.post("/players/", async (request, response) => {
    const playersDetails = request.body;
    const { player_name, jersey_number, role } = playersDetails;
    const addPlayersQuery = `
        insert into cricket_team (player_name,jersey_number,role)
        values(
           
            '${player_name}',
            ${jersey_number},
            '${role}'
        );`;
    const dbResponse = await db.run(addPlayersQuery);
    const playerId = dbResponse.lastID;
    response.send({ playerId: playerId });
  });

  //Update
  app.put("/players/:playerId/", async (request, response) => {
    const { playerId } = request.params;
    const playersDetails = request.body;
    const { player_name, jersey_number, role } = playersDetails;
    const updateDetails = `
       update player_team SET
       player_name = '${player_name}',
       jersey_number = ${jersey_number},
       role = '${role}'
       where player_id = ${playerId};`;
    await db.run(updateDetails);
    response.send("Player Details Update");
  });

  // Delete
  app.delete("/players/:playerId/", async (request, response) => {
    const { playerId } = request.params;
    const deletePlayer = `
        delete from player_team where player_id = ${playerID}
        `;
    await db.run(deletePlayer);
    response.send("Player Removed");
  });
};

initializeDBAndServer();
// module.exports = initializeDBAndServer();
