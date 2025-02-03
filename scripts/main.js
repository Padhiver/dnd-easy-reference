//region Constantes
// Configuration des menus
const MENU_CONFIGS = {
  conditionTypes: 'conditionTypes',
  saves: {
    items: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
    suffix: '-save'
  },
  checks: {
    abilities: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
    skills: ['acr', 'arc', 'ath', 'ste', 'ani', 'slt', 'his', 'itm', 'ins', 'inv',
      'med', 'nat', 'prc', 'per', 'rel', 'prf', 'sur', 'dec'],
    suffix: '-check'
  },
  weaponMasteries: 'weaponMasteries',
  areaTargetTypes: 'areaTargetTypes',
  itemProperties: 'itemProperties',
  abilities: 'abilities',
  skills: 'skills',
  damageTypes: 'damageTypes',
  creatureTypes: 'creatureTypes',
};

// Configuration des blocs de style
const STYLE_BLOCKS = {
  advice: { class: 'fvtt advice', icon: 'icons/vtt-512.png' },
  quest: { class: 'fvtt quest', icon: 'icons/magic/symbols/question-stone-yellow.webp' },
  treasure: { class: 'fvtt quest', icon: 'icons/containers/chest/chest-wooden-tied-white.webp' },
  narrative: { class: 'fvtt narrative', type: 'div' },
  notable: { class: 'notable', type: 'aside' }
};

//region Hook
// Hook principal qui s'exécute lors de l'initialisation des menus ProseMirror
Hooks.on("getProseMirrorMenuDropDowns", (proseMirrorMenu, dropdowns) => {
  // Fonction pour insérer du texte dans l'éditeur
  const insertText = (text) => {
    proseMirrorMenu.view.dispatch(
      proseMirrorMenu.view.state.tr.insertText(text).scrollIntoView()
    );
  };
//region Fonctions
  // Fonctions d'insertion pour les références, sauvegardes et tests
  const insertions = {
    reference: (item) => insertText(`&Reference[${item}]`),
    save: (save) => {
      const format = game.settings.get('dnd-easy-reference', 'formatType');
      const formatString = format === 'long' ? ' format=long' : '';
      insertText(`[[/save ${save.replace('-save', '')} dc=15${formatString}]]`);
    },
    check: (check) => {
      const format = game.settings.get('dnd-easy-reference', 'formatType');
      const formatString = format === 'long' ? ' format=long' : '';
      insertText(`[[/check ${check.replace('-check', '')} dc=15${formatString}]]`);
    }
  };

  // Fonction pour créer les entrées de menu en fonction de la catégorie et des éléments
  const createMenuEntries = (category, items) => {
    if (category === 'saves') {
      // Crée des entrées de menu pour les jets de sauvegarde
      return items.items.map(item => ({
        title: CONFIG.DND5E.abilities[item]?.label || item, // Titre de l'entrée
        action: `${item}${items.suffix}`, // Action associée
        cmd: () => insertions.save(`${item}${items.suffix}`) // Commande à exécuter
      }));
    }

    if (category === 'checks') {
      // Crée des entrées de menu pour les tests de caractéristiques et de compétences
      return [
        ...items.abilities.map(ability => ({
          title: CONFIG.DND5E.abilities[ability]?.label || ability,
          action: `${ability}${items.suffix}`,
          cmd: () => insertions.check(`${ability}${items.suffix}`)
        })),
        ...items.skills.map(skill => ({
          title: CONFIG.DND5E.skills[skill]?.label || skill,
          action: `${skill}${items.suffix}`,
          cmd: () => insertions.check(`${skill}${items.suffix}`)
        }))
      ];
    }

    // Cas standard pour les références
    return Object.keys(CONFIG.DND5E?.[items] || {})
      .filter(item => CONFIG.DND5E[items][item]?.reference)
      .map(item => ({
        title: CONFIG.DND5E[items][item]?.label || item,
        action: item,
        cmd: () => insertions.reference(item)
      }));
  };

  // Fonction pour créer des entrées de menu pour les blocs de style
  const createStyleEntry = (type, config) => {
    if (config.type) {
      // Bloc de style avec un type spécifique
      return {
        title: game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}`),
        action: type,
        node: proseMirrorMenu.schema.nodes[config.type],
        attrs: { class: config.class },
        cmd: () => proseMirrorMenu._toggleBlock(
          proseMirrorMenu.schema.nodes[config.type],
          foundry.prosemirror.commands.wrapIn,
          { attrs: { _preserve: { class: config.class } } }
        )
      };
    }

    // Bloc de style avec icône et du contenu
    return {
      title: game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}`),
      action: type,
      cmd: () => {
        const schema = proseMirrorMenu.schema;
        const divNode = schema.nodes.div.create(
          { _preserve: { class: config.class } },
          [
            schema.nodes.figure.create(
              { _preserve: { class: 'icon' } },
              [schema.nodes.image.create({ src: config.icon, _preserve: { class: 'round' } })]
            ),
            schema.nodes.article.create(null, [
              schema.nodes.heading.create(
                { level: 4 },
                schema.text(game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}_TITLE`))
              ),
              schema.nodes.paragraph.create(
                null,
                schema.text(game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}_CONTENT`))
              )
            ])
          ]
        );
        proseMirrorMenu.view.dispatch(
          proseMirrorMenu.view.state.tr.replaceSelectionWith(divNode)
        );
        return true;
      }
    };
  };

  // Filtre les menus activés en fonction des paramètres utilisateur
  const enabledMenus = Object.entries(MENU_CONFIGS)
    .filter(([key]) => game.settings.get('dnd-easy-reference', `show${key}`));

  //region Menu final
  dropdowns.journalEnrichers = {
    action: 'enricher',
    title: game.i18n.localize('DND.MENU.TITLE'), // Titre localisé du menu
    entries: [
      ...enabledMenus.map(([key, items]) => ({
        title: game.i18n.localize(`DND.MENU.${key.toUpperCase()}.TITLE`), // Titre localisé de la catégorie
        action: key,
        children: createMenuEntries(key, items) // Entrées de menu pour la catégorie
      })),
      {
        title: game.i18n.localize('DND.MENU.STYLE.TITLE'),
        action: 'styles',
        children: Object.entries(STYLE_BLOCKS).map(([type, config]) =>
          createStyleEntry(type, config)
        )
      }
    ]
  };
});
