const { SimpleLogger } = require("../dist");
const colors = require("ansi-colors");

const logger = new SimpleLogger();

/** 
 * 1 > Expected results
 */
console.log(1, logger);

/**
 * 1 > Expected results
 */
console.log(2, "SINGLE ARG");
logger.debug("Debugging....");

/**
 * 1 > Unexpected results,
 *     The second argument is not shown
 * 
 * 2 > Unexpected results,
 *     The second argument is shown,
 *     But not correctly
 * 
 * 3 > Expected results
 * 
 * @returns {"Created Logger (true)"}
 */
console.log(3, "MULTI-ARG");
logger.debug("Created Logger", "(true)");

/**
 * 
 */
console.log(4, "Custom colors");
const custom1 = new SimpleLogger({
    levels: { debug: { tagColor: colors.red } }
});
custom1.debug("Holy shit")