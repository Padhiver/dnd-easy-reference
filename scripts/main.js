Hooks.on("getProseMirrorMenuDropDowns", (proseMirrorMenu, dropdowns) => {
  const MENU_CONFIGS = {
    condition: Object.keys(CONFIG.DND5E?.conditionTypes || {})
      .filter(condition => CONFIG.DND5E?.conditionTypes?.[condition]?.reference),
    creature: Object.keys(CONFIG.DND5E?.creatureTypes || {})
      .filter(type => CONFIG.DND5E?.creatureTypes?.[type]?.reference),
    damage: Object.keys(CONFIG.DND5E?.damageTypes || {}),
    zone: ['cone', 'cube', 'sphere', 'line', 'cylinder']
  };

  const STYLE_BLOCKS = {
    advice: { class: 'fvtt advice', icon: 'icons/vtt-512.png' },
    quest: { class: 'fvtt quest', icon: 'icons/magic/symbols/question-stone-yellow.webp' },
    treasure: { class: 'fvtt quest', icon: 'icons/containers/chest/chest-wooden-tied-white.webp' },
    narrative: { class: 'fvtt narrative', type: 'div' },
    notable: { class: 'notable', type: 'aside' }
  };

  const createReferenceEntries = (category, items) => {
    return items.map(item => ({
      title: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.${item.toUpperCase()}`),
      action: item,
      cmd: () => insertReference(item)
    }));
  };

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

  const insertReference = (reference) => {
    proseMirrorMenu.view.dispatch(
      proseMirrorMenu.view.state.tr
        .insertText(`&Reference[${reference}]`)
        .scrollIntoView()
    );
  };

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