import Route from 'consul-ui/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import { get } from '@ember/object';

import ascend from 'consul-ui/utils/ascend';

export default Route.extend({
  repo: service('repository/kv'),
  sessionRepo: service('repository/session'),
  model: function(params) {
    const create =
      this.routeName
        .split('.')
        .pop()
        .indexOf('create') !== -1;
    const key = params.key;
    const dc = this.modelFor('dc').dc.Name;
    const nspace = this.modelFor('nspace').nspace.substr(1);
    return hash({
      dc: dc,
      nspace: nspace || 'default',
      parent:
        typeof key !== 'undefined'
          ? this.repo.findBySlug(ascend(key, 1) || '/', dc, nspace)
          : this.repo.findBySlug('/', dc, nspace),
      item: create
        ? this.repo.create({
            Datacenter: dc,
            Namespace: nspace,
          })
        : this.repo.findBySlug(key, dc, nspace),
      session: null,
    }).then(model => {
      // TODO: Consider loading this after initial page load
      if (typeof model.item !== 'undefined') {
        const session = get(model.item, 'Session');
        if (session) {
          return hash({
            ...model,
            ...{
              session: this.sessionRepo.findByKey(session, dc, nspace),
            },
          });
        }
      }
      return model;
    });
  },
  setupController: function(controller, model) {
    this._super(...arguments);
    controller.setProperties(model);
  },
});
