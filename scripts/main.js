Hooks.on("getProseMirrorMenuDropDowns", (proseMirrorMenu, dropdowns) => {
  const MENU_CONFIGS = {
    //region Menus
    etats: [
      'blinded', 'charmed', 'deafened', 'exhaustion', 'frightened', 'grappled',
      'incapacitated', 'invisible', 'paralyzed', 'petrified', 'poisoned',
      'prone', 'restrained', 'stunned', 'unconscious'
    ],
    creature: [
      'aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental',
      'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead'
    ],
    degats: [
      'acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic',
      'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'
    ],
    zone: ['cone', 'cube', 'sphere', 'line']
  };

  //region Styles
  const STYLE_BLOCKS = {
    advice: { class: 'fvtt advice', icon: 'icons/vtt-512.png' },
    quest: { class: 'fvtt quest', icon: 'icons/magic/symbols/question-stone-yellow.webp' },
    treasure: { class: 'fvtt quest', icon: 'icons/containers/chest/chest-wooden-tied-white.webp' },
    narrative: { class: 'fvtt narrative', type: 'div' },
    notable: { class: 'notable', type: 'aside' }
  };

  //region Helper Reference
  const createReferenceEntries = (category, items) => {
    return items.map(item => ({
      title: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.${item.toUpperCase()}`),
      action: item,
      cmd: () => insertReference(item)
    }));
  };

  //region Helper Styles
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

  //region Styles spéciaux
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

  //region Fonction Reference
  const insertReference = (reference) => {
    proseMirrorMenu.view.dispatch(
      proseMirrorMenu.view.state.tr
        .insertText(`&Reference[${reference}]`)
        .scrollIntoView()
    );
  };

  //region Menu Principal
  dropdowns.journalEnrichers = {
    action: 'enricher',
    title: game.i18n.localize('DND.MENU.TITLE'),
    entries: [
      ...Object.entries(MENU_CONFIGS).map(([key, items]) => ({
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