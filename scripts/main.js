// Hook pour ajouter des menus déroulants à ProseMirror
Hooks.on("getProseMirrorMenuDropDowns", (proseMirrorMenu, dropdowns) => {
  //region Configuration menus
  const MENU_CONFIGS = {
    abilities: Object.keys(CONFIG.DND5E?.abilities || {})
      .filter(abilities => CONFIG.DND5E?.abilities?.[abilities]),
    skills: Object.keys(CONFIG.DND5E?.skills || {})
      .filter(skills => CONFIG.DND5E?.skills?.[skills]),
    conditionTypes: Object.keys(CONFIG.DND5E?.conditionTypes || {})
      .filter(conditionTypes => CONFIG.DND5E?.conditionTypes?.[conditionTypes]?.reference),
    damageTypes: Object.keys(CONFIG.DND5E?.damageTypes || {})
      .filter(damageTypes => CONFIG.DND5E?.damageTypes?.[damageTypes]),
    creatureTypes: Object.keys(CONFIG.DND5E?.creatureTypes || {})
      .filter(creatureTypes => CONFIG.DND5E?.creatureTypes?.[creatureTypes]?.reference),
    areatargettypes: Object.keys(CONFIG.DND5E?.areaTargetTypes || {})
      .filter(areaTargetTypes => CONFIG.DND5E?.areaTargetTypes?.[areaTargetTypes]?.reference),
    itemProperties: Object.keys(CONFIG.DND5E?.itemProperties || {})
      .filter(itemProperties => CONFIG.DND5E?.itemProperties?.[itemProperties]?.reference),
  };

  //region Configuration style
  const STYLE_BLOCKS = {
    advice: { class: 'fvtt advice', icon: 'icons/vtt-512.png' },
    quest: { class: 'fvtt quest', icon: 'icons/magic/symbols/question-stone-yellow.webp' },
    treasure: { class: 'fvtt quest', icon: 'icons/containers/chest/chest-wooden-tied-white.webp' },
    narrative: { class: 'fvtt narrative', type: 'div' },
    notable: { class: 'notable', type: 'aside' }
  };

  //region Fonctions
  // Fonction référence
  const createReferenceEntries = (category, items) => {
    return items.map(item => ({
      title: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.${item.toUpperCase()}`),
      action: item,
      cmd: () => insertReference(item)
    }));
  };

  // Fonction blocs style
  const createStyleBlock = (type) => {
    if (STYLE_BLOCKS[type].type) {
      return {
        title: game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}`),
        action: type,
        node: proseMirrorMenu.schema.nodes[STYLE_BLOCKS[type].type],
        attrs: { class: STYLE_BLOCKS[type].class },
        cmd: () => {
          proseMirrorMenu._toggleBlock(
            proseMirrorMenu.schema.nodes[STYLE_BLOCKS[type].type],
            foundry.prosemirror.commands.wrapIn,
            { attrs: { _preserve: { class: STYLE_BLOCKS[type].class } } }
          );
          return true;
        }
      };
    }

    return {
      title: game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}`),
      action: type,
      cmd: () => insertAdviceOrQuestBlock(type)
    };
  };

  // Fonction blocs quête
  const insertAdviceOrQuestBlock = (type) => {
    const schema = proseMirrorMenu.schema;
    const config = STYLE_BLOCKS[type];
    const title = game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}_TITLE`);
    const content = game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}_CONTENT`);

    const divNode = schema.nodes.div.create(
      { _preserve: { class: config.class } },
      [
        schema.nodes.figure.create(
          { _preserve: { class: 'icon' } },
          [schema.nodes.image.create({ src: config.icon, _preserve: { class: 'round' } })]
        ),
        schema.nodes.article.create(null, [
          schema.nodes.heading.create({ level: 4 }, schema.text(title)),
          schema.nodes.paragraph.create(null, schema.text(content))
        ])
      ]
    );

    proseMirrorMenu.view.dispatch(
      proseMirrorMenu.view.state.tr.replaceSelectionWith(divNode)
    );
    return true;
  };


  // Fonction pour insérer une référence
  const insertReference = (reference) => {
    proseMirrorMenu.view.dispatch(
      proseMirrorMenu.view.state.tr
        .insertText(`&Reference[${reference}]`)
        .scrollIntoView()
    );
  };

  //region Filtrer
  // Filtrer les menus en fonction des paramètres
  const filteredMenuConfigs = Object.entries(MENU_CONFIGS).reduce((acc, [key, items]) => {
    if (game.settings.get('dnd-easy-reference', `show${key.charAt(0).toUpperCase() + key.slice(1)}`)) {
      acc[key] = items;
    }
    return acc;
  }, {});

  //region Menus déroulants
  dropdowns.journalEnrichers = {
    action: 'enricher',
    title: game.i18n.localize('DND.MENU.TITLE'),
    entries: [
      ...Object.entries(filteredMenuConfigs).map(([key, items]) => ({
        title: game.i18n.localize(`DND.MENU.${key.toUpperCase()}.TITLE`),
        action: key,
        children: createReferenceEntries(key, items)
      })),
      {
        title: game.i18n.localize('DND.MENU.STYLE.TITLE'),
        action: 'styles',
        children: Object.keys(STYLE_BLOCKS).map(type => createStyleBlock(type))
      }
    ]
  };

});
