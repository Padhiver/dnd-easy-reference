// File: scripts/applications/condition-formula.js

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { StringField, BooleanField } = foundry.data.fields;

/**
 * @typedef {object} ConditionConfig
 * @property {string} condition   The selected condition ID.
 * @property {boolean} apply      Whether the apply button should be shown.
 */

export default class ConditionFormulaDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["condition-formula-dialog"],
    tag: "form",
    form: {
      handler: ConditionFormulaDialog.handleFormSubmit,
      submitOnChange: true, // Update model on any change
      closeOnSubmit: false, // We manually close on successful submit
    },
    position: {
      width: 400,
      height: "auto",
    },
    window: {
      // Clé i18n pour le titre
      title: "DND.MENU.DIALOG",
      contentClasses: ["standard-form"]
    }
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    config: {
      // Chemin vers le nouveau template Handlebars
      template: "modules/dnd-easy-reference/templates/condition/config.hbs",
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    }
  }

  /* -------------------------------------------------- */

  /**
   * Modèle de données pour stocker les informations du dialogue.
   * @type {ConditionFormulaModel}
   */
  #model = new ConditionFormulaModel();

  /* -------------------------------------------------- */

  /**
   * La configuration résultante à injecter.
   * @type {string|null}
   */
  #config = null;
  get config() {
    return this.#config;
  }

  /* -------------------------------------------------- */

  /**
   * Génère le texte de l'enrichisseur à injecter.
   * @type {string|null}
   */
  get #text() {
    // Vérifier si une condition est sélectionnée
    if (!this.#model.condition) return null;

    // Construire la commande de base
    let command = `&Reference[${this.#model.condition}`;

    // Ajouter 'apply=false' si la case n'est pas cochée
    if (!this.#model.apply) {
      command += ` apply=false`;
    }

    command += `]`; // Fermer la commande
    return command;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = {};

    // Filtrer les conditions pour ne garder que celles avec une référence
    const conditionChoices = Object.entries(CONFIG.DND5E.conditionTypes ?? {})
      .filter(([key, data]) => data?.reference)
      .reduce((acc, [key, data]) => {
        acc[key] = game.i18n.localize(data.label ?? key);
        return acc;
      }, {});


    // Préparer les données pour le menu déroulant des conditions
    context.condition = {
      field: this.#model.schema.getField("condition"),
      value: this.#model.condition,
      choices: conditionChoices,
      // Clé i18n pour le label du champ
      label: game.i18n.localize("DND.MENU.CONDITIONTYPES.TITLE"),
      // Clé i18n pour le texte par défaut (placeholder)
      placeholder: game.i18n.localize("DND.DIALOG.PLACEHOLDER")
    };

    // Préparer les données pour la case à cocher 'apply' (inchangé)
    context.apply = {
      field: this.#model.schema.getField("apply"),
      value: this.#model.apply,
      // Clé i18n pour le label de la case
      label: game.i18n.localize("DND.DIALOG.APPLY")
    };

    // Bouton de confirmation (inchangé)
    context.buttons = [{
      type: "submit",
      icon: "fa-solid fa-check",
      // Clé i18n pour le label du bouton
      label: game.i18n.localize("DND.DIALOG.CONFIRM"),
    }];

    return context;
  }

  /* -------------------------------------------------- */
  /* Gestionnaires d'événements                      */
  /* -------------------------------------------------- */

  /**
   * Gère la soumission du formulaire.
   * @this {ConditionFormulaDialog}
   * @param {SubmitEvent} event             L'événement de soumission.
   * @param {HTMLFormElement} form          L'élément formulaire.
   * @param {FormDataExtended} formData     Les données du formulaire.
   * @param {object} submitOptions          Options de soumission.
   */
  static handleFormSubmit(event, form, formData, submitOptions) {
    switch (event.type) {
      case "change":
        // Mettre à jour le modèle avec les nouvelles données du formulaire
        this.#model.updateSource(formData.object);
        break;
      case "submit":
        // Validation : S'assurer qu'une condition est sélectionnée
        if (!this.#model.condition) {
          ui.notifications.warn(game.i18n.localize("DND.DIALOG.CONDITION.WARN_NO_CONDITION"));
          return; // Empêche la fermeture si aucune condition n'est sélectionnée
        }
        // Générer le texte final et le stocker
        this.#config = this.#text;
        // Appeler le callback (fourni par .create()) avec le résultat
        if (this.callback) this.callback(this.#config);
        // Fermer le dialogue
        this.close();
        break;
    }
  }

  /* -------------------------------------------------- */
  /* Méthodes d'usine                                */
  /* -------------------------------------------------- */

  /**
   * Constructeur pour passer des données supplémentaires, comme un callback.
   * @param {object} data - Données pour le constructeur.
   */
  constructor(data) {
    super(data);
    this.callback = data.callback; // Stocker la fonction de rappel
  }

  /**
   * Crée et affiche une instance asynchrone de cette application.
   * @param {object} [options]            Options de rendu. Peut inclure `initialData`.
   * @returns {Promise<string|null>}      Le texte à injecter, ou `null` si le dialogue a été fermé sans confirmer.
   */
  static async create(options = {}) {
    const { promise, resolve } = Promise.withResolvers();
    // Créer l'instance, en passant la fonction resolve comme callback
    const application = new this({ ...options, callback: resolve });
    // Si des données initiales sont fournies, les appliquer au modèle
    if (options.initialData) {
      application.#model.updateSource(options.initialData);
    }
    application.render({ force: true });
    // Gérer la fermeture manuelle (sans soumission via le bouton)
    application.addEventListener("close", (event) => {
      // Si le dialogue est fermé sans que #config ait été défini (pas de soumission réussie),
      // résoudre la promesse avec null.
      if (application.config === null) {
        resolve(null);
      }
    }, { once: true });
    return promise; // La promesse sera résolue par le callback ou l'écouteur de fermeture
  }
}

/* -------------------------------------------------- */

/**
 * Modèle de données utilitaire pour conserver les données entre les rendus.
 */
class ConditionFormulaModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    // Filtrer les IDs des conditions pour ne garder que ceux avec une référence
    const conditionIds = Object.entries(CONFIG.DND5E.conditionTypes ?? {})
        .filter(([key, data]) => data?.reference) // <-- Ajout du filtre ici
        .map(([key, _]) => key); // Obtenir seulement les clés (IDs)

    // Définir une valeur initiale avec le premier ID filtré si disponible
    const initialCondition = conditionIds.length > 0 ? conditionIds[0] : "";

    return {
      condition: new StringField({
        required: true, // Une condition doit être sélectionnée
        blank: false, // Ne peut pas être vide
        initial: initialCondition, // Valeur initiale basée sur les conditions filtrées
        choices: conditionIds, // Utiliser les IDs filtrés pour la validation du modèle
        label: "DND.CONDITIONTYPES.TITLE"
      }),
      apply: new BooleanField({
        required: true,
        initial: true, // Par défaut, montrer le bouton "Apply"
        label: "DND.DIALOG.CONFIRM"
      })
    };
  }
}