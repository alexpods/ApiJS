Meta.Manager.setProcessor('Processors', function(object, processors) {
    for (var type in processors) {
        object.setProcessor(type, processors[type]);
    }
})