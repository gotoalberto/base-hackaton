const aspectjs = require('aspect-js');

function tryCatchWrapper(context) {
  try {
    console.log(`Calling ${context.targetName} with arguments: ${JSON.stringify(context.args)}`);
    const result = context.proceed(); // Proceed with the original method execution
    console.log(`Method ${context.targetName} returned: ${result}`);
    return result;
  } catch (error) {
    console.error(`Error in ${context.targetName}: ${error.message}`);
    throw error; // Re-throw the error after logging
  } finally {
    console.log(`Finally block for ${context.targetName}`);
  }
}

const createTryCatchAspect = () => {
  const specificAspect = aspectjs();
  specificAspect.around(tryCatchWrapper).on({ method: 'specificMethod' });
  return specificAspect;
};

module.exports = { createTryCatchAspect };
