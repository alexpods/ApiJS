Clazz('ApiJS.Factory', function(Meta) {
    return {
        properties: {
            serviceClazz: ['object'],
            actionClazz:  ['object']
        },
        methods: {
            createService: function(name, meta) {
                return Meta.Manager.getHandler('ApiJS.Service').process(this.getServiceClazz({ name: name }).create(), meta);
            },
            createAction: function(name, meta) {
                return Meta.Manager.getHandler('ApiJS.Action').process(this.getActionClazz().create({ name: name}), meta);
            }
        }
    }
})