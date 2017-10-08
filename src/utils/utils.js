const minify = (str) => {
    if (!str) {
       return null;
    }

    let result = str;

    result = result.replace(/(\r\n|\n|\r)/gm, '');
    result = result.replace(/> *</g, '><');
    result = result.replace(/>[\s\t]+/g, '>');
    result = result.replace(/[\s\t]+</g, '<');

    return result;
}

export {
    minify
};
