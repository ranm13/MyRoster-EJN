class Renderer {
    
    //Helper function that empties the html that we will render to and render to it using hendelbars
   renderHendelbar(templateId, objToTemplate, appendToPlace) {
        const source = $(templateId).html();
        const template = Handlebars.compile(source)
        const newHTML = template(objToTemplate);
        $(appendToPlace).append(newHTML);
    }

    renderStats(stats, appendToPlace){
        console.log(stats.response)
        console.log($("#" + appendToPlace))//$(`#13`)
        this.renderHendelbar("#stats-template", stats.response, ("#" + appendToPlace))
    }
    render(data){
         $("#players-container").empty()
        this.renderHendelbar("#players-template", data, "#players-container")
    }
}