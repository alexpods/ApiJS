Meta.Manager.setProcessor('Options', function(object, options) {
    for (var name in options) {
        object.setOption(name, options[name]);
    }
})