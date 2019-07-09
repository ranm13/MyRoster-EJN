const renderer = new Renderer

const fetchTeamData = function () {
    let teamName = $("#team-input").val()
    $.get(`/teams/${teamName}`, function(response){
        console.log(response)
        renderer.render({response})
    })
}
