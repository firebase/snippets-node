const admin = require('firebase-admin');
admin.initializeApp();

const tenantId = 'tenantId';

function createTenant() {
  // [START auth_create_tenant]
  admin.auth().tenantManager().createTenant({
    displayName: 'myTenant1',
    emailSignInConfig: {
      enabled: true,
      passwordRequired: false, // Email link sign-in enabled.
    },
  })
  .then((createdTenant) => {
    console.log(createdTenant.toJSON());
  })
  .catch((error) => {
    // Handle error.
  });
  // [END auth_create_tenant]
}

function updateTenant() {
  // [START auth_update_tenant]
  admin.auth().tenantManager().updateTenant(tenantId, {
    displayName: 'updatedName',
    emailSignInConfig: {
      enabled: false, // Disable email provider.
    },
  })
  .then((updatedTenant) => {
    console.log(updatedTenant.toJSON());
  })
  .catch((error) => {
    // Handle error.
  });
  // [END auth_update_tenant]
}

function deleteTenant() {
  // [START auth_delete_tenant]
  admin.auth().tenantManager().deleteTenant(tenantId)
    .then(() => {
      // Tenant deleted.
    })
    .catch((error) => {
      // Handle error.
    });
  // [END auth_delete_tenant]
}

// [START auth_list_all_tentants]
function listAllTenants(nextPageToken) {
  return admin.auth().tenantManager().listTenants(100, nextPageToken)
    .then((result) => {
      result.tenants.forEach((tenant) => {
        console.log(tenant.toJSON());
      });
      if (result.pageToken) {
        return listAllTenants(result.pageToken);
      }
    });
}
// [END auth_list_all_tentants]


function enableAnonymousSignIn() {
  // [START auth_tenant_enable_anon]
  const manager = admin.auth().tenantManager();
  manager.updateTenant(tenantId, {
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