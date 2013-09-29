Clazz('Factory', function(Service, Meta, MetaOptions) {
    return {
        constants: {
            NAME_PATTERN: 'Api{UID}'
        },
        properties: {
            uid: {
                default: 0
            },
            meta: {
                default: new Meta(MetaOptions),
                methods: ['get']
            }
        },
        methods: {
            create: function(name, meta) {
                if (typeof meta === 'undefined') {
                    meta = name;
                    name = null;
                }
                if (!name) {
                    name = this.generateName();
                }

                var service = Service.create({ name: name });

                if (typeof meta === 'function') {
                    meta = meta.apply(service);
                }
                this._meta.process(service, meta);

                return service;
            },
            generateName: function() {
                return this.clazz.const('NAME_PATTERN').replace('{UID}', ++this._uid);
            }
        }
    }
});