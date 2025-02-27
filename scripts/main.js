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
  damage: {
    items: ['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic',
      'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'],
    suffix: '-damage'
  },
  heal: {
    items: ['healing', 'temphp'],
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

  // Fonctions d'insertion pour les références, sauvegardes et tests
  const insertions = {
    reference: (item, category) => {
      const reference = category === 'weaponMasteries' ? `weaponMastery=${item}` : item;
      insertText(`&Reference[${reference}]`);
    },

    // Dialogue pour les jets de sauvegarde
    save: () => {
      new SaveDialogV2({
        callback: (saveString) => {
          // Utiliser la fonction insertText qui est en portée
          insertText(`[[/save ${saveString}]]`);
        }
      }).render(true);
    },

    // Dialogue pour les jets d'opposition
    check: () => {
      new CheckDialogV2({
        callback: (checkString) => {
          // Utiliser la fonction insertText qui est en portée
          insertText(`[[/check ${checkString}]]`);
        }
      }).render(true);
    },

    // Dialogue pour les dégâts
    damage: () => {
      new DamageDialogV2({
        callback: (damageString) => {
          // Utiliser la fonction insertText qui est en portée
          insertText(`[[/damage ${damageString}]]`);
        }
      }).render(true);
    },

    // Dialogue pour les soins
    heal: () => {
      new HealDialogV2({
        callback: (formula, healType) => {
          // Utiliser la fonction insertText qui est en portée
          insertText(`[[/heal formula=${formula} type=${healType}]]`);
        }
      }).render(true);
    }
  };


  // Fonction pour créer les entrées de menu en fonction de la catégorie et des éléments
  const createMenuEntries = (category, items) => {
    if (category === 'saves') {
      // Jets de sauvegarde
      return items.items.map(item => ({
        title: CONFIG.DND5E.abilities[item]?.label || item, // Titre de l'entrée
        action: `${item}${items.suffix}`, // Action associée
        cmd: () => insertions.save(`${item}${items.suffix}`) // Commande à exécuter
      }));
    }

    if (category === 'checks') {
      // Caractéristiques et de compétences
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

    // Dégâts
    if (category === 'damage') {
      return items.items.map(item => ({
        title: CONFIG.DND5E.damageTypes[item]?.label || item,
        action: `${item}${items.suffix}`,
        cmd: () => insertions.damage(`${item}${items.suffix}`)
      }));
    }

    // Soins
    if (category === 'heal') {
      return items.items.map(item => ({
        title: CONFIG.DND5E.healingTypes[item]?.label || item,
        action: item,
        cmd: () => insertions.heal(item)
      }));
    }

    // Cas standard pour les références
    return Object.keys(CONFIG.DND5E?.[items] || {})
      .filter(item => CONFIG.DND5E[items][item]?.reference)
      .map(item => ({
        title: CONFIG.DND5E[items][item]?.label || item,
        action: item,
        cmd: () => insertions.reference(item, category)
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
  dropdowns.dndeasyreference = {
    action: 'reference',
    title: game.i18n.localize('DND.MENU.TITLE'),
    entries: [
      // Menu simplifié pour sauvegarde, check, damage et heal
      ...(game.settings.get('dnd-easy-reference', 'showsaves') ? [{
        title: game.i18n.localize('DND.MENU.SAVES.TITLE'),
        action: 'save-dialog',
        cmd: () => insertions.save()
      }] : []),

      ...(game.settings.get('dnd-easy-reference', 'showchecks') ? [{
        title: game.i18n.localize('DND.MENU.CHECKS.TITLE'),
        action: 'check-dialog',
        cmd: () => insertions.check()
      }] : []),

      ...(game.settings.get('dnd-easy-reference', 'showdamage') ? [{
        title: game.i18n.localize('DND.MENU.DAMAGE.TITLE'),
        action: 'damage-dialog',
        cmd: () => insertions.damage()
      }] : []),

      ...(game.settings.get('dnd-easy-reference', 'showheal') ? [{
        title: game.i18n.localize('DND.MENU.HEAL.TITLE'),
        action: 'heal-dialog',
        cmd: () => insertions.heal()
      }] : []),

      // Pour les autres catégories, approche par sous-menu
      ...enabledMenus
        .filter(([key]) => !['saves', 'checks', 'damage', 'heal'].includes(key))
        .map(([key, items]) => ({
          title: game.i18n.localize(`DND.MENU.${key.toUpperCase()}.TITLE`),
          action: key,
          children: createMenuEntries(key, items)
        })),

      // Menu des styles
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

//region Application V2
// Importation des classes ApplicationV2 et HandlebarsApplicationMixin depuis l'API foundry.applications
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

// Jets de sauvegarde
export class SaveDialogV2 extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "reference-dialog-v2", // Identifiant unique de la boîte de dialogue.
    tag: "form", // Type d'élément HTML utilisé pour la boîte de dialogue.
    form: {
      handler: SaveDialogV2.handleFormSubmit,
      submitOnChange: false,
      closeOnSubmit: true // Indique si la boîte de dialogue doit se fermer après la soumission du formulaire.
    },
    window: {
      title: "DND.MENU.DIALOG", // Titre de la fenêtre de la boîte de dialogue.
      contentClasses: ["dialog-form"] // Classes CSS appliquées au contenu de la boîte de dialogue.
    }
  };
  static PARTS = {
    form: {
      template: "modules/dnd-easy-reference/templates/save-dialog.hbs"
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  static async handleFormSubmit(event, form, formData) {
    const abilityPrimary = formData.get("abilityPrimary");
    const combination = formData.get("combination");
    const abilitySecondary = formData.get("abilitySecondary");
    const dc = formData.get("dc");
    const format = formData.get("format");

    // Construire la chaîne de sauvegarde en fonction de la combinaison
    let saveString = '';

    if (combination === "none") {
      // Cas simple: une seule caractéristique
      saveString = `${abilityPrimary} dc=${dc}`;
    } else if (combination === "or") {
      // Combinaison "ou" entre deux caractéristiques
      saveString = `${abilityPrimary} ${abilitySecondary} dc=${dc}`;
    }

    // Ajouter l'option de format si nécessaire
    if (format === 'long') {
      saveString += ' format=long';
    }

    this.callback(saveString);
  }

  constructor(data) {
    super(data);
    this.callback = data.callback;
  }

  async _prepareContext() {
    return {
      abilities: CONFIG.DND5E.abilities,
      buttons: [
        {
          type: "submit",
          icon: "fas fa-check",
          label: "DND5E.Confirm"
        }
      ]
    };
  }
}

// Jets de caractéristiques
export class CheckDialogV2 extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "reference-dialog-v2",
    tag: "form",
    form: {
      handler: CheckDialogV2.handleFormSubmit,
      submitOnChange: false,
      closeOnSubmit: true
    },
    window: {
      title: "DND.MENU.DIALOG",
      contentClasses: ["dialog-form"]
    }
  };
  static PARTS = {
    form: {
      template: "modules/dnd-easy-reference/templates/check-dialog.hbs"
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  static async handleFormSubmit(event, form, formData) {
    const checkTypePrimary = formData.get("checkTypePrimary");
    const combination = formData.get("combination");
    const checkTypeSecondary = formData.get("checkTypeSecondary");
    const dc = formData.get("dc");
    const format = formData.get("format");

    let checkString = '';

    if (combination === "none") {
      checkString = `${checkTypePrimary} dc=${dc}`;
    } else if (combination === "or") {
      checkString = `${checkTypePrimary} ${checkTypeSecondary} dc=${dc}`;
    }

    if (format === 'long') {
      checkString += ' format=long';
    }

    this.callback(checkString);
  }

  constructor(data) {
    super(data);
    this.callback = data.callback;
  }

  async _prepareContext() {
    return {
      abilities: CONFIG.DND5E.abilities,
      skills: CONFIG.DND5E.skills,
      buttons: [
        {
          type: "submit",
          icon: "fas fa-check",
          label: "DND5E.Confirm"
        }
      ]
    };
  }
}

// Formule de dégâts
export class DamageDialogV2 extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "reference-dialog-v2",
    tag: "form",
    form: {
      handler: DamageDialogV2.handleFormSubmit,
      submitOnChange: false,
      closeOnSubmit: true
    },
    window: {
      title: "DND.MENU.DIALOG",
      contentClasses: ["dialog-form"]
    }
  };
  static PARTS = {
    form: {
      template: "modules/dnd-easy-reference/templates/damage-dialog.hbs"
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  static async handleFormSubmit(event, form, formData) {
    // Récupérer les valeurs des champs
    const formulaPrimary = formData.get("formulaPrimary");
    const damageTypePrimary = formData.get("damageTypePrimary");
    const combination = formData.get("combination");
    const formulaSecondary = formData.get("formulaSecondary");
    const damageTypeSecondary = formData.get("damageTypeSecondary");
    const average = formData.get("average");

    let damageFormula = '';

    if (combination === "none") {

      damageFormula = `formula=${formulaPrimary} type=${damageTypePrimary} average=${average}`;
    } else if (combination === "or") {

      damageFormula = `formula=${formulaPrimary} type=${damageTypePrimary}|${damageTypeSecondary} average=${average}`;
    } else if (combination === "and") {

      damageFormula = `formula=${formulaPrimary} type=${damageTypePrimary} & formula=${formulaSecondary} type=${damageTypeSecondary} average=${average}`;
    }

    this.callback(damageFormula);
  }

  constructor(data) {
    super(data);
    this.callback = data.callback;
  }

  async _prepareContext() {
    return {
      damageTypes: CONFIG.DND5E.damageTypes,
      buttons: [
        {
          type: "submit",
          icon: "fas fa-check",
          label: "DND5E.Confirm"
        }
      ]
    };
  }
}

// Formule de soins
export class HealDialogV2 extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "reference-dialog-v2",
    tag: "form",
    form: {
      handler: HealDialogV2.handleFormSubmit,
      submitOnChange: false,
      closeOnSubmit: true
    },
    window: {
      title: "DND.MENU.DIALOG",
      contentClasses: ["dialog-form"]
    }
  };
  static PARTS = {
    form: {
      template: "modules/dnd-easy-reference/templates/heal-dialog.hbs"
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  static async handleFormSubmit(event, form, formData) {
    const formula = formData.get("formula");
    const healType = formData.get("healType");
    this.callback(formula, healType);
  }

  constructor(data) {
    super(data);
    this.callback = data.callback;
  }

  async _prepareContext() {
    return {
      healingTypes: CONFIG.DND5E.healingTypes,
      buttons: [
        {
          type: "submit",
          icon: "fas fa-check",
          label: "DND5E.Confirm"
        }
      ]
    };
  }
}
