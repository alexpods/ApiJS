Clazz('Options', function() {
    return {
        methods: {
            process: function(service, options) {
                service.setOptions(options);
            }
        }
    }
});