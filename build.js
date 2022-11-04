const asciidoctor = require('@asciidoctor/core')();
const asciidoctorRevealjs = require('@asciidoctor/reveal.js');
asciidoctorRevealjs.register()

const fs = require("fs");
const fse = require("fs-extra");
const glob = require("glob");
const path = require("path");

const presentations = [
    "index",
    "template-test",
    "introduction",
    "drogue-cloud-introduction"
];

const talks = glob.sync("talks/*/index.adoc")
    .map(file => path.dirname(file));

function copyOptionally(src, dest) {
    if (fs.existsSync(src)) {
        fse.copySync(src, dest, {overwrite: true});
    }
}

function build(doc) {
    console.log(`Building: ${doc}`);

    const out = asciidoctor.convertFile(`${doc}/index.adoc`, {
        safe: 'unsafe',
        backend: 'revealjs',
        to_dir: `staging/${doc}`,
        mkdirs: true,
        attributes: {
            "data-uri": true,
        }
    });

    // copy all the base resource, duplicating the content, but keeping each presentation independent
    copyOptionally(`assets`, `staging/${doc}/assets`);
    copyOptionally(`build/themes`, `staging/${doc}/themes`);
    copyOptionally(`node_modules/reveal.js/dist`, `staging/${doc}/revealjs/dist`);
    copyOptionally(`node_modules/reveal.js/plugin`, `staging/${doc}/revealjs/plugin`);
    copyOptionally(`node_modules/@highlightjs/cdn-assets`, `staging/${doc}/highlightjs`);
}

copyOptionally(`images`, `staging/images`); // TODO: check if we can use it, or use data-uris
presentations.forEach(doc => build(doc));
talks.forEach(doc => build(doc));
