Hooks.once('init', () => {
  // Enregistrement des paramètres pour chaque catégorie du menu
  const MENU_CATEGORIES = ['abilities', 'skills', 'conditionTypes', 'damageTypes', 'creatureTypes', 'areatargettypes', 'itemProperties',];
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