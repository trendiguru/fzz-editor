const ERROR_MESSAGE = 'This field is not valid!';

/**
 * @param iputObj - <input/> - react component.
 * @param validator - function wihich obtains 
 *        string and returns its status (valid or not).
 * @param errorMessage - text which will be shown in err message.
 * @returns (boolean) status if current input's value is valid or not, 
 *        and changes input's validity status.
 */
function inputValidate(inputObj, validator, errorMessage) {
    if (!validator(inputObj.value) && inputObj.value !== '') {
        inputObj.setCustomValidity(errorMessage || ERROR_MESSAGE);
        inputObj.addEventListener('keydown', () => {
            inputObj.setCustomValidity('');
        });
    } else {
        inputObj.setCustomValidity('');
    }
    inputObj.reportValidity();
    return inputObj.checkValidity();
}

export { inputValidate };