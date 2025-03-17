//region Constantes

import DamageFormulaDialog from "./applications/damage-formula.js";
import AttackFormulaDialog from "./applications/attack-formula.js";
import CheckFormulaDialog from "./applications/check-formula.js";
import SaveFormulaDialog from "./applications/save-formula.js";
import HealFormulaDialog from "./applications/heal-formula.js";
import LookupFormulaDialog from "./applications/lookup-formula.js";

// Configuration des menus - structure harmonisée sans suffixes
const MENU_CONFIGS = {
  conditionTypes: {
    source: 'conditionTypes',
    reference: true
  },
  saves: {
    source: 'abilities',
    reference: false
  },
  checks: {
    source: {
      abilities: 'abilities',
      skills: 'skills'
      // Les Tools sont dans _prepareContext de check-formula.js
    },
    reference: false
  },
  damage: {
    source: 'damageTypes',
    reference: false
  },
  heal: {
    source: 'healingTypes',
    reference: false
  },
  weaponMasteries: {
    source: 'weaponMasteries',
    reference: true
  },
  areaTargetTypes: {
    source: 'areaTargetTypes',
    reference: true
  },
  itemProperties: {
    source: 'itemProperties',
    reference: true
  },
  abilities: {
    source: 'abilities',
    reference: true
  },
  skills: {
    source: 'skills',
    reference: true
  },
  damageTypes: {
    source: 'damageTypes',
    reference: true
  },
  creatureTypes: {
    source: 'creatureTypes',
    reference: true
  }
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
    save: async (abilityId) => {
      // Ouvrir le dialogue avec la capacité pré-remplie si fournie
      const options = abilityId ? { defaultAbility: abilityId } : {};
      const text = await SaveFormulaDialog.create(options);
      if (text) insertText(text);
    },

    // Dialogue pour les jets d'opposition
    check: async (skillOrAbility) => {
      // Ouvrir le dialogue avec la compétence ou capacité pré-remplie si fournie
      const options = skillOrAbility ? { defaultType: skillOrAbility } : {};
      const text = await CheckFormulaDialog.create(options);
      if (text) insertText(text);
    },

    // Dialogue pour les dégâts
    damage: async (damageType) => {
      // Ouvrir le dialogue avec le type de dégât pré-rempli si fourni
      const options = damageType ? { defaultType: damageType } : {};
      const text = await DamageFormulaDialog.create(options);
      if (text) insertText(text);
    },

    // Dialogue pour les attaques
    attack: async () => {
      const text = await AttackFormulaDialog.create();
      if (text) insertText(text);
    },

    // Dialogue pour les soins
    heal: async (healType) => {
      // Ouvrir le dialogue avec le type de soin pré-rempli si fourni
      const options = healType ? { defaultType: healType } : {};
      const text = await HealFormulaDialog.create(options);
      if (text) insertText(text);
    },

    // Dialogue pour les lookups
    lookup: async () => {
      const text = await LookupFormulaDialog.create();
      if (text) insertText(text);
    },
  };


  // Fonction pour créer les entrées de menu en fonction de la catégorie et de la configuration
  const createMenuEntries = (category, config) => {
    // Cas spécial pour les jets de sauvegarde
    if (category === 'saves') {
      return Object.keys(CONFIG.DND5E[config.source] || {})
        .map(item => ({
          title: CONFIG.DND5E[config.source][item]?.label || item,
          action: item,
          cmd: () => insertions.save(item)
        }));
    }

    // Cas spécial pour les tests de caractéristiques et compétences
    if (category === 'checks') {
      return [
        ...Object.keys(CONFIG.DND5E[config.source.abilities] || {}).map(ability => ({
          title: CONFIG.DND5E[config.source.abilities][ability]?.label || ability,
          action: ability,
          cmd: () => insertions.check(ability)
        })),
        ...Object.keys(CONFIG.DND5E[config.source.skills] || {}).map(skill => ({
          title: CONFIG.DND5E[config.source.skills][skill]?.label || skill,
          action: skill,
          cmd: () => insertions.check(skill)
        }))
      ];
    }

    // Cas pour les dégâts
    if (category === 'damage') {
      return Object.keys(CONFIG.DND5E[config.source] || {})
        .map(item => ({
          title: CONFIG.DND5E[config.source][item]?.label || item,
          action: item,
          cmd: () => insertions.damage(item)
        }));
    }

    // Cas pour les soins
    if (category === 'heal') {
      return Object.keys(CONFIG.DND5E[config.source] || {})
        .map(item => ({
          title: CONFIG.DND5E[config.source][item]?.label || item,
          action: item,
          cmd: () => insertions.heal(item)
        }));
    }

    // Cas standard pour les références
    return Object.keys(CONFIG.DND5E[config.source] || {})
      .filter(item => !config.reference || CONFIG.DND5E[config.source][item]?.reference)
      .map(item => ({
        title: CONFIG.DND5E[config.source][item]?.label || item,
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
      // Menu simplifié pour sauvegarde, check, damage, attack, heal et lookup
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
        .filter(([key]) => !['saves', 'checks', 'damage', 'heal', 'attack', 'lookup'].includes(key))
        .map(([key, config]) => ({
          title: game.i18n.localize(`DND.MENU.${key.toUpperCase()}.TITLE`),
          action: key,
          children: createMenuEntries(key, config)
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
