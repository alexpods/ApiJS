;(function(global, Meta, Q, jQuery, undefined) {

NameSpace('ApiJS');


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
                        Manager.setService(service.getName(), service)
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
/**
 *
 */
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

                var service = new Service({ name: name });

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
Clazz('Service', function(Action) {
    return {
        properties: {
            name: {
                type: 'string',
                methods: 'get'
            },
            options: {
                type: 'hash',
                methods: ['get', 'set', 'has']
            },
            processors: {
                type: ['hash', {
                    keys: ['pre', 'success', 'fail', 'post'],
                    element: 'array'
                }],
                methods: ['get', 'set', 'has']
            },
            actions: {
                type: 'hash',
                methods: ['get', 'set', 'has']
            }
        },
        methods: {
            action: function(name) {
                return new Action({
                    options:    this.getActionOptions(name),
                    processors: this.getActionProcessors(name)
                });
            },
            getActionOptions: function(name) {
                return this._extend(
                    {},
                    this.getOptions() || {},
                    this.getActions(name).options || {}
                );
            },
            getActionProcessors: function(name) {
                var type, processors = this._extend({}, this.getProcessors() || {}), aProcessors = this.getActions(name).processors;

                for (type in aProcessors) {
                    if (!processors[type]) {
                        processors[type] = [];
                    }
                    Array.prototype.push.apply(processors[type], aProcessors[type]);
                }
                return processors;
            },
            _extend: function(object) {
                for (var i = 1, ii = arguments.length; i < ii; ++i) {
                    for (var property in arguments[i]) {
                        object[property] = this._copy(arguments[i][property]);
                    }
                }
                return object;
            },
            _copy: function(object) {
                var copy, toString = Object.prototype.toString.apply(object);

                if (typeof object !== 'object') {
                    copy = object;
                }
                else if ('[object Date]' === toString) {
                    copy = new Date(object.getTime())
                }
                else if ('[object Array]' === toString) {
                    copy = [];
                    for (var i = 0, ii = object.length; i < ii; ++i) {
                        copy[i] = this._copy(object[i]);
                    }
                }
                else if ('[object RegExp]' === toString) {
                    copy = new RegExp(object.source);
                }
                else {
                    copy = {}
                    for (var property in object) {
                        copy[property] = this._copy(object[property]);
                    }
                }

                return copy;
            }
        }
    }
});
Clazz('Action', function(Q, jQuery) {
    return {
        properties: {
            options: {
                type: 'hash',
                methods: ['get', 'set', 'has']
            },
            processors: {
                type: ['array', {
                    keys: ['pre', 'success', 'fail', 'post'],
                    element: 'array'
                }],
                methods: ['get', 'set', 'has']
            }
        },
        methods: {
            query: function(options) {
                var self = this;

                if (typeof options !==  'undefined') {
                    self.addOptions(options);
                }

                return Q.when()
                    .then(function() {
                        return self.process('pre');
                    })
                    .then(function() {
                        return Q.when(jQuery.ajax(self.getOptions()));
                    })
                    .then(function() {
                        return self.process('success');
                    })
                    .fail(function() {
                        return self.process('fail');
                    })
                    .fin(function() {
                        return self.process('post');
                    })
            },

            process: function(type) {
                if (!this.hasProcessors(type)) {
                    return;
                }
                return Q.all(this.getProcessors(type));
            }
        }
    }
});

NameSpace('ApiJS.MetaProcessors');

Clazz('Actions', function() {

    return function(service, actions) {
        for (var action in actions) {

            var options    = {};
            var processors = {};

            for (var option in actions[action]) {
                ('processors' === option ? processors : options)[option] = actions[action][option];
            }

            service.setActions(action, {
                options:    options,
                processors: processors
            });
        }
    }
});
Clazz('Options', function() {

    return function(service, options) {
        service.setOptions(options);
    }
});
Clazz('Processors', function() {

    return function(service, processors) {
        service.setProcessors(processors);
    }
});

NameSpace.end();

;(function(global, Meta, Q, jQuery) {

    var
        Action  = Clazz('Action')(Q, jQuery),
        Service = Clazz('Service')(Action),
        Factory = Clazz('Factory')(Service, Meta, {
            options:    Clazz('MetaProcessors.Options').create(),
            processors: Clazz('MetaProcessors.Processors').create(),
            actions:    Clazz('MetaProcessors.Actions').create()
        }),
        Manager = Clazz('Manager')(Factory),
        Api     = Clazz('Manager')(Manager, Factory);
    ;

    global.Api = Api;

})(global, Meta, Q, jQuery);

NameSpace.end();

})(this, Meta, Q, jQuery);