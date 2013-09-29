Clazz('Actions', function() {

    return {
        methods: {
            process: function(service, actions) {
                for (var action in actions) {

                    var options    = {};
                    var processors = {};

                    for (var option in actions[action]) {
                        ('processors' === option ? processors : options)[option] = actions[action][option];
                    }

                    service.setActions(action, {
                        options:    options,
                        processors: processors
                    });
                }
            }
        }
    }
});