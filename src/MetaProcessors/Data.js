meta.processor('Api.Data', function(object, data) {
    for (var name in data) {
        object.setData(name, data[name]);
    }
})