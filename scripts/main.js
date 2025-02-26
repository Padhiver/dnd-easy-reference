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
  //region Fonctions
  // Fonctions d'insertion pour les références, sauvegardes et tests
  const insertions = {
    reference: (item, category) => {
      const reference = category === 'weaponMasteries' ? `weaponMastery=${item}` : item;
      insertText(`&Reference[${reference}]`);
    },
    
    // Dialogue pour les jets de sauvegarde
    save: () => {
      new SaveDialog({
        callback: (ability, dc, format) => {
          const formatString = format === 'long' ? ' format=long' : '';
          insertText(`[[/save ${ability} dc=${dc}${formatString}]]`);
        }
      }).render(true);
    },
    
    // Dialogue pour les jets d'opposition
    check: () => {
      new CheckDialog({
        callback: (checkType, dc, format) => {
          const formatString = format === 'long' ? ' format=long' : '';
          insertText(`[[/check ${checkType} dc=${dc}${formatString}]]`);
        }
      }).render(true);
    },
    
    // Dialogue pour les dégâts
    damage: () => {
      new DamageDialog({
        callback: (formula, damageType, average) => {
          insertText(`[[/damage formula=${formula} type=${damageType} average=${average}]]`);
        }
      }).render(true);
    },
    
    // Dialogue pour les soins
    heal: () => {
      new HealDialog({
        callback: (formula, healType) => {
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
  dropdowns.journalEnrichers = {
    action: 'enricher',
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
      
      // Pour les autres catégories, on garde une approche par sous-menu
      ...enabledMenus
        .filter(([key]) => !['saves', 'checks', 'damage', 'heal'].includes(key))
        .map(([key, items]) => ({
          title: game.i18n.localize(`DND.MENU.${key.toUpperCase()}.TITLE`),
          action: key,
          children: createMenuEntries(key, items)
        })),
      
      // Menu des styles (inchangé)
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

class SaveDialog extends Dialog {
  constructor(data) {
    const abilities = CONFIG.DND5E.abilities;
    
    super({
      title: game.i18n.localize('DND.DIALOG.SAVE.TITLE'),
      content: `
        <form>
          <div class="form-group">
            <label>${game.i18n.localize('DND.DIALOG.SAVE.ABILITY')}</label>
            <select id="ability" name="ability">
              ${Object.entries(abilities).map(([key, ability]) => 
                `<option value="${key}">${ability.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>${game.i18n.localize('DND.DIALOG.SAVE.DC')}</label>
            <input type="number" id="dc" name="dc" value="15">
          </div>
          <div class="form-group">
            <label>${game.i18n.localize('DND.DIALOG.SAVE.FORMAT')}</label>
            <select id="format" name="format">
              <option value="short">${game.i18n.localize('DND.SETTINGS.FORMAT.SHORT')}</option>
              <option value="long">${game.i18n.localize('DND.SETTINGS.FORMAT.LONG')}</option>
            </select>
          </div>
        </form>
      `,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('DND.DIALOG.CONFIRM'),
          callback: (html) => {
            const ability = html.find('[name="ability"]').val();
            const dc = html.find('[name="dc"]').val();
            const format = html.find('[name="format"]').val();
            data.callback(ability, dc, format);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('DND.DIALOG.CANCEL')
        }
      },
      default: 'confirm'
    });
  }
}

class CheckDialog extends Dialog {
  constructor(data) {
    const abilities = CONFIG.DND5E.abilities;
    const skills = CONFIG.DND5E.skills;
    
    super({
      title: game.i18n.localize('DND.DIALOG.CHECK.TITLE'),
      content: `
        <form>
          <div class="form-group">
            <label>${game.i18n.localize('DND.DIALOG.CHECK.TYPE')}</label>
            <select id="checkType" name="checkType">
              <optgroup label="${game.i18n.localize('DND.DIALOG.CHECK.ABILITIES')}">
                ${Object.entries(abilities).map(([key, ability]) => 
                  `<option value="${key}">${ability.label}</option>`).join('')}
              </optgroup>
              <optgroup label="${game.i18n.localize('DND.DIALOG.CHECK.SKILLS')}">
                ${Object.entries(skills).map(([key, skill]) => 
                  `<option value="${key}">${skill.label}</option>`).join('')}
              </optgroup>
            </select>
          </div>
          <div class="form-group">
            <label>${game.i18n.localize('DND.DIALOG.CHECK.DC')}</label>
            <input type="number" id="dc" name="dc" value="15">
          </div>
          <div class="form-group">
            <label>${game.i18n.localize('DND.DIALOG.CHECK.FORMAT')}</label>
            <select id="format" name="format">
              <option value="short">${game.i18n.localize('DND.SETTINGS.FORMAT.SHORT')}</option>
              <option value="long">${game.i18n.localize('DND.SETTINGS.FORMAT.LONG')}</option>
            </select>
          </div>
        </form>
      `,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('DND.DIALOG.CONFIRM'),
          callback: (html) => {
            const checkType = html.find('[name="checkType"]').val();
            const dc = html.find('[name="dc"]').val();
            const format = html.find('[name="format"]').val();
            data.callback(checkType, dc, format);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('DND.DIALOG.CANCEL')
        }
      },
      default: 'confirm'
    });
  }
}

class DamageDialog extends Dialog {
  constructor(data) {
    const damageTypes = CONFIG.DND5E.damageTypes;
    
    super({
      title: game.i18n.localize('DND.DIALOG.DAMAGE.TITLE'),
      content: `
        <form>
          <div class="form-group">
            <label>${game.i18n.localize('DND.DIALOG.DAMAGE.FORMULA')}</label>
            <input type="text" id="formula" name="formula" value="1d6">
          </div>
          <div class="form-group">
            <label>${game.i18n.localize('DND.DIALOG.DAMAGE.TYPE')}</label>
            <select id="damageType" name="damageType">
              ${Object.entries(damageTypes).map(([key, damage]) => 
                `<option value="${key}">${damage.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>${game.i18n.localize('DND.DIALOG.DAMAGE.AVERAGE')}</label>
            <select id="average" name="average">
              <option value="false">${game.i18n.localize('DND.DIALOG.DAMAGE.USE_DICE')}</option>
              <option value="true">${game.i18n.localize('DND.DIALOG.DAMAGE.USE_AVERAGE')}</option>
            </select>
          </div>
        </form>
      `,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('DND.DIALOG.CONFIRM'),
          callback: (html) => {
            const formula = html.find('[name="formula"]').val();
            const damageType = html.find('[name="damageType"]').val();
            const average = html.find('[name="average"]').val();
            data.callback(formula, damageType, average);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('DND.DIALOG.CANCEL')
        }
      },
      default: 'confirm'
    });
  }
}

class HealDialog extends Dialog {
  constructor(data) {
    const healingTypes = CONFIG.DND5E.healingTypes;
    
    super({
      title: game.i18n.localize('DND.DIALOG.HEAL.TITLE'),
      content: `
        <form>
          <div class="form-group">
            <label>${game.i18n.localize('DND.DIALOG.HEAL.FORMULA')}</label>
            <input type="text" id="formula" name="formula" value="2d4">
          </div>
          <div class="form-group">
            <label>${game.i18n.localize('DND.DIALOG.HEAL.TYPE')}</label>
            <select id="healType" name="healType">
              ${Object.entries(healingTypes).map(([key, heal]) => 
                `<option value="${key}">${heal.label}</option>`).join('')}
            </select>
          </div>
        </form>
      `,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('DND.DIALOG.CONFIRM'),
          callback: (html) => {
            const formula = html.find('[name="formula"]').val();
            const healType = html.find('[name="healType"]').val();
            data.callback(formula, healType);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('DND.DIALOG.CANCEL')
        }
      },
      default: 'confirm'
    });
  }
}
