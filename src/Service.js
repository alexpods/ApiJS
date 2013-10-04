clazz('Service', function() {
    return {
        properties: {
            api:        ['object'],
            name:       ['string'],
            baseUrl:    ['string'],
            header:     ['hash'],
            data:       ['hash'],
            param:      ['hash'],
            option:     ['hash'],
            processors: ['hash', { keys: ['pre', 'success', 'fail', 'post']}],
            actionMeta: ['hash']
        },
        methods: {
            action: function(name) {
                return this.getApi().getFactory().createAction(name, this.getActionMeta(name)).setService(this);
            }
        }
    }
})