export const randomDescriptor = () => _DESCRIPTORS[Math.floor(Math.random() * _DESCRIPTORS_LEN)];
export const randomAnimal = () => _ANIMALS[Math.floor(Math.random() * _ANIMALS_LEN)];

export const randomName = (machine = false): string =>
	`${randomDescriptor()} ${randomAnimal()}`.replace(' ', machine ? '-' : ' ');

export const randomMeetingName = () =>
	`${randomAnimal().toLowerCase().replace(' ', '-')}-${makeid(10)}`;

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

/**
 * h/t https://stackoverflow.com/a/1349426/3422060
 * @param length Length of ID
 * @returns an ID
 */
function makeid(length: number): string {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

const _NAME_TO_EMOJI = { Monkey: '🐒', Gorilla: '🦍', Orangutan: '🦧', 'Dog Face': '🐶', Dog: '🐕', 'Guide Dog': '🦮', 'Service Dog': '🐕‍🦺', Poodle: '🐩', Wolf: '🐺', Fox: '🦊', Raccoon: '🦝', Cat: '🐈', 'Black Cat': '🐈‍⬛', Lion: '🦁', Tiger: '🐅', Leopard: '🐆', Horse: '🐎', Unicorn: '🦄', Zebra: '🦓', Deer: '🦌', Ox: '🐂', 'Water Buffalo': '🐃', Cow: '🐄', Pig: '🐖', Boar: '🐗', 'Pig Nose': '🐽', Ram: '🐏', Ewe: '🐑', Goat: '🐐', Camel: '🐪', 'Two-hump Camel': '🐫', Llama: '🦙', Giraffe: '🦒', Elephant: '🐘', Mammoth: '🦣', Rhinoceros: '🦏', Hippopotamus: '🦛', Mouse: '🐁', Rat: '🐀', Hamster: '🐹', Rabbit: '🐇', Chipmunk: '🐿️', Beaver: '🦫', Hedgehog: '🦔', Bat: '🦇', Bear: '🐻', 'Polar Bear': '🐻‍❄️', Koala: '🐨', Panda: '🐼', Sloth: '🦥', Otter: '🦦', Skunk: '🦨', Kangaroo: '🦘', Badger: '🦡', 'Paw Prints': '🐾', Turkey: '🦃', Chicken: '🐔', Rooster: '🐓', 'Hatching Chick': '🐣', 'Baby Chick': '🐤', Bird: '🐦', Penguin: '🐧', Dove: '🕊️', Eagle: '🦅', Duck: '🦆', Swan: '🦢', Owl: '🦉', Dodo: '🦤', Feather: '🪶', Flamingo: '🦩', Peacock: '🦚', Parrot: '🦜', Frog: '🐸', Crocodile: '🐊', Turtle: '🐢', Lizard: '🦎', Snake: '🐍', Dragon: '🐉', Sauropod: '🦕', 'T-Rex': '🦖', Whale: '🐋', Dolphin: '🐬', Seal: '🦭', Fish: '🐟', 'Tropical Fish': '🐠', Blowfish: '🐡', Shark: '🦈', Octopus: '🐙', 'Spiral Shell': '🐚', Coral: '🪸', Snail: '🐌', Butterfly: '🦋', Bug: '🐛', Ant: '🐜', Honeybee: '🐝', Beetle: '🪲', 'Lady Beetle': '🐞', Cricket: '🦗', Cockroach: '🪳', Spider: '🕷️', 'Spider Web': '🕸️', Scorpion: '🦂', Mosquito: '🦟', Fly: '🪰', Worm: '🪱', Microbe: '🦠' } as Record<string,string>; // prettier-ignore
// Not included:
// "Tiger Face": "🐯", "Cat Face": "🐱", "Horse Face": "🐴", "Bison": "🦬", "Cow Face": "🐮", "Pig Face": "🐷", "Mouse Face": "🐭", "Rabbit Face": "🐰", "Cat Face": "🐱", "Front-facing Baby Chick": "🐥", "Dragon Face": "🐲", "Spouting Whale": "🐳", "Monkey Face": "🐵",

const _ANIMALS = Object.keys(_NAME_TO_EMOJI);

const _DESCRIPTORS = ["Admiring","Adoring","Affectionate","Agitated","Amazing","Angry","Awesome","Beautiful","Blissful","Bold","Boring","Brave","Busy","Charming","Clever","Cool","Compassionate","Competent","Condescending","Confident","Cranky","Crazy","Dazzling","Determined","Distracted","Dreamy","Eager","Ecstatic","Elastic","Elated","Elegant","Eloquent","Epic","Exciting","Fervent","Festive","Flamboyant","Focused","Friendly","Frosty","Funny","Gallant","Gifted","Goofy","Gracious","Great","Happy","Hardcore","Heuristic","Hopeful","Hungry","Infallible","Inspiring","Interesting","Intelligent","Jolly","Jovial","Keen","Kind","Laughing","Loving","Lucid","Magical","Mystifying","Modest","Musing","Naughty","Nervous","Nice","Nifty","Nostalgic","Objective","Optimistic","Peaceful","Pedantic","Pensive","Practical","Priceless","Quirky","Quizzical","Recursing","Relaxed","Reverent","Romantic","Sad","Serene","Sharp","Silly","Sleepy","Stoic","Strange","Stupefied","Suspicious","Sweet","Tender","Thirsty","Trusting","Unruffled","Upbeat","Vibrant","Vigilant","Vigorous","Wizardly","Wonderful","Xenodochial","Youthful","Zealous","Zen"]; // prettier-ignore

const _ANIMALS_LEN = _ANIMALS.length;
const _DESCRIPTORS_LEN = _DESCRIPTORS.length;
