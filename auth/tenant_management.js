const admin = require('firebase-admin');
admin.initializeApp();

function enableAnonymousSignIn() {
  // [START auth_tenant_enable_anon]
  const manager = admin.auth().tenantManager();
  manager.updateTenant('tenantId', {
      anonymousSignInEnabled: true,
    })
    .then(function(tenant) {
      console.log('Successfully updated tenant: ', JSON.stringify(tenant));
    })
    .catch(function(error) {
      console.log('Error updating tenant: ', JSON.stringify(error));
    });
  // [END auth_tenant_enable_anon]
}