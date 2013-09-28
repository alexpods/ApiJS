Clazz('Manager', function(Factory) {
    return {
        properties: {
            service: {
                type: 'hash',
                methods: ['get', 'set', 'has']
            },
            meta: {
                type: 'hash',
                methods: ['get', 'set', 'has']
            }
        },
        methods: {
            get: function(name) {
                if (!this.hasService(name)) {
                    var service = Factory.create(name, this.getMeta(name))
                    this.setService(service.getName(), service);
                }
                return this.getService(name);
            },
            has: function(name) {
                return this.hasService(name) || this.hasMeta(name);
            }
        }
    }
});