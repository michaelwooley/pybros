export const randomDescriptor = () => _DESCRIPTORS[Math.floor(Math.random() * _DESCRIPTORS_LEN)];
export const randomAnimal = () => _ANIMALS[Math.floor(Math.random() * _ANIMALS_LEN)];

export const randomName = (machine = false): string =>
	`${randomDescriptor()} ${randomAnimal()}`.replace(' ', machine ? '-' : ' ');

export const emojiFromName = (name: string): string => {
	if (_NAME_TO_EMOJI[name]) {
		return _NAME_TO_EMOJI[name];
	}

	const n2 = name.split(' ').slice(1).join(' ');
	const v = _NAME_TO_EMOJI[n2];
	if (!v) {
		throw new Error(`Could not find emoji for name: '${name}'`);
	}
	return v;
};

const _NAME_TO_EMOJI = { Monkey: 'ð', Gorilla: 'ðĶ', Orangutan: 'ðĶ§', 'Dog Face': 'ðķ', Dog: 'ð', 'Guide Dog': 'ðĶŪ', 'Service Dog': 'ðâðĶš', Poodle: 'ðĐ', Wolf: 'ðš', Fox: 'ðĶ', Raccoon: 'ðĶ', Cat: 'ð', 'Black Cat': 'ðââŽ', Lion: 'ðĶ', Tiger: 'ð', Leopard: 'ð', Horse: 'ð', Unicorn: 'ðĶ', Zebra: 'ðĶ', Deer: 'ðĶ', Ox: 'ð', 'Water Buffalo': 'ð', Cow: 'ð', Pig: 'ð', Boar: 'ð', 'Pig Nose': 'ð―', Ram: 'ð', Ewe: 'ð', Goat: 'ð', Camel: 'ðŠ', 'Two-hump Camel': 'ðŦ', Llama: 'ðĶ', Giraffe: 'ðĶ', Elephant: 'ð', Mammoth: 'ðĶĢ', Rhinoceros: 'ðĶ', Hippopotamus: 'ðĶ', Mouse: 'ð', Rat: 'ð', Hamster: 'ðđ', Rabbit: 'ð', Chipmunk: 'ðŋïļ', Beaver: 'ðĶŦ', Hedgehog: 'ðĶ', Bat: 'ðĶ', Bear: 'ðŧ', 'Polar Bear': 'ðŧââïļ', Koala: 'ðĻ', Panda: 'ðž', Sloth: 'ðĶĨ', Otter: 'ðĶĶ', Skunk: 'ðĶĻ', Kangaroo: 'ðĶ', Badger: 'ðĶĄ', 'Paw Prints': 'ðū', Turkey: 'ðĶ', Chicken: 'ð', Rooster: 'ð', 'Hatching Chick': 'ðĢ', 'Baby Chick': 'ðĪ', Bird: 'ðĶ', Penguin: 'ð§', Dove: 'ðïļ', Eagle: 'ðĶ', Duck: 'ðĶ', Swan: 'ðĶĒ', Owl: 'ðĶ', Dodo: 'ðĶĪ', Feather: 'ðŠķ', Flamingo: 'ðĶĐ', Peacock: 'ðĶ', Parrot: 'ðĶ', Frog: 'ðļ', Crocodile: 'ð', Turtle: 'ðĒ', Lizard: 'ðĶ', Snake: 'ð', Dragon: 'ð', Sauropod: 'ðĶ', 'T-Rex': 'ðĶ', Whale: 'ð', Dolphin: 'ðŽ', Seal: 'ðĶ­', Fish: 'ð', 'Tropical Fish': 'ð ', Blowfish: 'ðĄ', Shark: 'ðĶ', Octopus: 'ð', 'Spiral Shell': 'ð', Coral: 'ðŠļ', Snail: 'ð', Butterfly: 'ðĶ', Bug: 'ð', Ant: 'ð', Honeybee: 'ð', Beetle: 'ðŠē', 'Lady Beetle': 'ð', Cricket: 'ðĶ', Cockroach: 'ðŠģ', Spider: 'ð·ïļ', 'Spider Web': 'ðļïļ', Scorpion: 'ðĶ', Mosquito: 'ðĶ', Fly: 'ðŠ°', Worm: 'ðŠą', Microbe: 'ðĶ ' } as Record<string,string>; // prettier-ignore
// Not included:
// "Tiger Face": "ðŊ", "Cat Face": "ðą", "Horse Face": "ðī", "Bison": "ðĶŽ", "Cow Face": "ðŪ", "Pig Face": "ð·", "Mouse Face": "ð­", "Rabbit Face": "ð°", "Cat Face": "ðą", "Front-facing Baby Chick": "ðĨ", "Dragon Face": "ðē", "Spouting Whale": "ðģ", "Monkey Face": "ðĩ",

const _ANIMALS = Object.keys(_NAME_TO_EMOJI);

const _DESCRIPTORS = ["Admiring","Adoring","Affectionate","Agitated","Amazing","Angry","Awesome","Beautiful","Blissful","Bold","Boring","Brave","Busy","Charming","Clever","Cool","Compassionate","Competent","Condescending","Confident","Cranky","Crazy","Dazzling","Determined","Distracted","Dreamy","Eager","Ecstatic","Elastic","Elated","Elegant","Eloquent","Epic","Exciting","Fervent","Festive","Flamboyant","Focused","Friendly","Frosty","Funny","Gallant","Gifted","Goofy","Gracious","Great","Happy","Hardcore","Heuristic","Hopeful","Hungry","Infallible","Inspiring","Interesting","Intelligent","Jolly","Jovial","Keen","Kind","Laughing","Loving","Lucid","Magical","Mystifying","Modest","Musing","Naughty","Nervous","Nice","Nifty","Nostalgic","Objective","Optimistic","Peaceful","Pedantic","Pensive","Practical","Priceless","Quirky","Quizzical","Recursing","Relaxed","Reverent","Romantic","Sad","Serene","Sharp","Silly","Sleepy","Stoic","Strange","Stupefied","Suspicious","Sweet","Tender","Thirsty","Trusting","Unruffled","Upbeat","Vibrant","Vigilant","Vigorous","Wizardly","Wonderful","Xenodochial","Youthful","Zealous","Zen"]; // prettier-ignore

const _ANIMALS_LEN = _ANIMALS.length;
const _DESCRIPTORS_LEN = _DESCRIPTORS.length;
