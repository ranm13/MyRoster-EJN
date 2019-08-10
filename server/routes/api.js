const express = require( 'express' )
const router = express.Router()
const request = require('request')
const teamsToId = {}
const teamAbberv = {}
let mappedPlayers
const dreamTeam = []

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
         mappedPlayers = allPlayersData
            .filter(p => p.teamId == teamId && p.isActive)
            .map(p => { 
            return { firstName: p.firstName,
                    lastName: p.lastName,
                    jersey: p.jersey,
                    pos: p.pos,
                    img: `https://nba-players.herokuapp.com/players/${p.lastName.replace(".", "").replace(" ", "_")}/${p.firstName}`,
                    id: p.personId } })
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
        let data = JSON.parse(response.body)
        playerStats = {playerName: data.name,
            pointsPerGame: data.points_per_game,
            reboundsPerGame: data.rebounds_per_game,
            assistsPerGame: data.assists_per_game,
            stealsPerGame: data.steals_per_game,
            blocksPerGame: data.blocks_per_game,
            minutesPerGame: data.minutes_per_game}
        res.send(playerStats)
    })
})

router.get('/dreamTeam', function(req, res){
    res.send(dreamTeam)
})

router.post('/roster', function(req, res){
    let player = req.body
    let isInDreamTeam = dreamTeam.some(p => p.id === player.id)
    if(!isInDreamTeam){
        if(dreamTeam.length >= 5){
            dreamTeam.splice(4)
        }
        dreamTeam.unshift(player)
    }
    res.end()
})

module.exports = router
