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
                return meta
                    .processor(this.clazz.const('META')('SERVICE'))
                    .process(this.getServiceClazz().create({ name: name }), metaData);
            },
            createAction: function(name, metaData) {
                return meta
                    .processor(this.clazz.const('META')('ACTION'))
                    .process(this.getActionClazz().create({ name: name}), metaData);
            }
        }
    }
})