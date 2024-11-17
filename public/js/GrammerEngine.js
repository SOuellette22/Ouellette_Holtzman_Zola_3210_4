/**
     * Grammer Engine is a class to generate L-Grammer system strings given a list of rules and input string 
     * @example
     * let engine = new GrammerEngine();
     * //add rules
     * engine.addRule("1", "11");
     * engine.addRule("0", "1[0]0");
     * //add Stochastic rule - rule with probability 
     * engine.addRule("0", "1[0]0", 0.5);
     * //generate output
     * let output = engine.generate("0", 3));
     * //expected output 1111[11[1[0]0]1[0]0]11[1[0]0]1[0]0
     */
class GrammerEngine {
    constructor() {
        /**
         * list of Rules from Rule class 
         */
        this.rules = [];
    }

    /**
     * Add a rule to the engine 
     * @param {String} target_input trigger of rule 
     * @param {String} output Output of rule 
     * 
     * @example
     * //rule A->AB
     * grammerEngine.addRule("A", "AB");
     */
    addRule(target_input, output, probability = 1.0) {
        this.rules.push(new Rule(target_input, output, probability));
    }

    /**
     * Generates ouput of L-Grammer system given axiom initial state and number of iterations 
     * 
     * @param {String} axiom Starting string - Initial state of the system
     * @param {Int} iterations number of iterations 
     * @returns {String} output string of L-Grammer system
     */
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

    /**
     * Test against set of rules to see if current character matches any 
     * @param {Char} char char to test if rule matches 
     * @returns If a rule matches rule replacement, else the orginal character
     */
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
    /**
     * Creates a new rule for engine 
     * @param {String} target_input trigger of rule
     * @param {String} output Output of rule
     * @param {Number} float Number 1-0 of probability rule should trigger
     */
    constructor(target_input, output, probability) {
        this.target_input = target_input;
        this.output = output;
        this.probability = probability;
    }
    
    /**
     * Checks if specificed char matches rule
     * @param {char} char char to test matching 
     * @returns true if rule should be triggered false otherwise
     */
    match(char) {
        return (char === this.target_input && (Math.random() < this.probability));
    }

    /**
     * Replace with rule output
     * @returns output of rule 
     */
    replace() {
        return this.output;
    }
}

export { GrammerEngine } 