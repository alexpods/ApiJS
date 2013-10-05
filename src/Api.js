clazz('Api', function() {
    return {
        properties: {
            factory: ['object'],
            service: ['name']
        },
        methods: {
            service: function(name, meta) {
                if (typeof meta === 'undefined' || Object.prototype.toString.call(meta) === '[object Array]') {
                    return this.getFactory().createService(this, name, meta);
                }
                this.getFactory().setServiceMeta(this, name, meta);
                return this;
            }
        }
    }
})