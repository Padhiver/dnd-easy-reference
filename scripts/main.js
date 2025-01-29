//#region Configuration initiale
Hooks.on("getProseMirrorMenuDropDowns", (proseMirrorMenu, dropdowns) => {
  let options = {
    prosemirror: proseMirrorMenu,
  };

  // Définition du menu principal
  dropdowns.journalEnrichers = {
    action: "enricher",
    title: game.i18n.localize("DND.MENU.TITLE"),
    entries: [

      //#region Menu des états
      {
        title: game.i18n.localize("DND.MENU.ETATS.TITLE"),
        action: "etats",
        children: [
           //... Liste des états
          { title: game.i18n.localize("DND.MENU.ETATS.BLINDED"), action: "blinded", cmd: () => insertReference("blinded") },
          { title: game.i18n.localize("DND.MENU.ETATS.CHARMED"), action: "charmed", cmd: () => insertReference("charmed") },
          { title: game.i18n.localize("DND.MENU.ETATS.DEAFENED"), action: "deafened", cmd: () => insertReference("deafened") },
          { title: game.i18n.localize("DND.MENU.ETATS.EXHAUSTION"), action: "exhaustion", cmd: () => insertReference("exhaustion") },
          { title: game.i18n.localize("DND.MENU.ETATS.FRIGHTENED"), action: "frightened", cmd: () => insertReference("frightened") },
          { title: game.i18n.localize("DND.MENU.ETATS.GRAPPLED"), action: "grappled", cmd: () => insertReference("grappled") },
          { title: game.i18n.localize("DND.MENU.ETATS.INCAPACITATED"), action: "incapacitated", cmd: () => insertReference("incapacitated") },
          { title: game.i18n.localize("DND.MENU.ETATS.INVISIBLE"), action: "invisible", cmd: () => insertReference("invisible") },
          { title: game.i18n.localize("DND.MENU.ETATS.PARALYZED"), action: "paralyzed", cmd: () => insertReference("paralyzed") },
          { title: game.i18n.localize("DND.MENU.ETATS.PETRIFIED"), action: "petrified", cmd: () => insertReference("petrified") },
          { title: game.i18n.localize("DND.MENU.ETATS.POISONED"), action: "poisoned", cmd: () => insertReference("poisoned") },
          { title: game.i18n.localize("DND.MENU.ETATS.PRONE"), action: "prone", cmd: () => insertReference("prone") },
          { title: game.i18n.localize("DND.MENU.ETATS.RESTRAINED"), action: "restrained", cmd: () => insertReference("restrained") },
          { title: game.i18n.localize("DND.MENU.ETATS.STUNNED"), action: "stunned", cmd: () => insertReference("stunned") },
          { title: game.i18n.localize("DND.MENU.ETATS.UNCONSCIOUS"), action: "unconscious", cmd: () => insertReference("unconscious") },
        ],
      },
      //#region Menu des créatures
      {
        title: game.i18n.localize("DND.MENU.CREATURE.TITLE"),
        action: "creature",
        children: [
          //... Liste des types de créatures
          { title: game.i18n.localize("DND.MENU.CREATURE.ABERRATION"), action: "aberration", cmd: () => insertReference("aberration") },
          { title: game.i18n.localize("DND.MENU.CREATURE.BEAST"), action: "beast", cmd: () => insertReference("beast") },
          { title: game.i18n.localize("DND.MENU.CREATURE.CELESTIAL"), action: "celestial", cmd: () => insertReference("celestial") },
          { title: game.i18n.localize("DND.MENU.CREATURE.CONSTRUCT"), action: "construct", cmd: () => insertReference("construct") },
          { title: game.i18n.localize("DND.MENU.CREATURE.DRAGON"), action: "dragon", cmd: () => insertReference("dragon") },
          { title: game.i18n.localize("DND.MENU.CREATURE.ELEMENTAL"), action: "elemental", cmd: () => insertReference("elemental") },
          { title: game.i18n.localize("DND.MENU.CREATURE.FEY"), action: "fey", cmd: () => insertReference("fey") },
          { title: game.i18n.localize("DND.MENU.CREATURE.FIEND"), action: "fiend", cmd: () => insertReference("fiend") },
          { title: game.i18n.localize("DND.MENU.CREATURE.GIANT"), action: "giant", cmd: () => insertReference("giant") },
          { title: game.i18n.localize("DND.MENU.CREATURE.HUMANOID"), action: "humanoid", cmd: () => insertReference("humanoid") },
          { title: game.i18n.localize("DND.MENU.CREATURE.MONSTROSITY"), action: "monstrosity", cmd: () => insertReference("monstrosity") },
          { title: game.i18n.localize("DND.MENU.CREATURE.OOZE"), action: "ooze", cmd: () => insertReference("ooze") },
          { title: game.i18n.localize("DND.MENU.CREATURE.PLANT"), action: "plant", cmd: () => insertReference("plant") },
          { title: game.i18n.localize("DND.MENU.CREATURE.UNDEAD"), action: "undead", cmd: () => insertReference("undead") },
        ],
      },
      //#region Menu des dégâts
      {
        title: game.i18n.localize("DND.MENU.DEGATS.TITLE"),
        action: "degats",
        children: [
          //... Liste des types de dégâts
          { title: game.i18n.localize("DND.MENU.DEGATS.ACID"), action: "acid", cmd: () => insertReference("acid") },
          { title: game.i18n.localize("DND.MENU.DEGATS.BLUDGEONING"), action: "bludgeoning", cmd: () => insertReference("bludgeoning") },
          { title: game.i18n.localize("DND.MENU.DEGATS.COLD"), action: "cold", cmd: () => insertReference("cold") },
          { title: game.i18n.localize("DND.MENU.DEGATS.FIRE"), action: "fire", cmd: () => insertReference("fire") },
          { title: game.i18n.localize("DND.MENU.DEGATS.FORCE"), action: "force", cmd: () => insertReference("force") },
          { title: game.i18n.localize("DND.MENU.DEGATS.LIGHTNING"), action: "lightning", cmd: () => insertReference("lightning") },
          { title: game.i18n.localize("DND.MENU.DEGATS.NECROTIC"), action: "necrotic", cmd: () => insertReference("necrotic") },
          { title: game.i18n.localize("DND.MENU.DEGATS.PIERCING"), action: "piercing", cmd: () => insertReference("piercing") },
          { title: game.i18n.localize("DND.MENU.DEGATS.POISON"), action: "poison", cmd: () => insertReference("poison") },
          { title: game.i18n.localize("DND.MENU.DEGATS.PSYCHIC"), action: "psychic", cmd: () => insertReference("psychic") },
          { title: game.i18n.localize("DND.MENU.DEGATS.RADIANT"), action: "radiant", cmd: () => insertReference("radiant") },
          { title: game.i18n.localize("DND.MENU.DEGATS.SLASHING"), action: "slashing", cmd: () => insertReference("slashing") },
          { title: game.i18n.localize("DND.MENU.DEGATS.THUNDER"), action: "thunder", cmd: () => insertReference("thunder") },
        ],
      },
      //#region Menu des zones
      {
        title: game.i18n.localize("DND.MENU.ZONE.TITLE"),
        action: "zone",
        children: [
          //... Liste des zones d'effet
          { title: game.i18n.localize("DND.MENU.ZONE.CONE"), action: "cone", cmd: () => insertReference("cone") },
          { title: game.i18n.localize("DND.MENU.ZONE.CUBE"), action: "cube", cmd: () => insertReference("cube") },
          { title: game.i18n.localize("DND.MENU.ZONE.SPHERE"), action: "sphere", cmd: () => insertReference("sphere") },
          { title: game.i18n.localize("DND.MENU.ZONE.LINE"), action: "line", cmd: () => insertReference("line") },
        ],
      },
      //#region Menu des styles
      {
        title: game.i18n.localize("DND.MENU.STYLE.TITLE"),
        action: "styles",
        children: [
          //... Liste des styles
          {
            title: game.i18n.localize("DND.MENU.STYLE.ADVICE"),
            action: "advice",
            cmd: () => insertAdviceOrQuestBlock("advice"),
          },
          {
            title: game.i18n.localize("DND.MENU.STYLE.QUEST"),
            action: "quest-blocks",
            cmd: () => insertAdviceOrQuestBlock("quest"),
          },
          {
            title: game.i18n.localize("DND.MENU.STYLE.TREASURE"),
            action: "treasure",
            cmd: () => insertAdviceOrQuestBlock("treasure"),
          },
          {
            title: game.i18n.localize("DND.MENU.STYLE.NARRATIVE"),
            action: "narrative",
            node: proseMirrorMenu.schema.nodes.div,
            attrs: { class: "fvtt narrative" },
            cmd: () => {
              proseMirrorMenu._toggleBlock(proseMirrorMenu.schema.nodes.div, foundry.prosemirror.commands.wrapIn, {
                attrs: { _preserve: { class: "fvtt narrative" } },
              });
              return true;
            },
          },
          {
            title: game.i18n.localize("DND.MENU.STYLE.NOTABLE"),
            action: "notable",
            node: proseMirrorMenu.schema.nodes.aside,
            attrs: { class: "notable" },
            cmd: () => {
              proseMirrorMenu._toggleBlock(proseMirrorMenu.schema.nodes.aside, foundry.prosemirror.commands.wrapIn, {
                attrs: { _preserve: { class: "notable" } },
              });
              return true;
            },
          },
        ],
      }
    ],
  };
  //#region Fonctions utilitaires
  /**
   * Fonction pour insérer un bloc Advice ou Quest Block.
   * @param {string} type - Le type de bloc ("advice" ou "quest").
   */
  function insertAdviceOrQuestBlock(type) {
    const schema = proseMirrorMenu.schema;
    

    const iconPaths = {
        advice: "icons/vtt-512.png",
        quest: "icons/magic/symbols/question-stone-yellow.webp",
        treasure: "icons/containers/chest/chest-wooden-tied-white.webp"
    };
    
    const iconPath = iconPaths[type];
    const title = game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}_TITLE`);
    const content = game.i18n.localize(`DND.MENU.STYLE.${type.toUpperCase()}_CONTENT`);


    const divClass = type === "treasure" ? "fvtt quest" : `fvtt ${type}`;

    const divNode = schema.nodes.div.create(
        { _preserve: { class: divClass } },
        [
            schema.nodes.figure.create(
                { _preserve: { class: "icon" } },
                [
                    schema.nodes.image.create({
                        src: iconPath,
                        _preserve: { class: "round" }
                    })
                ]
            ),
            schema.nodes.article.create(
                null,
                [
                    schema.nodes.heading.create(
                        { level: 4 }, 
                        schema.text(title)
                    ),
                    schema.nodes.paragraph.create(
                        null, 
                        schema.text(content)
                    )
                ]
            )
        ]
    );

    const transaction = proseMirrorMenu.view.state.tr.replaceSelectionWith(divNode);
    proseMirrorMenu.view.dispatch(transaction);
    return true;
}
    //... Logique d'insertion de référence
  /**
   * Fonction pour insérer une référence dans le journal.
   * @param {string} reference - La référence à insérer.
   */
  function insertReference(reference) {
    const text = `&Reference[${reference}]`;
    proseMirrorMenu.view.dispatch(
      proseMirrorMenu.view.state.tr.insertText(text).scrollIntoView()
    );
  }
});