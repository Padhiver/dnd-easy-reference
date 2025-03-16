//region Constantes

import DamageFormulaDialog from "./applications/damage-formula.js";
import AttackFormulaDialog from "./applications/attack-formula.js";
import CheckFormulaDialog from "./applications/check-formula.js";
import SaveFormulaDialog from "./applications/save-formula.js";
import HealFormulaDialog from "./applications/heal-formula.js";
import LookupFormulaDialog from "./applications/lookup-formula.js";

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
    if (!text) return;
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
    save: async () => {
      const text = await SaveFormulaDialog.create();
      if (text) insertText(text);
    },

    // Dialogue pour les jets d'opposition
    check: async () => {
      const text = await CheckFormulaDialog.create();
      if (text) insertText(text);
    },

    // Dialogue pour les dégâts
    damage: async () => {
      const text = await DamageFormulaDialog.create();
      if (text) insertText(text);
    },

    // Dialogue pour les attaques
    attack: async () => {
      const text = await AttackFormulaDialog.create();
      if (text) insertText(text);
    },

    // Dialogue pour les soins
    heal: async () => {
      const text = await HealFormulaDialog.create();
      if (text) insertText(text);
    },

        // Dialogue pour les lookups
        lookup: async () => {
          const text = await LookupFormulaDialog.create();
          if (text) insertText(text);
        },
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

      ...(game.settings.get('dnd-easy-reference', 'showattack') ? [{
        title: game.i18n.localize('DND.MENU.ATTACK.TITLE'),
        action: 'attack-dialog',
        cmd: () => insertions.attack()
      }] : []),

      ...(game.settings.get('dnd-easy-reference', 'showheal') ? [{
        title: game.i18n.localize('DND.MENU.HEAL.TITLE'),
        action: 'heal-dialog',
        cmd: () => insertions.heal()
      }] : []),

      ...(game.settings.get('dnd-easy-reference', 'showlookup') ? [{
        title: game.i18n.localize('DND.MENU.LOOKUP.TITLE'),
        action: 'lookup-dialog',
        cmd: () => insertions.lookup()
      }] : []),

      // Pour les autres catégories, approche par sous-menu
      ...enabledMenus
        .filter(([key]) => !['saves', 'checks', 'damage', 'heal', 'lookup'].includes(key))
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
