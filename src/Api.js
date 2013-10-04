clazz('Api', function() {
    return {
        properties: {
            factory: ['object'],
            service: ['hash']
        },
        methods: {
            service: function(name, meta) {
                if (typeof meta === 'undefined' || Object.prototype.toString.call(meta) === '[object Array]') {

                    if (!this.hasService(name)) {
                        this.setService(name, this.getFactory().createService(name, meta).setApi(this));
                    }
                    return this.getService(name);
                }
                this.getFactory().setServiceClazz(name, meta);

                return this;
            }
        }
    }
})