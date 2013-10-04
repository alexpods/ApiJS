meta.processor('Api.Processors', function(object, processors) {
    for (var type in processors) {
        object.setProcessor(type, processors[type]);
    }
})