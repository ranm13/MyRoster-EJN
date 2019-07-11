class Controler{
    fetchTeamData(){
        let teamName = $("#team-input").val()
        $.get(`/teams/${teamName}`, function(response){
            console.log(response)
            renderer.render({response})
        })
    }

    fetchPlayerStats(){
        let name = $(this).find(".player-name").text()
        let id = $(this).find(".img-con").attr("id")
        console.log(id)
        $.get(`/playerStats/${name}`, function(response){
            renderer.renderStats({response}, id)
        })
    }
}

const renderer = new Renderer()
const controler = new Controler()

$("#players-container").on("click", ".player", controler.fetchPlayerStats)


