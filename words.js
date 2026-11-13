// Word banks for each level.
// Each entry: [word, digits, note?]
// Digits come from the consonant SOUNDS in the word (vowels, w, h, y are ignored).

// EASY — your personal code. Only the FIRST letter counts: one word = one digit.
// 0=Z 1=T 2=N 3=M 4=R 5=L 6=J 7=K 8=F 9=P
const EASY_LETTERS = {
  0: "zebra zoo zipper zero zone zigzag zombie zucchini",
  1: "tiger table tree toast tent turtle tooth train",
  2: "nest nose nail nut needle net nurse noodle",
  3: "moon mouse map milk mug monkey mask muffin",
  4: "rabbit rose rain ring robot rocket rope river",
  5: "lion lamp leaf lemon ladder lake log lock",
  6: "jar jet jelly jacket juice jeep jungle jewel",
  7: "kite key king koala kettle kangaroo kiwi kitten",
  8: "fish frog fork fox feather flag fire fence",
  9: "pig pen pizza pear piano pumpkin pillow panda",
};
const EASY = Object.entries(EASY_LETTERS).flatMap(([d, words]) =>
  words.split(" ").map((w) => [w, d])
);

// MEDIUM — traditional Major system, common multi-consonant words (00–99 pegs + a few longer).
const MEDIUM = [
  ["sauce", "00"], ["seas", "00"], ["seed", "01"], ["suit", "01"], ["sun", "02"], ["snow", "02"],
  ["sumo", "03"], ["seam", "03"], ["sore", "04"], ["sir", "04"], ["sail", "05"], ["soil", "05"],
  ["sash", "06"], ["sage", "06"], ["sock", "07"], ["sack", "07"], ["sofa", "08"], ["safe", "08"],
  ["soap", "09"], ["sub", "09"],
  ["toes", "10"], ["dice", "10"], ["date", "11"], ["toad", "11"], ["tuna", "12"], ["tin", "12"],
  ["team", "13"], ["dome", "13"], ["tire", "14"], ["door", "14"], ["tail", "15"], ["doll", "15"],
  ["dish", "16"], ["touch", "16"], ["duck", "17"], ["tag", "17"], ["dove", "18"], ["toffee", "18"],
  ["tub", "19"], ["top", "19"],
  ["nose", "20"], ["news", "20"], ["net", "21"], ["nut", "21"], ["nun", "22"], ["onion", "22"],
  ["name", "23"], ["enemy", "23"], ["near", "24"], ["honor", "24"], ["nail", "25"], ["Nile", "25"],
  ["notch", "26"], ["niche", "26"], ["neck", "27"], ["nag", "27"], ["navy", "28"], ["nephew", "28"],
  ["nap", "29"], ["nip", "29"],
  ["mouse", "30"], ["moss", "30"], ["mat", "31"], ["mud", "31"], ["moon", "32"], ["man", "32"],
  ["mummy", "33"], ["mime", "33"], ["mare", "34"], ["mower", "34"], ["mail", "35"], ["mule", "35"],
  ["match", "36"], ["mesh", "36"], ["mug", "37"], ["mike", "37"], ["movie", "38"], ["muff", "38"],
  ["map", "39"], ["mop", "39"],
  ["rose", "40"], ["rice", "40"], ["rat", "41"], ["rod", "41"], ["rain", "42"], ["ruin", "42"],
  ["ram", "43"], ["rum", "43"], ["roar", "44"], ["rear", "44"], ["roll", "45"], ["rail", "45"],
  ["roach", "46"], ["rash", "46"], ["rock", "47"], ["rake", "47"], ["roof", "48"], ["reef", "48"],
  ["rope", "49"], ["robe", "49"],
  ["lace", "50"], ["lasso", "50"], ["lid", "51"], ["lot", "51"], ["lion", "52"], ["lane", "52"],
  ["lime", "53"], ["loom", "53"], ["lure", "54"], ["layer", "54"], ["lily", "55"], ["lolly", "55"],
  ["leash", "56"], ["latch", "56"], ["lake", "57"], ["log", "57"], ["leaf", "58"], ["lava", "58"],
  ["lip", "59"], ["lab", "59"],
  ["cheese", "60"], ["juice", "60"], ["jet", "61"], ["sheet", "61"], ["chain", "62"], ["gin", "62"],
  ["jam", "63"], ["gym", "63"], ["chair", "64"], ["jar", "64"], ["jail", "65"], ["shell", "65"],
  ["judge", "66"], ["shush", "66"], ["shack", "67"], ["check", "67"], ["chef", "68"], ["shave", "68"],
  ["ship", "69"], ["chip", "69"],
  ["case", "70"], ["goose", "70"], ["cat", "71"], ["kite", "71"], ["coin", "72"], ["cane", "72"],
  ["game", "73"], ["gum", "73"], ["car", "74"], ["crow", "74"], ["coal", "75"], ["glue", "75"],
  ["cage", "76"], ["coach", "76"], ["cake", "77"], ["cook", "77"], ["cave", "78"], ["coffee", "78"],
  ["cap", "79"], ["cub", "79"],
  ["face", "80"], ["vase", "80"], ["foot", "81"], ["fat", "81"], ["fan", "82"], ["vine", "82"],
  ["foam", "83"], ["fume", "83"], ["fire", "84"], ["fur", "84"], ["file", "85"], ["fly", "85"],
  ["fish", "86"], ["fudge", "86"], ["fog", "87"], ["fig", "87"], ["fife", "88"], ["five", "88"],
  ["vibe", "89"], ["fib", "89"],
  ["bus", "90"], ["bees", "90"], ["bat", "91"], ["bed", "91"], ["bun", "92"], ["pan", "92"],
  ["beam", "93"], ["puma", "93"], ["bear", "94"], ["pier", "94"], ["bell", "95"], ["pail", "95"],
  ["badge", "96"], ["peach", "96"], ["book", "97"], ["bag", "97"], ["beef", "98"], ["puff", "98"],
  ["pipe", "99"], ["baby", "99"],
  // a few longer everyday words
  ["table", "195"], ["lemon", "532"], ["camel", "735"], ["robot", "491"], ["rocket", "471"],
  ["parrot", "941"], ["tomato", "131"], ["banana", "922"], ["salad", "051"], ["wizard", "041"],
];

// HARD — common words with "slanted" spellings: silent letters, soft c/g, ph/gh, x, ch=k, ti=sh, etc.
const HARD = [
  ["knight", "21", "k and gh silent"], ["gnome", "23", "g silent"], ["knife", "28", "k silent"],
  ["comb", "73", "b silent"], ["lamb", "53", "b silent"], ["thumb", "13", "th = 1, b silent"],
  ["tomb", "13", "b silent"], ["climb", "753", "b silent"], ["plumber", "9534", "b silent"],
  ["debt", "11", "b silent"], ["subtle", "015", "b silent"],
  ["phone", "82", "ph = f"], ["photo", "81", "ph = f"], ["graph", "748", "ph = f"],
  ["dolphin", "1582", "ph = f"], ["elephant", "5821", "ph = f"], ["xylophone", "0582", "x = z, ph = f"],
  ["laugh", "58", "gh = f"], ["cough", "78", "gh = f"], ["tough", "18", "gh = f"], ["enough", "28", "gh = f"],
  ["daughter", "114", "gh silent"], ["thought", "11", "th = 1, gh silent"], ["weight", "1", "gh silent"],
  ["height", "1", "gh silent"], ["fight", "81", "gh silent"],
  ["city", "01", "soft c = s"], ["cereal", "045", "soft c = s"], ["cycle", "075", "soft c, then hard c"],
  ["receipt", "401", "soft c, p silent"],
  ["gem", "63", "soft g = j"], ["giant", "621", "soft g = j"], ["giraffe", "648", "soft g, ff = one f"],
  ["ginger", "6264", "both g's soft"], ["edge", "6", "dge = j"], ["bridge", "946", "dge = j"],
  ["knowledge", "256", "k & w silent, dge = j"], ["mortgage", "3476", "t silent, final g soft"],
  ["box", "970", "x = ks"], ["taxi", "170", "x = ks"], ["exit", "701", "x = ks / gz"],
  ["vaccine", "8702", "cc = ks"], ["accident", "70121", "cc = ks"], ["success", "0700", "cc = ks"],
  ["soccer", "074", "cc = k"],
  ["sugar", "674", "s = sh"], ["nation", "262", "ti = sh"], ["action", "762", "ti = sh"],
  ["ocean", "62", "c = sh"], ["special", "0965", "ci = sh"], ["pressure", "9464", "ss = sh"],
  ["tissue", "16", "ss = sh"], ["issue", "6", "ss = sh"], ["machine", "362", "ch = sh"],
  ["champagne", "6392", "ch = sh, g silent"],
  ["vision", "862", "s = zh → 6"], ["measure", "364", "s = zh → 6"],
  ["choir", "74", "ch = k"], ["chaos", "70", "ch = k"], ["school", "075", "ch = k"],
  ["chemistry", "73014", "ch = k"], ["Christmas", "74030", "ch = k, t silent"],
  ["quick", "77", "qu = kw, ck = k"], ["queen", "72", "qu = kw"],
  ["psalm", "03", "p and l silent"], ["salmon", "032", "l silent"], ["calf", "78", "l silent"],
  ["half", "8", "l silent"], ["walk", "7", "l silent"], ["talk", "17", "l silent"],
  ["should", "61", "l silent"], ["could", "71", "l silent"],
  ["island", "521", "s silent"], ["castle", "705", "t silent"], ["listen", "502", "t silent"],
  ["whistle", "05", "t silent"], ["wrestle", "405", "w and t silent"],
  ["answer", "204", "w silent"], ["wrist", "401", "w silent"], ["sword", "041", "w silent"],
  ["ghost", "701", "h silent"], ["honest", "201", "h silent"], ["hour", "4", "h silent"],
  ["column", "753", "n silent"], ["autumn", "13", "n silent"],
  ["knock", "27", "k silent, ck = k"], ["gnat", "21", "g silent"],
  ["science", "020", "sc = s"], ["scissors", "0040", "sc = s, ss = z"], ["muscle", "305", "c silent"],
  ["yacht", "1", "ch silent"], ["foreign", "842", "g silent"], ["sign", "02", "g silent"],
  ["design", "102", "s = z, g silent"], ["butter", "914", "tt = one t"], ["pizza", "910", "zz = ts"],
  ["chocolate", "6751", "middle o silent"],
];

window.WORD_BANKS = { easy: EASY, medium: MEDIUM, hard: HARD };

// PAO for Easy: one fixed Person, Action and Object per digit (first letter = digit).
// Three digits become one scene: 9 7 8 → "pirate kicking a fish".
window.PAO_EASY = {
  person: ["zombie", "Tarzan", "ninja", "magician", "robot", "lumberjack", "judge", "king", "firefighter", "pirate"],
  action: ["zapping", "tickling", "nibbling", "milking", "riding", "licking", "juggling", "kicking", "frying", "painting"],
  object: ["zebra", "tree", "nest", "moon", "rocket", "lemon", "jelly", "kite", "fish", "pizza"],
};

// PAO for Medium: index = number 00–99, traditional sounds.
// Three 2-digit numbers become one scene: 14 70 49 → "Thor kiss rope" = 147049.
const words = (s) => s.trim().split(/\s+/);
window.PAO_MEDIUM = {
  person: words(`
    Zeus Sith son swami seer Sally Sasha Zeke Sophie spy
    Taz Dad Don dummy Thor Dali DJ Duke thief Dopey
    Nessie Ned nanny Nemo Nero Nala Nacho Nick nephew noob
    Miss maid Mona Mom Mario Miley mage Mickey Mafia Moby
    Rosie Rudy Ron Romeo Rory Riley Rajah Rocky ref Ruby
    Lassie lady Luna Elmo Lara Lulu Elijah Luke elf Libby
    Jaws Jedi genie Jim Jerry Jill judge Jack chef Jabba
    Casey kid queen Kim Carrie Kylo Cash Coco Goofy cop
    Fozzie vet Fiona femme fairy fool Fudge Vicky Fifi VIP
    boss Buddha Bono Pam Barry Pele Butch Puck Buffy pope`),
  action: words(`
    seize sit swoon swim soar sell sashay soak save sip
    toss tattoo dine tame tear dial touch dig dive dip
    nose nod nanny name honor kneel nosh nag envy nab
    mess meet moan mime marry maul mash mock move mop
    race ride run roam roar roll rush rake rave rob
    lasso loot lean loom lure lull lash lick love leap
    juice shoot join chime cheer chill shush shake shave chop
    kiss cut con game carry call catch cook cuff copy
    fuss feed fan fume fire fly fetch fake faff fib
    pose bite pin beam pour pull push poke puff pop`),
  object: words(`
    sauce seed sun seam sari sail sash sock sofa soap
    dice toad tuna dome tire doll dish duck dove tub
    noose net onion gnome nori nail notch neck knife nib
    mouse mat moon mummy mower mail match mug movie map
    rose rat rain rum aurora rail roach rock roof rope
    lace lid lion lime lyre lily leash log leaf lip
    cheese jet chain jam chair shell choo-choo jug java ship
    case kite coin gum car coal cage cake coffee cap
    vase foot vine foam fur file fish fig fife fob
    bus bed bun puma bear bell peach book beef pipe`),
};

// PAO for Hard: slanted-spelling alternates. Used in place of the Medium word
// for that number, and picked more often so you meet them regularly.
window.PAO_HARD = {
  person: [
    ["Cid", "01", "soft c = s"], ["Xena", "02", "x = z"], ["czar", "04", "cz = z"],
    ["psycho", "07", "p silent, ch = k"], ["Thor", "14", "th = 1"], ["thief", "18", "th = 1"],
    ["knight", "21", "k & gh silent"], ["gnome", "23", "g silent"], ["knave", "28", "k silent"],
    ["Wright", "41", "w & gh silent"], ["genie", "62", "soft g = j"], ["queen", "72", "qu = kw"],
    ["Chloe", "75", "ch = k"], ["pharaoh", "84", "ph = f"], ["Phil", "85", "ph = f"],
    ["Phoebe", "89", "ph = f"],
  ],
  action: [
    ["cease", "00", "soft c = s"], ["cite", "01", "soft c = s"], ["sign", "02", "g silent"],
    ["whistle", "05", "t silent"], ["psych", "07", "p silent, ch = k"], ["doubt", "11", "b silent"],
    ["thumb", "13", "th = 1, b silent"], ["throw", "14", "th = 1"], ["dodge", "16", "dge = j"],
    ["talk", "17", "l silent"], ["knit", "21", "k silent"], ["nudge", "26", "dge = j"],
    ["knock", "27", "k silent"], ["write", "41", "w silent"], ["wreck", "47", "w silent"],
    ["light", "51", "gh silent"], ["lodge", "56", "dge = j"], ["laugh", "58", "gh = f"],
    ["gel", "65", "soft g = j"], ["quit", "71", "qu = kw"], ["comb", "73", "b silent"],
    ["cough", "78", "gh = f"], ["phase", "80", "ph = f, s = z"], ["fight", "81", "gh silent"],
    ["budge", "96", "dge = j"],
  ],
  object: [
    ["city", "01", "soft c = s"], ["psalm", "03", "p & l silent"], ["debt", "11", "b silent"],
    ["tomb", "13", "b silent"], ["tissue", "16", "ss = sh"], ["knot", "21", "k silent"],
    ["knife", "28", "k silent"], ["wreath", "41", "w silent, th = 1"], ["rhino", "42", "h silent"],
    ["lamb", "53", "b silent"], ["ocean", "62", "c = sh"], ["gem", "63", "soft g = j"],
    ["choir", "74", "ch = k"], ["calf", "78", "l silent"], ["photo", "81", "ph = f"],
    ["phone", "82", "ph = f"],
  ],
};
