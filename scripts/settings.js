//region Constantes
const MENU_CATEGORIES = [
  'conditionTypes',
  'saves',
  'checks',
  'weaponMasteries',
  'areaTargetTypes',
  'itemProperties',
  'abilities',
  'skills',
  'damageTypes',
  'creatureTypes'
];

//region Hook 
Hooks.once('init', () => {
  game.settings.register('dnd-easy-reference', 'formatType', {
    name: game.i18n.localize('DND.SETTINGS.FORMAT.TITLE'), // Nom localisé du paramètre
    hint: game.i18n.localize('DND.SETTINGS.FORMAT.HINT'), // Description localisée du paramètre
    scope: 'world', // Portée du paramètre
    config: true, // Indique que ce paramètre est configurable via l'interface utilisateur
    type: String, // Type de données du paramètre
    choices: {
      'short': game.i18n.localize('DND.SETTINGS.FORMAT.SHORT'),
      'long': game.i18n.localize('DND.SETTINGS.FORMAT.LONG')
    },
    default: 'short' // Valeur par défaut
  });

  // Enregistrement d'un sous-menu de configuration
  game.settings.registerMenu('dnd-easy-reference', 'menuConfig', {
    name: game.i18n.localize('DND.SETTINGS.MENU.TITLE'),
    label: game.i18n.localize('DND.SETTINGS.MENU.LABEL'),
    hint: game.i18n.localize('DND.SETTINGS.MENU.HINT'),
    icon: 'fas fa-list', // Icône du sous-menu
    type: DnDMenuConfig, // Type de formulaire associé au sous-menu
    restricted: true // Indique que ce sous-menu est restreint (accessible uniquement par les administrateurs)
  });

  // Enregistrement des paramètres pour chaque catégorie de menu
  MENU_CATEGORIES.forEach(category => {
    game.settings.register('dnd-easy-reference', `show${category}`, {
      name: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.TITLE`),
      hint: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.HINT`),
      scope: 'world',
      config: false,
      type: Boolean, // Type de données du paramètre
      default: true
    });
  });
});

// Définition de la classe DnDMenuConfig qui hérite de FormApplication
class DnDMenuConfig extends FormApplication {
  // Méthode statique pour obtenir les options par défaut du formulaire
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize('DND.SETTINGS.MENU.TITLE'),
      id: 'dnd-menu-config',
      template: 'modules/dnd-easy-reference/templates/menu-config.hbs',
      width: 480 
    });
  }

  // Méthode pour obtenir les données à afficher dans le formulaire
  getData() {
    return {
      categories: MENU_CATEGORIES.map(category => ({
        id: category, 
        name: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.TITLE`), 
        hint: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.HINT`), 
        checked: game.settings.get('dnd-easy-reference', `show${category}`) 
      }))
    };
  }

  // Méthode pour mettre à jour les paramètres lors de la soumission du formulaire
  async _updateObject(event, formData) {
    const updates = Object.entries(formData).map(([key, value]) => {
      const settingKey = key.startsWith('show') ? key : `show${key}`; // Clé du paramètre
      return game.settings.set('dnd-easy-reference', settingKey, value); // Mise à jour du paramètre
    });

    await Promise.all(updates); // Attendre que toutes les mises à jour soient terminées
  }
}
