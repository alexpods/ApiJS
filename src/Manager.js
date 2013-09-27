Clazz('Manager', function(Factory) {
    return {
        properties: {
            api: {
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
                if (!this.hasApi(name)) {
                    this.setApi(name, Factory.create(this.getMeta(name)));
                }
                return this.getApi(name);
            },
            has: function(name) {
                return this.hasApi(name) || this.hasMeta(name);
            }
        }
    }
});