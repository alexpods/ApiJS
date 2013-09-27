Clazz('Actions', function() {

    return function(service, actions) {
        for (var action in actions) {

            var options    = {};
            var processors = {};

            for (var option in actions[action]) {
                ('processors' === option ? processors : options)[option] = actions[action][option];
            }

            service.setAction(action, {
                options:    options,
                processors: processors
            });
        }
    }
});