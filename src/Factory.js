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
            actionClazz:  ['clazz'],

            serviceMeta:  ['hash'],
            actionMeta:   ['hash']
        },
        methods: {
            createService: function(api, name, dependencies) {

                var service  = this.getServiceClazz().create({ name: name , api: api});
                var metaData = this.getServiceMeta(api, name);

                if (typeof metaData === 'function') {
                    metaData = metaData.apply(service, dependencies);
                }

                meta.processor(this.clazz.const('META')('SERVICE')).process(service, metaData);

                return service;
            },
            createAction: function(service, name, dependencies) {

                var action   = this.getActionClazz().create({ name: name, service: service});
                var metaData = this.getActionMeta(service, name);

                if (typeof metaData === 'function') {
                    metaData = metaData.apply(action, dependencies);
                }

                meta.processor(this.clazz.const('META')('ACTION')).process(action, metaData);

                return action;
            },

            getServiceMeta: function(api, name) {
                return this.__getPropertyValue('serviceMeta', this.getServiceMetaName(api, name));
            },

            setServiceMeta: function(api, name, meta) {
                return this.__setPropertyValue('serviceMeta', this.getServiceMetaName(api, name), meta);
            },

            hasServiceMeta: function(api, name) {
                return this.__hasPropertyValue('serviceMeta', this.getServiceMetaName(api, name));
            },

            getServiceMetaName: function(api, name) {
                return 'Api'+api.uid + '___' + name;
            },

            getActionMeta: function(service, name) {
               return this.__getPropertyValue('actionMeta', this.getActionMetaName(service, name));
            },

            setActionMeta: function(service, name, meta) {
                return this.__setPropertyValue('actionMeta', this.getActionMetaName(service, name), meta);
            },

            hasActionMeta: function(service, name) {
                return this.__hasPropertyValue('actionMeta', this.getActionMetaName(service, name));
            },

            getActionMetaName: function(service, actionName) {
                return service.getName() + '___' + actionName;
            }
        }
    }
})