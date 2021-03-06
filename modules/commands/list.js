var _ = require('lodash');
var utils = require('../utils');
var cli = require('../cli');

var commands = {};
exports.commands = commands;

commands.list = {
  name: 'list',
  usage: 'overcast list',
  description: 'List your cluster and instance definitions.',
  run: function (args) {
    var clusters = utils.getClusters();

    utils.grey('Using ' + utils.CONFIG_DIR + '/clusters.json');

    if (_.isEmpty(clusters)) {
      console.log('');
      utils.note('No clusters found.');
      return false;
    }

    _.each(clusters, function (cluster, clusterName) {
      console.log('');
      utils.grey(clusterName);
      _.each(cluster.instances, function (instance) {
        var origin = '(' + instance.user + '@' + instance.ip + ':' + (instance.ssh_port || 22) + ')';
        var provider = getProviderName(instance);
        var str = '  ' + instance.name + ' ' + origin + (provider ? ' ' + provider.green : '');
        console.log(str);
      });
    });
  }
};

// Backwards compatibility:
exports.run = function () {
  cli.run(commands.list);
};

function getProviderName(instance) {
  var name = '';
  _.each(['digitalocean', 'linode', 'aws', 'virtualbox'], function (provider) {
    if (instance[provider]) {
      name = '(' + provider + ')';
    }
  });
  return name;
}
