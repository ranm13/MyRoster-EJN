class Controler{
    fetchTeamData(){
        let teamName = ($("#team-input").val() || "_")
        $("#team-input").val(" ")
        $.get(`/teams/${teamName}`, function(response){
            renderer.render({response})
        })
    }

    fetchPlayerStats(){
        let playerBlock = $(this).closest(".player")
        let name = playerBlock.find(".player-name").text()
        let id = playerBlock.attr("id")
        $.get(`/playerStats/${name}`, function(response){
            response.img = playerBlock.find(".img").attr("src")
            renderer.renderStats(response, id)
        })
    }

    fetchDreamTeam(){
        $.get(`/dreamTeam`, function(response){
            renderer.render({response})
        })
    }

    addToDreamTeam(){
        let playerBlock = $(this).closest(".player")
        let name = playerBlock.find(".player-name").text()
        let nameArray = name.toLowerCase().split(" ")
        if(nameArray[2]){
            nameArray[1] = nameArray[1] + "_" + nameArray[2].replace(".", "")
            nameArray.splice(2)
        }
        let playerData ={firstName: nameArray[0],
                         lastName: nameArray[1],
                         jersey: playerBlock.find(".jersey").text().slice(3),
                         pos: playerBlock.find(".pos").text().slice(4),
                         img: playerBlock.find(".img").attr("src"),
                         id: playerBlock.attr("id")}
        $.post('/roster', playerData, function(response){
            console.log("posted completed")
        })
    }
}

const renderer = new Renderer()
const controler = new Controler()

$("#dream-team").on("click", controler.fetchDreamTeam)
$("#players-container").on("click", ".get-stats", controler.fetchPlayerStats)
$("#players-container").on("click", ".add-to-dream-team", controler.addToDreamTeam)
$(document).on('keypress', function (e) {
    if (e.which === 13) {
        controler.fetchTeamData()
    }
});
