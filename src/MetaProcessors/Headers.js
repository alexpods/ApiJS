meta.processor('Api.Headers', function(object, headers) {
    for (var name in headers) {
        object.setHeader(name, headers[name]);
    }
})