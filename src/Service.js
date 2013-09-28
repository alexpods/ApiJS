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