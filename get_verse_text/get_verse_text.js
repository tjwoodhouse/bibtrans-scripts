#!/usr/bin/env node
const grammar = require('usfm-grammar');
const fs = require('fs');

const project = process.argv[2];
const pad = '0000';

var num = 0;

const BOOKS = new Map("GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV".split(' ').map(x => {
    if (x == 'MAT') {
        num = num + 1
    }
    num = num + 1;
    return [x, pad.concat(num).slice(-2) + x]
})); 

const to_lookup = {};
const toshow = [];
const to_find = process.argv[3];

for (let chunk of to_find.split(";")) {
    let book = chunk.trim().split(" ")[0];
    var chap = {}
    for (let cv of chunk.replace(book, "").split(',')){
        var [c, v] = cv.trim().split(":", 2);
        if (c in chap) {
            chap[c].push(v);
        } else {
            chap[c] = [v];
        }
    }
    if (book in to_lookup) {
      to_lookup[book] = { ...to_lookup[book], ...chap}  
    } else {
        to_lookup[book] = chap;
    } 
}

function get_book_data(project, book, book_data) {
    const ptpath = process.env.PTPROJ_PATH + project + '/' + BOOKS.get(book) + project + '.SFM';

    let cons = fs.readFileSync(ptpath, 'utf8');
    
    try {
        const parser = new grammar.USFMParser(cons, grammar.LEVEL.RELAXED);
        var jsonOutput = parser.toJSON(grammar.FILTER.SCRIPTURE);

        let data = jsonOutput["chapters"];
        for (let c in book_data) {
            var vs = book_data[c];
            for (let chapter of data) {
                if (chapter["chapterNumber"] == c) {
                    const verses = chapter['contents'];
                    for (let verseNum in verses) {
                        if (vs.includes(verses[verseNum]['verseNumber'])) {
                            let vtext = verses[verseNum]['verseText'];
                            let ostr = book + ' ' + c + ':' + verses[verseNum]['verseNumber'] + ': ' + vtext;
                            if (vtext.trim() !== "") {
                                console.log(ostr);
                            }
                            toshow.push(ostr);
                        }
                    }
                }
            }
        }
    } catch (err) {
        return err;
    }
}

const errors = [];

for (let book in to_lookup) {
    var error = get_book_data(project, book, to_lookup[book]);
    if (error) {
        errors.push([book, error]);
    }
}


if (errors.length > 0) {

    for ([b, error] of errors) {
        console.log(b);
        console.log(error);
    }
}
