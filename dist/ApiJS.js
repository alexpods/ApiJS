;(function(global, namespace, meta, Q, jQuery, undefined) {

namespace('Api', function(namespace, clazz) { //namespace begin


clazz('Api', function() {
    return {
        properties: {
            factory: ['object']
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
clazz('Service', function() {
    return {
        properties: {
            api:        ['object'],
            name:       ['string'],
            baseUrl:    ['string'],
            header:     ['hash'],
            data:       ['hash'],
            param:      ['hash'],
            option:     ['hash'],
            processors: ['hash', { keys: ['pre', 'success', 'fail', 'post']}]
        },
        methods: {
            action: function(name, dependencies) {
                return this.getApi().getFactory().createAction(this, name, dependencies);
            }
        }
    }
})
clazz('Action', function(Q, jQuery) {
    return {
        properties: {
            name:       ['string'],
            service:    ['object'],
            path:       ['string'],
            method:     ['string', 'GET', { pattern: /^(GET|POST|PUT|DELETE|PATCH)$/ }],
            header:     ['hash'],
            data:       ['hash'],
            param:      ['hash'],
            option:     ['hash'],
            processors: ['hash', { keys: ['pre', 'success', 'fail', 'post'] }]
        },
        methods: {
            query: function() {
                var self = this;

                return Q.when()
                    .then(function() {
                        return self.process('pre');
                    })
                    .then(function() {
                        return Q.when(jQuery.ajax(self.getAjaxOptions()));
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
                if (!this.hasAllProcessors(type)) {
                    return;
                }
                var i, ii, values = [], processors = this.getAllProcessors(type);

                for (i = 0, ii = processors.length; i < ii; ++i) {
                    values.push(processors[i].call(this));
                }
                return Q.all(values);
            },

            getAllHeader: function(name) {
                var h, header = {}, actionHeader = this.getHeader(), serviceHeader = this.getService().getHeader();

                for (h in actionHeader) {
                    header[h] = actionHeader[h];
                }
                for (h in serviceHeader) {
                    header[h] = serviceHeader[h];
                }

                return typeof name !== 'undefined' ? header[name] : header;
            },

            hasAllHeader: function(name) {
                return name in this.getAllHeader();
            },

            getAllParam: function(name) {
                var p, param = {}, actionParam = this.getParam(), serviceParam = this.getService().getParam();

                for (p in actionParam) {
                    param[p] = actionParam[p];
                }
                for (p in serviceParam) {
                    param[p] = serviceParam[p];
                }

                return typeof name !== 'undefined' ? param[name] : param;
            },

            hasAllParam: function(name) {
                return name in this.getAllParam();
            },

            getAllData: function(name) {
                var d, data = {}, actionData = this.getData(), serviceData = this.getService().getData();

                for (d in actionData) {
                    data[d] = actionData[d];
                }
                for (d in serviceData) {
                    data[d] = serviceData[d];
                }

                return typeof name !== 'undefined' ? data[name] : data;
            },

            hasAllData: function(name) {
                return name in this.getAllData();
            },

            getAllProcessors: function(type) {
                var processors = {}, serviceProcessors = this.getService().getProcessors(), actionProcessors = this.getProcessors(), typeProcessors, name;

                var i, ii, types = ['pre', 'success', 'fail', 'post'];

                for (i = 0, ii = types.length; i < ii; ++i) {
                    typeProcessors = {};
                    if (types[i] in serviceProcessors) {
                        for (name in serviceProcessors) {
                            typeProcessors[name] = serviceProcessors[name];
                        }
                    }
                    if (types[i] in actionProcessors) {
                        for (name in actionProcessors[types[i]]) {
                            typeProcessors[name] = actionProcessors[types[i]][name];
                        }
                    }

                    for (name in typeProcessors) {
                        processors[types[i]] = typeProcessors;
                        break;
                    }
                }

                return typeof type !== 'undefined' ? processors[type] : processors;
            },

            hasAllProcessors: function(type) {
                return type in this.getAllProcessors();
            },

            getAllOption: function(name) {
                var o, option = {}, actionOption = this.getOption(), serviceOption = this.getService().getOption();

                for (o in actionOption) {
                    option[o] = actionOption[o];
                }
                for (o in serviceOption) {
                    option[o] = serviceOption[o];
                }

                return typeof name !== 'undefined' ? option[name] : option;
            },

            hasAllOption: function(name) {
                return name in this.getOption();
            },

            getAjaxOptions: function() {
                var options = this.getAllOption();

                options.url     = this.getUrl();
                options.type    = this.getMethod();
                options.headers = this.getAllHeader();
                options.data    = this.getAllData();
                options.processData = false;
                options.isLocal     = false;

                return options;
            },

            getUrl: function() {
                var param, params = this.getAllParam(), queryString = [], url = '/'+this.getService().getBaseUrl()+'/'+this.getPath();

                url = url.replace(/\/+/g, '/').replace(/:\//g, '://').replace(/^\/|\/$/g, '')

                for (param in params) {
                    this.isParamInPath(param)
                        ? url = url.replace('{'+param+'}', params[param])
                        : queryString.push(param+'=' + encodeURIComponent(params[param]));
                }
                queryString = queryString.join('&');

                if (queryString) {
                    if (-1 === url.indexOf('?')) {
                        url += '?';
                    }
                    else if ('&' !== url[url.length-1]) {
                        url += '&';
                    }
                    url += queryString;
                }

                return url;
            },

            isParamInPath: function(name) {
                return -1 !==this.getPath().search('{'+name+'}');
            }
        }
    }
})
meta.processor('Api.Action', 'Meta.Options', {
    options: {
        path:       'Api.Path',
        method:     'Api.Method',
        headers:    'Api.Headers',
        params:     'Api.Params',
        data:       'Api.Data',
        options:    'Api.Options',
        processors: 'Api.Processors'
    }
})
meta.processor('Api.Actions', function(service, actions) {
    for (var action in actions) {
        service.getApi().getFactory().setActionMeta(service, action, actions[action]);
    }
})
meta.processor('Api.BaseUrl', function(object, baseUrl) {
    object.setBaseUrl(baseUrl);
})
meta.processor('Api.Data', function(object, data) {
    for (var name in data) {
        object.setData(name, data[name]);
    }
})
meta.processor('Api.Headers', function(object, headers) {
    for (var name in headers) {
        object.setHeader(name, headers[name]);
    }
})
meta.processor('Api.Method', function(object, method) {
    object.setMethod(method);
})
meta.processor('Api.Options', function(object, options) {
    for (var name in options) {
        object.setOption(name, options[name]);
    }
})
meta.processor('Api.Params', function(object, params) {
    for (var name in params) {
        object.setParam(name, params[name]);
    }
})
meta.processor('Api.Path', function(object, path) {
    object.setPath(path);
})
meta.processor('Api.Processors', function(object, processors) {
    for (var type in processors) {
        object.setProcessor(type, processors[type]);
    }
})
meta.processor('Api.Service', 'Meta.Options', {
    options: {
        baseUrl:    'Api.BaseUrl',
        headers:    'Api.Headers',
        params:     'Api.Params',
        data:       'Api.Data',
        options:    'Api.Options',
        processors: 'Api.Processors',
        actions:    'Api.Actions'
    }
})
;(function(global, clazz, meta, Q, jQuery) {

    var Action   = clazz('Action',  [Q, jQuery]);
    var Service  = clazz('Service');
    var Factory  = clazz('Factory', [meta]);
    var Api      = clazz('Api');

    global.api = Api.create({
        factory: Factory.create({
            serviceClazz: Service,
            actionClazz:  Action
        })
    });

})(global, clazz, meta, Q, jQuery);

}); // namespace end

})(this, namespace, meta, Q, jQuery);