Hooks.once('init', () => {
  // Enregistrement des paramètres pour chaque catégorie du menu
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
  MENU_CATEGORIES.forEach(category => {
    game.settings.register('dnd-easy-reference', `show${category.charAt(0).toUpperCase() + category.slice(1)}`, {
      name: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.TITLE`),
      hint: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.HINT`),
      scope: 'world',
      config: true,
      type: Boolean,
      default: true
    });
  });
});
