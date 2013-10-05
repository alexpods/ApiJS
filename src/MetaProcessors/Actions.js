meta.processor('Api.Actions', function(service, actions) {
    for (var action in actions) {
        service.getApi().getFactory().setActionMeta(service, action, actions[action]);
    }
})