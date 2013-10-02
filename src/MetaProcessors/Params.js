Meta.Manager.setProcessor('Params', function(object, params) {
    for (var name in params) {
        object.setParam(name, params[name]);
    }
})