meta.processor('Api.Actions', function(object, actions) {
    for (var action in actions) {
        object.setActionMeta(action, actions[action]);
    }
})