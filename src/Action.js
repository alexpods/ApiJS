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