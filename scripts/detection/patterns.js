// English Definitions
//Abilities
const enAbilityMap = {
	strength: "str",
	dexterity: "dex",
	constitution: "con",
	intelligence: "int",
	wisdom: "wis",
	charisma: "cha",
};

//Skills
const enSkillMap = {
	acrobatics: "acr",
	"animal handling": "ani",
	arcana: "arc",
	athletics: "ath",
	deception: "dec",
	history: "his",
	insight: "ins",
	intimidation: "itm",
	investigation: "inv",
	medicine: "med",
	nature: "nat",
	perception: "prc",
	performance: "prf",
	persuasion: "per",
	religion: "rel",
	"sleight of hand": "slt",
	stealth: "ste",
	survival: "sur",
};

//Tools
const enToolMap = {
	"alchemist's supplies": "alchemist",
	"brewer's supplies": "brewer",
	"calligrapher's supplies": "calligrapher",
	"carpenter's tools": "carpenter",
	"cartographer's tools": "cartographer",
	"cobbler's tools": "cobbler",
	"cook's utensils": "cook",
	"glassblower's tools": "glassblower",
	"jeweler's tools": "jeweler",
	"leatherworker's tools": "leatherworker",
	"mason's tools": "mason",
	"painter's supplies": "painter",
	"potter's tools": "potter",
	"smith's tools": "smith",
	"tinker's tools": "tinker",
	"weaver's tools": "weaver",
	"woodcarver's tools": "woodcarver",
	"disguise kit": "disg",
	"forgery kit": "forg",
	"dice set": "dice",
	dice: "dice",
	"dragonchess set": "chess",
	dragonchess: "chess",
	"playing card set": "card",
	"playing cards": "card",
	"herbalism kit": "herb",
	bagpipes: "bagpipes",
	drum: "drum",
	dulcimer: "dulcimer",
	flute: "flute",
	horn: "horn",
	lute: "lute",
	lyre: "lyre",
	"pan flute": "panflute",
	shawm: "shawm",
	viol: "viol",
	"navigator's tools": "navg",
	"poisoner's kit": "pois",
	"thieves' tools": "thief",
	"vehicle (air)": "air",
	"air vehicle": "air",
	"vehicle (land)": "land",
	"land vehicle": "land",
	"vehicle (space)": "space",
	"space vehicle": "space",
	"vehicle (water)": "water",
	"water vehicle": "water",
};

//Damage Types
const enDamageTypeMap = {
	acid: "acid",
	bludgeoning: "bludgeoning",
	cold: "cold",
	fire: "fire",
	force: "force",
	lightning: "lightning",
	necrotic: "necrotic",
	piercing: "piercing",
	poison: "poison",
	psychic: "psychic",
	radiant: "radiant",
	slashing: "slashing",
	thunder: "thunder",
};

//Conditions
const enConditionMap = {
	blinded: "blinded",
	charmed: "charmed",
	deafened: "deafened",
	exhaustion: "exhaustion",
	frightened: "frightened",
	grappled: "grappled",
	incapacitated: "incapacitated",
	invisible: "invisible",
	paralyzed: "paralyzed",
	poisoned: "poisoned",
	prone: "prone",
	restrained: "restrained",
	stunned: "stunned",
	unconscious: "unconscious",
	blind: "blinded",
	deaf: "deafened",
	exhausted: "exhaustion",
	frightened: "frightened",
	grappled: "grappled",
	incapacitated: "incapacitated",
	invisible: "invisible",
	petrified: "petrified",
};

//Rules
const enRuleMap = {
	inspiration: "inspiration",
	"carrying capacity": "carryingcapacity",
	push: "push",
	drag: "drag",
	lift: "lift",
	encumbrance: "encumbrance",
	hiding: "hiding",
	"passive perception": "passiveperception",
	time: "time",
	speed: "speed",
	"travel pace": "travelpace",
	"forced march": "forcedmarch",
	"difficult terrain pace": "difficultterrainpace",
	climbing: "climbing",
	swimming: "swimming",
	"long jump": "longjump",
	"high jump": "highjump",
	jumping: "jumping",
	falling: "falling",
	suffocating: "suffocating",
	vision: "vision",
	light: "light",
	"lightly obscured": "lightlyobscured",
	"heavily obscured": "heavilyobscured",
	"bright light": "brightlight",
	"dim light": "dimlight",
	darkness: "darkness",
	blindsight: "blindsight",
	darkvision: "darkvision",
	tremorsense: "tremorsense",
	truesight: "truesight",
	food: "food",
	water: "water",
	resting: "resting",
	"short rest": "shortrest",
	"long rest": "longrest",
	surprise: "surprise",
	initiative: "initiative",
	"bonus action": "bonusaction",
	reaction: "reaction",
	"difficult terrain": "difficultterrain",
	"being prone": "beingprone",
	"dropping prone": "droppingprone",
	"standing up": "standingup",
	crawling: "crawling",
	"moving around other creatures": "movingaroundothercreatures",
	flying: "flying",
	size: "size",
	space: "space",
	squeezing: "squeezing",
	attack: "attack",
	"cast a spell": "castaspell",
	dash: "dash",
	disengage: "disengage",
	dodge: "dodge",
	help: "help",
	hide: "hide",
	ready: "ready",
	search: "search",
	"use an object": "useanobject",
	"attack rolls": "attackrolls",
	"unseen attackers": "unseenattackers",
	"unseen targets": "unseentargets",
	"ranged attacks": "rangedattacks",
	range: "range",
	"ranged attacks in close combat": "rangedattacksinclosecombat",
	"melee attacks": "meleeattacks",
	reach: "reach",
	"unarmed strike": "unarmedstrike",
	"opportunity attacks": "opportunityattacks",
	"two weapon fighting": "twoweaponfighting",
	grappling: "grappling",
	"escaping a grapple": "escapingagrapple",
	"moving a grappled creature": "movingagrappledcreature",
	shoving: "shoving",
	cover: "cover",
	"half cover": "halfcover",
	"three quarters cover": "threequarterscover",
	"total cover": "totalcover",
	"hit points": "hitpoints",
	"damage rolls": "damagerolls",
	"critical hits": "criticalhits",
	"damage types": "damagetypes",
	"damage resistance": "damageresistance",
	resistance: "resistance",
	"damage vulnerability": "damagevulnerability",
	vulnerability: "damagevulnerability",
	healing: "healing",
	"instant death": "instantdeath",
	"death saving throws": "deathsavingthrows",
	"death saves": "deathsaves",
	stabilizing: "stabilizing",
	"knocking a creature out": "knockingacreatureout",
	"temporary hit points": "temporaryhitpoints",
	"temp hp": "temphp",
	mounting: "mounting",
	dismounting: "dismounting",
	"controlling a mount": "controllingamount",
	"underwater combat": "underwatercombat",
	"spell level": "spelllevel",
	"known spells": "knownspells",
	"prepared spells": "preparedspells",
	"spell slots": "spellslots",
	"casting at a higher level": "castingatahigherlevel",
	upcasting: "upcasting",
	"casting in armor": "castinginarmor",
	cantrips: "cantrips",
	rituals: "rituals",
	"casting time": "castingtime",
	"bonus action casting": "bonusactioncasting",
	"reaction casting": "reactioncasting",
	"longer casting times": "longercastingtimes",
	"spell range": "spellrange",
	components: "components",
	verbal: "verbal",
	somatic: "somatic",
	material: "material",
	"spell duration": "spellduration",
	instantaneous: "instantaneous",
	concentrating: "concentrating",
	concentration: "concentrating",
	"spell targets": "spelltargets",
	"area of effect": "areaofeffect",
	aoe: "areaofeffect",
	"point of origin": "pointoforigin",
	"spell saving throws": "spellsavingthrows",
	"spell attack rolls": "spellattackrolls",
	"combining magical effects": "combiningmagicaleffects",
	"schools of magic": "schoolsofmagic",
	"detecting traps": "detectingtraps",
	"disabling traps": "disablingtraps",
	"curing madness": "curingmadness",
	"damage threshold": "damagethreshold",
	"poison types": "poisontypes",
	"contact poison": "contactpoison",
	"ingested poison": "ingestedpoison",
	"inhaled poison": "inhaledpoison",
	"injury poison": "injurypoison",
	attunement: "attunement",
	"wearing items": "wearingitems",
	"wielding items": "wieldingitems",
	"multiple items of the same kind": "multipleitemsofthesamekind",
	"paired items": "paireditems",
	"command word": "commandword",
	consumables: "consumables",
	"item spells": "itemspells",
	charges: "charges",
	"spell scroll": "spellscroll",
	"creature tags": "creaturetags",
	telepathy: "telepathy",
	"legendary actions": "legendaryactions",
	"lair actions": "lairactions",
	"regional effects": "regionaleffects",
	disease: "disease",
	"d20 test": "d20test",
	advantage: "advantage",
	disadvantage: "disadvantage",
	"difficulty class": "difficultyclass",
	dc: "difficultyclass",
	"armor class": "armorclass",
	ac: "armorclass",
	"ability check": "abilitycheck",
	"saving throw": "savingthrow",
	"challenge rating": "challengerating",
	cr: "challengerating",
	expertise: "expertise",
	influence: "influence",
	magic: "magic",
	study: "study",
	utilize: "utilize",
	friendly: "friendly",
	indifferent: "indifferent",
	hostile: "hostile",
	"breaking objects": "breakingobjects",
	hazards: "hazards",
	bloodied: "bloodied",
};

//Weapon Masteries
const enWeaponMasteryMap = {
	cleave: "cleave",
	graze: "graze",
	nick: "nick",
	push: "push",
	sap: "sap",
	slow: "slow",
	topple: "topple",
	vex: "vex",
};

//Area Targets
const enAreaTargetTypeMap = {
	cone: "cone",
	cube: "cube",
	cylinder: "cylinder",
	line: "line",
	radius: "radius",
};

//Spell Properties
const enSpellPropertyMap = {
	concentration: "concentration",
	material: "material",
	ritual: "ritual",
	somatic: "somatic",
	verbal: "verbal",
};

//Creature Types
const enCreatureTypeMap = {
	aberration: "aberration",
	beast: "beast",
	celestial: "celestial",
	construct: "construct",
	dragon: "dragon",
	elemental: "elemental",
	fey: "fey",
	fiend: "fiend",
	giant: "giant",
	humanoid: "humanoid",
	monstrosity: "monstrosity",
	ooze: "ooze",
	plant: "plant",
	undead: "undead",
};

const enAbilityList = buildAlternationGroup(enAbilityMap);
const enSkillList = buildAlternationGroup(enSkillMap);
const enToolList = buildAlternationGroup(enToolMap);
const enDamageTypeList = buildAlternationGroup(enDamageTypeMap);
const enConditionList = buildAlternationGroup(enConditionMap);
const enRuleList = buildAlternationGroup(enRuleMap);
const enWeaponMasteryList = buildAlternationGroup(enWeaponMasteryMap);
const enAreaTargetTypeList = buildAlternationGroup(enAreaTargetTypeMap);
const enSpellPropertyList = buildAlternationGroup(enSpellPropertyMap);
const enCreatureTypeList = buildAlternationGroup(enCreatureTypeMap);

// French Definitions (Needs to be reviewed by a native speaker)
const frAbilityMap = {
	force: "str",
	dextérité: "dex",
	constitution: "con",
	intelligence: "int",
	sagesse: "wis",
	charisme: "cha",
};
const frSkillMap = {
	acrobaties: "acr",
	acrobatie: "acr",
	dressage: "ani",
	arcanes: "arc",
	athlétisme: "ath",
	tromperie: "dec",
	histoire: "his",
	perspicacité: "ins",
	intimidation: "itm",
	investigation: "inv",
	médecine: "med",
	nature: "nat",
	perception: "prc",
	représentation: "prf",
	persuasion: "per",
	religion: "rel",
	escamotage: "slt",
	discrétion: "ste",
	survie: "sur",
};
const frToolMap = {
	"matériel d'alchimiste": "alchemist",
	"matériel de brasseur": "brewer",
	"matériel de calligraphe": "calligrapher",
	"outils de charpentier": "carpenter",
	"outils de cartographe": "cartographer",
	"outils de cordonnier": "cobbler",
	"ustensiles de cuisinier": "cook",
	"outils de souffleur de verre": "glassblower",
	"outils de bijoutier": "jeweler",
	"outils de tanneur": "leatherworker",
	"outils de maçon": "mason",
	"matériel de peintre": "painter",
	"outils de potier": "potter",
	"outils de forgeron": "smith",
	"outils de bricoleur": "tinker",
	"outils de tisserand": "weaver",
	"outils de menuisier": "woodcarver",
	"kit de déguisement": "disg",
	"kit de contrefaçon": "forg",
	dés: "dice",
	"jeu d'échecs draconiques": "chess",
	"échecs draconiques": "chess",
	"jeu de cartes": "card",
	"kit d'herboriste": "herb",
	cornemuse: "bagpipes",
	tambour: "drum",
	tympanon: "dulcimer",
	flûte: "flute",
	cor: "horn",
	luth: "lute",
	lyre: "lyre",
	"flûte de pan": "panflute",
	chalemie: "shawm",
	viole: "viol",
	"outils de navigateur": "navg",
	"kit d'empoisonneur": "pois",
	"outils de voleur": "thief",
	"véhicule (aérien)": "air",
	"véhicule aérien": "air",
	"véhicule (terrestre)": "land",
	"véhicule terrestre": "land",
	"véhicule (spatial)": "space",
	"véhicule spatial": "space",
	"véhicule (aquatique)": "water",
	"véhicule aquatique": "water",
};

const frDamageTypeMap = {
	acide: "acid",
	contondant: "bludgeoning",
	contondants: "bludgeoning",
	froid: "cold",
	feu: "fire",
	force: "force",
	foudre: "lightning",
	nécrotique: "necrotic",
	nécrotiques: "necrotic",
	perforant: "piercing",
	perforants: "piercing",
	poison: "poison",
	psychique: "psychic",
	psychiques: "psychic",
	radiant: "radiant",
	radiants: "radiant",
	tranchant: "slashing",
	tranchants: "slashing",
	tonnerre: "thunder",
};

const frConditionMap = {
	aveuglé: "blinded",
	aveuglée: "blinded",
	charmé: "charmed",
	charmée: "charmed",
	assourdi: "deafened",
	assourdie: "deafened",
	épuisement: "exhaustion",
	épuisé: "exhaustion",
	épuisée: "exhaustion",
	effrayé: "frightened",
	effrayée: "frightened",
	agrippé: "grappled",
	agrippée: "grappled",
	incapacité: "incapacitated",
	incapable: "incapacitated",
	invisible: "invisible",
	paralysé: "paralyzed",
	paralysée: "paralyzed",
	pétrifié: "petrified",
	pétrifiée: "petrified",
	empoisonné: "poisoned",
	empoisonnée: "poisoned",
	"à terre": "prone",
	entravé: "restrained",
	entravée: "restrained",
	étourdi: "stunned",
	étourdie: "stunned",
	inconscient: "unconscious",
	inconsciente: "unconscious",
};

const frRuleMap = {
	inspiration: "inspiration",
	"capacité de port": "carryingcapacity",
	pousser: "push",
	traîner: "drag",
	soulever: "lift",
	encombrement: "encumbrance",
	"se cacher": "hiding",
	"perception passive": "passiveperception",
	temps: "time",
	vitesse: "speed",
	"allure de déplacement": "travelpace",
	"marche forcée": "forcedmarch",
	"allure en terrain difficile": "difficultterrainpace",
	escalade: "climbing",
	nage: "swimming",
	"saut en longueur": "longjump",
	"saut en hauteur": "highjump",
	sauter: "jumping",
	chute: "falling",
	suffocation: "suffocating",
	vision: "vision",
	lumière: "light",
	"zone faiblement obscurcie": "lightlyobscured",
	"zone lourdement obscurcie": "heavilyobscured",
	"lumière vive": "brightlight",
	"lumière faible": "dimlight",
	obscurité: "darkness",
	"vision aveugle": "blindsight",
	"vision dans le noir": "darkvision",
	"perception des vibrations": "tremorsense",
	"vision véritable": "truesight",
	nourriture: "food",
	eau: "water",
	repos: "resting",
	"repos court": "shortrest",
	"repos long": "longrest",
	surprise: "surprise",
	initiative: "initiative",
	"action bonus": "bonusaction",
	réaction: "reaction",
	"terrain difficile": "difficultterrain",
	"être à terre": "beingprone",
	"tomber à terre": "droppingprone",
	"se relever": "standingup",
	ramper: "crawling",
	"se déplacer autour d'autres créatures": "movingaroundothercreatures",
	vol: "flying",
	taille: "size",
	espace: "space",
	"se faufiler": "squeezing",
	attaque: "attack",
	"lancer un sort": "castaspell",
	foncer: "dash",
	"se désengager": "disengage",
	esquiver: "dodge",
	aider: "help",
	"se préparer": "ready",
	chercher: "search",
	"utiliser un objet": "useanobject",
	"jets d'attaque": "attackrolls",
	"attaquants invisibles": "unseenattackers",
	"cibles invisibles": "unseentargets",
	"attaques à distance": "rangedattacks",
	portée: "range",
	"attaques à distance au corps à corps": "rangedattacksinclosecombat",
	"attaques au corps à corps": "meleeattacks",
	allonge: "reach",
	"attaque à mains nues": "unarmedstrike",
	"attaques d'opportunité": "opportunityattacks",
	"combat à deux armes": "twoweaponfighting",
	lutte: "grappling",
	"s'échapper d'une lutte": "escapingagrapple",
	"déplacer une créature agrippée": "movingagrappledcreature",
	bousculer: "shoving",
	abri: "cover",
	"abri partiel": "halfcover",
	"abri trois quarts": "threequarterscover",
	"abri total": "totalcover",
	"points de vie": "hitpoints",
	"jets de dégâts": "damagerolls",
	"coups critiques": "criticalhits",
	"types de dégâts": "damagetypes",
	"résistance aux dégâts": "damageresistance",
	résistance: "resistance",
	"vulnérabilité aux dégâts": "damagevulnerability",
	vulnérabilité: "damagevulnerability",
	guérison: "healing",
	"mort instantanée": "instantdeath",
	"jets de sauvegarde contre la mort": "deathsavingthrows",
	stabiliser: "stabilizing",
	"assommer une créature": "knockingacreatureout",
	"points de vie temporaires": "temporaryhitpoints",
	"pv temporaires": "temphp",
	monter: "mounting",
	descendre: "dismounting",
	"contrôler une monture": "controllingamount",
	"combat sous-marin": "underwatercombat",
	"niveau de sort": "spelllevel",
	"sorts connus": "knownspells",
	"sorts préparés": "preparedspells",
	"emplacements de sorts": "spellslots",
	"lancer à un niveau supérieur": "castingatahigherlevel",
	"incantation en armure": "castinginarmor",
	"tours de magie": "cantrips",
	rituels: "rituals",
	"temps d'incantation": "castingtime",
	"incantation en action bonus": "bonusactioncasting",
	"incantation en réaction": "reactioncasting",
	"temps d'incantation longs": "longercastingtimes",
	"portée du sort": "spellrange",
	composantes: "components",
	verbale: "verbal",
	gestuelle: "somatic",
	matérielle: "material",
	"durée du sort": "spellduration",
	instantané: "instantaneous",
	concentration: "concentrating",
	"cibles du sort": "spelltargets",
	"zone d'effet": "areaofeffect",
	"zd'e": "areaofeffect",
	"point d'origine": "pointoforigin",
	"jets de sauvegarde contre les sorts": "spellsavingthrows",
	"jets d'attaque de sort": "spellattackrolls",
	"combinaison d'effets magiques": "combiningmagicaleffects",
	"écoles de magie": "schoolsofmagic",
	"détecter les pièges": "detectingtraps",
	"désamorcer les pièges": "disablingtraps",
	"soigner la folie": "curingmadness",
	"seuil de dégâts": "damagethreshold",
	"types de poison": "poisontypes",
	"poison de contact": "contactpoison",
	"poison ingéré": "ingestedpoison",
	"poison inhalé": "inhaledpoison",
	"poison par blessure": "injurypoison",
	harmonisation: "attunement",
	"porter des objets": "wearingitems",
	"manier des objets": "wieldingitems",
	"objets multiples du même type": "multipleitemsofthesamekind",
	"objets en paire": "paireditems",
	"mot de commande": "commandword",
	consommables: "consumables",
	"sorts d'objet": "itemspells",
	charges: "charges",
	"parchemin de sort": "spellscroll",
	télépathie: "telepathy",
	"actions légendaires": "legendaryactions",
	"actions de repaire": "lairactions",
	"effets régionaux": "regionaleffects",
	maladie: "disease",
	"test de d20": "d20test",
	avantage: "advantage",
	désavantage: "disadvantage",
	"classe de difficulté": "difficultyclass",
	cd: "difficultyclass",
	"classe d'armure": "armorclass",
	ca: "armorclass",
	"test de caractéristique": "abilitycheck",
	"jet de sauvegarde": "savingthrow",
	"facteur de puissance": "challengerating",
	fp: "challengerating",
	expertise: "expertise",
	influence: "influence",
	magie: "magic",
	étudier: "study",
	utiliser: "utilize",
	amical: "friendly",
	indifférent: "indifferent",
	hostile: "hostile",
	"briser des objets": "breakingobjects",
	dangers: "hazards",
	sanguinolent: "bloodied",
};
const frWeaponMasteryMap = {
	taillade: "cleave",
	érafler: "graze",
	coupure: "nick",
	repousser: "push",
	affaiblir: "sap",
	ralentir: "slow",
	renverser: "topple",
	harceler: "vex",
};

const frAreaTargetTypeMap = {
	cône: "cone",
	cube: "cube",
	cylindre: "cylinder",
	ligne: "line",
	rayon: "radius",
};

const frSpellPropertyMap = {
	concentration: "concentration",
	materiel: "material",
	rituel: "ritual",
	somatique: "somatic",
	verbal: "verbal",
};

const frCreatureTypeMap = {
	aberration: "aberration",
	bête: "beast",
	céleste: "celestial",
	"créature artificielle": "construct",
	dragon: "dragon",
	élémentaire: "elemental",
	fée: "fey",
	fiélon: "fiend",
	géant: "giant",
	humanoïde: "humanoid",
	monstruosité: "monstrosity",
	vase: "ooze",
	plante: "plant",
	"mort-vivant": "undead",
};

const frAbilityList = buildAlternationGroup(frAbilityMap);
const frSkillList = buildAlternationGroup(frSkillMap);
const frToolList = buildAlternationGroup(frToolMap);
const frDamageTypeList = buildAlternationGroup(frDamageTypeMap);
const frConditionList = buildAlternationGroup(frConditionMap);
const frRuleList = buildAlternationGroup(frRuleMap);
const frWeaponMasteryList = buildAlternationGroup(frWeaponMasteryMap);
const frAreaTargetTypeList = buildAlternationGroup(frAreaTargetTypeMap);
const frSpellPropertyList = buildAlternationGroup(frSpellPropertyMap);
const frCreatureTypeList = buildAlternationGroup(frCreatureTypeMap);

/**
 * Builds a regex alternation group (?:key1|key2|...) from map keys.
 */
function buildAlternationGroup(map) {
	if (!map || typeof map !== "object") return "";

	// Escape basic regex chars
	const escapedKeys = Object.keys(map)
		.map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
		.sort((a, b) => b.length - a.length);

	if (escapedKeys.length === 0) return "";

	return `(?:${escapedKeys.join("|")})`;
}

// Exported Pattern Definitions
export const patternDefinitions = {
	en: {
		abilityKeyMap: enAbilityMap,
		skillKeyMap: enSkillMap,
		toolKeyMap: enToolMap,
		damageTypeKeyMap: enDamageTypeMap,
		conditionKeyMap: enConditionMap,
		ruleKeyMap: enRuleMap,
		weaponMasteryKeyMap: enWeaponMasteryMap,
		areaTargetTypeKeyMap: enAreaTargetTypeMap,
		spellPropertyKeyMap: enSpellPropertyMap,
		creatureTypeKeyMap: enCreatureTypeMap,
		// Matches "X (Formula) [temporary] hit points" or "'Formula' [temporary] hit points"
		heal: {
			pattern:
				/(?:(\d+)\s*\(\s*('?)(\d+(?:d\d+)?(?:\s*[+-]\s*\d+)*)\2\s*\)|('?)(\d+(?:d\d+)?(?:\s*[+-]\s*\d+)*)\4)\s+(?:(temporary)\s+)?hit\s+points?\b/gi,
			// Average value
			averageGroup: 1,
			// Formula within parenthesis
			formulaInParensGroup: 3,
			// Optional quote for direct formula
			directFormulaQuoteGroup: 4,
			// Direct formula value
			directFormulaGroup: 5,
			// "temporary" keyword
			tempGroup: 6,
		},
		// Matches "[DC XX] Ability saving throw/save", "[DC XX] Concentration check/saving throw/save", "Ability saving throw/save [DC XX]", "Ability saving throw/save [(DC XX)]", "Concentration check/saving throw/save [DC XX]", or "Concentration check/saving throw/save [(DC XX)]"
		save: {
			pattern: new RegExp(
				String.raw`(?:(?:DC\s+(\d+)\s+(?:(${enAbilityList})\s+(?:saving\s+throw|save)|(Concentration)\s+(?:saving\s+throw|save|check)))|(?:(?:(${enAbilityList})\s+(?:saving\s+throw|save)|(Concentration)\s+(?:saving\s+throw|save|check))(?:\s+(?:\(DC\s+(\d+)\)|DC\s+(\d+)))?))`, // v4 regex is structurally okay
				"gi"
			),
			//Group 1: DC First
			dcGroup1: 1, //DC value
			abilityGroup1: 2, //Ability name
			concentrationGroup1: 3, //Concentration Keyword
			//Group 2: DC Last
			abilityGroup2: 4, //Ability name
			concentrationGroup2: 5, //Concentration Keyword
			dcGroup2_paren: 6, // DC value inside parenthesis (Ex: (DC 18))
			dcGroup2_noparen: 7, // DC value
		},
		// Matches "[DC XX] Ability [(Skill/Tool)] check/test", "[DC XX] Skill check/test", "[DC XX] Tool check/test", "Ability [(Skill/Tool)] check/test [(DC XX)]", "Skill check/test [(DC XX)]", "Tool check/test [(DC XX)]", or "passive Skill score of XX"
		check: {
			pattern: new RegExp(
				String.raw`(?:(?:(?:(DC)\s+(\d+))\s+)?(?:(${enAbilityList})\s*(?:\(\s*(${enSkillList}|${enToolList})\s*\))?|(${enSkillList})|(${enToolList}))\s+(check|test)(?:\s+\(DC\s+(\d+)\))?)|(?:(passive)\s+(${enSkillList})\s+(?:score\s+of|of)\s+(\d+)(?:\s+or\s+higher)?)\b`,
				"gi"
			),
			dcMarker1: 1, //DC keyword at the start
			dcValue1: 2, //DC value
			abilityContext: 3, //Ability name
			skillOrToolInParen: 4, //Skill or Tool name within parentheses
			skillStandalone: 5, //Skill name alone
			toolStandalone: 6, //tool name alone
			checkMarker: 7, //check keyword
			dcValue2_paren: 8, //DC value in parentheses at the end
			passiveMarker: 9, //The passive keyword
			passiveSkill: 10, //passive skill name
			passiveDcValue: 11, //DC value
		},
		// Matches "X (Formula) [type(s)] damage" or "'Formula' [type(s)] damage"
		damage: {
			pattern: new RegExp(
				String.raw`(?:(\d+)\s*\(\s*('?)(\d+(?:d\d+)?(?:\s*[+-]\s*\d+)*)\2\s*\)|('?)(\d+(?:d\d+)?(?:\s*[+-]\s*\d+)*)\4)\s+(?:(${enDamageTypeList}(?:\s+(?:or|,)\s+${enDamageTypeList})*)?\s+)?(damage)\b`,
				"gi"
			),
			// Average value
			averageGroup: 1,
			// Formula within parenthesis
			formulaInParensGroup: 3,
			// Optional quote for formula
			directFormulaQuoteGroup: 4,
			//  Direct formula value
			directFormulaGroup: 5,
			// Damage type(s) string
			damageTypesGroup: 6,
			// "damage" keyword
			damageKeywordGroup: 7,
		},
		// Matches "+X to hit" or "-X to hit"
		attack: {
			pattern: /(?<=\s|^)([+-])\s*(\d+)\s+to\s+hit\b/gi,
			// Sign (+ or -)
			signGroup: 1,
			// Attack bonus number
			numberGroup: 2,
		},
		// All of the below matches the names from the corresponding maps
		condition: {
			pattern: new RegExp(String.raw`\b(${enConditionList})\b`, "gi"),
			conditionNameGroup: 1,
		},
		rule: {
			pattern: new RegExp(String.raw`\b(${enRuleList})\b`, "gi"),
			ruleNameGroup: 1,
		},
		weaponMastery: {
			pattern: new RegExp(String.raw`\b(${enWeaponMasteryList})\b`, "gi"),
			masteryNameGroup: 1,
		},
		areaTargetType: {
			pattern: new RegExp(String.raw`\b(${enAreaTargetTypeList})\b`, "gi"),
			areaNameGroup: 1,
		},
		spellProperty: {
			pattern: new RegExp(String.raw`\b(${enSpellPropertyList})\b`, "gi"),
			propertyNameGroup: 1,
		},
		ability: {
			pattern: new RegExp(String.raw`\b(${enAbilityList})\b`, "gi"),
			abilityNameGroup: 1,
		},
		skill: {
			pattern: new RegExp(String.raw`\b(${enSkillList})\b`, "gi"),
			skillNameGroup: 1,
		},
		damageType: {
			pattern: new RegExp(String.raw`\b(${enDamageTypeList})\b`, "gi"),
			damageTypeNameGroup: 1,
		},
		creatureType: {
			pattern: new RegExp(String.raw`\b(${enCreatureTypeList})\b`, "gi"),
			typeNameGroup: 1,
		},
	},
	fr: {
		//Needs to be reviewed by native speaker
		// Check EN version to see what the pattern groups mean. Order is different due to language differences.
		abilityKeyMap: frAbilityMap,
		skillKeyMap: frSkillMap,
		toolKeyMap: frToolMap,
		damageTypeKeyMap: frDamageTypeMap,
		conditionKeyMap: frConditionMap,
		ruleKeyMap: frRuleMap,
		weaponMasteryKeyMap: frWeaponMasteryMap,
		areaTargetTypeKeyMap: frAreaTargetTypeMap,
		spellPropertyKeyMap: frSpellPropertyMap,
		creatureTypeKeyMap: frCreatureTypeMap,
		// Matches "X (Formula) points de vie [temporaires]" OR "'Formula' points de vie [temporaires]"
		heal: {
			pattern:
				/(?:(\d+)\s*\(\s*('?)(\d+(?:d\d+)?(?:\s*[+-]\s*\d+)*)\2\s*\)|('?)(\d+(?:d\d+)?(?:\s*[+-]\s*\d+)*)\4)\s+points\s+de\s+vie(?:\s+(temporaires))?\b/gi,
			averageGroup: 1,
			formulaInParensGroup: 3,
			directFormulaQuoteGroup: 4,
			directFormulaGroup: 5,
			tempGroup: 6,
		},
		// Matches "[DD XX] [Prefix Ability] Ability", "[DD XX] [Prefix Conc] Concentration", "[Prefix Ability] Ability [DD XX]", "[Prefix Ability] Ability [(DD XX)]", "[Prefix Conc] Concentration [DD XX]", "[Prefix Conc] Concentration [(DD XX)]"
		// Where [Prefix Ability] is "(jet de )?sauvegarde de/d'"
		// Where [Prefix Conc] is "(jet de )?sauvegarde de/d'" or "test de"
		save: {
			pattern: new RegExp(
				String.raw`(?:(?:DD\s+(\d+)\s+(?:(?:(?:(?:jet\s+de\s+)?sauvegarde\s+(?:de|d'))\s*(${frAbilityList})(?:\s+sauvegarde)?)|(?:(?:(?:(?:jet\s+de\s+)?sauvegarde\s+(?:de|d')|test\s+de))\s*(Concentration)(?:\s+(?:sauvegarde|test))?)))|(?:(?:(?:(?:(?:jet\s+de\s+)?sauvegarde\s+(?:de|d'))\s*(${frAbilityList})(?:\s+sauvegarde)?)|(?:(?:(?:(?:jet\s+de\s+)?sauvegarde\s+(?:de|d')|test\s+de))\s*(Concentration)(?:\s+(?:sauvegarde|test))?))(?:\s+(?:\(DD\s+(\d+)\)|DD\s+(\d+)))?))`,
				"gi"
			),
			dcGroup1: 1,
			abilityGroup1: 2,
			concentrationGroup1: 3,
			abilityGroup2: 4,
			concentrationGroup2: 5,
			dcGroup2_paren: 6,
			dcGroup2_noparen: 7,
		},
		// Matches "[DD XX] test de/d' Ability [(Skill/Tool)]", "[DD XX] test de/d' Skill", "[DD XX] test de/d' Tool", "test de/d' Ability [(Skill/Tool)] [DD XX / (DD XX)]", "test de/d' Skill [DD XX / (DD XX)]", "test de/d' Tool [DD XX / (DD XX)]", or "Skill passive de XX [ou supérieur]"
		check: {
			pattern: new RegExp(
				String.raw`(?:(?:(?:(DD)\s+(\d+))\s+)?(?:test\s+(?:de\s+|d'))(?:(${frAbilityList})(?:\s*\(\s*(${frSkillList}|${frToolList})\s*\))?|(${frSkillList})|(${frToolList}))(?:\s+(?:\(DD\s+(\d+)\)|DD\s+(\d+)))?)|(?:(?:(${frSkillList})|(?:perception))\s+(passive)\s+de\s+(\d+)(?:\s+ou\s+supérieur)?)\b`,
				"gi"
			),
			dcMarker1: 1,
			dcValue1: 2,
			abilityContext: 3,
			skillOrToolInParen: 4,
			skillStandalone: 5,
			toolStandalone: 6,
			dcValue2_paren: 7,
			dcValue2_noparen: 8,

			passiveSkill: 9,
			passiveAltPerception: 10,
			passiveMarker: 11,
			passiveDcValue: 12,
		},
		// Matches "X (Formula) dégâts [type(s)]" OR "'Formula' dégâts [type(s)]"
		damage: {
			pattern: new RegExp(
				String.raw`(?:(\d+)\s*\(\s*('?)(\d+(?:d\d+)?(?:\s*[+-]\s*\d+)*)\2\s*\)|('?)(\d+(?:d\d+)?(?:\s*[+-]\s*\d+)*)\4)\s+(dégâts)(?:\s+((?:d'|de\s+)?${frDamageTypeList}(?:\s*(?:,|et)\s*(?:d'|de\s+)?${frDamageTypeList})*))?\b`,
				"gi"
			),
			averageGroup: 1,
			formulaInParensGroup: 3,
			directFormulaQuoteGroup: 4,
			directFormulaGroup: 5,
			damageKeywordGroup: 6,
			damageTypesGroup: 7,
		},
		// Matches "+X au toucher" or "-X pour toucher"
		attack: {
			pattern: /(?<=\s|^)([+-])\s*(\d+)\s+(?:au\s+toucher|pour\s+toucher)\b/gi,
			signGroup: 1,
			numberGroup: 2,
		},
		// All of the below match the names from the corresponding map
		condition: {
			pattern: new RegExp(String.raw`\b(${frConditionList})\b`, "gi"),
			conditionNameGroup: 1,
		},
		rule: {
			pattern: new RegExp(String.raw`\b(${frRuleList})\b`, "gi"),
			ruleNameGroup: 1,
		},
		weaponMastery: {
			pattern: new RegExp(String.raw`\b(${frWeaponMasteryList})\b`, "gi"),
			masteryNameGroup: 1,
		},
		areaTargetType: {
			pattern: new RegExp(String.raw`\b(${frAreaTargetTypeList})\b`, "gi"),
			areaNameGroup: 1,
		},
		spellProperty: {
			pattern: new RegExp(String.raw`\b(${frSpellPropertyList})\b`, "gi"),
			propertyNameGroup: 1,
		},
		ability: {
			pattern: new RegExp(String.raw`\b(${frAbilityList})\b`, "gi"),
			abilityNameGroup: 1,
		},
		skill: {
			pattern: new RegExp(String.raw`\b(${frSkillList})\b`, "gi"),
			skillNameGroup: 1,
		},
		damageType: {
			pattern: new RegExp(String.raw`\b(${frDamageTypeList})\b`, "gi"),
			damageTypeNameGroup: 1,
		},
		creatureType: {
			pattern: new RegExp(String.raw`\b(${frCreatureTypeList})\b`, "gi"),
			typeNameGroup: 1,
		},
	},
};
