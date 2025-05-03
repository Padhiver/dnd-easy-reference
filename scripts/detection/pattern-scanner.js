import { patternDefinitions } from "./patterns.js";
import PatternPromptDialog from "../applications/pattern-prompt-dialog.js";

import HealFormulaDialog from "../applications/heal-formula.js";
import DamageFormulaDialog from "../applications/damage-formula.js";
import CheckFormulaDialog from "../applications/check-formula.js";
import SaveFormulaDialog from "../applications/save-formula.js";
import AttackFormulaDialog from "../applications/attack-formula.js";
import ConditionFormulaDialog from "../applications/condition-formula.js";
import RuleFormulaDialog from "../applications/rule-formula.js";

// State to track the ongoing scan process
let currentScanState = {
  active: false, //To check if a scan is currently running
  type: null, // Type of pattern being scanned for
  lastIndex: 0, // Global document position to resume searching from
  proseMirrorMenu: null, // Reference to the ProseMirror menu instance
  patternConfig: null, // Configuration for the current pattern type being scanned
  langConfig: null, // Language-specific configuration (maps and patterns)
  currentSelectionRange: null, // {from, to} range of the last found match for potential replacement
  insertTextFunction: null, // Reference to the function used for direct text insertion
};

/**
 * Initiates a scan for patterns of a specific type within the ProseMirror editor.
 * @param {ProseMirrorMenu} proseMirrorMenu - The menu instance containing the editor view.
 * @param {string} enricherType - The key identifying the pattern type (e.g., 'heal', 'save', 'condition').
 * @param {Function} insertTextFunction - Function to insert text directly.
 */
export async function startPatternScan(
  proseMirrorMenu,
  enricherType,
  insertTextFunction
) {
  // Prevents multiple simultaneous scans
  if (currentScanState.active) {
    ui.notifications.warn(
      game.i18n.localize("DND.DETECT.SCAN_ACTIVE") ||
        "A pattern scan is already in progress."
    );
    return;
  }
  // Determines current language and fall back to English if definition is missing
  const lang = game.i18n.lang || "en";
  const langConfig = patternDefinitions[lang] || patternDefinitions["en"];
  const patternConfig = langConfig?.[enricherType];

  // Validates that the necessary pattern and key maps exist for the requested type and language
  let mapCheck = true;
  if (enricherType === "damage" && !langConfig.damageTypeKeyMap)
    mapCheck = false;
  if (
    (enricherType === "check" ||
      enricherType === "save" ||
      enricherType === "ability") &&
    !langConfig.abilityKeyMap
  )
    mapCheck = false;
  if (
    (enricherType === "check" || enricherType === "skill") &&
    (!langConfig.skillKeyMap || !langConfig.toolKeyMap)
  )
    mapCheck = false;
  if (enricherType === "condition" && !langConfig.conditionKeyMap)
    mapCheck = false;
  if (enricherType === "rule" && !langConfig.ruleKeyMap) mapCheck = false;
  if (enricherType === "weaponMastery" && !langConfig.weaponMasteryKeyMap)
    mapCheck = false;
  if (enricherType === "areaTargetType" && !langConfig.areaTargetTypeKeyMap)
    mapCheck = false;
  if (enricherType === "spellProperty" && !langConfig.spellPropertyKeyMap)
    mapCheck = false;
  if (enricherType === "damageType" && !langConfig.damageTypeKeyMap)
    mapCheck = false;
  if (enricherType === "creatureType" && !langConfig.creatureTypeKeyMap)
    mapCheck = false;

  // If configuration is missing, notifies user and exits
  if (!patternConfig || !patternConfig.pattern || !mapCheck) {
    ui.notifications.error(
      game.i18n.format("DND.DETECT.NO_PATTERN_DEF", {
        type: enricherType,
        lang: lang,
      }) ||
        `No pattern definition or key maps found for ${enricherType} in language ${lang} or English.`
    );
    return;
  }

  // Initializes the scan state
  currentScanState = {
    active: true,
    type: enricherType,
    lastIndex: 1,
    proseMirrorMenu: proseMirrorMenu,
    patternConfig: patternConfig,
    langConfig: langConfig,
    currentSelectionRange: null,
    insertTextFunction: insertTextFunction,
  };

  // Notifies user and start the first search iteration
  ui.notifications.info(
    game.i18n.format("DND.DETECT.SCAN_STARTED", { type: enricherType }) ||
      `Scanning for ${enricherType} patterns...`
  );
  await findAndPromptNextMatch();
}

/**
 * Finds the next pattern match in the document starting from `currentScanState.lastIndex`,
 * extracts relevant data, selects the match, prompts the user, and handles
 * replacement/skipping/cancellation. Recursively calls itself to find subsequent matches.
 */
async function findAndPromptNextMatch() {
  // Exit if scan was cancelled
  if (!currentScanState.active) return;

  const { proseMirrorMenu, patternConfig, langConfig, lastIndex, type } =
    currentScanState;

  const view = proseMirrorMenu.view;
  let state = view.state;
  const doc = state.doc;

  let foundMatchData = null; // Stores details of the next valid match

  // Creates a regex for node-by-node search
  const searchRegex = new RegExp(
    patternConfig.pattern.source,
    patternConfig.pattern.flags.replace("g", "")
  );

  // Iterates through text nodes in the document
  doc.descendants((node, pos) => {
    // Stops searching if a match was already found in this iteration
    if (foundMatchData) return false;

    if (node.isText && node.text) {
      const nodeText = node.text;
      const nodeStartPos = pos;

      // Determine where to start searching within this specific node's text
      let searchStartIndexInNode = 0;
      if (lastIndex > nodeStartPos) {
        searchStartIndexInNode =
          lastIndex > 0 ? Math.max(0, lastIndex - nodeStartPos) : 0;
      }

      // Skip node if the search start index is beyond its content
      if (searchStartIndexInNode >= nodeText.length) {
        return;
      }

      // Prepare text and execute the regex match
      let textToSearch = nodeText.substring(searchStartIndexInNode);
      textToSearch = textToSearch.replace(/’/g, "'"); // Normalize smart quotes
      const matchResult = textToSearch.match(searchRegex);

      if (matchResult) {
        const fullMatchText = matchResult[0];

        // Calculate global start/end positions based on node position and match index
        const matchIndexInNode = searchStartIndexInNode + matchResult.index;
        const globalMatchStartPos = nodeStartPos + matchIndexInNode;
        const globalMatchEndPos = globalMatchStartPos + fullMatchText.length;

        // Initialize variables for extracted data
        let initialData = {};
        let referenceKey = null;
        let dataExtracted = false;
        let formula = null;

        // Data Extraction by Type
        // Each block populates `initialData` for dialogs or `referenceKey` for direct references
        // Sets `dataExtracted` to true on successful extraction.
        if (type === "heal") {
          // ... (heal logic remains the same) ...
          const averageValue = matchResult[patternConfig.averageGroup];
          const formulaInParens =
            matchResult[patternConfig.formulaInParensGroup];
          const directFormula = matchResult[patternConfig.directFormulaGroup];
          const isTemporary = !!matchResult[patternConfig.tempGroup];

          if (averageValue && formulaInParens) {
            formula = formulaInParens.trim();
            initialData.average = true;
          } else if (directFormula) {
            formula = directFormula.trim();
            const quoteChar =
              matchResult[patternConfig.directFormulaQuoteGroup];
            if (
              quoteChar &&
              formula.startsWith(quoteChar) &&
              formula.endsWith(quoteChar)
            ) {
              formula = formula.substring(1, formula.length - 1);
            }
            initialData.average = false;
          }

          if (formula) {
            initialData.formula = formula;
            initialData.healType = isTemporary ? "temphp" : "healing";
            dataExtracted = true;
          }
        } else if (type === "save") {
          let dcStr = null;
          let abilityStr = null;
          let useConcentration = false;
          const currentAbilityMap = langConfig.abilityKeyMap;

          if (
            matchResult[patternConfig.concentrationGroup1] ||
            matchResult[patternConfig.concentrationGroup2]
          ) {
            useConcentration = true;
            dcStr =
              matchResult[patternConfig.dcGroup1] ||
              matchResult[patternConfig.dcGroup2];
            abilityStr = "constitution";
          } else if (
            matchResult[patternConfig.abilityGroup1] ||
            matchResult[patternConfig.abilityGroup2]
          ) {
            useConcentration = false;
            abilityStr =
              matchResult[patternConfig.abilityGroup1] ||
              matchResult[patternConfig.abilityGroup2];
            dcStr =
              matchResult[patternConfig.dcGroup1] ||
              matchResult[patternConfig.dcGroup2];
          }

          const abilityKey = abilityStr
            ? currentAbilityMap[abilityStr.toLowerCase().trim()]
            : null;

          if (abilityKey || useConcentration) {
            initialData.dc =
              dcStr && !isNaN(parseInt(dcStr.trim()))
                ? parseInt(dcStr.trim())
                : null;
            initialData.useConcentration = useConcentration;
            if (!useConcentration && abilityKey) {
              initialData.saves = [{ ability: abilityKey }];
            } else if (useConcentration) {
              initialData.saves = [{ ability: "con" }];
            }
            initialData.format = "long";
            dataExtracted = true;
          } else {
            console.warn(
              `Save matched ("${fullMatchText}"), but failed to resolve ability: "${abilityStr}" and not concentration.`
            );
          }
        } else if (type === "check") {
          let dcStr = null;
          let abilityContextStr = null;
          let skillStr = null;
          let toolStr = null;
          let isPassive = false;
          let checkTypeFound = null;
          const currentAbilityMap = langConfig.abilityKeyMap;
          const currentSkillMap = langConfig.skillKeyMap;
          const currentToolMap = langConfig.toolKeyMap;

          if (matchResult[patternConfig.passiveMarker]) {
            isPassive = true;
            skillStr = matchResult[patternConfig.passiveSkill];
            dcStr = matchResult[patternConfig.passiveDcValue];
            checkTypeFound = skillStr;
          } else if (matchResult[patternConfig.checkMarker]) {
            isPassive = false;
            dcStr =
              matchResult[patternConfig.dcValue1] ||
              matchResult[patternConfig.dcValue2];
            abilityContextStr = matchResult[patternConfig.abilityContext];
            const skillOrToolParenStr =
              matchResult[patternConfig.skillOrToolInParen];
            const toolAfterUsingStr = matchResult[patternConfig.toolAfterUsing];
            const skillStandaloneStr =
              matchResult[patternConfig.skillStandalone];
            const toolStandaloneStr = matchResult[patternConfig.toolStandalone];

            if (skillOrToolParenStr) {
              if (currentSkillMap[skillOrToolParenStr.toLowerCase().trim()]) {
                skillStr = skillOrToolParenStr;
                checkTypeFound = skillStr;
              } else if (
                currentToolMap[skillOrToolParenStr.toLowerCase().trim()]
              ) {
                toolStr = skillOrToolParenStr;
                checkTypeFound = toolStr;
              }
            } else if (toolAfterUsingStr) {
              toolStr = toolAfterUsingStr;
              checkTypeFound = toolStr;
            } else if (skillStandaloneStr) {
              skillStr = skillStandaloneStr;
              checkTypeFound = skillStr;
            } else if (toolStandaloneStr) {
              toolStr = toolStandaloneStr;
              checkTypeFound = toolStr;
            } else if (abilityContextStr) {
              checkTypeFound = abilityContextStr;
            }
          }

          let checkTypes = [];
          let mappedKey = null;

          if (checkTypeFound) {
            const typeLower = checkTypeFound.toLowerCase().trim();
            if (currentSkillMap[typeLower])
              mappedKey = currentSkillMap[typeLower];
            else if (currentToolMap[typeLower])
              mappedKey = currentToolMap[typeLower];
            else if (currentAbilityMap[typeLower])
              mappedKey = currentAbilityMap[typeLower];
          }

          if (mappedKey) {
            checkTypes.push({ type: mappedKey });
            initialData.dc =
              dcStr && !isNaN(parseInt(dcStr.trim()))
                ? parseInt(dcStr.trim())
                : null;
            initialData.passive = isPassive;
            initialData.checks = checkTypes;
            initialData.format =
              matchResult[patternConfig.checkMarker] || isPassive
                ? "long"
                : "short";
            dataExtracted = true;
          } else {
            console.warn(
              `Check matched ("${fullMatchText}"), but failed to resolve key for type: "${checkTypeFound}"`
            );
          }
        } else if (type === "damage") {
          const averageValue = matchResult[patternConfig.averageGroup];
          const formulaInParens =
            matchResult[patternConfig.formulaInParensGroup];
          const directFormula = matchResult[patternConfig.directFormulaGroup];
          const damageTypesStr = matchResult[patternConfig.damageTypesGroup];
          const damageKeywordPresent =
            !!matchResult[patternConfig.damageKeywordGroup];
          const currentDamageMap = langConfig.damageTypeKeyMap;

          initialData.average = false;

          if (averageValue && formulaInParens) {
            formula = formulaInParens.trim();
            initialData.average = true;
          } else if (directFormula) {
            formula = directFormula.trim();
            const quoteChar =
              matchResult[patternConfig.directFormulaQuoteGroup];
            if (
              quoteChar &&
              formula.startsWith(quoteChar) &&
              formula.endsWith(quoteChar)
            ) {
              formula = formula.substring(1, formula.length - 1);
            }
          }

          if (
            formula &&
            (damageKeywordPresent || damageTypesStr) &&
            currentDamageMap
          ) {
            initialData.parts = [
              {
                formula: formula,
                types: new Set(),
              },
            ];

            if (damageTypesStr) {
              const typeNames = damageTypesStr.split(/\s+(?:or|ou|,)\s+/i);
              for (const name of typeNames) {
                const key = currentDamageMap[name.toLowerCase().trim()];
                if (key) {
                  initialData.parts[0].types.add(key);
                } else {
                  console.warn(
                    `[Scanner] Damage type "${name}" not found in map.`
                  );
                }
              }
            }
            dataExtracted = true;
          } else {
            console.warn(
              `Damage matched ("${fullMatchText}"), but failed criteria: Formula='${formula}', KeywordPresent=${damageKeywordPresent}, TypesString='${damageTypesStr}'`
            );
          }
        } else if (type === "attack") {
          const sign = matchResult[patternConfig.signGroup];
          const number = matchResult[patternConfig.numberGroup];

          if (sign && number) {
            initialData.formula = `${sign}${number.trim()}`;
            dataExtracted = true;
          }
        } else if (type === "condition") {
          const conditionNameStr =
            matchResult[patternConfig.conditionNameGroup];
          const currentConditionMap = langConfig.conditionKeyMap;
          if (conditionNameStr && currentConditionMap) {
            referenceKey =
              currentConditionMap[conditionNameStr.toLowerCase().trim()];
            if (referenceKey) {
              initialData.condition = referenceKey;
              dataExtracted = true;
            } else {
              console.warn(
                `Condition matched ("${fullMatchText}"), but failed to resolve key for: "${conditionNameStr}"`
              );
            }
          } else {
            console.warn(
              `Condition matched ("${fullMatchText}"), but name string or map was missing.`
            );
          }
        } else if (type === "rule") {
          const ruleNameStr = matchResult[patternConfig.ruleNameGroup];
          const currentRuleMap = langConfig.ruleKeyMap;
          if (ruleNameStr && currentRuleMap) {
            referenceKey = currentRuleMap[ruleNameStr.toLowerCase().trim()];
            if (referenceKey) {
              initialData.rule = referenceKey;
              dataExtracted = true;
            } else {
              console.warn(
                `Rule matched ("${fullMatchText}"), but failed to resolve key for: "${ruleNameStr}"`
              );
            }
          } else {
            console.warn(
              `Rule matched ("${fullMatchText}"), but name string or map was missing.`
            );
          }
        } else if (type === "weaponMastery") {
          const masteryNameStr = matchResult[patternConfig.masteryNameGroup];
          const currentMasteryMap = langConfig.weaponMasteryKeyMap;
          if (masteryNameStr && currentMasteryMap) {
            referenceKey =
              currentMasteryMap[masteryNameStr.toLowerCase().trim()];
            if (referenceKey) {
              dataExtracted = true;
            } else {
              console.warn(
                `Rule matched ("${fullMatchText}"), but failed to resolve key for: "${masteryNameStr}"`
              );
            }
          } else {
            console.warn(
              `Rule matched ("${fullMatchText}"), but name string or map was missing.`
            );
          }
        } else if (type === "areaTargetType") {
          const areaNameStr = matchResult[patternConfig.areaNameGroup];
          const currentAreaMap = langConfig.areaTargetTypeKeyMap;
          if (areaNameStr && currentAreaMap) {
            referenceKey = currentAreaMap[areaNameStr.toLowerCase().trim()];
            if (referenceKey) {
              dataExtracted = true;
            } else {
              console.warn(
                `Area Target Type matched ("${fullMatchText}"), but failed to resolve key for: "${areaNameStr}"`
              );
            }
          } else {
            console.warn(
              `Area Target Type matched ("${fullMatchText}"), but name string or map was missing.`
            );
          }
        } else if (type === "spellProperty") {
          const propertyNameStr = matchResult[patternConfig.propertyNameGroup];
          const currentPropertyMap = langConfig.spellPropertyKeyMap;
          if (propertyNameStr && currentPropertyMap) {
            referenceKey =
              currentPropertyMap[propertyNameStr.toLowerCase().trim()];
            if (referenceKey) {
              dataExtracted = true;
            } else {
              console.warn(
                `Spell Property matched ("${fullMatchText}"), but failed to resolve key for: "${propertyNameStr}"`
              );
            }
          } else {
            console.warn(
              `Spell Property matched ("${fullMatchText}"), but name string or map was missing.`
            );
          }
        } else if (type === "ability") {
          const abilityNameStr = matchResult[patternConfig.abilityNameGroup];
          const currentMap = langConfig.abilityKeyMap;
          if (abilityNameStr && currentMap) {
            referenceKey = currentMap[abilityNameStr.toLowerCase().trim()];
            if (referenceKey) {
              dataExtracted = true;
            } else {
              console.warn(
                `Ability matched ("${fullMatchText}"), but failed to resolve key for: "${abilityNameStr}"`
              );
            }
          } else {
            console.warn(
              `Ability matched ("${fullMatchText}"), but name string or map was missing.`
            );
          }
        } else if (type === "skill") {
          const skillNameStr = matchResult[patternConfig.skillNameGroup];
          const currentMap = langConfig.skillKeyMap;
          if (skillNameStr && currentMap) {
            referenceKey = currentMap[skillNameStr.toLowerCase().trim()];
            if (referenceKey) {
              dataExtracted = true;
            } else {
              console.warn(
                `Skill matched ("${fullMatchText}"), but failed to resolve key for: "${skillNameStr}"`
              );
            }
          } else {
            console.warn(
              `Skill matched ("${fullMatchText}"), but name string or map was missing.`
            );
          }
        } else if (type === "damageType") {
          const damageTypeNameStr =
            matchResult[patternConfig.damageTypeNameGroup];
          const currentMap = langConfig.damageTypeKeyMap;
          if (damageTypeNameStr && currentMap) {
            referenceKey = currentMap[damageTypeNameStr.toLowerCase().trim()];
            if (referenceKey) {
              dataExtracted = true;
            } else {
              console.warn(
                `Damage Type matched ("${fullMatchText}"), but failed to resolve key for: "${damageTypeNameStr}"`
              );
            }
          } else {
            console.warn(
              `Damage Type matched ("${fullMatchText}"), but name string or map was missing.`
            );
          }
        } else if (type === "creatureType") {
          const typeNameStr = matchResult[patternConfig.typeNameGroup];
          const currentTypeMap = langConfig.creatureTypeKeyMap;
          if (typeNameStr && currentTypeMap) {
            referenceKey = currentTypeMap[typeNameStr.toLowerCase().trim()];
            if (referenceKey) {
              dataExtracted = true;
            } else {
              console.warn(
                `Creature Type matched ("${fullMatchText}"), but failed to resolve key for: "${typeNameStr}"`
              );
            }
          } else {
            console.warn(
              `Creature Type matched ("${fullMatchText}"), but name string or map was missing.`
            );
          }
        }
        // Handles failure to extract data from a matched pattern
        if (!dataExtracted) {
          currentScanState.lastIndex = globalMatchEndPos; // Advances past the problematic match
          foundMatchData = "RESCAN"; // Signals to restart search
          return false;
        } else {
          // Stores successful match data
          foundMatchData = {
            textToSelect: fullMatchText,
            globalFrom: globalMatchStartPos,
            globalTo: globalMatchEndPos,
            nextScanIndex: globalMatchEndPos, // Where the next search should begin
            initialData: initialData, // Data for dialogs
            referenceKey: referenceKey, // Key for direct references
          };
          return false;
        }
      }
    }
    return true; // Continues iterating if no match in this node
  });

  // If extraction failed, immediately starts the next iteration
  if (foundMatchData === "RESCAN") {
    await findAndPromptNextMatch();
    return;
  }

  // If a valid match was found and processed
  if (foundMatchData) {
    const {
      textToSelect,
      globalFrom,
      globalTo,
      nextScanIndex,
      initialData,
      referenceKey,
    } = foundMatchData;

    // Stores the range for selection and replacement
    currentScanState.currentSelectionRange = { from: globalFrom, to: globalTo };

    // Selects the matched text in the editor and focuses the view
    try {
      const { TextSelection } = foundry.prosemirror.state;
      if (!TextSelection) throw new Error("TextSelection not found");
      let currentState = view.state;
      const selection = TextSelection.create(
        currentState.doc,
        globalFrom,
        globalTo
      );
      const trSelect = currentState.tr.setSelection(selection).scrollIntoView();
      view.dispatch(trSelect);
      view.focus(); // To keep focus on editor for visual selection
    } catch (e) {
      // If selection fails, continues scan from next position
      console.error("Error during selection dispatch or focus:", e);
      currentScanState.lastIndex = nextScanIndex;
      await findAndPromptNextMatch();
      return;
    }

    // Opens dialog prompting the user for action (Confirm, Skip, Cancel)
    try {
      const choice = await PatternPromptDialog.create({ textToSelect });

      if (choice === "confirm") {
        let enricherText = null;

        // these are the types that generate a direct &Reference link
        const referenceTypes = [
          "weaponMastery",
          "areaTargetType",
          "spellProperty",
          "ability",
          "skill",
          "damageType",
          "creatureType",
        ];

        // Generates enricher text either directly or via existing dialog
        if (referenceTypes.includes(type)) {
          // Checks if referenceKey was successfully resolved during extraction
          if (referenceKey) {
            enricherText = `&Reference[${referenceKey}]`;
          } else {
            enricherText = null;
          }
        } else {
          // Uses the appropriate dialog for configuration
          const DialogClass = getDialogClassForType(type);
          if (!DialogClass) {
            enricherText = null;
          } else {
            enricherText = await DialogClass.create({ initialData });
          }
        }

        // Replace the original text if enricher text was generated
        if (enricherText && currentScanState.currentSelectionRange) {
          const { from, to } = currentScanState.currentSelectionRange;
          let currentState = view.state;
          try {
            const textNode = currentState.schema.text(enricherText);
            const replaceTr = currentState.tr.replaceWith(from, to, textNode);
            view.dispatch(replaceTr);
            // Updates scan index to position after the inserted text
            currentScanState.lastIndex = from + enricherText.length;
          } catch (e) {
            currentScanState.lastIndex = nextScanIndex;
          }
          await findAndPromptNextMatch();
        } else {
          currentScanState.lastIndex = nextScanIndex;
          await findAndPromptNextMatch();
        }
      } else if (choice === "skip") {
        //Advances index past current match
        currentScanState.lastIndex = nextScanIndex;
        await findAndPromptNextMatch();
      } else {
        //User cancelled scan
        cancelPatternScan();
      }
    } catch (err) {
      //Cancels scan in case of error
      cancelPatternScan();
    }
  } else {
    // No more matches found in the document
    ui.notifications.info(
      game.i18n.format("DND.DETECT.SCAN_COMPLETE", {
        type: currentScanState.type,
      }) ||
        `Finished scanning. No more ${currentScanState.type} patterns found.`
    );
    cancelPatternScan();
  }
}

/**
 * Cancels the current pattern scan, resets state, and clears the editor selection.
 */
function cancelPatternScan() {
  const view = currentScanState.proseMirrorMenu?.view;
  let state = view?.state;

  // Cancels the selection if it matches the last highlighted range
  if (view && state && currentScanState.currentSelectionRange) {
    const { from, to } = currentScanState.currentSelectionRange;
    if (
      !state.selection.empty &&
      state.selection.from === from &&
      state.selection.to === to
    ) {
      const { TextSelection } = foundry.prosemirror.state;
      if (!TextSelection) {
      } else {
        const collapsedSelection = TextSelection.create(state.doc, from, from);
        const tr = state.tr.setSelection(collapsedSelection).scrollIntoView();
        view.dispatch(tr);
      }
    }
  }

  // Resets the global scan state
  currentScanState = {
    active: false,
    type: null,
    lastIndex: 0,
    proseMirrorMenu: null,
    patternConfig: null,
    langConfig: null,
    currentSelectionRange: null,
  };
}

/**
 * Returns the constructor for the appropriate dialog class based on the enricher type.
 * Returns null if the type should be handled by direct reference insertion or is unsupported.
 * @param {string} type - The enricher type key.
 * @returns {Function|null} The dialog class constructor or null.
 */
function getDialogClassForType(type) {
  switch (type) {
    case "heal":
      return HealFormulaDialog;
    case "damage":
      return DamageFormulaDialog;
    case "check":
      return CheckFormulaDialog;
    case "save":
      return SaveFormulaDialog;
    case "attack":
      return AttackFormulaDialog;
    case "condition":
      return ConditionFormulaDialog;
    case "rule":
      return RuleFormulaDialog;

    default:
      // Types handled by direct reference insertion (weaponMastery, areaTargetType, etc.) return null here.
      return null;
  }
}
