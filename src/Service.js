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
            processors: ['hash', { keys: ['pre', 'success', 'fail', 'post']}]
        },
        methods: {
            action: function(name, dependencies) {
                return this.getApi().getFactory().createAction(this, name, dependencies);
            }
        }
    }
})