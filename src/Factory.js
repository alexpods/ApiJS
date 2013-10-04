clazz('Factory', function(meta) {
    return {
        constants: {
            META: {
                SERVICE: 'Api.Service',
                ACTION:  'Api.Action'
            }
        },
        properties: {
            serviceClazz: ['clazz'],
            actionClazz:  ['clazz']
        },
        methods: {
            createService: function(name, metaData) {
                var service = this.getServiceClazz().create({ name: name });

                meta.processor(this.clazz.const('META')('SERVICE')).process(service, metaData);

                return service;
            },
            createAction: function(name, metaData) {
                var action = this.getActionClazz().create({ name: name});

                meta.processor(this.clazz.const('META')('ACTION')).process(action, metaData);

                return action;
            }
        }
    }
})