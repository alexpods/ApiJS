Clazz('Processors', function() {
    return {
        methods: {
            process: function(service, processors) {
                service.setProcessors(processors);
            }
        }
    }
});