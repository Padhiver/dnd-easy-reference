const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

//region Constantes
const MENU_CATEGORIES = [
  "conditionTypes",
  "saves",
  "checks",
  "damage",
  "attack",
  "heal",
  "lookup",
  "weaponMasteries",
  "areaTargetTypes",
  "itemProperties",
  "abilities",
  "skills",
  "damageTypes",
  "creatureTypes"
];

//region Hook
Hooks.once("init", () => {
  // Enregistrement d'un sous-menu de configuration
  game.settings.registerMenu("dnd-easy-reference", "menuConfig", {
    name: game.i18n.localize("DND.SETTINGS.MENU.TITLE"),
    label: game.i18n.localize("DND.SETTINGS.MENU.LABEL"),
    hint: game.i18n.localize("DND.SETTINGS.MENU.HINT"),
    icon: "fas fa-list", // Icône du sous-menu
    type: DnDMenuConfigV2, // Type de formulaire associé au sous-menu
    restricted: true, // Indique que ce sous-menu est restreint (accessible uniquement par les administrateurs)
  });

  // Elargir ou non la fenêtre item
  game.settings.register("dnd-easy-reference", "widenItemWindows", {
    name: game.i18n.localize("DND.SETTINGS.PROSEGAP.TITLE"),
    hint: game.i18n.localize("DND.SETTINGS.PROSEGAP.HINT"),
    scope: "world",
    config: true, // Visible dans le menu des paramètres
    type: Boolean,
    default: false,
    requiresReload: true,
    onChange: (value) => {
      if (value) {
        document.documentElement.classList.add("dnd-widen-windows");
      } else {
        document.documentElement.classList.remove("dnd-widen-windows");
      }
    },
  });

  Hooks.once("ready", () => {
    // Appliquer le style au chargement si le paramètre est activé
    if (game.settings.get("dnd-easy-reference", "widenItemWindows")) {
      document.documentElement.classList.add("dnd-widen-windows");
    }
  });

  // Enregistrement des paramètres pour chaque catégorie de menu
  MENU_CATEGORIES.forEach((category) => {
    game.settings.register("dnd-easy-reference", `show${category}`, {
      name: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.TITLE`),
      hint: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.HINT`),
      scope: "world",
      config: false,
      type: Boolean, // Type de données du paramètre
      default: true,
    });
  });
});

/* // Définition de la classe DnDMenuConfig qui hérite de FormApplication
class DnDMenuConfigV2 extends HandlebarsApplicationMixin(ApplicationV2) {
  // Méthode statique pour obtenir les options par défaut du formulaire
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize('DND.SETTINGS.MENU.TITLE'),
      id: 'dnd-menu-config',
      template: 'modules/dnd-easy-reference/templates/menu-config.hbs',
      width: 480 
    });
  }

  // Méthode pour obtenir les données à afficher dans le formulaire
  getData() {
    return {
      categories: MENU_CATEGORIES.map(category => ({
        id: category, 
        name: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.TITLE`), 
        hint: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.HINT`), 
        checked: game.settings.get('dnd-easy-reference', `show${category}`) 
      }))
    };
  }

  // Méthode pour mettre à jour les paramètres lors de la soumission du formulaire
  async _updateObject(event, formData) {
    const updates = Object.entries(formData).map(([key, value]) => {
      const settingKey = key.startsWith('show') ? key : `show${key}`; // Clé du paramètre
      return game.settings.set('dnd-easy-reference', settingKey, value); // Mise à jour du paramètre
    });

    await Promise.all(updates); // Attendre que toutes les mises à jour soient terminées
  }
} */

class DnDMenuConfigV2 extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "dnd-menu-config",
    form: {
      handler: DnDMenuConfigV2.#onSubmit,
      closeOnSubmit: true,
    },
    position: {
      width: 480,
      height: "auto",
    },
    tag: "form",
    window: {
      title: "DND.SETTINGS.MENU.TITLE",
      contentClasses: ["reference-form"],
    },
  };

  get title() {
    return game.i18n.localize(this.options.window.title);
  }

  static PARTS = {
    dnd: {
      template: "modules/dnd-easy-reference/templates/menu-config.hbs",
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    },
  };

  _prepareContext(options) {
    return {
      categories: MENU_CATEGORIES.map((category) => ({
        id: category,
        name: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.TITLE`),
        hint: game.i18n.localize(`DND.MENU.${category.toUpperCase()}.HINT`),
        checked: game.settings.get("dnd-easy-reference", `show${category}`),
      })),
      buttons: [
        { type: "submit", icon: "fa-solid fa-save", label: "SETTINGS.Save" },
      ],
    };
  }

  static async #onSubmit(event, form, formData) {
    const settings = foundry.utils.expandObject(formData.object);
    await Promise.all(
      Object.entries(settings).map(([key, value]) => {
        const settingKey = key.startsWith("show") ? key : `show${key}`;
        return game.settings.set("dnd-easy-reference", settingKey, value);
      })
    );
  }
}
