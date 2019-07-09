const express = require( 'express' )
const router = express.Router()
const request = require('request')
let teamsToId = {}

request('http://data.nba.net/', function(err, response){
   let teamsArray = JSON.parse(response.body).sports_content.teams.team
   teamsArray.forEach(t => {teamsToId[t.team_code] = t.team_id})
   //console.log(teamsToId)
})

router.get('/teams/:teamName', function(req, res){
    let teamName = req.params.teamName
    let teamId = teamsToId[teamName]
    //console.log(`look for this: ${teamId}`)
    request('http://data.nba.net/10s/prod/v1/2018/players.json', function(err, response){
        let allPlayersData = JSON.parse(response.body).league.standard
        let chosenPlayersData = (allPlayersData.filter(p => p.teamId == teamId && p.isActive))
        let mappedPlayers = chosenPlayersData.map(p => { 
            return { firstName: p.firstName,
                    lastName: p.lastName,
                    jersey: p.jersey,
                    pos: p.pos } })
        mappedPlayers.forEach(p => p.img = `https://nba-players.herokuapp.com/players/${p.lastName}/${p.firstName}`)
        res.send(mappedPlayers)
    })
})



module.exports = router
