/**
 * AngularJS module that adds support for ui-bootstrap modal states when using ui-router.
 *
 * @link https://github.com/nonplus/angular-ui-router-uib-modal
 *
 * @license angular-ui-router-uib-modal v0.0.2
 * (c) Copyright Stepan Riha <github@nonplus.net>
 * License MIT
 */

(function(angular) {

"use strict";
angular.module("ui.router.modal", ["ui.router"])
	.config(["$stateProvider", function($stateProvider) {

		var stateProviderState = $stateProvider.state;

		$stateProvider.state = function (stateName, options) {

			if (options.modal) {

				if (options.onEnter) {
					throw new Error("Invalid modal state definition: The onEnter setting may not be specified.");
				}

				if (options.onExit) {
					throw new Error("Invalid modal state definition: The onExit setting may not be specified.");
				}

				var modalInstances = [];

				// Get state.resolve configuration
				var resolve = Object.keys(options.resolve || {});

				var inject = ["$uibModal", "$state", "$rootScope"];
				options.onEnter = function($uibModal, $state, $rootScope) {

					// Add resolved values to modal options
					if (resolve.length) {
						options.resolve = {};
						for(var i = 0; i < resolve.length; i++) {
							options.resolve[resolve[i]] = arguments[inject.length + i];
						}
					}

					var modalInstance = $uibModal.open(options);

					modalInstances.push(modalInstance);

					modalInstance.result['finally'](function() {
						if (modalInstances.indexOf(modalInstance) >= 0) {
							// Dialog was closed via $uibModalInstance.close/dismiss, adjust state accordingly
							$state.go('^');
						}
					});
				};

				// Make sure that onEnter receives state.resolve configuration
				options.onEnter.$inject = inject.concat(resolve);

				options.onExit = function() {
					var modalInstance = modalInstances.pop();
					if (modalInstance) {
						// State has changed while dialog was open
						modalInstance.close();
					}
				};

			}

			return stateProviderState.call($stateProvider, stateName, options);
		};
	}]);


})(window.angular);