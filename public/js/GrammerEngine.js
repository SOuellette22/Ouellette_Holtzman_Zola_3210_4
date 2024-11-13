class GrammerEngine {
    constructor() {
        this.rules = [];
    }

    addRule(target_input, output) {
        this.rules.push(new Rule(target_input, output));
    }

    generate(axiom, iterations) {
        let curr_string = axiom
        for (let i = 0; i < iterations; i++ ) {

            let output_string = "";

            for (let curr_char of curr_string) {
                output_string += this._ruleMatch(curr_char);
            }

            curr_string = output_string; 
        }

        return curr_string;
    }

    _ruleMatch(char) {
        for (let rule of this.rules) {
            if (rule.match(char)) {
                return rule.replace();
            }
        }

        return char
    }
}

class Rule {
    constructor(target_input, output) {
        this.target_input = target_input;
        this.output = output;
    }
    
    match(char) {
        return (char === this.target_input );
    }

    replace() {
        return this.output;
    }
}

export { GrammerEngine } 