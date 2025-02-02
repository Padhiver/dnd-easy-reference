// Hook pour ajouter des menus déroulants à ProseMirror
Hooks.on("getProseMirrorMenuDropDowns", (proseMirrorMenu, dropdowns) => {
  //region Configuration menus
  const MENU_CONFIGS = {
    abilities: Object.keys(CONFIG.DND5E?.abilities || {})
      .filter(ability => CONFIG.DND5E.abilities[ability]?.reference),
    skills: Object.keys(CONFIG.DND5E?.skills || {})
      .filter(skill => CONFIG.DND5E.skills[skill]?.reference),
    conditionTypes: Object.keys(CONFIG.DND5E?.conditionTypes || {})
      .filter(condition => CONFIG.DND5E.conditionTypes[condition]?.reference),
    damageTypes: Object.keys(CONFIG.DND5E?.damageTypes || {})
      .filter(damage => CONFIG.DND5E.damageTypes[damage]),
    creatureTypes: Object.keys(CONFIG.DND5E?.creatureTypes || {})
      .filter(creature => CONFIG.DND5E.creatureTypes[creature]?.reference),
    areaTargetTypes: Object.keys(CONFIG.DND5E?.areaTargetTypes || {})
      .filter(area => CONFIG.DND5E.areaTargetTypes[area]?.reference),
    itemProperties: Object.keys(CONFIG.DND5E?.itemProperties || {})
      .filter(item => CONFIG.DND5E.itemProperties[item]?.reference),
    saves: ['str-save', 'dex-save', 'con-save', 'int-save', 'wis-save', 'cha-save'],
    checks: [
      'str-check', 'dex-check', 'con-check', 'int-check', 'wis-check', 'cha-check',
      'acr-check', 'arc-check', 'ath-check', 'ste-check', 'ani-check',
      'slt-check', 'his-check', 'itm-check', 'ins-check', 'inv-check',
      'med-check', 'nat-check', 'prc-check', 'per-check', 'rel-check',
      'prf-check', 'sur-check', 'dec-check'
    ],
  };

  //region Fonctions
  // Fonction pour insérer une référence
  const insertReference = (reference) => {
    proseMirrorMenu.view.dispatch(
      proseMirrorMenu.view.state.tr
        .insertText(`&Reference[${reference}]`)
        .scrollIntoView()
    );
  };

  // Fonction pour insérer un jet de sauvegarde avec DC=15
  const insertSave = (save) => {
    const saveKey = save.replace('-save', ''); // Retire le suffixe "-save"
    proseMirrorMenu.view.dispatch(
      proseMirrorMenu.view.state.tr
        .insertText(`[[/save ${saveKey} dc=15]]`)
        .scrollIntoView()
    );
  };

  // Fonction pour insérer un jet de caractéristique ou de compétence
  const insertCheck = (check) => {
    const checkKey = check.replace('-check', ''); // Retire le suffixe "-check"
    proseMirrorMenu.view.dispatch(
      proseMirrorMenu.view.state.tr
        .insertText(`[[/check ${checkKey} dc=15]]`)
        .scrollIntoView()
    );
  };

  // Fonction pour créer les entrées de référence
  const createReferenceEntries = (category, items) => {
    return items.map(item => ({
      title: CONFIG.DND5E[category]?.[item]?.label || item, // Utilise les traductions du système
      action: item,
      cmd: () => insertReference(item)
    }));
  };

  // Fonction pour créer les entrées de sauvegarde
  const createSaveEntries = (saves) => {
    return saves.map(save => {
      const saveKey = save.replace('-save', '');
      return {
        title: CONFIG.DND5E.abilities[saveKey]?.label || saveKey, // Utilise les traductions du système
        action: save,
        cmd: () => insertSave(save)
      };
    });
  };

  // Fonction pour créer les entrées de checks
  const createCheckEntries = (checks) => {
    const abilities = checks.filter(check => check.includes('-check') && CONFIG.DND5E.abilities[check.replace('-check', '')]);
    const skills = checks.filter(check => check.includes('-check') && CONFIG.DND5E.skills[check.replace('-check', '')]);

    return [
      // Entrées pour les checks de caractéristiques (abilities)
      ...abilities.map(ability => {
        const abilityKey = ability.replace('-check', '');
        return {
          title: CONFIG.DND5E.abilities[abilityKey]?.label || abilityKey, // Utilise les traductions du système
          action: ability,
          cmd: () => insertCheck(ability)
        };
      }),
      // Entrées pour les checks de compétences (skills)
      ...skills.map(skill => {
        const skillKey = skill.replace('-check', '');
        return {
          title: CONFIG.DND5E.skills[skillKey]?.label || skillKey, // Utilise les traductions du système
          action: skill,
          cmd: () => insertCheck(skill)
        };
      })
    ];
  };

  //region Styles
  const STYLE_BLOCKS = {
    advice: { class: 'fvtt advice', icon: 'icons/vtt-512.png' },
    quest: { class: 'fvtt quest', icon: 'icons/magic/symbols/question-stone-yellow.webp' },
    treasure: { class: 'fvtt quest', icon: 'icons/containers/chest/chest-wooden-tied-white.webp' },
    narrative: { class: 'fvtt narrative', type: 'div' },
    notable: { class: 'notable', type: 'aside' }
  };

  // Fonction pour créer les blocs de style
  const createStyleBlock = (type) => {
    if (STYLE_BLOCKS[type].type) {
      return {
        title: game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}`), // Conserve les traductions pour les styles
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
      title: game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}`), // Conserve les traductions pour les styles
      action: type,
      cmd: () => insertAdviceOrQuestBlock(type)
    };
  };

  // Fonction pour insérer des blocs de quête ou de conseil
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

  //region Filtrer les menus en fonction des paramètres
  const filteredMenuConfigs = Object.entries(MENU_CONFIGS).reduce((acc, [key, items]) => {
    if (game.settings.get('dnd-easy-reference', `show${key.charAt(0).toUpperCase() + key.slice(1)}`)) {
      acc[key] = items;
    }
    return acc;
  }, {});

  //region Menus déroulants
  dropdowns.journalEnrichers = {
    action: 'enricher',
    title: game.i18n.localize('DND.MENU.TITLE'), // Titre du menu principal
    entries: [
      ...Object.entries(filteredMenuConfigs).map(([key, items]) => ({
        title: game.i18n.localize(`DND.MENU.${key.toUpperCase()}.TITLE`), // Titre du menu
        action: key,
        children: key === 'saves' ? createSaveEntries(items) : key === 'checks' ? createCheckEntries(items) : createReferenceEntries(key, items)
      })),
      {
        title: game.i18n.localize('DND.MENU.STYLE.TITLE'), // Titre des styles
        action: 'styles',
        children: Object.keys(STYLE_BLOCKS).map(type => createStyleBlock(type))
      }
    ]
  };
});