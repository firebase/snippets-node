const admin = require('firebase-admin');
admin.initializeApp();

// [START validate_template]
function validateTemplate(template) {
  admin.remoteConfig().validateTemplate(template)
      .then(function (validatedTemplate) {
        // The template is valid and safe to use.
        console.log('Template was valid and safe to use');
      })
      .catch(function (err) {
        console.error('Template is invalid and cannot be published');
        console.error(err);
      });
}
// [END validate_template]

// [START add_new_condition]
function addNewCondition(template) {
  template.conditions.push({
    name: 'android_en',
    expression: 'device.os == \'android\' && device.country in [\'us\', \'uk\']',
    tagColor: 'BLUE',
  });
}
// [END add_new_condition]

// [START set_modify_parameter]
function setOrModifyParameter(template) {
  // Set header_text parameter.
  template.parameters['header_text'] = {
    defaultValue: {
      value: 'A Gryffindor must be brave, talented and helpful.'
    },
    conditionalValues: {
      android_en: {
        value: 'A Droid must be brave, talented and helpful.'
      },
    },
  };
}
// [END set_modify_parameter]

// [START set_modify_parameter_group]
function setOrModifyParameterGroup(template) {
  // Set new_menu parameter group
  template.parameterGroups['new_menu'] = {
    description: 'Description of the group.',
    parameters: {
      pumpkin_spice_season: {
        defaultValue: {
          value: 'A Gryffindor must love a pumpkin spice latte.'
        },
        conditionalValues: {
          android_en: {
            value: 'A Droid must love a pumpkin spice latte.'
          },
        },
        description: 'Description of the parameter.',
      },
    },
  };
}
// [END set_modify_parameter_group]

// [START add_parameter_to_group]
function addParameterToGroup(template) {
  template.parameterGroups['new_menu'].parameters['spring_season'] = {
    defaultValue: {
      useInAppDefault: true
    },
    description: 'spring season menu visibility.',
  };
}
// [END add_parameter_to_group]
