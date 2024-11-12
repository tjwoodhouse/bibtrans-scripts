#!/usr/bin/env node
const grammar = require('usfm-grammar');
const fs = require('fs');

const project = process.argv[2];
const book = process.argv[3];
const cpt = process.argv[4];

const pad = '0000';

var num = 0;

const BOOKS_CODES = "GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV".split(' ')

const BOOKS = new Map("GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV".split(' ').map(x => {
    if (x == 'MAT') {
        num = num + 1
    }
    num = num + 1;
    return [x, pad.concat(num).slice(-2) + x]
})); 



function get_book_data(project, book, cpt) {
    
    const ptpath = process.env.PTPROJ_PATH  + project + '/' + BOOKS.get(book) + project + '.SFM';
    let cons = ''
    try {
        cons = fs.readFileSync(ptpath, 'utf8');
    } catch (err) {
        return null;
    }
     
    try {
        const parser = new grammar.USFMParser(cons, grammar.LEVEL.RELAXED);
        var jsonOutput = parser.toJSON(grammar.FILTER.SCRIPTURE);
        let data = jsonOutput["chapters"];
        for (let chapter of data) {
            if (parseInt(chapter['chapterNumber']) == cpt){
                const out = [];
                const verses = chapter['contents'];
                for (let verseNum in verses) {
                    let ostr = verses[verseNum]['verseText'];
                    out.push(`${parseInt(verseNum) + 1} ${ostr}`);
                }
                // join with ' to get a pause between verses,
                // replace / with OR to get OR read when alternatives are in the back transla tion
                // replace ; with '.' for sake of better reading in audio output
                console.log(out.join(" ' ").replace(/\//g, ' OR ').replace(/;/g, '.'));
            }
        }
    } catch (err) {
        console.log(err)
        return err;
    }
}

const errors = [];
//const project = 'PLM';

get_book_data(project, book, cpt);



