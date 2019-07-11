const express = require( 'express' )
const router = express.Router()
const request = require('request')
let teamsToId = {}
let teamAbberv = {}

request('http://data.nba.net/', function(err, response){
   let teamsArray = JSON.parse(response.body).sports_content.teams.team
   teamsArray.forEach(t => {teamsToId[t.team_code] = t.team_id})
   teamsArray.forEach(t => {teamAbberv[t.team_code] = t.team_abbrev.toLowerCase()})
})

router.get('/teams/:teamName', function(req, res){
    let teamName = req.params.teamName
    let teamId = teamsToId[teamName]
    request('http://data.nba.net/10s/prod/v1/2018/players.json', function(err, response){
        let allPlayersData = JSON.parse(response.body).league.standard
        let chosenPlayersData = (allPlayersData.filter(p => p.teamId == teamId && p.isActive))
        let mappedPlayers = chosenPlayersData.map(p => { 
            return { firstName: p.firstName,
                    lastName: p.lastName,
                    jersey: p.jersey,
                    pos: p.pos } })
        mappedPlayers.forEach(p => p.img = `https://nba-players.herokuapp.com/players/${p.lastName.replace(".", "").replace(" ", "_")}/${p.firstName}`)
        res.send(mappedPlayers)
    })
})

router.get('/playerStats/:player', function(req, res){
   let player = req.params.player
   let nameArray = player.toLowerCase().split(" ")
   if(nameArray[2]){
       nameArray[1] = nameArray[1] + "_" + nameArray[2].replace(".", "")
       nameArray.splice(2)
   }
   let lastName = nameArray[1]
   let firstName = nameArray[0]
   request(`https://nba-players.herokuapp.com/players-stats/${lastName}/${firstName}`, function(err, response){
        res.send(JSON.parse(response.body))
    })
})




module.exports = router
