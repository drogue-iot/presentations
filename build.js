const asciidoctor = require('@asciidoctor/core')();
const asciidoctorRevealjs = require('@asciidoctor/reveal.js');
asciidoctorRevealjs.register()

const fs = require("fs");
const fse = require("fs-extra");

const presentations = ["template-test", "introduction"];

function copyOptionally(src, dest) {
    if (fs.existsSync(src)) {
        fse.copySync(src, dest, {overwrite: true});
    }
}

presentations.forEach(doc => {
    asciidoctor.convertFile(`${doc}/index.adoc`, {
        safe: 'safe',
        backend: 'revealjs',
        to_dir: `staging/${doc}`,
        mkdirs: true,
    });

    copyOptionally(`${doc}/images`, `staging/${doc}/images`);

    // copy all the base resource, duplicating the content, but keeping each presentation independent
    copyOptionally(`assets`, `staging/${doc}/assets`);
    copyOptionally(`build/themes`, `staging/${doc}/themes`);
    copyOptionally(`node_modules/reveal.js/dist`, `staging/${doc}/revealjs/dist`);
    copyOptionally(`node_modules/reveal.js/plugin`, `staging/${doc}/revealjs/plugin`);
    copyOptionally(`node_modules/@highlightjs/cdn-assets`, `staging/${doc}/highlightjs`);

})
