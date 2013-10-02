Meta.Manager.setProcessor('Data', function(object, data) {
    for (var name in data) {
        object.setData(name, data[name]);
    }
})