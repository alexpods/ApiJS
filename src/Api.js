Clazz('Api', function(Manager, Factory) {
    return {
        methods: {
            init: function(name, meta) {
                var service;

                if (typeof meta === 'undefined') {
                    if (Object.prototype.toString.apply(name) === '[object Object]') {
                        meta = name;
                        name = null;
                    }

                    if (!name) {
                        service  = Factory.create(meta);
                        name = service.getName();

                        Manager.setApi(name, api)
                    }

                    return Manager.get(name);
                }
                else {
                    Manager.setMeta(name, meta);
                }
            }
        }
    }
});