export const randomDescriptor = () => _DESCRIPTORS[Math.floor(Math.random() * _DESCRIPTORS_LEN)];
export const randomAnimal = () => _ANIMALS[Math.floor(Math.random() * _ANIMALS_LEN)];

export const randomName = (sep = ' '): string =>
	`${randomDescriptor()}${sep}${randomAnimal()}`.replace(/\s+/, sep);

const _NAME_TO_EMOJI = { Monkey: '🐒', Gorilla: '🦍', Orangutan: '🦧', 'Dog Face': '🐶', Dog: '🐕', 'Guide Dog': '🦮', 'Service Dog': '🐕‍🦺', Poodle: '🐩', Wolf: '🐺', Fox: '🦊', Raccoon: '🦝', Cat: '🐈', 'Black Cat': '🐈‍⬛', Lion: '🦁', Tiger: '🐅', Leopard: '🐆', Horse: '🐎', Unicorn: '🦄', Zebra: '🦓', Deer: '🦌', Ox: '🐂', 'Water Buffalo': '🐃', Cow: '🐄', Pig: '🐖', Boar: '🐗', 'Pig Nose': '🐽', Ram: '🐏', Ewe: '🐑', Goat: '🐐', Camel: '🐪', 'Two-hump Camel': '🐫', Llama: '🦙', Giraffe: '🦒', Elephant: '🐘', Mammoth: '🦣', Rhinoceros: '🦏', Hippopotamus: '🦛', Mouse: '🐁', Rat: '🐀', Hamster: '🐹', Rabbit: '🐇', Chipmunk: '🐿️', Beaver: '🦫', Hedgehog: '🦔', Bat: '🦇', Bear: '🐻', 'Polar Bear': '🐻‍❄️', Koala: '🐨', Panda: '🐼', Sloth: '🦥', Otter: '🦦', Skunk: '🦨', Kangaroo: '🦘', Badger: '🦡', 'Paw Prints': '🐾', Turkey: '🦃', Chicken: '🐔', Rooster: '🐓', 'Hatching Chick': '🐣', 'Baby Chick': '🐤', Bird: '🐦', Penguin: '🐧', Dove: '🕊️', Eagle: '🦅', Duck: '🦆', Swan: '🦢', Owl: '🦉', Dodo: '🦤', Feather: '🪶', Flamingo: '🦩', Peacock: '🦚', Parrot: '🦜', Frog: '🐸', Crocodile: '🐊', Turtle: '🐢', Lizard: '🦎', Snake: '🐍', Dragon: '🐉', Sauropod: '🦕', 'T-Rex': '🦖', Whale: '🐋', Dolphin: '🐬', Seal: '🦭', Fish: '🐟', 'Tropical Fish': '🐠', Blowfish: '🐡', Shark: '🦈', Octopus: '🐙', 'Spiral Shell': '🐚', Coral: '🪸', Snail: '🐌', Butterfly: '🦋', Bug: '🐛', Ant: '🐜', Honeybee: '🐝', Beetle: '🪲', 'Lady Beetle': '🐞', Cricket: '🦗', Cockroach: '🪳', Spider: '🕷️', 'Spider Web': '🕸️', Scorpion: '🦂', Mosquito: '🦟', Fly: '🪰', Worm: '🪱', Microbe: '🦠' }; // prettier-ignore
// Not included:
// "Tiger Face": "🐯", "Cat Face": "🐱", "Horse Face": "🐴", "Bison": "🦬", "Cow Face": "🐮", "Pig Face": "🐷", "Mouse Face": "🐭", "Rabbit Face": "🐰", "Cat Face": "🐱", "Front-facing Baby Chick": "🐥", "Dragon Face": "🐲", "Spouting Whale": "🐳", "Monkey Face": "🐵",

const _ANIMALS = Object.keys(_NAME_TO_EMOJI);
// [ 'Monkey', 'Gorilla', 'Orangutan', 'Dog Face', 'Dog', 'Guide Dog', 'Service Dog', 'Poodle', 'Wolf', 'Fox', 'Raccoon', 'Cat', 'Black Cat', 'Lion', 'Tiger', 'Leopard', 'Horse', 'Unicorn', 'Zebra', 'Deer', 'Ox', 'Water Buffalo', 'Cow', 'Pig', 'Boar', 'Pig Nose', 'Ram', 'Ewe', 'Goat', 'Camel', 'Two-hump Camel', 'Llama', 'Giraffe', 'Elephant', 'Mammoth', 'Rhinoceros', 'Hippopotamus', 'Mouse', 'Rat', 'Hamster', 'Rabbit', 'Chipmunk', 'Beaver', 'Hedgehog', 'Bat', 'Bear', 'Polar Bear', 'Koala', 'Panda', 'Sloth', 'Otter', 'Skunk', 'Kangaroo', 'Badger', 'Paw Prints', 'Turkey', 'Chicken', 'Rooster', 'Hatching Chick', 'Baby Chick', 'Bird', 'Penguin', 'Dove', 'Eagle', 'Duck', 'Swan', 'Owl', 'Dodo', 'Feather', 'Flamingo', 'Peacock', 'Parrot', 'Frog', 'Crocodile', 'Turtle', 'Lizard', 'Snake', 'Dragon', 'Sauropod', 'T-Rex', 'Whale', 'Dolphin', 'Seal', 'Fish', 'Tropical Fish', 'Blowfish', 'Shark', 'Octopus', 'Spiral Shell', 'Coral', 'Snail', 'Butterfly', 'Bug', 'Ant', 'Honeybee', 'Beetle', 'Lady Beetle', 'Cricket', 'Cockroach', 'Spider', 'Spider Web', 'Scorpion', 'Mosquito', 'Fly', 'Worm', 'Microbe' ]; // prettier-ignore

const _DESCRIPTORS = ["Admiring","Adoring","Affectionate","Agitated","Amazing","Angry","Awesome","Beautiful","Blissful","Bold","Boring","Brave","Busy","Charming","Clever","Cool","Compassionate","Competent","Condescending","Confident","Cranky","Crazy","Dazzling","Determined","Distracted","Dreamy","Eager","Ecstatic","Elastic","Elated","Elegant","Eloquent","Epic","Exciting","Fervent","Festive","Flamboyant","Focused","Friendly","Frosty","Funny","Gallant","Gifted","Goofy","Gracious","Great","Happy","Hardcore","Heuristic","Hopeful","Hungry","Infallible","Inspiring","Interesting","Intelligent","Jolly","Jovial","Keen","Kind","Laughing","Loving","Lucid","Magical","Mystifying","Modest","Musing","Naughty","Nervous","Nice","Nifty","Nostalgic","Objective","Optimistic","Peaceful","Pedantic","Pensive","Practical","Priceless","Quirky","Quizzical","Recursing","Relaxed","Reverent","Romantic","Sad","Serene","Sharp","Silly","Sleepy","Stoic","Strange","Stupefied","Suspicious","Sweet","Tender","Thirsty","Trusting","Unruffled","Upbeat","Vibrant","Vigilant","Vigorous","Wizardly","Wonderful","Xenodochial","Youthful","Zealous","Zen"]; // prettier-ignore

const _ANIMALS_LEN = _ANIMALS.length;
const _DESCRIPTORS_LEN = _DESCRIPTORS.length;
('https://unicode.org/Public/emoji/14.0/emoji-test.txt');
// Fetches all emoji programmatically
// Can be run from browser's dev console.

const eq = {
	standard: 'https://unicode.org/Public/emoji/14.0/emoji-test.txt' // 'https://unicode.org/Public/emoji/14.0/emoji-sequences.txt',
	// zwj: 'https://unicode.org/Public/emoji/14.0/emoji-zwj-sequences.txt'
};
let allEmoji = '';

for (let key of Object.keys(eq)) {
	const url = eq[key];
	const res = await fetch(url);
	const txt = await res.text();
	const emoji = txt.replaceAll(/\d|#/gu, '').replaceAll(/[^\p{Emoji}]/gu, '');
	console.log(`// ${key} emoji (${emoji.length})`);
	console.log(emoji);

	allEmoji += emoji;
}

console.log(`// All emoji (${allEmoji.length})`);
console.log(allEmoji);

// /^#.*\n/ugm
// /^#.*/ugm
// /(.*) # (.*)$/ugm
// /(.*)(\p{Emoji})(\s+)([A-Z]+[\d]+\.[\d]+)(\s+)([éÅ\w\s:\.&-]+)\n/

const url = 'https://unicode.org/Public/emoji/14.0/emoji-test.txt';

const res = await fetch(url);
const txt = await res.text();
const _emoji = txt.replaceAll(/\d|#/gu, '').replaceAll(/[^\p{Emoji}]/gu, ' ');
console.log(_emoji.length);
const emojiList = _emoji.split(' ').filter((c) => c !== '');
const emoji = emojiList.filter((c, i) => emojiList.indexOf(c) === i).join('');

console.log(`// Emoji (${_emoji.length})`);
console.log(emoji);
