const S = require('./string'),
	symbolCharacters = {
		3: ['ℨ'],
		a: ['₳'],
		b: ['₿', 'ℬ'],
		c: ['₡', '₢', '₵', '₾', 'ℂ', 'ℭ'],
		ce: ['₠'],
		d: ['ⅅ', 'ⅆ'],
		dp: ['₯'],
		e: ['ℇ', '℮', 'ℯ', 'ℰ', '⅀', 'ⅇ'],
		f: ['₣', 'ℱ', 'Ⅎ'],
		fax: ['℻'],
		g: ['₲', 'ℊ', '⅁'],
		h: ['ℋ', 'ℌ', 'ℍ', 'ℎ', 'ℏ'],
		i: ['ℐ', 'ℑ', '℩', 'ℹ', 'ⅈ'],
		ii: ['ℿ'],
		j: ['ⅉ'],
		k: ['₭', 'K'],
		l: ['℄', 'ℒ', 'ℓ', '⅊'],
		lb: ['℔'],
		m: ['₼', 'ℳ'],
		n: ['₦', '₪', 'ℕ', 'ℵ'],
		no: ['№'],
		o: ['Ω', 'ℴ', '℺'],
		p: ['₱', '₽', '℘', 'ℙ', '⅌'],
		q: ['ℚ'],
		r: ['ℛ', 'ℜ', 'ℝ', '℞', '℟'],
		rs: ['₨'],
		s: ['₷'],
		sm: ['℠'],
		t: ['₮', '₸'],
		tel: ['℡'],
		u: ['℧'],
		v: ['℣'],
		w: ['₩','ω'],
		y: ['ℽ'],
		z: ['₴', 'ℤ']
	}

module.exports = function symbols(mod) {
	const command = mod.command || mod.require.command;
	let enabled = false

	command.add('symbols', (arg) => {
		if (!arg) {
			enabled = !enabled
			command.message((enabled ? 'en' : 'dis') + 'abled')
		}
	})

	mod.hook('C_WHISPER', 1, {order:100000, fake: null }, handleChat)
	mod.hook('C_CHAT', 1, {order:100000, fake: null }, handleChat)


	function handleChat(event) {
		if (!enabled) return
		let msg = S.decodeHTMLEntities(event.message)
		//let msg = S.stripTags(event.message);
		let converted = S.escapeHTML(S.stripTags(convert(msg)))
		if (msg != converted) {
			event.message = '<FONT>' + converted + '</FONT>'
			return true
		}
	}


	function convert(string) {
		let newString = ''
		for (let i = 0; i < string.length; i++) {
			let char = string.charAt(i)
			let charArr = symbolCharacters[char]
			let newchar = charArr ? charArr[random(charArr.length)] : char

			if (random(3) > 0) {
				let char2 = char + string.charAt(i + 1)
				let charArr2 = symbolCharacters[char2]
				if (charArr2) {
					newchar = charArr2[random(charArr2.length)]
					i++
				} else if (random(3) > 0) {
					let char3 = char2 + string.charAt(i + 2)
					let charArr3 = symbolCharacters[char3]
					if (charArr3) {
						newchar = charArr3[random(charArr3.length)]
						i += 2
					}
				}
			}

			newString += newchar
		}
		return newString
	}


	function random(max, min) {
		min = min ? min : 0
		return Math.floor(Math.random() * (max - min) + min)
	}

	this.destructor = () => {
		command.remove('symbols'); // since this doesn't need anything we can do reloading stuff
	};
}
